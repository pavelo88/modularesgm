import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, Truck, Wrench, ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Catálogo de Muebles Modulares en Quito | Modulares GM',
  description:
    'Explore nuestros catálogos de cocinas modernas con cuarzo, clósets a medida, escritorios ergonómicos y mobiliario de oficina en Quito con garantía.',
  alternates: {
    canonical: 'https://www.modularesgm.com/catalogo',
  },
  openGraph: {
    title: 'Catálogo de Muebles Modulares en Quito | Modulares GM',
    description:
      'Explore nuestros catálogos de cocinas modernas con cuarzo, clósets a medida, escritorios ergonómicos y mobiliario de oficina en Quito con garantía.',
    url: 'https://www.modularesgm.com/catalogo',
    siteName: 'Modulares GM',
    locale: 'es_EC',
    type: 'website',
  },
};

interface CatalogSectionCard {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  image: string;
  tag: string;
  count: string;
  specs: string;
  highlight?: boolean;
}

const CATALOG_SECTIONS: CatalogSectionCard[] = [
  {
    id: 'cocinas',
    title: 'Cocinas Integrales & Mesones',
    subtitle: 'Islas de cuarzo Calacatta, acabados hidrófugos RH 18mm y herrajes Blum con cierre suave.',
    href: '/cocinas',
    image: '/images/catalog/extracted_DE_COCINAS/img-004.jpg',
    tag: 'Cocinas',
    count: '8 Diseños Exclusivos',
    specs: 'Cuarzo Antibacterial · Melamina RH 18mm',
    highlight: true,
  },
  {
    id: 'closets',
    title: 'Closets & Walk-in Closets',
    subtitle: 'Vestidores boutique con puertas de vidrio bronce, iluminación LED y organizadores a medida.',
    href: '/closets',
    image: '/images/catalog/extracted_CLOSETS_1/img-017.png',
    tag: 'Closets',
    count: '8 Proyectos Curados',
    specs: 'Vidrio Templado · Rieles Invisibles',
    highlight: true,
  },
  {
    id: 'escritorios',
    title: 'Escritorios & Teletrabajo',
    subtitle: 'Diseños ergonómicos estudiantiles y para home office en melamina Pelikano de alta densidad.',
    href: '/escritorios',
    image: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png',
    tag: 'Escritorios',
    count: '7 Modelos Estudiantiles',
    specs: 'Tablero 18mm Antirrayas · Pasacables',
  },
  {
    id: 'oficina',
    title: 'Mobiliario Corporativo',
    subtitle: 'Counters de recepción ejecutivos, credenzas con llave y mesas de reunión modulares.',
    href: '/muebles-oficina',
    image: '/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg',
    tag: 'Oficina',
    count: '7 Soluciones Corporativas',
    specs: 'Estructuras Reforzadas · Mesas Conectividad',
  },
  {
    id: 'bano',
    title: 'Vanities & Muebles de Baño',
    subtitle: 'Muebles flotantes resistentes al vapor y salpicaduras con mesones de cuarzo y espejos LED.',
    href: '/muebles-bano',
    image: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg',
    tag: 'Baños',
    count: '4 Colecciones Spa',
    specs: 'Tablero Marino RH · Cuarzo Negro',
  },
  {
    id: 'puertas',
    title: 'Puertas Pivotantes & Paso',
    subtitle: 'Puertas pivotantes monumentales de hasta 3m y puertas de interior con marco envolvente.',
    href: '/puertas',
    image: '/images/catalog/extracted_DE_PUERTAS/img-007.jpg',
    tag: 'Puertas',
    count: '4 Estilos Monumentales',
    specs: 'Pivote Axial · Aislamiento Acústico',
  },
  {
    id: 'gamer',
    title: 'Setups & Habitaciones Gamer',
    subtitle: 'Estaciones reforzadas para múltiples monitores con iluminación RGB y ruteo 100% oculto.',
    href: '/gamer',
    image: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg',
    tag: 'Gamer',
    count: '3 Proyectos Integrales',
    specs: 'Soporte Multimonitor · Ruteo Cables',
  },
];

export default function CatalogoIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': 'https://www.modularesgm.com/catalogo#webpage',
        url: 'https://www.modularesgm.com/catalogo',
        name: 'Catálogo de Muebles Modulares en Quito | Modulares GM',
        description:
          'Explore nuestros catálogos de cocinas modernas con cuarzo, clósets a medida, escritorios ergonómicos y mobiliario de oficina en Quito con garantía.',
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: 'https://www.modularesgm.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Catálogo',
              item: 'https://www.modularesgm.com/catalogo',
            },
          ],
        },
      },
      {
        '@type': 'ItemList',
        itemListElement: CATALOG_SECTIONS.map((section, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: section.title,
          url: `https://www.modularesgm.com${section.href}`,
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen pt-24 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Catálogo Oficial</span>
          </nav>

          {/* CÁPSULA GEO PARA IAs */}
          <aside
            aria-label="Resumen ejecutivo del catálogo de Modulares GM"
            className="mb-10 p-6 rounded-3xl border border-primary/20 bg-primary/5 backdrop-blur-md relative overflow-hidden"
          >
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles size={16} />
              <span>Direct Answer • Catálogo Integral Modulares GM</span>
            </div>
            <p className="text-sm md:text-base text-foreground font-medium mb-3 leading-relaxed">
              Modulares GM diseña, fabrica e instala mobiliario modular de alta gama en Quito y todo el Ecuador, con tableros melamínicos antibacteriales Pelikano RH de 18mm y mesones de cuarzo o granito natural.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground mb-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✔</span>
                <span>Páginas dedicadas con cotización en tiempo real y carrito para cada categoría.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✔</span>
                <span>Fotografías con múltiples ángulos reales y proyectos de autor sin imágenes genéricas.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✔</span>
                <span>Entrega e instalación técnica en Quito, Cumbayá, Tumbaco y envíos a nivel nacional.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✔</span>
                <span>Garantía de 3 a 5 años en estructura y hasta 10 años en mesones de cuarzo.</span>
              </li>
            </ul>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-3 border-t border-primary/10">
              <span className="text-foreground">
                <span className="text-muted-foreground font-normal">Silos oficiales:</span> 7 Categorías Arquitectónicas
              </span>
              <span className="text-foreground">
                <span className="text-muted-foreground font-normal">Garantía:</span> Certificación Oficial GM
              </span>
            </div>
          </aside>

          {/* HERO PRINCIPAL */}
          <header className="mb-14">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/60">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                  Líneas de Diseño & Fabricación
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-foreground">
                  Catálogos de Muebles Modulares y Espacios a Medida
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-3 font-normal max-w-2xl leading-relaxed">
                  Cada ambiente concebido con rigor planimétrico, materiales hidrófugos de alta densidad y superficies nobles. Seleccione una línea para explorar todos sus modelos y solicitar cotización técnica.
                </p>
              </div>

              {/* Botón Explorar Tienda Completa */}
              <Link
                href="/store"
                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors px-5 py-2.5 rounded-full border border-border/60 hover:border-primary/40 bg-card/40 shrink-0 active:scale-95"
              >
                <span>Ver Tienda Completa</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Señales de Confianza Luxury */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                <span className="font-medium text-foreground">Garantía 3 a 5 años</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <Truck size={18} className="text-primary shrink-0" />
                <span className="font-medium text-foreground">Envíos a todo Ecuador</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <Wrench size={18} className="text-amber-500 shrink-0" />
                <span className="font-medium text-foreground">Instalación en Quito</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <Sparkles size={18} className="text-violet-500 shrink-0" />
                <span className="font-medium text-foreground">Melamina Pelikano 18mm</span>
              </div>
            </div>
          </header>

          {/* GRID EDITORIAL DE CATEGORÍAS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATALOG_SECTIONS.map((section, idx) => (
              <Link
                key={section.id}
                href={section.href}
                className={`group relative flex flex-col rounded-3xl border overflow-hidden bg-card/60 backdrop-blur-md transition-all duration-500 hover:border-primary/50 hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] hover:-translate-y-1.5 ${
                  section.highlight && idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Imagen del Catálogo con Zoom al Hover */}
                <div className={`relative w-full overflow-hidden bg-muted/40 ${
                  section.highlight && idx === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'
                }`}>
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

                  {/* Badges superiores */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-background/80 dark:bg-black/60 backdrop-blur-md text-foreground border border-white/10 shadow-sm">
                      {section.tag}
                    </span>
                    <span className="text-[11px] px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md text-primary font-bold border border-primary/30">
                      {section.count}
                    </span>
                  </div>

                  {/* Información en overlay inferior */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <p className="text-[11px] text-white/80 font-mono tracking-wider mb-1">
                      {section.specs}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-bold font-headline text-white tracking-tight leading-snug">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Subtítulo y Acción */}
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <p className="text-xs sm:text-sm text-muted-foreground font-normal leading-relaxed">
                    {section.subtitle}
                  </p>

                  <div className="pt-4 border-t border-border/40 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary/90 transition-colors">
                    <span className="uppercase tracking-wider">Explorar Colección Completa</span>
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                      <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* BANNER INFERIOR DE ASESORÍA PERSONALIZADA */}
          <div className="mt-16 p-8 sm:p-12 rounded-3xl border border-border/60 bg-gradient-to-br from-card/80 to-muted/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="max-w-xl">
              <span className="text-[11px] font-bold uppercase tracking-widest text-primary mb-2 block">
                ¿Busca un diseño a medida especial?
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-headline text-foreground tracking-tight">
                Planimetría 3D y Despiece Técnico Sin Costo
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2 font-normal leading-relaxed">
                Nuestros arquitectos diseñadores visitan su espacio o trabajan sobre sus planos para entregarle una cotización milimétrica con renderizado fotorealista.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/contacto"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95 text-center"
              >
                Solicitar Asesoría en Obra
              </Link>
              <Link
                href="/store"
                className="w-full sm:w-auto px-6 py-3 rounded-full text-xs font-bold bg-muted/70 text-foreground hover:bg-muted transition-all border border-border/60 active:scale-95 text-center"
              >
                Ir a la Tienda Directa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
