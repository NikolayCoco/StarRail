// 在角色详情页找「角色本体星级」(rarity) 的确切位置
const fs = require('fs');
const id = process.argv[2] || 'acheron';
const d = fs.readFileSync('临时文件/srs_pages/' + id + '.html', 'utf8');

// 页面里所有 rarity:N 的上下文(找角色本体)
const re = /("?rarity"?\s*:\s*(\d+))/g;
let m; const ctxs = [];
while ((m = re.exec(d)) && ctxs.length < 12) {
  ctxs.push('rarity=' + m[2] + ' @' + m.index + ' :: ' + d.slice(m.index - 90, m.index + 10).replace(/\s+/g, ' '));
}
console.log('== rarity 上下文 ==');
ctxs.forEach(c => console.log(c));
