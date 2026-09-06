// M2 最终生成器：读 srs_full.json(97名) + srs_en_names.json(英文名) -> 生成全部 traits/builder/random/exist/loc
const fs = require('fs');
const path = require('path');

const TMP = __dirname;
const MOD = path.join(__dirname, '..');

const full = JSON.parse(fs.readFileSync(path.join(TMP, 'srs_full.json'), 'utf8'));
const enNames = JSON.parse(fs.readFileSync(path.join(TMP, 'srs_en_names.json'), 'utf8'));
const voice = JSON.parse(fs.readFileSync(path.join(TMP, 'voice_lines.json'), 'utf8'));
const talents = JSON.parse(fs.readFileSync(path.join(TMP, 'talent_names.json'), 'utf8'));

// 命途 -> 宗教 id
const PATH_REL = {
  '毁灭':'Destruction','巡猎':'Hunt','智识':'Erudition','同谐':'Harmony','虚无':'Nihility',
  '存护':'Preservation','丰饶':'Abundance','记忆':'Remembrance','欢愉':'Elation',
  '开拓':'Trailblaze','均衡':'Equilibrium','神秘':'Enigmata','繁育':'Propagation',
  '贪饕':'Voracity','终末':'Finality','不朽':'Permanence','秩序':'Order','纯美':'Beauty',
};
// 属性 -> trait 后缀
const ELEM_TRAIT = {
  '物理':'physical','火':'fire','冰':'ice','雷':'lightning','风':'wind','量子':'quantum','虚数':'imaginary'
};
// 命途 -> 将领修正
const PATH_LEAD = {
  '毁灭':'army_infantry_power = 0.1','巡猎':'army_artillery_power = 0.1','智识':'research_speed_modifier = 0.05',
  '同谐':'land_morale_modifier = 0.05','虚无':'land_morale_recovery = 0.05','存护':'global_defensive = 0.15',
  '丰饶':'regiment_reinforcement_speed = 0.15','记忆':'army_movement_speed = 0.1','欢愉':'siege_ability = 0.1',
  '开拓':'colonial_range_modifier = 0.2','均衡':'diplomatic_reputation = 1','神秘':'spy_network_construction = 0.1',
  '繁育':'global_manpower_modifier = 0.1','贪饕':'available_province_loot = 0.2','终末':'land_morale_modifier = 0.1',
  '不朽':'army_infantry_power = 0.1','秩序':'global_defensive = 0.1','纯美':'diplomatic_reputation = 1',
};
// 星级 -> 能力
function abilityOf(star){ return {5:95,4:85,3:75}[star] || 85; }
// 阵营 -> [belong code, 英文名]
const CAMP_LOC = {
  '星穹列车':['AstralExpress','Astral Express'],'匹诺康尼':['Penacony','Penacony'],
  '星核猎手':['StellaronHunter','Stellaron Hunters'],'星际和平公司':['IPC','Interastral Peace Corporation'],
  '贝洛伯格':['Belobog','Belobog'],'仙舟「罗浮」':['XianzhouLuofu','The Xianzhou Luofu'],
  '仙舟「曜青」':['XianzhouYaoqing','The Xianzhou Yaoqing'],'仙舟「玉阙」':['XianzhouYuque','The Xianzhou Yuque'],
  '仙舟「朱明」':['XianzhouZhuming','The Xianzhou Zhuming'],'空间站「黑塔」':['HertaSpaceStation','Herta Space Station'],
  '翁法罗斯':['Amphoreus','Amphoreus'],'异界':['OtherWorld','Other World'],
  '巡海游侠':['GalaxyRanger','Galaxy Rangers'],'假面愚者':['MaskedFools','Masked Fools'],
  '博识学会':['IntelligentsiaGuild','Intelligentsia Guild'],'纯美骑士团':['KnightsOfBeauty','Knights of Beauty'],
  '焚化工':['FallenEmber','Fallen Ember'],'流光忆庭':['GardenOfRecollection','Garden of Recollection'],
  '二相乐园':['DualityPark','Duality Park'],'未分类':['Unknown','Unknown'],
};

let traits = '# ======== 角色身份特质（category = cabinet）——M2 生成 ' + full.length + ' 名 ========\n';
let leaders = '# ======== 角色将领特质（category = general）——M2 生成 ========\n';
let belBu = '# ======== 出身阵营标签特质（category = ruler）——M2 生成 ========\n';
let builder = '', random = '', exist = '';
let locZh = {}, locEn = {};

// 阵营 belong trait + loc
const campKeys = new Set();
for (const r of full) if (r.camp) campKeys.add(r.camp);
for (const camp of campKeys) {
  const [code, en] = CAMP_LOC[camp] || ['Unknown','Unknown'];
  belBu += `HSR_belong_${code}_trait = {\n\tcategory = ruler\n\tallow = { HSR_trailblazer_trigger = yes }\n\tmodifier = {\n\t\tcharacter_cabinet_efficiency = 0.01\n\t}\n}\n`;
  locZh['HSR_belong_' + code + '_trait'] = camp;
  locZh['desc_HSR_belong_' + code + '_trait'] = '来自' + camp + '的角色。';
  locEn['HSR_belong_' + code + '_trait'] = en;
  locEn['desc_HSR_belong_' + code + '_trait'] = 'A character hailing from ' + en + '.';
  locEn['nameL_' + code] = en;
  locZh['nameL_' + code] = camp;
}

let count = 0;
for (const r of full) {
  const id = r.id, name = r.name, pathZh = r.path, elemZh = r.elem, star = Number(r.rarity), camp = r.camp || '未分类';
  if (!pathZh || !elemZh) { console.log('! 缺 path/element 跳过 ' + id); continue; }
  const rel = PATH_REL[pathZh];
  const eleTrait = ELEM_TRAIT[elemZh];
  const [belongCode] = CAMP_LOC[camp] || ['Unknown'];
  const enName = enNames[id] || name;
  if (!rel || !eleTrait) { console.log('! 未知映射 ' + id); continue; }

  traits += `HSR_${id}_01_trait = {\n\tcategory = cabinet\n\tallow = { always = yes }\n\tmodifier = {\n\t\tcharacter_cabinet_efficiency = 0.05\n\t}\n}\n`;
  const leadMod = PATH_LEAD[pathZh] || 'land_morale_modifier = 0.05';
  leaders += `HSR_${id}_01_trait_leader = {\n\tcategory = general\n\tallow = { always = yes }\n\tmodifier = {\n\t\t${leadMod}\n\t}\n}\n`;

  builder += `HSR_create_character_${id} = {\n\tHSR_create_character = {\n\t\tcode = ${id}\n\t\treligion = ${rel}_Worship\n\t\tculture_key = astral_culture\n\t\tnameF = nameF_${id}\n\t\tnameL = nameL_${belongCode}\n\t\tage = 20\n\t\timmortal = no\n\t\telement = ${eleTrait}\n\t\tbelong = ${belongCode}\n\t\tfemale_bool = no\n\t\tability_level = ${abilityOf(star)}\n\t}\n}\n`;
  random += `\t\t\t1 = {\n\t\t\t\ttrigger = { NOT = { any_in_global_list = { variable = HSR_characters_created_list has_trait = HSR_${id}_01_trait_leader } } }\n\t\t\t\tHSR_create_character_${id} = yes\n\t\t\t}\n`;
  exist += `\t\t\tNOT = { any_in_global_list = { variable = HSR_characters_created_list has_trait = HSR_${id}_01_trait_leader } }\n`;

  locZh['nameF_' + id] = name;
  locZh['HSR_' + id + '_01_trait'] = name;
  locZh['HSR_' + id + '_01_trait_leader'] = talents[id] || name;  // 战斗trait名=天赋名
  locZh['desc_HSR_' + id + '_01_trait'] = (voice[id] && voice[id].first) ? voice[id].first : `${name}，${star}星${pathZh}角色，隶属${camp}。`;
  locZh['desc_HSR_' + id + '_01_trait_leader'] = (voice[id] && voice[id].turn) ? voice[id].turn : `${name}可作为将领统率军队。`;
  locEn['nameF_' + id] = enName;
  locEn['HSR_' + id + '_01_trait'] = enName;
  locEn['HSR_' + id + '_01_trait_leader'] = talents[id] || name;  // 天赋名(中文)
  locEn['desc_HSR_' + id + '_01_trait'] = (voice[id] && voice[id].first) ? voice[id].first : `${enName}, a ${star}-star ${pathZh} character of ${CAMP_LOC[camp]?.[1] || camp}.`;
  locEn['desc_HSR_' + id + '_01_trait_leader'] = (voice[id] && voice[id].turn) ? voice[id].turn : `${enName} may lead armies as a general.`;
  count++;
}

const randomFull = `# ================= 随机抽取（M2：${count} 名自机角色等权） =================\nHSR_create_character_random = {\n    custom_tooltip = {\n        text = HSR_create_character_random_tooltip\n        random_list = {\n${random}\n        }\n    }\n}\n`;
const existFull = `# 存在尚未被招募的角色\nHSR_exist_operator = {\n    custom_tooltip = {\n        text = HSR_exist_operator_tooltip\n        OR = {\n${exist}\n        }\n    }\n}\n`;

const BOM = Buffer.from([0xEF,0xBB,0xBF]);
const w = (p,s,isYml)=>fs.writeFileSync(path.join(MOD,p), isYml?Buffer.concat([BOM,Buffer.from(s,'utf8')]):Buffer.from(s,'utf8'));

w('in_game/common/traits/HSR_operators_traits.txt', traits);
w('in_game/common/traits/HSR_operators_traits_leader.txt', leaders);
w('in_game/common/traits/HSR_belong_traits.txt', belBu);
w('in_game/common/scripted_effects/HSR_operators.txt', builder + '\n' + randomFull);
w('in_game/common/scripted_triggers/HSR_exist_operators.txt', existFull);

const sortZh = Object.keys(locZh).sort().map(k => ` ${k}: "${locZh[k]}"`).join('\n');
const sortEn = Object.keys(locEn).sort().map(k => ` ${k}: "${locEn[k]}"`).join('\n');
w('main_menu/localization/simp_chinese/HSR_operators_l_simp_chinese.yml', 'l_simp_chinese:\n' + sortZh + '\n', true);
w('main_menu/localization/english/HSR_operators_l_english.yml', 'l_english:\n' + sortEn + '\n', true);

console.log('生成角色数:', count, '/', full.length);
console.log('random entries =', (random.match(/HSR_create_character_/g)||[]).length, ' exist OR =', (exist.match(/any_in_global_list/g)||[]).length);
console.log('loc zh =', Object.keys(locZh).length, ' en =', Object.keys(locEn).length);
