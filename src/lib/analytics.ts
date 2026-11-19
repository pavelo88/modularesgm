import { getStoredAttribution } from './traffic-source';

/**
 * Motor de Analítica y Medición de Conversiones de Modulares GM.
 * Envía eventos enriquecidos a:
 * 1. Google Analytics 4 (gtag)
 * 2. Meta Pixel (fbq)
 * 3. Contenedor dataLayer (Google Tag Manager)
 * 
 * Cada salida a WhatsApp o formulario adjunta automáticamente:
 * - Canal de origen (Instagram Ads, TikTok Orgánico, Facebook, Google Search, Directo)
 * - Parámetros UTM (source, medium, campaign, content, term)
 * - Ubicación del clic (hero, product_card, modal, concierge, footer, topbar)
 * - Producto o servicio de interés
 * - Dispositivo y página de aterrizaje
 */

export type EventName = 
  | 'whatsapp_click' 
  | 'generate_lead' 
  | 'sign_up' 
  | 'purchase' 
  | 'ai_chat_open'
  | 'outbound_whatsapp'
  | 'phone_call_click';

const META_EVENT: Record<EventName, string> = {
  whatsapp_click: 'Contact',
  outbound_whatsapp: 'Contact',
  generate_lead: 'Lead',
  sign_up: 'CompleteRegistration',
  purchase: 'Purchase',
  ai_chat_open: 'Contact',
  phone_call_click: 'Contact',
};

export type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(event: EventName, params: EventParams = {}) {
  if (typeof window === 'undefined') return;

  try {
    // 1. Obtener atribución de origen (Redes Sociales, UTMs, Referrer)
    const attribution = getStoredAttribution();

    // 2. Parámetros unificados enriquecidos
    const enriched: Record<string, unknown> = {
      ...params,
      traffic_channel: attribution.traffic_channel,
      traffic_source: attribution.traffic_source,
      traffic_medium: attribution.traffic_medium,
      traffic_campaign: attribution.traffic_campaign,
      traffic_content: attribution.traffic_content,
      traffic_term: attribution.traffic_term,
      referrer: attribution.referrer,
      click_id: attribution.click_id,
      has_utm: attribution.has_utm,
      landing_page: attribution.landing_page,
      device_type: attribution.device,
      page_path: window.location.pathname,
      page_title: document.title,
      timestamp: new Date().toISOString(),
    };

    // 3. Envío a Google Analytics 4 (gtag)
    if (typeof window.gtag === 'function') {
      window.gtag('event', event, enriched);

      // Si es salida a WhatsApp, enviar también el evento estándar recomendado 'generate_lead' para Google Ads
      if (event === 'whatsapp_click' || event === 'outbound_whatsapp') {
        const leadParams = {
          ...enriched,
          lead_type: 'whatsapp_direct',
          value: params.item_price || params.price || 0,
          currency: 'USD',
        };
        window.gtag('event', 'generate_lead', leadParams);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'generate_lead', ...leadParams });
      }
    }

    // 4. Envío a Meta Pixel (Facebook / Instagram Ads)
    if (typeof window.fbq === 'function') {
      const metaEventName = META_EVENT[event] || 'Contact';
      window.fbq('track', metaEventName, enriched);

      // Evento personalizado específico para audiencias personalizadas de WhatsApp
      if (event === 'whatsapp_click' || event === 'outbound_whatsapp') {
        window.fbq('trackCustom', 'WhatsAppLeadClick', enriched);
      }
    }

    // 5. Inyección en dataLayer para Google Tag Manager
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event,
      ...enriched,
    });

  } catch (err) {
    // La medición nunca debe interrumpir la navegación del usuario
    console.debug('[analytics] Error enviando evento:', err);
  }
}
