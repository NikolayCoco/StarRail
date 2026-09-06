# -*- coding: utf-8 -*-
# HSR_2DFoil.py —— 二向箔（2DPortraitFramework / workshop 3599699279）星穹铁道绑定生成器
# 照 RI_2DFoil.py 改：路径与前缀换成 HSR（角色 trait 键 = HSR_<code>_01_trait，与文件短名同构）。
# 额外加了一段「源立绘 PNG -> 512x512 DXT5 dds」转换（裁透明 -> 等比缩放 -> 水平居中、向上对齐）。
#
# 用法（在 mod 根目录或任意处执行均可，脚本按自身位置定位 mod 根）：
#   python in_game\HSR_2DFoil.py             # 转换缺失的 dds + 全量重新生成绑定四件套
#   python in_game\HSR_2DFoil.py --rebuild   # 强制重转全部 dds
#   python in_game\HSR_2DFoil.py --bind-only # 只重新生成绑定（dds 已就绪时）
#
# 注意：生成的 .txt 一律 UTF-8 无 BOM（EU5 脚本文件带 BOM 会解析失败）。
import os

MOD_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # 本文件位于 in_game\ 下
GFXMODPATH = os.path.join(MOD_ROOT, "in_game")
MODPREFIX = "HSR"
KEY_PREFIX = MODPREFIX + "_"   # HSR_

# ---- 源立绘（不提交，见 美术资源_立绘）：<阵营>/<code>_01.png ----
SRC_DIR = os.path.join(MOD_ROOT, "美术资源_立绘")
CANVAS = 512            # 目标边长；DXT 族要求 4 的倍数
ALPHA_THRESHOLD = 8     # 裁透明阈值
EDGE_PAD = 2            # 内容四周额外保留像素

PROPS_DIR = os.path.join(GFXMODPATH, "gfx", "models", "props", MODPREFIX)
ACCESSORY_PATH = os.path.join(GFXMODPATH, "gfx", "portraits", "accessories", MODPREFIX + "_props.txt")
GENE_PATH = os.path.join(GFXMODPATH, "common", "genes", MODPREFIX + "_genes_special_accessories_misc.txt")
GFXMODIFIER_PATH = os.path.join(GFXMODPATH, "gfx", "portraits", "portrait_modifiers", MODPREFIX + "_portrait.txt")
ASSET_PATH = os.path.join(PROPS_DIR, "00_" + MODPREFIX + ".asset")
ENCODING = "utf-8"      # 无 BOM


# ---------------------------------------------------------------- 转换段
def convert_one(src_png, out_dds, rebuild=False):
    """裁透明 -> 等比缩放 -> 512 画布水平居中、向上对齐 -> DXT5 dds。"""
    if (not rebuild) and os.path.exists(out_dds):
        return "skip"
    from PIL import Image
    im = Image.open(src_png).convert("RGBA")
    a = im.getchannel("A")
    bb = a.point(lambda v: 255 if v > ALPHA_THRESHOLD else 0).getbbox()
    if bb is None:
        return "empty-alpha"
    x0, y0, x1, y1 = bb
    x0 = max(0, x0 - EDGE_PAD)
    y0 = max(0, y0 - EDGE_PAD)
    x1 = min(im.width, x1 + EDGE_PAD)
    y1 = min(im.height, y1 + EDGE_PAD)
    im = im.crop((x0, y0, x1, y1))
    scale = min(CANVAS / im.width, CANVAS / im.height)
    nw = max(1, round(im.width * scale))
    nh = max(1, round(im.height * scale))
    im = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGBA", (CANVAS, CANVAS), (0, 0, 0, 0))
    canvas.paste(im, ((CANVAS - nw) // 2, 0), im)  # 左右居中，向上对齐（贴顶）
    canvas.save(out_dds, pixel_format="DXT5")
    return "ok"


def convert_all(rebuild=False):
    n_ok = n_skip = n_err = 0
    if not os.path.isdir(SRC_DIR):
        print("[convert] 未找到源立绘目录：", SRC_DIR)
        return 0
    os.makedirs(PROPS_DIR, exist_ok=True)
    for root, _dirs, files in os.walk(SRC_DIR):
        for fn in sorted(files):
            if not fn.endswith(".png"):
                continue
            code_01 = fn[:-4]  # <code>_01
            out = os.path.join(PROPS_DIR, KEY_PREFIX + code_01 + "_diffuse.dds")
            src = os.path.join(root, fn)
            try:
                st = convert_one(src, out, rebuild)
            except Exception as e:
                st = "err:" + str(e)
            if st == "ok":
                n_ok += 1
            elif st == "skip":
                n_skip += 1
            else:
                n_err += 1
                print("[convert] FAIL", src, st)
    print("[convert] ok=%d skip=%d err=%d" % (n_ok, n_skip, n_err))
    return n_ok


# ---------------------------------------------------------------- 绑定段（DvT 同款）
def bind_all():
    os.makedirs(PROPS_DIR, exist_ok=True)
    for _p in (ASSET_PATH, ACCESSORY_PATH, GENE_PATH, GFXMODIFIER_PATH):
        os.makedirs(os.path.dirname(_p), exist_ok=True)
    out_asset = open(ASSET_PATH, "w", encoding=ENCODING)
    out_accessory = open(ACCESSORY_PATH, "w", encoding=ENCODING)
    out_gene = open(GENE_PATH, "w", encoding=ENCODING)
    out_gfxmodifier = open(GFXMODIFIER_PATH, "w", encoding=ENCODING)
    out_gfxmodifier.write(MODPREFIX + "_portrait = {\n\tusage = game\n\tpriority = 100\n")
    _id = 0
    slices = 1
    found = []

    out_gene.write('''accessory_genes = {
\t''' + MODPREFIX + '''props_''' + str(slices) + ''' = {
\t\tgene_''' + MODPREFIX + '''_blank_''' + str(slices) + ''' = {
\t\t\tindex = 0
\t\t}''')
    for root, _dirs, files in os.walk(GFXMODPATH):
        for file in files:
            if file[-12:] == "_diffuse.dds":
                found.append(os.path.join(root, file))
    found.sort()
    for path in found:
        file = os.path.basename(path)
        name = file[:-12]
        shortname = file[:-12]
        _id = _id + 1
        if _id == 256:
            _id = 1
            slices += 1
            out_gene.write('''\n\t}\n\t''' + MODPREFIX + '''props_''' + str(slices) + ''' = {\t
\t\tgene_''' + MODPREFIX + '''_blank_''' + str(slices) + ''' = {
\t\t\tindex = 0
\t\t}''')
        try:
            num_tail = int(shortname.split("_")[-1])
        except ValueError:
            num_tail = 0
        if num_tail <= 50:
            core = shortname[len(KEY_PREFIX):] if shortname.startswith(KEY_PREFIX) else shortname
            trait = MODPREFIX + "_" + core + "_trait"
            out_gfxmodifier.write('''
\t''' + shortname + ''' = {
\t\tdna_modifiers = {
\t\t\taccessory = {
\t\t\t\tmode = replace
\t\t\t\tgene = ''' + MODPREFIX + '''props_''' + str(slices) + '''
\t\t\t\ttemplate = ''' + shortname + '''
\t\t\t\tvalue = 0.5
\t\t\t}
\t\t}
\t\tweight = {
\t\t\tbase = 0
\t\t\tmodifier = {
\t\t\t\tadd = 255''')
            out_gfxmodifier.write('''
\t\t\t\t''' + MODPREFIX + '''_2D_portrait_trigger = yes
\t\t\t\thas_trait = ''' + trait + '''
\t\t\t}
\t\t}
\t}''')
        out_accessory.write(name + " = { entity = { required_tags = \"\" shared_pose_entity = head entity = \"" + name + "_entity\" } }\n")
        out_gene.write('''
\t\t''' + shortname + ''' = {
\t\t\tindex = ''' + str(_id) + '''
\t\t\tmale = { 1 = ''' + shortname + ''' }
\t\t\tfemale = male
\t\t\tboy = male
\t\t\tgirl = male
\t\t\tadolescent_boy = male
\t\t\tadolescent_girl = male
\t\t\tinfant = male
\t\t}''')
        out_asset.write('''
pdxmesh = {
\tname = "''' + name + '''_mesh"
\tfile = "hm_prophet.mesh"
\tscale = 0.8
\tmeshsettings = {
\t\tname = "prophet_shieldShape"
\t\tindex = 0
\t\ttexture_diffuse = "''' + name + '''_diffuse.dds"
\t\ttexture_specular = "''' + name + '''_diffuse.dds"
\t\tshader = "portrait_attachment_alpha_to_coverage"
\t\tshader_file = "gfx/hmportrait.shader"
\t}
}
entity = {
\tname = "''' + name + '''_entity"
\tpdxmesh = "''' + name + '''_mesh"
}
''')

    out_gene.write("\n\t}\n}")
    out_gfxmodifier.write("\n}")
    out_gene.close()
    out_gfxmodifier.close()
    out_asset.close()
    out_accessory.close()
    print("[bind] portraits=%d slices=%d" % (len(found), slices))
    print("[bind] ->", ASSET_PATH)
    print("[bind] ->", ACCESSORY_PATH)
    print("[bind] ->", GENE_PATH)
    print("[bind] ->", GFXMODIFIER_PATH)


if __name__ == "__main__":
    import sys
    args = set(sys.argv[1:])
    if "--bind-only" in args:
        bind_all()
    else:
        convert_all(rebuild=("--rebuild" in args))
        bind_all()
