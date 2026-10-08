import type { Product } from './types';

export interface CategorySEO {
  slug: string;
  categoryName: string;
  title: string;          // 50-60 chars
  metaDescription: string;// 120-160 chars
  h1: string;             // 45-65 chars
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
      },
      {
        question: '¿Tienen entrega e instalación en Quito y valles?',
        answer: 'Sí, disponemos de servicio de transporte, armado e instalación profesional en todo Quito, Cumbayá, Tumbaco y Valle de los Chillos.'
      },
      {
        question: '¿Se pueden fabricar escritorios a medida exacta?',
        answer: 'Totalmente. Puedes solicitar dimensiones especiales o configuraciones con repisas superiores y cajones según tu espacio.'
      }
    ]
  },
  'muebles-oficina': {
    slug: 'muebles-oficina',
    categoryName: 'Muebles de Oficina',
    title: 'Muebles de Oficina y Mobiliario Corporativo en Quito',
    metaDescription: 'Mobiliario de oficina de alta gama: counters de recepción, credenzas ejecutivas y mesas de reunión modulares con diseño profesional en Quito.',
    h1: 'Mobiliario de Oficina y Soluciones Corporativas',
    heroSubtitle: 'Counters de recepción, credenzas ejecutivas y salas de reuniones que proyectan la máxima seriedad de tu empresa.',
    directAnswerCapsule: {
      definition: 'Mobiliario modular corporativo fabricado bajo estándares ergonómicos internacionales para recepción, gerencia y salas de conferencia.',
      keyTakeaways: [
        'Counters para recepción con iluminación LED indirecta y pasacables ocultos.',
        'Credenzas de archivo con cerraduras de seguridad y cajones archivadores.',
        'Mesas de reunión modulares para 6 hasta 14 personas con conectividad integrada.',
        'Asesoría técnica y distribución espacial en plano 3D sin costo adicional.'
      ],
      priceRange: 'Desde $85 hasta $950 USD según formato y volumen',
      warranty: '5 años de garantía estructural corporativa'
    },
    faqs: [
      {
        question: '¿Hacen visitas técnicas a oficinas en Quito?',
        answer: 'Sí, realizamos visitas técnicas sin costo para tomar medidas y presentar renders 3D con distribución espacial eficiente.'
      },
      {
        question: '¿Las mesas de reunión incluyen pasacables y tomas eléctricas?',
        answer: 'Diseñamos nuestras mesas corporativas con bandejas pasacables ocultas y puertos pasatapas listos para conexiones eléctricas y de red.'
      }
    ]
  },
  closets: {
    slug: 'closets',
    categoryName: 'Closets',
    title: 'Closets a Medida y Walk-in Closets en Quito | Modulares GM',
    metaDescription: 'Fabricación de clósets modernos y walk-in closets a medida en Quito. Aprovechamiento milimétrico de espacios con herrajes Blum y cierre lento.',
    h1: 'Closets a Medida y Walk-in Closets de Alta Gama',
    heroSubtitle: 'Diseños que combinan elegancia, distribución inteligente para ropa y calzado, e iluminación LED cálida integrada.',
    directAnswerCapsule: {
      definition: 'Sistemas de almacenamiento residencial diseñados al milímetro con puertas corredizas o batientes y división interior personalizada.',
      keyTakeaways: [
        'Walk-in closets con islas centrales, zapateras deslizables y pantaloneros.',
        'Puertas con perfiles de aluminio negro y vidrio templado o melamina RH.',
        'Cajones con guías invisibles y amortiguación de cierre suave.',
        'Visita a domicilio y diseño fotorealista en 3D en 24 horas.'
      ],
      priceRange: 'Cotización personalizada por metro cuadrado o lineal',
      warranty: '5 años de garantía integral'
    },
    faqs: [
      {
        question: '¿Cómo se cotiza un clóset a medida?',
        answer: 'Agendamos una visita técnica gratuita para medir el vano de tu pared y definir accesorios internos, emitiendo un presupuesto formal inmediato.'
      },
      {
        question: '¿Usan materiales resistentes a la humedad?',
        answer: 'Sí, utilizamos tableros RH (Resistentes a la Humedad) ideales para el clima de Quito y la sierra ecuatoriana.'
      }
    ]
  },
  cocinas: {
    slug: 'cocinas',
    categoryName: 'Cocinas',
    title: 'Cocinas Modulares Modernas con Cuarzo en Quito | GM',
    metaDescription: 'Diseño e instalación de cocinas modulares modernas en Quito. Muebles hidrófugos RH, herrajes de cierre suave y mesones en cuarzo y granito.',
    h1: 'Cocinas Modulares Modernas y Mesones de Cuarzo',
    heroSubtitle: 'Transformamos el corazón de tu hogar con acabados termolaminados, despensas inteligentes y mesones en cuarzo Silestone y Dekton.',
    directAnswerCapsule: {
      definition: 'Fabricación e instalación de cocinas integrales con tableros RH hidrófugos de 18mm y encimeras de piedra sinterizada o cuarzo natural.',
      keyTakeaways: [
        'Módulos altos y bajos diseñados para electrodomésticos empotrados.',
        'Herrajes europeos Blum con bisagras clip-top y sistemas de elevación Aventos.',
        'Mesones en cuarzo antibacterial, granito pulido o Dekton ultracompacto.',
        'Garantía total de instalación con sellado impermeable contra fugas.'
      ],
      priceRange: 'Desde $250 por metro lineal base / Cotización integral llave en mano',
      warranty: '10 años de garantía en mesones y 5 años en carpintería'
    },
    faqs: [
      {
        question: '¿Qué incluye la cotización de una cocina integral?',
        answer: 'Incluye levantamiento de medidas, diseño 3D, fabricación de muebles altos/bajos, mesón en cuarzo/granito, herrajes, transporte e instalación completa.'
      },
      {
        question: '¿Cuánto tiempo tarda la fabricación e instalación?',
        answer: 'El tiempo promedio de entrega es de 15 a 20 días hábiles desde la aprobación final de los planos 3D.'
      }
    ]
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
    faqs: [
      {
        question: '¿El mueble se deforma o hincha con el vapor de la ducha?',
        answer: 'No. Empleamos exclusivamente tableros con certificación RH de alta densidad y cantos sellados con poliuretano impermeable.'
      }
    ]
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
    faqs: [
      {
        question: '¿Qué es una puerta pivotante?',
        answer: 'Es una puerta que no usa bisagras laterales tradicionales, sino pernos en la parte superior e inferior, permitiendo paneles gigantes y giros elegantes.'
      }
    ]
  },
  gamer: {
    slug: 'gamer',
    categoryName: 'Gamer',
    title: 'Habitaciones y Setups Gamer a Medida en Quito | GM',
    metaDescription: 'Diseño y fabricación de cuartos gamer y escritorios gaming en Quito. Iluminación RGB integrada, paneles acústicos y soporte multipantalla.',
    h1: 'Habitaciones Gamer y Setups Profesionales a Medida',
    heroSubtitle: 'Lleva tu experiencia de juego y streaming al siguiente nivel con escritorios reforzados, iluminación inteligente y paneles ranurados.',
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
    faqs: [
      {
        question: '¿Pueden fabricar un escritorio gamer para 3 o 4 monitores?',
        answer: 'Sí, reforzamos la estructura interna con perfiles metálicos ocultos para soportar brazos hidráulicos y múltiples monitores sin vibración.'
      }
    ]
  }
};

export const ALL_CATALOG_PRODUCTS: Product[] = [
  {
    "id": 501,
    "title": "Cocina Luxury Cappuccino con Isla y Techo LED",
    "desc": "Cocina integral de alta gama con isla central, frentes en laca cappuccino alto brillo, vitrinas aéreos iluminadas con perfiles negros y techo con luminarias LED lineales.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-004.jpg",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-005.jpg",
      "/images/catalog/extracted_DE_COCINAS/img-006.jpg",
      "/images/catalog/extracted_DE_COCINAS/img-007.jpg",
      "/images/catalog/extracted_DE_COCINAS/img-008.jpg"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas con Isla",
    "dimensions": "Fabricación a medida",
    "material": "Melamina RH hidrófuga 18mm + Mesón de Cuarzo blanco pulido",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 502,
    "title": "Cocina Monumental con Isla Waterfall en Cuarzo Calacatta",
    "desc": "Isla con caída en cascada (waterfall) en cuarzo Calacatta Gold, torre de hornos empotrada, alacenas de piso a techo y revestimiento en listones de madera natural.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-025.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-015.png"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas con Isla",
    "dimensions": "Diseño arquitectónico a medida",
    "material": "Cuarzo Calacatta 20mm + Melamina Roble Termoencolada 18mm",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 503,
    "title": "Cocina Antracita & Roble con Isla y Vitrinas Iluminadas",
    "desc": "Combinación sofisticada de frentes grafito mate con toques de roble cálido, desayunador para 4 personas y vitrinas con perfiles negros y luz cálida.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-026.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-009.jpg"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas con Isla",
    "dimensions": "A medida según plano",
    "material": "Melamina grafito mate antihuellas + Cuarzo gris ceniza",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 504,
    "title": "Cocina Black Velvet Minimalista con Isla Calacatta",
    "desc": "Diseño minimalista en negro mate antihuellas con isla monolítica de cuarzo blanco, iluminación arquitectónica indirecta superior y repisas flotantes.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-017.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-016.png"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas con Isla",
    "dimensions": "Fabricación a medida",
    "material": "MDF lacado mate poliuretano + Cuarzo blanco veteado",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 505,
    "title": "Cocina Total White con Módulo Desayunador",
    "desc": "Estilo escandinavo contemporáneo en blanco brillante con mesones de cuarzo blanco y barra desayunadora integrada para espacios luminosos y limpios.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-011.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-021.png"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas Lineales",
    "dimensions": "A medida de pared",
    "material": "Melamina Pelikano blanco polar brillo + Mesón de cuarzo blanco",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 506,
    "title": "Cocina Contemporánea en L Gris Humo y Roble Natural",
    "desc": "Distribución en L optimizada con campana extractora oculta, iluminación bajo muebles aéreos y módulos extraíbles esquineros de cierre suave.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-014.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-013.png"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas en L",
    "dimensions": "Configuración en L personalizada",
    "material": "Melamina RH gris perla y madera roble + Granito blanco siena",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 507,
    "title": "Cocina en U con Granito Negro Pulido y Nogal Americano",
    "desc": "Distribución envolvente con triángulo de trabajo eficiente (lavado, cocción, refrigeración), mesones de granito natural negro pulido y muebles superiores en madera nogal.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-019.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-024.png"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas en U",
    "dimensions": "Fabricación a medida arquitectónica",
    "material": "Granito San Gabriel negro + Melamina texturizada nogal",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 508,
    "title": "Cocina Urban Stone con Isla Central y Grifería Negro Mate",
    "desc": "Texturas pétreas y cemento pulido con isla de preparación, lavaplatos bajo mesón negro y alacena vertical con puertas corredizas integradas.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_COCINAS/img-020.png",
    "images": [
      "/images/catalog/extracted_DE_COCINAS/img-010.png"
    ],
    "category": "Cocinas",
    "subcategory": "Cocinas con Isla",
    "dimensions": "A medida según plano",
    "material": "Melamina estilo cemento oxidado + Granito negro cepillado",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 401,
    "title": "Walk-in Closet Boutique con Puertas de Vidrio Bronce y LED",
    "desc": "Vestidor de lujo estilo boutique europea con frentes en cristal bronce templado, iluminación LED perimetral integrada, módulo esquinero y banqueta tapizada.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-017.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-016.png",
      "/images/catalog/extracted_CLOSETS_1/img-018.png"
    ],
    "category": "Closets",
    "subcategory": "Walk-in Closets",
    "dimensions": "Diseño a medida según vano",
    "material": "Melamina RH texturizada + Vidrio templado ahumado bronce",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 402,
    "title": "Vestidor Máster con Tocador Vanity y Espejo Circular Halo LED",
    "desc": "Ambiente completo con tocador de maquillaje integrado, espejo halo con luz neutra regulable, cajoneras para accesorios y pasillo vestidor con espejo de cuerpo entero.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-014.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-015.png"
    ],
    "category": "Closets",
    "subcategory": "Walk-in Closets",
    "dimensions": "Fabricación a medida",
    "material": "Melamina Pelikano duna + Espejo circular con LED perimetral",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 403,
    "title": "Walk-in Closet Antracita con Isla Central de Joyería",
    "desc": "Mobiliario de alta gama en tono carbón con isla central para relojería y accesorios con vidrio superior, torre de zapateras inclinadas y pantaloneros extraíbles.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-019.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-020.png"
    ],
    "category": "Closets",
    "subcategory": "Walk-in Closets",
    "dimensions": "A medida milimétrica",
    "material": "Melamina antracita 18mm con perfilería de aluminio negro",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": true
  },
  {
    "id": 404,
    "title": "Clóset 4 Cuerpos con Puertas Corredizas en Vidrio Satinado",
    "desc": "Sistema corredizo de alta durabilidad con perfiles de aluminio anodizado, vidrio satinado traslúcido y cuerpo interior en roble claro con 4 cajones y zapatera.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-004.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-008.png"
    ],
    "category": "Closets",
    "subcategory": "Armarios Modulares",
    "dimensions": "240 x 240 x 60 cm o a medida",
    "material": "Aluminio anodizado + Vidrio esmerilado + Melamina roble",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 405,
    "title": "Armario Modular Abierto de Pared a Techo con Zapatera",
    "desc": "Distribución abierta tipo concept-store con módulos para colgado largo y corto, zapatera de 6 niveles y cajones interiores con rieles telescópicos pesados.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-005.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-009.png"
    ],
    "category": "Closets",
    "subcategory": "Armarios Modulares",
    "dimensions": "Fabricación a medida",
    "material": "Tableros Novopan 18mm con herrajes telescópicos reforzados",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 406,
    "title": "Clóset de Dormitorio con Módulo para TV y Nichos Abiertos",
    "desc": "Solución multifunción para dormitorio con nicho empotrado para televisión de hasta 55 pulgadas, repisas decorativas laterales y maleteros superiores.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-007.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-006.png"
    ],
    "category": "Closets",
    "subcategory": "Armarios Modulares",
    "dimensions": "A medida según habitación",
    "material": "Melamina roble ceniza y blanco polar 18mm",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 407,
    "title": "Vestidor Escandinavo en Roble Claro con Repisas Curvas",
    "desc": "Espacio cálido y luminoso con distribución en U, terminal con esquineros curvos redondeados, iluminación en barras de colgado y gavetas organizadoras.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-012.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-022.png",
      "/images/catalog/extracted_CLOSETS_1/img-021.png",
      "/images/catalog/extracted_CLOSETS_1/img-023.png"
    ],
    "category": "Closets",
    "subcategory": "Walk-in Closets",
    "dimensions": "A medida",
    "material": "Melamina texturizada roble escandinavo 18mm",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 408,
    "title": "Armario Empotrado Blanco Nieve con Tiradores Perfil Gola",
    "desc": "Estética pura y minimalista en blanco ártico con apertura gola oculta, divisiones interiores personalizadas y maleteros de gran capacidad.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_CLOSETS_1/img-011.png",
    "images": [
      "/images/catalog/extracted_CLOSETS_1/img-013.png"
    ],
    "category": "Closets",
    "subcategory": "Armarios Modulares",
    "dimensions": "220 x 240 x 55 cm o a medida",
    "material": "Melamina 18mm blanco puro con cantos de 2mm",
    "priceUnit": "metro_lineal",
    "inStock": true,
    "featured": false
  },
  {
    "id": 601,
    "title": "Vanity Flotante Doble Pozo con Espejos Circulares LED",
    "desc": "Mueble suspendido para baño principal con mesón de cuarzo negro, lavamanos dobles sobrepuestos, espejos circulares retroiluminados y columna vertical auxiliar.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.jpg"
    ],
    "category": "Muebles de Baño",
    "subcategory": "Vanities Flotantes",
    "dimensions": "160 x 50 x 55 cm o a medida",
    "material": "Tablero marino RH impermeable + Cuarzo negro marquina",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 602,
    "title": "Vanity Luxury en Nicho con Marco Portal en Nogal y Vitrina",
    "desc": "Diseño de hotel 5 estrellas enmarcado en portal de madera nogal, mueble flotante con cajones de textura ranurada y torre lateral de vidrio iluminada.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-011.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-010.jpg"
    ],
    "category": "Muebles de Baño",
    "subcategory": "Vanities Flotantes",
    "dimensions": "140 x 55 x 220 cm (con marco portal)",
    "material": "Melamina RH nogal terracota + Perfiles aluminio y vidrio templado",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 603,
    "title": "Vanity Flotante en Madera Cálida con Lavamanos Tipo Barco",
    "desc": "Mueble suspendido en roble cálido resistente a humedad con lavamanos cerámico ovalado, grifería empotrada y espejo con marco perimetral.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-009.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-008.jpg"
    ],
    "category": "Muebles de Baño",
    "subcategory": "Vanities Flotantes",
    "dimensions": "100 x 48 x 45 cm",
    "material": "Melamina RH roble nórdico con cantos biselados poliuretano",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 604,
    "title": "Mueble de Baño Compacto con Lavabo Negro y Repisas Spa",
    "desc": "Ideal para baños de visitas o medianos, con lavabo cerámico negro mate, nicho toallero abierto inferior y cajón organizador para higiene personal.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.jpg",
    "images": [
      "/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-007.jpg"
    ],
    "category": "Muebles de Baño",
    "subcategory": "Muebles Auxiliares",
    "dimensions": "80 x 45 x 50 cm",
    "material": "Pelikano RH antibacterial resistente al vapor",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 701,
    "title": "Puerta Principal Pivotante Monumental con Fijo de Cristal",
    "desc": "Entrada de alta seguridad con pivote descentrado de rodamiento axial reforzado, manillón de acero inoxidable de 1.80m y fijos laterales de vidrio templado.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-007.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-008.jpg"
    ],
    "category": "Puertas",
    "subcategory": "Puertas Pivotantes",
    "dimensions": "140 x 260 cm (o dimensiones personalizadas)",
    "material": "Estructura interior de acero + Enchape madera teka lacada",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 702,
    "title": "Puerta de Entrada en Madera Maciza con Fijos Dobles",
    "desc": "Diseño contemporáneo con paneles horizontales macizos, acabado en tono natural con barniz poliuretano UV y cerradura digital inteligente.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-009.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-010.jpg"
    ],
    "category": "Puertas",
    "subcategory": "Puertas Pivotantes",
    "dimensions": "160 x 240 cm",
    "material": "Madera seike maciza tratada al horno + Acabado poliuretano UV",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 703,
    "title": "Puerta Corrediza Tipo Granero con 5 Inserciones de Cristal",
    "desc": "Puerta corrediza sobre riel visto de acero negro mate con 5 vidrios esmerilados que permiten el paso de luz natural preservando la privacidad.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-004.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-005.jpg"
    ],
    "category": "Puertas",
    "subcategory": "Puertas de Interior",
    "dimensions": "95 x 215 cm",
    "material": "Bastidor reforzado + Riel industrial en acero forjado negro",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 704,
    "title": "Puerta Corrediza Empotrada con Guía Oculta en Techo",
    "desc": "Solución arquitectónica limpia con sistema de riel oculto en cielo falso, marco a ras de pared y cierre amortiguado en madera natural.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_DE_PUERTAS/img-006.jpg",
    "images": [
      "/images/catalog/extracted_DE_PUERTAS/img-011.jpg"
    ],
    "category": "Puertas",
    "subcategory": "Puertas de Interior",
    "dimensions": "90 x 220 cm",
    "material": "Melamina roble miel con herrajes corredizos invisibles",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 801,
    "title": "Habitación Gaming Integral con Techo Nublado RGB y L-Desk",
    "desc": "Transformación integral de dormitorio con escritorio en L, efectos de iluminación LED inteligente en cielo nublado, paneles acústicos y soporte para múltiples pantallas.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-006.jpg"
    ],
    "category": "Gamer",
    "subcategory": "Setups Completos",
    "dimensions": "Proyecto integral a medida de la habitación",
    "material": "Melamina negra mate antihuellas + Perfilería LED RGB inteligente",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 802,
    "title": "Battlestation Gamer Pro White para Triple Monitor",
    "desc": "Setup blanco minimalista reforzado con vigas de acero ocultas para brazos de monitor pesados, canaletas de cableado 100% ocultas y repisas de exhibición.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-005.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-007.jpg"
    ],
    "category": "Gamer",
    "subcategory": "Escritorios Gaming",
    "dimensions": "200 x 80 x 75 cm",
    "material": "Tablero Pelikano 25mm con refuerzo metálico de carga + Pasacables",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 803,
    "title": "Estación Gaming Cyberpunk con Torre Lateral de Exhibición",
    "desc": "Mueble gamer con torre vertical para gabinete de vidrio templado, nicho para consola PS5/Xbox, repisas para figuras coleccionables y tiras LED sincronizables.",
    "price": 0,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_GAMER_2/img-009.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_GAMER_2/img-008.jpg"
    ],
    "category": "Gamer",
    "subcategory": "Setups Completos",
    "dimensions": "180 x 160 x 60 cm",
    "material": "MDF texturizado carbón + Rieles LED difusores de neón",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 301,
    "title": "Escritorio Gerencial en L con Faldón Ranurado Elegance",
    "desc": "Estación ejecutiva en cerezo y grafito con faldón frontal ranurado, cajonera pedestal móvil de 3 gavetas con llave y ala de retorno para reuniones.",
    "price": 450,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-006.jpg"
    ],
    "category": "Muebles de Oficina",
    "subcategory": "Escritorios Gerenciales",
    "dimensions": "180 x 180 x 75 cm",
    "material": "Melamina cerezo 25mm con faldón negro mate ranurado",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 302,
    "title": "Escritorio Operativo con Base Metálica Geométrica",
    "desc": "Mesa directiva con patas de acero electropintado en diseño en X, tablero de 25mm con pasacables de aluminio y credenza lateral.",
    "price": 320,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-005.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-007.jpg"
    ],
    "category": "Muebles de Oficina",
    "subcategory": "Escritorios Gerenciales",
    "dimensions": "160 x 140 x 75 cm",
    "material": "Tablero Pelikano roble + Acero tubular electropintado negro",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 303,
    "title": "Counter de Recepción Corporativo con Panel Frontal y Retorno",
    "desc": "Mostrador de atención al público con frontal decorativo para logotipo institucional y zona interior de trabajo con cajonera archivadora y pasacables.",
    "price": 380,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-077.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-076.jpg"
    ],
    "category": "Muebles de Oficina",
    "subcategory": "Counters y Recepción",
    "dimensions": "180 x 110 x 60 cm",
    "material": "Melamina 18mm roble y blanco con doble nivel de atención",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 304,
    "title": "Escritorio Ejecutivo Panorámico con Superficie de Cristal y Metal",
    "desc": "Estación directiva de diseño contemporáneo con estructura metálica blanca de alta resistencia, faldón perforado y credenza de apoyo con llave.",
    "price": 420,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-053.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-058.jpg"
    ],
    "category": "Muebles de Oficina",
    "subcategory": "Escritorios Gerenciales",
    "dimensions": "180 x 160 x 75 cm",
    "material": "Perfilería de acero blanco + Tablero templado y melamina",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 305,
    "title": "Mesa de Directorio Ejecutiva para 14 Personas con Conectividad",
    "desc": "Mesa de conferencias de gran envergadura con cajas integradas pasacables para conexiones HDMI/red y bases robustas con canalización interior de cables.",
    "price": 680,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-089.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-088.jpg"
    ],
    "category": "Muebles de Oficina",
    "subcategory": "Salas de Reunión",
    "dimensions": "360 x 120 x 75 cm",
    "material": "Tablero reforzado 36mm con cajas pasacables de aluminio",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 306,
    "title": "Mesa de Reuniones para 8 Personas con Patas en A",
    "desc": "Mesa de sala de juntas con estructura en caballete metálico y tablero amaderado de 36mm con bordes antichoque.",
    "price": 390,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-092.jpg",
    "images": [
      "/images/catalog/extracted_MUEBLES_OFICINA/img-091.jpg"
    ],
    "category": "Muebles de Oficina",
    "subcategory": "Salas de Reunión",
    "dimensions": "220 x 100 x 75 cm",
    "material": "Estructura metálica en A + Tablero amaderado 36mm",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 307,
    "title": "Credenza Archivadora Ejecutiva con Cerradura Central",
    "desc": "Mueble bajo para archivo y almacenamiento de documentos con puertas batientes con cerradura, gavetas para carpetas colgantes y repisas interiores.",
    "price": 160,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_MUEBLES_OFICINA/img-014.jpg",
    "images": [],
    "category": "Muebles de Oficina",
    "subcategory": "Archivadores y Credenzas",
    "dimensions": "120 x 75 x 45 cm",
    "material": "Melamina 18mm con cerradura de seguridad frontal",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 201,
    "title": "Escritorio Juvenil con Librero DLM-0100",
    "desc": "Escritorio con estantería vertical integrada, repisas organizadoras y cajonera doble. Ideal para estudio y teletrabajo en espacios optimizados.",
    "price": 165,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png",
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png"
    ],
    "category": "Escritorios",
    "subcategory": "Línea Estudiantil",
    "dimensions": "140 x 170 x 55 cm",
    "material": "Melamina Pelikano 18mm RH blanco y amaderado",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 202,
    "title": "Escritorio Compacto con Gavetero EDL-0200",
    "desc": "Diseño moderno con cajonera archivadora profunda y espacio para CPU o mochila escolar. Tablero resistente a ralladuras.",
    "price": 160,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png"
    ],
    "category": "Escritorios",
    "subcategory": "Línea Estudiantil",
    "dimensions": "140 x 55 cm",
    "material": "Melamina Wengué 18mm con herrajes niquelados",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  },
  {
    "id": 203,
    "title": "Escritorio Minimalista de Estudio DLM-0300",
    "desc": "Escritorio funcional con nicho abierto y cajón lateral discreto. Perfecto para laptop y tareas de estudiantes.",
    "price": 145,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.png"
    ],
    "category": "Escritorios",
    "subcategory": "Línea Estudiantil",
    "dimensions": "140 x 55 cm",
    "material": "Melamina Rovere con cantos PVC 2mm",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 204,
    "title": "Escritorio con Repisa Superior DLF-1000",
    "desc": "Estructura vertical con torre de repisas laterales para libros y útiles. Optimiza el espacio de dormitorios juveniles.",
    "price": 165,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png"
    ],
    "category": "Escritorios",
    "subcategory": "Línea Estudiantil",
    "dimensions": "140 x 120 x 55 cm",
    "material": "Melamina texturizada roble claro",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 205,
    "title": "Escritorio Escolar con Módulo de Archivo ELM-400",
    "desc": "Escritorio robusto con gaveta superior y puerta inferior con bisagras de cierre suave para almacenamiento seguro.",
    "price": 160,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-004.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-005.png"
    ],
    "category": "Escritorios",
    "subcategory": "Línea Estudiantil",
    "dimensions": "120 x 50 cm",
    "material": "Melamina haya con tapacantos termofusionados",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 206,
    "title": "Escritorio Ergonómico Infantil CRECE-01",
    "desc": "Diseño anatómico con bandeja retráctil y cajón portalápices. Favorece la correcta postura durante horas de estudio.",
    "price": 175,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-005.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-004.png"
    ],
    "category": "Escritorios",
    "subcategory": "Línea Estudiantil",
    "dimensions": "110 x 55 cm",
    "material": "Melamina antibacterial resistente al derrame de líquidos",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": false
  },
  {
    "id": 207,
    "title": "Estación de Estudio Doble DUO-STUDY",
    "desc": "Mueble para dos personas con divisor central organizador y cajoneras independientes. Solución ideal para hermanos.",
    "price": 260,
    "discountPrice": null,
    "imgUrl": "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-012.png",
    "images": [
      "/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-009.png"
    ],
    "category": "Escritorios",
    "subcategory": "Línea Estudiantil",
    "dimensions": "200 x 55 cm",
    "material": "Melamina 18mm con doble estructura reforzada",
    "priceUnit": "unidad",
    "inStock": true,
    "featured": true
  }
];

export function getProductsByCategory(categoryName: string): Product[] {
  return ALL_CATALOG_PRODUCTS.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
}
