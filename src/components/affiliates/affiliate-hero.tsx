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
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-black pb-12 pt-36 text-white lg:pt-32"
     
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

      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lg:col-span-6">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur-md">
            <Sparkles size={14} className="text-secondary" /> Programa de afiliados
          </p>
          <h1 className="font-headline text-4xl font-bold leading-[1.06] tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-5xl xl:text-6xl">
            Trabaja con Modulares GM y gana comisiones por cada venta
          </h1>
          <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
            Recibe tu enlace y código personal, comparte con quien remodela su casa y sigue tus ventas en un panel propio. Sin inversión ni inventario.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/afiliados/acceso?tab=registro"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-secondary px-8 text-base font-bold text-secondary-foreground shadow-[0_0_40px_hsl(var(--secondary)/0.45)] transition hover:brightness-110 active:scale-95"
            >
              Quiero ser afiliado <ArrowRight size={18} />
            </Link>
            <Link
              href="/afiliados/acceso"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 text-base font-bold backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              <LogIn size={18} /> Ya tengo cuenta
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
