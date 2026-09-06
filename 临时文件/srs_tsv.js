// 把 srs_roster.json 规范化成 char_roster_srs.tsv（code/name/path/element）
// 处理形态：主角 5 形态（boy/girl 合并）、三月七 3 形态、形态后缀命名
const fs = require('fs');
const path = require('path');

const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_roster.json'), 'utf8'));

const PATH_ZH = { '毁灭':'Destruction','巡猎':'Hunt','智识':'Erudition','同谐':'Harmony','虚无':'Nihility','存护':'Preservation','丰饶':'Abundance','记忆':'Remembrance','欢愉':'Elation','开拓':'Trailblaze','均衡':'Equilibrium','神秘':'Enigmata','繁育':'Propagation','贪饕':'Voracity','终末':'Finality','不朽':'Permanence','秩序':'Order','纯美':'Beauty' };
const ELEM_ZH = { '物理':'physical','火':'fire','冰':'ice','雷':'lightning','风':'wind','量子':'quantum','虚数':'imaginary' };

// 形态后缀映射：按 id 尾缀
function formSuffix(id, name){
  const m = id.match(/(\d+)$/);
  const n = m ? Number(m[1]) : 0;
  const pathName = name; // 用于区分
  return n;
}

// 主角/三月七形态名称修正：name 里有中文后缀（•XXX），或需要从 path 区分
function normName(id, name, pathZh){
  // 主角形态：playerboy/playergirl 系列 无中文后缀，用 path 区分
  if (/^player(boy|girl)\d*$/.test(id)) {
    const base = '开拓者';
    const tag = { '毁灭':'•毁灭','存护':'•存护','同谐':'•同谐','记忆':'•记忆','欢愉':'•欢愉' }[pathZh] || '';
    return base + tag;
  }
  // 三月七：mar7th(存护)/mar7th2(巡猎) —— 用 path 区分
  if (/^mar7th\w*$/.test(id)) {
    const tag = { '存护':'•存护','巡猎':'•巡猎' }[pathZh] || '';
    return '三月七' + tag;
  }
  if (name) return name;
  return id; // silverwolflv999 等缺中文
}

// 去重：boy/girl 合并（同形态只保留一个 code）
const seen = new Set();
const rows = [];
for (const c of list) {
  // 主角：合并 boy/girl -> 用 boy 表示该形态
  let code = c.id;
  let isTraitBoy = /^player(girl)\d*$/.test(c.id);
  if (isTraitBoy) continue; // 用 playerboy 系列代表
  if (/^playergirl$/.test(c.id)) continue; // 已由 playerboy 代表
  // 三月七 mar7th2 保留（巡猎），mar7th 保留（存护）
  const name = normName(c.id, c.name, c.path);
  const pathEn = PATH_ZH[c.path] || c.path;
  const elemEn = ELEM_ZH[c.elem] || c.elem;
  rows.push({ code, name, path: c.path, pathEn, elem: c.elem, elemEn });
}

// 落盘 TSV
const header = ['code','name','path','element'];
const tsv = [header.join('\t'), ...rows.map(r => [r.code, r.name, r.path, r.elem].join('\t'))].join('\n');
fs.writeFileSync(path.join(__dirname, 'char_roster_srs.tsv'), tsv, 'utf8');
console.log('rows:', rows.length);
rows.forEach(r => console.log([r.code, r.name, r.path, r.elem].join('\t')));
