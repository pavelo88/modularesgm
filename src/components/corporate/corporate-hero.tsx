'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CorporateHeroProps {
  badge?: string;
  title?: string;
  highlightedTitle?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  bgImage?: string;
}

export function CorporateHero({
  badge = 'DIVISIÓN CORPORATIVA · PROYECTOS B2B',
  title = 'Diseñamos espacios.',
  highlightedTitle = 'Fabricamos oportunidades.',
  subtitle = 'Soluciones integrales de mobiliario modular, diseño y adecuación de espacios para constructoras, arquitectos, empresas e instituciones en Ecuador.',
  primaryCtaText = 'Solicitar propuesta empresarial',
  primaryCtaHref = '#formulario-b2b',
  secondaryCtaText = 'Explorar soluciones corporativas',
  secondaryCtaHref = '#sectores-corporativos',
  bgImage = '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp',
}: CorporateHeroProps) {
  return (
    <section
      aria-label="División Corporativa Modulares GM"
      className="relative isolate flex min-h-[75vh] lg:min-h-[82vh] items-center overflow-hidden bg-black text-white w-full max-w-[100vw] overflow-x-hidden pt-28 pb-16 lg:pt-36 lg:pb-20 select-none"
    >
      {/* Fotografía de Fondo de Gran Formato con Fundido Arquitectónico */}
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      {/* Degradados cinemáticos para legibilidad absoluta */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/95 via-black/80 to-black/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/40 to-black/70" />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge de Sector */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md">
            <Sparkles size={13} className="text-amber-400 shrink-0" />
            <span>{badge}</span>
          </div>

          {/* Titular Principal Arquitectónico */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] text-white">
            {title}{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500">
              {highlightedTitle}
            </span>
          </h1>

          {/* Subtítulo Editorial */}
          <p className="mt-5 max-w-2xl text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-normal">
            {subtitle}
          </p>

          {/* Botones de Acción Elevados */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a
              href={primaryCtaHref}
              className="group relative inline-flex h-14 sm:h-15 items-center justify-center gap-3 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold px-7 text-xs sm:text-sm uppercase tracking-wider shadow-[0_12px_28px_-6px_rgba(245,158,11,0.5),0_0_0_1px_rgba(255,255,255,0.35)_inset] transition-all duration-200 active:scale-95"
            >
              <span>{primaryCtaText}</span>
              <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            <a
              href={secondaryCtaHref}
              className="group relative inline-flex h-14 sm:h-15 items-center justify-center gap-2.5 rounded-2xl border border-white/25 bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white font-semibold px-7 text-xs sm:text-sm shadow-[0_4px_16px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] transition-all duration-200 active:scale-95"
            >
              <span>{secondaryCtaText}</span>
              <ChevronDown size={16} className="text-amber-400 transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>

          {/* Micro-indicadores de Confianza B2B */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Plantilla técnica en Quito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Cortes CNC computarizados</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              <span>Instalación a nivel nacional</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
