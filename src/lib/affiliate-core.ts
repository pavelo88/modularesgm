/**
 * Núcleo puro del plan de compensación (sin Firebase): fácil de probar.
 * Plan "8-2-1": vendedor directo, padre y abuelo. Todo porcentaje es editable
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
  /** % que gana el vendedor directo (por defecto 8) */
  sellerRate: number;
  /** % del patrocinador directo (por defecto 2) */
  parentRate: number;
  /** % del patrocinador del patrocinador (por defecto 1) */
  grandparentRate: number;
  /** % de descuento al comprador que usa un enlace/código (por defecto 5) */
  customerDiscount: number;
  /** Días de vigencia del enlace (por defecto 30) */
  cookieDays: number;
  /** Retiro mínimo en USD (por defecto 50) */
  minWithdrawal: number;
}

export const DEFAULT_AFFILIATE_SETTINGS: AffiliateSettings = {
  sellerRate: 8,
  parentRate: 2,
  grandparentRate: 1,
  customerDiscount: 5,
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
  settings: AffiliateSettings
): Payout[] {
  const parent = seller.parentId && seller.parentId !== seller.username ? seller.parentId : ROOT_USERNAME;
  const grand = seller.granId && seller.granId !== seller.username ? seller.granId : ROOT_USERNAME;

  const rows: Payout[] = [
    { affiliateUsername: seller.username, level: 0, percentage: settings.sellerRate, amountUsd: 0, role: `Venta directa (${settings.sellerRate}%)` },
    { affiliateUsername: parent, level: 1, percentage: settings.parentRate, amountUsd: 0, role: `Bono padre (${settings.parentRate}%)` },
    { affiliateUsername: grand, level: 2, percentage: settings.grandparentRate, amountUsd: 0, role: `Bono abuelo (${settings.grandparentRate}%)` },
  ];
  return rows.map((r) => ({ ...r, amountUsd: roundMoney((saleAmount * r.percentage) / 100) }));
}

/** Descuento y total de una compra según el código aplicado. */
export function priceWithDiscount(subtotal: number, hasCode: boolean, settings: AffiliateSettings) {
  const discountAmount = hasCode ? roundMoney((subtotal * settings.customerDiscount) / 100) : 0;
  return { discountAmount, total: roundMoney(subtotal - discountAmount) };
}
