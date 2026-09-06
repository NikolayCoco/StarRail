// 在详情页找角色全身立绘 URL（H1/角色名 附近的 background-image 或 img）
const fs = require('fs');
const id = process.argv[2] || 'acheron';
const d = fs.readFileSync('临时文件/srs_pages/' + id + '.html', 'utf8');

// 找所有 webp url，带上下文
const urls = [...new Set([...d.matchAll(/url\(([^)]+\.webp)\)/g)].map(m => m[1]))];
console.log('去重 webp url 数:', urls.length);
urls.slice(0, 20).forEach((u, i) => console.log(i, u));

// 找 H1(角色名) 附近的 background-image（角色立绘通常在角色名区块）
const h1m = d.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
const h1i = h1m ? h1m.index : -1;
console.log('H1 idx', h1i);
if (h1i > 0) {
  console.log('--- H1 前 800 chars ---');
  console.log(d.slice(h1i - 800, h1i + 40).replace(/\s+/g, ' ').slice(0, 900));
}
