import fs from 'node:fs';
import path from 'node:path';

const catalogDir = path.join(process.cwd(), 'public', 'images', 'catalog');
const dirs = fs.readdirSync(catalogDir).filter(d => fs.statSync(path.join(catalogDir, d)).isDirectory());

console.log('=== IMAGES REMAINING ON DISK ===');
let totalImages = 0;
for (const dir of dirs) {
  const files = fs.readdirSync(path.join(catalogDir, dir)).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  totalImages += files.length;
  console.log(`\n📁 Folder: ${dir} (${files.length} images)`);
  console.log('  ' + files.sort().join(', '));
}
console.log(`\nTotal images remaining on disk: ${totalImages}`);
