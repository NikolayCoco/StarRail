// 下载并验证候选全身立绘
const https = require('https');
const fs = require('fs');
const id = process.argv[2] || 'acheron';
const url = process.argv[3];
https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  const chunks = [];
  res.on('data', c => chunks.push(c));
  res.on('end', () => {
    fs.writeFileSync('临时文件/test_full_' + id + '.webp', Buffer.concat(chunks));
    console.log('downloaded test_full_' + id + '.webp', res.statusCode, 'size', Buffer.concat(chunks).length);
  });
}).on('error', e => console.log('ERR', e.message));
