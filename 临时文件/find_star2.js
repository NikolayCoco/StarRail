// 看详情页开头，定位角色星级/属性/命途信息区
const fs = require('fs');
const id = process.argv[2] || 'acheron';
const d = fs.readFileSync('临时文件/srs_pages/' + id + '.html', 'utf8');
console.log('len', d.length);
// 找 H1(名字) 附近及角色信息
const h1m = d.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
console.log('H1:', h1m ? h1m[1].replace(/<[^>]*>/g, '').trim() : '?');
// 找「命途」标签块
const pathIdx = d.indexOf('命途');
console.log('命途 pos', pathIdx);
// 找属性/命途/星级信息区的关键词
for (const kw of ['属性','命途','稀有度','星级','等级','4 星','5 星','4星','5星']) {
  const k = d.indexOf(kw);
  if (k > 0) console.log('['+kw+']@'+k+': '+d.slice(k-50,k+50).replace(/\s+/g,' '));
}
