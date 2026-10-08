import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
const APPLY = process.argv.includes('--apply');

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) {
  console.error('ERROR: Falta FIREBASE_SERVICE_ACCOUNT_JSON en .env.local');
  process.exit(1);
}

const db = getFirestore(initializeApp({ credential: cert(JSON.parse(raw)) }));

// Cargar ALL_CATALOG_PRODUCTS desde el archivo catalog-full.ts
const catalogFilePath = path.join(process.cwd(), 'src/lib/catalog-full.ts');
const catalogFileContent = fs.readFileSync(catalogFilePath, 'utf8');

const marker = 'export const ALL_CATALOG_PRODUCTS: Product[] = ';
const markerIdx = catalogFileContent.indexOf(marker);
if (markerIdx === -1) {
  console.error('ERROR: No se encontró ALL_CATALOG_PRODUCTS en src/lib/catalog-full.ts');
  process.exit(1);
}

const arrayStart = markerIdx + marker.length;
const arrayEnd = catalogFileContent.indexOf(';\n\nexport function getProductsByCategory', arrayStart);
if (arrayEnd === -1) {
  console.error('ERROR: No se pudo delimitar el array ALL_CATALOG_PRODUCTS');
  process.exit(1);
}

const curatedProducts = JSON.parse(catalogFileContent.substring(arrayStart, arrayEnd));
console.log(`\n📦 Productos curados listos para sincronizar: ${curatedProducts.length}`);

// Resumen por categoría de los productos curados
const curatedByCat = curatedProducts.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.log('Distribución de productos curados:', curatedByCat);

// Obtener datos actuales de Firestore
const ref = db.doc('siteContent/main');
const snap = await ref.get();
if (!snap.exists) {
  console.error('ERROR: El documento siteContent/main no existe en Firestore');
  process.exit(1);
}

const currentData = snap.data() || {};
const currentProducts = currentData.products || [];
console.log(`\n🔍 Productos actuales en siteContent/main: ${currentProducts.length}`);

const currentByCat = currentProducts.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {});
console.log('Distribución actual en Firestore:', currentByCat);

// Crear carpeta de backups si no existe
const backupDir = path.join(process.cwd(), 'scripts', 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

const backupPath = path.join(backupDir, `backup-siteContent-main-${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(currentData, null, 2), 'utf8');
console.log(`\n💾 Respaldo de seguridad creado exitosamente en:\n   ${backupPath}`);

if (!APPLY) {
  console.log('\n⚠️  MODO SIMULACIÓN: No se aplicaron cambios a Firestore.');
  console.log('👉 Para aplicar los cambios reales, ejecuta: node scripts/sync-curated-catalog-to-firestore.mjs --apply\n');
  process.exit(0);
}

// Aplicar la actualización
console.log('\n🚀 Actualizando siteContent/main con los productos curados...');
await ref.update({
  products: curatedProducts,
  updatedAt: FieldValue.serverTimestamp()
});

// Verificación post-escritura
const verifySnap = await ref.get();
const updatedProducts = verifySnap.data()?.products || [];
console.log(`✅ Sincronización exitosa. Total productos en Firestore: ${updatedProducts.length}`);
console.log('Categorías verificadas:', updatedProducts.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {}));
console.log('\n✨ Catálogo de Modulares GM 100% curado y sincronizado con éxito.\n');
