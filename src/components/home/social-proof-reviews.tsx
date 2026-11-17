'use client';

import { Star, ShieldCheck, MapPin, CheckCircle2, MessageSquare, Quote } from 'lucide-react';
import Image from 'next/image';

const TESTIMONIALS = [
  {
    name: 'Arq. Gabriela Enríquez',
    location: 'Cumbayá, Edificio La Pradera',
    project: 'Cocina Integral con Isla de Cuarzo Calacatta',
    text: 'Como arquitecta soy sumamente exigente con los cortes ingleteados del cuarzo y el calibre de los tableros. Modulares GM cumplió la entrega al día 16 sin un solo retraso. Las bisagras de cierre suave quedaron milimétricas.',
    rating: 5,
    tag: 'Cliente Verificado',
    date: 'Octubre 2026',
    initials: 'GE',
  },
  {
    name: 'Ing. Fernando Carrión',
    location: 'Monteserrín, Quito Norte',
    project: 'Remodelación Total: Cocina & Walk-in Closet',
    text: 'Venía de una pésima experiencia con un carpintero que me cobró anticipo y desapareció 3 semanas. Con Modulares GM firmamos contrato con fecha fija. Vinieron a tomar medidas con láser y el render 3D fue idéntico a lo instalado.',
    rating: 5,
    tag: 'Cliente Verificado',
    date: 'Septiembre 2026',
    initials: 'FC',
  },
  {
    name: 'Dra. Patricia Morales',
    location: 'Valle de los Chillos, San Rafael',
    project: 'Clóset Principal & Muebles de Baño Flotantes',
    text: 'La melamina Pelikano RH que me recomendaron para el baño es una maravilla, cero problemas con el vapor de la ducha. La atención por WhatsApp fue inmediata desde el primer contacto.',
    rating: 5,
    tag: 'Cliente Verificado',
    date: 'Octubre 2026',
    initials: 'PM',
  },
];

export function SocialProofReviews() {
  return (
    <section className="relative z-10 py-16 lg:py-24 bg-white dark:bg-[#101317]" aria-label="Opiniones de Clientes en Quito y Valles">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Editorial */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-extrabold uppercase tracking-[0.18em] mb-2.5">
              <CheckCircle2 size={13} />
              <span>Experiencias Reales en Pichincha</span>
            </div>
            <h2 className="font-headline text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 dark:text-white">
              Obras entregadas, clientes satisfechos.
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Más de 980 proyectos fabricados en nuestro taller y montados a la perfección en Quito y Valles.
            </p>
          </div>

          {/* Rating Resumen Google */}
          <div className="flex items-center gap-3 bg-stone-50 dark:bg-[#161a20] px-4 py-3 rounded-2xl border border-stone-200 dark:border-stone-800 shrink-0">
            <div className="flex gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <div className="text-left text-xs">
              <p className="font-bold text-stone-900 dark:text-stone-100">4.9 / 5.0 en Satisfacción</p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">Garantía y entrega certificada</p>
            </div>
          </div>
        </div>

        {/* Tarjetas de Testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="relative flex flex-col justify-between rounded-3xl border border-stone-200 dark:border-stone-800/80 bg-stone-50/70 dark:bg-[#14181e] p-6 lg:p-7 shadow-sm hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                    {t.tag}
                  </span>
                </div>

                <Quote size={24} className="text-stone-300 dark:text-stone-700 mb-2 opacity-50" />

                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/60 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-stone-950 dark:text-white truncate">
                      {t.name}
                    </h3>
                    <p className="text-[11px] font-medium text-primary truncate flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" />
                      {t.location}
                    </p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                      {t.project}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
