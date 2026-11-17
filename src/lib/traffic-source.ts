'use client';

/**
 * Módulo de Atribución de Tráfico para Modulares GM.
 * Detecta y preserva el origen del visitante (Redes Sociales, Campañas UTM, Buscadores)
 * a lo largo de toda su sesión de navegación para atribuir con exactitud
 * cada salida hacia WhatsApp a su fuente real (Instagram, TikTok, Facebook, Google, etc.).
 */

export interface TrafficAttribution {
  traffic_channel: string;
  traffic_source: string;
  traffic_medium: string;
  traffic_campaign: string;
  traffic_content: string;
  traffic_term: string;
  landing_page: string;
  referrer: string;
  device: 'mobile' | 'tablet' | 'desktop';
  has_utm: boolean;
  click_id?: string; // fbclid, gclid, ttclid
}

const STORAGE_KEY = 'gm_traffic_attribution_v1';

function detectDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

function parseChannel(source: string, medium: string, referrer: string): { channel: string; defaultSource: string } {
  const s = source.toLowerCase();
  const m = medium.toLowerCase();
  const r = referrer.toLowerCase();

  // 1. Pauta Pagada (Paid Social / Paid Search)
  if (m === 'cpc' || m === 'cpm' || m === 'paid' || m === 'paidsocial' || m === 'ads') {
    if (s.includes('fb') || s.includes('facebook') || s.includes('meta')) return { channel: 'Facebook Ads', defaultSource: 'facebook' };
    if (s.includes('ig') || s.includes('instagram')) return { channel: 'Instagram Ads', defaultSource: 'instagram' };
    if (s.includes('tiktok')) return { channel: 'TikTok Ads', defaultSource: 'tiktok' };
    if (s.includes('google')) return { channel: 'Google Ads', defaultSource: 'google' };
    return { channel: `Pauta (${s || m})`, defaultSource: s || 'paid' };
  }

  // 2. UTMs Orgánicos
  if (s.includes('instagram')) return { channel: 'Instagram Orgánico', defaultSource: 'instagram' };
  if (s.includes('facebook')) return { channel: 'Facebook Orgánico', defaultSource: 'facebook' };
  if (s.includes('tiktok')) return { channel: 'TikTok Orgánico', defaultSource: 'tiktok' };
  if (s.includes('whatsapp')) return { channel: 'WhatsApp Compartido', defaultSource: 'whatsapp' };
  if (s.includes('google')) return { channel: 'Google Orgánico', defaultSource: 'google' };

  // 3. Referrer directo del navegador (sin UTMs)
  if (r.includes('instagram.com') || r.includes('l.instagram.com')) return { channel: 'Instagram (Redes)', defaultSource: 'instagram' };
  if (r.includes('facebook.com') || r.includes('lm.facebook.com') || r.includes('m.facebook.com') || r.includes('fb.me')) {
    return { channel: 'Facebook (Redes)', defaultSource: 'facebook' };
  }
  if (r.includes('tiktok.com')) return { channel: 'TikTok (Redes)', defaultSource: 'tiktok' };
  if (r.includes('google.com') || r.includes('google.com.ec')) return { channel: 'Google Search (Orgánico)', defaultSource: 'google' };
  if (r.includes('bing.com')) return { channel: 'Bing Search', defaultSource: 'bing' };
  if (r.includes('whatsapp.com')) return { channel: 'WhatsApp Referrer', defaultSource: 'whatsapp' };

  if (!r) return { channel: 'Directo / Navegador', defaultSource: 'direct' };

  try {
    const host = new URL(r).hostname.replace('www.', '');
    return { channel: `Referido (${host})`, defaultSource: host };
  } catch {
    return { channel: 'Referido Externo', defaultSource: 'referral' };
  }
}

/**
 * Inicializa y captura el origen del visitante al entrar al sitio.
 * Se debe ejecutar una vez al montar el layout en el cliente.
 */
export function initTrafficAttribution(): TrafficAttribution {
  if (typeof window === 'undefined') {
    return {
      traffic_channel: 'Directo',
      traffic_source: 'direct',
      traffic_medium: 'none',
      traffic_campaign: 'none',
      traffic_content: 'none',
      traffic_term: 'none',
      landing_page: '/',
      referrer: '',
      device: 'desktop',
      has_utm: false,
    };
  }

  try {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    const searchParams = new URLSearchParams(window.location.search);
    const hasUtmParams = Boolean(
      searchParams.get('utm_source') ||
      searchParams.get('utm_campaign') ||
      searchParams.get('utm_medium') ||
      searchParams.get('fbclid') ||
      searchParams.get('gclid') ||
      searchParams.get('ttclid')
    );

    // Si ya existe sesión y el usuario no entró con nuevos UTMs explícitos en esta URL, usamos la atribución previa
    if (cached && !hasUtmParams) {
      return JSON.parse(cached) as TrafficAttribution;
    }

    const rawSource = searchParams.get('utm_source') || '';
    const rawMedium = searchParams.get('utm_medium') || '';
    const rawCampaign = searchParams.get('utm_campaign') || '';
    const rawContent = searchParams.get('utm_content') || '';
    const rawTerm = searchParams.get('utm_term') || '';
    const ref = document.referrer || '';
    
    // Captura de IDs de clics publicitarios (Meta, Google, TikTok)
    const clickId = searchParams.get('fbclid') || searchParams.get('gclid') || searchParams.get('ttclid') || undefined;

    const { channel, defaultSource } = parseChannel(rawSource, rawMedium, ref);

    const attribution: TrafficAttribution = {
      traffic_channel: channel,
      traffic_source: rawSource || defaultSource,
      traffic_medium: rawMedium || (clickId ? 'cpc' : 'none'),
      traffic_campaign: rawCampaign || (clickId ? 'auto_tag' : 'none'),
      traffic_content: rawContent || 'none',
      traffic_term: rawTerm || 'none',
      landing_page: window.location.pathname + window.location.search,
      referrer: ref,
      device: detectDevice(),
      has_utm: hasUtmParams,
      click_id: clickId,
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch (err) {
    console.warn('[traffic-attribution] Error inicializando:', err);
    return {
      traffic_channel: 'Directo',
      traffic_source: 'direct',
      traffic_medium: 'none',
      traffic_campaign: 'none',
      traffic_content: 'none',
      traffic_term: 'none',
      landing_page: window.location.pathname,
      referrer: document.referrer || '',
      device: detectDevice(),
      has_utm: false,
    };
  }
}

/**
 * Obtiene los datos de atribución guardados de la sesión activa
 */
export function getStoredAttribution(): TrafficAttribution {
  if (typeof window === 'undefined') {
    return {
      traffic_channel: 'Directo',
      traffic_source: 'direct',
      traffic_medium: 'none',
      traffic_campaign: 'none',
      traffic_content: 'none',
      traffic_term: 'none',
      landing_page: '/',
      referrer: '',
      device: 'desktop',
      has_utm: false,
    };
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  return initTrafficAttribution();
}
