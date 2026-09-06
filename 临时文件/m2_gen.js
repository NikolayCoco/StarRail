// M2 生成器 v2：读 char_batch1.tsv -> 写 HSR traits/builder/random/exist/loc（50名）
// 用法：node 临时文件/m2_gen.js   （--dry 只预览）
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
const DEFAULT_FACTION = 'AstralExpress'; // 阵营占位，M2 数据补全后精确

const lines = fs.readFileSync(path.join(TMP, 'char_batch1.tsv'), 'utf8').split(/\r?\n/).filter(l => l.trim() && !l.trim().startsWith('#'));
const header = lines[0].split('\t');
const rows = lines.slice(1).map(l => l.split('\t')).map(r => Object.fromEntries(header.map((h, i) => [h, (i < r.length ? r[i] : '').trim()])));

const PROF_LEAD = {
  '毁灭':'army_infantry_power = 0.1','巡猎':'army_artillery_power = 0.1','智识':'research_speed_modifier = 0.05',
  '同谐':'land_morale_modifier = 0.05','虚无':'land_morale_recovery = 0.05','存护':'global_defensive = 0.15',
  '丰饶':'regiment_reinforcement_speed = 0.15','记忆':'army_movement_speed = 0.1','欢愉':'siege_ability = 0.1',
  '开拓':'colonial_range_modifier = 0.2','均衡':'diplomatic_reputation = 1','神秘':'spy_network_construction = 0.1',
  '繁育':'global_manpower_modifier = 0.1','贪饕':'available_province_loot = 0.2','终末':'land_morale_modifier = 0.1',
  '不朽':'army_infantry_power = 0.1','秩序':'global_defensive = 0.1','纯美':'diplomatic_reputation = 1',
};

function camel(en){ return en.charAt(0).toUpperCase()+en.slice(1); }

function buildABuf(){
  let tf = '# ======== 角色身份特质（category = cabinet）——M2 生成 ========\n';
  let lf = '# ======== 角色将领特质（category = general）——M2 生成 ========\n';
  let bf = '# ======== 出身阵营标签特质（category = ruler）——M2 生成 ========\n';
  let builder = '', random = '', exist = '';
  let locZh = [], locEn = [];
  const seenFaction = new Set();

  const namesEn = {}; // name -> en(暂用 name)

  for (const r of rows){
    const code = r.code, name = r.name;
    const pathEn = r.path, elemZh = r.element;
    if (!pathEn || !elemZh){ console.log('! 缺 path/element，跳过: '+name); continue; }
    const rel = PATH_REL[pathEn];
    const elemTrait = ELEM_TRAIT[elemZh];
    const star = Number(r.rarity);
    if (!rel || !elemTrait){ console.log('! 未知映射，跳过: '+name+' path='+pathEn+' elem='+elemZh); continue; }

    tf += `HSR_${code}_01_trait = {\n\tcategory = cabinet\n\tallow = { always = yes }\n\tmodifier = {\n\t\tcharacter_cabinet_efficiency = 0.05\n\t}\n}\n`;
    lf += `HSR_${code}_01_trait_leader = {\n\tcategory = general\n\tallow = { always = yes }\n\tmodifier = {\n\t\t${PROF_LEAD[pathEn] || 'land_morale_modifier = 0.05'}\n\t}\n}\n`;

    builder += `HSR_create_character_${code} = {\n\tHSR_create_character = {\n\t\tcode = ${code}\n\t\treligion = ${rel}_Worship\n\t\tculture_key = astral_culture\n\t\tnameF = nameF_${code}\n\t\tnameL = nameL_${DEFAULT_FACTION}\n\t\tage = 20\n\t\timmortal = no\n\t\telement = ${elemTrait}\n\t\tbelong = ${DEFAULT_FACTION}\n\t\tfemale_bool = yes\n\t\tability_level = ${abilityOf(star)}\n\t}\n}\n`;
    random += `\t\t\t1 = {\n\t\t\t\ttrigger = { NOT = { any_in_global_list = { variable = HSR_characters_created_list has_trait = HSR_${code}_01_trait_leader } } }\n\t\t\t\tHSR_create_character_${code} = yes\n\t\t\t}\n`;
    exist += `\t\t\tNOT = { any_in_global_list = { variable = HSR_characters_created_list has_trait = HSR_${code}_01_trait_leader } }\n`;

    const en = name;
    locZh.push(` nameF_${code}: "${name}"`);
    locZh.push(` HSR_${code}_01_trait: "${name}"`);
    locZh.push(` desc_HSR_${code}_01_trait: "${name}，${star}星${pathEn}角色。"`);
    locZh.push(` HSR_${code}_01_trait_leader: "${name}"`);
    locZh.push(` desc_HSR_${code}_01_trait_leader: "${name}可作为将领统率军队。"`);
    locEn.push(` nameF_${code}: "${en}"`);
    locEn.push(` HSR_${code}_01_trait: "${en}"`);
    locEn.push(` desc_HSR_${code}_01_trait: "${en}, a ${star}-star ${pathEn} character."`);
    locEn.push(` HSR_${code}_01_trait_leader: "${en}"`);
    locEn.push(` desc_HSR_${code}_01_trait_leader: "${en} may lead armies as a general."`);
  }

  // belong trait 生成
  bf += `HSR_belong_${DEFAULT_FACTION}_trait = {\n\tcategory = ruler\n\tallow = { HSR_trailblazer_trigger = yes }\n\tmodifier = {\n\t\tcharacter_cabinet_efficiency = 0.01\n\t}\n}\n`;

  const randomFull = `# ================= 随机抽取（M2：${rows.length} 名自机角色等权） =================\nHSR_create_character_random = {\n    custom_tooltip = {\n        text = HSR_create_character_random_tooltip\n        random_list = {\n${random}\n        }\n    }\n}\n`;
  const existFull = `# 存在尚未被招募的角色\nHSR_exist_operator = {\n    custom_tooltip = {\n        text = HSR_exist_operator_tooltip\n        OR = {\n${exist}\n        }\n    }\n}\n`;

  const BOM = Buffer.from([0xEF,0xBB,0xBF]);
  const w = (p,s,isYml)=>fs.writeFileSync(path.join(MOD,p), isYml?Buffer.concat([BOM,Buffer.from(s,'utf8')]):Buffer.from(s,'utf8'));

  w('in_game/common/traits/HSR_operators_traits.txt', tf);
  w('in_game/common/traits/HSR_operators_traits_leader.txt', lf);
  w('in_game/common/traits/HSR_belong_traits.txt', bf);
  w('in_game/common/scripted_effects/HSR_operators.txt', builder + '\n' + randomFull);
  w('in_game/common/scripted_triggers/HSR_exist_operators.txt', existFull);
  w('main_menu/localization/simp_chinese/HSR_operators_l_simp_chinese.yml', 'l_simp_chinese:\n' + locZh.sort().join('\n') + '\n', true);
  w('main_menu/localization/english/HSR_operators_l_english.yml', 'l_english:\n' + locEn.sort().join('\n') + '\n', true);

  console.log('生成完成。角色数:', rows.length);
  console.log('触发链引用检查: random entries =', (random.match(/HSR_create_character_/g)||[]).length, 'exist OR =', (exist.match(/any_in_global_list/g)||[]).length);
  console.log('loc zh =', locZh.length, ' en =', locEn.length);
}

const args = new Set(process.argv.slice(2));
if (args.has('--dry')){
  for (const r of rows){
    const c = r.code||'(NOCODE)';
    console.log(c.padEnd(24), (r.name||'').padEnd(16), (r.path||'').padEnd(4), (r.element||'').padEnd(4), '星'+r.rarity);
  }
  console.log('预览，未写文件。行数:', rows.length);
} else {
  buildABuf();
}
