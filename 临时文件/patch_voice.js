// 补 mar7th2 语音 = mar7th(同角色) 语音；并输出最终 voice_lines.json
const fs = require('fs');
const path = require('path');
const v = JSON.parse(fs.readFileSync(path.join(__dirname, 'voice_lines.json'), 'utf8'));
if (!v['mar7th2']) {
  if (v['mar7th']) { v['mar7th2'] = v['mar7th']; console.log('mar7th2 复用 mar7th 语音'); }
  else { console.log('mar7th 也无语音!'); }
}
fs.writeFileSync(path.join(__dirname, 'voice_lines.json'), JSON.stringify(v, null, 2), 'utf8');
console.log('最终语音角色数:', Object.keys(v).length);
// 显示前3个
Object.keys(v).slice(0, 3).forEach(id => console.log(id, '初次见面:', (v[id].first||'').slice(0,50)));
