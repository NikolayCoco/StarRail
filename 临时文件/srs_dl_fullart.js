// 从每个详情页提取 twitter:image 立绘 hash，下载全身立绘(<hash>.webp) 到 美术资源_立绘_全身/
const fs = require('fs');
const https = require('https');
const path = require('path');

const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));
const OUT = path.join(__dirname, '..', '美术资源_立绘_全身');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' };

function getTwitterImgHash(id) {
  const fp = path.join(__dirname, 'srs_pages', id + '.html');
  if (!fs.existsSync(fp)) return null;
  const d = fs.readFileSync(fp, 'utf8');
  // twitter:image content="https://cdn.starrailstation.com/assets/<hash>.cn.jpg"
  const m = d.match(/property="twitter:image" content="https:\/\/cdn\.starrailstation\.com\/assets\/([a-f0-9]+)\.cn\.jpg"/);
  return m ? m[1] : null;
}

function downloadHash(hash, id) {
  const url = 'https://cdn.starrailstation.com/assets/' + hash + '.webp';
  const fp = path.join(OUT, id + '.webp');
  return new Promise((resolve) => {
    if (fs.existsSync(fp) && fs.statSync(fp).size > 50000) { resolve('skip'); return; }
    https.get(url, { headers: UA }, res => {
      if (res.statusCode !== 200) { res.destroy(); resolve('http' + res.statusCode); return; }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const b = Buffer.concat(chunks);
        if (b.length > 50000) { fs.writeFileSync(fp, b); resolve('ok'); }
        else resolve('small');
      });
    }).on('error', e => resolve('err'));
  });
}

(async () => {
  let ok = 0, skip = 0, fail = [];
  for (let i = 0; i < list.length; i++) {
    const id = list[i].id;
    const hash = getTwitterImgHash(id);
    if (!hash) { fail.push(id + ':nohash'); continue; }
    const st = await downloadHash(hash, id);
    if (st === 'ok') ok++;
    else if (st === 'skip') skip++;
    else fail.push(id + ':' + st);
    if ((i + 1) % 10 === 0) console.log(`full-art ${i + 1}/${list.length} ok=${ok} skip=${skip} fail=${fail.length}`);
    await new Promise(r => setTimeout(r, 70));
  }
  console.log('DONE 全身立绘: ok=' + ok + ' skip=' + skip + ' fail=' + JSON.stringify(fail));
})();
