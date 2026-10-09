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

const CATEGORY_MAP = [
  { folder: 'extracted_DE_COCINAS', name: 'Cocinas', basePrice: 1450, unit: 'metro_lineal', desc: 'Cocina integral con mesón de cuarzo y herrajes Blum.' },
  { folder: 'extracted_CLOSETS_1', name: 'Closets', basePrice: 850, unit: 'metro_lineal', desc: 'Walk-in closet modular con iluminación LED y vestidor boutique.' },
  { folder: 'extracted_ESCRITORIOS_ESTUDIANTILES_1', name: 'Escritorios', basePrice: 220, unit: 'unidad', desc: 'Escritorio estudiantil ergonómico en melamina Pelikano 18mm.' },
  { folder: 'extracted_MUEBLES_OFICINA', name: 'Oficina', basePrice: 480, unit: 'unidad', desc: 'Credenza ejecutiva y counter de recepción modular.' },
  { folder: 'extracted_DE_MUEBLES_DE_BANOS', name: 'Baño', basePrice: 380, unit: 'unidad', desc: 'Mueble de baño flotante resistente a humedad con cuarzo.' },
  { folder: 'extracted_DE_PUERTAS', name: 'Puertas', basePrice: 650, unit: 'unidad', desc: 'Puerta pivotante monumental de 3m con cerrojo digital.' },
  { folder: 'extracted_MUEBLES_GAMER_2', name: 'Gamer', basePrice: 340, unit: 'unidad', desc: 'Setup gamer con ruteo de cables oculto y perfiles LED.' },
  { folder: 'extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM', name: 'Estimulación', basePrice: 180, unit: 'unidad', desc: 'Circuito de estimulación sensorial y psicomotriz.' },
  { folder: 'extracted_estudiantiles', name: 'Escritorios', basePrice: 195, unit: 'unidad', desc: 'Módulo estudiantil compacto con repisas.' },
];

async function run() {
  console.log('🚀 Escaneando carpetas reales de catálogo en public/images/catalog...');

  const catalogBase = path.join(process.cwd(), 'public/images/catalog');
  const allProducts = [];
  let globalId = 1;

  for (const cat of CATEGORY_MAP) {
    const dirPath = path.join(catalogBase, cat.folder);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath)
      .filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f))
      .sort();

    console.log(`📁 ${cat.folder}: ${files.length} imágenes encontradas.`);

    // Agrupar imágenes en grupos de 2 o 3 para crear galerías por producto
    for (let i = 0; i < files.length; i += 2) {
      const primaryImg = `/images/catalog/${cat.folder}/${files[i]}`;
      const secondaryImg = files[i + 1] ? `/images/catalog/${cat.folder}/${files[i + 1]}` : null;

      const price = cat.basePrice + (globalId % 7) * 45;
      const product = {
        id: globalId,
        title: `${cat.name} Modelo GM-${100 + globalId}`,
        desc: cat.desc,
        price: price,
        discountPrice: Math.round(price * 0.95),
        imgUrl: primaryImg,
        images: secondaryImg ? [primaryImg, secondaryImg] : [primaryImg],
        category: cat.name,
        priceUnit: cat.unit,
        material: 'Melamina Pelikano RH 18mm & Herrajes Blum',
        dimensions: cat.unit === 'metro_lineal' ? 'Por metro lineal' : '1.80m x 0.60m x 0.75m',
        inStock: true,
        featured: globalId % 4 === 0,
      };

      allProducts.push(product);
      globalId++;
    }
  }

  console.log(`\n✅ Total productos estructurados: ${allProducts.length}`);

  // 1. Guardar en src/lib/catalog-full.ts
  const catalogTsContent = `import type { Product } from './types';

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

export const ALL_CATALOG_PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};

export function getProductsByCategory(category: string): Product[] {
  if (!category || category === 'Todos') return ALL_CATALOG_PRODUCTS;
  return ALL_CATALOG_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export function getFeaturedProducts(): Product[] {
  return ALL_CATALOG_PRODUCTS.filter((p) => p.featured);
}
`;

  fs.writeFileSync(path.join(process.cwd(), 'src/lib/catalog-full.ts'), catalogTsContent, 'utf8');
  console.log('💾 src/lib/catalog-full.ts actualizado.');

  // 2. Sincronizar en Firebase Firestore (siteContent/main)
  const siteRef = db.doc('siteContent/main');
  await siteRef.update({
    products: allProducts,
    updatedAt: FieldValue.serverTimestamp(),
  });
  console.log('🔥 siteContent/main actualizado en Firestore.');

  // 3. Sincronizar en la colección de productos individual
  const prodCollection = db.collection('productos');
  const existingDocs = await prodCollection.get();
  const batch = db.batch();

  existingDocs.forEach((d) => batch.delete(d.ref));
  allProducts.forEach((p) => batch.set(prodCollection.doc(String(p.id)), p));

  await batch.commit();
  console.log('🔥 Colección "productos" en Firestore re-creada y poblada.');

  console.log('\n🎉 Sincronización completa de imágenes reales del catálogo finalizada con éxito.');
}

run().catch(console.error);
