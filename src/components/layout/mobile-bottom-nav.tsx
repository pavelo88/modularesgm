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
      className="md:hidden fixed inset-x-0 bottom-0 z-50 select-none pointer-events-auto"
    >
      <div className="relative">
        {/* Apple iOS Drop Shadow */}
        <div aria-hidden className="pointer-events-none absolute inset-0 drop-shadow-[0_-8px_24px_rgba(0,0,0,0.5)]">
          <div className="h-full w-full rounded-t-[50%_1.75rem] bg-[#0b1118]/80 ios-notch-mask" />
        </div>

        {/* Apple Frosted Glass Background with Elliptic Arch & Center Notch */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-t-[50%_1.75rem] border-t border-white/[0.12] bg-[#0b1118]/95 backdrop-blur-2xl ios-notch-mask"
        />

        {/* 5-Column Grid */}
        <div className="relative grid grid-cols-5 items-end px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]">
          {/* 1. Llamar por Teléfono */}
          <div className="flex h-14 items-end justify-center">
            <a
              href={telHref}
              onClick={() => track('phone_call_click', { location: 'mobile_bottom_bar', phone: telHref })}
              className="flex min-h-12 min-w-11 flex-col items-center justify-end gap-1 rounded-xl px-1 pb-1 transition-all duration-150 active:scale-90 text-slate-400 hover:text-white font-medium"
              aria-label="Llamar a Modulares GM"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.04]">
                <Phone size={17} strokeWidth={1.9} />
              </div>
              <span className="text-[9px] tracking-wide leading-none">Llamar</span>
            </a>
          </div>

          {/* 2. Catálogo */}
          <div className="flex h-14 items-end justify-center">
            <Link
              href="/catalogo"
              className={cn(
                'flex min-h-12 min-w-11 flex-col items-center justify-end gap-1 rounded-xl px-1 pb-1 transition-all duration-150 active:scale-90',
                isCatalogo
                  ? 'text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-white font-medium'
              )}
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                isCatalogo ? 'bg-amber-400/20 text-amber-300' : 'bg-white/[0.04]'
              )}>
                <LayoutGrid size={18} strokeWidth={isCatalogo ? 2.2 : 1.8} />
              </div>
              <span className="text-[9px] tracking-wide leading-none">Catálogo</span>
            </Link>
          </div>

          {/* 3. WhatsApp Central Integrado en la muesca (Notch Floating WhatsApp Button) */}
          <div className="relative flex h-14 justify-center">
            <button
              type="button"
              onClick={handleWhatsAppClick}
              aria-label="Escribir por WhatsApp"
              className="group absolute -top-[28px] bottom-0 flex flex-col items-center justify-between pb-1 cursor-pointer"
            >
              <span className="relative grid h-[58px] w-[58px] place-items-center rounded-full bg-[#25D366] text-white shadow-[0_4px_22px_rgba(37,211,102,0.55)] border-[3px] border-[#0b1118] transition-transform duration-150 group-active:scale-90">
                <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366]/30 pointer-events-none" />
                <MessageCircle size={26} strokeWidth={2.35} />
              </span>
              <span className="whitespace-nowrap text-[9px] font-bold tracking-wide leading-none text-[#6ee7a0] drop-shadow">
                WhatsApp
              </span>
            </button>
          </div>

          {/* 4. Contacto */}
          <div className="flex h-14 items-end justify-center">
            <Link
              href="/#contacto"
              className={cn(
                'flex min-h-12 min-w-11 flex-col items-center justify-end gap-1 rounded-xl px-1 pb-1 transition-all duration-150 active:scale-90',
                isContacto
                  ? 'text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-white font-medium'
              )}
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                isContacto ? 'bg-amber-400/20 text-amber-300' : 'bg-white/[0.04]'
              )}>
                <MessageSquare size={18} strokeWidth={isContacto ? 2.2 : 1.8} />
              </div>
              <span className="text-[9px] tracking-wide leading-none">Contacto</span>
            </Link>
          </div>

          {/* 5. Afiliados */}
          <div className="flex h-14 items-end justify-center">
            <Link
              href="/afiliados"
              className={cn(
                'flex min-h-12 min-w-11 flex-col items-center justify-end gap-1 rounded-xl px-1 pb-1 transition-all duration-150 active:scale-90',
                isAfiliados
                  ? 'text-amber-300 font-semibold'
                  : 'text-slate-400 hover:text-white font-medium'
              )}
            >
              <div className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition-all',
                isAfiliados ? 'bg-amber-400/20 text-amber-300' : 'bg-white/[0.04]'
              )}>
                <Handshake size={18} strokeWidth={isAfiliados ? 2.2 : 1.8} />
              </div>
              <span className="text-[9px] tracking-wide leading-none">Afiliados</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
