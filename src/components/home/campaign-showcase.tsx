'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { track } from '@/lib/analytics';
import { SITE, whatsappHref } from '@/lib/site';
import { CAMPAIGN } from '@/lib/campaign';

export function CampaignShowcase() {
  const whatsappUrl = whatsappHref(
    SITE.phone,
    '¡Hola Modulares GM! Me interesa la Campaña Navidad 2026 para renovar mi cocina. Quisiera asesoría técnica y cotización.'
  );

  return (
    <section
      aria-label="Campaña Exclusiva Navidad 2026"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-secondary/30 bg-gradient-to-br from-[#0c1318] via-[#10171d] to-[#151f26] p-8 sm:p-12 lg:p-16 text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        {/* Glow ambiental dorado arquitectónico */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Columna Izquierda: Dossier Editorial de la Campaña */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Identificador de Temporada */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-secondary/90 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-secondary" />
                  ( (06)13 · CAMPAÑA NAVIDAD 2026
                </span>
                <span className="h-px flex-1 max-w-[80px] bg-secondary/30" />
              </div>

              {/* Título en Serif Editorial de Alta Moda */}
              <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white mb-5 leading-[1.12]">
                ¿Cocina nueva para Navidad?
              </h2>

              {/* Badge de Plazo de Aprobación en Latón / Oro Cuarzo */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary/25 via-secondary/15 to-transparent border border-secondary/40 text-stone-100 text-xs sm:text-sm font-medium mb-6 shadow-sm">
                <Calendar size={16} className="text-secondary shrink-0" />
                <span>
                  Aprueba tu diseño hasta el <strong className="text-secondary font-bold">13 de noviembre</strong>
                </span>
              </div>

              {/* Descripción de Fabricación e Instalación */}
              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed mb-6 max-w-xl">
                Fabricación de alta precisión en <strong className="text-white font-medium">15 a 20 días hábiles</strong> con levantamiento planimétrico 3D, herrajes alemanes de cierre suave y montaje técnico garantizado en todo Ecuador.
              </p>

              {/* Pilares de Compromiso */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-secondary shrink-0" />
                  <span>Mesones en Cuarzo Calacatta y Dekton</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-secondary shrink-0" />
                  <span>Melamina RH hidrófuga 18mm Pelikano</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={15} className="text-secondary shrink-0" />
                  <span>Entrega garantizada antes de Nochebuena</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-secondary shrink-0" />
                  <span>Instalación profesional incluida en Quito</span>
                </div>
              </div>
            </div>

            {/* CTAs: WhatsApp Directo + Ver Cocinas */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { location: 'campana_navidad_showcase' })}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1b736b] hover:bg-[#155b55] text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg transition-all duration-200 active:scale-95 group"
              >
                <MessageCircle size={18} className="text-emerald-300" />
                <span>Escríbenos por WhatsApp 096 306 4374</span>
              </a>

              <Link
                href="/cocinas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 hover:border-secondary/60 bg-white/5 hover:bg-white/10 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all active:scale-95"
              >
                <span>Explorar Modelos de Cocina</span>
                <ArrowRight size={14} className="text-secondary" />
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Fotográfica Cinematográfica */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-[9/16] max-h-[520px] rounded-3xl overflow-hidden border border-secondary/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              <Image
                src="/images/campaign/campana-navidad-cocinas-luxury.png"
                alt="Campaña Navidad 2026 - Cocina Luxury Modulares GM"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlay de gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

              {/* Monograma en esquina superior */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-secondary uppercase">
                ✦ Edición Limitada
              </div>

              {/* Detalle en esquina inferior */}
              <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary block">
                    Modulares GM
                  </span>
                  <span className="text-xs text-stone-300 font-light">Quito · Ecuador</span>
                </div>
                <Link
                  href="/cocinas"
                  className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-secondary text-stone-950 hover:scale-110 active:scale-95 transition-all shadow-md"
                  title="Ver proyecto en alta resolución"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
