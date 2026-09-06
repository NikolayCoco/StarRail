// 在详情页找「大天赋」字段（以 robinsummeretto 为例搜 '巡游在无界的天空'）
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
const kw = '巡游在无界的天空';
const i = d.indexOf(kw);
console.log('kw pos', i);
if (i > 0) console.log(d.slice(i - 200, i + 80).replace(/\s+/g, ' '));
// 也搜 天赋/大天赋/ultimate/talent 字段名
for (const k of ['天赋', '"ultimate"', '"talent"', '大天赋', '行迹', '战技']) {
  const j = d.indexOf(k);
  if (j > 0) console.log('['+k+']@'+j+': '+d.slice(j-40, j+60).replace(/\s+/g,' '));
}
