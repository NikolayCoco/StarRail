# -*- coding: utf-8 -*-
# 自检：交叉核对 mod 内引用的 ID 是否都有定义
import glob, re, os

root = '.'
# 收集定义
defs = set()
for pat in ['in_game/common/**/*.txt', 'main_menu/common/**/*.txt', 'main_menu/setup/**/*.txt']:
    for p in glob.glob(pat, recursive=True):
        text = open(p, 'rb').read().decode('utf-8')
        for m in re.finditer(r'^\s*([A-Za-z_][\w:\-]*)\s*=', text, re.M):
            key = m.group(1)
            # skip keys that are clearly not definitions (script values, modifier members)
            defs.add(key)

# 收集引用
refs = []
ref_pats = [
    r'trait:([A-Za-z_][\w:\-]*)',
    r'estate_type:([A-Za-z_][\w:\-]*)',
    r'pop_type:([A-Za-z_][\w:\-]*)',
    r'building_type:([A-Za-z_][\w:\-]*)',
    r'international_organization:([A-Za-z_][\w:\-]*)',
    r'estate_privilege:([A-Za-z_][\w:\-]*)',
    r'religion:([A-Za-z_][\w:\-]*)',
    r'has_trait\s*=\s*([A-Za-z_][\w:\-]*)',
    r'add_trait\s*=\s*trait:([A-Za-z_][\w:\-]*)',
]
for pat in ['in_game/**/*.txt', 'main_menu/**/*.txt', 'main_menu/**/*.gui', 'loading_screen/**/*.txt']:
    for p in glob.glob(pat, recursive=True):
        text = open(p, 'rb').read().decode('utf-8')
        for rp in ref_pats:
            for m in re.finditer(rp, text):
                refs.append((p, m.group(1)))

# 特别：HSR_<code>_01_trait 等由脚本引用但不在文件里定义（M2 生成），占位宏定义
def is_generated(key, text_line):
    # 引用形如 HSR_xxx_01_trait / HSR_xxx_01_trait_leader / HSR_belong_xxx_trait
    if re.match(r'HSR_[a-z0-9]+_01_trait(_leader)?$', key) or key.startswith('HSR_belong_'):
        return True
    return False

missing = {}
for p, key in refs:
    if key in defs:
        continue
    if is_generated(key, ''):
        continue
    missing.setdefault(key, []).append(p)

if missing:
    for k, ps in sorted(missing.items()):
        print('MISSING DEF:', k, ' <-', set(ps))
    print('TOTAL MISSING:', len(missing))
else:
    print('ALL REFS RESOLVED (or generated placeholders)')
