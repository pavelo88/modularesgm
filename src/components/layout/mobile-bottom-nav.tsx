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
      className="md:hidden fixed bottom-0 inset-x-0 z-40 overflow-visible rounded-t-[1.35rem] border-t border-stone-200/80 bg-white/96 shadow-[0_-10px_32px_rgba(15,23,42,0.16)] backdrop-blur-2xl dark:border-stone-800/80 dark:bg-[#0c0e12]/96 dark:shadow-[0_-10px_34px_rgba(0,0,0,0.65)] [padding-bottom:env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid h-[62px] max-w-md grid-cols-5 items-center px-2">
        {/* 1. Llamar por Teléfono */}
        <a
          href={telHref}
          onClick={() => track('phone_call_click', { location: 'mobile_bottom_bar', phone: telHref })}
          className="flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 text-center text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium"
          aria-label="Llamar a Modulares GM"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full transition-all bg-transparent">
            <Phone size={19} strokeWidth={1.8} />
          </div>
          <span className="text-[10px] tracking-tight leading-none mt-0.5">Llamar</span>
        </a>

        {/* 2. Catálogo (Antes Tienda) */}
        <Link
          href="/catalogo"
          className={cn(
            'flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 text-center',
            isCatalogo
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
          )}
        >
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full transition-all',
            isCatalogo ? 'bg-amber-500/15 dark:bg-amber-400/15' : 'bg-transparent'
          )}>
            <LayoutGrid size={19} strokeWidth={isCatalogo ? 2.2 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight leading-none mt-0.5">Catálogo</span>
        </Link>

        {/* 3. WhatsApp Central Integrado (Apple Style elevado) */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          aria-label="Escribir por WhatsApp"
          className="relative flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-95 text-center group"
        >
          <div className="-mt-6 flex h-13 w-13 items-center justify-center rounded-full border-4 border-white bg-[#25D366] text-white shadow-[0_6px_22px_rgba(37,211,102,0.6)] transition-transform group-hover:scale-105 active:scale-95 dark:border-[#0c0e12]">
            <MessageCircle size={25} strokeWidth={2.4} />
          </div>
          <span className="mt-1 text-[10px] font-bold tracking-tight leading-none text-[#128C7E] dark:text-[#25D366]">
            WhatsApp
          </span>
        </button>

        {/* 4. Contacto */}
        <Link
          href="/#contacto"
          className={cn(
            'flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 text-center',
            isContacto
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
          )}
        >
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full transition-all',
            isContacto ? 'bg-amber-500/15 dark:bg-amber-400/15' : 'bg-transparent'
          )}>
            <MessageSquare size={19} strokeWidth={isContacto ? 2.2 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight leading-none mt-0.5">Contacto</span>
        </Link>

        {/* 5. Afiliados */}
        <Link
          href="/afiliados"
          className={cn(
            'flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 text-center',
            isAfiliados
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
          )}
        >
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full transition-all',
            isAfiliados ? 'bg-amber-500/15 dark:bg-amber-400/15' : 'bg-transparent'
          )}>
            <Handshake size={19} strokeWidth={isAfiliados ? 2.2 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight leading-none mt-0.5">Afiliados</span>
        </Link>
      </div>
    </nav>
  );
}
