# -*- coding: utf-8 -*-
# 自检：花括号平衡
import glob, sys

def strip_comment(line):
    inq = False
    for i, ch in enumerate(line):
        if ch == '"':
            inq = not inq
        elif ch == '#' and not inq:
            return line[:i]
    return line

bad = []
ok = 0
for pat in ['in_game/**/*.txt', 'in_game/**/*.gui', 'main_menu/**/*.txt', 'main_menu/**/*.gui', 'loading_screen/**/*.txt']:
    for p in glob.glob(pat, recursive=True):
        text = open(p, 'rb').read().decode('utf-8')
        depth = 0
        for line in text.split('\n'):
            line = strip_comment(line)
            for ch in line:
                if ch == '{':
                    depth += 1
                elif ch == '}':
                    depth -= 1
                if depth < 0:
                    bad.append((p, 'NEG'))
                    break
            if bad and bad[-1][0] == p:
                break
        if depth != 0:
            bad.append((p, 'depth=%d' % depth))
        else:
            ok += 1

if bad:
    for b in bad:
        print('BAD', b)
    print('TOTAL BAD:', len(bad), 'OK:', ok)
    sys.exit(1)
else:
    print('ALL BRACE OK, files:', ok)
