'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, CheckCircle2, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { track } from '@/lib/analytics';
import { SITE, whatsappHref } from '@/lib/site';

const KITCHEN_SLIDES = [
  { img: '/images/catalog/extracted_DE_COCINAS/img-004.jpg', title: 'Cocina Luxury Cappuccino', desc: 'Isla central y mesón de cuarzo blanco' },
  { img: '/images/catalog/extracted_DE_COCINAS/img-025.png', title: 'Isla Waterfall en Cuarzo Calacatta', desc: 'Acabados amaderados y luz cálida' },
  { img: '/images/catalog/extracted_DE_COCINAS/img-006.jpg', title: 'Cocina Antracita & Roble', desc: 'Vitrinas aéreos iluminadas y torre de hornos' },
  { img: '/images/catalog/extracted_DE_COCINAS/img-007.jpg', title: 'Cocina Integral Minimalista', desc: 'Herrajes Blum con cierre amortiguado' },
];

export function CampaignShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % KITCHEN_SLIDES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const whatsappUrl = whatsappHref(
    SITE.phone,
    '¡Hola Modulares GM! Me interesa la Campaña Navidad 2026 para renovar mi cocina. Quisiera asesoría técnica y cotización.'
  );

  return (
    <section
      aria-label="Campaña Exclusiva Navidad 2026"
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] border border-secondary/30 bg-[#0C1318] p-6 sm:p-12 lg:p-16 text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
        {/* Glow ambiental dorado */}
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-secondary/15 blur-3xl z-10" />

        {/* --- VISTA MÓVIL: Carrusel de Cocinas en Fondo Completo + Texto Superpuesto --- */}
        <div className="lg:hidden relative isolate -m-6 sm:-m-12 p-6 sm:p-12 overflow-hidden flex flex-col justify-between min-h-[560px]">
          {/* Fondo del Carrusel Móvil */}
          <div className="absolute inset-0 -z-20">
            {KITCHEN_SLIDES.map((slide, idx) => (
              <Image
                key={slide.img}
                src={slide.img}
                alt={slide.title}
                fill
                sizes="100vw"
                className={`object-cover transition-opacity duration-1000 ${
                  idx === activeIdx ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
          {/* Dark Overlay en Móvil */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/95 via-black/75 to-black/50" />

          {/* Contenido Móvil Superpuesto */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary flex items-center gap-1">
                <Sparkles size={12} /> CAMPAÑA NAVIDAD 2026
              </span>
            </div>

            <h2 className="font-headline text-3xl font-normal text-white mb-3 leading-tight">
              ¿Cocina nueva para Navidad?
            </h2>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-secondary/40 text-stone-100 text-xs font-medium mb-4 backdrop-blur-md">
              <Calendar size={14} className="text-secondary shrink-0" />
              <span>Aprueba hasta el <strong className="text-secondary">13 de nov</strong></span>
            </div>

            <p className="text-stone-200 text-xs font-light leading-relaxed mb-4">
              Fabricación en <strong className="text-white">15 a 20 días hábiles</strong> con levantamiento 3D, herrajes alemanes y montaje garantizado.
            </p>

            <div className="space-y-1.5 text-xs text-stone-200 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-secondary shrink-0" />
                <span>Mesones en Cuarzo Calacatta & Dekton</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-secondary shrink-0" />
                <span>Melamina RH hidrófuga 18mm Pelikano</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-3 pt-4 border-t border-white/20">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#1b736b] active:bg-[#155b55] text-white text-xs font-bold shadow-lg"
            >
              <MessageCircle size={16} className="text-emerald-300" />
              <span>Escríbenos por WhatsApp 096 306 4374</span>
            </a>
            <Link
              href="/cocinas"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/30 bg-black/40 text-white text-xs font-semibold backdrop-blur-md"
            >
              <span>Explorar Modelos de Cocina</span>
              <ArrowRight size={14} className="text-secondary" />
            </Link>
          </div>
        </div>

        {/* --- VISTA ESCRITORIO: Dossier Izquierda + Carrusel Dedicado de Cocinas a la Derecha --- */}
        <div className="hidden lg:grid grid-cols-12 gap-12 items-center">
          {/* Columna Izquierda: Dossier Editorial */}
          <div className="col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono tracking-[0.25em] uppercase text-secondary/90 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-secondary" />
                  ( (06)13 · CAMPAÑA NAVIDAD 2026
                </span>
                <span className="h-px flex-1 max-w-[80px] bg-secondary/30" />
              </div>

              <h2 className="font-headline text-4xl lg:text-5xl font-normal tracking-tight text-white mb-5 leading-[1.12]">
                ¿Cocina nueva para Navidad?
              </h2>

              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-gradient-to-r from-secondary/25 via-secondary/15 to-transparent border border-secondary/40 text-stone-100 text-sm font-medium mb-6 shadow-sm">
                <Calendar size={16} className="text-secondary shrink-0" />
                <span>
                  Aprueba tu diseño hasta el <strong className="text-secondary font-bold">13 de noviembre</strong>
                </span>
              </div>

              <p className="text-stone-300 text-base font-light leading-relaxed mb-6 max-w-xl">
                Fabricación de alta precisión en <strong className="text-white font-medium">15 a 20 días hábiles</strong> con levantamiento planimétrico 3D, herrajes alemanes de cierre suave y montaje técnico garantizado en todo Ecuador.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8 text-xs text-stone-300">
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

            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { location: 'campana_navidad_showcase' })}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full bg-[#1b736b] hover:bg-[#155b55] text-white text-sm font-bold shadow-lg transition-all active:scale-95 group"
              >
                <MessageCircle size={18} className="text-emerald-300" />
                <span>Escríbenos por WhatsApp 096 306 4374</span>
              </a>

              <Link
                href="/cocinas"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-white/20 hover:border-secondary/60 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all active:scale-95"
              >
                <span>Explorar Modelos de Cocina</span>
                <ArrowRight size={14} className="text-secondary" />
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Carrusel Dinámico Dedicado de Cocinas */}
          <div className="col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-md aspect-[9/16] max-h-[500px] rounded-3xl overflow-hidden border border-secondary/40 shadow-[0_20px_50px_rgba(0,0,0,0.6)] group">
              {KITCHEN_SLIDES.map((slide, idx) => (
                <div
                  key={slide.img}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === activeIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={slide.img}
                    alt={slide.title}
                    fill
                    sizes="40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-none" />

                  <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono tracking-widest text-secondary uppercase">
                    ✦ Edición Limitada #{idx + 1}
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-20 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary block">
                      Modulares GM · Cocinas
                    </span>
                    <h3 className="text-lg font-headline font-semibold text-white mt-0.5">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-stone-300 font-light mt-0.5">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Controles del carrusel de cocinas */}
            <div className="flex items-center gap-1.5 mt-4">
              {KITCHEN_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeIdx ? 'w-6 bg-secondary' : 'w-2 bg-stone-600'
                  }`}
                  aria-label={`Ir a cocina ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
