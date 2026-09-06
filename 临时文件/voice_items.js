// 提取详情页 voiceItems 数组，列出所有语音 title
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'acheron';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
const i = d.indexOf('"voiceItems"');
console.log('voiceItems 前缀 @', i);
// 截取 voiceItems 数组（到下一个顶层键）
let seg = d.slice(i);
// 简单提取所有 title 与 text
const re = /\{"id":(\d+),"title":"([^"]*)","text":"([\s\S]*?)","unlockRequirement"/g;
let m;
while ((m = re.exec(seg))) {
  console.log('id=' + m[1], 'title=' + m[2], 'text=' + m[3].slice(0, 80).replace(/\\n/g, ' ').replace(/\s+/g, ' '));
}
