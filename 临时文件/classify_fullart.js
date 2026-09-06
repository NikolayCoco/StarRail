// 按阵营把全身立绘分类到 美术资源_立绘_全身/<阵营>/
const fs = require('fs');
const path = require('path');

const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));
const artDir = path.join(__dirname, '..', '美术资源_立绘_全身');

let moved = 0, noFile = 0;
const camDirs = new Set();
for (const r of full) {
  const id = r.id;
  const camp = (r.camp && r.camp.trim()) || '未分类';
  const src = path.join(artDir, id + '.webp');
  if (!fs.existsSync(src)) { noFile++; continue; }
  const ddir = path.join(artDir, camp);
  if (!fs.existsSync(ddir)) fs.mkdirSync(ddir, { recursive: true });
  camDirs.add(camp);
  fs.renameSync(src, path.join(ddir, id + '.webp'));
  moved++;
}
console.log('全身立绘已分类:', moved, ' 无文件:', noFile);
console.log('阵营文件夹数:', camDirs.size);
console.log([...camDirs].sort().join(' | '));
