import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';

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

interface CatalogRow {
  id: string;
  num: string;
  title: string;
  badge: string;
  desc: string;
  specs: string[];
  href: string;
  ctaText: string;
  photos: Array<{ url: string; label: string }>;
}

const CATALOG_ROWS: CatalogRow[] = [
  {
    id: 'cocinas',
    num: '01',
    title: 'Cocinas Integrales & Mesones de Cuarzo',
    badge: 'Línea de Autor',
    desc: 'Diseño arquitectónico a medida. Tableros melamínicos Pelikano RH de 18mm resistentes a humedad y calor, herrajes alemanes Blum con cierre amortiguado y mesones en cuarzo Calacatta o granito natural.',
    specs: ['Tablero Pelikano RH 18mm', 'Cuarzo Antibacterial', 'Herrajes Blum Cierre Suave', 'Garantía 3 a 5 Años'],
    href: '/cocinas',
    ctaText: 'Explorar Catálogo de Cocinas',
    photos: [
      { url: '/images/catalog/extracted_DE_COCINAS/img-004.jpg', label: 'Cocina con Isla Central' },
      { url: '/images/catalog/extracted_DE_COCINAS/img-005.jpg', label: 'Muebles Aéreos & Iluminación' },
      { url: '/images/catalog/extracted_DE_COCINAS/img-006.jpg', label: 'Mesón de Cuarzo Calacatta' },
      { url: '/images/catalog/extracted_DE_COCINAS/img-007.jpg', label: 'Torre de Hornos & Alacena' },
    ],
  },
  {
    id: 'closets',
    num: '02',
    title: 'Clósets, Armarios & Walk-in Closets',
    badge: 'Optimización de Espacio',
    desc: 'Vestidores personalizados con sistemas de organización inteligente: pantaloneros extraíbles, zapateras deslizables, cajones con división para accesorios y puertas en vidrio templado bronce o melamina.',
    specs: ['Rieles Ocultos Blum', 'Vidrio Templado Bronce', 'Perfiles de Aluminio', 'Luz LED Cálida 3000K'],
    href: '/closets',
    ctaText: 'Explorar Catálogo de Clósets',
    photos: [
      { url: '/images/catalog/extracted_CLOSETS_1/img-004.png', label: 'Walk-in Closet Boutique' },
      { url: '/images/catalog/extracted_CLOSETS_1/img-005.png', label: 'Módulo de Cajoneras & Repisas' },
      { url: '/images/catalog/extracted_CLOSETS_1/img-006.png', label: 'Vestidor con Puertas de Vidrio' },
      { url: '/images/catalog/extracted_CLOSETS_1/img-007.png', label: 'Organizador de Ropa & Calzado' },
    ],
  },
  {
    id: 'bano',
    num: '03',
    title: 'Vanities & Muebles de Baño Flotantes',
    badge: 'Resistencia Hidrófuga',
    desc: 'Muebles de baño concebidos para ambientes de alta humedad. Estructura en melamina marina RH con mesones de cuarzo o resina antibacterial y espejos con iluminación LED perimetral táctil.',
    specs: ['Tablero Marino RH', 'Cuarzo Antibacterial', 'Espejos LED Táctiles', 'Desagües Ocultos'],
    href: '/muebles-bano',
    ctaText: 'Explorar Catálogo de Baños',
    photos: [
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.jpg', label: 'Vanity Flotante Minimalista' },
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.jpg', label: 'Mueble con Espejo Retroiluminado' },
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg', label: 'Lavamanos Sobrepuesto & Cuarzo' },
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-007.jpg', label: 'Módulo Auxiliar de Baño' },
    ],
  },
  {
    id: 'escritorios',
    num: '04',
    title: 'Escritorios & Estaciones de Teletrabajo',
    badge: 'Ergonomía & Estudio',
    desc: 'Estaciones de estudio y home office pensadas para largas jornadas de trabajo. Superficies antirrayas de 18mm con pasacables discretos, cajoneras móviles con llave y estructuras metálicas reforzadas.',
    specs: ['Superficie Antirrayas', 'Pasacables Integrados', 'Cajoneras con Cerradura', 'Diseño Ergonómico'],
    href: '/escritorios',
    ctaText: 'Explorar Catálogo de Escritorios',
    photos: [
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png', label: 'Escritorio con Repisa Aérea' },
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png', label: 'Estación de Trabajo Doble' },
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png', label: 'Módulo Juvenil de Estudio' },
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.png', label: 'Escritorio Ejecutivo Compacto' },
    ],
  },
  {
    id: 'oficina',
    num: '05',
    title: 'Mobiliario Corporativo & Oficinas',
    badge: 'Empresarial & Recepción',
    desc: 'Equipamiento integral para empresas y oficinas ejecutivas. Counters de recepción monolíticos con iluminación indirecta, credenzas de archivo de gran capacidad y mesas de directorio modulables.',
    specs: ['Estructuras de Alta Resistencia', 'Conectividad Eléctrica Oculta', 'Cerraduras Centralizadas', 'Acabados Corporativos'],
    href: '/muebles-oficina',
    ctaText: 'Explorar Mobiliario de Oficina',
    photos: [
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg', label: 'Counter de Recepción Monolítico' },
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-005.jpg', label: 'Mesa de Reuniones & Conectividad' },
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-006.jpg', label: 'Credenza & Archivo Ejecutivo' },
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.jpg', label: 'Estaciones Operativas Múltiples' },
    ],
  },
  {
    id: 'puertas',
    num: '06',
    title: 'Puertas Pivotantes & Puertas de Paso',
    badge: 'Acceso Monumental',
    desc: 'Puertas de ingreso principal monumentales de hasta 3 metros de altura con sistema pivotante axial de acero inoxidable, núcleo aislante térmico-acústico y marcos envolventes.',
    specs: ['Pivote Axial Inoxidable', 'Aislamiento Acústico', 'Alturas hasta 3.00m', 'Acabado Madera & Lacado'],
    href: '/puertas',
    ctaText: 'Explorar Catálogo de Puertas',
    photos: [
      { url: '/images/catalog/extracted_DE_PUERTAS/img-004.jpg', label: 'Puerta Pivotante Monumental' },
      { url: '/images/catalog/extracted_DE_PUERTAS/img-005.jpg', label: 'Detalle de Jalador Embutido' },
      { url: '/images/catalog/extracted_DE_PUERTAS/img-006.jpg', label: 'Puerta de Paso Interior con Marco' },
      { url: '/images/catalog/extracted_DE_PUERTAS/img-007.jpg', label: 'Acabado Roble & Cuarzo' },
    ],
  },
  {
    id: 'gamer',
    num: '07',
    title: 'Setups & Mobiliario Gamer',
    badge: 'Alto Rendimiento',
    desc: 'Mobiliario especializado para streaming y gaming. Ruteo total de cables oculto, soporte para brazos monitores dobles, bandejas ocultas para fuentes de poder y tiras LED sincronizables.',
    specs: ['Canaletas Ocultas de Cables', 'Soporte Multipantalla Reforzado', 'Iluminación LED Difusa', 'Frentes Negro Carbón Mate'],
    href: '/gamer',
    ctaText: 'Explorar Catálogo Gamer',
    photos: [
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg', label: 'Setup Gamer Minimalista' },
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-005.jpg', label: 'Estación con Repisas Iluminadas' },
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-006.jpg', label: 'Escritorio con Soporte de Monitor' },
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-007.jpg', label: 'Organización de Periféricos' },
    ],
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
        description: 'Explore las colecciones oficiales de cocinas, closets, baños y mobiliario a medida de Modulares GM.',
      },
      {
        '@type': 'ItemList',
        itemListElement: CATALOG_ROWS.map((row, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: row.title,
          url: `https://www.modularesgm.com${row.href}`,
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

      <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Catálogo Oficial GM</span>
          </nav>

          {/* CABECERA EDITORIAL */}
          <header className="mb-14 pb-8 border-b border-border/60">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl">
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2 block">
                  Catálogo General • Colecciones de Autor 2026
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-headline tracking-tight text-foreground">
                  Catálogos de Muebles Modulares y Espacios a Medida
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base md:text-lg mt-3 font-normal max-w-2xl leading-relaxed">
                  Cada ambiente concebido con rigor planimétrico, materiales hidrófugos de alta densidad y superficies nobles. Seleccione una línea para explorar todos sus modelos y solicitar cotización técnica.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/store"
                  className="inline-flex items-center gap-2 text-xs font-bold text-foreground hover:text-primary transition-colors px-5 py-3 rounded-full border border-border/80 bg-card/60 shadow-sm active:scale-95"
                >
                  <span>Explorar Tienda Completa</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Badges de Confianza */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span className="font-semibold text-foreground">Garantía 3 a 5 años</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <Truck size={16} className="text-primary shrink-0" />
                <span className="font-semibold text-foreground">Envíos a todo Ecuador</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <Sparkles size={16} className="text-amber-500 shrink-0" />
                <span className="font-semibold text-foreground">Melamina Pelikano RH 18mm</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-2xl bg-card/40 border border-border/40 text-xs">
                <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                <span className="font-semibold text-foreground">Herrajes Blum con Cierre Lento</span>
              </div>
            </div>
          </header>

          {/* FILAS DE CADA CATEGORÍA CON SU PROPIO CARRUSEL / GALERÍA */}
          <div className="space-y-16">
            {CATALOG_ROWS.map((row) => (
              <section 
                key={row.id}
                id={row.id}
                className="relative rounded-3xl border border-border/60 bg-card/40 backdrop-blur-md p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:border-border/90 hover:shadow-xl"
              >
                {/* Cabecera de la Sección / Fila */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-8">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-xs font-bold text-primary tracking-widest">
                        {row.num}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                        {row.badge}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-headline font-bold text-foreground tracking-tight">
                      {row.title}
                    </h2>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {row.desc}
                    </p>

                    {/* Especificaciones Técnicas */}
                    <div className="flex flex-wrap items-center gap-2 mt-4">
                      {row.specs.map((spec, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800/80 px-2.5 py-1 rounded-lg border border-border/50"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botón de Entrada al Catálogo Específico */}
                  <Link
                    href={row.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold tracking-wide transition-all shadow-md active:scale-95 shrink-0 self-start"
                  >
                    <span>{row.ctaText}</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Galería / Riel Deslizable de Fotos de la Categoría */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
                  {row.photos.map((photo, pIdx) => (
                    <Link
                      key={pIdx}
                      href={row.href}
                      className="group relative flex-shrink-0 w-[240px] sm:w-[280px] lg:w-[275px] aspect-[4/3] rounded-2xl overflow-hidden border border-border/50 bg-muted/40 snap-start shadow-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                    >
                      <Image
                        src={photo.url}
                        alt={`${row.title} - ${photo.label}`}
                        fill
                        sizes="(max-width: 640px) 240px, 280px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                      
                      <div className="absolute bottom-3 left-3 right-3 z-10">
                        <span className="text-[11px] font-semibold text-white drop-shadow-sm line-clamp-1">
                          {photo.label}
                        </span>
                        <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          Ver catálogo ➔
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* RESUMEN SEMÁNTICO EN EL PIE DE PÁGINA */}
          <aside className="mt-16 p-6 rounded-3xl border border-border/40 bg-card/20 text-xs text-muted-foreground leading-relaxed">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Sobre la fabricación de muebles modulares en Modulares GM
            </h3>
            <p>
              Todos los proyectos exhibidos en este catálogo son diseñados y fabricados en nuestro taller especializado en Quito, Ecuador. Utilizamos tableros Pelikano RH con recubrimiento melamínico antibacterial y herrajes europeos con garantía certificada. Ofrecemos visitas técnicas en Quito, Cumbayá, Tumbaco y los Valles sin costo de inspección.
            </p>
          </aside>

        </div>
      </div>
    </>
  );
}
