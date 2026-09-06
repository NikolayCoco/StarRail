// 批量提取每个角色的「初次见面」+「回合开始」语音文案 -> voice_lines.json
const fs = require('fs');
const path = require('path');

const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));

function extract(id) {
  const fp = path.join(__dirname, 'srs_pages', id + '.html');
  if (!fs.existsSync(fp)) return null;
  const d = fs.readFileSync(fp, 'utf8');
  const i = d.indexOf('"voiceItems"');
  if (i < 0) return null;
  const re = /\{"id":(\d+),"title":"([^"]*)","text":"([\s\S]*?)","unlockRequirement"/g;
  let m; const items = [];
  while ((m = re.exec(d))) items.push({ title: m[2], text: m[3] });
  // unescape \n
  for (const it of items) it.text = it.text.replace(/\\n/g, '\n');
  const first = items.find(x => x.title.includes('初次见面'));
  const turn = items.find(x => x.title.includes('回合开始'));
  return { first: first ? first.text : '', turn: turn ? turn.text : '' };
}

const out = {};
let ok = 0, miss = 0;
for (const r of full) {
  const id = r.id;
  const v = extract(id);
  if (v && (v.first || v.turn)) { out[id] = v; ok++; }
  else { miss++; console.log('缺语音: ' + id); }
}
fs.writeFileSync(path.join(__dirname, 'voice_lines.json'), JSON.stringify(out, null, 2), 'utf8');
console.log('提取语音角色:', ok, ' 缺:', miss);
