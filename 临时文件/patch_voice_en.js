// 补 voice_lines_en 的 mar7th2（复用 mar7th）
const fs = require('fs');
const path = require('path');
const v = JSON.parse(fs.readFileSync(path.join(__dirname, 'voice_lines_en.json'), 'utf8'));
if (!v['mar7th2'] && v['mar7th']) { v['mar7th2'] = v['mar7th']; console.log('mar7th2 复用 mar7th 英文语音'); }
fs.writeFileSync(path.join(__dirname, 'voice_lines_en.json'), JSON.stringify(v, null, 2), 'utf8');
console.log('英文语音角色数:', Object.keys(v).length);
