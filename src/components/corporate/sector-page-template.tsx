'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  PhoneCall, 
  MessageCircle, 
  Sparkles, 
  Clock, 
  Layers, 
  Ruler, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { SITE, whatsappHref } from '@/lib/site';
import { CorporateHero } from './corporate-hero';
import { B2BForm } from '@/app/(public)/empresas/b2b-form';
import { ScrollReveal, ScrollRevealGroup } from '@/components/shared/scroll-reveal';
import type { CorporateSector } from '@/lib/corporate-sectors-data';
import { CORPORATE_SECTORS } from '@/lib/corporate-sectors-data';

interface SectorPageTemplateProps {
  sector: CorporateSector;
}

export function SectorPageTemplate({ sector }: SectorPageTemplateProps) {
  const whatsappUrl = whatsappHref(
    SITE.phone,
    `¡Hola Modulares GM! Quisiera solicitar información técnica y cotización para la división de ${sector.title}.`
  );

  // Encontrar otras soluciones relacionadas (excluyendo la actual)
  const relatedSectors = CORPORATE_SECTORS.filter((s) => s.slug !== sector.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 1. Hero Cinematográfico con Fotografía Protagonista y Botones Idénticos a la Home */}
      <CorporateHero
        badge={sector.badge}
        title={sector.title}
        highlightedTitle={sector.concept}
        subtitle={sector.description}
        tags={sector.tags}
        primaryCtaText={sector.ctaText || 'Solicitar Propuesta'}
        primaryCtaHref="#formulario-b2b"
        secondaryCtaText="Ver Soluciones"
        secondaryCtaHref="#soluciones-especializadas"
        bgImage={sector.heroImage}
      />

      {/* 2. Introducción Editorial Asimétrica con ScrollReveal */}
      <section className="py-20 lg:py-28 bg-stone-100/60 dark:bg-[#0c1014] border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <ScrollReveal direction="left" className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-extrabold uppercase tracking-[0.2em]">
                <Sparkles size={13} />
                <span>Capacidad y Enfoque Productivo</span>
              </div>
              <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {sector.concept}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal">
                {sector.description} En Modulares GM integramos maquinaria computarizada de corte CNC, tableros hidrófugos certificados y herrajes europeos de alto ciclo de vida para entregar obras duraderas y estéticamente impecables.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Cumplimiento de especificaciones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Entrega y montaje en obra</span>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={100} className="lg:col-span-6 relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/80 shadow-2xl image-zoom-container">
              <Image
                src={sector.galleryImages[1] || sector.heroImage}
                alt={sector.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-300 block mb-1">
                  Estándar Modulares GM
                </span>
                <p className="text-sm font-semibold">
                  Taller directo en Quito con despacho y montaje en todo el Ecuador.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. Soluciones Especializadas con Cascada */}
      <section id="soluciones-especializadas" className="py-20 lg:py-24 bg-background scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-2">
              Líneas de Fabricación
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Soluciones a medida para {sector.title}
            </h2>
          </ScrollReveal>

          <ScrollRevealGroup staggerMs={80} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sector.solutions.map((sol, i) => (
              <div
                key={sol.title}
                className="p-7 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md flex flex-col justify-between group hover:border-amber-500/40 hover:shadow-xl transition-all duration-300 spring-card h-full"
              >
                <div>
                  <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold font-mono text-sm flex items-center justify-center mb-4 border border-amber-500/20">
                    0{i + 1}
                  </div>
                  <h3 className="font-headline text-lg font-bold text-foreground mb-2">
                    {sol.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                    {sol.description}
                  </p>
                </div>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 4. Galería de Proyectos de Gran Formato */}
      <section className="py-20 bg-stone-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 block mb-2">
                Galería Visual
              </span>
              <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight">
                Acabados y Ejecución Arquitectónica
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 max-w-md">
              Fotografías de referencia técnica y proyectos realizados en nuestros talleres y en obra.
            </p>
          </ScrollReveal>

          <ScrollRevealGroup staggerMs={70} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sector.galleryImages.map((img, idx) => (
              <div key={img} className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group shadow-lg image-zoom-container">
                <Image
                  src={img}
                  alt={`${sector.title} proyecto ${idx + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-3 left-3 text-[11px] font-semibold text-white/90 z-10">
                  Detalle {idx + 1}
                </span>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 5. Proceso de Trabajo Metódico (01 al 06) con Stagger */}
      <section className="py-20 lg:py-24 bg-background border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-2">
              Metodología de Trabajo
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Cómo desarrollamos tu proyecto corporativo
            </h2>
          </ScrollReveal>

          <ScrollRevealGroup staggerMs={60} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sector.process.map((p) => (
              <div key={p.step} className="relative p-6 rounded-3xl border border-border/80 bg-card/60 hover:shadow-lg transition-all h-full">
                <span className="text-3xl font-black font-headline text-primary/30 block mb-2">
                  {p.step}
                </span>
                <h3 className="text-base font-bold text-foreground mb-1">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* 6. Preguntas Frecuentes de la Industria */}
      <section className="py-20 bg-stone-100/50 dark:bg-[#0c1014] border-b border-border/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-2">
              Dudas Técnicas
            </span>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Preguntas Frecuentes sobre {sector.title}
            </h2>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={80} className="space-y-4">
            {sector.faq.map((item) => (
              <details key={item.q} className="group p-5 rounded-2xl border border-border/80 bg-card/80 [&_summary::-webkit-details-marker]:hidden shadow-xs">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-foreground text-sm sm:text-base">
                  <span>{item.q}</span>
                  <span className="text-primary text-xl transition-transform duration-200 group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {item.a}
                </p>
              </details>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* 7. Formulario de Contacto B2B Equilibrado con ScrollReveal */}
      <section id="formulario-b2b" className="py-20 lg:py-24 bg-background scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Columna Izquierda: Información Editorial y Atención Directa */}
            <ScrollReveal direction="left" className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl border border-border/80 bg-card/70 backdrop-blur-md shadow-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  Hablemos de tu proyecto
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight text-foreground mb-3 leading-tight">
                  Las grandes transformaciones comienzan con una conversación.
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                  Cuéntanos qué necesita tu empresa. Analizaremos el alcance, las características técnicas y las posibilidades de fabricación para preparar una propuesta adaptada a tu proyecto.
                </p>

                <div className="space-y-3 pt-4 border-t border-border/60 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span>01. Revisamos planos y especificaciones.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span>02. Coordinamos visita técnica cuando corresponda.</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    <span>03. Preparamos una propuesta económica en escala.</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                      Línea Directa B2B
                    </span>
                    <a href="tel:+593962524311" className="text-base font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 mt-0.5">
                      <PhoneCall size={14} className="text-primary" />
                      <span>+593 96 252 4311</span>
                    </a>
                  </div>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Asesor</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Columna Derecha: Formulario Interactivo B2B */}
            <ScrollReveal direction="right" delay={100} className="lg:col-span-7">
              <B2BForm defaultProjectType={sector.title} />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 8. Soluciones Relacionadas */}
      <section className="relative z-10 isolate py-16 bg-muted/30 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal direction="up" className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground">
              Otras Divisiones Corporativas de Modulares GM
            </h3>
            <Link href="/empresas" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
              <span>Ver todas las divisiones</span>
              <ArrowRight size={13} />
            </Link>
          </ScrollReveal>

          <ScrollRevealGroup staggerMs={80} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedSectors.map((rel) => (
              <Link
                key={rel.slug}
                href={rel.href}
                className="group relative block p-6 rounded-2xl border border-border/80 bg-card hover:border-amber-500/40 hover:shadow-lg transition-all duration-300 h-full overflow-hidden"
              >
                <span className="text-[10px] font-bold uppercase text-primary tracking-wider block mb-1">
                  {rel.badge}
                </span>
                <h4 className="font-headline text-base font-bold text-foreground group-hover:text-amber-500 transition-colors">
                  {rel.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {rel.concept}
                </p>
              </Link>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>
    </div>
  );
}
