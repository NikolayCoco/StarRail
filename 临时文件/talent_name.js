// 提取角色的天赋(talent)名：找 "name":"X" 且其后有 "typeDescHash":"天赋"
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
const namePos = [...d.matchAll(/"name":"([^"]+)"/g)];
let talent = null;
for (const nm of namePos) {
  const after = d.slice(nm.index, nm.index + 200);
  if (after.includes('typeDescHash":"天赋')) { talent = nm[1]; break; }
}
console.log(id, '天赋名:', talent);
