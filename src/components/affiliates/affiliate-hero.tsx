'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LogIn, Sparkles } from 'lucide-react';
import { HeroCardRail, RailControls, useRail, type RailItem } from '@/components/shared/hero-card-rail';
import { cn } from '@/lib/utils';

export type HeroCard = RailItem;

/**
 * Hero del programa de afiliados.
 *  1. Arranque: tarjeta activa expandida y el resto visibles desde el primer pintado.
 *  2. Detonante: clic, flechas o autoplay (arranca a los 3 s; se pausa al pasar el cursor).
 *  3. Mutación: el fondo hace fundido cruzado, la tarjeta elegida se expande y su texto entra con retraso.
 *  4. Resultado: el H1 nunca cambia; solo fondo, tarjeta y frase de apoyo.
 * Solo se animan opacity/transform/flex-grow; sin capas superpuestas que bloqueen la interacción.
 */
export function AffiliateHero({ cards }: { cards: HeroCard[] }) {
  const rail = useRail(cards.length);

  return (
    <section
      aria-label="Programa de afiliados de Modulares GM"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black pb-16 pt-28 sm:pt-36 text-white lg:pt-32 lg:pb-20 w-full max-w-[100vw] overflow-x-hidden"
    >
      <div className="absolute inset-0 -z-20">
        {cards.map((card, i) => (
          <Image
            key={card.id}
            src={card.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn('object-cover transition-opacity duration-1000', i === rail.active ? 'opacity-100' : 'opacity-0')}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/75 to-black/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lg:col-span-6 max-w-full">
          <div className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" /> 
            <span>Gana 10% por cada recomendación</span>
          </div>

          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)] break-words">
            Recomienda muebles de lujo y gana de <span className="text-amber-400">$200 a $800</span> por venta
          </h1>

          <p className="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal">
            ¿Conoces a alguien que va a remodelar su cocina, clóset o departamento? Comparte tu enlace personal o código: tu cliente recibe un <strong>5% de descuento</strong> y tú cobras el <strong>10% directo en tu cuenta bancaria</strong>. Sin inventario, sin trámites y con panel en tiempo real.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-amber-300 font-semibold">
            <span className="flex items-center gap-1.5">✓ Registro 100% gratuito</span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-1.5">✓ Plan oficial 10-3-2</span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-1.5">✓ Pagos a bancos de Ecuador</span>
          </div>

          {/* Botones elevados con espaciado óptimo para evitar contacto con bordes de pantalla */}
          <div className="mt-7 sm:mt-9 mb-4 flex flex-col gap-3.5 sm:flex-row w-full sm:w-auto max-w-md sm:max-w-none">
            <Link
              href="/afiliados/acceso?tab=registro"
              className="group relative inline-flex h-16 items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 px-8 shadow-[0_12px_28px_-6px_rgba(245,158,11,0.5),0_0_0_1px_rgba(255,255,255,0.4)_inset] transition-all duration-200 active:scale-95 w-full sm:w-auto"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-sm font-black uppercase tracking-wide drop-shadow-xs">Crear Mi Cuenta Gratis</span>
                <span className="text-[11px] font-bold text-stone-900/85">Comisiones del 10% directas a tu banco</span>
              </div>
              <ArrowRight size={18} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/afiliados/acceso?tab=login"
              className="group relative inline-flex h-16 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl hover:bg-white/20 px-7 text-white shadow-[0_4px_18px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition-all duration-200 active:scale-95 w-full sm:w-auto"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-xs font-semibold text-white/75">¿Ya eres afiliado?</span>
                <span className="text-xs font-bold text-white">Ingresar a Mi Panel</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="hidden flex-col items-end justify-end gap-3 md:flex lg:col-span-6 lg:self-end">
          <HeroCardRail items={cards} active={rail.active} onSelect={rail.setActive} />
          <RailControls active={rail.active} total={cards.length} playing={rail.playing} onToggle={rail.togglePlay} onPrev={rail.prev} onNext={rail.next} label="Proyecto" />
        </div>
      </div>
    </section>
  );
}
