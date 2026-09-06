// 修复阵营细节 + 按阵营分类立绘（健壮版）
const fs = require('fs');
const path = require('path');

const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));

// 干净的阵营清理：移除控制字符/空字节/怪空格
function cleanCamp(c) {
  if (!c) return '';
  // 移除 null 和控制字符
  const cleaned = c.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\u3000/g, ' ').trim();
  return cleaned;
}

// 手动补阵营
const campOverrides = { 'mar7th2': '星穹列车' };
for (const r of full) {
  if (campOverrides[r.id]) r.camp = campOverrides[r.id];
  r.camp = cleanCamp(r.camp);
}
fs.writeFileSync(path.join(__dirname, 'srs_full.json'), JSON.stringify(full, null, 2), 'utf8');

// 分类立绘
const artDir = path.join(__dirname, '..', '美术资源_立绘');
let moved = 0, noFile = 0;
const camDirs = new Set();
for (const r of full) {
  const id = r.id;
  const camp = r.camp || '未分类';
  const src = path.join(artDir, id + '.webp');
  if (!fs.existsSync(src)) { noFile++; continue; }
  const ddir = path.join(artDir, camp);
  if (!fs.existsSync(ddir)) fs.mkdirSync(ddir, { recursive: true });
  camDirs.add(camp);
  fs.renameSync(src, path.join(ddir, id + '.webp'));
  moved++;
}
console.log('已分类立绘:', moved, ' 无文件:', noFile);
console.log('阵营文件夹数:', camDirs.size);
console.log('文件夹列表:');
console.log([...camDirs].sort().join(' | '));
