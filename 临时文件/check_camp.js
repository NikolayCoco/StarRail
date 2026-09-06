const fs = require('fs');
const full = JSON.parse(fs.readFileSync('临时文件/srs_full.json', 'utf8'));
const bad = [];
for (const r of full) {
  const c = r.camp || '';
  // 检查是否含控制字符/空字节/非正常空格
  if (/[\u0000-\u001f\u007f]/.test(c)) bad.push([r.id, r.name, JSON.stringify(c)]);
  // 也看这个 罗浮 的空格变体
  if (c.includes('罗') && c.length > 6) bad.push([r.id, r.name, '罗浮变体: '+JSON.stringify(c)]);
}
console.log('异常 camp 数量:', bad.length);
bad.forEach(b => console.log(b.join(' | ')));
