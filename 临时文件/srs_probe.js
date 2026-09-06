// 探测角色详情页结构：是否含 __NEXT_DATA__ 或结构化属性/命途信息
const https = require('https');
const id = process.argv[2] || 'acheron';
const url = 'https://starrailstation.com/cn/character/' + id;
const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' } };
https.get(url, opts, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    console.log('status', res.statusCode, 'len', d.length);
    const hasNext = d.includes('__NEXT_DATA__');
    console.log('has __NEXT_DATA__:', hasNext);
    // 找 __NEXT_DATA__ 或 self.__next_f 数据
    const i = d.indexOf('__NEXT_DATA__');
    if (i > 0) console.log('next_data snippet:', d.slice(i, i + 300).replace(/\n/g, ' '));
    // 找命途/属性关键词
    for (const kw of ['命途','dest','path','element','属性','rarity','星级','阵营']) {
      const k = d.indexOf(kw);
      if (k > 0) console.log('kw['+kw+'] at', k, ':', d.slice(k-40, k+40).replace(/\s+/g,' '));
    }
  });
}).on('error', e => console.log('ERR', e.message));
