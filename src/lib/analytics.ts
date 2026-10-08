/**
 * Eventos de conversión. Se envían a GA4 (gtag) y al Píxel de Meta (fbq) solo si están cargados,
 * así que llamar a `track` nunca rompe nada aunque falten los IDs en el entorno.
 *
 * Eventos usados en el sitio:
 * - whatsapp_click  → clic en cualquier botón de WhatsApp (Meta: Contact)
 * - generate_lead   → formulario de cotización enviado (Meta: Lead)
 * - sign_up         → nuevo afiliado registrado (Meta: CompleteRegistration)
 * - purchase        → pedido confirmado en la tienda (Meta: Purchase)
 */
type EventName = 'whatsapp_click' | 'generate_lead' | 'sign_up' | 'purchase';

const META_EVENT: Record<EventName, string> = {
  whatsapp_click: 'Contact',
  generate_lead: 'Lead',
  sign_up: 'CompleteRegistration',
  purchase: 'Purchase',
};

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: EventName, params: Params = {}) {
  if (typeof window === 'undefined') return;
  try {
    window.gtag?.('event', event, params);
    window.fbq?.('track', META_EVENT[event], params);
  } catch {
    // La medición nunca debe interrumpir al usuario.
  }
}
