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

// 1. Cargar productos desde src/lib/catalog-full.ts
const catalogPath = path.join(process.cwd(), 'src/lib/catalog-full.ts');
const content = fs.readFileSync(catalogPath, 'utf8');

const marker = 'export const ALL_CATALOG_PRODUCTS: Product[] = ';
const startIdx = content.indexOf(marker);
if (startIdx === -1) {
  console.error('No se encontró el marcador en catalog-full.ts');
  process.exit(1);
}

const arrayStart = startIdx + marker.length;
const arrayEnd = content.indexOf(';\n\nexport function getProductsByCategory', arrayStart);
const products = JSON.parse(content.substring(arrayStart, arrayEnd));

console.log(`📦 Auditando ${products.length} productos locales en catalog-full.ts...`);

const publicDir = path.join(process.cwd(), 'public');

const cleanedProducts = [];
const removedProducts = [];
const adjustedProducts = [];

for (const p of products) {
  const mainFullPath = path.join(publicDir, p.imgUrl);
  const mainExists = fs.existsSync(mainFullPath);

  // Filtrar imágenes secundarias que realmente existan en disco
  const validSecondary = (p.images || []).filter((img) => {
    const full = path.join(publicDir, img);
    return fs.existsSync(full);
  });

  const secondaryWereRemoved = (p.images || []).length !== validSecondary.length;

  if (mainExists) {
    if (secondaryWereRemoved) {
      adjustedProducts.push({
        id: p.id,
        title: p.title,
        category: p.category,
        reason: 'Se removieron imágenes secundarias inexistentes en disco',
        before: p.images,
        after: validSecondary,
      });
    }
    cleanedProducts.push({
      ...p,
      images: validSecondary,
    });
  } else {
    // Si la imagen principal no existe pero hay secundarias válidas, promover la primera
    if (validSecondary.length > 0) {
      const newMain = validSecondary[0];
      const newRest = validSecondary.slice(1);
      adjustedProducts.push({
        id: p.id,
        title: p.title,
        category: p.category,
        reason: `Imagen principal borrada (${p.imgUrl}), promovida secundaria (${newMain})`,
      });
      cleanedProducts.push({
        ...p,
        imgUrl: newMain,
        images: newRest,
      });
    } else {
      // No tiene ninguna imagen en disco, eliminar la tarjeta por completo
      removedProducts.push({
        id: p.id,
        title: p.title,
        category: p.category,
        reason: `Todas las imágenes fueron eliminadas del disco (imgUrl: ${p.imgUrl})`,
      });
    }
  }
}

console.log('\n--- RESULTADOS DE LA AUDITORÍA ---');
console.log(`✅ Productos válidos que se conservan: ${cleanedProducts.length}`);
console.log(`🔄 Productos ajustados (imágenes secundarias/promoción): ${adjustedProducts.length}`);
if (adjustedProducts.length > 0) {
  console.log(JSON.stringify(adjustedProducts, null, 2));
}
console.log(`❌ Productos completamente eliminados: ${removedProducts.length}`);
if (removedProducts.length > 0) {
  console.log(JSON.stringify(removedProducts, null, 2));
}

// 2. Guardar cambios en src/lib/catalog-full.ts
const newContent =
  content.substring(0, arrayStart) +
  JSON.stringify(cleanedProducts, null, 2) +
  content.substring(arrayEnd);

fs.writeFileSync(catalogPath, newContent, 'utf8');
console.log('\n💾 src/lib/catalog-full.ts actualizado exitosamente.');

// 3. Sincronizar Firestore siteContent/main
console.log('\n🚀 Sincronizando Firestore siteContent/main...');
const ref = db.doc('siteContent/main');
const snap = await ref.get();
if (!snap.exists) {
  console.error('El documento siteContent/main no existe.');
  process.exit(1);
}

// Crear backup
const backupDir = path.join(process.cwd(), 'scripts', 'backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
fs.writeFileSync(
  path.join(backupDir, `backup-before-cleanup-${Date.now()}.json`),
  JSON.stringify(snap.data(), null, 2)
);

await ref.update({
  products: cleanedProducts,
  updatedAt: FieldValue.serverTimestamp(),
});

console.log(`✅ Firestore actualizado con ${cleanedProducts.length} productos limpios.`);

// Resumen por categoría
const summary = cleanedProducts.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.log('\nDistribución final de productos en catálogo y tienda:');
console.log(summary);
