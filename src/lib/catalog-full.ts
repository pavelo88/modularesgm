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
    h1: 'Escritorios Modulares y Ergonómicos en Quito',
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
    h1: 'Closets a Medida y Walk-in Closets Modernos',
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
    h1: 'Habitaciones Gamer y Setups Personalizados',
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
  // --- ESCRITORIOS ESTUDIANTILES ---
  {
    id: 201,
    title: 'Escritorio Juvenil con Librero DLM-0100',
    desc: 'Escritorio con estantería vertical integrada, repisas organizadoras y cajonera doble. Ideal para estudio y teletrabajo en espacios optimizados.',
    price: 165,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png',
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 170 x 55 cm',
    material: 'Melamina Pelikano 18mm RH blanco y amaderado',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 202,
    title: 'Escritorio Compacto con Gavetero EDL-0200',
    desc: 'Diseño moderno con cajonera archivadora profunda y espacio para CPU o mochila escolar. Tablero resistente a ralladuras.',
    price: 160,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 55 cm',
    material: 'Melamina Wengué 18mm con herrajes niquelados',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 203,
    title: 'Escritorio Minimalista de Estudio DLM-0300',
    desc: 'Escritorio funcional con nicho abierto y cajón lateral discreto. Perfecto para laptop y tareas de estudiantes.',
    price: 145,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 55 cm',
    material: 'Melamina Rovere con cantos PVC 2mm',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 204,
    title: 'Escritorio con Repisa Superior DLF-1000',
    desc: 'Estructura vertical con torre de repisas laterales para libros y útiles. Optimiza el espacio de dormitorios juveniles.',
    price: 165,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 120 x 55 cm',
    material: 'Melamina texturizada roble claro',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 205,
    title: 'Escritorio Escolar con Módulo de Archivo ELM-400',
    desc: 'Escritorio robusto con gaveta superior y puerta inferior con bisagras de cierre suave para almacenamiento seguro.',
    price: 160,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-004.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-005.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 55 cm',
    material: 'Melamina 18mm tono blanco ártico y roble',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 206,
    title: 'Escritorio Escuadra en L con Mueble Lateral ECL-500',
    desc: 'Escritorio esquinero moderno con patas metálicas en acabado electrostático blanco y módulo de tres cajones organizadores.',
    price: 220,
    discountPrice: 199,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-005.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-004.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea en L',
    dimensions: '140 x 140 cm',
    material: 'Estructura metálica + Melamina haya natural 18mm',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 207,
    title: 'Escritorio Modular Escuadra ELC-600',
    desc: 'Configuración en ángulo con estantería abierta para fácil acceso a carpetas, libros e impresora.',
    price: 220,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-007.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-008.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea en L',
    dimensions: '140 x 140 cm',
    material: 'Melamina gris claro y roble rústico',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 208,
    title: 'Escritorio Escuadra con Librero ELO-700',
    desc: 'Mueble integral en L con librero lateral de 6 casilleros. Ideal para estudiantes universitarios y creadores.',
    price: 180,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-008.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-007.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea en L',
    dimensions: '140 x 140 cm',
    material: 'Melamina 18mm roble miel',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 209,
    title: 'Escritorio Ejecutivo Escuadra EL1100',
    desc: 'Diseño angular contemporáneo con amplio espacio para dos monitores, laptop y área de escritura sin estorbos.',
    price: 220,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-009.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-012.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea Ejecutiva',
    dimensions: '140 x 140 cm',
    material: 'Melamina nogal cenizo con detalles en blanco',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },

  // --- MUEBLES DE OFICINA ---
  {
    id: 301,
    title: 'Escritorio Gerencial en L con Faldón Ranurado (Mod. 001)',
    desc: 'Estación ejecutiva con faldón frontal de privacidad, cajonera pedestal y módulo de retorno espacioso.',
    price: 450,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-002.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-003.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Escritorios Gerenciales',
    dimensions: '180 x 180 cm',
    material: 'Melamina cerezo 25mm con faldón negro mate',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 302,
    title: 'Escritorio Operativo con Base Metálica Geométrica (Mod. 002)',
    desc: 'Diseño arquitectónico con patas en acero negro mate cruzado y faldón perforado para circulación de aire.',
    price: 220,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-003.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-002.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Escritorios Gerenciales',
    dimensions: '140 x 140 cm',
    material: 'Tablero Pelikano roble + Acero tubular negro',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 303,
    title: 'Estación de Trabajo con Credenza Baja (Mod. 004)',
    desc: 'Conjunto corporativo que incluye mesa recta amplia y credenza de almacenamiento lateral con puertas y huecos para CPU.',
    price: 350,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-005.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Estaciones de Trabajo',
    dimensions: '150 x 120 cm',
    material: 'Melamina 18mm duna con estructura antracita',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 304,
    title: 'Escritorio Ejecutivo Presidencial (Mod. 013)',
    desc: 'Escritorio de alta dirección en acabado negro ébano con faldón curvo e inserciones de cristal templado.',
    price: 450,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-005.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-006.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Escritorios Gerenciales',
    dimensions: '180 x 180 cm',
    material: 'Melamina 25mm negro absoluto',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 305,
    title: 'Counter de Recepción Minimalista Bicolor (Counter 1)',
    desc: 'Mostrador de bienvenida con faldón frontal texturizado, repisa superior para atención al público y pasacables.',
    price: 240,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-006.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-007.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Counters y Recepción',
    dimensions: '150 x 100 x 55 cm',
    material: 'Melamina 18mm con iluminación LED opcional',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 306,
    title: 'Counter de Atención con Geometría Angular (Counter 2)',
    desc: 'Recepción corporativa con diseño diagonal en negro mate y madera natural. Impresiona a clientes desde la entrada.',
    price: 240,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-007.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-006.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Counters y Recepción',
    dimensions: '150 x 100 x 55 cm',
    material: 'Melamina Roble + Acabado grafito',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 307,
    title: 'Counter de Lujo con Retroiluminación LED (Counter 6)',
    desc: 'Mostrador blanco puro con panel flotante de madera oscura y luz perimetral fría para empresas modernas.',
    price: 320,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-009.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-010.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Counters y Recepción',
    dimensions: '150 x 100 x 55 cm',
    material: 'MDF lacado brillante + Panel texturizado',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 308,
    title: 'Mesa de Reuniones Redonda para 6-8 Personas',
    desc: 'Mesa de conferencia circular con base metálica radial. Fomenta la colaboración horizontal en salas ejecutivas.',
    price: 180,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-010.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-012.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Salas de Reunión',
    dimensions: '90 cm de diámetro',
    material: 'Tablero melamina amaderada + Base de varillas de acero',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 309,
    title: 'Mesa de Directorio Modular para 12-14 Personas',
    desc: 'Mesa de reuniones de gran formato con cajas de conectividad empotradas para HDMI, USB y tomas de corriente.',
    price: 480,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-012.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-013.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Salas de Reunión',
    dimensions: '290 x 100 x 75 cm',
    material: 'Estructura metálica soldada + Tablero reforzado 36mm',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 310,
    title: 'Credenza Ejecutiva de 2 Puertas con Llave (Credensa 1)',
    desc: 'Mueble bajo auxiliar para oficina con cerradura de seguridad central, jaladeras ergonómicas y baldas regulables.',
    price: 145,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-013.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_OFICINA/img-014.jpg'
    ],
    category: 'Muebles de Oficina',
    subcategory: 'Archivadores y Credenzas',
    dimensions: '90 x 80 x 40 cm',
    material: 'Melamina 18mm con cerradura metálica de tambor',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },

  // --- CLOSETS (A MEDIDA) ---
  {
    id: 401,
    title: 'Walk-in Closet Máster con Puertas de Vidrio y LED',
    desc: 'Armario vestidor de lujo con perfilería en aluminio negro, iluminación LED oculta por nivel y colgadores dobles cromados.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-000.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-001.png',
      '/images/catalog/extracted_CLOSETS_1/img-004.png'
    ],
    category: 'Closets',
    subcategory: 'Walk-in Closets',
    dimensions: 'Diseño a medida según vano',
    material: 'Melamina RH texturizada + Vidrio templado ahumado',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 402,
    title: 'Clóset Modular de Pared a Techo 4 Cuerpos',
    desc: 'Distribución completa con zapateras extensibles, maletero superior de gran capacidad y gavetero interno de 4 cajones.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-001.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-000.png',
      '/images/catalog/extracted_CLOSETS_1/img-005.png'
    ],
    category: 'Closets',
    subcategory: 'Armarios Modulares',
    dimensions: 'A medida milimétrica',
    material: 'Tableros Novopan 18mm con herrajes Blum',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 403,
    title: 'Vestidor Walk-in en U con Isla Central',
    desc: 'Ambiente de vestidor completo con isla para joyería y relojería con cristal transparente superior y banquetas tapizadas.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-004.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-005.png'
    ],
    category: 'Closets',
    subcategory: 'Walk-in Closets',
    dimensions: 'A medida',
    material: 'Melamina roble ceniza con iluminación perimetral',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },
  {
    id: 404,
    title: 'Clóset Esquinero con Puertas Corredizas Espejadas',
    desc: 'Optimización de esquinas difíciles con sistema corredizo silencioso sobre rieles de aluminio de alto tráfico.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-005.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-006.png'
    ],
    category: 'Closets',
    subcategory: 'Armarios Modulares',
    dimensions: 'A medida',
    material: 'Espejo belga de 4mm con lámina de seguridad + Melamina RH',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },

  // --- COCINAS (A MEDIDA) ---
  {
    id: 501,
    title: 'Cocina Integral de Lujo con Isla y Mesón de Cuarzo Calacatta',
    desc: 'Muebles altos y bajos con apertura gola sin jaladeras, despensas extraíbles y mesón de cuarzo blanco con vetas grises.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-000.png',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-001.png',
      '/images/catalog/extracted_DE_COCINAS/img-002.jpg'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas con Isla',
    dimensions: 'Fabricación a medida',
    material: 'Melamina RH hidrófuga 18mm + Cuarzo Calacatta pulido',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 502,
    title: 'Cocina Lineal con Acabados Termolaminados y Perfilería Negra',
    desc: 'Diseño europeo contemporáneo con campana extractora oculta, zócalos de aluminio y cajones de extracción total con cierre suave.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-001.png',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-000.png',
      '/images/catalog/extracted_DE_COCINAS/img-003.jpg'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas Lineales',
    dimensions: 'Fabricación a medida',
    material: 'MDF hidrófugo termolaminado mate antracita',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 503,
    title: 'Cocina en L con Desayunador Integrado y Granito San Gabriel',
    desc: 'Distribución ergonómica en triángulo de trabajo (refrigeración, lavado y cocción) con barra desayunadora para 4 personas.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-002.jpg',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-003.jpg'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas en L',
    dimensions: 'A medida según plano de arquitectura',
    material: 'Granito natural negro San Gabriel + Melamina amaderada',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },

  // --- MUEBLES DE BAÑO (A MEDIDA) ---
  {
    id: 601,
    title: 'Vanity Flotante de Doble Pozo con Espejo Circular LED',
    desc: 'Mueble suspendido para baño principal con mesón de cuarzo negro, doble lavabo de sobreponer y cajones ranurados antivapor.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-002.jpg',
    images: [
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-003.jpg',
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.jpg'
    ],
    category: 'Muebles de Baño',
    subcategory: 'Vanities Flotantes',
    dimensions: '160 x 50 x 55 cm o a medida',
    material: 'Tablero marino RH impermeable + Cuarzo negro marquina',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 602,
    title: 'Mueble de Baño Suspendido en Madera Natural y Lavabo Cerámico',
    desc: 'Diseño nórdico minimalista con repisas abiertas para toallas y espejo rectangular con marco iluminado cálido.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-003.jpg',
    images: [
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-002.jpg'
    ],
    category: 'Muebles de Baño',
    subcategory: 'Vanities Flotantes',
    dimensions: '100 x 48 x 45 cm',
    material: 'Melamina RH roble nórdico con cantos biselados',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 603,
    title: 'Vanity de Baño de Visitas con Columna Auxiliar Vertical',
    desc: 'Conjunto completo con mueble bajo lavabo y torre vertical para productos de aseo personal en espacios reducidos.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.jpg',
    images: [
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.jpg'
    ],
    category: 'Muebles de Baño',
    subcategory: 'Muebles Auxiliares',
    dimensions: '80 x 45 cm + Columna 35 x 160 cm',
    material: 'Pelikano RH antibacterial',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },

  // --- PUERTAS (A MEDIDA) ---
  {
    id: 701,
    title: 'Puerta Principal Pivotante de Gran Formato con Fijo de Vidrio',
    desc: 'Puerta de entrada monumental de 2.60m con eje pivotante de rodamiento axial, cerradura de seguridad multipunto y manillón negro de 1.80m.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-002.jpg',
    images: [
      '/images/catalog/extracted_DE_PUERTAS/img-003.jpg',
      '/images/catalog/extracted_DE_PUERTAS/img-004.jpg'
    ],
    category: 'Puertas',
    subcategory: 'Puertas Pivotantes',
    dimensions: '140 x 260 cm (o dimensiones personalizadas)',
    material: 'Estructura interior de acero + Enchape madera teka lacada',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 702,
    title: 'Puerta Pivotante de Fachada con Listones Ranurados en Relieve',
    desc: 'Diseño arquitectónico con acanalado vertical continuo que se mimetiza con la pared de fachada.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-003.jpg',
    images: [
      '/images/catalog/extracted_DE_PUERTAS/img-002.jpg'
    ],
    category: 'Puertas',
    subcategory: 'Puertas Pivotantes',
    dimensions: '130 x 240 cm',
    material: 'MDF hidrófugo lacado poliuretano exterior resistente a UV',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 703,
    title: 'Puerta de Paso Interior Lacada con Líneas Pantografiadas',
    desc: 'Puerta contemporánea de dormitorio o baño con cerradura magnética italiana y marco envolvente sin tornillos visibles.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-004.jpg',
    images: [
      '/images/catalog/extracted_DE_PUERTAS/img-005.jpg'
    ],
    category: 'Puertas',
    subcategory: 'Puertas de Interior',
    dimensions: '85 x 210 cm',
    material: 'Bastidor de pino macizo + MDF 9mm lacado satinado',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },

  // --- GAMER (A MEDIDA) ---
  {
    id: 801,
    title: 'Habitación Gamer Modular con Iluminación LED y Paneles 3D',
    desc: 'Diseño integral de setup gaming: escritorio esquinero reforzado para 3 monitores, estanterías retroiluminadas y panel acanalado.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-002.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-003.jpg',
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg'
    ],
    category: 'Gamer',
    subcategory: 'Setups Completos',
    dimensions: 'Proyecto integral a medida de la habitación',
    material: 'Melamina negra mate antihuellas + Perfilería LED RGB',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 802,
    title: 'Escritorio Gamer Pro con Bandeja Pasacables y Repisa Doble',
    desc: 'Escritorio con canaletas internas para gestión de cables 100% oculta, soporte para brazos articulados y repisas para figuras y consola.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-003.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-002.jpg'
    ],
    category: 'Gamer',
    subcategory: 'Escritorios Gaming',
    dimensions: '180 x 80 x 75 cm',
    material: 'Tablero Pelikano 25mm con refuerzo metálico de carga',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 803,
    title: 'Setup Gamer Cyberpunk con Cielo Nublado LED y Módulo TV',
    desc: 'Transformación total de dormitorio con efecto nube luminosa en techo, centro de entretenimiento para PS5/Xbox y mueble escritorio.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-005.jpg'
    ],
    category: 'Gamer',
    subcategory: 'Setups Completos',
    dimensions: 'A medida',
    material: 'MDF lacado + Tiras LED inteligentes WiFi',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  }
];

export function getProductsByCategory(categoryName: string): Product[] {
  return ALL_CATALOG_PRODUCTS.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
}
