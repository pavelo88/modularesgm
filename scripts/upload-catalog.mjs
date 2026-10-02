/**
 * upload-catalog.mjs
 * Sube las imagenes extraidas del catalogo GM a Firebase Storage.
 * Uso: node scripts/upload-catalog.mjs
 *
 * REQUISITOS:
 *   - Tener el manifest.json en C:/Users/pablo/Downloads/Catalogo gm/extracted/
 *   - Tener .env.local con NEXT_PUBLIC_FIREBASE_* configurado
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Leer variables de entorno desde .env.local
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const lines = fs.readFileSync(filePath, "utf8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
    env[key] = val;
  }
  return env;
}

const ROOT = process.cwd();
const env = loadEnv(path.join(ROOT, ".env.local"));
const MANIFEST_PATH = "C:/Users/pablo/Downloads/Catalogo gm/extracted/manifest.json";
const STORAGE_BUCKET = `${env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebasestorage.app`;

console.log(`Bucket de destino: ${STORAGE_BUCKET}`);

// Inicializar Firebase Admin con Application Default Credentials
// (requiere que hayas hecho: firebase login o gcloud auth application-default login)
let app;
try {
  app = initializeApp({
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
  });
} catch (e) {
  // Ya inicializado
  const { getApps } = await import("firebase-admin/app");
  app = getApps()[0];
}

const storage = getStorage(app);
const bucket = storage.bucket();

async function uploadFile(localPath, storagePath) {
  await bucket.upload(localPath, {
    destination: storagePath,
    metadata: {
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000",
    },
  });
  const file = bucket.file(storagePath);
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${STORAGE_BUCKET}/${storagePath}`;
  return publicUrl;
}

async function main() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    console.error("ERROR: No se encontro manifest.json. Ejecuta primero extract-catalog.mjs");
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  console.log(`\nSubiendo ${manifest.totalImages} imagenes a Firebase Storage...`);

  const seed = { uploadedAt: new Date().toISOString(), products: [], byCategory: {} };

  for (const page of manifest.pages) {
    if (!fs.existsSync(page.localPath)) {
      console.warn(`  SKIP (no existe): ${page.localPath}`);
      continue;
    }

    const storagePath = `catalog/${page.category}/${page.filename}`;
    try {
      const url = await uploadFile(page.localPath, storagePath);
      console.log(`  OK gs://.../${storagePath}`);

      // Agregar al seed de Firestore
      if (!seed.byCategory[page.category]) {
        seed.byCategory[page.category] = [];
      }
      seed.byCategory[page.category].push({
        filename: page.filename,
        pageNumber: page.pageNumber,
        url,
        storagePath,
      });
    } catch (err) {
      console.error(`  ERROR ${page.filename}: ${err.message}`);
    }
  }

  // Guardar seed
  const seedPath = "C:/Users/pablo/Downloads/Catalogo gm/extracted/firestore-seed.json";
  fs.writeFileSync(seedPath, JSON.stringify(seed, null, 2));

  console.log("\n=== Upload completado ===");
  for (const [cat, items] of Object.entries(seed.byCategory)) {
    console.log(`  ${cat.padEnd(15)} -> ${items.length} imagenes subidas`);
  }
  console.log(`Seed guardado en: ${seedPath}`);
  console.log("\nPROXIMO PASO: node scripts/seed-catalog.mjs");
}

main().catch(e => {
  console.error("ERROR FATAL:", e.message);
  console.log("\nNOTA: Para subir a Firebase Storage necesitas autenticacion.");
  console.log("Ejecuta: npx firebase-admin login  o  gcloud auth application-default login");
  process.exit(1);
});
