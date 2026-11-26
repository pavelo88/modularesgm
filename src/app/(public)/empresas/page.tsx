import type { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Layers, 
  FileCheck, 
  Users2, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  MessageCircle,
  Truck,
  HardHat,
  Ruler
} from 'lucide-react';
import { SITE, whatsappHref } from '@/lib/site';
import { B2BForm } from './b2b-form';

export const metadata: Metadata = {
  title: 'Mobiliario para Constructoras y Empresas en Ecuador | Modulares GM',
  description: 'Fabricación de mobiliario modular a gran escala para constructoras, arquitectos, hoteles, oficinas e instituciones. Capacidad de planta en Quito y cobertura nacional.',
  alternates: {
    canonical: 'https://www.modularesgm.com/empresas',
  },
  openGraph: {
    title: 'Mobiliario para Constructoras y Empresas en Ecuador | Modulares GM',
    description: 'Soluciones B2B para edificación, hotelería y proyectos comerciales. Calidad Pelikano RH 18mm y herrajes europeos con garantía legal.',
    url: 'https://www.modularesgm.com/empresas',
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

const B2B_SOLUTIONS = [
  {
    title: 'Edificios & Constructoras',
    desc: 'Equipamiento integral en serie de cocinas, closets y vanities para torres residenciales y urbanizaciones con entregas escalonadas y cumplimiento de cronograma.',
    icon: Building2,
    badge: 'Proyectos Inmobiliarios',
  },
  {
    title: 'Arquitectos & Diseñadores',
    desc: 'Alianza técnica para fabricación exacta bajo planos planimétricos con optimización de costos de corte CNC y tarifas preferenciales de gremio.',
    icon: Ruler,
    badge: 'Alianza Profesional',
  },
  {
    title: 'Espacios Corporativos & Coworkings',
    desc: 'Estaciones de trabajo modulares, salas de conferencias, áreas de recepción y divisiones acústicas ergonómicas con cableado oculto.',
    icon: Briefcase,
    badge: 'Oficinas & Corporativo',
  },
  {
    title: 'Retail, Supermercados & Fruterías',
    desc: 'Góndolas metálicas modulares, perchas de alta carga, estanterías comerciales, fruteros y counters de atención al cliente de alto tráfico.',
    icon: Layers,
    badge: 'Comercial & Retail',
  },
  {
    title: 'Sector Salud & Odontología',
    desc: 'Mobiliario clínico, vanities sanitarios con topes antibacterianos en cuarzo y cajoneras médicas asépticas resistentes a desinfectantes y humedad.',
    icon: ShieldCheck,
    badge: 'Clínicas & Laboratorios',
  },
  {
    title: 'Institucional & Educativo',
    desc: 'Lockers modulares con cerradura inteligente, bibliotecas, pupitres ergonómicos y mobiliario robusto para colegios, universidades y entidades.',
    icon: Users2,
    badge: 'Educación & Gobierno',
  },
];

export default function EmpresasPage() {
  const whatsappUrl = whatsappHref(
    SITE.phone,
    '¡Hola Modulares GM! Me comunico desde la sección B2B Empresas para solicitar una propuesta corporativa para un proyecto constructivo/institucional.'
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
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
            description: 'Fabricación y suministro de mobiliario modular a gran escala para constructoras, arquitectos y comercios en Ecuador.',
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera Hero B2B */}
        <header className="mb-14 pb-10 border-b border-border/60">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-[11px] font-extrabold uppercase tracking-[0.2em] mb-4">
                <Sparkles size={13} className="text-primary" />
                División Corporativa & Proyectos B2B
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-foreground leading-[1.12]">
                Fabricación de Mobiliario a Escala para Constructoras e Instituciones
              </h1>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-normal">
                Capacidad industrial directa de taller en Quito para equipamiento de torres de departamentos, hoteles, locales comerciales y oficinas con entregas programadas en todo el Ecuador.
              </p>
              
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#formulario-b2b"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95"
                >
                  <span>Solicitar Propuesta para Proyecto</span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-6 py-3 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95"
                >
                  <MessageCircle size={16} />
                  <span>Atención Ejecutiva B2B</span>
                </a>
              </div>
            </div>

            {/* Badges de Confianza Industrial */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Clock size={18} />
                </div>
                <div className="text-xl font-black text-foreground">18+ Años</div>
                <div className="text-[11px] text-muted-foreground font-medium">Experiencia productiva</div>
              </div>
              <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                  <Truck size={18} />
                </div>
                <div className="text-xl font-black text-foreground">Nacional</div>
                <div className="text-[11px] text-muted-foreground font-medium">Cobertura y montaje</div>
              </div>
              <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                  <FileCheck size={18} />
                </div>
                <div className="text-xl font-black text-foreground">Contrato</div>
                <div className="text-[11px] text-muted-foreground font-medium">Garantía y facturación</div>
              </div>
              <div className="p-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm">
                <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                  <HardHat size={18} />
                </div>
                <div className="text-xl font-black text-foreground">Pelikano RH</div>
                <div className="text-[11px] text-muted-foreground font-medium">18mm hidrófugo grado pro</div>
              </div>
            </div>
          </div>
        </header>

        {/* Sectores y Soluciones */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary block mb-1">
              Líneas Industriales Especializadas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-headline tracking-tight text-foreground">
              Capacidad Técnica Adaptada a cada Industria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {B2B_SOLUTIONS.map((sol) => {
              const Icon = sol.icon;
              return (
                <div
                  key={sol.title}
                  className="p-6 rounded-3xl border border-border/70 bg-card/40 hover:bg-card/80 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-105">
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-full">
                        {sol.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">
                      {sol.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
                      {sol.desc}
                    </p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center text-xs font-bold text-primary gap-1 group-hover:underline">
                    <span>Ver especificaciones con un asesor</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Formulario Corporativo B2B */}
        <section id="formulario-b2b" className="scroll-mt-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md">
                <h3 className="text-2xl font-black font-headline tracking-tight text-foreground mb-3">
                  Inicia tu Cotización Corporativa
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6 font-normal">
                  Completa los datos de tu empresa y requerimiento. Un director técnico asignará prioridad a tu proyecto para revisión de planos, despiece y visita técnica in situ.
                </p>

                <div className="space-y-4 text-xs font-medium text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Sin necesidad de registro previo para la consulta inicial.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Precios profesionales confidenciales sujetos a volumen.</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    <span>Registro directo en el CRM comercial con trazabilidad completa.</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border/60">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Línea Directa de Contratos
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                    <PhoneCall size={16} className="text-primary" />
                    <a href={`tel:+${SITE.phone.replace(/\D/g, '')}`} className="hover:underline">
                      {SITE.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario Interactivo */}
            <div className="lg:col-span-7">
              <B2BForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
