// 生成立绘清单 TSV：id + 中文名 + 命途 + 属性 + 阵营 + 立绘文件名
const fs = require('fs');
const path = require('path');

const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));
// 按阵营排序
full.sort((a, b) => (a.camp || '').localeCompare(b.camp || '', 'zh') );

const header = ['id', 'name', 'path', 'element', 'camp', 'artfile'];
const rows = full.map(r => [r.id, r.name, r.path, r.elem, r.camp, r.id + '.webp'].join('\t'));
fs.writeFileSync(path.join(__dirname, '立绘清单.tsv'), header.join('\t') + '\n' + rows.join('\n'), 'utf8');
console.log('清单行数:', full.length);

// 统计
const camps = {};
for (const r of full) camps[r.camp] = (camps[r.camp] || 0) + 1;
console.log('阵营分布:', Object.entries(camps).sort((a,b)=>b[1]-a[1]).map(([c,n])=>c+':'+n).join('  '));
