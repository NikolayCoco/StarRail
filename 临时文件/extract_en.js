// 英文提取：First Meeting / Turn Start / 英文天赋名。测试用已下载英文页
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const fp = path.join(__dirname, 'srs_pages_en', id + '.html');
if (!fs.existsSync(fp)) { console.log('英文页未下载:', id); process.exit(0); }
const d = fs.readFileSync(fp, 'utf8');

// 英文语音：找 title 与 text
const voiceRe = /\{"id":(\d+),"title":"([^"]*)","text":"([\s\S]*?)","unlockRequirement"/g;
let m; const items = [];
while ((m = voiceRe.exec(d))) items.push({ title: m[2], text: m[3] });
function findByTitle(kw) {
  const it = items.find(x => x.title.includes(kw));
  return it ? it.text : '';
}
console.log('First Meeting:', findByTitle('First Meeting').slice(0, 70));
console.log('Turn Start:', findByTitle('Turn Start').slice(0, 70));
// 英文天赋名：typeDescHash:"Talent" 前的 name
const namePos = [...d.matchAll(/"name":"([^"]+)"/g)];
let talent = '';
for (const nm of namePos) { if (d.slice(nm.index, nm.index + 200).includes('typeDescHash":"Talent')) { talent = nm[1]; break; } }
console.log('Talent name:', talent);
