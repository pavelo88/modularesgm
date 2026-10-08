'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, BadgePercent, Facebook, Instagram, MapPin, MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import { useAffiliate } from '@/context/affiliate-provider';
import { SITE, formatPhone } from '@/lib/site';
import { CAMPAIGN } from '@/lib/campaign';
import { WhatsAppCta } from '@/components/shared/whatsapp-cta';

/** Barra de contacto: se desplaza con la página, así desaparece al hacer scroll. */
export function TopBar() {
  const { code, affiliateName, discountPercent, clearCode } = useAffiliate();
  // Se pinta igual en servidor y cliente; si la campaña ya venció, se oculta al montar.
  const [campaignOn, setCampaignOn] = useState(true);
  useEffect(() => setCampaignOn(Date.now() < Date.parse(CAMPAIGN.endsAt)), []);

  return (
    <div className="h-9 bg-[#0f1a21] text-white/90 text-xs relative z-[60]">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {code ? (
          <p className="flex items-center gap-2 font-medium truncate">
            <BadgePercent size={14} className="text-secondary shrink-0" />
            <span className="truncate">
              Código <strong className="tracking-wider">{code}</strong>
              {affiliateName ? ` de ${affiliateName.split(' ')[0]}` : ''} activo: {discountPercent}% de descuento
            </span>
            <button type="button" onClick={clearCode} aria-label="Quitar código" className="opacity-70 hover:opacity-100">
              <X size={13} />
            </button>
          </p>
        ) : campaignOn ? (
          <WhatsAppCta
            message={CAMPAIGN.whatsappMessage}
            location={`barra_${CAMPAIGN.id}`}
            className="group flex min-w-0 items-center gap-2 font-medium hover:text-secondary transition-colors"
          >
            <Sparkles size={14} className="text-secondary shrink-0" />
            <span className="truncate sm:hidden">{CAMPAIGN.mobile}</span>
            <span className="hidden truncate sm:inline">{CAMPAIGN.short}</span>
            <span className="hidden sm:inline-flex shrink-0 items-center gap-1 font-bold text-secondary">
              {CAMPAIGN.cta} <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </WhatsAppCta>
        ) : (
          <ul className="flex items-center gap-5">
            <li>
              <a href={`tel:${SITE.phoneIntl}`} className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                <Phone size={13} /> {formatPhone(SITE.phone)}
              </a>
            </li>
            <li className="hidden md:block">
              <a
                href={`https://wa.me/${SITE.phoneIntl.replace('+', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-secondary transition-colors"
              >
                <MessageCircle size={13} /> WhatsApp
              </a>
            </li>
            <li className="hidden lg:flex items-center gap-1.5">
              <MapPin size={13} /> {SITE.city}, Ecuador
            </li>
          </ul>
        )}
        <ul className="flex items-center gap-3 shrink-0">
          <li>
            <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-secondary transition-colors">
              <Facebook size={14} />
            </a>
          </li>
          <li>
            <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-secondary transition-colors">
              <Instagram size={14} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
