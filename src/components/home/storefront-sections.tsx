'use client';

import { useState, useEffect } from 'react';
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
            <span className="w-12 h-12 shrink-0 rounded-2xl bg-primary/10 text-primary border border-primary/20 grid place-items-center">
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
  const row1 = ARCHITECTURAL_CATEGORIES.slice(0, 3);
  const row2 = ARCHITECTURAL_CATEGORIES.slice(3);

  return (
    <section id="catalogo" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 scroll-mt-28" aria-labelledby="catalogo-title">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-3">
            <Sparkles size={13} />
            <span>Líneas Oficiales GM</span>
          </div>
          <h2 id="catalogo-title" className="font-headline text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-stone-900 dark:text-stone-100">
            Mobiliario Modular por Categoría
          </h2>
          <p className="mt-3 max-w-2xl text-sm sm:text-base text-stone-800 dark:text-stone-200 font-normal leading-relaxed">
            De la cocina de alta gama a la habitación gamer y oficinas corporativas. Cada espacio cuenta con su catálogo dedicado con cotización directa y carrito de compra.
          </p>
        </div>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-900 dark:text-stone-100 hover:text-primary transition-colors px-5 py-2.5 rounded-full border border-stone-300 dark:border-stone-700 bg-card/60 shrink-0 active:scale-95"
        >
          <span>Ver Índice de Catálogos</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* 2 Carruseles Horizontales en celulares / Grilla arquitectónica en escritorio */}
      <div className="space-y-12">
        {/* Fila 1: Líneas Residenciales */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100">Líneas Residenciales</h3>
            <span className="md:hidden text-[11px] font-semibold text-stone-500 flex items-center gap-1">
              Deslizar ➔
            </span>
          </div>
          <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            {row1.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative flex flex-col rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-card/80 backdrop-blur-md transition-all duration-500 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-xl hover:-translate-y-1.5 min-w-[85vw] sm:min-w-[320px] md:min-w-0 snap-start shrink-0 md:shrink"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted/40">
                  <Image
                    src={cat.imgUrl}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/75 backdrop-blur-md text-white border border-white/20">
                      {cat.tag}
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 font-bold border border-amber-500/30">
                      {cat.models}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h4 className="text-xl font-headline font-semibold text-white leading-snug">
                      {cat.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-xs text-stone-800 dark:text-stone-200 font-normal leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100">
                    <span className="uppercase tracking-wider">Explorar Catálogo</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Fila 2: Líneas Especializadas & Corporativas */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 dark:text-stone-100">Líneas Especializadas & Corporativas</h3>
            <span className="md:hidden text-[11px] font-semibold text-stone-500 flex items-center gap-1">
              Deslizar ➔
            </span>
          </div>
          <div className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 no-scrollbar">
            {row2.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative flex flex-col rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden bg-card/80 backdrop-blur-md transition-all duration-500 hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-xl hover:-translate-y-1.5 min-w-[85vw] sm:min-w-[280px] md:min-w-0 snap-start shrink-0 md:shrink"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted/40">
                  <Image
                    src={cat.imgUrl}
                    alt={cat.title}
                    fill
                    sizes="(max-width: 768px) 85vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 pointer-events-none" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/75 backdrop-blur-md text-white border border-white/20">
                      {cat.tag}
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-amber-300 font-bold border border-amber-500/30">
                      {cat.models}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <h4 className="text-xl font-headline font-semibold text-white leading-snug">
                      {cat.title}
                    </h4>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-xs text-stone-800 dark:text-stone-200 font-normal leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-bold text-stone-900 dark:text-stone-100">
                    <span className="uppercase tracking-wider">Explorar Catálogo</span>
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1 text-primary" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-2">
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
          <Button asChild variant="outline" className="rounded-full border-border/60 hover:border-primary text-xs font-semibold px-5">
            <Link href="/store">Explorar Tienda Completa</Link>
          </Button>
        </div>

        <CardSlider label="Productos destacados" slideClassName="basis-[85%] sm:basis-1/2 lg:basis-1/3">
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
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCategoryIdx((prev) => (prev + 1) % ARCHITECTURAL_CATEGORIES.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" aria-labelledby="afiliados-band-title">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-stone-200/80 dark:border-stone-800 bg-[#FAF8F5] dark:bg-[#12161A] p-6 sm:p-12 lg:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        {/* Glow sutil */}
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        {/* Vista Móvil (Imagen Flyer Alta + Botón Superpuesto Encima en la base extendida) */}
        <div className="lg:hidden flex flex-col items-center">
          <div className="relative w-full max-w-sm aspect-[768/1164] rounded-3xl overflow-hidden border border-stone-300 dark:border-stone-700 shadow-2xl bg-[#f8f4e9]">
            <Image
              src="/images/campaign/flyer-afiliados-mobile-extended.webp"
              alt="Trabaja con nosotros - Modulares GM Programa de Afiliados"
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-contain"
              priority
            />

            {/* Botón Verde Superpuesto sobre la imagen en la parte inferior */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
              <Link
                href="/afiliados"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#1b736b] hover:bg-[#155b55] active:bg-[#114b46] text-white font-bold text-xs sm:text-sm shadow-xl active:scale-95 transition-all text-center"
              >
                <span>Regístrate en modularesgm.com/afiliados</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Vista Escritorio (Carrusel a la IZQUIERDA, Textos a la DERECHA) */}
        <div className="hidden lg:grid grid-cols-12 gap-14 items-center">
          {/* Columna Izquierda: Carrusel Dinámico de 1 Sola Tarjeta con las Categorías Reales */}
          <div className="col-span-5 relative flex flex-col items-center">
            <div className="relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden border border-secondary/30 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group">
              {ARCHITECTURAL_CATEGORIES.map((cat, idx) => (
                <div
                  key={cat.href}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === activeCategoryIdx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={cat.imgUrl}
                    alt={cat.title}
                    fill
                    sizes="40vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                      {cat.tag}
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-secondary/30 backdrop-blur-md text-stone-100 font-bold border border-secondary/40">
                      {cat.models}
                    </span>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 z-20 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 block mb-1">
                      Línea Destacada #{idx + 1}
                    </span>
                    <h3 className="text-xl font-headline font-normal tracking-tight leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-stone-300 font-light mt-1 line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Controles discretos del carrusel */}
            <div className="flex items-center gap-1.5 mt-4">
              {ARCHITECTURAL_CATEGORIES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategoryIdx(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === activeCategoryIdx ? 'w-6 bg-primary' : 'w-2 bg-stone-300 dark:bg-stone-700'
                  }`}
                  aria-label={`Ir a diapositiva ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Columna Derecha: Información Editorial */}
          <div className="col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono tracking-[0.25em] uppercase text-stone-500 dark:text-stone-400">
                  MODULARES GM · COCINAS · CLÓSETS · MUEBLES A MEDIDA
                </span>
                <span className="h-px flex-1 max-w-[60px] bg-primary/40" />
              </div>

              <h2 id="afiliados-band-title" className="font-headline text-4xl lg:text-5xl font-normal text-stone-900 dark:text-stone-100 mb-4 leading-[1.12]">
                Trabaja con nosotros
              </h2>

              <p className="text-stone-600 dark:text-stone-300 text-lg font-light mb-8 max-w-xl">
                Recomienda Modulares GM y gana comisión directa por cada venta generada con tu código o enlace.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <span className="h-8 w-8 rounded-full bg-stone-900 dark:bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Regístrate gratis</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Crea tu cuenta en menos de 1 minuto y accede a tu panel personal de afiliado.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="h-8 w-8 rounded-full bg-stone-900 dark:bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Comparte tu enlace por WhatsApp</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Recomienda a amigos, familiares, clientes de arquitectura o conocidos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="h-8 w-8 rounded-full bg-stone-900 dark:bg-stone-800 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">Cobra tu comisión con cada compra</h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400">Recibe pagos transparentes vía transferencia bancaria por cada venta cerrada.</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 flex items-center gap-3 mb-8">
                <span className="text-lg">🚪</span>
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200">
                  <strong className="font-semibold text-stone-900 dark:text-white">Sin inventario ni inversión previa.</strong> Tu contacto recibe un <span className="font-extrabold text-emerald-700 dark:text-emerald-400">5% de descuento</span> al usar tu código.
                </p>
              </div>
            </div>

            <div>
              <Link
                href="/afiliados"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#1b736b] hover:bg-[#155b55] text-white font-bold text-sm shadow-lg transition-all duration-200 active:scale-95 group"
              >
                <span>Regístrate en modularesgm.com/afiliados</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
