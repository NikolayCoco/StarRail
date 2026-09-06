// M2 抓取器 v2：SMW 翻页用 query-continue-offset，加重试与延迟
// 输出：临时文件/char_data_raw.json（留档）+ char_roster.tsv（简表）
const https = require('https');
const fs = require('fs');
const path = require('path');

const TMP = __dirname;
const BASE = 'https://wiki.biligame.com/sr/api.php';
const QUERY = '[[分类:角色]]|?命途|?元素属性|?稀有度|?实装日期|?性别|?出生日期|?阵营';

function urlFor(q, offset, limit) {
  return `${BASE}?action=ask&query=${encodeURIComponent(q)}&format=json&offset=${offset}&limit=${limit}`;
}

function fetchUrl(u, tryN) {
  return new Promise((resolve, reject) => {
    https.get(u, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('json parse fail @try' + tryN + ': ' + u)); }
      });
    }).on('error', reject);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchWithRetry(u, tryN) {
  for (let i = 0; i < tryN; i++) {
    try { return await fetchUrl(u, i); }
    catch (e) {
      console.log('retry', i + 1, 'of', tryN, e.message);
      await sleep(1500 * (i + 1));
    }
  }
  throw new Error('failed all retries: ' + u);
}

(async () => {
  const limit = 50;
  let offset = 0;
  let all = {};
  let pages = 0;
  while (true) {
    const u = urlFor(QUERY, offset, limit);
    const json = await fetchWithRetry(u, 4);
    const results = json.query.results || {};
    const count = Object.keys(results).length;
    for (const [title, doc] of Object.entries(results)) {
      const po = doc.printouts || {};
      const g = (k) => (po[k] && po[k].length ? po[k] : []);
      all[title] = {
        name: title,
        path: g('命途'),
        element: g('元素属性'),
        rarity: g('稀有度'),
        release: g('实装日期'),
        gender: g('性别'),
        birthday: g('出生日期'),
        faction: g('阵营'),
      };
    }
    pages++;
    console.log(`page ${pages}: offset ${offset} +${count} total ${Object.keys(all).length}`);
    // 下一轮 offset
    const cont = json['query-continue-offset'];
    if (typeof cont !== 'number') break;
    if (cont <= offset) break; // 防止死循环
    offset = cont;
    if (pages > 40) break;
    await sleep(600);
  }

  fs.writeFileSync(path.join(TMP, 'char_data_raw.json'), JSON.stringify(all, null, 2), 'utf8');

  const header = ['idx', 'cn', 'page', 'element', 'rarity', 'release', 'gender', 'birthday', 'faction'];
  const rows = Object.values(all).map((r, i) =>
    [i, r.name, (r.path[0] || ''), (r.element[0] || ''), (r.rarity[0] || ''), (r.release[0] || ''), (r.gender[0] || ''), (r.birthday[0] || ''), (r.faction.join(';'))].join('\t')
  );
  fs.writeFileSync(path.join(TMP, 'char_roster.tsv'), header.join('\t') + '\n' + rows.join('\n'), 'utf8');
  console.log('total chars:', Object.keys(all).length, 'wrote char_roster.tsv');
})().catch((e) => { console.error('ERR', e); process.exit(1); });
