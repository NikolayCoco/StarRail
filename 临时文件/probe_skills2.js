// 提取所有技能对象的 name，并判断哪个是终结技（含 ultimateCost 特征）
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
// 找技能对象：基于 "name":"..." 且周围有 "id": 数字 的模式
// 先找所有 "id":数字,"...name":"X" 组合
const re = /"id"?:(\d+),"type":"Skill"[^}]*?"name":"([^"]+)"/g;
let m; const skills = [];
while ((m = re.exec(d)) && skills.length < 30) skills.push(m[2]);
console.log('type=Skill 的技能名:', [...new Set(skills)]);
// 也可能 id 在前
const re2 = /"id":(\d+),"name":"([^"]+)"/g;
let m2; const s2 = [];
while ((m2 = re2.exec(d)) && s2.length < 40) s2.push(m2[2]);
console.log('id+name 组合出现的 name:', [...new Set(s2)]);
