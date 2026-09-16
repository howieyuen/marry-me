#!/usr/bin/env python3
"""从本地私人相册生成站点用的压缩图（独立文件，非内联）。

用 macOS 自带 sips：转 JPEG、长边压到 1500px、质量 ~62。
输出到 assets/img/，语义命名。原始高清图不入库。
"""
import os
import subprocess
import sys

HOME = os.path.expanduser("~")
GOWN = os.path.join(HOME, "privacy", "婚纱")
SC = os.path.join(HOME, "privacy", "素材")

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.dirname(HERE)
OUT_DIR = os.path.join(REPO, "assets", "img")

# 输出名 -> (源目录, 文件名关键词, 是否必需)
SPEC = [
    ("hero.jpg",            GOWN, "1B9A2276", True),   # 绿纱外景（Hero 背景）
    ("xihu-0921.jpg",       SC,   "西湖",      True),
    ("hengdian-0928.jpg",   SC,   "横店",      True),
    ("yuelao-1108.jpg",     SC,   "月老",      True),
    ("letter-birthday.jpg", SC,   "生日",      True),  # 2025.12.23 生日手写信
    ("letter-valentine.jpg",SC,   "情人节",    True),  # 2026.2.14 情人节手写信
    ("move-golf.jpg",       SC,   "高尔夫",    True),
    ("ask-proposal.jpg",    SC,   "求婚",      True),
    ("xiuhe.jpg",           SC,   "秀禾",      True),
    ("lookup.jpg",          SC,   "抬起头",    True),
    # 6.15「第一天」照片待补：拿到后加一行 ("meet-0615.jpg", SC, "第一天", True)
]


def find_by(dirpath, keyword):
    """按关键词匹配文件名，规避 macOS Unicode 规范化问题。"""
    if not os.path.isdir(dirpath):
        return None
    for name in sorted(os.listdir(dirpath)):
        if keyword in name:
            return os.path.join(dirpath, name)
    return None


def optimize(src, dst):
    subprocess.run(
        ["sips", "-s", "format", "jpeg", "-Z", "1500",
         "--setProperty", "formatOptions", "62", src, "-o", dst],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    missing = []
    for out_name, d, kw, required in SPEC:
        src = find_by(d, kw)
        if not src:
            missing.append((out_name, d, kw, required))
            print("SKIP  %-22s (未找到关键词 %r 于 %s)" % (out_name, kw, d))
            continue
        dst = os.path.join(OUT_DIR, out_name)
        optimize(src, dst)
        kb = os.path.getsize(dst) // 1024
        print("OK    %-22s <- %-28s (%d KB)" % (out_name, os.path.basename(src), kb))
    hard = [m for m in missing if m[3]]
    if hard:
        print("\n缺少必需素材：", [m[0] for m in hard], file=sys.stderr)
        sys.exit(1)
    print("\nDONE ->", OUT_DIR)


if __name__ == "__main__":
    main()
