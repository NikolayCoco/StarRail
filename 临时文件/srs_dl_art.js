// 批量下载角色立绘（cdn webp）到 美术资源_立绘/<id>.webp
// 立绘 URL 来自 srs_art.json（每个角色第二个 background-image，专属立绘）
const https = require('https');
const fs = require('fs');
const path = require('path');

const art = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_art.json'), 'utf8'));
const OUTDIR = path.join(__dirname, '..', '美术资源_立绘');
if (!fs.existsSync(OUTDIR)) fs.mkdirSync(OUTDIR, { recursive: true });

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' };
let done = 0, failed = [];

function downloadOne(item) {
  return new Promise((resolve) => {
    const fp = path.join(OUTDIR, item.id + '.webp');
    if (fs.existsSync(fp) && fs.statSync(fp).size > 5000) { done++; return resolve(); }
    https.get(item.art, { headers: UA }, res => {
      if (res.statusCode !== 200) { failed.push(item.id + ':HTTP' + res.statusCode); res.destroy(); return resolve(); }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const b = Buffer.concat(chunks);
        fs.writeFileSync(fp, b);
        done++;
        resolve();
      });
    }).on('error', e => { failed.push(item.id + ':ERR'); resolve(); });
  });
}

(async () => {
  for (let i = 0; i < art.length; i++) {
    await downloadOne(art[i]);
    if ((i + 1) % 10 === 0) console.log(`art progress ${i + 1}/${art.length} done=${done} fail=${failed.length}`);
    await new Promise(r => setTimeout(r, 80));
  }
  console.log('ART DONE downloaded:', done, 'failed:', failed);
})();
