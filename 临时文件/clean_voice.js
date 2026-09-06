// 净化 voice_lines.json：去 HTML 标签/实体
const fs = require('fs');
const path = require('path');
const v = JSON.parse(fs.readFileSync(path.join(__dirname, 'voice_lines.json'), 'utf8'));

function clean(s) {
  if (!s) return s;
  return s
    .replace(/<[^>]+>/g, '')      // 去 HTML 标签（含 <nobr>...</nobr>）
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\uFFFD/g, '')       // 去替换字符
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\\n/g, '\n')
    .trim();
}

let cleaned = 0;
for (const id of Object.keys(v)) {
  const before = v[id];
  v[id] = { first: clean(before.first), turn: clean(before.turn) };
  if (v[id].first !== before.first || v[id].turn !== before.turn) cleaned++;
}
fs.writeFileSync(path.join(__dirname, 'voice_lines.json'), JSON.stringify(v, null, 2), 'utf8');
console.log('净化条数:', cleaned, ' 总角色:', Object.keys(v).length);
// 验证 aventurinewaveflair
console.log('aventurinewaveflair 净化后:', v['aventurinewaveflair'].first.slice(0,60));
