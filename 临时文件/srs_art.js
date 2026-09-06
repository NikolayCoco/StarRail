// 从列表页提取每个角色的「立绘」URL：卡片里第二个 background-image（第一个是通用占位图）
const https = require('https');
const fs = require('fs');
const path = require('path');

https.get('https://starrailstation.com/cn/characters', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    const re = /<a class="a7916" style="display:flex" href="\/cn\/character\/([a-z0-9]+)">([\s\S]*?)<\/a>/g;
    let m;
    const out = [];
    while ((m = re.exec(d))) {
      const id = m[1];
      const card = m[2];
      const urls = [...card.matchAll(/url\(([^)]+\.webp)\)/g)].map(x => x[1]);
      // 第二个 URL = 角色专属立绘（第一个是所有角色共享的卡片底图）
      const art = urls[1] || urls[0];
      out.push({ id, art });
    }
    fs.writeFileSync(path.join(__dirname, 'srs_art.json'), JSON.stringify(out, null, 2), 'utf8');
    console.log('cards:', out.length, 'saved srs_art.json');
    out.slice(0, 5).forEach(c => console.log(c.id, '->', c.art));
  });
}).on('error', e => console.log('ERR', e.message));
