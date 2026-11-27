'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { HeroCardRail, RailControls, useRail, type RailItem } from '@/components/shared/hero-card-rail';
import { cn } from '@/lib/utils';

export type HeroCard = RailItem;

/**
 * Hero del programa de afiliados con animación cinematográfica fluida (Emil Kowalski / Apple Design).
 * - Entrada escalonada (stagger) para badge, título, descripción y botones.
 * - Información 100% verídica: 10% de comisión directa sin promesas falsas de montos fijos.
 * - Altura equilibrada para garantizar que los botones CTA queden siempre visibles en viewport.
 * - Aceleración por GPU (opacity y transform con curva --ease-out-emil).
 */
export function AffiliateHero({ cards }: { cards: HeroCard[] }) {
  const rail = useRail(cards.length);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      aria-label="Programa de afiliados de Modulares GM"
      className="relative isolate flex min-h-[620px] lg:h-[calc(100svh-36px-92px)] lg:min-h-[660px] lg:max-h-[820px] xl:max-h-[840px] items-center overflow-hidden bg-black pb-12 pt-24 sm:pt-28 text-white lg:pt-24 lg:pb-14 w-full max-w-[100vw] overflow-x-hidden select-none"
    >
      {/* Fondos dinámicos en fundido cruzado */}
      <div className="absolute inset-0 -z-20">
        {cards.map((card, i) => (
          <Image
            key={card.id}
            src={card.image}
            alt=""
            fill
            priority={i === 0}
            sizes="100vw"
            className={cn(
              'object-cover transition-opacity duration-1000 ease-out',
              i === rail.active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            )}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/80 to-black/40" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/40 to-black/60" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 sm:gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lg:col-span-6 max-w-full">
          {/* Badge con entrada animada y pulso suave */}
          <div
            className={cn(
              'mb-4 sm:mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/15 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-700',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
            )}
          >
            <Sparkles size={14} className="text-amber-400 animate-pulse" />
            <span>Programa Oficial de Afiliados</span>
          </div>

          {/* H1 Conciso, Verídico y con entrada suave */}
          <h1
            className={cn(
              'font-headline text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] break-words transition-all duration-700 delay-100',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Gana el <span className="text-amber-400">10% de comisión</span> por cada recomendación
          </h1>

          {/* Subtítulo editorial breve y directo */}
          <p
            className={cn(
              'mt-3.5 sm:mt-4 max-w-xl text-sm sm:text-base text-white/90 leading-relaxed font-normal transition-all duration-700 delay-200',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Comparte tu código o enlace: tu recomendado ahorra <strong>5% de descuento</strong> y tú recibes el <strong>10% directo en tu cuenta bancaria</strong>. Sin inventario, sin trámites y con panel en tiempo real.
          </p>

          {/* Garantías de confianza en píldoras */}
          <div
            className={cn(
              'mt-4 flex flex-wrap items-center gap-3 text-xs text-amber-300 font-semibold transition-all duration-700 delay-300',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-amber-400" />
              <span>Registro 100% gratuito</span>
            </span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-amber-400" />
              <span>Plan oficial 10-3-2</span>
            </span>
            <span className="text-white/40">·</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-amber-400" />
              <span>Pagos a bancos de Ecuador</span>
            </span>
          </div>

          {/* Botones elevados con espaciado óptimo para evitar contacto con bordes de pantalla */}
          <div
            className={cn(
              'mt-7 sm:mt-8 flex flex-col gap-3.5 sm:flex-row w-full sm:w-auto max-w-md sm:max-w-none transition-all duration-700 delay-400',
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Link
              href="/afiliados/acceso?tab=registro"
              className="group relative inline-flex h-15 sm:h-16 items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 px-8 shadow-[0_12px_28px_-6px_rgba(245,158,11,0.5),0_0_0_1px_rgba(255,255,255,0.4)_inset] transition-all duration-200 active:scale-95 w-full sm:w-auto hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.65)] hover:-translate-y-0.5"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-sm font-black uppercase tracking-wide drop-shadow-xs">Crear Mi Cuenta Gratis</span>
                <span className="text-[11px] font-bold text-stone-900/85">Comisiones del 10% directas a tu banco</span>
              </div>
              <ArrowRight size={18} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/afiliados/acceso?tab=login"
              className="group relative inline-flex h-15 sm:h-16 items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl hover:bg-white/20 px-7 text-white shadow-[0_4px_18px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.15)_inset] transition-all duration-200 active:scale-95 w-full sm:w-auto hover:-translate-y-0.5"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-xs font-semibold text-white/75">¿Ya eres afiliado?</span>
                <span className="text-xs font-bold text-white">Ingresar a Mi Panel</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Carrusel de proyectos con entrada animada */}
        <div
          className={cn(
            'hidden flex-col items-end justify-end gap-3 md:flex lg:col-span-6 lg:self-end transition-all duration-800 delay-500',
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <HeroCardRail items={cards} active={rail.active} onSelect={rail.setActive} />
          <RailControls active={rail.active} total={cards.length} playing={rail.playing} onToggle={rail.togglePlay} onPrev={rail.prev} onNext={rail.next} label="Proyecto" />
        </div>
      </div>
    </section>
  );
}
