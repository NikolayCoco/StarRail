const fs = require('fs');
const full = JSON.parse(fs.readFileSync('临时文件/srs_full.json', 'utf8'));
for (const r of full) if (/mar7th/.test(r.id)) console.log('FULL:', r.id, r.name, 'camp=', JSON.stringify(r.camp));
// 直接搜 mar7th2 页面
const d = fs.readFileSync('临时文件/srs_pages/mar7th2.html', 'utf8');
const camp = d.match(/campaign/); // 占位避免误
const m = d.match(/camp<\/div><div class="[^"]+">([^<]+)<\/div>/); // 兼容
const m2 = d.match(/\u9635\u8425<\/div><div class="[^"]+">([^<]+)<\/div>/); // 阵营
console.log('mar7th2 page len:', d.length, 'camp匹配:', m2 ? m2[1] : '无');
