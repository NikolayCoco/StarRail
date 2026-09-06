// 批量提取英文天赋名 + 英文初次见面/回合开始 -> talent_names_en.json / voice_lines_en.json
const fs = require('fs');
const path = require('path');
const full = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_full.json'), 'utf8'));

function readEn(id) {
  const fp = path.join(__dirname, 'srs_pages_en', id + '.html');
  return fs.existsSync(fp) ? fs.readFileSync(fp, 'utf8') : '';
}

function talentOf(d) {
  const namePos = [...d.matchAll(/"name":"([^"]+)"/g)];
  for (const nm of namePos) {
    if (d.slice(nm.index, nm.index + 200).includes('typeDescHash":"Talent')) return nm[1];
  }
  return '';
}

function voiceOf(d, titleKw) {
  const re = /\{"id":(\d+),"title":"([^"]*)","text":"([\s\S]*?)","unlockRequirement"/g;
  let m;
  while ((m = re.exec(d))) {
    if (m[2].includes(titleKw)) return m[3];
  }
  return '';
}

function clean(s) {
  if (!s) return s;
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/\uFFFD/g, ' ').replace(/\\n/g, ' ').replace(/[ \t]+/g, ' ').trim();
}

const talents = {}, voices = {};
let okT = 0, okV = 0;
for (const r of full) {
  const id = r.id;
  const d = readEn(id);
  const t = talentOf(d);
  if (t) { talents[id] = t; okT++; }
  const first = voiceOf(d, 'First Meeting');
  const turn = voiceOf(d, 'Turn Begins 1') || voiceOf(d, 'Turn Begins');
  if (first || turn) { voices[id] = { first: clean(first), turn: clean(turn) }; okV++; }
}
fs.writeFileSync(path.join(__dirname, 'talent_names_en.json'), JSON.stringify(talents, null, 2), 'utf8');
fs.writeFileSync(path.join(__dirname, 'voice_lines_en.json'), JSON.stringify(voices, null, 2), 'utf8');
console.log('英文天赋名:', okT, '/', full.length, ' 英文语音:', okV, '/', full.length);
// 抽查
if (talents['robinsummeretto']) console.log('robinsummeretto talent-en=', talents['robinsummeretto']);
if (voices['robinsummeretto']) console.log('robinsummeretto voice-en=', JSON.stringify(voices['robinsummeretto']).slice(0,110));
