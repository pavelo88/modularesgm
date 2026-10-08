const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let loc = res.headers.location;
        if (!loc.startsWith('http')) {
          const u = new URL(url);
          loc = u.origin + loc;
        }
        return download(loc, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', reject);
  });
};

const getPage = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

async function main() {
  const brandsDir = path.join(__dirname, '..', 'public', 'brands');
  if (!fs.existsSync(brandsDir)) fs.mkdirSync(brandsDir, { recursive: true });

  // 1. Hafele
  try {
    const html = await getPage('https://worldvectorlogo.com/logo/hafele');
    const m = html.match(/https:\/\/cdn\.worldvectorlogo\.com\/logos\/[^\"]+\.svg/);
    if (m) {
      console.log('Found Hafele URL:', m[0]);
      await download(m[0], path.join(brandsDir, 'hafele.svg'));
      console.log('Hafele downloaded!');
    } else {
      console.log('Hafele match not found');
    }
  } catch(e) {
    console.error('Error fetching Hafele:', e.message);
  }

  // 2. Pelikano from seeklogo
  try {
    const html = await getPage('https://seeklogo.com/vector-logo/332094/pelikano-novopan');
    const m = html.match(/https:\/\/images\.seeklogo\.com\/logo-png\/[^\"]+/);
    console.log('Seeklogo Pelikano PNG match:', m ? m[0] : 'not found');
    if (m) {
      await download(m[0], path.join(brandsDir, 'pelikano.png'));
      console.log('Pelikano PNG downloaded!');
    }
  } catch(e) {
    console.error('Error fetching Pelikano:', e.message);
  }

  // 3. Novopan
  try {
    const html = await getPage('https://www.novopan.com.ec');
    const m = html.match(/https?:\/\/[^"']+\/(?:logo|novopan)[^"']*\.(?:svg|png|webp)/i);
    console.log('Novopan logo candidate:', m ? m[0] : 'not found');
    if (m) {
      const ext = m[0].split('.').pop().split('?')[0];
      await download(m[0], path.join(brandsDir, `novopan.${ext}`));
      console.log('Novopan downloaded!');
    }
  } catch(e) {
    console.error('Error fetching Novopan:', e.message);
  }

  // Check what we have so far
  const files = fs.readdirSync(brandsDir);
  console.log('Current brands files:', files);
}

main();
