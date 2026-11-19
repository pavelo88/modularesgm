'use client';

import { useEffect, useRef, useState } from 'react';
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

const hiRes = (url: string) => {
  if (url.startsWith('/')) return url;
  return url.replace('w=900', 'w=1600').replace('q=65', 'q=72');
};

/** Contador animado con easing fluido de Emil Kowalski que se activa al entrar en viewport */
function AnimatedCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState('0');
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const match = value.match(/^(\d+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(match[1], 10);
    const suffix = match[2];

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1800; // ms
          const startTime = performance.now();

          const update = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic: 1 - (1 - progress)^3
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * targetNumber);
            setDisplayValue(`${current}${suffix}`);

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              setDisplayValue(value);
            }
          };

          requestAnimationFrame(update);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return <span ref={elementRef}>{displayValue}</span>;
}

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
export function HeroSlider({ heroTitle, heroSubtitle, ctaText, stats }: HeroSliderProps) {
  const rail = useRail(HERO_SLIDES.length);
  const slide = HERO_SLIDES[rail.active];

  return (
    <section className="relative z-10 select-none" aria-label="Servicios destacados de Modulares GM">
      {/* Hero: ocupa la pantalla completa en móviles para que la franja de estadísticas ('18+') quede 100% debajo del primer scroll */}
      <div className="relative isolate flex min-h-[calc(100svh-36px-20px)] items-start pt-16 pb-12 sm:items-center sm:pt-24 sm:pb-28 lg:min-h-[calc(100svh-36px-92px)] lg:px-0 lg:pt-24 lg:pb-10 overflow-hidden bg-black px-0">
        <div className="absolute inset-0 lg:left-[40%] -z-20">
          {HERO_SLIDES.map((s, i) => (
            <Image
              key={s.id}
              src={hiRes(s.imageUrl)}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn('object-cover transition-all duration-1000 ease-emil-in-out', i === rail.active ? 'opacity-100' : 'opacity-0')}
            />
          ))}
        </div>
        {/* Overlay sutil para permitir ver la cocina con gran nitidez en el centro */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/30 to-black/20 lg:from-black lg:via-black/90 lg:to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-transparent to-black/30 lg:from-black/50 lg:via-transparent lg:to-transparent" />

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-start sm:items-center gap-4 sm:gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
          <div className="min-w-0 w-full lg:col-span-6 flex flex-col items-center sm:items-start text-center sm:text-left">
            {/* Pill superior pegado al header en móviles */}
            <p className="mt-2 mb-2 sm:mt-0 sm:mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs">
              <Sparkles size={13} className="shrink-0 text-amber-400" />
              <span key={slide.id} className="animate-in fade-in duration-700">{slide.badge}</span>
            </p>

            {/* H1 ubicado más arriba y compacto en móviles */}
            <h1 className="font-headline text-3xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.7)] sm:text-5xl xl:text-6xl text-center sm:text-left">
              {heroTitle || 'Cocinas modulares, cuarzo y muebles a medida en Ecuador'}
            </h1>

            {/* Zona descriptiva y tags */}
            <div key={slide.id} className="mt-2 animate-in fade-in slide-in-from-bottom-2 duration-700 flex flex-col items-center sm:mt-5 sm:items-start text-center sm:text-left">
              <p className="font-headline text-lg font-semibold text-amber-400 sm:text-2xl text-center sm:text-left">{slide.title}</p>
              <p className="mt-1.5 max-w-xl text-xs sm:text-base leading-relaxed text-zinc-200 line-clamp-2 sm:line-clamp-none text-center sm:text-left drop-shadow-sm">
                {(rail.active === 0 && heroSubtitle) ? heroSubtitle : (slide.description || heroSubtitle)}
              </p>
              <ul className="mt-3 sm:mt-5 flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
                {slide.tags.map((tag, i) => (
                  <li key={tag} style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }} className="animate-in fade-in slide-in-from-bottom-2 duration-500 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/50 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-md">
                    <CheckCircle2 size={11} className="text-amber-400 shrink-0" /> {tag}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTAs */}
            <div className="mt-4 flex w-full flex-col items-center justify-center gap-2.5 sm:mt-8 sm:w-auto sm:flex-row sm:items-start sm:justify-start sm:gap-3">
              <Link
                href={slide.ctaPrimary.href}
                className="inline-flex h-12 w-[calc(100%-2.5rem)] max-w-[340px] items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_0_40px_rgba(210,142,27,0.45)] transition hover:brightness-110 active-press sm:h-14 sm:w-auto sm:max-w-none sm:px-8 sm:text-base"
              >
                {ctaText || slide.ctaPrimary.text} <ArrowRight size={16} />
              </Link>
              <Link
                href={slide.ctaSecondary.href}
                className="inline-flex h-12 w-[calc(100%-2.5rem)] max-w-[340px] items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-white/30 bg-white/10 px-6 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20 active-press sm:h-14 sm:w-auto sm:max-w-none sm:px-8 sm:text-base"
              >
                <Store size={16} /> {slide.ctaSecondary.text}
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
      <div className="border-t border-white/10 bg-[#0A0C10] text-white">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 divide-white/10 sm:grid-cols-4 sm:divide-x">
          {(stats || []).map((stat) => (
            <div key={stat.id} className="flex flex-col items-center justify-center px-4 py-4 text-center sm:h-[91px]">
              <dd className="order-1 font-sans text-2xl font-bold leading-none text-amber-400 sm:text-3xl">
                <AnimatedCounter value={stat.value} />
              </dd>
              <dt className="order-2 mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400 sm:text-xs">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
