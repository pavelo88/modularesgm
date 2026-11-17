'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Store, MessageSquare, Handshake, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE, whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';
import { useSiteContent } from '@/context/site-content-provider';

export function MobileBottomNav() {
  const pathname = usePathname() ?? '';
  const { siteContent } = useSiteContent();
  const whatsappNumber = siteContent?.whatsappNumber || SITE.phone;

  const isCatalogo = pathname.startsWith('/catalogo');
  const isStore = pathname.startsWith('/store');
  const isAfiliados = pathname.startsWith('/afiliados');
  const isContacto = pathname === '/#contacto';

  const handleWhatsAppClick = () => {
    track('whatsapp_click', { location: 'mobile_bottom_bar', page: pathname });
    const message = '¡Hola Modulares GM! Me comunico desde la web móvil para consultar sobre sus catálogos, cotizaciones y proyectos a medida.';
    window.open(whatsappHref(whatsappNumber, message), '_blank', 'noopener,noreferrer');
  };

  return (
    <nav
      aria-label="Navegación móvil"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/80 dark:bg-[#0c0e12]/85 backdrop-blur-2xl border-t border-stone-200/70 dark:border-stone-800/70 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_25px_rgba(0,0,0,0.5)] [padding-bottom:env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-[58px] max-w-md mx-auto px-2">
        {/* 1. Catálogo */}
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

        {/* 2. Tienda */}
        <Link
          href="/store"
          className={cn(
            'flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 text-center',
            isStore
              ? 'text-amber-600 dark:text-amber-400 font-semibold'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-medium'
          )}
        >
          <div className={cn(
            'flex items-center justify-center w-8 h-8 rounded-full transition-all',
            isStore ? 'bg-amber-500/15 dark:bg-amber-400/15' : 'bg-transparent'
          )}>
            <Store size={19} strokeWidth={isStore ? 2.2 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight leading-none mt-0.5">Tienda</span>
        </Link>

        {/* 3. WhatsApp Central Integrado (Apple Style) */}
        <button
          type="button"
          onClick={handleWhatsAppClick}
          aria-label="Escribir por WhatsApp"
          className="flex flex-col items-center justify-center py-1 transition-all duration-200 active:scale-90 text-center group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shadow-sm transition-transform group-hover:scale-105">
            <MessageCircle size={19} strokeWidth={2.2} />
          </div>
          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight leading-none mt-0.5">
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
