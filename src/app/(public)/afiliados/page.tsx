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

      <aside aria-label="Resumen rápido" className="relative z-10 border-b bg-background">
        <div className="mx-auto max-w-4xl px-6 py-10 text-center">
          <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">
            El programa de afiliados de Modulares GM te permite ganar comisiones recomendando cocinas modulares, mesones de cuarzo, clósets y muebles a medida en Ecuador. Te registras gratis, recibes un enlace y un código personales, y ves tus ventas, tu red y tus retiros en un portal propio.
          </p>
        </div>
      </aside>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20" aria-labelledby="como-funciona">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.25em] text-secondary">Tres pasos</p>
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
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-secondary">Catálogo</p>
          <h2 id="que-recomendar" className="mb-10 font-headline text-3xl font-bold md:text-4xl">Qué puedes recomendar a tus clientes</h2>
          <CardSlider label="Servicios que puedes recomendar" slideClassName="basis-[78%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            {defaultServices.map((s) => (
              <MediaCard key={s.id} image={s.imgUrl} title={s.title} description={s.desc} href="/store" cta="Ver en la tienda" />
            ))}
          </CardSlider>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20" aria-labelledby="para-quien">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-secondary">Perfil ideal</p>
            <h2 id="para-quien" className="font-headline text-3xl font-bold md:text-4xl">Para quién es este programa</h2>
            <p className="mt-4 text-muted-foreground">Si tu trabajo te pone frente a personas que construyen, compran o remodelan, ya tienes la audiencia. Solo falta tu enlace.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-8">
            {AFFILIATE_AUDIENCES.map((a) => (
              <article key={a.title} className="rounded-2xl border bg-card p-6">
                <h3 className="mb-2 font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground">{a.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 bg-foreground text-background" aria-labelledby="herramientas">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h2 id="herramientas" className="mb-12 max-w-2xl font-headline text-3xl font-bold md:text-4xl">Herramientas para vender desde el primer día</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-2xl border border-background/15 bg-background/5 p-6">
                <b.icon className="mb-4 text-secondary" size={22} />
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
                <span className="text-secondary transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-primary p-10 text-center text-primary-foreground md:p-16">
          <Handshake className="absolute -bottom-8 -left-8 h-56 w-56 opacity-10" aria-hidden />
          <h2 className="relative font-headline text-3xl font-bold md:text-4xl">Empieza hoy con tu enlace personal</h2>
          <p className="relative mx-auto mt-4 max-w-xl opacity-90">Crear tu cuenta toma un minuto y no tiene costo.</p>
          <Link
            href="/afiliados/acceso?tab=registro"
            className="relative mt-8 inline-flex h-14 items-center gap-2 rounded-xl bg-secondary px-8 font-bold text-secondary-foreground transition hover:brightness-110 active:scale-95"
          >
            Crear mi cuenta de afiliado <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  );
}
