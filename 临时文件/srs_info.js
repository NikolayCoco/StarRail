// 查看详情页角色信息卡：阵营巡海游侠 前后的完整区域
const https = require('https');
const id = process.argv[2] || 'acheron';
https.get('https://starrailstation.com/cn/character/' + id, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    const i = d.indexOf('阵营');
    console.log('len', d.length, '阵营 pos', i);
    if (i > 0) {
      console.log('=== 阵营附近 800 chars ===');
      console.log(d.slice(i - 400, i + 400).replace(/\s+/g, ' '));
    }
    // 找 5星/4星 或 rarity 相关
    const r = d.indexOf('"rarity"');
    if (r > 0) console.log('=== rarity 附近 ===', d.slice(r - 120, r + 80).replace(/\s+/g,' '));
    // 找角色名 H1
    const h1 = d.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (h1) console.log('H1:', h1[1].replace(/\s+/g,' ').slice(0,60));
  });
}).on('error', e => console.log('ERR', e.message));
