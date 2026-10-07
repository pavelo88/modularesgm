#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const catalogDir = 'C:\\Users\\pablo\\Downloads\\Catalogo gm';
const outputDir = 'C:\\Users\\pablo\\AppData\\Local\\Temp\\claude\\catalog-images';

// Crear directorio de salida
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Obtener lista de PDFs
const pdfs = fs.readdirSync(catalogDir)
  .filter(f => f.endsWith('.pdf'))
  .sort();

console.log(`📄 Encontrados ${pdfs.length} PDFs\n`);

pdfs.forEach(pdfFile => {
  const pdfPath = path.join(catalogDir, pdfFile);
  const categoryName = pdfFile
    .replace(/CATALOGO\s*/i, '')
    .replace(/\.pdf/i, '')
    .replace(/\s*\(\d+\)/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');

  const categoryDir = path.join(outputDir, categoryName);

  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  console.log(`🔄 Procesando: ${pdfFile}`);
  console.log(`   Categoría: ${categoryName}`);

  // Intentar extraer usando pdftoppm (si está disponible) o reportar
  try {
    // Usar ImageMagick/Ghostscript
    const cmd = `magick convert "${pdfPath}" -density 150 "${categoryDir}\\page-%%d.webp"`;
    console.log(`   Ejecutando: ${cmd.substring(0, 80)}...`);
    execSync(cmd, { stdio: 'pipe' });
    console.log(`   ✅ Extraído a: ${categoryDir}\n`);
  } catch (err) {
    console.log(`   ⚠️  Error: ${err.message.substring(0, 100)}\n`);
  }
});

console.log('\n✨ Extracción completada. Directorio:', outputDir);
