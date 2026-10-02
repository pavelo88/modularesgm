/**
 * extract-catalog.mjs
 * Extrae cada pagina de los PDFs del catalogo GM como imagen WebP.
 * Uso: node scripts/extract-catalog.mjs
 */

import { pdf } from "pdf-to-img";
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Configuracion
const INPUT_DIR = "C:/Users/pablo/Downloads/Catalogo gm";
const OUTPUT_DIR = "C:/Users/pablo/Downloads/Catalogo gm/extracted";
const SCALE = 2.0;
const WEBP_QUALITY = 88;

const PDF_MAP = [
  { file: "CATALOGO CLOSETS (1).pdf",                           category: "closets" },
  { file: "CATALOGO DE COCINAS.pdf",                            category: "cocinas" },
  { file: "CATALOGO MUEBLES OFICINA.pdf",                       category: "oficina" },
  { file: "CATALOGO MUEBLES GAMER (2).pdf",                     category: "gamer" },
  { file: "CATALOGO DE MUEBLES DE BAÑO.pdf",                   category: "bano" },
  { file: "CATALOGO DE PUERTAS.pdf",                            category: "puertas" },
  { file: "CATALOGO CIRCUITOS DE ESTIMULACION CLIENTES GM.pdf", category: "estimulacion" },
  { file: "CATALOGO ESCRITORIOS ESTUDIANTILES (1).pdf",         category: "escritorios" },
];

// Para el PDF de bano buscar con nombre original
const PDF_NAMES_BANO = ["CATALOGO DE MUEBLES DE BAÑO.pdf", "CATALOGO DE MUEBLES DE BAÑO.pdf", "CATALOGO DE MUEBLES DE BA%C3%91O.pdf"];

async function findFile(dir, name, alternatives = []) {
  const allNames = [name, ...alternatives];
  for (const n of allNames) {
    const p = path.join(dir, n);
    if (fs.existsSync(p)) return p;
  }
  // Buscar manualmente en el directorio
  const files = fs.readdirSync(dir);
  const match = files.find(f => f.toLowerCase().includes('ba'));
  if (match && allNames.some(n => n.includes('BA'))) return path.join(dir, match);
  return null;
}

async function extractPDF(entry) {
  let pdfPath = path.join(INPUT_DIR, entry.file);
  
  // Caso especial: buscar el archivo de bano con diferentes encodings
  if (entry.category === "bano") {
    const found = await findFile(INPUT_DIR, entry.file, PDF_NAMES_BANO);
    if (found) pdfPath = found;
  }

  if (!fs.existsSync(pdfPath)) {
    // Ultimo intento: buscar por categoria keyword
    const files = fs.readdirSync(INPUT_DIR);
    const keyword = entry.category === "bano" ? "ba" : entry.category.toUpperCase();
    const match = files.find(f => f.toUpperCase().includes(keyword.toUpperCase()) && f.endsWith(".pdf"));
    if (match) {
      pdfPath = path.join(INPUT_DIR, match);
      console.log(`  Encontrado como: ${match}`);
    } else {
      console.warn(`SKIP: No encontrado: ${entry.file}`);
      return [];
    }
  }

  const outDir = path.join(OUTPUT_DIR, entry.category);
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`\nProcesando: ${path.basename(pdfPath)} -> ${entry.category}/`);

  const pages = [];
  let pageNum = 0;

  try {
    const doc = await pdf(pdfPath, { scale: SCALE });
    for await (const pngBuffer of doc) {
      pageNum++;
      const filename = `page-${String(pageNum).padStart(2, "0")}.webp`;
      const outPath = path.join(outDir, filename);

      // Convertir PNG -> WebP con sharp
      await sharp(pngBuffer)
        .webp({ quality: WEBP_QUALITY, effort: 4 })
        .toFile(outPath);

      const sizeKB = Math.round(fs.statSync(outPath).size / 1024);
      console.log(`  OK ${filename} (${sizeKB} KB)`);

      pages.push({
        category: entry.category,
        filename,
        pageNumber: pageNum,
        localPath: outPath.replace(/\\/g, "/"),
      });
    }
  } catch (err) {
    console.error(`  ERROR en pagina ${pageNum + 1}: ${err.message}`);
  }

  return pages;
}

async function main() {
  console.log("Iniciando extraccion del catalogo GM...\n");
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalImages: 0,
    categories: {},
    pages: [],
  };

  for (const entry of PDF_MAP) {
    const pages = await extractPDF(entry);
    manifest.pages.push(...pages);
    manifest.categories[entry.category] = pages.length;
    manifest.totalImages += pages.length;
  }

  const manifestPath = path.join(OUTPUT_DIR, "manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log("\n=== Extraccion completada ===");
  console.log(`Total imagenes: ${manifest.totalImages}`);
  for (const [cat, count] of Object.entries(manifest.categories)) {
    console.log(`  ${cat.padEnd(15)} -> ${count} imagenes`);
  }
  console.log(`Manifest: ${manifestPath}`);
}

main().catch(console.error);

