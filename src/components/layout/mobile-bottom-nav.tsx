'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Store, MessageSquare, Handshake, MessageCircle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE, whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';
import { useSiteContent } from '@/context/site-content-provider';

export function MobileBottomNav() {
  const pathname = usePathname() ?? '';
  const { siteContent } = useSiteContent();
  const rawPhone = siteContent?.whatsappNumber || SITE.phone;
  const cleanPhone = rawPhone.replace(/\D/g, '');
  const telHref = cleanPhone ? `tel:+${cleanPhone}` : 'tel:+593962524311';

  const isCatalogo = pathname.startsWith('/catalogo');
  const isAfiliados = pathname.startsWith('/afiliados');
  const isContacto = pathname === '/#contacto';

  const handleWhatsAppClick = () => {
    track('whatsapp_click', { location: 'mobile_bottom_bar', page: pathname });
    const message = '¡Hola Modulares GM! Me comunico desde la web móvil para consultar sobre sus catálogos, cotizaciones y proyectos a medida.';
    window.open(whatsappHref(rawPhone, message), '_blank', 'noopener,noreferrer');
  };

  return (
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed inset-x-3 z-40 overflow-visible rounded-[1.5rem] border border-white/10 bg-[#0b1118]/95 text-white shadow-[0_14px_40px_rgba(0,0,0,0.34)] backdrop-blur-2xl [bottom:calc(env(safe-area-inset-bottom)+0.5rem)]"
    >
      <div className="relative mx-auto grid h-[66px] max-w-md grid-cols-5 items-center px-1.5">
        {/* 1. Llamar por Teléfono */}
        <a
          href={telHref}
          onClick={() => track('phone_call_click', { location: 'mobile_bottom_bar', phone: telHref })}
          className="flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-center text-slate-400 transition-all duration-200 hover:text-white active:scale-90 font-medium"
          aria-label="Llamar a Modulares GM"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04]">
            <Phone size={17} strokeWidth={1.9} />
          </div>
          <span className="text-[9px] tracking-wide leading-none">Llamar</span>
        </a>

        {/* 2. Catálogo (Antes Tienda) */}
        <Link
          href="/catalogo"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-center transition-all duration-200 active:scale-90',
            isCatalogo
              ? 'bg-white/10 text-amber-300 font-semibold'
              : 'text-slate-400 hover:text-white font-medium'
          )}
        >
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-all',
            isCatalogo ? 'bg-amber-400/15' : 'bg-white/[0.04]'
          )}>
            <LayoutGrid size={19} strokeWidth={isCatalogo ? 2.2 : 1.8} />
          </div>
          <span className="text-[9px] tracking-wide leading-none">Catálogo</span>
        </Link>

        {/* 3. WhatsApp Central Integrado (Apple Style elevado) */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          aria-label="Escribir por WhatsApp"
          className="relative z-10 flex flex-col items-center justify-center text-center transition-all duration-200 active:scale-95 group"
        >
          <div className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#0b1118] bg-[#25D366] text-white shadow-[0_7px_24px_rgba(37,211,102,0.5)] transition-transform group-hover:scale-105 active:scale-95">
            <MessageCircle size={26} strokeWidth={2.35} />
          </div>
          <span className="mt-1.5 text-[9px] font-bold tracking-wide leading-none text-[#6ee7a0]">
            WhatsApp
          </span>
        </button>

        {/* 4. Contacto */}
        <Link
          href="/#contacto"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-center transition-all duration-200 active:scale-90',
            isContacto
              ? 'bg-white/10 text-amber-300 font-semibold'
              : 'text-slate-400 hover:text-white font-medium'
          )}
        >
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-all',
            isContacto ? 'bg-amber-400/15' : 'bg-white/[0.04]'
          )}>
            <MessageSquare size={19} strokeWidth={isContacto ? 2.2 : 1.8} />
          </div>
          <span className="text-[9px] tracking-wide leading-none">Contacto</span>
        </Link>

        {/* 5. Afiliados */}
        <Link
          href="/afiliados"
          className={cn(
            'flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-center transition-all duration-200 active:scale-90',
            isAfiliados
              ? 'bg-white/10 text-amber-300 font-semibold'
              : 'text-slate-400 hover:text-white font-medium'
          )}
        >
          <div className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full transition-all',
            isAfiliados ? 'bg-amber-400/15' : 'bg-white/[0.04]'
          )}>
            <Handshake size={19} strokeWidth={isAfiliados ? 2.2 : 1.8} />
          </div>
          <span className="text-[9px] tracking-wide leading-none">Afiliados</span>
        </Link>
      </div>
    </nav>
  );
}
