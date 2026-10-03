/**
 * Pasa los modelos del catálogo GM (ya subidos a Storage) a la TIENDA: siteContent/main -> products.
 * (seed-catalog.mjs los guardó en la colección "productos", que la tienda y el panel NO leen.)
 *
 * Uso:
 *   node scripts/import-catalog-to-store.mjs            # simulación: no escribe nada
 *   node scripts/import-catalog-to-store.mjs --apply    # escribe (hace copia de seguridad antes)
 *
 * - Cada modelo entra con price 0 e inStock:false: se ve en la tienda como "consultar precio" y
 *   NO se puede comprar hasta que le pongas precio y lo marques en stock desde Tienda Online.
 * - Es idempotente: si la imagen ya está en la tienda, no se duplica.
 * - Antes de escribir guarda un respaldo del documento actual junto al seed del catálogo.
 */
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });
const APPLY = process.argv.includes('--apply');
const DIR = 'C:/Users/pablo/Downloads/Catalogo gm/extracted';
const SEED = `${DIR}/firestore-seed.json`;

const LABELS = {
  closets: 'Closets', cocinas: 'Cocinas', oficina: 'Oficina', gamer: 'Gamer',
  bano: 'Baño', puertas: 'Puertas', estimulacion: 'Estimulación', escritorios: 'Escritorios',
};

const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) { console.error('Falta FIREBASE_SERVICE_ACCOUNT_JSON en .env.local'); process.exit(1); }
const db = getFirestore(initializeApp({ credential: cert(JSON.parse(raw)) }));

const seed = JSON.parse(fs.readFileSync(SEED, 'utf8'));
const ref = db.doc('siteContent/main');
const snap = await ref.get();
const current = snap.data()?.products ?? [];
const known = new Set(current.map((p) => p.imgUrl));
let nextId = current.reduce((m, p) => Math.max(m, Number(p.id) || 0), 0) + 1;

const added = [];
for (const [folder, items] of Object.entries(seed.byCategory)) {
  const label = LABELS[folder] ?? folder;
  for (const it of [...items].sort((a, b) => a.pageNumber - b.pageNumber)) {
    if (known.has(it.url)) continue;
    added.push({
      id: nextId++,
      title: `Modelo de ${label} - Diseño ${it.pageNumber}`,
      desc: `Modelo de ${label.toLowerCase()} del catálogo Modulares GM (página ${it.pageNumber}). Consulta precio y medidas.`,
      price: 0,
      discountPrice: null,
      imgUrl: it.url,
      category: label,
      inStock: false,
      featured: false,
    });
  }
}

const perCat = added.reduce((a, p) => ((a[p.category] = (a[p.category] || 0) + 1), a), {});
console.log(`Productos actuales en la tienda: ${current.length}`);
console.log(`Modelos del catálogo a añadir:   ${added.length}`, perCat);
if (!APPLY) { console.log('\nSIMULACIÓN: no se escribió nada. Usa --apply para aplicar.'); process.exit(0); }
if (added.length === 0) { console.log('Nada que añadir.'); process.exit(0); }

const backup = `${DIR}/backup-siteContent-main-${Date.now()}.json`;
fs.writeFileSync(backup, JSON.stringify(snap.data() ?? {}, null, 2));
console.log(`Respaldo guardado en: ${backup}`);

await ref.update({ products: [...current, ...added], updatedAt: FieldValue.serverTimestamp() });
console.log(`Listo: la tienda ahora tiene ${current.length + added.length} productos.`);
