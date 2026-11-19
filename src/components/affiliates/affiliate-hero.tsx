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
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black pb-12 pt-28 sm:pt-36 text-white lg:pt-32 w-full max-w-[100vw] overflow-x-hidden"
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
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-transparent to-black/50" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lg:col-span-6 max-w-full">
          <p className="mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            <Sparkles size={14} className="text-amber-400" /> Programa de afiliados
          </p>
          <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-[1.1] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] break-words">
            Trabaja con Modulares GM y gana comisiones por cada venta
          </h1>
          <p className="mt-4 sm:mt-6 max-w-xl text-sm sm:text-base lg:text-lg text-white/85 leading-relaxed">
            Recibe tu enlace y código personal, comparte con quien remodela su casa y sigue tus ventas en un panel propio. Sin inversión ni inventario.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col gap-3.5 sm:flex-row w-full sm:w-auto max-w-md sm:max-w-none">
            <Link
              href="/afiliados/acceso?tab=registro"
              className="group relative inline-flex h-16 items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 px-8 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4),0_0_0_1px_rgba(255,255,255,0.35)_inset] transition-all duration-200 active:scale-95 w-full sm:w-auto"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-sm font-extrabold uppercase tracking-wide drop-shadow-xs">Afiliarme Gratis</span>
                <span className="text-[11px] font-semibold text-stone-900/80">Comisiones directas del 10% · Sin inversión</span>
              </div>
              <ArrowRight size={18} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/afiliados/acceso?tab=login"
              className="group relative inline-flex h-16 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/15 px-7 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)_inset] transition-all duration-200 active:scale-95 w-full sm:w-auto"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-xs font-semibold text-white/70">¿Ya tienes cuenta?</span>
                <span className="text-xs font-bold text-white">Iniciar Sesión</span>
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
