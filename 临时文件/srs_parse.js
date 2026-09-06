// 解析已下载的详情页 srs_pages/<id>.html -> 星级/性别/阵营/中文名/简介 + 属性/命途
// 输出 srs_full.json（每个 id 一个完整记录）+ char_roster_srs.tsv（含新字段）
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'srs_pages');
const list = JSON.parse(fs.readFileSync(path.join(__dirname, 'srs_roster.json'), 'utf8'));

function parseFile(id) {
  const fp = path.join(DIR, id + '.html');
  if (!fs.existsSync(fp)) return null;
  const d = fs.readFileSync(fp, 'utf8');
  const res = { id };

  // 中文名：H1 或 <title>
  const h1 = d.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  res.name = h1 ? h1[1].replace(/<[^>]*>/g, '').trim().slice(0, 20) : '';

  // 阵营：阵营</div><div ...>XXX</div>
  const camp = d.match(/阵营<\/div><div class="[^"]+">([^<]+)<\/div>/);
  res.camp = camp ? camp[1].trim() : '';

  // 性别：性别</div>... 或 <div ...>性别</div><div class="[^"]+">(男|女)</div>
  const gender = d.match(/性别<\/div><div class="[^"]+">([^<]+)<\/div>/) || d.match(/性别[^<]{0,20}<div[^>]*>([男女])<\/div>/);
  res.gender = gender ? gender[1].trim() : '';

  // 简介：角色详情 ... <div>...</div>（角色详情 区块下的文本）
  const detail = d.match(/角色详情<\/div><div class="[^"]+">([\s\S]*?)<\/div><div class="a3fb4">/);
  res.desc = detail ? detail[1].replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').trim().slice(0, 300) : '';

  return res;
}

const full = [];
for (const c of list) {
  const r = parseFile(c.id);
  if (r && r.name) {
    r.path = c.path; r.elem = c.elem;
    full.push(r);
  }
}
fs.writeFileSync(path.join(__dirname, 'srs_full.json'), JSON.stringify(full, null, 2), 'utf8');
console.log('parsed:', full.length);
for (const r of full.slice(0, 8)) console.log([r.id, r.name, r.path, r.elem, r.camp, r.gender].join(' | '));
