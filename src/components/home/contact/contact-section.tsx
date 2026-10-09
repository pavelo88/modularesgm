import { ContactForm } from './contact-form';
import { ContactInfo } from './contact-info';
import type { SiteContent } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ContactSection({ siteContent }: { siteContent: SiteContent }) {
  return (
    <section
      id="contacto"
      className="relative z-10 px-4 py-20 sm:px-6 lg:px-8 bg-stone-50/50 dark:bg-[#0e1013]"
    >
      {/* Luz ambiental sutil inspirada en estudios arquitectónicos */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,_var(--tw-gradient-stops))] from-secondary/5 via-transparent to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl">
        {/* Cabecera Editorial de la Sección */}
        <div className="mb-10 sm:mb-14 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-stone-300 bg-white/90 dark:border-stone-800 dark:bg-stone-900/80 backdrop-blur-md mb-3 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100">
              Atelier & Asesoría Arquitectónica
            </span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-950 dark:text-white mb-3 leading-[1.15]">
            {siteContent.formTitle || 'Hablemos de su Próximo Espacio'}
          </h2>

          <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 font-normal leading-relaxed max-w-2xl mx-auto">
            {siteContent.formSubtitle ||
              'De la concepción planimétrica a la instalación milimétrica de cuarzos y mobiliario modular. Permítanos materializar su visión.'}
          </p>

          {/* Regla arquitectónica con detalles de precisión */}
          <div className="mt-5 flex items-center justify-center gap-3 text-stone-400 dark:text-stone-600">
            <span className="h-px w-16 bg-current" />
            <span className="text-[10px] uppercase tracking-widest font-mono font-bold text-stone-700 dark:text-stone-300">
              01 // CONSULTA TÉCNICA
            </span>
            <span className="h-px w-16 bg-current" />
          </div>
        </div>

        {/* Estructura en Proporciones Áureas: Dossier del Atelier (6) + Formulario Esculpido (6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Columna Izquierda: Atelier, Canales Directos, Estándares & Mapa */}
          <div className="lg:col-span-6 flex flex-col">
            <ContactInfo
              whatsappNumber={siteContent.whatsappNumber}
              address={siteContent.address}
              mapUrl={siteContent.mapUrl}
              socialUrls={siteContent.socialUrls}
            />
          </div>

          {/* Columna Derecha: Formulario Esculpido de Alta Precisión */}
          <div className="lg:col-span-6 flex flex-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
