const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          const u = new URL(url);
          loc = u.origin + loc;
        }
        return download(loc, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`Status ${res.statusCode} for ${url}`));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
};

async function processBrands() {
  const brandsDir = path.join(__dirname, '..', 'public', 'brands');

  // 1. Download Briggs
  const briggsRaw = path.join(brandsDir, 'briggs_raw.jpg');
  try {
    console.log('Downloading Briggs...');
    await download('https://briggs.com.ec/wp-content/uploads/2019/02/Briggs-logo.jpg', briggsRaw);
    console.log('Briggs raw downloaded.');
    
    // Trim white borders and convert to webp
    await sharp(briggsRaw)
      .trim()
      .webp({ quality: 90 })
      .toFile(path.join(brandsDir, 'briggs.webp'));
    console.log('Briggs webp created.');
  } catch(e) {
    console.error('Error on Briggs:', e.message);
  }

  // 2. Process Pelikano png -> webp
  const pelikanoPng = path.join(brandsDir, 'pelikano.png');
  if (fs.existsSync(pelikanoPng)) {
    try {
      await sharp(pelikanoPng)
        .trim()
        .webp({ quality: 90 })
        .toFile(path.join(brandsDir, 'pelikano.webp'));
      console.log('Pelikano webp created.');
    } catch(e) {
      console.error('Error on Pelikano webp:', e.message);
    }
  }

  // 3. Process Novopan png -> webp
  const novopanPng = path.join(brandsDir, 'novopan.png');
  if (fs.existsSync(novopanPng)) {
    try {
      await sharp(novopanPng)
        .trim()
        .webp({ quality: 90 })
        .toFile(path.join(brandsDir, 'novopan.webp'));
      console.log('Novopan webp created.');
    } catch(e) {
      console.error('Error on Novopan webp:', e.message);
    }
  }

  // List all brand files
  const files = fs.readdirSync(brandsDir);
  console.log('All Brand files now in public/brands:', files);
}

processBrands();
