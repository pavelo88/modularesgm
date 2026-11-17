'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { initTrafficAttribution, getStoredAttribution } from '@/lib/traffic-source';
import { track } from '@/lib/analytics';

/**
 * Rastreador Global Universal de Salidas a WhatsApp y Atribución de Redes Sociales.
 * Se monta en el layout raíz y escucha todos los clics salientes hacia WhatsApp
 * en cualquier parte del DOM (incluso enlaces dinámicos o componentes futuros).
 */
export function WhatsAppAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Inicializar y almacenar la atribución de origen (UTMs, Instagram, TikTok, Facebook, Google)
    const attribution = initTrafficAttribution();

    // 2. Reportar a GA4 la fuente detectada como parámetro de usuario/sesión
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('set', 'user_properties', {
        traffic_channel: attribution.traffic_channel,
        traffic_source: attribution.traffic_source,
        traffic_medium: attribution.traffic_medium,
        traffic_campaign: attribution.traffic_campaign,
        device_type: attribution.device,
      });
    }

    // 3. Listener delegado global para interceptar cualquier clic hacia WhatsApp
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Buscar el enlace <a> más cercano
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) return;

      const href = anchor.href.toLowerCase();
      const isWhatsAppLink = 
        href.includes('wa.me') || 
        href.includes('api.whatsapp.com') || 
        href.includes('whatsapp.com/send');

      if (!isWhatsAppLink) return;

      // Determinar la ubicación del clic en la interfaz
      let location = anchor.getAttribute('data-location') || '';

      if (!location) {
        if (anchor.closest('[data-location]')) {
          location = anchor.closest('[data-location]')?.getAttribute('data-location') || '';
        } else if (anchor.closest('footer')) {
          location = 'footer';
        } else if (anchor.closest('header')) {
          location = 'header';
        } else if (anchor.closest('[role="region"][aria-label*="promociones"]') || anchor.closest('.announcement-ticker-track')) {
          location = 'top_bar';
        } else if (anchor.closest('#contacto') || anchor.closest('form')) {
          location = 'contact_section';
        } else if (anchor.closest('article') || anchor.closest('.product-card')) {
          location = 'product_card';
        } else if (anchor.closest('[role="dialog"]')) {
          location = 'quick_view_modal';
        } else if (anchor.closest('section[aria-label*="Garantías"]')) {
          location = 'trust_guarantee';
        } else if (anchor.closest('section[aria-label*="Campaña"]')) {
          location = 'campaign_showcase';
        } else {
          location = 'page_content';
        }
      }

      // Extraer mensaje predeterminado si existe
      let whatsappMessage = '';
      try {
        const urlObj = new URL(anchor.href);
        whatsappMessage = urlObj.searchParams.get('text') || '';
      } catch {}

      // Extraer datos del producto si el enlace está dentro de una tarjeta
      const card = anchor.closest('article');
      const itemTitle = card?.querySelector('h3')?.textContent?.trim() || '';

      // Disparar evento de conversión enriquecido
      track('whatsapp_click', {
        click_location: location,
        link_url: anchor.href,
        whatsapp_message_preview: whatsappMessage.slice(0, 80),
        item_name: itemTitle || undefined,
        button_text: anchor.innerText?.trim() || anchor.title || 'WhatsApp',
        page_path: pathname || window.location.pathname,
      });
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
    };
  }, [pathname]);

  return null;
}
