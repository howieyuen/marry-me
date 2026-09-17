#!/usr/bin/env python3
"""Generate compressed images for the site from the local private photo album (standalone files, not inlined).

Uses macOS's built-in sips: convert to JPEG, cap the long edge at 1500px, quality ~62.
Output to assets/img/ with semantic names. Original high-res photos are not committed.
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

# output name -> (source dir, filename keyword, required)
SPEC = [
    ("hero.jpg",            GOWN, "1B9A2276", True),   # green dress outdoor shot (Hero background)
    ("xihu-0921.jpg",       SC,   "西湖",      True),
    ("hengdian-0928.jpg",   SC,   "横店",      True),
    ("yuelao-1108.jpg",     SC,   "月老",      True),
    ("letter-birthday.jpg", SC,   "生日",      True),  # 2025.12.23 birthday handwritten letter
    ("letter-valentine.jpg",SC,   "情人节",    True),  # 2026.2.14 Valentine's Day handwritten letter
    ("move-golf.jpg",       SC,   "高尔夫",    True),
    ("ask-proposal.jpg",    SC,   "求婚",      True),
    ("xiuhe.jpg",           SC,   "秀禾",      True),
    ("lookup.jpg",          SC,   "抬起头",    True),
    # 6.15 "Day One" photo still missing: once obtained, add a line ("meet-0615.jpg", SC, "第一天", True)
]


def find_by(dirpath, keyword):
    """Match filenames by keyword, working around macOS Unicode normalization quirks."""
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
            print("SKIP  %-22s (keyword %r not found in %s)" % (out_name, kw, d))
            continue
        dst = os.path.join(OUT_DIR, out_name)
        optimize(src, dst)
        kb = os.path.getsize(dst) // 1024
        print("OK    %-22s <- %-28s (%d KB)" % (out_name, os.path.basename(src), kb))
    hard = [m for m in missing if m[3]]
    if hard:
        print("\nMissing required assets:", [m[0] for m in hard], file=sys.stderr)
        sys.exit(1)
    print("\nDONE ->", OUT_DIR)


if __name__ == "__main__":
    main()
