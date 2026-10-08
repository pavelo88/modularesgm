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
  { folder: 'extracted_MUEBLES_OFICINA', name: 'Muebles de Oficina', basePrice: 480, unit: 'unidad', desc: 'Credenza ejecutiva y counter de recepción modular.' },
  { folder: 'extracted_DE_MUEBLES_DE_BANOS', name: 'Baños', basePrice: 380, unit: 'unidad', desc: 'Mueble de baño flotante resistente a humedad con cuarzo.' },
  { folder: 'extracted_DE_PUERTAS', name: 'Puertas', basePrice: 650, unit: 'unidad', desc: 'Puerta pivotante monumental de 3m con cerrojo digital.' },
  { folder: 'extracted_MUEBLES_GAMER_2', name: 'Gamer', basePrice: 340, unit: 'unidad', desc: 'Setup gamer con ruteo de cables oculto y perfiles LED.' },
  { folder: 'extracted_CIRCUITOS_DE_ESTIMULACION_CLIENTES_GM', name: 'Circuitos', basePrice: 180, unit: 'unidad', desc: 'Circuito de estimulación sensorial y psicomotriz.' },
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
