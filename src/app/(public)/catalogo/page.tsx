import type { Metadata } from 'next';
import { CatalogoExplorer, type CatalogRow } from '@/components/catalog/catalogo-explorer';

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

const CATALOG_ROWS: CatalogRow[] = [
  {
    id: 'cocinas',
    num: '01',
    title: 'Cocinas Integrales & Mesones de Cuarzo',
    badge: 'Línea de Autor',
    categoryTag: 'cocinas',
    desc: 'Diseño arquitectónico a medida. Tableros melamínicos Pelikano RH de 18mm resistentes a humedad y calor, herrajes alemanes Blum con cierre amortiguado y mesones en cuarzo Calacatta o granito natural.',
    specs: ['Tablero Pelikano RH 18mm', 'Cuarzo Antibacterial', 'Herrajes Blum Cierre Suave', 'Garantía 3 a 5 Años'],
    href: '/cocinas',
    ctaText: 'Explorar Catálogo de Cocinas',
    photos: [
      { url: '/images/catalog/extracted_DE_COCINAS/img-004.webp', label: 'Cocina con Isla Central' },
      { url: '/images/catalog/extracted_DE_COCINAS/img-005.webp', label: 'Muebles Aéreos & Iluminación' },
      { url: '/images/catalog/extracted_DE_COCINAS/img-006.webp', label: 'Mesón de Cuarzo Calacatta' },
      { url: '/images/catalog/extracted_DE_COCINAS/img-007.webp', label: 'Torre de Hornos & Alacena' },
    ],
  },
  {
    id: 'closets',
    num: '02',
    title: 'Clósets, Armarios & Walk-in Closets',
    badge: 'Optimización de Espacio',
    categoryTag: 'closets',
    desc: 'Vestidores personalizados con sistemas de organización inteligente: pantaloneros extraíbles, zapateras deslizables, cajones con división para accesorios y puertas en vidrio templado bronce o melamina.',
    specs: ['Rieles Ocultos Blum', 'Vidrio Templado Bronce', 'Perfiles de Aluminio', 'Luz LED Cálida 3000K'],
    href: '/closets',
    ctaText: 'Explorar Catálogo de Clósets',
    photos: [
      { url: '/images/catalog/extracted_CLOSETS_1/img-004.webp', label: 'Walk-in Closet Boutique' },
      { url: '/images/catalog/extracted_CLOSETS_1/img-005.webp', label: 'Módulo de Cajoneras & Repisas' },
      { url: '/images/catalog/extracted_CLOSETS_1/img-006.webp', label: 'Vestidor con Puertas de Vidrio' },
      { url: '/images/catalog/extracted_CLOSETS_1/img-007.webp', label: 'Organizador de Ropa & Calzado' },
    ],
  },
  {
    id: 'bano',
    num: '03',
    title: 'Vanities & Muebles de Baño Flotantes',
    badge: 'Resistencia Hidrófuga',
    categoryTag: 'bano',
    desc: 'Muebles de baño concebidos para ambientes de alta humedad. Estructura en melamina marina RH con mesones de cuarzo o resina antibacterial y espejos con iluminación LED perimetral táctil.',
    specs: ['Tablero Marino RH', 'Cuarzo Antibacterial', 'Espejos LED Táctiles', 'Desagües Ocultos'],
    href: '/muebles-bano',
    ctaText: 'Explorar Catálogo de Baños',
    photos: [
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.webp', label: 'Vanity Flotante Minimalista' },
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.webp', label: 'Mueble con Espejo Retroiluminado' },
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.webp', label: 'Lavamanos Sobrepuesto & Cuarzo' },
      { url: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-007.webp', label: 'Módulo Auxiliar de Baño' },
    ],
  },
  {
    id: 'escritorios',
    num: '04',
    title: 'Escritorios & Estaciones de Teletrabajo',
    badge: 'Ergonomía & Estudio',
    categoryTag: 'escritorios',
    desc: 'Estaciones de estudio y home office pensadas para largas jornadas de trabajo. Superficies antirrayas de 18mm con pasacables discretos, cajoneras móviles con llave y estructuras metálicas reforzadas.',
    specs: ['Superficie Antirrayas', 'Pasacables Integrados', 'Cajoneras con Cerradura', 'Diseño Ergonómico'],
    href: '/escritorios',
    ctaText: 'Explorar Catálogo de Escritorios',
    photos: [
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.webp', label: 'Escritorio con Repisa Aérea' },
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.webp', label: 'Estación de Trabajo Doble' },
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.webp', label: 'Módulo Juvenil de Estudio' },
      { url: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.webp', label: 'Escritorio Ejecutivo Compacto' },
    ],
  },
  {
    id: 'oficina',
    num: '05',
    title: 'Mobiliario Corporativo & Oficinas',
    badge: 'Empresarial & Recepción',
    categoryTag: 'oficina',
    desc: 'Equipamiento integral para empresas y oficinas ejecutivas. Counters de recepción monolíticos con iluminación indirecta, credenzas de archivo de gran capacidad y mesas de directorio modulables.',
    specs: ['Estructuras de Alta Resistencia', 'Conectividad Eléctrica Oculta', 'Cerraduras Centralizadas', 'Acabados Corporativos'],
    href: '/muebles-oficina',
    ctaText: 'Explorar Mobiliario de Oficina',
    photos: [
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-004.webp', label: 'Counter de Recepción Monolítico' },
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-005.webp', label: 'Mesa de Reuniones & Conectividad' },
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-006.webp', label: 'Credenza & Archivo Ejecutivo' },
      { url: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.webp', label: 'Estaciones Operativas Múltiples' },
    ],
  },
  {
    id: 'puertas',
    num: '06',
    title: 'Puertas Pivotantes & Puertas de Paso',
    badge: 'Acceso Monumental',
    categoryTag: 'puertas',
    desc: 'Puertas de ingreso principal monumentales de hasta 3 metros de altura con sistema pivotante axial de acero inoxidable, núcleo aislante térmico-acústico y marcos envolventes.',
    specs: ['Pivote Axial Inoxidable', 'Aislamiento Acústico', 'Alturas hasta 3.00m', 'Acabado Madera & Lacado'],
    href: '/puertas',
    ctaText: 'Explorar Catálogo de Puertas',
    photos: [
      { url: '/images/catalog/extracted_DE_PUERTAS/img-004.webp', label: 'Puerta Pivotante Monumental' },
      { url: '/images/catalog/extracted_DE_PUERTAS/img-005.webp', label: 'Detalle de Jalador Embutido' },
      { url: '/images/catalog/extracted_DE_PUERTAS/img-006.webp', label: 'Puerta de Paso Interior con Marco' },
      { url: '/images/catalog/extracted_DE_PUERTAS/img-007.webp', label: 'Acabado Roble & Cuarzo' },
    ],
  },
  {
    id: 'gamer',
    num: '07',
    title: 'Setups & Mobiliario Gamer',
    badge: 'Alto Rendimiento',
    categoryTag: 'gamer',
    desc: 'Mobiliario especializado para streaming y gaming. Ruteo total de cables oculto, soporte para brazos monitores dobles, bandejas ocultas para fuentes de poder y tiras LED sincronizables.',
    specs: ['Canaletas Ocultas de Cables', 'Soporte Multipantalla Reforzado', 'Iluminación LED Difusa', 'Frentes Negro Carbón Mate'],
    href: '/gamer',
    ctaText: 'Explorar Catálogo Gamer',
    photos: [
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.webp', label: 'Setup Gamer Minimalista' },
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-005.webp', label: 'Estación con Repisas Iluminadas' },
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-006.webp', label: 'Escritorio con Soporte de Monitor' },
      { url: '/images/catalog/extracted_MUEBLES_GAMER_2/img-007.webp', label: 'Organización de Periféricos' },
    ],
  },
  {
    id: 'estimulacion',
    num: '08',
    title: 'Circuitos de Estimulación & Espacios Infantiles',
    badge: 'Desarrollo Psicomotriz',
    categoryTag: 'estimulacion',
    desc: 'Módulos psicomotrices en madera y melamina segura, estanterías Montessori, rampas y adecuaciones ergonómicas para guarderías y centros de estimulación temprana infantil.',
    specs: ['Cantos Boleados Seguros', 'Melamina Antibacterial', 'Estructuras Reforzadas', 'Diseño Montessori'],
    href: '/store',
    ctaText: 'Explorar Circuitos Infantiles',
    photos: [
      { url: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.webp', label: 'Circuito Psicomotriz Modular' },
      { url: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-004.webp', label: 'Módulo de Trepada y Rampa' },
      { url: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-008.webp', label: 'Estantería Sensorial Montessori' },
      { url: '/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-012.webp', label: 'Área de Motricidad Infantil' },
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
      <CatalogoExplorer rows={CATALOG_ROWS} />
    </>
  );
}
