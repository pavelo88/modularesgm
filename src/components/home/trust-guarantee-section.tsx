'use client';

import { ShieldCheck, Clock, Ruler, Award, CheckCircle2, MessageCircle, Sparkles } from 'lucide-react';
import { SITE, whatsappHref } from '@/lib/site';
import { track } from '@/lib/analytics';
import { useSiteContent } from '@/context/site-content-provider';
import { ScrollReveal, ScrollRevealGroup } from '@/components/shared/scroll-reveal';

const GUARANTEES = [
  {
    icon: Ruler,
    title: 'Visita Técnica & Render 3D Gratis',
    subtitle: 'Sin costo ni compromiso en Quito y Valles',
    desc: 'Un arquitecto de nuestro equipo visita tu espacio, toma medidas milimétricas y te entrega una visualización 3D fotorrealista para que veas el resultado antes de invertir.',
    badge: 'Oferta 100% Sin Riesgo',
  },
  {
    icon: Clock,
    title: 'Fecha de Entrega por Escrito',
    subtitle: 'Entre 15 y 20 días hábiles desde la aprobación del diseño',
    desc: 'Erradicamos la informalidad del gremio. Tu fecha de entrega queda registrada en el contrato antes de fabricar, para que sepas exactamente cuándo llega tu proyecto.',
    badge: 'Cero Retrasos',
  },
  {
    icon: Award,
    title: 'Fabricantes Directos con Taller en Quito',
    subtitle: 'Rosa Yeira 420 y Serpaio Japeravi',
    desc: 'Sin intermediarios ni comisiones de terceros. Puedes visitar nuestras instalaciones y ver tus tableros Pelikano RH y mesones de cuarzo siendo procesados con corte CNC.',
    badge: 'Taller Propio',
  },
  {
    icon: ShieldCheck,
    title: 'Garantía Escrita de 3 a 10 Años',
    subtitle: 'Según el producto. Herrajes Blum/Hafele y melamina RH',
    desc: 'Estructuras reforzadas de 18mm resistentes a la humedad, cantos gruesos termoencolados a presión y bisagras con amortiguación garantizadas de por vida.',
    badge: 'Calidad Certificada',
  },
];

export function TrustGuaranteeSection() {
  const { siteContent } = useSiteContent();
  const contactPhone = siteContent?.whatsappNumber || SITE.phone;

  const handleWhatsappVisit = () => {
    track('whatsapp_click', { location: 'trust_guarantee', topic: 'visita_tecnica' });
    const msg = '¡Hola Modulares GM! Quisiera solicitar la visita técnica y el diseño 3D sin costo para mi proyecto en Quito. ¿Qué días tienen disponibilidad?';
    window.open(whatsappHref(contactPhone, msg), '_blank');
  };

  return (
    <section className="relative z-10 py-16 lg:py-24 bg-stone-100/60 dark:bg-[#0c1014] border-y border-stone-200/80 dark:border-stone-800/80" aria-label="Garantías y Diferenciales Oficiales de Modulares GM">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera de la Sección con ScrollReveal */}
        <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-extrabold uppercase tracking-[0.2em] mb-3 backdrop-blur-md">
            <Sparkles size={13} className="shrink-0" />
            <span>Por qué elegir a Modulares GM</span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 dark:text-white leading-[1.15]">
            {siteContent?.trustTitle || 'Tranquilidad absoluta para tu hogar.'}
            <span className="block text-primary text-2xl sm:text-3xl lg:text-4xl mt-1">
              {siteContent?.trustSubtitle || 'Cero informalidad, cero retrasos y contrato legal.'}
            </span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
            Sabemos que el mayor miedo al mandar a hacer muebles en Ecuador es que te cobren el anticipo y no te cumplan. 
            En Modulares GM blindamos tu inversión con compromisos reales por escrito.
          </p>
        </ScrollReveal>

        {/* Grilla de 4 Garantías Blindadas con Cascada Animada */}
        <ScrollRevealGroup staggerMs={80} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {GUARANTEES.map((g) => (
            <div
              key={g.title}
              className="group relative flex flex-col justify-between rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#12161b] p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 h-full"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-primary flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <g.icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                    {g.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-950 dark:text-white leading-snug">
                  {g.title}
                </h3>
                <p className="text-xs font-semibold text-primary mt-1">
                  {g.subtitle}
                </p>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2.5 leading-relaxed">
                  {g.desc}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} className="shrink-0" />
                <span>Garantizado 100% en cotización</span>
              </div>
            </div>
          ))}
        </ScrollRevealGroup>

        {/* Barra de Acción Rápida (CTA de Cierre de Fricción) con ScrollReveal */}
        <ScrollReveal direction="zoom" delay={120} className="mt-12 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-4 text-left">
            <div className="h-12 w-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <MessageCircle size={24} />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-bold text-stone-950 dark:text-white">
                ¿Quieres saber cuánto costaría tu cocina o clóset?
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300">
                Envíanos tus medidas aproximadas o fotos de tu espacio por WhatsApp y recibe asesoría en menos de 15 minutos.
              </p>
            </div>
          </div>

          <button
            onClick={handleWhatsappVisit}
            type="button"
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm shadow-[0_8px_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
          >
            <MessageCircle size={18} />
            <span>Agendar Visita & Render 3D Gratis</span>
          </button>
        </ScrollReveal>

      </div>
    </section>
  );
}
