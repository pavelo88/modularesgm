import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
dotenv.config({ path: path.join(ROOT, ".env.local") });

let app;
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (raw) {
  app = initializeApp({ credential: cert(JSON.parse(raw)) });
} else {
  app = initializeApp({ credential: applicationDefault() });
}

const db = getFirestore(app);
const SEED_PATH = "C:/Users/pablo/Downloads/Catalogo gm/extracted/firestore-seed.json";

async function main() {
  if (!fs.existsSync(SEED_PATH)) {
    console.error("No se encontro firestore-seed.json. Ejecuta primero upload-catalog.mjs");
    process.exit(1);
  }

  const seed = JSON.parse(fs.readFileSync(SEED_PATH, "utf8"));
  console.log(`Leidas las categorias desde seed...`);

  let totalProducts = 0;
  const batch = db.batch();
  const productsCollection = db.collection("productos");

  for (const [category, items] of Object.entries(seed.byCategory)) {
    for (const item of items) {
      // Create a document ref
      const docRef = productsCollection.doc();
      
      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      
      // We set price to 0 and allow the user to modify them later in the CMS
      const product = {
        id: new Date().getTime() + totalProducts, // Numeric ID for backward compatibility with frontend if needed
        title: `Modelo de ${categoryName} - Diseño ${item.pageNumber}`,
        desc: `Página ${item.pageNumber} del catálogo de ${categoryName}.`,
        price: 0,
        discountPrice: null,
        imgUrl: item.url,
        category: category.toLowerCase(),
        inStock: true,
        featured: item.pageNumber <= 3, // Feature the first 3 pages of each catalog
        createdAt: new Date().toISOString(),
      };

      batch.set(docRef, product);
      totalProducts++;
    }
  }

  console.log(`Preparando ${totalProducts} productos para subir a Firestore...`);
  await batch.commit();
  console.log("¡Éxito! Todos los productos han sido guardados en Firestore.");
}

main().catch(e => console.error("Error:", e));
