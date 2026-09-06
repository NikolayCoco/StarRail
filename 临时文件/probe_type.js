// 找技能对象的结构：type/key 字段（识别终结技）
const fs = require('fs');
const path = require('path');
const id = process.argv[2] || 'robinsummeretto';
const d = fs.readFileSync(path.join(__dirname, 'srs_pages', id + '.html'), 'utf8');
// 找所有含 "name" 且附近有 "type" 或 "key" 的对象
// 更简单：找 "skillType" / "\"type\"":\" 模式
const keyRe = /"type"\s*:\s*"([^"]+)"/g;
let m; const types = [];
while ((m = keyRe.exec(d)) && types.length < 20) types.push(m[1]);
console.log('出现的 type 值:', [...new Set(types)]);
// 找 "key":" 值（技能 key 通常含 type 标识）
const key2 = /"key"\s*:\s*"([^"]+)"/g;
let m2; const keys = [];
while ((m2 = key2.exec(d)) && keys.length < 20) keys.push(m2[1]);
console.log('出现的 key 值:', [...new Set(keys)]);
