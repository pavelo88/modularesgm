'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight, Handshake, Ruler, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import type { Product, Service } from '@/lib/types';
import { ProductCard } from '@/components/store/product-card';
import { CardSlider } from '@/components/shared/card-slider';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';

const valueProps = [
  { icon: Ruler, title: 'Fabricación a Medida', desc: 'Levantamiento planimétrico y diseño 3D previo sin costo.' },
  { icon: ShieldCheck, title: 'Materiales Certificados', desc: 'Melamina Pelikano RH 18mm, cuarzos y herrajes Blum.' },
  { icon: Truck, title: 'Instalación Técnica', desc: 'Montaje profesional en Quito y envíos a todo Ecuador.' },
];

export function ValueProps() {
  return (
    <section className="relative z-10 border-y border-border/60 bg-card/40 backdrop-blur-md" aria-label="Por qué elegirnos">
      <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-3 gap-8">
        {valueProps.map((v) => (
          <div key={v.title} className="flex items-center gap-4">
            <span className="w-12 h-12 shrink-0 rounded-2xl bg-secondary/15 text-secondary border border-secondary/25 grid place-items-center">
              <v.icon size={22} />
            </span>
            <div>
              <p className="font-bold text-sm text-foreground">{v.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const ARCHITECTURAL_CATEGORIES = [
  {
    title: 'Cocinas Integrales con Cuarzo',
    desc: 'Islas de cuarzo Calacatta, acabados hidrófugos RH 18mm y herrajes de cierre suave.',
    href: '/cocinas',
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-004.jpg',
    models: '8 Diseños Exclusivos',
    tag: 'Cocinas',
  },
  {
    title: 'Walk-in Closets & Vestidores',
    desc: 'Vestidores boutique con puertas de vidrio bronce, iluminación LED y organizadores a medida.',
    href: '/closets',
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-017.png',
    models: '8 Proyectos Curados',
    tag: 'Closets',
  },
  {
    title: 'Escritorios & Teletrabajo',
    desc: 'Modelos ergonómicos y estudiantiles en melamina Pelikano con pasacables integrados.',
    href: '/escritorios',
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png',
    models: '7 Modelos Estudiantiles',
    tag: 'Escritorios',
  },
  {
    title: 'Mobiliario Corporativo & Oficinas',
    desc: 'Counters de recepción, credenzas ejecutivas y mesas de reunión modulares.',
    href: '/muebles-oficina',
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg',
    models: '7 Soluciones Corporativas',
    tag: 'Oficina',
  },
  {
    title: 'Vanities & Muebles de Baño',
    desc: 'Muebles flotantes resistentes al vapor con lavamanos de sobreponer y mesones de cuarzo.',
    href: '/muebles-bano',
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg',
    models: '4 Colecciones Spa',
    tag: 'Baños',
  },
  {
    title: 'Puertas Pivotantes Monumentales',
    desc: 'Puertas de ingreso de hasta 3 metros de altura con apertura suave y puertas de paso.',
    href: '/puertas',
    imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-007.jpg',
    models: '4 Estilos Monumentales',
    tag: 'Puertas',
  },
  {
    title: 'Setups & Habitaciones Gamer',
    desc: 'Estaciones con ruteo de cables 100% oculto, soporte multipantalla y perfiles LED RGB.',
    href: '/gamer',
    imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg',
    models: '3 Proyectos Completos',
    tag: 'Gamer',
  },
];

export function CatalogSection({ services, products }: { services?: Service[]; products?: Product[] }) {
  return (
    <section id="catalogo" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-28" aria-labelledby="catalogo-title">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-[11px] font-semibold uppercase tracking-[0.2em] mb-3">
            <Sparkles size={13} />
            <span>Líneas Oficiales GM</span>
          </div>
          <h2 id="catalogo-title" className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-foreground">
            Mobiliario Modular por Categoría
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground font-light leading-relaxed">
            De la cocina de alta gama a la habitación gamer y oficinas corporativas. Cada espacio cuenta con su catálogo dedicado con cotización directa y carrito de compra.
          </p>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors px-5 py-2.5 rounded-full border border-border/60 hover:border-primary/40 bg-card/40 shrink-0 active:scale-95"
        >
          <span>Ver Índice de Catálogos</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Grid Editorial de Categorías estilo Siiimple & OH Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARCHITECTURAL_CATEGORIES.map((cat, idx) => (
          <Link
            key={cat.href}
            href={cat.href}
            className={`group relative flex flex-col rounded-3xl border border-border/60 overflow-hidden bg-card/60 backdrop-blur-md transition-all duration-500 hover:border-secondary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 ${
              idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
            }`}
          >
            {/* Imagen con zoom y overlay cinematográfico */}
            <div className={`relative w-full overflow-hidden bg-muted/40 ${
              idx === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
            }`}>
              <Image
                src={cat.imgUrl}
                alt={cat.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

              {/* Badges superiores */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-background/80 dark:bg-black/60 backdrop-blur-md text-foreground border border-white/10 shadow-sm">
                  {cat.tag}
                </span>
                <span className="text-[11px] px-3 py-1 rounded-full bg-secondary/25 backdrop-blur-md text-stone-100 font-bold border border-secondary/40">
                  {cat.models}
                </span>
              </div>

              {/* Título e info en overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-xl sm:text-2xl font-normal font-headline text-white tracking-tight leading-snug">
                  {cat.title}
                </h3>
              </div>
            </div>

            {/* Descripción y botón */}
            <div className="p-6 flex-1 flex flex-col justify-between gap-4">
              <p className="text-xs sm:text-sm text-muted-foreground font-light leading-relaxed">
                {cat.desc}
              </p>

              <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold text-secondary group-hover:text-secondary/90 transition-colors">
                <span className="uppercase tracking-wider">Explorar Colección & Modelos</span>
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-secondary/15 text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-all duration-300">
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = [...products].filter(p => p.featured || p.category === 'Cocinas' || p.category === 'Closets').slice(0, 8);
  return (
    <section className="relative z-10 bg-muted/30 py-20" aria-labelledby="destacados-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-[11px] font-semibold uppercase tracking-[0.2em] mb-2">
              <Sparkles size={13} />
              <span>Proyectos de Autor</span>
            </div>
            <h2 id="destacados-title" className="font-headline text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
              Diseños Destacados & Fabricaciones
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm font-light mt-1">
              Deslice para explorar ángulos fotográficos reales directamente en cada tarjeta.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-border/60 hover:border-secondary text-xs font-semibold px-5">
            <Link href="/store">Explorar Tienda Completa</Link>
          </Button>
        </div>

        <CardSlider label="Productos destacados" slideClassName="basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </CardSlider>
      </div>
    </section>
  );
}

/** Invitación al programa de afiliados inspirada directamente en el flyer editorial de Claude */
export function AffiliateBand() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="afiliados-band-title">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#12161A] p-8 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {/* Glow sutil */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Columna Izquierda: Información Editorial */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Monograma & Identificador */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] uppercase text-stone-500 dark:text-stone-400">
                  MODULARES GM · COCINAS · CLÓSETS · MUEBLES A MEDIDA
                </span>
                <span className="h-px flex-1 max-w-[60px] bg-secondary/40" />
              </div>

              {/* Título en Serif Elegante */}
              <h2 id="afiliados-band-title" className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal text-stone-900 dark:text-stone-100 mb-4 leading-[1.12]">
                Trabaja con nosotros
              </h2>

              <p className="text-stone-600 dark:text-stone-300 text-base sm:text-lg font-light mb-8 max-w-xl">
                Recomienda Modulares GM y gana comisión directa por cada venta generada con tu código o enlace.
              </p>

              {/* Pasos Numerados Estilo Editorial */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <span className="h-8 w-8 rounded-full bg-stone-900 dark:bg-stone-800 text-stone-100 dark:text-secondary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Regístrate gratis</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Crea tu cuenta en menos de 1 minuto y accede a tu panel personal de afiliado.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="h-8 w-8 rounded-full bg-stone-900 dark:bg-stone-800 text-stone-100 dark:text-secondary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Comparte tu enlace por WhatsApp</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Recomienda a amigos, familiares, clientes de arquitectura o conocidos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="h-8 w-8 rounded-full bg-stone-900 dark:bg-stone-800 text-stone-100 dark:text-secondary font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Cobra tu comisión con cada compra</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Recibe pagos transparentes vía transferencia bancaria por cada venta cerrada.</p>
                  </div>
                </div>
              </div>

              {/* Caja de Beneficio Mutuo */}
              <div className="p-4 rounded-2xl border border-secondary/30 bg-secondary/10 flex items-center gap-3 mb-8">
                <span className="text-lg">🚪</span>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                  <strong className="font-semibold text-stone-900 dark:text-white">Sin inventario ni inversión previa.</strong> Tu contacto recibe un <span className="font-bold text-secondary">5% de descuento</span> al usar tu código.
                </p>
              </div>
            </div>

            {/* Botón de Registro */}
            <div>
              <Link
                href="/afiliados"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1b736b] hover:bg-[#155b55] text-white font-bold text-xs sm:text-sm shadow-lg transition-all duration-200 active:scale-95 group"
              >
                <span>Regístrate en modularesgm.com/afiliados</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta Fotográfica con Arco */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border border-secondary/30 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              <Image
                src="/images/campaign/flyer-afiliados-trabaja-con-nosotros.jpg"
                alt="Trabaja con nosotros - Modulares GM Programa de Afiliados"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary block">
                    Comisiones Directas
                  </span>
                  <span className="text-xs font-light">Para arquitectos, instaladores y promotores</span>
                </div>
                <Link
                  href="/afiliados"
                  className="h-10 w-10 rounded-full bg-secondary text-stone-950 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-md shrink-0"
                  title="Ir al Portal de Afiliados"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
