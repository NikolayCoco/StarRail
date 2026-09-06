// 探测英文版角色列表：提取角色卡片英文名
const https = require('https');
const fs = require('fs');
const path = require('path');
https.get('https://starrailstation.com/en/characters', { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
  let d = '';
  res.on('data', c => (d += c));
  res.on('end', () => {
    // 找 acheron 卡片
    const i = d.indexOf('/en/character/acheron');
    console.log('acheron pos', i);
    if (i > 0) {
      // 角色名通常在卡片末尾 ellipsis div
      console.log('== acheron 卡片回溯 400 ==');
      console.log(d.slice(i - 400, i + 30).replace(/\s+/g, ' '));
    }
    // 试提取 /en/character/<id> 的英文名模式
    const re = /href="\/en\/character\/([a-z0-9]+)">([\s\S]*?)<\/a>/g;
    let m; const out = [];
    while ((m = re.exec(d)) && out.length < 6) {
      const id = m[1]; const card = m[2];
      const nameMatch = card.match(/class="[^"]*ellipsis[^"]*">([^<]+)<\/div>/);
      out.push([id, nameMatch ? nameMatch[1].trim() : '']);
    }
    console.log('样例:', JSON.stringify(out));
  });
}).on('error', e => console.log('ERR', e.message));
