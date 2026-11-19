'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'modularesgm_consent_v1';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function updateConsent(granted: boolean) {
  window.dataLayer = window.dataLayer || [];
  window.gtag?.('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
    analytics_storage: granted ? 'granted' : 'denied',
  });
  window.dataLayer.push({ event: granted ? 'cookie_consent_accepted' : 'cookie_consent_rejected' });
}

function loadMetaPixel(pixelId: string) {
  if (!pixelId || document.getElementById('meta-pixel-script')) return;
  const script = document.createElement('script');
  script.id = 'meta-pixel-script';
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  script.onload = () => {
    window.fbq = window.fbq || ((...args: unknown[]) => {
      (window.fbq as unknown as { queue?: unknown[] }).queue ??= [];
      (window.fbq as unknown as { queue: unknown[] }).queue.push(args);
    });
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  };
  document.head.appendChild(script);
}

export function ConsentManager() {
  const [visible, setVisible] = useState(false);
  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'accepted' || saved === 'rejected') {
      updateConsent(saved === 'accepted');
      if (saved === 'accepted' && metaPixelId) loadMetaPixel(metaPixelId);
    } else {
      setVisible(true);
    }
  }, [metaPixelId]);

  const choose = (granted: boolean) => {
    window.localStorage.setItem(STORAGE_KEY, granted ? 'accepted' : 'rejected');
    updateConsent(granted);
    if (granted && metaPixelId) loadMetaPixel(metaPixelId);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside className="fixed inset-x-0 bottom-0 z-[100] border-t border-stone-700 bg-stone-950/95 p-4 text-white shadow-2xl backdrop-blur-md" aria-label="Preferencias de cookies">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-stone-200 sm:max-w-3xl">
          Usamos cookies analíticas y publicitarias para medir solicitudes y mejorar nuestras campañas. Puedes aceptar o rechazar las cookies opcionales.
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => choose(false)} className="rounded-full border border-stone-500 px-4 py-2 text-xs font-semibold hover:bg-white/10">Rechazar</button>
          <button type="button" onClick={() => choose(true)} className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-bold text-stone-950 hover:bg-emerald-400">Aceptar</button>
        </div>
      </div>
    </aside>
  );
}
