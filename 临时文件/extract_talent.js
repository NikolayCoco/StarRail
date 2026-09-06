// 批量提取所有角色的天赋(talent)名 -> talent_names.json
const fs = require('fs');
const path = require('path');
const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));

function talentOf(id) {
  const fp = path.join(__dirname, 'srs_pages', id + '.html');
  if (!fs.existsSync(fp)) return '';
  const d = fs.readFileSync(fp, 'utf8');
  const namePos = [...d.matchAll(/"name":"([^"]+)"/g)];
  for (const nm of namePos) {
    const after = d.slice(nm.index, nm.index + 200);
    if (after.includes('typeDescHash":"天赋')) return nm[1];
  }
  return '';
}

const out = {};
let ok = 0, miss = [];
for (const r of full) {
  const t = talentOf(r.id);
  if (t) { out[r.id] = t; ok++; }
  else miss.push(r.id);
}
fs.writeFileSync(path.join(__dirname, 'talent_names.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('天赋名提取:', ok, '/', full.length, ' 缺:', miss.join(',') || '无');
