/**
 * Núcleo puro del plan de compensación (sin Firebase): fácil de probar.
 * Plan "10-3-2" (igual al motor de pagos de Vermilion): vendedor directo 10%,
 * padre 3% y abuelo 2%, planos sobre el valor cobrado. Todo porcentaje es editable
 * desde el admin (siteContent/affiliate). Lo que no tiene beneficiario en la
 * cadena cae al fundador (ROOT).
 */

export const AFFILIATES_COLLECTION = 'affiliates';
export const COMMISSIONS_COLLECTION = 'affiliate_commissions';
export const WITHDRAWALS_COLLECTION = 'affiliate_withdrawals';
export const CLICKS_COLLECTION = 'affiliateClicks';
export const USER_INDEX_COLLECTION = 'userIndex';
export const SETTINGS_PATH = ['siteContent', 'affiliate'] as const;

/** Usuario raíz: recibe las ventas orgánicas (sin enlace) y los bonos sin beneficiario. */
export const ROOT_USERNAME = 'pablofgarciaf';
export const ROOT_EMAIL = 'pablofgarciaf@gmail.com';
export const ROOT_NAME = 'Pablo Fabricio García Flores';

export interface AffiliateSettings {
  /** % que gana el vendedor directo (por defecto 10) */
  sellerRate: number;
  /** % del patrocinador directo (por defecto 3) */
  parentRate: number;
  /** % del patrocinador del patrocinador (por defecto 2) */
  grandparentRate: number;
  /** % de descuento al comprador que usa un enlace/código (por defecto 5) */
  customerDiscount: number;
  /** % de descuento ADICIONAL cuando el pago es por transferencia/depósito (por defecto 5) */
  transferDiscount: number;
  /** Días de vigencia del enlace (por defecto 30) */
  cookieDays: number;
  /** Retiro mínimo en USD (por defecto 50) */
  minWithdrawal: number;
}

export const DEFAULT_AFFILIATE_SETTINGS: AffiliateSettings = {
  sellerRate: 10,
  parentRate: 3,
  grandparentRate: 2,
  customerDiscount: 5,
  transferDiscount: 5,
  cookieDays: 30,
  minWithdrawal: 50,
};

export interface AffiliateAccount {
  id: string; // === username
  username: string;
  email: string;
  cedula: string;
  name: string;
  phone: string;
  referralCode: string; // === username
  parentId: string;
  granId: string;
  rama: string;
  rank: 'Standard' | 'Ejecutivo' | 'Premium' | 'Empresario';
  status: 'active' | 'suspended';
  totalEarnings: number;
  availableBalance: number;
  pendingBalance: number;
  salesCount: number;
  monthlyVolume: number;
  networkVolume: number;
  cumulativePersonalVolume: number;
  forcePasswordChange: boolean;
  authUid: string;
  createdAt: string;
}

export interface Payout {
  affiliateUsername: string;
  level: 0 | 1 | 2;
  percentage: number;
  amountUsd: number;
  role: string;
  /** Parte de la venta (USD) sobre la que se calculó esta comisión (cuenta para los topes). */
  eligibleVolume?: number;
  /** true = excedente por tope que se acredita al fundador (no cuenta para ningún tope). */
  overflow?: boolean;
}

/**
 * Topes del plan "10-3-2 limitada" de Vermilion, acumulados por cada descendiente:
 * - El padre cobra su 3% sobre las primeras ventas del hijo hasta `padreMaxSaleVolume`.
 * - El abuelo cobra su 2% sobre el primer `abueloTier1Volume` siempre, y hasta
 *   `abueloTier2Volume` en total si está activo (volumen personal >= `activeMinPersonalVolume`).
 * Lo que excede el tope pasa al fundador.
 */
export const CAPS = {
  padreMaxSaleVolume: 10000,
  abueloTier1Volume: 1000,
  abueloTier2Volume: 5000,
  activeMinPersonalVolume: 1000,
} as const;

/** Fondos globales mensuales (6% de las ventas de la empresa: 2% por piscina). */
export const GLOBAL_POOLS = [
  { key: 'pool1', name: 'Piscina Negocio', target: 3000, percent: 2 },
  { key: 'pool2', name: 'Piscina Líder', target: 7000, percent: 2 },
  { key: 'pool3', name: 'Piscina Premium', target: 15000, percent: 2 },
] as const;

/** Lo que ya se comisionó antes a padre/abuelo por ventas de ESTE vendedor. */
export interface PayoutHistory {
  parentVolume: number;
  grandVolume: number;
  /** El abuelo está activo (volumen personal acumulado >= activeMinPersonalVolume). */
  grandActive: boolean;
}

export const roundMoney = (n: number) => Math.round(n * 100) / 100;

export const normalizeUsername = (raw: string) =>
  raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9._-]/g, '')
    .slice(0, 24);

export const buildAffiliateLink = (username: string, base = 'https://www.modularesgm.com') =>
  `${base}/?vid=${username}`;

interface ChainLink {
  username: string;
  parentId?: string;
  granId?: string;
}

/**
 * Calcula los pagos de una venta. `seller` es el afiliado dueño del enlace, o el
 * ROOT si la venta fue orgánica. Padre/abuelo faltantes se pagan al ROOT.
 * Si un centavo no cuadra por redondeo, se ajusta en el vendedor.
 */
export function computePayouts(
  saleAmount: number,
  seller: ChainLink,
  settings: AffiliateSettings,
  history?: PayoutHistory
): Payout[] {
  const parent = seller.parentId && seller.parentId !== seller.username ? seller.parentId : ROOT_USERNAME;
  const grand = seller.granId && seller.granId !== seller.username ? seller.granId : ROOT_USERNAME;

  // Vendedor directo: siempre sobre toda la venta, sin tope.
  const rows: Payout[] = [
    {
      affiliateUsername: seller.username,
      level: 0,
      percentage: settings.sellerRate,
      amountUsd: roundMoney((saleAmount * settings.sellerRate) / 100),
      role: `Venta directa (${settings.sellerRate}%)`,
      eligibleVolume: saleAmount,
    },
  ];

  // Padre y abuelo: con tope por descendiente. Sin historial (o si el beneficiario es el
  // fundador) no hay tope. Lo que excede el tope se acredita al fundador.
  const upline = (
    level: 1 | 2,
    username: string,
    rate: number,
    label: string,
    cap: number | null,
    already: number
  ) => {
    const eligible = cap === null || username === ROOT_USERNAME ? saleAmount : Math.max(0, Math.min(saleAmount, cap - already));
    rows.push({
      affiliateUsername: username,
      level,
      percentage: rate,
      amountUsd: roundMoney((eligible * rate) / 100),
      role: `${label} (${rate}%)`,
      eligibleVolume: eligible,
    });
    const excess = saleAmount - eligible;
    if (excess > 0) {
      rows.push({
        affiliateUsername: ROOT_USERNAME,
        level,
        percentage: rate,
        amountUsd: roundMoney((excess * rate) / 100),
        role: `${label}: excedente de tope → fundador`,
        overflow: true,
      });
    }
  };

  const parentCap = history ? CAPS.padreMaxSaleVolume : null;
  const grandCap = history ? (history.grandActive ? CAPS.abueloTier2Volume : CAPS.abueloTier1Volume) : null;
  upline(1, parent, settings.parentRate, 'Bono padre', parentCap, history?.parentVolume ?? 0);
  upline(2, grand, settings.grandparentRate, 'Bono abuelo', grandCap, history?.grandVolume ?? 0);
  return rows;
}

/**
 * Descuentos y total de una compra:
 * - `hasCode`: descuento del enlace/código de afiliado (customerDiscount).
 * - transferencia/depósito: descuento ADICIONAL (transferDiscount), se suma al anterior.
 * Ambos se calculan sobre el subtotal.
 */
export function priceWithDiscount(
  subtotal: number,
  hasCode: boolean,
  settings: AffiliateSettings,
  paymentMethod?: string
) {
  const codeDiscountAmount = hasCode ? roundMoney((subtotal * settings.customerDiscount) / 100) : 0;
  const transferDiscountAmount =
    paymentMethod === 'transferencia' ? roundMoney((subtotal * settings.transferDiscount) / 100) : 0;
  const discountAmount = roundMoney(codeDiscountAmount + transferDiscountAmount);
  return {
    codeDiscountAmount,
    transferDiscountAmount,
    discountAmount,
    total: roundMoney(subtotal - discountAmount),
  };
}
