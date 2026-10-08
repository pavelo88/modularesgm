'use client';

import Link from 'next/link';
import { BadgePercent, Facebook, Instagram, MessageCircle, Phone, Sparkles, X } from 'lucide-react';
import { useAffiliate } from '@/context/affiliate-provider';
import { SITE, formatPhone } from '@/lib/site';

const TICKER_MESSAGES = [
  {
    id: 'referral',
    text: '🎉 5% de descuento en tus compras si alguien te recomendó la web',
    href: '/afiliados',
  },
  {
    id: 'cash',
    text: '💵 5% de descuento por pagos en efectivo',
    href: '/store',
  },
  {
    id: 'register',
    text: '✨ 5% de descuento inmediato al registrarte en nuestra plataforma',
    href: '/store',
  },
  {
    id: 'pros',
    text: '🤝 ¿Eres instalador o arquitecto? Visita Trabaja con nosotros',
    href: '/afiliados',
    highlight: true,
  },
];

export function TopBar() {
  const { code, affiliateName, discountPercent, clearCode } = useAffiliate();

  return (
    <div
      role="region"
      aria-label="Cinta de promociones y anuncios arquitectónicos"
      className="h-9 bg-[#111316] text-stone-200 border-b border-stone-800/60 text-[11px] sm:text-xs relative z-[60] select-none overflow-hidden"
    >
      <div className="max-w-7xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-3">
        {/* Lado izquierdo: Contacto directo / Atelier */}
        <div className="hidden lg:flex items-center gap-3 shrink-0 text-stone-400">
          <a
            href={`tel:${SITE.phoneIntl}`}
            className="flex items-center gap-1.5 hover:text-secondary transition-colors"
            title="Línea directa de atención"
          >
            <Phone size={12} className="text-secondary" />
            <span className="tracking-wider">{formatPhone(SITE.phone)}</span>
          </a>
          <span className="text-stone-700">|</span>
          <a
            href={`https://wa.me/${SITE.phoneIntl.replace('+', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-secondary transition-colors"
          >
            <MessageCircle size={12} className="text-secondary" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Centro: Cinta / Marquesina interactiva estilo OH Architecture */}
        <div className="relative flex-1 overflow-hidden h-full flex items-center mx-1 sm:mx-4 group">
          {/* Máscaras de desvanecimiento lateral para entrada/salida cinematográfica */}
          <div className="pointer-events-none absolute left-0 inset-y-0 w-6 sm:w-10 bg-gradient-to-r from-[#111316] to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 inset-y-0 w-6 sm:w-10 bg-gradient-to-l from-[#111316] to-transparent z-10" />

          {/* Track continuo doble para rotación infinita sin cortes */}
          <div className="announcement-ticker-track flex items-center py-1 group-hover:[animation-play-state:paused]">
            {[...TICKER_MESSAGES, ...TICKER_MESSAGES].map((item, idx) => (
              <span key={`${item.id}-${idx}`} className="inline-flex items-center gap-3 shrink-0 px-4">
                <Link
                  href={item.href}
                  className="font-medium tracking-wide transition-all duration-200 hover:text-secondary hover:underline underline-offset-4 flex items-center gap-1.5 text-stone-200 hover:text-white"
                >
                  <span>{item.text}</span>
                </Link>
                <span className="text-secondary/70 text-[9px] select-none" aria-hidden="true">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Lado derecho: Código de afiliado activo o Redes Sociales */}
        <div className="flex items-center gap-3 shrink-0">
          {code ? (
            <div className="flex items-center gap-1.5 bg-secondary/15 text-secondary border border-secondary/30 px-2 py-0.5 rounded-full font-medium text-[10px] sm:text-[11px] animate-pulse">
              <BadgePercent size={12} className="shrink-0" />
              <span className="truncate max-w-[130px] sm:max-w-none">
                {code}: <strong>{discountPercent}% OFF</strong>
                {affiliateName ? ` (${affiliateName.split(' ')[0]})` : ''}
              </span>
              <button
                type="button"
                onClick={clearCode}
                aria-label="Quitar código"
                className="opacity-70 hover:opacity-100 transition-opacity ml-0.5"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 text-stone-400">
              <span className="hidden sm:inline-block text-[10px] uppercase tracking-widest text-stone-500">
                Atelier GM
              </span>
              <a
                href={SITE.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-secondary transition-colors"
              >
                <Facebook size={13} />
              </a>
              <a
                href={SITE.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-secondary transition-colors"
              >
                <Instagram size={13} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
