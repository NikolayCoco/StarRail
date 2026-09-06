// 定位详情页角色立绘 URL 的确切上下文
const fs = require('fs');
const id = process.argv[2] || 'acheron';
const d = fs.readFileSync('临时文件/srs_pages/' + id + '.html', 'utf8');
// 找 0483ee4a 这个已知立绘 url 的上下文
const target = '0483ee4a';
const i = d.indexOf(target);
console.log('target pos', i);
if (i > 0) {
  console.log('== 前 300 ==');
  console.log(d.slice(i - 300, i + 100).replace(/\s+/g, ' '));
}
// 列出所有 cdn .webp url 的位置(带字符索引)
const re = /https:\/\/cdn\.starrailstation\.com\/assets\/[a-f0-9]+\.webp/g;
let m; let k = 0;
while ((m = re.exec(d)) && k < 12) {
  console.log(k++, '@'+m.index, m[0].slice(-40));
}
