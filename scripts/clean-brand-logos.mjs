import fs from 'fs';
import sharp from 'sharp';

// 1. Remove white background rect from SVGs (stored as .webp)
['blum', 'hafele', 'teka'].forEach(name => {
  const file = `public/brands/${name}.webp`;
  let svg = fs.readFileSync(file, 'utf8');
  svg = svg.replace(/<path fill="#fff" d="M0 0h192\.756v192\.756H0V0z"\/>/g, '');
  svg = svg.replace(/<path fill="white" d="M0 0h192\.756v192\.756H0V0z"\/>/g, '');
  fs.writeFileSync(file, svg, 'utf8');
  console.log('Cleaned SVG background for:', name);
});

// 2. Make briggs.webp transparent (remove white bg)
async function cleanBriggs() {
  const fileBuf = fs.readFileSync('public/brands/briggs.webp');
  const { data, info } = await sharp(fileBuf).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    // If close to white, make transparent
    if (r > 240 && g > 240 && b > 240) {
      out[i * 4 + 3] = 0;
    } else {
      out[i * 4 + 3] = 255;
    }
  }
  const cleanBuf = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 95 })
    .toBuffer();
  fs.writeFileSync('public/brands/briggs.webp', cleanBuf);
  console.log('Cleaned briggs transparency');
}

// 3. Make pelikano.webp transparent (remove yellow bg)
async function cleanPelikano() {
  const fileBuf = fs.readFileSync('public/brands/pelikano.webp');
  const { data, info } = await sharp(fileBuf).raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const r = data[i * 3];
    const g = data[i * 3 + 1];
    const b = data[i * 3 + 2];
    out[i * 4] = r;
    out[i * 4 + 1] = g;
    out[i * 4 + 2] = b;
    // Pelikano background is yellow (~254, 241, 2)
    if (r > 200 && g > 180 && b < 80) {
      out[i * 4 + 3] = 0;
    } else {
      out[i * 4 + 3] = 255;
    }
  }
  const cleanBuf = await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .webp({ quality: 95 })
    .toBuffer();
  fs.writeFileSync('public/brands/pelikano.webp', cleanBuf);
  console.log('Cleaned pelikano transparency');
}

async function main() {
  await cleanBriggs();
  await cleanPelikano();
  console.log('All brand logos cleaned and made transparent!');
}

main().catch(console.error);
