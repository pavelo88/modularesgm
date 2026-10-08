import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { CATEGORIES_SEO } from '@/lib/catalog-full';
import { SITE_BASE } from '@/lib/site';
import { WhatsAppCta } from '@/components/shared/whatsapp-cta';

const TITLE = 'Precios de Cocinas Modulares en Quito 2026 | Modulares GM';
const DESCRIPTION =
  'Cuánto cuesta una cocina modular, un clóset o un mueble de baño en Quito. Precios de referencia desde $250 por metro lineal, qué influye en el valor y cómo cotizar gratis.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_BASE}/precios` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_BASE}/precios`, siteName: 'Modulares GM', locale: 'es_EC', type: 'article' },
};

/** Mismo orden que el catálogo; los rangos y garantías salen de CATEGORIES_SEO para no duplicar precios. */
const ROWS = ['cocinas', 'closets', 'muebles-bano', 'escritorios', 'muebles-oficina', 'puertas', 'gamer'].map((key) => CATEGORIES_SEO[key]).filter(Boolean);

const FACTORS = [
  { title: 'Metros lineales', text: 'Una cocina se cotiza por metro lineal de mueble, medido a lo largo de la pared. A más metros, mayor precio.' },
  { title: 'Muebles altos y torres', text: 'Los muebles bajos son la base. Alacenas, despensas y torres para horno o refrigeradora se suman según el diseño.' },
  { title: 'Mesón', text: 'El cuarzo, el granito y la piedra sinterizada tienen precios distintos. Se cotizan por medida.' },
  { title: 'Herrajes y accesorios', text: 'Bisagras y rieles de cierre lento, sistemas de elevación, organizadores e iluminación LED.' },
  { title: 'Material y acabado', text: 'Trabajamos con melamina resistente a la humedad de 18 mm en más de 20 acabados.' },
  { title: 'Ubicación', text: 'La medición en Quito no tiene costo. Para otras ciudades se coordina transporte e instalación.' },
];

const FAQ = [
  {
    q: '¿Cuánto cuesta el metro lineal de cocina modular en Quito?',
    a: 'En Modulares GM, los muebles bajos de cocina parten desde $250 por metro lineal. El precio final depende de los muebles altos, el mesón y los accesorios que elijas.',
  },
  {
    q: '¿Cuánto cuesta una cocina de 3 metros?',
    a: 'Solo los muebles bajos de una cocina lineal de 3 metros parten desde $750 (3 × $250). A eso se suman los muebles altos, el mesón y los accesorios según tu diseño.',
  },
  {
    q: '¿La medición y el diseño tienen costo?',
    a: 'No. Medimos tu espacio en Quito sin costo y te mostramos el diseño en 3D antes de fabricar, para que apruebes cada detalle.',
  },
  {
    q: '¿Cuánto tarda la fabricación?',
    a: 'Entre 15 y 20 días hábiles desde que apruebas el diseño final, con instalación incluida.',
  },
  {
    q: '¿Hay descuentos?',
    a: 'Sí. Pagar por transferencia o depósito tiene un descuento adicional, y si llegas con el código de un afiliado también recibes descuento en tu compra.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${SITE_BASE}/precios#webpage`,
      url: `${SITE_BASE}/precios`,
      name: TITLE,
      description: DESCRIPTION,
      inLanguage: 'es-EC',
      isPartOf: { '@id': `${SITE_BASE}/#website` },
      about: { '@id': `${SITE_BASE}/#business` },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Inicio', item: SITE_BASE },
        { '@type': 'ListItem', position: 2, name: 'Precios', item: `${SITE_BASE}/precios` },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ],
};

const whatsappButton =
  'inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-8 text-base font-bold text-white shadow-lg transition hover:brightness-105 active-press';

export default function PricesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div id="top" />

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-12 pt-32 md:pt-40" aria-labelledby="precios-title">
        <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary">Inicio</Link> <span aria-hidden>/</span> <span>Precios</span>
        </nav>
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-secondary">Precios de referencia 2026</p>
        <h1 id="precios-title" className="font-headline text-4xl font-bold leading-tight md:text-5xl">
          ¿Cuánto cuesta una cocina modular en Quito?
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-foreground/90 md:text-xl">
          En Modulares GM, los muebles bajos de cocina parten desde <strong>$250 por metro lineal</strong>. El total depende de los metros, el mesón y los accesorios. La medición en Quito no tiene costo y ves el diseño en 3D antes de fabricar.
        </p>
        <div className="mt-8 rounded-2xl border bg-card p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ejemplo</p>
          <p className="mt-2 text-base">
            Cocina lineal de 3 metros: muebles bajos desde <strong className="tabular-nums">$750</strong> (3 × $250). Los muebles altos, el mesón y los accesorios se suman según tu diseño.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <WhatsAppCta
            message="Hola Modulares GM, vi sus precios y quiero cotizar mi proyecto. ¿Cuándo pueden venir a medir?"
            location="precios_hero"
            className={whatsappButton}
          >
            <MessageCircle size={20} /> Cotizar por WhatsApp
          </WhatsAppCta>
          <Link href="/store" className="inline-flex h-14 items-center justify-center gap-2 rounded-xl border-2 px-8 text-base font-bold transition hover:bg-muted active-press">
            Ver diseños <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-5xl px-6 py-12" aria-labelledby="tabla-title">
        <h2 id="tabla-title" className="mb-6 font-headline text-3xl font-bold">Precios por tipo de mueble</h2>
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-5 py-3">Mueble</th>
                <th scope="col" className="px-5 py-3">Precio de referencia</th>
                <th scope="col" className="px-5 py-3">Garantía</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ROWS.map((c) => (
                <tr key={c.slug}>
                  <td className="px-5 py-4 font-bold">
                    <Link href={`/${c.slug}`} className="text-primary underline-offset-4 hover:underline">{c.categoryName}</Link>
                  </td>
                  <td className="px-5 py-4">{c.directAnswerCapsule.priceRange}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.directAnswerCapsule.warranty}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Precios en dólares, referenciales. El valor exacto sale de la medición y el diseño aprobado.</p>
      </section>

      <section className="relative z-10 bg-muted/50" aria-labelledby="factores-title">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 id="factores-title" className="mb-8 font-headline text-3xl font-bold">Qué hace subir o bajar el precio</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FACTORS.map((f) => (
              <article key={f.title} className="rounded-2xl border bg-card p-6">
                <h3 className="mb-2 font-bold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-3xl px-6 py-16" aria-labelledby="faq-precios">
        <h2 id="faq-precios" className="mb-8 text-center font-headline text-3xl font-bold">Preguntas frecuentes sobre precios</h2>
        <div className="divide-y rounded-2xl border bg-card">
          {FAQ.map((f) => (
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
        <div className="rounded-3xl bg-primary p-10 text-center text-primary-foreground md:p-14">
          <h2 className="font-headline text-3xl font-bold md:text-4xl">Pide tu precio exacto sin costo</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-90">Envíanos una foto del espacio y medidas aproximadas. Te respondemos por WhatsApp y agendamos la medición.</p>
          <WhatsAppCta
            message="Hola Modulares GM, quiero mi precio exacto. Les envío fotos y medidas de mi espacio."
            location="precios_final"
            className={`${whatsappButton} mt-8`}
          >
            <MessageCircle size={20} /> Escribir por WhatsApp
          </WhatsAppCta>
        </div>
      </section>
    </>
  );
}
