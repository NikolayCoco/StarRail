// 探测详情页：找 星级(稀有度)/性别/阵营 的 HTML 结构
const https = require('https');
const id = process.argv[2] || 'acheron';
https.get('https://starrailstation.com/cn/character/' + id, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    // 找星级：通常是 "5星" 或 5个星符号，或 rarity 字段，或 <img alt="5⭐">
    const starMatches = d.match(/alt="([1-5])\s*[⭐★]/g) || d.match(/([1-5])[⭐★]/g);
    console.log('星级候选:', starMatches ? starMatches.slice(0,6).join(' | ') : '无');
    // 找 阵营 的富文本
    const camp = d.match(/阵营<\/div><div class="[^"]+">([^<]+)<\/div>/);
    console.log('阵营:', camp ? camp[1].trim() : '?');
    // 找 性别
    const gender = d.match(/性别<\/div><div class="[^"]+">([^<]+)<\/div>/) || d.match(/性别/);
    console.log('性别:', gender ? (gender[1] || '存在但结构不同') : '?');
    // 找 "5星"/"4星" 出现在属性旁
    const starTxt = d.match(/[1-5]\s*星/);
    console.log('X星文本:', starTxt ? starTxt[0] : '无');
  });
}).on('error', e => console.log('ERR', e.message));
