import Link from 'next/link';
import { ClipboardCheck, Hammer, PencilRuler, Truck } from 'lucide-react';
import { SITE_BASE } from '@/lib/site';

const PROCESS = [
  { icon: ClipboardCheck, title: 'Medición y asesoría', text: 'Visitamos tu espacio, tomamos medidas y definimos contigo distribución, materiales y presupuesto.' },
  { icon: PencilRuler, title: 'Diseño 3D y planos', text: 'Antes de fabricar ves renders fotorrealistas y planos técnicos para aprobar cada detalle.' },
  { icon: Hammer, title: 'Fabricación a medida', text: 'Producimos en melamina resistente a la humedad con herrajes de cierre lento y acabados premium.' },
  { icon: Truck, title: 'Entrega e instalación', text: 'Instalamos tus muebles y mesones de cuarzo o granito con cortes precisos y limpieza final.' },
];

export const HOME_FAQ = [
  { q: '¿Qué incluye una cocina modular de Modulares GM?', a: 'Diseño y renders 3D, fabricación a medida en melamina resistente a la humedad, herrajes de cierre lento Blum o Hafele e instalación. Puedes sumar mesón de cuarzo o granito, isla y accesorios.' },
  { q: '¿Trabajan solo en Quito?', a: 'Nuestro taller y oficina están en Quito y atendemos proyectos residenciales y comerciales en todo el Ecuador.' },
  { q: '¿La medición tiene costo?', a: 'No. La medición de tu espacio es gratuita y sirve de base para tu diseño y cotización.' },
  { q: '¿Qué materiales y marcas utilizan?', a: 'Trabajamos con tableros Novopan y Pelikano, herrajes Blum y Hafele, superficies Silestone y Dekton de Cosentino, y accesorios Teka, entre otras marcas.' },
  { q: '¿Puedo ver cómo quedará antes de fabricar?', a: 'Sí. Te entregamos renders fotorrealistas y planos técnicos para que apruebes el diseño antes de producir.' },
  { q: '¿Cómo puedo pagar?', a: 'En la tienda puedes pagar con transferencia o depósito, con tarjeta o PayPal, o contra entrega. Para proyectos a medida coordinamos la forma de pago en la cotización.' },
  { q: '¿Cómo solicito una cotización?', a: 'Completa el formulario de contacto de esta página o escríbenos por WhatsApp al 096 306 4374 y un asesor te contactará.' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${SITE_BASE}/#faq`,
  mainEntity: HOME_FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

/** Contenido editorial sin hooks: sale en el HTML inicial para buscadores y asistentes de IA. */
export function HomeSeoContent() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-20" aria-labelledby="proceso-title">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-secondary">Nuestro proceso</p>
            <h2 id="proceso-title" className="font-headline text-3xl font-bold md:text-4xl">Cómo fabricamos tu cocina, clósets y muebles a medida</h2>
            <p className="mt-5 text-muted-foreground">
              Modulares GM es una empresa de Quito especializada en cocinas modulares, mesones de cuarzo y granito, clósets, vestidores, muebles de baño y mobiliario comercial. Cada proyecto se diseña, fabrica e instala con un proceso claro, para que sepas qué esperar en cada etapa.
            </p>
            <p className="mt-4 text-muted-foreground">
              Combinamos tableros resistentes a la humedad, herrajes de cierre lento y superficies de cuarzo para lograr espacios funcionales y duraderos, en viviendas, locales, oficinas y restaurantes.
            </p>
          </div>
          <ol className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {PROCESS.map((p, i) => (
              <li key={p.title} className="rounded-3xl border bg-card p-7 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"><p.icon size={20} /></span>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Paso {i + 1}</span>
                </div>
                <h3 className="mb-2 font-headline text-lg font-bold">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative z-10 bg-muted/50" aria-labelledby="preguntas-title">
        <div className="mx-auto max-w-3xl px-6 py-20">
          <h2 id="preguntas-title" className="mb-10 text-center font-headline text-3xl font-bold md:text-4xl">Preguntas frecuentes sobre cocinas y muebles a medida</h2>
          <div className="divide-y rounded-2xl border bg-card">
            {HOME_FAQ.map((f) => (
              <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}
                  <span className="text-secondary transition-transform group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            ¿Buscas algo específico? Revisa la <Link href="/store" className="font-bold text-primary underline underline-offset-4">tienda</Link> o pide tu cotización en la sección de contacto.
          </p>
        </div>
      </section>
    </>
  );
}
