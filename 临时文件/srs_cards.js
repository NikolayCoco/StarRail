// 解析角色列表页：id + 属性 + 命途 + 中文名
const https = require('https');
const fs = require('fs');
const path = require('path');
const url = 'https://starrailstation.com/cn/characters';
const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' } };
https.get(url, opts, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    const re = /<a class="a7916" style="display:flex" href="\/cn\/character\/([a-z0-9]+)">([\s\S]*?)<\/a>/g;
    let m;
    const out = [];
    while ((m = re.exec(d))) {
      const idm = m[1];
      const card = m[2];
      const alts = [...card.matchAll(/alt="([^"]+)"/g)].map(x => x[1]);
      const elem = alts[0], pathc = alts[1];
      const nameMatch = card.match(/class="[^"]*ellipsis[^"]*">([^<]+)<\/div>/);
      const name = nameMatch ? nameMatch[1].trim() : '';
      out.push({ id: idm, name, elem, path: pathc });
    }
    // 落盘主表 JSON
    fs.writeFileSync(path.join(__dirname, 'srs_roster.json'), JSON.stringify(out, null, 2), 'utf8');
    console.log('cards:', out.length);
    out.forEach(c => console.log([c.id, c.name, c.elem, c.path].join('\t')));
  });
}).on('error', e => console.log('ERR', e.message));
