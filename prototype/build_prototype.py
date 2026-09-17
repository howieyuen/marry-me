#!/usr/bin/env python3
"""Prototype build script (prototype phase).

Reads real photos from the local private photo album (~/privacy/{婚纱,素材}), uses macOS's
built-in sips to compress/transcode them, then inlines them as base64 into
prototype.template.html, producing a single-file-previewable prototype.html.

Note: this is a prototype-phase tool; the production site will switch to scripts/optimize.py to
generate standalone image files instead of inlining (see docs/design.md §7 / §8).
"""
import base64
import os
import subprocess
import sys
import tempfile

HOME = os.path.expanduser("~")
GOWN = os.path.join(HOME, "privacy", "婚纱")   # wedding dress studio shoot
SC = os.path.join(HOME, "privacy", "素材")      # story material (real-life scenes + handwritten letters)

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "prototype.template.html")
OUT = os.path.join(HERE, "prototype.html")


def find_by(dirpath, keyword):
    """Match filenames in a directory by keyword, working around macOS Unicode normalization quirks."""
    for name in sorted(os.listdir(dirpath)):
        if keyword in name:
            return os.path.join(dirpath, name)
    return None


# token -> (dir, keyword, clockwise rotation angle)
SPEC = [
    ("{{IMG_HERO}}",     GOWN, "1B9A2276", 0),  # green dress outdoor shot (used as Hero)
    ("{{IMG_XIHU}}",     SC,   "西湖",      0),
    ("{{IMG_HENGDIAN}}", SC,   "横店",      0),
    ("{{IMG_YUELAO}}",   SC,   "月老",      0),
    ("{{IMG_LETTER1}}",  SC,   "生日",      0),  # 2025.12.23 birthday handwritten letter
    ("{{IMG_LETTER2}}",  SC,   "情人节",    0),  # 2026.2.14 Valentine's Day handwritten letter
    ("{{IMG_MOVE}}",     SC,   "高尔夫",    0),  # close-up portrait (the "what moved me" chapter)
    ("{{IMG_ASK}}",      SC,   "求婚",      0),  # down on one knee with the ring
    ("{{IMG_XIUHE}}",    SC,   "秀禾",      0),  # success climax
    ("{{IMG_LOOKUP}}",   SC,   "抬起头",    0),  # ending: he holds the flowers
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
        # cap the long edge at 1000px, JPEG quality ~62 (handles both HEIC/JPG)
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
