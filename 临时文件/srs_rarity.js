// 在详情页找角色星级(rarity)字段
const fs = require('fs');
const id = process.argv[2] || 'aventurinewaveflair';
const d = fs.readFileSync('临时文件/srs_pages/' + id + '.html', 'utf8');
const re = /rarity\"?\s*:\s*(\d+)/g; let m; const vals = [];
while ((m = re.exec(d))) vals.push(Number(m[1]));
console.log('all rarity nums:', vals);
// 找 4星/5星 文本
const starTxt = d.match(/[1-5]\s*星/g);
console.log('星文本:', starTxt ? [...new Set(starTxt)] : '无');
// 找角色数据库对象里的星级（通常在 "character" 或 inventory 数据）
const c = d.indexOf('"character"');
console.log('character key pos:', c);
if (c > 0) console.log('around character:', d.slice(c, c + 200).replace(/\s+/g, ' '));
