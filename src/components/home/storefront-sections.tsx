'use client';

import Link from 'next/link';
import { ArrowRight, Handshake, Ruler, ShieldCheck, Truck } from 'lucide-react';
import type { Product, Service } from '@/lib/types';
import { ProductCard } from '@/components/store/product-card';
import { CardSlider, MediaCard } from '@/components/shared/card-slider';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';

const valueProps = [
  { icon: Ruler, title: 'Fabricado a medida', desc: 'Diseño 3D y planos antes de producir.' },
  { icon: ShieldCheck, title: 'Materiales premium', desc: 'Herrajes Blum, melamina RH, cuarzo Silestone.' },
  { icon: Truck, title: 'Instalación incluida', desc: 'Entrega e instalación en todo Ecuador.' },
];

export function ValueProps() {
  return (
    <section className="relative z-10 border-y bg-background/80" aria-label="Por qué elegirnos">
      <div className="max-w-7xl mx-auto px-6 py-8 grid sm:grid-cols-3 gap-6">
        {valueProps.map((v) => (
          <div key={v.title} className="flex items-center gap-4">
            <span className="w-11 h-11 shrink-0 rounded-full bg-primary/10 text-primary grid place-items-center"><v.icon size={20} /></span>
            <div>
              <p className="font-bold text-sm">{v.title}</p>
              <p className="text-xs text-muted-foreground">{v.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CatalogSection({ services, products }: { services: Service[]; products: Product[] }) {
  const { setSelectedCategory } = useCart();
  const categories = Array.from(new Set(products.map((p) => p.category)));

  return (
    <section id="catalogo" className="relative z-10 max-w-7xl mx-auto px-6 py-16 scroll-mt-28" aria-labelledby="catalogo-title">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary mb-2">Catálogo</p>
          <h2 id="catalogo-title" className="font-headline text-3xl md:text-4xl font-bold">Muebles y cocinas por categoría</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Proyectos personalizados para transformar espacios vacíos en ambientes funcionales y llenos de estilo. Elige una categoría y explora los diseños disponibles.
          </p>
        </div>
        <Link href="/store" onClick={() => setSelectedCategory('Todos')} className="hidden sm:flex shrink-0 items-center gap-1 text-sm font-bold text-primary">
          Ver todo <ArrowRight size={14} />
        </Link>
      </div>

      <CardSlider label="Catálogo de servicios y diseños" slideClassName="basis-[78%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
        {services.map((service) => (
          <MediaCard
            key={service.id}
            image={service.imgUrl}
            title={service.title}
            eyebrow="A medida"
            description={service.desc}
            href="/store"
            cta="Ver diseños"
            onClick={() => setSelectedCategory('Todos')}
          />
        ))}
      </CardSlider>

      <ul className="mt-8 flex flex-wrap gap-2" aria-label="Categorías de la tienda">
        {categories.map((cat) => (
          <li key={cat}>
            <Link
              href="/store"
              onClick={() => setSelectedCategory(cat)}
              className="inline-flex rounded-full border border-foreground/15 bg-background/70 px-4 py-2 text-sm font-semibold backdrop-blur-md transition hover:border-secondary hover:bg-secondary hover:text-secondary-foreground"
            >
              {cat}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  const featured = [...products].sort((a, b) => Number(!!b.discountPrice) - Number(!!a.discountPrice)).slice(0, 8);
  return (
    <section className="relative z-10 bg-muted/50" aria-labelledby="destacados-title">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-secondary mb-2">Favoritos</p>
            <h2 id="destacados-title" className="font-headline text-3xl md:text-4xl font-bold">Diseños más buscados</h2>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/store">Ir a la tienda</Link>
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

/** Invitación al programa de afiliados. No muestra porcentajes: las condiciones se ven al registrarse. */
export function AffiliateBand() {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-16" aria-labelledby="afiliados-band-title">
      <div className="relative grid gap-8 overflow-hidden rounded-3xl bg-foreground p-10 text-background md:grid-cols-[1fr_auto] md:items-center md:p-16">
        <Handshake className="absolute -bottom-10 -right-10 h-72 w-72 opacity-5" aria-hidden />
        <div className="relative">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-secondary">Trabaja con nosotros</p>
          <h2 id="afiliados-band-title" className="max-w-2xl font-headline text-3xl font-bold leading-tight md:text-5xl">
            Recomienda Modulares GM y genera ingresos con cada venta
          </h2>
          <p className="mt-4 max-w-xl opacity-80">
            Regístrate gratis, obtén tu enlace y código personal, y sigue tus ventas en un panel propio.
          </p>
        </div>
        <Button asChild size="lg" className="relative bg-secondary text-secondary-foreground hover:bg-secondary/90">
          <Link href="/afiliados">Quiero ser afiliado <ArrowRight size={18} className="ml-2" /></Link>
        </Button>
      </div>
    </section>
  );
}
