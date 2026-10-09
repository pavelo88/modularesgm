import type { Product } from './types';

export interface CategorySEO {
  slug: string;
  categoryName: string;
  title: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  directAnswerCapsule: {
    definition: string;
    keyTakeaways: string[];
    priceRange: string;
    warranty: string;
  };
  faqs: Array<{ question: string; answer: string }>;
}

export const CATEGORIES_SEO: Record<string, CategorySEO> = {
  escritorios: {
    slug: 'escritorios',
    categoryName: 'Escritorios',
    title: 'Escritorios Modulares y Ergonómicos en Quito | GM',
    metaDescription: 'Compra escritorios modulares, juveniles y ejecutivos en Quito. Diseños ergonómicos en melamina Pelikano de 18mm con garantía y entrega directa.',
    h1: 'Escritorios Modulares y Ergonómicos a Medida en Quito',
    heroSubtitle: 'Diseñados para máxima productividad, teletrabajo y estudio con tableros antirrayas de 18mm y herrajes de alta durabilidad.',
    directAnswerCapsule: {
      definition: 'Modulares GM diseña y fabrica escritorios ergonómicos y estudiantiles en Quito con melamina antibacterial Pelikano/Novopan de 18mm.',
      keyTakeaways: [
        'Modelos estudiantiles compactos y escritorios en L para oficina en casa.',
        'Herrajes reforzados, pasacables integrados y cajoneras con rieles telescópicos.',
        'Precios directos de fábrica desde $145 con entrega e instalación garantizada.',
        'Personalización total en más de 20 acabados amaderados y tonos unicolores.'
      ],
      priceRange: 'Desde $145 hasta $480 USD',
      warranty: '3 años de garantía en estructura y herrajes'
    },
    faqs: [
      {
        question: '¿Qué materiales utilizan en los escritorios?',
        answer: 'Fabricamos con tableros melamínicos de 18mm Pelikano y Novopan de alta densidad con cantos termoencolados para evitar humedad y despostilladuras.'
      }
    ]
  },
  'muebles-oficina': {
    slug: 'muebles-oficina',
    categoryName: 'Muebles de Oficina',
    title: 'Mobiliario Corporativo y Muebles de Oficina Quito | GM',
    metaDescription: 'Muebles de oficina modulares, counters de recepción y credenzas en Quito. Mobiliario corporativo duradero con instalación profesional.',
    h1: 'Mobiliario Corporativo y Muebles de Oficina Modulares',
    heroSubtitle: 'Soluciones integrales para oficinas modernas: counters de recepción, credenzas ejecutivas y escritorios múltiples.',
    directAnswerCapsule: {
      definition: 'Fabricación corporativa de puestos de trabajo, estaciones operativas y mobiliario de recepción en melamina de 18mm y estructuras reforzadas.',
      keyTakeaways: [
        'Counters de recepción de alto impacto visual con iluminación LED integrada.',
        'Estaciones de trabajo modulares para 2, 4 o 6 personas con pasacables.',
        'Credenzas, cajoneras móviles con cerradura centralizada y archivadores.',
        'Asesoría en distribución de espacios y levantamiento planimétrico sin costo.'
      ],
      priceRange: 'Cotización personalizada por proyecto o módulo',
      warranty: '5 años de garantía corporativa'
    },
    faqs: []
  },
  closets: {
    slug: 'closets',
    categoryName: 'Clósets',
    title: 'Clósets Modulares y Walk-in Closets a Medida Quito | GM',
    metaDescription: 'Vestidores boutique y clósets a medida en Quito. Iluminación LED oculta, puertas de vidrio bronce y organizadores inteligentes.',
    h1: 'Clósets Modulares y Walk-in Closets de Autor',
    heroSubtitle: 'Transformamos tu dormitorio con vestidores boutique, zapateras extraíbles y acabados amaderados de lujo.',
    directAnswerCapsule: {
      definition: 'Modulares GM diseña walk-in closets y armarios modulares optimizados con zapateras retroiluminadas, pantaloneras e iluminación inteligente.',
      keyTakeaways: [
        'Distribución personalizada según tu colección de ropa, zapatos y accesorios.',
        'Puertas batientes, corredizas o vitrinas en aluminio con cristal templado.',
        'Iluminación LED con sensores de apertura de puerta.',
        'Materiales antihumedad ideales para el clima de Quito y serranía.'
      ],
      priceRange: 'Desde $380 por módulo / Cotización a medida',
      warranty: '5 años de garantía en carpintería'
    },
    faqs: []
  },
  cocinas: {
    slug: 'cocinas',
    categoryName: 'Cocinas',
    title: 'Cocinas Modulares y Mesones de Cuarzo en Quito | GM',
    metaDescription: 'Cocinas integrales a medida en Quito con mesones de cuarzo y herrajes Blum cierre suave. Diseños 3D fotorrealistas y 10 años de garantía.',
    h1: 'Cocinas Modulares de Alta Gama y Mesones de Cuarzo',
    heroSubtitle: 'Diseño ergónomico, melamina RH 18mm resistente al agua e islas monumentales con cuarzo Calacatta Gold.',
    directAnswerCapsule: {
      definition: 'Cocinas integrales diseñadas con renderizado 3D previo, estructuras en melamina RH hidrófuga de 18mm y mesones de cuarzo o Dekton.',
      keyTakeaways: [
        'Módulos altos y bajos diseñados para electrodomésticos empotrados.',
        'Herrajes europeos Blum con bisagras clip-top y sistemas de elevación Aventos.',
        'Mesones en cuarzo antibacterial, granito pulido o Dekton ultracompacto.',
        'Garantía total de instalación con sellado impermeable contra fugas.'
      ],
      priceRange: 'Desde $250 por metro lineal base / Cotización integral llave en mano',
      warranty: '10 años de garantía en mesones y 5 años en carpintería'
    },
    faqs: []
  },
  'muebles-bano': {
    slug: 'muebles-bano',
    categoryName: 'Muebles de Baño',
    title: 'Muebles de Baño Flotantes y Vanities en Quito | GM',
    metaDescription: 'Vanities y muebles de baño flotantes a medida en Quito. Tableros 100% resistentes a la humedad RH con mesones de cuarzo y espejos LED táctiles.',
    h1: 'Muebles de Baño Flotantes y Vanities Modernos',
    heroSubtitle: 'Estilo tipo spa para tu hogar: muebles suspendidos resistentes al vapor con lavabos de sobreponer y espejos con iluminación retroiluminada.',
    directAnswerCapsule: {
      definition: 'Vanities flotantes y botiquines diseñados con tableros marinos hidrófugos y encimeras de cuarzo que soportan contacto con agua y vapor.',
      keyTakeaways: [
        'Estructuras suspendidas que facilitan la limpieza del piso del baño.',
        'Topes en cuarzo blanco, calacatta o mármol con perforación para grifería.',
        'Cajones con corte para desagüe sifón y cierre amortiguado.',
        'Opciones con espejos retroiluminados LED con botón táctil antivaho.'
      ],
      priceRange: 'Desde $180 hasta $450 USD según dimensiones',
      warranty: '5 años de garantía contra humedad'
    },
    faqs: []
  },
  puertas: {
    slug: 'puertas',
    categoryName: 'Puertas',
    title: 'Puertas Principales y de Interior en Quito | Modulares GM',
    metaDescription: 'Puertas pivotantes de lujo y puertas de interior lacadas en Quito. Diseños modernos con cerraduras de alta seguridad y cerraduras magnéticas.',
    h1: 'Puertas Principales Pivotantes y de Interior',
    heroSubtitle: 'La primera impresión de tu hogar con puertas pivotantes de gran formato, acabados lacados poliuretano y cerraduras magnéticas silenciosas.',
    directAnswerCapsule: {
      definition: 'Puertas de paso y principales fabricadas con bastidores macizos, enchapes de alta resistencia y sistemas pivotantes de rodamientos axiales.',
      keyTakeaways: [
        'Puertas principales de hasta 3 metros de altura con apertura pivotante suave.',
        'Puertas interiores con marcos envolventes y burletes de amortiguación acústica.',
        'Cerraduras magnéticas silenciosas y cerraduras inteligentes digitales.',
        'Acabados en lacas poliuretánicas mate, satinadas o texturas amaderadas.'
      ],
      priceRange: 'Desde $160 (interior) hasta $850 (pivotantes de lujo)',
      warranty: '3 años de garantía en funcionamiento mecánico'
    },
    faqs: []
  },
  gamer: {
    slug: 'gamer',
    categoryName: 'Gamer',
    title: 'Habitaciones y Setups Gamer a Medida en Quito | GM',
    metaDescription: 'Diseño y fabricación de cuartos gamer y escritorios gaming en Quito. Iluminación RGB integrada, paneles acústicos y soporte multipantalla.',
    h1: 'Habitaciones Gamer y Setups Profesionales a Medida',
    heroSubtitle: 'Lleva tu experiencia de juego y streaming al siguiente nivel con escritorios reinforced, iluminación inteligente y paneles ranurados.',
    directAnswerCapsule: {
      definition: 'Mobiliario gamer profesional creado por Modulares GM con ergonomía para largas sesiones de juego y canalización integral de cables.',
      keyTakeaways: [
        'Escritorios con soporte para monitores pesados y brazos articulados.',
        'Ruteo de cables 100% oculto con canaletas integradas bajo el tablero.',
        'Integración con tiras LED RGB sincronizables con control remoto o app.',
        'Paneles de pared 3D, repisas para figuras coleccionables y soporte de CPU.'
      ],
      priceRange: 'Diseño integral personalizado a medida',
      warranty: '3 años de garantía total'
    },
    faqs: []
  }
};

export const ALL_CATALOG_PRODUCTS: Product[] = [
  {
    "id": 1,
    "title": "Cocinas Modelo GM-101",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1495,
    "discountPrice": 1420,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-004.jpg",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-004.jpg",
      "/images/catalog/extracted_DE_COCINAS/img-005.jpg"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 2,
    "title": "Cocinas Modelo GM-102",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1540,
    "discountPrice": 1463,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-006.jpg",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-006.jpg",
      "/images/catalog/extracted_DE_COCINAS/img-007.jpg"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 3,
    "title": "Cocinas Modelo GM-103",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1585,
    "discountPrice": 1506,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-008.jpg",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-008.jpg",
      "/images/catalog/extracted_DE_COCINAS/img-009.jpg"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 4,
    "title": "Cocinas Modelo GM-104",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1630,
    "discountPrice": 1549,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-010.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-010.png",
      "/images/catalog/extracted_DE_COCINAS/img-011.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 5,
    "title": "Cocinas Modelo GM-105",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1675,
    "discountPrice": 1591,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-012.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-012.png",
      "/images/catalog/extracted_DE_COCINAS/img-013.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 6,
    "title": "Cocinas Modelo GM-106",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1720,
    "discountPrice": 1634,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-014.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-014.png",
      "/images/catalog/extracted_DE_COCINAS/img-015.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 7,
    "title": "Cocinas Modelo GM-107",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1450,
    "discountPrice": 1378,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-016.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-016.png",
      "/images/catalog/extracted_DE_COCINAS/img-017.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 8,
    "title": "Cocinas Modelo GM-108",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1495,
    "discountPrice": 1420,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-018.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-018.png",
      "/images/catalog/extracted_DE_COCINAS/img-019.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 9,
    "title": "Cocinas Modelo GM-109",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1540,
    "discountPrice": 1463,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-020.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-020.png",
      "/images/catalog/extracted_DE_COCINAS/img-021.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 10,
    "title": "Cocinas Modelo GM-110",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1585,
    "discountPrice": 1506,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-022.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-022.png",
      "/images/catalog/extracted_DE_COCINAS/img-023.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 11,
    "title": "Cocinas Modelo GM-111",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1630,
    "discountPrice": 1549,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-024.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-024.png",
      "/images/catalog/extracted_DE_COCINAS/img-025.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 12,
    "title": "Cocinas Modelo GM-112",
    "desc": "Cocina integral con mesón de cuarzo y herrajes Blum.",
    "price": 1675,
    "discountPrice": 1591,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-026.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-026.png"
    ],
    "category": "Cocinas",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 13,
    "title": "Closets Modelo GM-113",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 1120,
    "discountPrice": 1064,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-004.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-004.png",
      "/images/catalog/extracted_CLOSETS_1/img-005.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 14,
    "title": "Closets Modelo GM-114",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 850,
    "discountPrice": 808,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-006.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-006.png",
      "/images/catalog/extracted_CLOSETS_1/img-007.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 15,
    "title": "Closets Modelo GM-115",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 895,
    "discountPrice": 850,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-008.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-008.png",
      "/images/catalog/extracted_CLOSETS_1/img-009.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 16,
    "title": "Closets Modelo GM-116",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 940,
    "discountPrice": 893,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-010.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-010.png",
      "/images/catalog/extracted_CLOSETS_1/img-011.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 17,
    "title": "Closets Modelo GM-117",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 985,
    "discountPrice": 936,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-012.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-012.png",
      "/images/catalog/extracted_CLOSETS_1/img-013.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 18,
    "title": "Closets Modelo GM-118",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 1030,
    "discountPrice": 979,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-014.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-014.png",
      "/images/catalog/extracted_CLOSETS_1/img-015.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 19,
    "title": "Closets Modelo GM-119",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 1075,
    "discountPrice": 1021,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-016.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-016.png",
      "/images/catalog/extracted_CLOSETS_1/img-017.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 20,
    "title": "Closets Modelo GM-120",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 1120,
    "discountPrice": 1064,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-018.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-018.png",
      "/images/catalog/extracted_CLOSETS_1/img-019.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 21,
    "title": "Closets Modelo GM-121",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 850,
    "discountPrice": 808,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-020.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-020.png",
      "/images/catalog/extracted_CLOSETS_1/img-021.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 22,
    "title": "Closets Modelo GM-122",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 895,
    "discountPrice": 850,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-022.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-022.png",
      "/images/catalog/extracted_CLOSETS_1/img-023.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 23,
    "title": "Closets Modelo GM-123",
    "desc": "Walk-in closet modular con iluminación LED y vestidor boutique.",
    "price": 940,
    "discountPrice": 893,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-024.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-024.png"
    ],
    "category": "Closets",
    "priceUnit": "metro_lineal",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "Por metro lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 24,
    "title": "Escritorios Modelo GM-124",
    "desc": "Escritorio estudiantil ergonómico en melamina Pelikano 18mm.",
    "price": 355,
    "discountPrice": 337,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png",
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 25,
    "title": "Escritorios Modelo GM-125",
    "desc": "Escritorio estudiantil ergonómico en melamina Pelikano 18mm.",
    "price": 400,
    "discountPrice": 380,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png",
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 26,
    "title": "Escritorios Modelo GM-126",
    "desc": "Escritorio estudiantil ergonómico en melamina Pelikano 18mm.",
    "price": 445,
    "discountPrice": 423,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-004.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-004.png",
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-005.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 27,
    "title": "Escritorios Modelo GM-127",
    "desc": "Escritorio estudiantil ergonómico en melamina Pelikano 18mm.",
    "price": 490,
    "discountPrice": 466,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-006.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-006.png",
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-009.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 28,
    "title": "Escritorios Modelo GM-128",
    "desc": "Escritorio estudiantil ergonómico en melamina Pelikano 18mm.",
    "price": 220,
    "discountPrice": 209,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-012.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-012.png",
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-015.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 29,
    "title": "Escritorios Modelo GM-129",
    "desc": "Escritorio estudiantil ergonómico en melamina Pelikano 18mm.",
    "price": 265,
    "discountPrice": 252,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-018.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-018.png",
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-021.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 30,
    "title": "Oficina Modelo GM-130",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 570,
    "discountPrice": 542,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-005.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 31,
    "title": "Oficina Modelo GM-131",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 615,
    "discountPrice": 584,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-006.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-006.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-007.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 32,
    "title": "Oficina Modelo GM-132",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 660,
    "discountPrice": 627,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-010.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-010.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-011.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 33,
    "title": "Oficina Modelo GM-133",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 705,
    "discountPrice": 670,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-012.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-012.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-014.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 34,
    "title": "Oficina Modelo GM-134",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 750,
    "discountPrice": 713,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-015.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-015.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-016.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 35,
    "title": "Oficina Modelo GM-135",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 480,
    "discountPrice": 456,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-017.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-017.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-019.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 36,
    "title": "Oficina Modelo GM-136",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 525,
    "discountPrice": 499,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-020.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-020.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-021.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 37,
    "title": "Oficina Modelo GM-137",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 570,
    "discountPrice": 542,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-023.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-023.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-024.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 38,
    "title": "Oficina Modelo GM-138",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 615,
    "discountPrice": 584,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-025.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-025.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-026.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 39,
    "title": "Oficina Modelo GM-139",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 660,
    "discountPrice": 627,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-028.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-028.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-029.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 40,
    "title": "Oficina Modelo GM-140",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 705,
    "discountPrice": 670,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-030.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-030.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-031.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 41,
    "title": "Oficina Modelo GM-141",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 750,
    "discountPrice": 713,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-033.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-033.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-034.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 42,
    "title": "Oficina Modelo GM-142",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 480,
    "discountPrice": 456,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-035.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-035.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-036.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 43,
    "title": "Oficina Modelo GM-143",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 525,
    "discountPrice": 499,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-037.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-037.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-039.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 44,
    "title": "Oficina Modelo GM-144",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 570,
    "discountPrice": 542,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-040.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-040.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-041.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 45,
    "title": "Oficina Modelo GM-145",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 615,
    "discountPrice": 584,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-043.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-043.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-044.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 46,
    "title": "Oficina Modelo GM-146",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 660,
    "discountPrice": 627,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-045.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-045.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-046.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 47,
    "title": "Oficina Modelo GM-147",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 705,
    "discountPrice": 670,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-048.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-048.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-049.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 48,
    "title": "Oficina Modelo GM-148",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 750,
    "discountPrice": 713,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-050.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-050.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-053.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 49,
    "title": "Oficina Modelo GM-149",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 480,
    "discountPrice": 456,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-054.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-054.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-055.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 50,
    "title": "Oficina Modelo GM-150",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 525,
    "discountPrice": 499,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-057.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-057.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-058.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 51,
    "title": "Oficina Modelo GM-151",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 570,
    "discountPrice": 542,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-059.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-059.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-060.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 52,
    "title": "Oficina Modelo GM-152",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 615,
    "discountPrice": 584,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-061.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-061.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-063.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 53,
    "title": "Oficina Modelo GM-153",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 660,
    "discountPrice": 627,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-064.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-064.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-065.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 54,
    "title": "Oficina Modelo GM-154",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 705,
    "discountPrice": 670,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-067.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-067.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-068.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 55,
    "title": "Oficina Modelo GM-155",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 750,
    "discountPrice": 713,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-069.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-069.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-071.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 56,
    "title": "Oficina Modelo GM-156",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 480,
    "discountPrice": 456,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-072.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-072.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-074.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 57,
    "title": "Oficina Modelo GM-157",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 525,
    "discountPrice": 499,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-075.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-075.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-076.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 58,
    "title": "Oficina Modelo GM-158",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 570,
    "discountPrice": 542,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-077.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-077.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-079.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 59,
    "title": "Oficina Modelo GM-159",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 615,
    "discountPrice": 584,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-080.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-080.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-081.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 60,
    "title": "Oficina Modelo GM-160",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 660,
    "discountPrice": 627,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-084.png",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-084.png",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-085.png"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 61,
    "title": "Oficina Modelo GM-161",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 705,
    "discountPrice": 670,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-086.png",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-086.png",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-088.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 62,
    "title": "Oficina Modelo GM-162",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 750,
    "discountPrice": 713,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-089.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-089.jpg",
      "/images/catalog/extracted_MUEBLES_OFICINA/img-091.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 63,
    "title": "Oficina Modelo GM-163",
    "desc": "Credenza ejecutiva y counter de recepción modular.",
    "price": 480,
    "discountPrice": 456,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-092.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-092.jpg"
    ],
    "category": "Oficina",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 64,
    "title": "Baño Modelo GM-164",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 425,
    "discountPrice": 404,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 65,
    "title": "Baño Modelo GM-165",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 470,
    "discountPrice": 447,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-007.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 66,
    "title": "Baño Modelo GM-166",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 515,
    "discountPrice": 489,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-008.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-008.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-009.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 67,
    "title": "Baño Modelo GM-167",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 560,
    "discountPrice": 532,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-010.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-010.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-011.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 68,
    "title": "Baño Modelo GM-168",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 605,
    "discountPrice": 575,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-012.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-012.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-013.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 69,
    "title": "Baño Modelo GM-169",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 650,
    "discountPrice": 618,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-014.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-014.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-015.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 70,
    "title": "Baño Modelo GM-170",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 380,
    "discountPrice": 361,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-016.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-016.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-017.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 71,
    "title": "Baño Modelo GM-171",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 425,
    "discountPrice": 404,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-018.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-018.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-019.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 72,
    "title": "Baño Modelo GM-172",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 470,
    "discountPrice": 447,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-020.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-020.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-021.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 73,
    "title": "Baño Modelo GM-173",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 515,
    "discountPrice": 489,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-022.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-022.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-023.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 74,
    "title": "Baño Modelo GM-174",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 560,
    "discountPrice": 532,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-024.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-024.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-025.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 75,
    "title": "Baño Modelo GM-175",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 605,
    "discountPrice": 575,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-026.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-026.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-027.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 76,
    "title": "Baño Modelo GM-176",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 650,
    "discountPrice": 618,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-028.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-028.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-029.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 77,
    "title": "Baño Modelo GM-177",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 380,
    "discountPrice": 361,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-030.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-030.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-031.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 78,
    "title": "Baño Modelo GM-178",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 425,
    "discountPrice": 404,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-032.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-032.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-033.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 79,
    "title": "Baño Modelo GM-179",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 470,
    "discountPrice": 447,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-034.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-034.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-035.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 80,
    "title": "Baño Modelo GM-180",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 515,
    "discountPrice": 489,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-036.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-036.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-037.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 81,
    "title": "Baño Modelo GM-181",
    "desc": "Mueble de baño flotante resistente a humedad con cuarzo.",
    "price": 560,
    "discountPrice": 532,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-038.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-038.jpg",
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-039.jpg"
    ],
    "category": "Baño",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 82,
    "title": "Puertas Modelo GM-182",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 875,
    "discountPrice": 831,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-004.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-004.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-005.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 83,
    "title": "Puertas Modelo GM-183",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 920,
    "discountPrice": 874,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-006.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-006.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-007.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 84,
    "title": "Puertas Modelo GM-184",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 650,
    "discountPrice": 618,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-008.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-008.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-009.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 85,
    "title": "Puertas Modelo GM-185",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 695,
    "discountPrice": 660,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-010.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-010.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-011.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 86,
    "title": "Puertas Modelo GM-186",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 740,
    "discountPrice": 703,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-012.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-012.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-013.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 87,
    "title": "Puertas Modelo GM-187",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 785,
    "discountPrice": 746,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-014.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-014.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-015.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 88,
    "title": "Puertas Modelo GM-188",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 830,
    "discountPrice": 789,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-016.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-016.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-017.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 89,
    "title": "Puertas Modelo GM-189",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 875,
    "discountPrice": 831,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-018.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-018.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-019.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 90,
    "title": "Puertas Modelo GM-190",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 920,
    "discountPrice": 874,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-020.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-020.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-021.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 91,
    "title": "Puertas Modelo GM-191",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 650,
    "discountPrice": 618,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-022.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-022.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-023.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 92,
    "title": "Puertas Modelo GM-192",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 695,
    "discountPrice": 660,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-024.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-024.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-025.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 93,
    "title": "Puertas Modelo GM-193",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 740,
    "discountPrice": 703,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-026.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-026.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-027.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 94,
    "title": "Puertas Modelo GM-194",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 785,
    "discountPrice": 746,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-028.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-028.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-029.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 95,
    "title": "Puertas Modelo GM-195",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 830,
    "discountPrice": 789,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-030.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-030.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-031.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 96,
    "title": "Puertas Modelo GM-196",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 875,
    "discountPrice": 831,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-032.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-032.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-033.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 97,
    "title": "Puertas Modelo GM-197",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 920,
    "discountPrice": 874,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-034.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-034.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-035.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 98,
    "title": "Puertas Modelo GM-198",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 650,
    "discountPrice": 618,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-036.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-036.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-037.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 99,
    "title": "Puertas Modelo GM-199",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 695,
    "discountPrice": 660,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-038.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-038.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-039.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 100,
    "title": "Puertas Modelo GM-200",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 740,
    "discountPrice": 703,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-040.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-040.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-041.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 101,
    "title": "Puertas Modelo GM-201",
    "desc": "Puerta pivotante monumental de 3m con cerrojo digital.",
    "price": 785,
    "discountPrice": 746,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-042.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-042.jpg",
      "/images/catalog/extracted_DE_PUERTAS/img-043.jpg"
    ],
    "category": "Puertas",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 102,
    "title": "Gamer Modelo GM-202",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 520,
    "discountPrice": 494,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-005.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 103,
    "title": "Gamer Modelo GM-203",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 565,
    "discountPrice": 537,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-006.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-006.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-007.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 104,
    "title": "Gamer Modelo GM-204",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 610,
    "discountPrice": 580,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-008.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-008.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-009.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 105,
    "title": "Gamer Modelo GM-205",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 340,
    "discountPrice": 323,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-010.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-010.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-011.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 106,
    "title": "Gamer Modelo GM-206",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 385,
    "discountPrice": 366,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-012.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-012.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-013.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 107,
    "title": "Gamer Modelo GM-207",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 430,
    "discountPrice": 409,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-014.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-014.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-015.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 108,
    "title": "Gamer Modelo GM-208",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 475,
    "discountPrice": 451,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-016.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-016.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-017.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 109,
    "title": "Gamer Modelo GM-209",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 520,
    "discountPrice": 494,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-018.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-018.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-019.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 110,
    "title": "Gamer Modelo GM-210",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 565,
    "discountPrice": 537,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-020.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-020.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-021.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 111,
    "title": "Gamer Modelo GM-211",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 610,
    "discountPrice": 580,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-022.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-022.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-023.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 112,
    "title": "Gamer Modelo GM-212",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 340,
    "discountPrice": 323,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-024.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-024.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-025.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 113,
    "title": "Gamer Modelo GM-213",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 385,
    "discountPrice": 366,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-026.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-026.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-027.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 114,
    "title": "Gamer Modelo GM-214",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 430,
    "discountPrice": 409,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-028.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-028.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-029.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 115,
    "title": "Gamer Modelo GM-215",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 475,
    "discountPrice": 451,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-030.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-030.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-031.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 116,
    "title": "Gamer Modelo GM-216",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 520,
    "discountPrice": 494,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-032.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-032.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-033.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 117,
    "title": "Gamer Modelo GM-217",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 565,
    "discountPrice": 537,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-034.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-034.jpg",
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-035.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 118,
    "title": "Gamer Modelo GM-218",
    "desc": "Setup gamer con ruteo de cables oculto y perfiles LED.",
    "price": 610,
    "discountPrice": 580,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-036.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-036.jpg"
    ],
    "category": "Gamer",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 119,
    "title": "Estimulación Modelo GM-219",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 180,
    "discountPrice": 171,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-000.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-004.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 120,
    "title": "Estimulación Modelo GM-220",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 225,
    "discountPrice": 214,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-008.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-008.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-012.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 121,
    "title": "Estimulación Modelo GM-221",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 270,
    "discountPrice": 257,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-016.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-016.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-020.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 122,
    "title": "Estimulación Modelo GM-222",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 315,
    "discountPrice": 299,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-024.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-024.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-028.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 123,
    "title": "Estimulación Modelo GM-223",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 360,
    "discountPrice": 342,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-032.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-032.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-036.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 124,
    "title": "Estimulación Modelo GM-224",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 405,
    "discountPrice": 385,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-040.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-040.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-044.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 125,
    "title": "Estimulación Modelo GM-225",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 450,
    "discountPrice": 428,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-048.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-048.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-052.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 126,
    "title": "Estimulación Modelo GM-226",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 180,
    "discountPrice": 171,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-056.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-056.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-060.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 127,
    "title": "Estimulación Modelo GM-227",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 225,
    "discountPrice": 214,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-064.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-064.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-068.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 128,
    "title": "Estimulación Modelo GM-228",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 270,
    "discountPrice": 257,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-072.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-072.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-076.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 129,
    "title": "Estimulación Modelo GM-229",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 315,
    "discountPrice": 299,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-080.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-080.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-084.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 130,
    "title": "Estimulación Modelo GM-230",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 360,
    "discountPrice": 342,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-088.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-088.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-092.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 131,
    "title": "Estimulación Modelo GM-231",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 405,
    "discountPrice": 385,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-096.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-096.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-100.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 132,
    "title": "Estimulación Modelo GM-232",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 450,
    "discountPrice": 428,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-104.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-104.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-108.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 133,
    "title": "Estimulación Modelo GM-233",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 180,
    "discountPrice": 171,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-112.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-112.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-116.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 134,
    "title": "Estimulación Modelo GM-234",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 225,
    "discountPrice": 214,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-120.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-120.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-124.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 135,
    "title": "Estimulación Modelo GM-235",
    "desc": "Circuito de estimulación sensorial y psicomotriz.",
    "price": 270,
    "discountPrice": 257,
    "imgUrl": "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-128.png",
    "images": [
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-128.png",
      "/images/catalog/extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM/img-132.png"
    ],
    "category": "Estimulación",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 136,
    "title": "Escritorios Modelo GM-236",
    "desc": "Módulo estudiantil compacto con repisas.",
    "price": 330,
    "discountPrice": 314,
    "imgUrl": "/images/catalog/extracted_estudiantiles/img-000.png",
    "images": [
      "/images/catalog/extracted_estudiantiles/img-000.png",
      "/images/catalog/extracted_estudiantiles/img-001.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 137,
    "title": "Escritorios Modelo GM-237",
    "desc": "Módulo estudiantil compacto con repisas.",
    "price": 375,
    "discountPrice": 356,
    "imgUrl": "/images/catalog/extracted_estudiantiles/img-002.png",
    "images": [
      "/images/catalog/extracted_estudiantiles/img-002.png",
      "/images/catalog/extracted_estudiantiles/img-003.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 138,
    "title": "Escritorios Modelo GM-238",
    "desc": "Módulo estudiantil compacto con repisas.",
    "price": 420,
    "discountPrice": 399,
    "imgUrl": "/images/catalog/extracted_estudiantiles/img-004.png",
    "images": [
      "/images/catalog/extracted_estudiantiles/img-004.png",
      "/images/catalog/extracted_estudiantiles/img-005.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 139,
    "title": "Escritorios Modelo GM-239",
    "desc": "Módulo estudiantil compacto con repisas.",
    "price": 465,
    "discountPrice": 442,
    "imgUrl": "/images/catalog/extracted_estudiantiles/img-006.png",
    "images": [
      "/images/catalog/extracted_estudiantiles/img-006.png",
      "/images/catalog/extracted_estudiantiles/img-009.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  },
  {
    "id": 140,
    "title": "Escritorios Modelo GM-240",
    "desc": "Módulo estudiantil compacto con repisas.",
    "price": 195,
    "discountPrice": 185,
    "imgUrl": "/images/catalog/extracted_estudiantiles/img-012.png",
    "images": [
      "/images/catalog/extracted_estudiantiles/img-012.png",
      "/images/catalog/extracted_estudiantiles/img-015.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": true
  },
  {
    "id": 141,
    "title": "Escritorios Modelo GM-241",
    "desc": "Módulo estudiantil compacto con repisas.",
    "price": 240,
    "discountPrice": 228,
    "imgUrl": "/images/catalog/extracted_estudiantiles/img-018.png",
    "images": [
      "/images/catalog/extracted_estudiantiles/img-018.png",
      "/images/catalog/extracted_estudiantiles/img-021.png"
    ],
    "category": "Escritorios",
    "priceUnit": "unidad",
    "material": "Melamina Pelikano RH 18mm & Herrajes Blum",
    "dimensions": "1.80m x 0.60m x 0.75m",
    "inStock": true,
    "featured": false
  }
];

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'Todos') return ALL_CATALOG_PRODUCTS;
  return ALL_CATALOG_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProducts(): Product[] {
  return ALL_CATALOG_PRODUCTS.filter((p) => p.featured);
}
