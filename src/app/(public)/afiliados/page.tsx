import Link from 'next/link';
import { ArrowRight, Handshake, LineChart, Network, ShieldCheck, Wallet } from 'lucide-react';
import { AffiliateHero, type HeroCard } from '@/components/affiliates/affiliate-hero';
import { CardSlider, MediaCard } from '@/components/shared/card-slider';
import { AFFILIATE_AUDIENCES, AFFILIATE_FAQ, AFFILIATE_STEPS } from '@/lib/affiliate-content';
import { defaultServices } from '@/lib/data';
import { SITE_BASE } from '@/lib/site';

const hiRes = (url: string) => url.replace('w=500', 'w=1600').replace('q=60', 'q=72');

const PITCHES: Record<number, string> = {
  1: 'Tus contactos que están por remodelar su cocina son tu mejor oportunidad.',
  2: 'Mesones de cuarzo y granito: una recomendación natural en cada remodelación.',
  3: 'Clósets y vestidores a medida para quien estrena o renueva su hogar.',
  5: 'Baños renovados con muebles resistentes a la humedad.',
  6: 'Centros de entretenimiento con iluminación LED para salas modernas.',
};

const heroCards: HeroCard[] = defaultServices
  .filter((s) => PITCHES[s.id])
  .map((s) => ({ id: String(s.id), title: s.title, image: hiRes(s.imgUrl), caption: PITCHES[s.id], href: '/store', cta: 'Ver en la tienda' }));

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
      description: 'Regístrate gratis, comparte tu enlace y gana comisiones por cada venta de cocinas y muebles a medida.',
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

      <AffiliateHero cards={heroCards} />

      {/* Top High-Converting Call to Action Banner */}
      <section aria-label="Llamado a la acción principal" className="relative z-10 border-b border-stone-200 dark:border-stone-800 bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-14 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-5">
            ✨ Registro 100% Gratuito en 60 Segundos
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground max-w-3xl mx-auto leading-tight">
            Monetiza tus recomendaciones con la marca líder de mobiliario modular en Ecuador
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            Gana comisiones directas recomendando cocinas a medida, mesones de cuarzo y clósets de alta gama. Sin stock, sin costos y con panel de seguimiento en tiempo real.
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
              <span className="text-amber-500 font-bold">✓</span> Enlace y código rastreados
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="text-amber-500 font-bold">✓</span> Pagos directos a tu banco
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20" aria-labelledby="como-funciona">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">Tres pasos</p>
        <h2 id="como-funciona" className="mb-12 text-center font-headline text-3xl font-bold md:text-4xl">Cómo funciona el programa de afiliados</h2>
        <ol className="grid gap-6 md:grid-cols-3">
          {AFFILIATE_STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-3xl border bg-card p-8 shadow-sm">
              <span className="absolute right-6 top-4 font-headline text-6xl font-bold text-primary/10" aria-hidden>{i + 1}</span>
              <h3 className="mb-3 font-headline text-xl font-bold">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="relative z-10 bg-muted/50" aria-labelledby="que-recomendar">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">Catálogo</p>
          <h2 id="que-recomendar" className="mb-10 font-headline text-3xl font-bold md:text-4xl">Qué puedes recomendar a tus clientes</h2>
          <CardSlider label="Servicios que puedes recomendar" slideClassName="basis-[78%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            {defaultServices.map((s) => (
              <MediaCard key={s.id} image={s.imgUrl} title={s.title} description={s.desc} href="/store" cta="Ver en la tienda" />
            ))}
          </CardSlider>
        </div>
      </section>

      {/* Para quién es este programa - Carrusel Infinito */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20" aria-labelledby="para-quien">
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-600 dark:text-amber-400">Perfil ideal</p>
          <h2 id="para-quien" className="font-headline text-3xl font-bold md:text-4xl">Para quién es este programa</h2>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Si tu trabajo o tu red te ponen frente a personas que construyen, compran o remodelan, ya tienes la audiencia. Solo necesitas compartir tu enlace personal.
          </p>
        </div>

        <CardSlider label="Perfiles de afiliados" slideClassName="basis-[86%] sm:basis-[320px] lg:basis-[360px]" autoplay={true}>
          {AFFILIATE_AUDIENCES.map((a, idx) => (
            <article key={a.title} className="group relative flex h-full min-h-[220px] flex-col justify-between rounded-3xl border border-stone-200 dark:border-stone-800 bg-card/90 backdrop-blur p-7 shadow-sm transition hover:shadow-md hover:border-primary/40">
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
      </section>

      <section className="relative z-10 bg-foreground text-background" aria-labelledby="herramientas">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 id="herramientas" className="mb-12 max-w-2xl font-headline text-3xl font-bold md:text-4xl">Herramientas para vender desde el primer día</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-background/15 bg-background/5 p-6">
                <b.icon className="mb-4 text-amber-400" size={22} />
                <h3 className="mb-2 font-bold">{b.title}</h3>
                <p className="text-sm opacity-75">{b.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-6 py-20" aria-labelledby="faq-afiliados">
        <h2 id="faq-afiliados" className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">Preguntas frecuentes sobre el programa de afiliados</h2>
        <div className="divide-y rounded-2xl border bg-card">
          {AFFILIATE_FAQ.map((f) => (
            <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {f.q}
                <span className="text-primary transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom Final High-Converting CTA Banner */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 pb-24" aria-label="Registro final">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 p-8 sm:p-12 md:p-16 text-center text-white border border-stone-800 shadow-2xl">
          <Handshake className="absolute -bottom-8 -left-8 h-56 w-56 opacity-5 pointer-events-none" aria-hidden />
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400 mb-4">
            🚀 Únete a la red Modulares GM
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
        </div>
      </section>
    </>
  );
}
