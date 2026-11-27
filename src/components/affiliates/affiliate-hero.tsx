'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { RailItem } from '@/components/shared/hero-card-rail';

export type HeroCard = RailItem;

export interface PartnerSlide {
  image: string;
  label: string;
}

const DEFAULT_SLIDES: PartnerSlide[] = [
  {
    image: '/images/heroes/afiliados-emprendedores.webp',
    label: 'Emprendedores y Redes de Contacto',
  },
  {
    image: '/images/heroes/afiliados-arquitectos.webp',
    label: 'Arquitectos y Diseñadores de Interiores',
  },
  {
    image: '/images/heroes/afiliados-inmobiliarios.webp',
    label: 'Brokers e Inmobiliarias en Ecuador',
  },
  {
    image: '/images/heroes/afiliados-instaladores.webp',
    label: 'Técnicos e Instalación en Obra',
  },
  {
    image: '/images/heroes/afiliados-arquitectos-studio.webp',
    label: 'Estudios de Arquitectura Interior',
  },
];

export interface AffiliateHeroProps {
  cards?: HeroCard[];
  slides?: PartnerSlide[];
}

/**
 * Hero del programa de afiliados con diseño corporativo estandarizado (A+ Framework).
 * - Altura unificada con la Home y División Corporativa (calc(100svh - 128px)).
 * - Fondo visible y luminoso con viñeta cinematográfica suave (to-black/25).
 * - Fotografía de equipos reales en rotación cruzada suave.
 * - Sin tarjetas invasivas en la columna derecha para permitir máxima visibilidad del fondo.
 * - Botones CTA anclados firmemente sobre las 3 píldoras de confianza.
 */
export function AffiliateHero({ cards, slides }: AffiliateHeroProps) {
  const activeSlides: PartnerSlide[] = slides && slides.length > 0
    ? slides
    : cards && cards.length > 0
      ? cards.map((c) => ({ image: c.image, label: c.title }))
      : DEFAULT_SLIDES;

  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rotación automática suave cada 5.5 segundos
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeSlides.length]);

  return (
    <section
      aria-label="Programa oficial de afiliados de Modulares GM"
      className="relative z-10 select-none"
    >
      <div className="relative isolate flex min-h-[520px] sm:min-h-[580px] lg:h-[calc(100svh-36px-92px)] lg:min-h-[640px] lg:max-h-[780px] xl:max-h-[820px] items-center overflow-hidden bg-black pt-20 pb-8 sm:pt-28 sm:pb-12 lg:pt-24 lg:pb-10">
        
        {/* Fotografía de fondo con apertura nítida a la derecha (estándar A+) */}
        <div className="absolute inset-0 -z-20">
          {activeSlides.map((slide, i) => (
            <Image
              key={slide.image}
              src={slide.image}
              alt={slide.label}
              fill
              priority={i === 0}
              sizes="100vw"
              className={cn(
                'object-cover transition-all duration-1000 ease-emil-in-out',
                i === activeIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              )}
            />
          ))}
        </div>

        {/* Viñeta cinematográfica calibrada: contraste perfecto en texto y fondo luminoso */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-black/25" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10 h-full relative">
          {/* Columna editorial principal */}
          <div className="lg:col-span-8 flex flex-col items-center sm:items-start text-center sm:text-left">
            
            {/* Badge oficial */}
            <div
              className={cn(
                'mb-3 sm:mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/15 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-amber-400 backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all duration-700',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'
              )}
            >
              <Sparkles size={13} className="shrink-0 text-amber-400 animate-pulse" />
              <span>Programa Oficial de Afiliados · Plan 10-3-2</span>
            </div>

            {/* H1 Principal */}
            <h1
              className={cn(
                'font-headline text-3xl sm:text-5xl xl:text-6xl font-bold leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-center sm:text-left transition-all duration-700 delay-100',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              Gana el <span className="text-amber-400">10% de comisión</span> por cada recomendación
            </h1>

            {/* Subtítulo destacado */}
            <p
              className={cn(
                'mt-2 sm:mt-3 font-headline text-lg sm:text-2xl font-semibold text-amber-300 text-center sm:text-left transition-all duration-700 delay-200',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              Monetiza tu red de contactos sin inversión ni inventario
            </p>

            {/* Descripción editorial */}
            <p
              className={cn(
                'mt-2 sm:mt-3 max-w-xl text-xs sm:text-base leading-relaxed text-zinc-200 text-center sm:text-left transition-all duration-700 delay-300',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              Comparte tu enlace o código: tu recomendado ahorra <strong className="text-white">5% de descuento</strong> en cocinas, clósets o cuarzo y tú recibes el <strong className="text-white">10% directo en tu cuenta bancaria</strong>. Sin trámites y con panel en tiempo real.
            </p>

            {/* Botones de acción: colocados estrictamente ENCIMA de las garantías */}
            <div
              className={cn(
                'mt-6 sm:mt-7 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 w-full transition-all duration-700 delay-400',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <Link
                href="/afiliados/acceso?tab=registro"
                className="group relative inline-flex h-13 sm:h-14 w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 px-7 sm:px-8 text-sm sm:text-base font-bold shadow-[0_0_40px_rgba(210,142,27,0.45)] transition hover:brightness-110 active:scale-95"
              >
                <span>Crear Mi Cuenta Gratis</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/afiliados/acceso?tab=login"
                className="inline-flex h-13 sm:h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-7 sm:px-8 text-sm sm:text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
              >
                <span>Ingresar a Mi Panel</span>
              </Link>
            </div>

            {/* Tres píldoras de confianza: DEBAJO de los botones */}
            <ul
              className={cn(
                'mt-4 sm:mt-5 flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2 transition-all duration-700 delay-500',
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <li className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-md">
                <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                <span>Registro 100% gratuito</span>
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-md">
                <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                <span>Plan oficial 10-3-2</span>
              </li>
              <li className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-md">
                <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                <span>Pagos directos a bancos de Ecuador</span>
              </li>
            </ul>

          </div>

          {/* Columna derecha: Indicador flotante sutil que no obstruye la fotografía */}
          <div className="hidden lg:flex lg:col-span-4 justify-end items-end h-full pb-2 select-none">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/50 backdrop-blur-md px-4 py-2 text-xs text-white/90 shadow-2xl">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
              <span className="font-semibold text-white/95 max-w-[190px] truncate">
                {activeSlides[activeIndex]?.label}
              </span>
              <div className="flex items-center gap-1.5 pl-1 border-l border-white/20">
                {activeSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Ver equipo ${i + 1}`}
                    className={cn(
                      'h-1.5 rounded-full transition-all duration-300',
                      i === activeIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
