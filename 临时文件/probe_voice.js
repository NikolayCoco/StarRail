// 在已下载详情页里搜 初次见面/回合开始 台词
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'acheron';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
for (const kw of ['初次见面', '回合开始', '语音', '闲聊']) {
  const i = d.indexOf(kw);
  if (i > 0) {
    console.log('[' + kw + '] @' + i + ': ' + d.slice(i - 40, i + 120).replace(/\s+/g, ' '));
  } else {
    console.log('[' + kw + '] 未找到');
  }
}
console.log('len', d.length);
