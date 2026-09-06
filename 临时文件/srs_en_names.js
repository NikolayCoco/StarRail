// 从英文版列表提取全部角色官方英文名 -> srs_en_names.json
const https = require('https');
const fs = require('fs');
const path = require('path');
https.get('https://starrailstation.com/en/characters', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    const re = /href="\/en\/character\/([a-z0-9]+)">([\s\S]*?)<\/a>/g;
    let m; const map = {};
    while ((m = re.exec(d))) {
      const id = m[1]; const card = m[2];
      const nameMatch = card.match(/class="[^"]*ellipsis[^"]*">([^<]+)<\/div>/);
      const enName = nameMatch ? nameMatch[1].trim() : '';
      if (enName && !map[id]) map[id] = enName;
    }
    fs.writeFileSync(path.join(__dirname, 'srs_en_names.json'), JSON.stringify(map, null, 2), 'utf8');
    console.log('英文名数量:', Object.keys(map).length);
    // 覆盖检查
    const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));
    const missing = full.filter(r => !map[r.id]).map(r => r.id);
    console.log('缺英文名:', missing.length ? missing.join(',') : '无');
  });
}).on('error', e => console.log('ERR', e.message));
