'use client';

import { useContext } from 'react';
import { SiteContentContext } from '@/context/site-content-provider';
import { SITE, whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';

/** Enlace a WhatsApp con mensaje inicial y evento de conversión. Usa el número del CMS si está disponible. */
export function WhatsAppCta({
  message,
  location,
  className,
  children,
}: {
  message: string;
  location: string;
  className?: string;
  children: React.ReactNode;
}) {
  const phone = useContext(SiteContentContext)?.siteContent?.whatsappNumber || SITE.phone;
  return (
    <a
      href={whatsappHref(phone, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track('whatsapp_click', { location })}
      className={className}
    >
      {children}
    </a>
  );
}
