import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  MessageCircle,
  Truck,
  HardHat,
  Ruler,
  Layers,
  Clock,
  FileCheck
} from 'lucide-react';
import { SITE, whatsappHref } from '@/lib/site';
import { CorporateHero } from '@/components/corporate/corporate-hero';
import { CorporateSectorsGrid } from '@/components/corporate/corporate-sectors-grid';
import { B2BForm } from './b2b-form';

export const metadata: Metadata = {
  title: 'Mobiliario para Constructoras y Empresas en Ecuador | Modulares GM',
  description: 'Soluciones integrales de mobiliario modular, diseño y adecuación de espacios para constructoras, arquitectos, empresas e instituciones en Ecuador.',
  alternates: {
    canonical: 'https://www.modularesgm.com/empresas',
  },
  openGraph: {
    title: 'Mobiliario para Constructoras y Empresas en Ecuador | Modulares GM',
    description: 'Diseñamos espacios. Fabricamos oportunidades. Capacidad de planta en Quito y cobertura nacional para proyectos B2B.',
    url: 'https://www.modularesgm.com/empresas',
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

export default function EmpresasPage() {
  const whatsappUrl = whatsappHref(
    SITE.phone,
    '¡Hola Modulares GM! Me comunico desde la sección B2B Empresas para solicitar una propuesta corporativa para un proyecto constructivo/institucional.'
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Schema.org B2B Service */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'División Corporativa y B2B Modulares GM',
            provider: {
              '@type': 'LocalBusiness',
              name: 'Modulares GM',
              url: 'https://www.modularesgm.com',
              telephone: SITE.phone,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Quito',
                addressRegion: 'Pichincha',
                addressCountry: 'EC',
              },
            },
            areaServed: {
              '@type': 'Country',
              name: 'Ecuador',
            },
            description: 'Fabricación y suministro de mobiliario modular a gran escala para constructoras, arquitectos y empresas en Ecuador.',
          }),
        }}
      />

      {/* 1. Nuevo Hero Cinematográfico Empresarial */}
      <CorporateHero
        badge="DIVISIÓN CORPORATIVA · PROYECTOS B2B"
        title="Diseñamos espacios."
        highlightedTitle="Fabricamos oportunidades."
        subtitle="Soluciones integrales de mobiliario, diseño y adecuación de espacios para constructoras, arquitectos, empresas e instituciones en Ecuador."
        primaryCtaText="Solicitar propuesta empresarial"
        primaryCtaHref="#formulario-b2b"
        secondaryCtaText="Explorar soluciones corporativas"
        secondaryCtaHref="#sectores-corporativos"
        bgImage="/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp"
      />

      {/* Franja Editorial de Capacidades Verificadas */}
      <section className="border-b border-border/70 bg-stone-100/70 dark:bg-[#0c0e12] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">18+ Años en Ecuador</p>
                <p className="text-xs text-muted-foreground">Trayectoria en manufactura modular</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Cobertura Nacional</p>
                <p className="text-xs text-muted-foreground">Instalación técnica en obra</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Ruler size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Corte CNC Automatizado</p>
                <p className="text-xs text-muted-foreground">Tolerancia milimétrica en taller</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 justify-center sm:justify-start">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FileCheck size={20} />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">Contrato & Garantía</p>
                <p className="text-xs text-muted-foreground">Cronogramas por escrito sin retrasos</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Sección de las Seis Líneas Empresariales con Galería Asimétrica */}
      <CorporateSectorsGrid />

      {/* 3. Formulario de Contacto Empresarial Equilibrado */}
      <section id="formulario-b2b" className="py-20 lg:py-28 bg-background scroll-mt-24 border-t border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            {/* Columna Izquierda: Presentación Comercial y Proceso */}
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md shadow-sm">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-4">
                  Hablemos de tu próximo proyecto
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-headline tracking-tight text-foreground mb-3 leading-tight">
                  Las grandes transformaciones comienzan con una conversación.
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                  Cuéntanos qué necesita tu empresa. Analizaremos el alcance, las características y las posibilidades de fabricación para preparar una propuesta adaptada a tu proyecto.
                </p>

                <div className="space-y-4 pt-4 border-t border-border/60">
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                    ¿Qué sucede después de enviar tu solicitud?
                  </p>
                  <ol className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary font-mono">01.</span>
                      <span>Revisamos tus requerimientos y alcance.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary font-mono">02.</span>
                      <span>Analizamos especificaciones y memorias técnicas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary font-mono">03.</span>
                      <span>Coordinamos una reunión o visita técnica en obra.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold text-primary font-mono">04.</span>
                      <span>Preparamos una propuesta económica desglosada.</span>
                    </li>
                  </ol>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                    Atención Empresarial Directa
                  </span>
                  <a href="tel:+593962524311" className="text-sm font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5 mt-0.5">
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
                  <span>Hablar con un asesor</span>
                </a>
              </div>
            </div>

            {/* Columna Derecha: Formulario Interactivo */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <B2BForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

