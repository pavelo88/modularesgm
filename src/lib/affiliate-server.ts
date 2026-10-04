import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from './firebase-admin';
import {
  AFFILIATES_COLLECTION,
  ALIASES_COLLECTION,
  CAPS,
  COMMISSIONS_COLLECTION,
  DEFAULT_AFFILIATE_SETTINGS,
  GLOBAL_POOLS,
  ROOT_USERNAME,
  computePayouts,
  normalizeUsername,
  roundMoney,
  type AffiliateSettings,
} from './affiliate-core';
import { defaultSiteContent } from './data';
import type { CartItem, Product } from './types';

/** Estados de pedido a partir de los cuales la venta se considera pagada y se acreditan comisiones. */
export const CREDIT_STATUSES = ['Pago Verificado', 'En proceso', 'Enviado', 'Completado'];

export async function getSettings(): Promise<AffiliateSettings> {
  const snap = await adminDb().doc('siteContent/affiliate').get();
  const data = (snap.data() || {}) as Partial<AffiliateSettings>;
  return { ...DEFAULT_AFFILIATE_SETTINGS, ...data };
}

export async function getAffiliate(username: string) {
  const snap = await adminDb().collection(AFFILIATES_COLLECTION).doc(username).get();
  return snap.exists ? (snap.data() as Record<string, any>) : null;
}

/** Catálogo real desde Firestore (nunca confiar en precios enviados por el navegador). */
async function loadCatalog(): Promise<Product[]> {
  const snap = await adminDb().doc('siteContent/main').get();
  const products = (snap.data()?.products as Product[] | undefined) || [];
  return products.length ? products : defaultSiteContent.products;
}

export async function priceCart(cart: CartItem[]) {
  const catalog = await loadCatalog();
  const items: CartItem[] = [];
  let subtotal = 0;
  for (const line of cart) {
    const product = catalog.find((p) => p.id === line.product.id);
    const qty = Math.min(Math.max(Math.floor(line.quantity), 1), 99);
    // Nunca se vende un producto sin precio (p. ej. los modelos del catálogo "a cotizar"),
    // aunque alguien arme la petición a mano: evitaría pedidos de $0.
    const unitPrice = product ? product.discountPrice || product.price : 0;
    if (!product || !(unitPrice > 0) || product.inStock === false) continue;
    items.push({ product, quantity: qty });
    subtotal += unitPrice * qty;
  }
  return { items, subtotal: roundMoney(subtotal) };
}

/** Valida un código de afiliado para una compra. Devuelve null si no aplica. */
export async function resolveAttribution(rawCode: string | undefined, buyerEmail: string) {
  const resolved = await resolveAffiliateCode(rawCode || '');
  if (!resolved || resolved.username === ROOT_USERNAME) return null;
  const { username, aff } = resolved;
  if (aff.status === 'suspended') return null;
  if (String(aff.email).toLowerCase() === buyerEmail.trim().toLowerCase()) return null; // sin autocompra
  return { username, name: String(aff.name || username) };
}

/**
 * Resuelve un código de afiliado. Si el afiliado cambió su usuario, el código viejo sigue
 * llevando a su perfil actual (así los enlaces ya compartidos no se rompen).
 */
export async function resolveAffiliateCode(rawCode: string) {
  const username = normalizeUsername(rawCode || '');
  if (!username) return null;
  let finalName = username;
  let aff = await getAffiliate(username);
  if (!aff) {
    const alias = await adminDb().collection(ALIASES_COLLECTION).doc(username).get();
    const target = alias.data()?.username as string | undefined;
    if (target) {
      finalName = target;
      aff = await getAffiliate(target);
    }
  }
  return aff ? { username: finalName, aff } : null;
}

/**
 * Volumen de ventas de `sellerUsername` ya comisionado a `beneficiary` en el nivel dado.
 * Solo filtros de igualdad (no requiere índice compuesto). Ignora comisiones revertidas.
 */
async function creditedVolume(beneficiary: string, level: 1 | 2, sellerUsername: string) {
  if (beneficiary === ROOT_USERNAME) return 0; // el fundador no tiene tope
  const snap = await adminDb()
    .collection(COMMISSIONS_COLLECTION)
    .where('affiliateUsername', '==', beneficiary)
    .where('level', '==', level)
    .where('sellerUsername', '==', sellerUsername)
    .where('status', '==', 'credited')
    .get();
  return roundMoney(
    snap.docs.reduce((sum, d) => {
      const c = d.data();
      return sum + (Number(c.volumeCredited ?? c.saleAmount) || 0);
    }, 0)
  );
}

/**
 * Acredita las comisiones de un pedido pagado. Idempotente por dos vías:
 * marca en el pedido y documentos de comisión con id determinístico (create falla si existe).
 */
export async function distributeCommissions(orderId: string) {
  const db = adminDb();
  const orderRef = db.collection('orders').doc(orderId);
  const orderSnap = await orderRef.get();
  if (!orderSnap.exists) throw new Error(`Pedido ${orderId} no existe`);
  const order = orderSnap.data() as Record<string, any>;
  if (order.commissionsCreditedAt && !order.commissionsReversedAt) return { skipped: true as const };

  const settings = await getSettings();
  const attributed = order.affiliateCode ? await getAffiliate(order.affiliateCode) : null;
  const seller = attributed
    ? { username: String(order.affiliateCode), parentId: attributed.parentId, granId: attributed.granId }
    : { username: ROOT_USERNAME, parentId: ROOT_USERNAME, granId: ROOT_USERNAME };

  // Si el pedido se revirtió antes, los ids nuevos evitan chocar con los documentos históricos.
  const idSuffix = order.commissionsReversedAt ? `_${Date.now()}` : '';
  const total = Number(order.total) || 0;

  // Historial para los topes: cuánto volumen de ESTE vendedor ya se comisionó a su padre/abuelo.
  // Si el vendedor es el fundador (venta orgánica) o no hay padre/abuelo reales, no hay tope.
  const parentName = seller.parentId && seller.parentId !== seller.username ? seller.parentId : ROOT_USERNAME;
  const grandName = seller.granId && seller.granId !== seller.username ? seller.granId : ROOT_USERNAME;
  const [parentVolume, grandVolume, grandAff] = await Promise.all([
    creditedVolume(parentName, 1, seller.username),
    creditedVolume(grandName, 2, seller.username),
    grandName === ROOT_USERNAME ? Promise.resolve(null) : getAffiliate(grandName),
  ]);
  const grandActive = Number(grandAff?.cumulativePersonalVolume || 0) >= CAPS.activeMinPersonalVolume;
  const payouts = computePayouts(total, seller, settings, { parentVolume, grandVolume, grandActive });
  const now = new Date().toISOString();
  const batch = db.batch();

  const perUser = new Map<string, number>();
  for (const p of payouts) {
    perUser.set(p.affiliateUsername, roundMoney((perUser.get(p.affiliateUsername) || 0) + p.amountUsd));
    batch.create(
      db.collection(COMMISSIONS_COLLECTION).doc(`${orderId}_L${p.level}${p.overflow ? 'x' : ''}${idSuffix}`),
      {
        orderId,
        saleAmount: total,
        sellerUsername: seller.username,
        volumeCredited: p.overflow ? 0 : (p.eligibleVolume ?? total),
        overflow: !!p.overflow,
        affiliateUsername: p.affiliateUsername,
        level: p.level,
        percentage: p.percentage,
        commissionAmount: p.amountUsd,
        role: p.role,
        customerFirstName: String(order.name || '').split(' ')[0],
        status: 'credited',
        createdAt: now,
      }
    );
  }
  for (const [username, amount] of perUser) {
    const isSeller = username === seller.username;
    batch.set(
      db.collection(AFFILIATES_COLLECTION).doc(username),
      {
        availableBalance: FieldValue.increment(amount),
        totalEarnings: FieldValue.increment(amount),
        networkVolume: FieldValue.increment(total),
        ...(isSeller && {
          salesCount: FieldValue.increment(1),
          monthlyVolume: FieldValue.increment(total),
          cumulativePersonalVolume: FieldValue.increment(total),
        }),
        updatedAt: now,
      },
      { merge: true }
    );
  }
  batch.update(orderRef, {
    commissionsCreditedAt: Date.now(),
    commissionsReversedAt: FieldValue.delete(),
    commissionBase: total,
  });
  await batch.commit();
  return { skipped: false as const, payouts };
}

/** Revierte comisiones acreditadas (pedido cancelado/devuelto). */
export async function reverseCommissions(orderId: string) {
  const db = adminDb();
  const orderRef = db.collection('orders').doc(orderId);
  const order = (await orderRef.get()).data() as Record<string, any> | undefined;
  if (!order?.commissionsCreditedAt || order.commissionsReversedAt) return { skipped: true as const };

  const snap = await db.collection(COMMISSIONS_COLLECTION).where('orderId', '==', orderId).get();
  const batch = db.batch();
  const perUser = new Map<string, number>();
  let sellerUsername = ROOT_USERNAME;
  snap.docs.forEach((d) => {
    const c = d.data();
    if (c.status !== 'credited') return;
    if (c.level === 0) sellerUsername = c.affiliateUsername;
    perUser.set(c.affiliateUsername, roundMoney((perUser.get(c.affiliateUsername) || 0) + c.commissionAmount));
    batch.update(d.ref, { status: 'reversed', reversedAt: new Date().toISOString() });
  });
  const total = Number(order.commissionBase) || 0;
  for (const [username, amount] of perUser) {
    const isSeller = username === sellerUsername;
    batch.set(
      db.collection(AFFILIATES_COLLECTION).doc(username),
      {
        availableBalance: FieldValue.increment(-amount),
        totalEarnings: FieldValue.increment(-amount),
        networkVolume: FieldValue.increment(-total),
        ...(isSeller && {
          salesCount: FieldValue.increment(-1),
          monthlyVolume: FieldValue.increment(-total),
          cumulativePersonalVolume: FieldValue.increment(-total),
        }),
      },
      { merge: true }
    );
  }
  batch.update(orderRef, { commissionsReversedAt: Date.now() });
  await batch.commit();
  return { skipped: false as const };
}

/** Cambia el estado de un pedido y sincroniza comisiones. */
export async function applyOrderStatus(orderId: string, status: string) {
  await adminDb().collection('orders').doc(orderId).update({ status });
  if (CREDIT_STATUSES.includes(status)) await distributeCommissions(orderId);
  else if (status === 'Cancelado') await reverseCommissions(orderId);
}

// ─────────────────────────────────────────────────────────────────────────────
// Fondos globales mensuales (6% de las ventas de la empresa: 2% por piscina)
// ─────────────────────────────────────────────────────────────────────────────

export const POOL_RUNS_COLLECTION = 'affiliate_pool_runs';

export interface PoolPayoutRow {
  pool: string;
  poolName: string;
  username: string;
  shares: number;
  amountUsd: number;
  note?: string;
}

export interface PoolPlan {
  month: string; // YYYY-MM
  totalSales: number;
  budgets: { pool: string; poolName: string; target: number; budgetUsd: number; totalShares: number }[];
  rows: PoolPayoutRow[];
  alreadyRun: boolean;
}

/** Calcula (sin escribir) cómo se repartirían los fondos globales de un mes. */
export async function planGlobalPools(month: string): Promise<PoolPlan> {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw new Error('Mes inválido (usa AAAA-MM).');
  const db = adminDb();
  const [y, m] = month.split('-').map(Number);
  const start = new Date(Date.UTC(y, m - 1, 1)).toISOString();
  const end = new Date(Date.UTC(y, m, 1)).toISOString();

  const alreadyRun = (await db.collection(POOL_RUNS_COLLECTION).doc(month).get()).exists;

  // Solo filtro de rango por fecha (índice simple); el resto se filtra en memoria.
  const snap = await db.collection(COMMISSIONS_COLLECTION).where('createdAt', '>=', start).where('createdAt', '<', end).get();

  let totalSales = 0;
  const personal = new Map<string, number>();
  const network = new Map<string, number>();
  for (const d of snap.docs) {
    const c = d.data();
    if (c.status !== 'credited' || c.kind === 'pool' || c.overflow) continue;
    const sale = Number(c.saleAmount) || 0;
    if (c.level === 0) {
      totalSales += sale; // un documento de nivel 0 por pedido
      personal.set(c.affiliateUsername, (personal.get(c.affiliateUsername) || 0) + sale);
    } else if (c.level === 1 || c.level === 2) {
      network.set(c.affiliateUsername, (network.get(c.affiliateUsername) || 0) + sale);
    }
  }
  totalSales = roundMoney(totalSales);

  const affSnap = await db.collection(AFFILIATES_COLLECTION).get();
  const eligible = new Set(affSnap.docs.filter((a) => a.data().status !== 'suspended').map((a) => a.id));
  const volume = (u: string) => (personal.get(u) || 0) + (network.get(u) || 0);

  const rows: PoolPayoutRow[] = [];
  const budgets: PoolPlan['budgets'] = [];
  for (const pool of GLOBAL_POOLS) {
    const budgetUsd = roundMoney((totalSales * pool.percent) / 100);
    const qualified = [...eligible]
      .map((u) => ({ username: u, shares: Math.floor(volume(u) / pool.target) }))
      .filter((q) => q.shares > 0)
      .sort((a, b) => a.username.localeCompare(b.username));
    const totalShares = qualified.reduce((s, q) => s + q.shares, 0);
    budgets.push({ pool: pool.key, poolName: pool.name, target: pool.target, budgetUsd, totalShares });
    if (budgetUsd <= 0) continue;

    if (totalShares === 0) {
      // Nadie califica: el fondo completo pasa al fundador.
      rows.push({ pool: pool.key, poolName: pool.name, username: ROOT_USERNAME, shares: 0, amountUsd: budgetUsd, note: 'Sin calificados → fundador' });
      continue;
    }
    let paid = 0;
    qualified.forEach((q, i) => {
      // El último recibe el resto para que la suma sea exacta al centavo.
      const amountUsd = i === qualified.length - 1 ? roundMoney(budgetUsd - paid) : roundMoney((budgetUsd * q.shares) / totalShares);
      paid = roundMoney(paid + amountUsd);
      rows.push({ pool: pool.key, poolName: pool.name, username: q.username, shares: q.shares, amountUsd });
    });
  }
  return { month, totalSales, budgets, rows, alreadyRun };
}

/** Paga los fondos globales de un mes. No se puede ejecutar dos veces el mismo mes. */
export async function applyGlobalPools(month: string) {
  const plan = await planGlobalPools(month);
  if (plan.alreadyRun) return { success: false as const, error: `Los fondos de ${month} ya se distribuyeron.`, plan };
  if (plan.rows.length === 0) return { success: false as const, error: `No hubo ventas acreditadas en ${month}.`, plan };

  const db = adminDb();
  const now = new Date().toISOString();
  const perUser = new Map<string, number>();
  const ops: Array<(b: FirebaseFirestore.WriteBatch) => void> = [];

  for (const r of plan.rows) {
    perUser.set(r.username, roundMoney((perUser.get(r.username) || 0) + r.amountUsd));
    ops.push((b) =>
      b.create(db.collection(COMMISSIONS_COLLECTION).doc(`pool_${month}_${r.pool}_${r.username}`), {
        kind: 'pool',
        month,
        orderId: '',
        saleAmount: plan.totalSales,
        volumeCredited: 0,
        affiliateUsername: r.username,
        level: 3,
        percentage: 2,
        commissionAmount: r.amountUsd,
        role: `Fondo global ${month} · ${r.poolName}${r.shares ? ` (${r.shares} acc.)` : ''}`,
        customerFirstName: '',
        status: 'credited',
        createdAt: now,
      })
    );
  }
  for (const [username, amount] of perUser) {
    ops.push((b) =>
      b.set(
        db.collection(AFFILIATES_COLLECTION).doc(username),
        { availableBalance: FieldValue.increment(amount), totalEarnings: FieldValue.increment(amount), updatedAt: now },
        { merge: true }
      )
    );
  }
  // La marca del mes va al final: si algo falla antes, los ids determinísticos evitan pagar doble al reintentar.
  ops.push((b) =>
    b.create(db.collection(POOL_RUNS_COLLECTION).doc(month), {
      month,
      totalSales: plan.totalSales,
      totalPaid: roundMoney(plan.rows.reduce((s, r) => s + r.amountUsd, 0)),
      createdAt: now,
    })
  );

  for (let i = 0; i < ops.length; i += 400) {
    const batch = db.batch();
    ops.slice(i, i + 400).forEach((op) => op(batch));
    await batch.commit();
  }
  return { success: true as const, plan };
}
