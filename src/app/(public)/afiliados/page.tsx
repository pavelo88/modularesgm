import Link from 'next/link';
import { ArrowRight, Handshake, LineChart, Network, ShieldCheck, Wallet, Sparkles, DollarSign, Award, Gift } from 'lucide-react';
import { AffiliateHero, type PartnerSlide } from '@/components/affiliates/affiliate-hero';
import { CommissionSimulator } from '@/components/affiliates/commission-simulator';
import { CardSlider, MediaCard } from '@/components/shared/card-slider';
import { ScrollReveal, ScrollRevealGroup } from '@/components/shared/scroll-reveal';
import { AFFILIATE_AUDIENCES, AFFILIATE_FAQ, AFFILIATE_STEPS } from '@/lib/affiliate-content';
import { SITE_BASE } from '@/lib/site';

// Fotografías de equipos reales de trabajo y aliados profesionales en Ecuador
const partnerSlides: PartnerSlide[] = [
  {
    image: '/images/heroes/afiliados-emprendedores.webp',
    label: 'Emprendedores y Redes de Venta por WhatsApp',
  },
  {
    image: '/images/heroes/afiliados-arquitectos.webp',
    label: 'Arquitectos y Diseñadores de Interiores',
  },
  {
    image: '/images/heroes/afiliados-inmobiliarios.webp',
    label: 'Inmobiliarias y Corredores de Bienes Raíces',
  },
  {
    image: '/images/heroes/afiliados-instaladores.webp',
    label: 'Técnicos e Instalación en Obra',
  },
  {
    image: '/images/heroes/afiliados-arquitectos-studio.webp',
    label: 'Estudios de Arquitectura Interior',
  },
];

// Servicios destacados para recomendar en el catálogo
const recommendedProducts = [
  {
    title: 'Cocina Cappuccino Luxury con Isla',
    desc: 'Melamina Pelikano RH 18mm con mesón en cuarzo blanco. 10% de comisión directa sobre el proyecto.',
    imgUrl: '/images/heroes/hero-home-cocina.webp',
    href: '/cocinas',
  },
  {
    title: 'Walk-in Closet Boutique con Vidrio Bronce',
    desc: 'Perfilería de aluminio, iluminación cálida 3000K y pantaloneras. 10% de comisión directa.',
    imgUrl: '/images/heroes/hero-home-closet.webp',
    href: '/closets',
  },
  {
    title: 'Mesón de Cuarzo Calacatta Gold',
    desc: 'Cascada ingleteada computarizada CNC con zócalo integrado. 10% de comisión directa.',
    imgUrl: '/images/heroes/gallery-home-cocina-2.webp',
    href: '/catalogo',
  },
  {
    title: 'Counter de Recepción Corporativo Monolítico',
    desc: 'Diseño curvo con luces indirectas para empresas e instituciones. 10% de comisión directa.',
    imgUrl: '/images/heroes/hero-atencion.webp',
    href: '/muebles-oficina',
  },
  {
    title: 'Vanity Spa Flotante en Roble Gris RH',
    desc: 'Resistente a humedad y vapor con lavamanos de sobreponer. 10% de comisión directa.',
    imgUrl: '/images/heroes/gallery-atencion-2.webp',
    href: '/muebles-bano',
  },
  {
    title: 'Puerta Monumental Pivotante de 2.80m',
    desc: 'Pivote axial de acero inoxidable y cerradura digital. 10% de comisión directa.',
    imgUrl: '/images/heroes/hero-arquitectos.webp',
    href: '/puertas',
  },
];

const benefits = [
  { icon: Network, title: 'Enlace y código únicos', text: 'Cada venta llega atribuida a tu nombre, incluso si el cliente compra días después.' },
  { icon: LineChart, title: 'Panel en tiempo real', text: 'Clics, conversión, ventas y comisiones actualizados sin pedir reportes.' },
  { icon: Wallet, title: 'Retiros claros', text: 'Solicitas tu pago desde el panel y sigues el estado de cada solicitud.' },
  { icon: ShieldCheck, title: 'Cuenta protegida', text: 'Acceso con contraseña personal y sesión segura para tus datos y ganancias.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_BASE}/afiliados#webpage`,
      url: `${SITE_BASE}/afiliados`,
      name: 'Programa de afiliados de Modulares GM',
      description: 'Regístrate gratis, comparte tu enlace y gana el 10% de comisión por cada recomendación de cocinas y muebles a medida.',
      inLanguage: 'es-EC',
      isPartOf: { '@id': `${SITE_BASE}/#website` },
      about: { '@id': `${SITE_BASE}/#business` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_BASE },
        { '@type': 'ListItem', position: 2, name: 'Trabaja con nosotros', item: `${SITE_BASE}/afiliados` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: AFFILIATE_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

export default function AffiliatesLandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div id="top" />

      <AffiliateHero slides={partnerSlides} />

      {/* Simulador Interactivo de Comisiones Oficial Plan 10-3-2 */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 mb-16" aria-label="Simulador de Ganancias">
        <ScrollReveal direction="up" delay={50}>
          <CommissionSimulator />
        </ScrollReveal>
      </section>

      {/* Top High-Converting Call to Action Banner con ScrollReveal */}
      <section aria-label="Llamado a la acción principal" className="relative z-10 border-b border-stone-200 dark:border-stone-800 bg-background/95 backdrop-blur-md">
        <ScrollReveal direction="up" className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-5">
            <Sparkles size={13} className="text-amber-500" />
            <span>Registro 100% Gratuito en 60 Segundos</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
            Monetiza tus contactos con la marca de mobiliario más prestigiosa de Ecuador
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Recomienda cocinas de alta gama, mesones de cuarzo y clósets a medida. Cada venta te acredita el <strong className="text-amber-500 font-semibold">10% directo</strong> y tu cliente ahorra un <strong className="text-emerald-500 font-semibold">5%</strong> con tu código. Sin trámites ni inventario.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/afiliados/acceso?tab=registro"
              className="group relative inline-flex w-full sm:w-auto h-16 items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 px-8 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4),0_0_0_1px_rgba(255,255,255,0.35)_inset] transition-all duration-200 active:scale-95"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-sm font-extrabold uppercase tracking-wide drop-shadow-xs">Afiliarme Gratis</span>
                <span className="text-[11px] font-semibold text-stone-900/80">Comisiones directas del 10% · Sin inversión</span>
              </div>
              <ArrowRight size={18} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/afiliados/acceso?tab=login"
              className="group relative inline-flex w-full sm:w-auto h-16 items-center justify-center gap-2 rounded-2xl border border-stone-300/80 dark:border-stone-700/80 bg-stone-100/60 dark:bg-stone-900/60 backdrop-blur-xl hover:bg-stone-200/60 dark:hover:bg-stone-800/60 px-7 text-foreground shadow-[0_4px_16px_rgba(0,0,0,0.06),0_0_0_1px_rgba(255,255,255,0.08)_inset] transition-all duration-200 active:scale-95"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-xs font-semibold text-muted-foreground">¿Ya tienes cuenta?</span>
                <span className="text-xs font-bold text-foreground">Iniciar Sesión</span>
              </div>
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-500 font-bold">✓</span> Cero inversión o inventario
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-500 font-bold">✓</span> Enlace y código rastreados 30 días
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-500 font-bold">✓</span> Pagos directos a tu banco en Ecuador
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Sección Paso a Paso con Cascada Animada */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20" aria-labelledby="como-funciona">
        <ScrollReveal direction="up" className="text-center mb-12">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">Paso a paso</p>
          <h2 id="como-funciona" className="font-headline text-3xl font-bold md:text-4xl">Cómo funciona el sistema de afiliados</h2>
        </ScrollReveal>

        <ScrollRevealGroup staggerMs={100} className="grid gap-6 md:grid-cols-3">
          {AFFILIATE_STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-3xl border border-stone-200 dark:border-stone-800 bg-card p-8 shadow-sm transition-all hover:shadow-xl hover:border-amber-500/30 hover:-translate-y-1 h-full flex flex-col justify-between">
              <div>
                <span className="absolute right-6 top-4 font-headline text-6xl font-bold text-primary/10 select-none" aria-hidden>{i + 1}</span>
                <h3 className="mb-3 font-headline text-xl font-bold text-foreground">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </ScrollRevealGroup>
      </section>

      {/* Qué puedes recomendar con comisiones reales */}
      <section className="relative z-10 bg-muted/40 border-y border-stone-200 dark:border-stone-800" aria-labelledby="que-recomendar">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <ScrollReveal direction="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">Catálogo de Alta Demanda</p>
              <h2 id="que-recomendar" className="font-headline text-3xl font-bold md:text-4xl">Qué productos puedes recomendar hoy</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl">
                Nuestras líneas cuentan con alta demanda tanto en remodelaciones residenciales como corporativas, garantizándote el 10% directo de comisión.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="zoom" delay={100}>
            <CardSlider label="Servicios que puedes recomendar" slideClassName="basis-[82%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/3">
              {recommendedProducts.map((p) => (
                <MediaCard key={p.title} image={p.imgUrl} title={p.title} description={p.desc} href={p.href} cta="Ver línea completa" />
              ))}
            </CardSlider>
          </ScrollReveal>
        </div>
      </section>

      {/* Para quién es este programa - Carrusel Infinito */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="para-quien">
        <ScrollReveal direction="up" className="mb-10 text-center max-w-3xl mx-auto">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">Perfil ideal</p>
          <h2 id="para-quien" className="font-headline text-3xl font-bold md:text-4xl">Para quién es este programa</h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Si tu trabajo o tu red te ponen frente a personas que construyen, compran o remodelan, ya tienes la audiencia. Solo necesitas compartir tu enlace personal.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={80}>
          <CardSlider label="Perfiles de afiliados" slideClassName="basis-[86%] sm:basis-[320px] lg:basis-[360px]" autoplay={true}>
            {AFFILIATE_AUDIENCES.map((a, idx) => (
              <article key={a.title} className="group relative flex h-full min-h-[220px] flex-col justify-between rounded-3xl border border-stone-200 dark:border-stone-800 bg-card/90 backdrop-blur p-7 shadow-sm transition hover:shadow-xl hover:border-primary/40 hover:-translate-y-1">
                <div>
                  <span className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-sm">
                    0{idx + 1}
                  </span>
                  <h3 className="mb-2 font-headline text-lg sm:text-xl font-bold text-foreground">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline">
                  <Link href="/afiliados/acceso?tab=registro" className="inline-flex items-center gap-1.5">
                    <span>Comenzar ahora</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </CardSlider>
        </ScrollReveal>
      </section>

      {/* Herramientas para vender con animación */}
      <section className="relative z-10 bg-foreground text-background" aria-labelledby="herramientas">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <ScrollReveal direction="up">
            <h2 id="herramientas" className="mb-12 max-w-2xl font-headline text-3xl font-bold md:text-4xl">Herramientas para vender desde el primer día</h2>
          </ScrollReveal>
          
          <ScrollRevealGroup staggerMs={80} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-background/15 bg-background/5 p-6 hover:border-amber-400/40 transition-colors">
                <b.icon className="mb-4 text-amber-400" size={22} />
                <h3 className="mb-2 font-bold">{b.title}</h3>
                <p className="text-sm opacity-75">{b.text}</p>
              </div>
            ))}
          </ScrollRevealGroup>
        </div>
      </section>

      {/* Preguntas frecuentes con ScrollReveal */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-20" aria-labelledby="faq-afiliados">
        <ScrollReveal direction="up">
          <h2 id="faq-afiliados" className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">Preguntas frecuentes sobre el programa de afiliados</h2>
          <div className="divide-y rounded-2xl border bg-card shadow-sm">
            {AFFILIATE_FAQ.map((f) => (
              <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}
                  <span className="text-primary transition-transform duration-200 group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Bottom Final High-Converting CTA Banner con zoom reveal */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pb-24" aria-label="Registro final">
        <ScrollReveal direction="zoom" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-8 sm:p-12 md:p-16 text-center text-white border border-stone-800 shadow-2xl">
          <Handshake className="absolute -bottom-8 -left-8 h-56 w-56 opacity-5 pointer-events-none" aria-hidden />
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            <Sparkles size={13} className="text-amber-400" />
            <span>Únete a la red Modulares GM</span>
          </div>
          <h2 className="relative font-headline text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Empieza hoy a generar comisiones con tu enlace personal
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-stone-300 text-base sm:text-lg">
            Crear tu cuenta toma menos de un minuto. Recibe tu código de afiliado y empieza a compartirlo de inmediato.
          </p>
          <div className="relative mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto">
            <Link
              href="/afiliados/acceso?tab=registro"
              className="group relative inline-flex w-full sm:w-auto h-16 items-center justify-center gap-3.5 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 px-8 shadow-[0_10px_25px_-5px_rgba(245,158,11,0.4),0_0_0_1px_rgba(255,255,255,0.35)_inset] transition-all duration-200 active:scale-95"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-sm font-extrabold uppercase tracking-wide drop-shadow-xs">Crear Mi Cuenta Gratis</span>
                <span className="text-[11px] font-semibold text-stone-900/80">Código y panel listos en 60 segundos</span>
              </div>
              <ArrowRight size={18} className="shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/afiliados/acceso?tab=login"
              className="group relative inline-flex w-full sm:w-auto h-16 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl hover:bg-white/15 px-7 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.1)_inset] transition-all duration-200 active:scale-95"
            >
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left leading-tight">
                <span className="text-xs font-semibold text-stone-300">¿Ya tienes cuenta?</span>
                <span className="text-xs font-bold text-white">Iniciar Sesión</span>
              </div>
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
