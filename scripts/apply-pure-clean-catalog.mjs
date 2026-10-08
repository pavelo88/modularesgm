import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.error('ERROR: Falta FIREBASE_SERVICE_ACCOUNT_JSON en .env.local');
  process.exit(1);
}

const db = getFirestore(initializeApp({ credential: cert(JSON.parse(raw)) }));

// Construimos los productos 100% curados con imágenes limpias (cero portadas, cero contraportadas)
const products = [
  // --- COCINAS (PROYECTOS REALES CON MÚLTIPLES ÁNGULOS) ---
  {
    id: 501,
    title: 'Cocina Modena Roble con Isla Noir & Vitrina LED',
    desc: 'Cocina integral de alta gama con muebles en roble cappuccino, isla central en granito negro con listones de madera y vitrina iluminada.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-004.jpg',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-005.jpg',
      '/images/catalog/extracted_DE_COCINAS/img-006.jpg',
      '/images/catalog/extracted_DE_COCINAS/img-007.jpg',
      '/images/catalog/extracted_DE_COCINAS/img-008.jpg'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas con Isla',
    dimensions: 'Proyecto a medida',
    material: 'Melamina RH 18mm Pelikano + Granito Negro San Gabriel',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 502,
    title: 'Cocina Lineal Grafito con Listonado y Frentes Moka',
    desc: 'Diseño arquitectónico con campana empotrada, panel acanalado decorativo superior y cajoneras anchas con guías invisibles.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-009.jpg',
    images: [],
    category: 'Cocinas',
    subcategory: 'Cocinas Lineales',
    dimensions: 'Diseño a medida',
    material: 'MDF hidrófugo grafito mate + Listonado madera natural',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 503,
    title: 'Cocina con Isla Central en Nogal & Encimera de Granito',
    desc: 'Isla de gran formato para preparación y socialización con gaveteros profundos y torre de refrigeración empotrada.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-010.png',
    images: [],
    category: 'Cocinas',
    subcategory: 'Cocinas con Isla',
    dimensions: 'Fabricación a medida',
    material: 'Melamina Nogal Terracota + Granito pulido',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },
  {
    id: 504,
    title: 'Cocina Blanco Alabastro & Mármol Calacatta con Isla',
    desc: 'Luminosa y minimalista con frentes en blanco brillante sin tiradores (perfil gola), salpicadero continuo y barra desayunadora.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-011.png',
    images: [],
    category: 'Cocinas',
    subcategory: 'Cocinas con Isla',
    dimensions: 'A medida',
    material: 'Cuarzo blanco Calacatta + MDF lacado brillo',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 505,
    title: 'Cocina en L con Desayunador y Techo LED Integrado',
    desc: 'Configuración angular con iluminación indirecta cálida bajo muebles altos y desayunador volado para 4 puestos.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-012.png',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-013.png'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas en L',
    dimensions: 'A medida',
    material: 'Melamina Roble Miel RH + Cuarzo gris ceniza',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },
  {
    id: 506,
    title: 'Cocina Nórdica Gris Perla & Isla con Mármol Exótico',
    desc: 'Isla protagonista revestida en cuarcita veteada y muebles perimetrales gris suave con repisa abierta decorativa.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-014.png',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-015.png'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas con Isla',
    dimensions: 'A medida',
    material: 'Piedra sinterizada + Melamina gris seda',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 507,
    title: 'Cocina Monocromática Antracita & Lámparas Colgantes Brass',
    desc: 'Concepto oscuro sofisticado con isla central en cuarzo blanco puro que genera un contraste visual de revista de arquitectura.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-016.png',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-017.png'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas con Isla',
    dimensions: 'A medida',
    material: 'Frentes antihuellas negro mate + Cuarzo blanco puro',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },
  {
    id: 508,
    title: 'Cocina Contemporánea en L con Pared de Piedra & Cuarzo Negro',
    desc: 'Combinación de muebles en madera texturizada, encimera de granito negro absoluto y pared rústica de piedra natural.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_COCINAS/img-018.png',
    images: [
      '/images/catalog/extracted_DE_COCINAS/img-019.png'
    ],
    category: 'Cocinas',
    subcategory: 'Cocinas en L',
    dimensions: 'A medida',
    material: 'Granito Negro Absoluto + Melamina Wengué',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },

  // --- CLOSETS (A MEDIDA CON PERSPECTIVAS REALES) ---
  {
    id: 401,
    title: 'Clóset de Dormitorio con Puertas Corredizas Espejadas',
    desc: 'Sistema de puertas corredizas en vidrio satinado y perfiles de aluminio negro mate. Interior compartimentado con cajones y percheros.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-004.png',
    images: [],
    category: 'Closets',
    subcategory: 'Armarios Modulares',
    dimensions: 'Fabricación a medida',
    material: 'Melamina Roble Ceniza + Vidrio satinado templado',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 402,
    title: 'Clóset Modular de 4 Cuerpos con Zapatera Extensible',
    desc: 'Distribución interior con torre central de zapateras telescópicas, maletero superior y cajoneras con cierre suave.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-005.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-006.png'
    ],
    category: 'Closets',
    subcategory: 'Armarios Modulares',
    dimensions: 'A medida',
    material: 'Tableros Novopan RH 18mm con herrajes Blum',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 403,
    title: 'Armario Empotrado de Pared a Techo con Módulo TV',
    desc: 'Mueble integral con nicho central para televisión, gavetas inferiores y armarios laterales para ropa larga.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-007.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-008.png'
    ],
    category: 'Closets',
    subcategory: 'Armarios Modulares',
    dimensions: 'A medida',
    material: 'Melamina 18mm tono nogal con tiradores de perfil continuo',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },
  {
    id: 404,
    title: 'Walk-in Closet Boutique con Isla de Accesorios',
    desc: 'Vestidor abierto perimetral en tono madera natural con iluminación LED empotrada en cada estante y banqueta central.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-010.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-011.png'
    ],
    category: 'Closets',
    subcategory: 'Walk-in Closets',
    dimensions: 'A medida',
    material: 'Melamina Rovere 18mm con tiras LED cálidas 3000K',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 405,
    title: 'Vestidor Walk-in Minimalista con Tocador Vanity & Espejo Circular',
    desc: 'Ambiente vestidor con tocador central, espejo circular retroiluminado y estanterías abiertas simétricas para ropa y zapatos.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-012.png',
    images: [],
    category: 'Closets',
    subcategory: 'Walk-in Closets',
    dimensions: 'A medida',
    material: 'Melamina Blanco Lino con espejo LED touch',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 406,
    title: 'Walk-in Closet Pasillo con Espejo Portal Retroiluminado',
    desc: 'Optimización de pasillo vestidor con espejo de piso a techo rodeado de luz perimetral y armarios simétricos en madera.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-013.png',
    images: [],
    category: 'Closets',
    subcategory: 'Walk-in Closets',
    dimensions: 'A medida',
    material: 'Melamina Roble Europeo con perfiles LED embutidos',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },
  {
    id: 407,
    title: 'Vestidor Master Suite de Lujo con Vitrinas de Cristal Bronce',
    desc: 'El pináculo del diseño residencial: módulos con puertas de vidrio templado bronce reflectante y barras iluminadas.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-014.png',
    images: [
      '/images/catalog/extracted_CLOSETS_1/img-015.png'
    ],
    category: 'Closets',
    subcategory: 'Walk-in Closets',
    dimensions: 'A medida',
    material: 'Vidrio templado bronce + Perfiles aluminio anodizado negro',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: true
  },
  {
    id: 408,
    title: 'Walk-in Closet de Esquina con Puertas de Vidrio Ahumado',
    desc: 'Solución en L con vitrinas transparentes iluminadas para trajes y vestidos de gala, manteniendo la ropa libre de polvo.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_CLOSETS_1/img-016.png',
    images: [],
    category: 'Closets',
    subcategory: 'Walk-in Closets',
    dimensions: 'A medida',
    material: 'Perfilería europea con bisagras ocultas de cierre lento',
    priceUnit: 'metro_lineal',
    inStock: true,
    featured: false
  },

  // --- MUEBLES DE BAÑO (FOTOS REALES DE VANITIES) ---
  {
    id: 601,
    title: 'Vanity Suspendido en Madera Esculpida con Espejo Circular',
    desc: 'Mueble flotante de autor con lavabo rectangular negro mate, espacio inferior para toallas y espejo circular decorativo.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-004.jpg',
    images: [
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.jpg'
    ],
    category: 'Muebles de Baño',
    subcategory: 'Vanities Flotantes',
    dimensions: '90 x 50 x 45 cm',
    material: 'Tablero marino hidrófugo en tono nogal natural',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 602,
    title: 'Vanity Doble Pozo en Madera & Cuarzo con Espejo Halo LED',
    desc: 'Mueble suspendido para baño principal con doble grifería negra, cuatro gavetas de apertura suave y espejo circular con luz indirecta.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-005.jpg',
    images: [
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg'
    ],
    category: 'Muebles de Baño',
    subcategory: 'Vanities Flotantes',
    dimensions: '140 x 50 x 50 cm',
    material: 'Melamina RH roble nórdico con mesón de cuarzo blanco',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 603,
    title: 'Vanity Moderno con Repisa Lateral & Espejo Cuadrado con Nichos',
    desc: 'Mueble bajo lavabo con torre vertical de estantes para perfumes y toallas en madera cálida.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-006.jpg',
    images: [
      '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-007.jpg'
    ],
    category: 'Muebles de Baño',
    subcategory: 'Vanities Flotantes',
    dimensions: '100 x 48 cm',
    material: 'Melamina hidrófuga RH antibacterial',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 604,
    title: 'Vanity Flotante con Torre de Armario Vertical Integrada',
    desc: 'Conjunto completo con lavabo cerámico ovalado sobre encimera y armario alto con estantes ocultos y espejo con iluminación envolvente.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_MUEBLES_DE_BANOS/img-008.jpg',
    images: [],
    category: 'Muebles de Baño',
    subcategory: 'Muebles Auxiliares',
    dimensions: '120 x 50 cm + Columna 35 x 180 cm',
    material: 'Tableros RH resistentes al vapor y salpicaduras',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },

  // --- ESCRITORIOS ESTUDIANTILES (CON PRECIOS Y MEDIDAS OFICIALES) ---
  {
    id: 201,
    title: 'Escritorio Juvenil con Librero DLM-0100',
    desc: 'Escritorio con estantería vertical integrada, repisas organizadoras y cajonera doble. Ideal para estudio en espacios optimizados.',
    price: 165,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-000.png',
    images: [
      '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png'
    ],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 170 cm',
    material: 'Melamina Pelikano 18mm RH blanco y amaderado',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 202,
    title: 'Escritorio Compacto con Gavetero Profundo EDL-0200',
    desc: 'Diseño funcional con cajón superior y gavetero archivador inferior. Tablero de 18mm resistente a rayones.',
    price: 160,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-001.png',
    images: [],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 55 cm',
    material: 'Melamina 18mm tono wengué oscuro',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 203,
    title: 'Escritorio con Nicho y Cajón Discreto DLM-0300',
    desc: 'Escritorio compacto para laptop y tareas con hueco abierto y gaveta lateral.',
    price: 145,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-002.png',
    images: [],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 55 cm',
    material: 'Melamina Rovere con cantos termoencolados',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 204,
    title: 'Escritorio con Repisa Superior Lateral DLF-1000',
    desc: 'Estructura vertical con torre de 3 repisas para libros, útiles y plantas decorativas.',
    price: 165,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-003.png',
    images: [],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 120 cm',
    material: 'Melamina texturizada roble natural',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 205,
    title: 'Escritorio con Gaveta y Puerta de Archivo ELM-400',
    desc: 'Módulo de estudio con gaveta superior y puerta con bisagras de cierre suave para almacenamiento escolar.',
    price: 160,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-004.png',
    images: [],
    category: 'Escritorios',
    subcategory: 'Línea Estudiantil',
    dimensions: '140 x 55 cm',
    material: 'Melamina bicolor roble y blanco ártico',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 206,
    title: 'Escritorio Escuadra en L con Patas Metálicas ECL-500',
    desc: 'Escritorio angular con base en tubo de acero blanco electrostático y cajonera de tres gavetas.',
    price: 220,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-005.png',
    images: [],
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
    title: 'Escritorio Escuadra con Repisas Abiertas ELC-600',
    desc: 'Escritorio en ángulo con estantería baja abierta para impresora y carpetas de archivo.',
    price: 220,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_ESCRITORIOS_ESTUDIANTILES_1/img-008.png',
    images: [],
    category: 'Escritorios',
    subcategory: 'Línea en L',
    dimensions: '140 x 140 cm',
    material: 'Melamina roble rústico y gris',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },

  // --- MUEBLES DE OFICINA ---
  {
    id: 301,
    title: 'Escritorio Gerencial en L con Faldón Ranurado (Mod. 001)',
    desc: 'Estación ejecutiva con faldón frontal de privacidad, cajonera pedestal y retorno espacioso.',
    price: 450,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-004.jpg',
    images: [],
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
    desc: 'Diseño arquitectónico con patas en acero negro mate cruzado y faldón perforado para cables.',
    price: 220,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-005.jpg',
    images: [],
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
    title: 'Counter de Recepción Minimalista Bicolor (Counter 1)',
    desc: 'Mostrador de bienvenida con faldón frontal texturizado y repisa superior para atención al público.',
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
    id: 304,
    title: 'Mesa de Reuniones Redonda para 6-8 Personas',
    desc: 'Mesa de conferencia circular con base metálica radial. Fomenta la colaboración en salas ejecutivas.',
    price: 180,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-010.jpg',
    images: [],
    category: 'Muebles de Oficina',
    subcategory: 'Salas de Reunión',
    dimensions: '90 cm de diámetro',
    material: 'Tablero melamina amaderada + Base de varillas de acero',
    priceUnit: 'unidad',
    inStock: true,
    featured: false
  },
  {
    id: 305,
    title: 'Mesa de Directorio Modular para 12-14 Personas',
    desc: 'Mesa de reuniones de gran formato con cajas de conectividad empotradas para HDMI, USB y tomas de corriente.',
    price: 480,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_OFICINA/img-012.jpg',
    images: [],
    category: 'Muebles de Oficina',
    subcategory: 'Salas de Reunión',
    dimensions: '290 x 100 x 75 cm',
    material: 'Estructura metálica soldada + Tablero reforzado 36mm',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },

  // --- PUERTAS (A MEDIDA) ---
  {
    id: 701,
    title: 'Puerta Principal Pivotante de Gran Formato con Fijo de Vidrio',
    desc: 'Puerta de entrada monumental de 2.60m con eje pivotante de rodamiento axial, cerradura de seguridad multipunto y manillón negro.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-004.jpg',
    images: [
      '/images/catalog/extracted_DE_PUERTAS/img-005.jpg'
    ],
    category: 'Puertas',
    subcategory: 'Puertas Pivotantes',
    dimensions: '140 x 260 cm (o personalizada)',
    material: 'Estructura interior de acero + Enchape madera teka lacada',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 702,
    title: 'Puerta Pivotante de Fachada con Listones Ranurados en Relieve',
    desc: 'Diseño arquitectónico con acanalado vertical continuo que se integra limpiamente con la pared de fachada.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_DE_PUERTAS/img-006.jpg',
    images: [],
    category: 'Puertas',
    subcategory: 'Puertas Pivotantes',
    dimensions: '130 x 240 cm',
    material: 'MDF hidrófugo lacado poliuretano resistente a UV',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },

  // --- GAMER (A MEDIDA) ---
  {
    id: 801,
    title: 'Habitación Gamer Modular con Iluminación LED y Paneles 3D',
    desc: 'Diseño integral de setup gaming: escritorio esquinero reforzado para 3 monitores, estanterías retroiluminadas y panel acanalado.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-004.jpg',
    images: [
      '/images/catalog/extracted_MUEBLES_GAMER_2/img-005.jpg'
    ],
    category: 'Gamer',
    subcategory: 'Setups Completos',
    dimensions: 'Proyecto integral a medida',
    material: 'Melamina negra mate antihuellas + Perfilería LED RGB',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  },
  {
    id: 802,
    title: 'Setup Gamer Cyberpunk con Cielo Nublado LED y Módulo TV',
    desc: 'Transformación total de dormitorio con efecto nube luminosa en techo, centro de entretenimiento y escritorio gaming.',
    price: 0,
    discountPrice: null,
    imgUrl: '/images/catalog/extracted_MUEBLES_GAMER_2/img-006.jpg',
    images: [],
    category: 'Gamer',
    subcategory: 'Setups Completos',
    dimensions: 'A medida',
    material: 'MDF lacado + Tiras LED inteligentes WiFi',
    priceUnit: 'unidad',
    inStock: true,
    featured: true
  }
];

async function run() {
  console.log('🔄 Sincronizando catálogo limpio a Firestore (siteContent/main)...');
  const ref = db.doc('siteContent/main');
  const snap = await ref.get();
  
  if (!snap.exists()) {
    console.error('Documento siteContent/main no existe.');
    process.exit(1);
  }

  // Backup
  const backupDir = path.join(process.cwd(), 'scripts/backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, `backup-before-pure-clean-${Date.now()}.json`), JSON.stringify(snap.data(), null, 2));

  // Actualizar
  await ref.update({
    products: products,
    updatedAt: FieldValue.serverTimestamp()
  });

  console.log(`✅ ¡Éxito! Firestore actualizado con ${products.length} productos 100% limpios y sin portadas/despedidas.`);
}

run().catch(console.error);
