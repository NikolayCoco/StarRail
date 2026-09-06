// 提取终结技(ultimate)名：找含 ultimateCost 的技能对象的 name
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');

// 找每个终结技对象。用 "ultimateCost" 作为终结技特征，取其对象的 name
// 简化：ultimateCost 前最近的一个 "name":"..." 可能是其他技能；更稳是：找 "name":"X" 且其后(较小范围)有 ultimateCost
const namePos = [...d.matchAll(/"name":"([^"]+)"/g)];
let ult = null;
for (let i = 0; i < namePos.length; i++) {
  const nm = namePos[i];
  const after = d.slice(nm.index, nm.index + 120);
  if (after.includes('ultimateCost')) { ult = nm[1]; break; }
}
console.log(id, '终结技(大天赋)名:', ult);
