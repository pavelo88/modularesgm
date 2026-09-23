import { FieldValue } from 'firebase-admin/firestore';
import { adminDb } from './firebase-admin';
import {
  AFFILIATES_COLLECTION,
  COMMISSIONS_COLLECTION,
  DEFAULT_AFFILIATE_SETTINGS,
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
    if (!product) continue;
    items.push({ product, quantity: qty });
    subtotal += (product.discountPrice || product.price) * qty;
  }
  return { items, subtotal: roundMoney(subtotal) };
}

/** Valida un código de afiliado para una compra. Devuelve null si no aplica. */
export async function resolveAttribution(rawCode: string | undefined, buyerEmail: string) {
  const username = normalizeUsername(rawCode || '');
  if (!username || username === ROOT_USERNAME) return null;
  const aff = await getAffiliate(username);
  if (!aff || aff.status === 'suspended') return null;
  if (String(aff.email).toLowerCase() === buyerEmail.trim().toLowerCase()) return null; // sin autocompra
  return { username, name: String(aff.name || username) };
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
  const payouts = computePayouts(total, seller, settings);
  const now = new Date().toISOString();
  const batch = db.batch();

  const perUser = new Map<string, number>();
  for (const p of payouts) {
    perUser.set(p.affiliateUsername, roundMoney((perUser.get(p.affiliateUsername) || 0) + p.amountUsd));
    batch.create(db.collection(COMMISSIONS_COLLECTION).doc(`${orderId}_L${p.level}${idSuffix}`), {
      orderId,
      saleAmount: total,
      affiliateUsername: p.affiliateUsername,
      level: p.level,
      percentage: p.percentage,
      commissionAmount: p.amountUsd,
      role: p.role,
      customerFirstName: String(order.name || '').split(' ')[0],
      status: 'credited',
      createdAt: now,
    });
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
