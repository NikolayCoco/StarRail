// 批量下载英文版角色详情页 -> 临时文件/srs_pages_en/<id>.html
const https = require('https');
const fs = require('fs');
const path = require('path');
const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));
const ids = full.map(c => c.id);
const OUT = path.join(__dirname, 'srs_pages_en');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' };
let done = 0, failed = [];
function getOne(id) {
  return new Promise((resolve) => {
    https.get('https://starrailstation.com/en/character/' + id, { headers: UA }, res => {
      if (res.statusCode !== 200) { failed.push(id + ':HTTP' + res.statusCode); res.destroy(); return resolve(); }
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => { fs.writeFileSync(path.join(OUT, id + '.html'), d, 'utf8'); done++; resolve(); });
    }).on('error', e => { failed.push(id + ':ERR'); resolve(); });
  });
}
(async () => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const fp = path.join(OUT, id + '.html');
    if (fs.existsSync(fp) && fs.statSync(fp).size > 1000) { done++; continue; }
    await getOne(id);
    if ((i + 1) % 10 === 0) console.log(`en ${i + 1}/${ids.length} done=${done}`);
    await new Promise(r => setTimeout(r, 90));
  }
  console.log('EN DONE', done, 'failed', failed);
})();
