// 交叉核验 M2 生成的一致性
const fs = require('fs');
const path = require('path');
const read = (p) => fs.readFileSync(path.join(__dirname, '..', ...p.split('/')), 'utf8');

const operators = read('in_game/common/scripted_effects/HSR_operators.txt');
const traits = read('in_game/common/traits/HSR_operators_traits.txt');
const leaders = read('in_game/common/traits/HSR_operators_traits_leader.txt');
const belongs = read('in_game/common/traits/HSR_belong_traits.txt');
const exist = read('in_game/common/scripted_triggers/HSR_exist_operators.txt');
const zh = read('main_menu/localization/simp_chinese/HSR_operators_l_simp_chinese.yml');
const cnFile = read('in_game/common/scripted_effects/HSR_create_character.txt');

// 1. builder code 列表(排除 random)
const codes = [...new Set([...operators.matchAll(/HSR_create_character_(\w+) = \{/g)].map(m => m[1]).filter(c => c !== 'random'))];
let miss = [];
for (const c of codes) {
  if (!new RegExp('HSR_' + c + '_01_trait = \\{').test(traits)) miss.push(c + ':trait');
  if (!new RegExp('HSR_' + c + '_01_trait_leader = \\{').test(leaders)) miss.push(c + ':leader');
  if (!exist.includes('HSR_' + c + '_01_trait_leader }')) miss.push(c + ':exist');
  if (!zh.includes('nameF_' + c + ':')) miss.push(c + ':nameF');
}
console.log('角色数:', codes.length);
console.log('trait/leader/exist/nameF 缺失:', miss.length ? miss : '无');

// 2. belong trait 集 + loc
const belongCodes = [...new Set([...belongs.matchAll(/HSR_belong_(\w+)_trait = \{/g)].map(m => m[1]))];
let missB = [];
for (const b of belongCodes) {
  if (!zh.includes('nameL_' + b + ':')) missB.push(b + ':nameL');
  if (!zh.includes('HSR_belong_' + b + '_trait:')) missB.push(b + ':belongloc');
}
console.log('阵营 belong 数:', belongCodes.length);
console.log('belong loc 缺失:', missB.length ? missB : '无');

// 3. builder 里属于的 belong 是否都有定义
const usedBelongs = [...new Set([...operators.matchAll(/belong = (\w+)/g)].map(m => m[1]))];
const missingBelong = usedBelongs.filter(b => !belongCodes.includes(b));
console.log('builder 用到的 belong:', usedBelongs.length, ' 未定义:', missingBelong.length ? missingBelong : '无');

// 4. builder 里 religion 是否有效(在 Aeons 宗教文件)
const aeons = read('in_game/common/religions/HSR_Aeons.txt');
const usedRels = [...new Set([...operators.matchAll(/religion = (\w+)_Worship/g)].map(m => m[1]))];
const missingRel = usedRels.filter(r => !aeons.includes(r + '_Worship ='));
console.log('builder 用到的宗教:', usedRels.length, ' 未定义:', missingRel.length ? missingRel : '无');

// 5. 元素 trait 是否定义
const hsrTrait = read('in_game/common/traits/HSR_trait.txt');
const usedElems = [...new Set([...operators.matchAll(/element = (\w+)/g)].map(m => m[1]))];
const missingElem = usedElems.filter(e => !hsrTrait.includes('HSR_' + e + '_trait ='));
console.log('用到的属性:', usedElems.length, ' 未定义 trait:', missingElem.length ? missingElem : '无');
