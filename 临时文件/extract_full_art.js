// 从详情页提取「角色立绘」url：取 H1 之前最近的 cdn background-image
// 并下载一张验证
const fs = require('fs');
const https = require('https');
const path = require('path');
const id = process.argv[2] || 'acheron';
const d = fs.readFileSync('临时文件/srs_pages/' + id + '.html', 'utf8');
const h1m = d.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
const h1i = h1m ? h1m.index : d.length;
// 取 H1 之前 2500 字符里的 cdn background-image url
const window = d.slice(Math.max(0, h1i - 2500), h1i);
const urls = [...new Set([...window.matchAll(/background-image:url\('?([^')]+\.webp)'?\)/g)].map(m => m[1]))];
const cand = urls.filter(u => u.includes('cdn.starrailstation.com')) || urls;
const roleUrl = cand[0];
console.log('候选角色立绘 URL:', roleUrl);
// 下载验证
if (roleUrl) {
  https.get(roleUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
      fs.writeFileSync('临时文件/test_full_' + id + '.webp', Buffer.concat(chunks));
      console.log('downloaded test_full_' + id + '.webp', res.statusCode);
    });
  }).on('error', e => console.log('ERR', e.message));
}
