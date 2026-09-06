// 在列表页找每个角色的星级（4⭐/5⭐）标记结构
const https = require('https');
https.get('https://starrailstation.com/cn/characters', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    // 找 acheron 卡片附近含星级的标记
    const i = d.indexOf('/cn/character/acheron');
    // 回看这段（找星级标记）
    console.log('=== acheron 卡片回溯 500 ===');
    console.log('...' + d.slice(i - 500, i + 30).replace(/\s+/g, ' '));
    console.log('=== ===');
    // 全页找 4星/5星 文本
    const s4 = (d.match(/4[⭐★]/g) || []).length;
    const s5 = (d.match(/5[⭐★]/g) || []).length;
    console.log('4星符号次数:', s4, ' 5星符号次数:', s5);
    // 找星级图标 alt
    const alts = [...d.matchAll(/alt="([^"]+)"/g)].map(x => x[1]).filter(a => /星|⭐/.test(a));
    console.log('含星 alt:', [...new Set(alts)]);
  });
}).on('error', e => console.log('ERR', e.message));
