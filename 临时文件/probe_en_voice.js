// 抓英文版角色详情页，检查 voiceItems(英文) + 天赋名 + 终结技名
const https = require('https');
const id = process.argv[2] || 'robinsummeretto';
https.get('https://starrailstation.com/en/character/' + id, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    console.log('status', res.statusCode, 'len', d.length);
    // 是否含 voiceItems
    console.log('has voiceItems:', d.includes('"voiceItems"'));
    // 找 初次见面 英文 ("First Meeting"?) 或 title
    for (const kw of ['"title":"', 'First Meeting', 'initial']) {
      const i = d.indexOf(kw);
      if (i > 0) console.log('['+kw+']@'+i+': '+d.slice(i, i+80).replace(/\s+/g,' '));
    }
    // 找 typeDescHash 值(应该是英文 skill 类型)
    for (const kw of ['typeDescHash":"', '"天赋"', '"Talent"']) {
      const i = d.indexOf(kw);
      if (i > 0) console.log('['+kw+']@'+i+': '+d.slice(i-20, i+40).replace(/\s+/g,' '));
    }
  });
}).on('error', e => console.log('ERR', e.message));
