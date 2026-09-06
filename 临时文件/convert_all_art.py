# 批量转换全身立绘(webp RGBA) -> in_game/gfx/models/props/HSR/HSR_<id>_01_diffuse.dds
# 流程：裁透明边 -> 等比缩到<=512 -> 512x512 居中向上 -> DXT5 DDS
import os
from PIL import Image

MOD = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # 临时文件/.. = mod根
SRC_DIR = os.path.join(MOD, '美术资源_立绘_全身')
PROPS_DIR = os.path.join(MOD, 'in_game', 'gfx', 'models', 'props', 'HSR')
CANVAS = 512
ALPHA_THR = 8
EDGE_PAD = 2
os.makedirs(PROPS_DIR, exist_ok=True)

def convert_one(src, out, canvas=CANVAS, alpha_thr=ALPHA_THR, edge_pad=EDGE_PAD):
    im = Image.open(src).convert('RGBA')
    a = im.getchannel('A')
    bb = a.point(lambda v: 255 if v > alpha_thr else 0).getbbox()
    if bb is None:
        return 'empty-alpha'
    x0, y0, x1, y1 = bb
    x0 = max(0, x0 - edge_pad); y0 = max(0, y0 - edge_pad)
    x1 = min(im.width, x1 + edge_pad); y1 = min(im.height, y1 + edge_pad)
    im = im.crop((x0, y0, x1, y1))
    scale = min(canvas / im.width, canvas / im.height)
    nw = max(1, round(im.width * scale)); nh = max(1, round(im.height * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    c = Image.new('RGBA', (canvas, canvas), (0, 0, 0, 0))
    c.paste(im, ((canvas - nw) // 2, 0), im)  # 左右居中，向上对齐（贴顶）
    c.save(out, pixel_format='DXT5')
    return 'ok'

n_ok = n_skip = n_err = 0
failed = []
for root, _dirs, files in os.walk(SRC_DIR):
    for fn in sorted(files):
        if not fn.endswith('.webp'):
            continue
        code = fn[:-5]  # 去 .webp
        out = os.path.join(PROPS_DIR, 'HSR_' + code + '_01_diffuse.dds')
        src = os.path.join(root, fn)
        try:
            st = convert_one(src, out)
        except Exception as e:
            st = 'err:' + str(e)
        if st == 'ok':
            n_ok += 1
        elif st == 'skip':
            n_skip += 1
        else:
            n_err += 1
            failed.append(code + ':' + st)
            print('FAIL', code, st)

print('convert: ok=%d skip=%d err=%d' % (n_ok, n_skip, n_err))
if failed:
    print('failed:', failed)
