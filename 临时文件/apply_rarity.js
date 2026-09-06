// 按用户给定的四星名单，给 srs_full.json 每角色加 rarity（四星=4，其余=5）
const fs = require('fs');
const path = require('path');

const fourStarIds = new Set([
  'mar7th','danheng','arlan','asta','herta','serval','natasha','pela','sampo','hook',
  'qingque','tingyun','sushang','yukong','luka','lynx','guinaifen','hanya','xueyi',
  'misha','gallagher','mar7th2','moze',
]);

const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));
let four = 0, five = 0, unknown = 0;
for (const r of full) {
  if (fourStarIds.has(r.id)) { r.rarity = 4; four++; }
  else { r.rarity = 5; five++; }
}
fs.writeFileSync(path.join(__dirname, 'srs_full.json'), JSON.stringify(full, null, 2), 'utf8');
console.log('角色总数:', full.length, ' 四星:', four, ' 五星:', five);
// 验证某个
const march = full.find(r => r.id === 'mar7th');
console.log('mar7th 三月七·存护 rarity:', march.rarity);
