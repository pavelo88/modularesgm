import fs from 'node:fs';
import path from 'node:path';

function getDimensions(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) {
    const width = buf.readUInt32BE(16);
    const height = buf.readUInt32BE(20);
    return { type: 'PNG', width, height };
  } else if (buf[0] === 0xFF && buf[1] === 0xD8) {
    let offset = 2;
    while (offset < buf.length) {
      if (buf[offset] !== 0xFF) break;
      const marker = buf[offset + 1];
      if (marker === 0xC0 || marker === 0xC2) {
        const height = buf.readUInt16BE(offset + 5);
        const width = buf.readUInt16BE(offset + 7);
        return { type: 'JPEG', width, height };
      }
      const len = buf.readUInt16BE(offset + 2);
      offset += 2 + len;
    }
  }
  return { type: 'UNKNOWN', width: 0, height: 0 };
}

const dir = path.join(process.cwd(), 'public', 'images', 'catalog', 'extracted_ESCRITORIOS_ESTUDIANTILES_1');
const files = fs.readdirSync(dir).filter(f => /\.(png|jpg)$/i.test(f)).sort();

console.log('=== ESCRITORIOS ESTUDIANTILES REMAINING IMAGES ===');
for (const f of files) {
  const p = path.join(dir, f);
  const dim = getDimensions(p);
  const sizeKb = Math.round(fs.statSync(p).size / 1024);
  console.log(`${f}: ${dim.width}x${dim.height} (${sizeKb} KB)`);
}
