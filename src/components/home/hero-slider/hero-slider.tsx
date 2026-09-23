'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Sparkles, Store } from 'lucide-react';
import { HERO_SLIDES } from './hero-slider-data';
import { HeroCardRail, RailControls, useRail, type RailItem } from '@/components/shared/hero-card-rail';
import { cn } from '@/lib/utils';
import type { Stat } from '@/lib/types';

interface HeroSliderProps {
  heroTitle?: string;
  heroSubtitle?: string;
  ctaText?: string;
  stats?: Stat[];
}

const hiRes = (url: string) => url.replace('w=900', 'w=1600').replace('q=65', 'q=72');

const RAIL_ITEMS: RailItem[] = HERO_SLIDES.map((s) => ({
  id: String(s.id),
  title: s.title,
  image: s.imageUrl,
  caption: s.subtitle,
  href: s.ctaPrimary.href,
  cta: 'Cotizar',
}));

/**
 * Hero + franja de estadísticas en una sola pantalla.
 * El H1 es estático (SEO); lo que cambia con cada tarjeta es el fondo, la frase y las etiquetas.
 */
export function HeroSlider({ heroSubtitle, ctaText, stats }: HeroSliderProps) {
  const rail = useRail(HERO_SLIDES.length);
  const slide = HERO_SLIDES[rail.active];

  return (
    <section className="relative z-10 select-none" aria-label="Servicios destacados de Modulares GM">
      {/* Hero: ocupa la pantalla menos la barra superior (36px) y la franja de stats (~92px) */}
      <div className="relative isolate flex min-h-[calc(100svh-36px-92px)] items-center overflow-hidden bg-black pt-28 pb-10 lg:pt-24">
        <div className="absolute inset-0 -z-20">
          {HERO_SLIDES.map((s, i) => (
            <Image
              key={s.id}
              src={hiRes(s.imageUrl)}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn('object-cover transition-opacity duration-1000', i === rail.active ? 'opacity-100' : 'opacity-0')}
            />
          ))}
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/50" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
          <div className="lg:col-span-6">
            <p className="mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:text-xs">
              <Sparkles size={14} className="shrink-0 text-secondary" />
              <span key={slide.id} className="truncate animate-in fade-in duration-700">{slide.badge}</span>
            </p>

            <h1 className="font-headline text-4xl font-bold leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:text-5xl xl:text-6xl">
              Cocinas modulares, cuarzo y muebles a medida en Ecuador
            </h1>

            <div key={slide.id} className="mt-5 animate-in fade-in slide-in-from-bottom-2 duration-700">
              <p className="font-headline text-xl font-semibold text-secondary sm:text-2xl">{slide.title}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-200 sm:text-base">{slide.description || heroSubtitle}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {slide.tags.map((tag) => (
                  <li key={tag} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md sm:text-xs">
                    <CheckCircle2 size={12} className="text-secondary" /> {tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={slide.ctaPrimary.href}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-secondary px-8 text-base font-bold text-secondary-foreground shadow-[0_0_40px_hsl(var(--secondary)/0.45)] transition hover:brightness-110 active:scale-95"
              >
                {ctaText || slide.ctaPrimary.text} <ArrowRight size={18} />
              </Link>
              <Link
                href={slide.ctaSecondary.href}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              >
                <Store size={18} /> {slide.ctaSecondary.text}
              </Link>
            </div>
          </div>

          <div className="hidden flex-col items-end justify-end gap-3 md:flex lg:col-span-6 lg:self-end">
            <HeroCardRail items={RAIL_ITEMS} active={rail.active} onSelect={rail.setActive} />
            <RailControls active={rail.active} total={HERO_SLIDES.length} playing={rail.playing} onToggle={rail.togglePlay} onPrev={rail.prev} onNext={rail.next} />
          </div>
        </div>
      </div>

      {/* Franja de estadísticas justo bajo el hero */}
      <div className="border-t border-white/10 bg-[#0f1a21] text-white">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 sm:grid-cols-4 sm:divide-x">
          {(stats || []).map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center px-4 py-4 text-center sm:h-[91px]">
              <dd className="order-1 font-sans text-2xl font-bold leading-none text-secondary sm:text-3xl">{stat.value}</dd>
              <dt className="order-2 mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 sm:text-xs">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
