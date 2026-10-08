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
        <div className="mb-14 sm:mb-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-stone-300/80 bg-white/70 dark:border-stone-800 dark:bg-stone-900/60 backdrop-blur-md mb-4 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone-700 dark:text-stone-300">
              Atelier & Asesoría Arquitectónica
            </span>
          </div>

          <h2 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 dark:text-stone-100 mb-5 leading-[1.15]">
            {siteContent.formTitle || 'Hablemos de su Próximo Espacio'}
          </h2>

          <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 font-light leading-relaxed">
            {siteContent.formSubtitle ||
              'De la concepción planimétrica a la instalación milimétrica de cuarzos y mobiliario modular. Permítanos materializar su visión.'}
          </p>

          {/* Regla arquitectónica con detalles de precisión */}
          <div className="mt-8 flex items-center justify-center gap-3 text-stone-300 dark:text-stone-800">
            <span className="h-px w-16 bg-current" />
            <span className="text-[10px] uppercase tracking-widest font-mono text-stone-400 dark:text-stone-600">
              01 // CONSULTA TÉCNICA
            </span>
            <span className="h-px w-16 bg-current" />
          </div>
        </div>

        {/* Estructura en Proporciones Áureas: Dossier del Atelier (5) + Formulario Esculpido (7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Columna Izquierda: Atelier, Canales Directos, Estándares & Mapa */}
          <div className="lg:col-span-5 flex flex-col">
            <ContactInfo
              whatsappNumber={siteContent.whatsappNumber}
              address={siteContent.address}
              mapUrl={siteContent.mapUrl}
              socialUrls={siteContent.socialUrls}
            />
          </div>

          {/* Columna Derecha: Formulario Esculpido de Alta Precisión */}
          <div className="lg:col-span-7 flex flex-col">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
