# 按流程转换一张立绘 -> 512x512 DXT5 DDS，并解析 header 验证与 DvT 一致
import os
from PIL import Image

def convert_one(src, out, canvas=512, alpha_thr=8, edge_pad=2):
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
    c.paste(im, ((canvas - nw) // 2, 0), im)  # 左右居中，向上对齐
    c.save(out, pixel_format='DXT5')
    return 'ok'

import struct
def parse_dds(path):
    b = open(path, 'rb').read()
    magic = b[0:4]
    hdr = struct.unpack('<I', b[4:8])[0]
    height, width = struct.unpack('<II', b[12:20])
    mip = struct.unpack('<I', b[24:28])[0]
    fourcc = b[84:88].decode('ascii', 'replace')
    return dict(magic=magic, hdr=hdr, w=width, h=height, mip=mip, fourcc=fourcc, size=len(b))

src = '美术资源_立绘_全身/巡海游侠/acheron.webp'
out = '临时文件/test_yellow.webp.dds'  # 中文会乱? 用英文
out = '临时文件/test_yellow.dds'
st = convert_one(src, out)
print('convert:', st)
d = parse_dds(out)
print('DDS:', d)
