import { createSign } from 'node:crypto';

/**
 * Reporte de Google Analytics 4 para el panel admin, con la API oficial y gratuita
 * (Google Analytics Data API). Usa la misma cuenta de servicio que Firebase Admin:
 * GA_SERVICE_ACCOUNT_JSON si existe, si no FIREBASE_SERVICE_ACCOUNT_JSON.
 *
 * Para que funcione, en Google Cloud debe estar activa la "Google Analytics Data API"
 * y el correo de la cuenta de servicio debe ser Lector de la propiedad GA4.
 */

/** Propiedad GA4 «modulares-gm-app». */
const PROPERTY_ID = process.env.GA4_PROPERTY_ID || '527476693';
const API = 'https://analyticsdata.googleapis.com/v1beta';

export const CONVERSION_EVENTS = ['whatsapp_click', 'generate_lead', 'sign_up', 'purchase'] as const;
type ConversionEvent = (typeof CONVERSION_EVENTS)[number];

export type AnalyticsDays = 7 | 28 | 90;

export interface AnalyticsReport {
  ok: true;
  days: AnalyticsDays;
  totals: { users: number; sessions: number; views: number };
  /** Un punto por día del periodo, con 0 en los días sin visitas. Fecha ISO (AAAA-MM-DD). */
  daily: { date: string; users: number }[];
  channels: { name: string; sessions: number }[];
  pages: { path: string; views: number }[];
  cities: { name: string; users: number }[];
  events: Record<ConversionEvent, number>;
}

export interface AnalyticsSetupError {
  ok: false;
  reason: 'no_credentials' | 'api_disabled' | 'permission' | 'other';
  message: string;
  /** Correo que hay que agregar como Lector en GA4 (no es secreto). */
  serviceAccount?: string;
  /** Enlace para activar la API en el proyecto de Google Cloud de la cuenta de servicio. */
  enableApiUrl?: string;
  propertyId: string;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id?: string;
}

function readServiceAccount(): ServiceAccount | null {
  const raw = process.env.GA_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.client_email && parsed.private_key ? parsed : null;
  } catch {
    return null;
  }
}

const base64url = (input: string | Buffer) => Buffer.from(input).toString('base64url');

/** JWT firmado con la llave de la cuenta de servicio (flujo OAuth "jwt-bearer" de Google). */
export function buildAssertion(sa: ServiceAccount, nowSeconds = Math.floor(Date.now() / 1000)) {
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      iat: nowSeconds,
      exp: nowSeconds + 3600,
    })
  );
  const signature = createSign('RSA-SHA256').update(`${header}.${claims}`).sign(sa.private_key);
  return `${header}.${claims}.${base64url(signature)}`;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getAccessToken(sa: ServiceAccount) {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: buildAssertion(sa),
    }),
  });
  const data = await res.json();
  if (!res.ok || !data.access_token) throw new Error(`token: ${data.error_description || data.error || res.status}`);
  cachedToken = { value: data.access_token, expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return cachedToken.value;
}

/** Traduce los grupos de canal predeterminados de GA4. */
const CHANNEL_ES: Record<string, string> = {
  Direct: 'Directo',
  'Organic Search': 'Google (orgánico)',
  'Organic Social': 'Redes sociales',
  'Paid Social': 'Redes sociales (pagado)',
  'Paid Search': 'Google Ads',
  Referral: 'Otros sitios',
  Email: 'Correo',
  'Organic Video': 'Video',
  'Organic Shopping': 'Shopping',
  Unassigned: 'Sin asignar',
};

type Row = { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] };
type Report = { rows?: Row[]; totals?: Row[] };

const num = (v?: string) => Number(v ?? 0) || 0;
const dim = (r: Row, i = 0) => r.dimensionValues?.[i]?.value ?? '';
const met = (r: Row, i = 0) => num(r.metricValues?.[i]?.value);

/** Zona horaria de la propiedad GA4 (GA agrupa los días según esta zona). */
const PROPERTY_TZ = process.env.GA4_TIMEZONE || 'America/Guayaquil';

/** Fechas AAAA-MM-DD de los últimos `days` días, incluido hoy en la zona horaria de la propiedad. */
export function dateSeries(days: number, now = new Date()) {
  const [y, m, d] = now.toLocaleDateString('en-CA', { timeZone: PROPERTY_TZ }).split('-').map(Number);
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(Date.UTC(y, m - 1, d - i)).toISOString().slice(0, 10));
  }
  return out;
}

export function parseReports(reports: Report[], days: AnalyticsDays, today = new Date()): AnalyticsReport {
  const [byDate, byChannel, byPage, byEvent, byCity] = reports;
  const totalRow = byDate?.totals?.[0];

  const usersByDay = new Map(
    (byDate?.rows ?? []).map((r) => {
      const v = dim(r); // AAAAMMDD
      return [`${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}`, met(r, 0)];
    })
  );

  const events = Object.fromEntries(CONVERSION_EVENTS.map((e) => [e, 0])) as Record<ConversionEvent, number>;
  for (const r of byEvent?.rows ?? []) {
    const name = dim(r) as ConversionEvent;
    if (name in events) events[name] = met(r);
  }

  return {
    ok: true,
    days,
    totals: {
      users: totalRow ? met(totalRow, 0) : 0,
      sessions: totalRow ? met(totalRow, 1) : 0,
      views: totalRow ? met(totalRow, 2) : 0,
    },
    daily: dateSeries(days, today).map((date) => ({ date, users: usersByDay.get(date) ?? 0 })),
    channels: (byChannel?.rows ?? []).map((r) => ({ name: CHANNEL_ES[dim(r)] ?? dim(r), sessions: met(r) })),
    pages: (byPage?.rows ?? []).map((r) => ({ path: dim(r), views: met(r) })),
    cities: (byCity?.rows ?? [])
      .filter((r) => dim(r) && dim(r) !== '(not set)')
      .map((r) => ({ name: dim(r), users: met(r) })),
    events,
  };
}

/** Convierte una respuesta de error de Google en pasos que el usuario puede seguir. */
export function classifyError(status: number, body: any, sa: ServiceAccount): AnalyticsSetupError {
  const message: string = body?.error?.message || `Error ${status}`;
  const enableApiUrl = `https://console.cloud.google.com/apis/library/analyticsdata.googleapis.com${sa.project_id ? `?project=${sa.project_id}` : ''}`;
  const reasons: string[] = (body?.error?.details ?? []).map((d: any) => d?.reason).filter(Boolean);
  let reason: AnalyticsSetupError['reason'] = 'other';
  if (reasons.includes('SERVICE_DISABLED') || /has not been used|is disabled/i.test(message)) reason = 'api_disabled';
  else if (status === 403) reason = 'permission';
  return { ok: false, reason, message, serviceAccount: sa.client_email, enableApiUrl, propertyId: PROPERTY_ID };
}

export async function fetchAnalyticsReport(days: AnalyticsDays): Promise<AnalyticsReport | AnalyticsSetupError> {
  const sa = readServiceAccount();
  if (!sa) {
    return {
      ok: false,
      reason: 'no_credentials',
      message: 'No hay cuenta de servicio configurada (FIREBASE_SERVICE_ACCOUNT_JSON).',
      propertyId: PROPERTY_ID,
    };
  }

  const dateRanges = [{ startDate: `${days - 1}daysAgo`, endDate: 'today' }];
  const top = (dimension: string, metric: string) => ({
    dateRanges,
    dimensions: [{ name: dimension }],
    metrics: [{ name: metric }],
    orderBys: [{ metric: { metricName: metric }, desc: true }],
    limit: 8,
  });
  const requests = [
    {
      dateRanges,
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }, { name: 'screenPageViews' }],
      metricAggregations: ['TOTAL'],
      orderBys: [{ dimension: { dimensionName: 'date' } }],
    },
    top('sessionDefaultChannelGroup', 'sessions'),
    top('pagePath', 'screenPageViews'),
    {
      dateRanges,
      dimensions: [{ name: 'eventName' }],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: { filter: { fieldName: 'eventName', inListFilter: { values: [...CONVERSION_EVENTS] } } },
    },
    top('city', 'activeUsers'),
  ];

  try {
    const token = await getAccessToken(sa);
    const res = await fetch(`${API}/properties/${PROPERTY_ID}:batchRunReports`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requests }),
      cache: 'no-store',
    });
    const body = await res.json();
    if (!res.ok) return classifyError(res.status, body, sa);
    return parseReports(body.reports ?? [], days);
  } catch (err: any) {
    return {
      ok: false,
      reason: 'other',
      message: String(err?.message || err),
      serviceAccount: sa.client_email,
      propertyId: PROPERTY_ID,
    };
  }
}
