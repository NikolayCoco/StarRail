// 从 starrailstation.com/cn/characters 提取全部角色 id 列表
const https = require('https');
const url = 'https://starrailstation.com/cn/characters';
const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' } };
https.get(url, opts, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    const re = /href="\/cn\/character\/([a-z0-9]+)"/g;
    const ids = new Set();
    let m;
    while ((m = re.exec(d))) ids.add(m[1]);
    console.log('role ids (unique):', ids.size);
    console.log([...ids].sort().join('\n'));
  });
}).on('error', e => console.log('ERR', e.message));
