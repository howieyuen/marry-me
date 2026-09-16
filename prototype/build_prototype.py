#!/usr/bin/env python3
"""原型构建脚本（prototype 阶段）。

从本地私人相册（~/privacy/{婚纱,素材}）读取真实照片，用 macOS 自带的 sips
压缩转码后 base64 内联进 prototype.template.html，生成可单文件预览的
prototype.html。

注意：这是原型期工具，正式站点会改用 scripts/optimize.py 生成独立图片文件，
不再内联（见 docs/design.md §7 / §8）。
"""
import base64
import os
import subprocess
import sys
import tempfile

HOME = os.path.expanduser("~")
GOWN = os.path.join(HOME, "privacy", "婚纱")   # 婚纱棚拍
SC = os.path.join(HOME, "privacy", "素材")      # 故事素材（真实场景 + 手写信）

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "prototype.template.html")
OUT = os.path.join(HERE, "prototype.html")


def find_by(dirpath, keyword):
    """按关键词在目录里匹配文件名，规避 macOS Unicode 规范化问题。"""
    for name in sorted(os.listdir(dirpath)):
        if keyword in name:
            return os.path.join(dirpath, name)
    return None


# token -> (目录, 关键词, 顺时针旋转角度)
SPEC = [
    ("{{IMG_HERO}}",     GOWN, "1B9A2276", 0),  # 绿纱外景（用作 Hero）
    ("{{IMG_XIHU}}",     SC,   "西湖",      0),
    ("{{IMG_HENGDIAN}}", SC,   "横店",      0),
    ("{{IMG_YUELAO}}",   SC,   "月老",      0),
    ("{{IMG_LETTER1}}",  SC,   "生日",      0),  # 2025.12.23 生日手写信
    ("{{IMG_LETTER2}}",  SC,   "情人节",    0),  # 2026.2.14 情人节手写信
    ("{{IMG_MOVE}}",     SC,   "高尔夫",    0),  # 人物特写（打动那章）
    ("{{IMG_ASK}}",      SC,   "求婚",      0),  # 单膝跪地戴戒指
    ("{{IMG_XIUHE}}",    SC,   "秀禾",      0),  # 成功高潮
    ("{{IMG_LOOKUP}}",   SC,   "抬起头",    0),  # 结尾：他捧花
]


def resolve_mapping():
    mapping = []
    for token, d, kw, rot in SPEC:
        path = find_by(d, kw)
        if not path:
            print("NOT FOUND:", d, kw)
            sys.exit(1)
        mapping.append((token, path, rot))
    return mapping


def data_uri(src_path, rotate=0):
    fd, tmp = tempfile.mkstemp(suffix=".jpg")
    os.close(fd)
    try:
        args = ["sips", "-s", "format", "jpeg"]
        if rotate:
            args += ["-r", str(rotate)]
        # 长边压到 1000px，JPEG 质量 ~62（HEIC/JPG 通吃）
        args += ["-Z", "1000", "--setProperty", "formatOptions", "62",
                 src_path, "-o", tmp]
        subprocess.run(args, check=True,
                       stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        with open(tmp, "rb") as f:
            b64 = base64.b64encode(f.read()).decode()
        return "data:image/jpeg;base64," + b64
    finally:
        os.remove(tmp)


def main():
    mapping = resolve_mapping()
    with open(TEMPLATE, encoding="utf-8") as f:
        html = f.read()
    for token, src, rot in mapping:
        uri = data_uri(src, rot)
        html = html.replace(token, uri)
        print("inlined %-16s <- %-28s rot=%d (%d KB)" %
              (token, os.path.basename(src), rot, len(uri) // 1024))
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(html)
    print("WROTE", OUT, "(%d KB)" % (len(html) // 1024))


if __name__ == "__main__":
    main()
