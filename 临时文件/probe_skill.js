// 确认「大天赋名」技能对象的结构（skill 类型）
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
const i = d.indexOf('"name":"巡游在无界的天空"');
if (i < 0) { console.log('not found'); return; }
console.log('...' + d.slice(i - 500, i).replace(/\s+/g, ' '));
