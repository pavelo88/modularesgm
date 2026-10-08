import fs from 'fs';
import path from 'path';

const dirs = [
  'extracted_DE_COCINAS',
  'extracted_CLOSETS_1',
  'extracted_DE_MUEBLES_DE_BANOS',
  'extracted_DE_PUERTAS',
  'extracted_MUEBLES_GAMER_2',
  'extracted_MUEBLES_OFICINA',
  'extracted_ESCRITORIOS_ESTUDIANTILES_1'
];

let html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Catalog Audit Visualizer</title>
<style>
  body { background: #0f172a; color: #f8fafc; font-family: system-ui, sans-serif; padding: 20px; }
  h2 { border-bottom: 2px solid #38bdf8; padding-bottom: 8px; margin-top: 40px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 30px; }
  .card { background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155; }
  .card img { width: 100%; height: 180px; object-fit: cover; display: block; }
  .info { padding: 10px; font-size: 12px; }
  .info .name { font-weight: bold; color: #38bdf8; }
</style>
</head>
<body>
<h1>Catalog Images Audit</h1>
`;

for (const d of dirs) {
  const fullDir = path.join(process.cwd(), 'public/images/catalog', d);
  if (!fs.existsSync(fullDir)) continue;
  const files = fs.readdirSync(fullDir).filter(f => f.match(/\.(jpg|png|webp)$/i));
  html += `<h2>${d} (${files.length} files)</h2><div class="grid">`;
  for (const f of files) {
    const webPath = `/images/catalog/${d}/${f}`;
    html += `
      <div class="card">
        <img src="${webPath}" alt="${f}" loading="lazy">
        <div class="info">
          <div class="name">${f}</div>
        </div>
      </div>
    `;
  }
  html += `</div>`;
}

html += `</body></html>`;
fs.writeFileSync(path.join(process.cwd(), 'public/catalog-audit.html'), html);
console.log('Saved public/catalog-audit.html');
