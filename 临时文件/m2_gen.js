// M2 生成器：读 char_batch1.tsv -> 产出 HSR traits/builder/random/exist/loc
// 列：code  name  path  element  rarity
// 现在 -> --dry 只打印预览；不带参数则全量生成。
const fs = require('fs');
const path = require('path');

const TMP = __dirname;
const MOD = path.join(__dirname, '..');

const PATH_REL = {
  '毁灭':'Destruction','巡猎':'Hunt','智识':'Erudition','同谐':'Harmony','虚无':'Nihility',
  '存护':'Preservation','丰饶':'Abundance','记忆':'Remembrance','欢愉':'Elation',
  '开拓':'Trailblaze','均衡':'Equilibrium','神秘':'Enigmata','繁育':'Propagation',
  '贪饕':'Voracity','终末':'Finality','不朽':'Permanence','秩序':'Order','纯美':'Beauty',
};
const ELEM_TRAIT = {
  '物理':'physical','火':'fire','冰':'ice','雷':'lightning','风':'wind','量子':'quantum','虚数':'imaginary'
};
function abilityOf(star){ return {5:95,4:85,3:75,2:65,1:55}[star] || 85; }
const DEFAULT_FACTION = 'AstralExpress';

// 跳过 # 注释行，第一个非 # 行为 header
const lines = fs.readFileSync(path.join(TMP, 'char_batch1.tsv'), 'utf8').split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
const header = lines[0].split('\t');
const hIdx = Object.fromEntries(header.map((h, i) => [h, i]));
const rows = lines.slice(1).map(l => l.split('\t')).map(r => Object.fromEntries(header.map((h, i) => [h, (i < r.length ? r[i] : '').trim()])));

function codeOf(r){ return r.code; }
function pathRel(r){ return PATH_REL[r.path]; }
function elemTrait(r){ return ELEM_TRAIT[r.element]; }
function ability(r){ return abilityOf(Number(r.rarity)); }

function preview(r){
  const c=codeOf(r), pr=pathRel(r), et=elemTrait(r);
  return {
    code:c, name:r.name, path:r.path||'(?)', rel:pr, element:r.element, elemTrait:et,
    rarity:r.rarity, ability:ability(r), faction:DEFAULT_FACTION,
    trait: 'HSR_'+c+'_01_trait', leader: 'HSR_'+c+'_01_trait_leader',
    belong: 'HSR_belong_'+DEFAULT_FACTION+'_trait', builder: 'HSR_create_character_'+c,
  };
}

function gen(previewOnly){
  const out = previewOnly ? [] : {
    traits:'', leader:'', belong:'', builder:'', random:'', exist:'',
    locZh:'', locEn:'', ageBuf:'',
  };
  let cs = '';
  for (const r of rows){
    const p = preview(r);
    const c = p.code || '(NOCODE)';
    console.log(c.padEnd(24), (p.name||'').padEnd(16), (p.path||'').padEnd(4), (p.element||'').padEnd(4), '星'+p.rarity, 'ability='+p.ability);
    if (!p.path || !p.element){ console.log('   !! 缺 path/element，跳过'); continue; }
    const cc = p.code;
    // trait
    cs += `HSR_${cc}_01_trait = {\n\tcategory = cabinet\n\tallow = { always = yes }\n\tmodifier = {\n\t\tcharacter_cabinet_efficiency = 0.05\n\t}\n}\n`;
  }
  console.log('---');
  console.log('生成条数(每角色):', rows.length);
  if (previewOnly){ return; }
}

const args = new Set(process.argv.slice(2));
gen(args.has('--dry'));
