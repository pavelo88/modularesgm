'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CorporateHeroProps {
  badge?: string;
  title?: string;
  highlightedTitle?: string;
  subtitle?: string;
  tags?: string[];
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  bgImage?: string;
  bgImages?: string[];
}

export function CorporateHero({
  badge = 'DIVISIÓN CORPORATIVA · PROYECTOS B2B',
  title = 'Diseñamos espacios.',
  highlightedTitle = 'Fabricamos oportunidades.',
  subtitle = 'Soluciones integrales de mobiliario modular, diseño y adecuación de espacios para constructoras, arquitectos, empresas e instituciones en Ecuador.',
  tags = ['Plantilla técnica en Quito', 'Cortes CNC computarizados', 'Instalación a nivel nacional'],
  primaryCtaText = 'Solicitar Cotización',
  primaryCtaHref = '#formulario-b2b',
  secondaryCtaText = 'Ver Soluciones',
  secondaryCtaHref = '#sectores-corporativos',
  bgImage = '/images/catalog/extracted_MUEBLES_OFICINA/img-004.webp',
  bgImages,
}: CorporateHeroProps) {
  const images = (bgImages && bgImages.length > 0) ? bgImages : [bgImage];
  const [activeIndex, setActiveIndex] = useState(0);

  // Rotación suave de imágenes si se pasa una lista (como en /empresas)
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section
      aria-label="División Corporativa Modulares GM"
      className="relative z-10 select-none"
    >
      {/* Contenedor principal del Hero con altura y proporciones idénticas a la Home */}
      <div className="relative isolate flex min-h-[520px] sm:min-h-[580px] lg:h-[calc(100svh-36px-92px)] lg:min-h-[640px] lg:max-h-[780px] xl:max-h-[820px] items-center overflow-hidden bg-black pt-20 pb-8 sm:pt-28 sm:pb-12 lg:pt-24 lg:pb-10">
        
        {/* Fotografía de fondo con apertura nítida a la derecha (idéntica a la Home) */}
        <div className="absolute inset-0 lg:left-[40%] -z-20">
          {images.map((img, i) => (
            <Image
              key={img}
              src={img}
              alt=""
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

        {/* Degradados idénticos a la Home: negro a la izquierda para contraste del texto, 100% transparente a la derecha */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/60 to-transparent lg:bg-gradient-to-r lg:from-black lg:via-black/90 lg:to-transparent" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10 h-full relative">
          <div className="lg:col-span-7 flex flex-col items-center sm:items-start text-center sm:text-left lg:pb-28">
            
            {/* Badge de Sector */}
            <p className="mb-3 sm:mb-5 inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md">
              <Sparkles size={13} className="shrink-0 text-amber-400" />
              <span>{badge}</span>
            </p>

            {/* Titular Principal Arquitectónico */}
            <h1 className="font-headline text-3xl sm:text-5xl xl:text-6xl font-bold leading-[1.06] tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] text-center sm:text-left">
              {title}
            </h1>

            {/* Subtítulo Dorado Corto & Elegante */}
            {highlightedTitle && (
              <p className="mt-2 sm:mt-3 font-headline text-lg sm:text-2xl font-semibold text-amber-400 text-center sm:text-left">
                {highlightedTitle}
              </p>
            )}

            {/* Descripción Editorial */}
            <p className="mt-2 sm:mt-3 max-w-xl text-xs sm:text-base leading-relaxed text-zinc-200 text-center sm:text-left line-clamp-2 sm:line-clamp-none">
              {subtitle}
            </p>

            {/* Píldoras con check dorado arriba de los botones */}
            {tags && tags.length > 0 && (
              <ul className="mt-3 sm:mt-5 flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
                {tags.map((tag, i) => (
                  <li
                    key={tag}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-white backdrop-blur-md",
                      i > 1 && "hidden sm:inline-flex"
                    )}
                  >
                    <CheckCircle2 size={12} className="text-amber-400 shrink-0" />
                    <span>{tag}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Botón en móvil: solo el primario para no saturar la pantalla */}
            <div className="mt-5 flex w-full justify-center sm:justify-start lg:hidden">
              <Link
                href={primaryCtaHref}
                className="inline-flex h-12 w-full max-w-[320px] sm:max-w-none sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-[0_0_40px_rgba(210,142,27,0.45)] transition hover:brightness-110 active:scale-95"
              >
                <span>{primaryCtaText}</span>
                <ArrowRight size={18} />
              </Link>
            </div>

          </div>

          {/* Botones de escritorio: POSICIÓN FIJA ABSOLUTA idéntica a la Home y a Arquitectos */}
          <div className="hidden lg:flex absolute bottom-6 left-10 z-20 items-center gap-4">
            <Link
              href={primaryCtaHref}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-[0_0_40px_rgba(210,142,27,0.45)] transition hover:brightness-110 active:scale-95"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              href={secondaryCtaHref}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-8 text-base font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-95"
            >
              <Building2 size={18} />
              <span>{secondaryCtaText}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
