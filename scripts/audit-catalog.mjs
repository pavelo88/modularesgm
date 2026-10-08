import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function auditCategory(catDir) {
  const fullDir = path.join(process.cwd(), 'public/images/catalog', catDir);
  if (!fs.existsSync(fullDir)) return;
  const files = fs.readdirSync(fullDir).filter(f => f.match(/\.(jpg|png|webp)$/i));
  console.log(`\n=== ${catDir} (${files.length} images) ===`);
  for (const f of files) {
    const p = path.join(fullDir, f);
    const meta = await sharp(p).metadata();
    const stats = fs.statSync(p);
    console.log(`  ${f.padEnd(14)} ${meta.width}x${meta.height} (${Math.round(stats.size/1024)}KB)`);
  }
}

async function main() {
  const dirs = [
    'extracted_DE_COCINAS',
    'extracted_CLOSETS_1',
    'extracted_DE_MUEBLES_DE_BANOS',
    'extracted_DE_PUERTAS',
    'extracted_MUEBLES_GAMER_2',
    'extracted_MUEBLES_OFICINA',
    'extracted_ESCRITORIOS_ESTUDIANTILES_1'
  ];
  for (const d of dirs) {
    await auditCategory(d);
  }
}

main().catch(console.error);
