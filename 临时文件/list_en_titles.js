// 列出英文页所有语音 title
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages_en', id + '.html'), 'utf8');
const re = /\{"id":(\d+),"title":"([^"]*)","text":"([\s\S]*?)","unlockRequirement"/g;
let m; let i = 0;
while ((m = re.exec(d))) {
  console.log('id=' + m[1] + ' title=' + m[2]);
  if (++i > 80) break;
}
