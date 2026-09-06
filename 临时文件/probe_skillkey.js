// 找技能槽位 key（ult/talent/skill/basic）及其 name
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
// 搜 "ult" / "talent" / "skill" / "basic" / "technique" 作为 JSON key (带冒号)
const re = /"(ult|talent|skill|basic|technique|ultName|skillName)"\s*:/g;
let m; const keys = [];
while ((m = re.exec(d)) && keys.length < 20) keys.push(m[1] + '@' + m.index);
console.log('技能槽key:', keys);
// 搜 "type":"Ult" 或类似 SkillType
const sk = /"SkillType"\s*:\s*"([^"]+)"/g;
let m2; const skt = [];
while ((m2 = sk.exec(d)) && skt.length < 20) skt.push(m2[1]);
console.log('SkillType:', [...new Set(skt)]);
