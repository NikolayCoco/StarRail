// 对比知更鸟·晴歌的天赋 vs 终结技技能对象，找区分字段
const fs = require('fs');
const path = require('path');
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', 'robinsummeretto.html'), 'utf8');

for (const tname of ['巡游在无界的天空', '跃入这片蔚蓝狂想']) {
  const i = d.indexOf('"name":"' + tname + '"');
  console.log('\n======== ' + tname + ' @' + i + ' ========');
  // dump 该对象往前 600 + 往后 100（看对象开头的 key）
  if (i > 0) {
    const seg = d.slice(i - 600, i + 120).replace(/\s+/g, ' ');
    console.log(seg);
  }
}
