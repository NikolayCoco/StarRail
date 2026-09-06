// 探测详情页：提取中文名/星级/属性/命途/阵营/性别/简介
const https = require('https');
const id = process.argv[2] || 'acheron';
const url = 'https://starrailstation.com/cn/character/' + id;
const opts = { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36' } };
https.get(url, opts, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    // 标题
    const title = d.match(/<title>([^<]+)<\/title>/);
    console.log('TITLE:', title ? title[1] : '?');
    // 页面里所有 <div ...>阵营</div><div ...>XXX</div> 模式
    const wiki = d.match(/阵营<\/div><div class="[^"]+">([^<]+)<\/div>/);
    console.log('阵营:', wiki ? wiki[1] : '?');
    // 星级：找 4⭐/5⭐ 或数字+⭐
    const stars = d.match(/([1-5])[⭐星]/g) || d.match(/([1-5])★/g);
    console.log('星级线索:', stars ? stars.slice(0,5).join(',') : '?');
    // 命途
    const path = d.match(/命途[^"<]*["<]?/);
    console.log('命途KEY:', path ? path[0].slice(0,60) : '?');
  });
}).on('error', e => console.log('ERR', e.message));
