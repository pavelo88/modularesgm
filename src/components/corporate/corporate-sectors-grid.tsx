'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';
import { ScrollReveal, ScrollRevealGroup } from '@/components/shared/scroll-reveal';

export function CorporateSectorsGrid() {
  return (
    <section id="sectores-corporativos" className="art-corporate-band relative z-10 py-20 lg:py-28 border-y scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado Editorial de Sección con ScrollReveal */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={13} className="shrink-0" />
            <span>Soluciones para cada industria</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.12]">
            Grandes ideas. Espacios extraordinarios.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed font-normal">
            Cada empresa tiene necesidades diferentes. Diseñamos y fabricamos soluciones adaptadas a la operación, identidad y objetivos de cada proyecto en todo el Ecuador.
          </p>
        </ScrollReveal>

        {/* Galería Editorial Asimétrica con Cascada Animada */}
        <ScrollRevealGroup staggerMs={80} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {CORPORATE_SECTORS.map((sector, idx) => (
            <Link
              key={sector.slug}
              href={sector.href}
              className="art-corporate-card group relative flex flex-col rounded-3xl border border-stone-200 bg-[hsl(var(--surface-paper))] overflow-hidden shadow-sm hover:shadow-2xl spring-card active-press hover:border-amber-500/50 transition-all duration-300 h-full"
            >
              {/* Fotografía Protagonista de Gran Formato */}
              <div className="relative w-full aspect-[16/11] overflow-hidden bg-stone-900 image-zoom-container">
                <Image
                  src={sector.heroImage}
                  alt={sector.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Badge de Categoría */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/75 backdrop-blur-md text-amber-300 border border-white/20">
                    {sector.badge}
                  </span>
                  <span className="text-[11px] font-mono text-white/70">
                    0{idx + 1}
                  </span>
                </div>

                {/* Título sobre el degradado de la foto */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <h3 className="text-xl font-headline font-bold leading-tight drop-shadow-md">
                    {sector.title}
                  </h3>
                </div>
              </div>

              {/* Contenido Editorial y CTA */}
              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary mb-1.5">
                    {sector.concept}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-700 font-normal leading-relaxed">
                    {sector.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs font-bold text-stone-950">
                  <span className="uppercase tracking-wider group-hover:text-amber-500 transition-colors">
                    Explorar división completa
                  </span>
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1.5 text-primary duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </ScrollRevealGroup>
      </div>
    </section>
  );
}
