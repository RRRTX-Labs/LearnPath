#!/usr/bin/env python3
"""Render every LearnPath raster brand asset from ONE geometry definition.

The SVG files in branding/ are the source of truth for humans; this script
re-implements the same 64-unit geometry with PIL supersampling so favicons,
app icons and the OG image are pixel-crisp and visually identical.

Outputs (all committed):
  public/favicon.ico            16/32/48 multi-res
  public/apple-touch-icon.png   180
  public/icon-512.png           512 (GitHub/Discord avatar, maskable source)
  public/og.png                 1200x630 social preview
  branding/social-preview.png   copy of og.png
"""
from PIL import Image, ImageDraw, ImageFont
import math, shutil, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
BRAND = os.path.join(ROOT, "branding")

DARK_TILE = (18, 21, 28, 255)
TILE_LINE = (255, 255, 255, 24)
TEAL = (45, 212, 191, 255)
AMBER = (245, 185, 66, 255)
BG = (9, 10, 12, 255)
GRID = (255, 255, 255, 9)
FG = (244, 241, 234, 255)
MUTED = (154, 163, 178, 255)

# 64-unit geometry (matches branding/mark.svg)
PATH_PTS = [(15, 45), (28, 32), (36, 40), (49, 22)]
STROKE = 6.0
START_R = 3.5
END_R = 5.5
RING_R = 9.0
TILE_RX = 14.0

SS = 8  # supersample factor


def lerp(a, b, t):
    return tuple(int(round(a[i] + (b[i] - a[i]) * t)) for i in range(4))


def rounded_rect(draw, box, r, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def draw_mark(size: int, tile=DARK_TILE, path=TEAL, dest=AMBER, origin=TEAL, with_tile=True):
    """Render the mark at `size` px using 8x supersampling."""
    s = size * SS
    u = s / 64.0
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if with_tile:
        rounded_rect(d, [0, 0, s - 1, s - 1], TILE_RX * u, tile,
                     outline=TILE_LINE, width=max(1, int(0.5 * u)))
    pts = [(x * u, y * u) for x, y in PATH_PTS]
    d.line(pts, fill=path, width=int(STROKE * u), joint="curve")
    for i in range(len(pts) - 1):
        pass
    # round the joins/caps
    for (x, y) in pts[1:-1]:
        d.ellipse([x - STROKE * u / 2, y - STROKE * u / 2, x + STROKE * u / 2, y + STROKE * u / 2], fill=path)
    sx, sy = pts[0]
    d.ellipse([sx - STROKE * u / 2, sy - STROKE * u / 2, sx + STROKE * u / 2, sy + STROKE * u / 2], fill=path)
    ex, ey = pts[-1]
    d.ellipse([ex - STROKE * u / 2, ey - STROKE * u / 2, ex + STROKE * u / 2, ey + STROKE * u / 2], fill=path)
    # origin node
    d.ellipse([sx - START_R * u, sy - START_R * u, sx + START_R * u, sy + START_R * u], fill=origin)
    # destination ring + node
    d.ellipse([ex - RING_R * u, ey - RING_R * u, ex + RING_R * u, ey + RING_R * u],
              outline=dest[:3] + (90,), width=max(1, int(1.0 * u)))
    d.ellipse([ex - END_R * u, ey - END_R * u, ex + END_R * u, ey + END_R * u], fill=dest)
    return img.resize((size, size), Image.LANCZOS)


def draw_constellation(d, x0, y0, w, h, nodes):
    """nodes: list of (t, dx, dy) with t in 0..1 along teal->amber."""
    pts = [(x0 + dx * w, y0 + dy * h) for _, dx, dy in nodes]
    for i in range(len(pts) - 1):
        c = lerp(TEAL, AMBER, (nodes[i][0] + nodes[i + 1][0]) / 2)
        d.line([pts[i], pts[i + 1]], fill=c[:3] + (110,), width=3)
    for (t, _, _), (px, py) in zip(nodes, pts):
        c = lerp(TEAL, AMBER, t)
        r = 5 + 4 * t
        d.ellipse([px - r - 6, py - r - 6, px + r + 6, py + r + 6], outline=c[:3] + (48,), width=2)
        d.ellipse([px - r, py - r, px + r, py + r], fill=c)


def make_og(path_out):
    W, H = 1200, 630
    s = 2
    img = Image.new("RGBA", (W * s, H * s), BG)
    d = ImageDraw.Draw(img)
    step = 48 * s
    for x in range(0, W * s, step):
        d.line([(x, 0), (x, H * s)], fill=GRID, width=1)
    for y in range(0, H * s, step):
        d.line([(0, y), (W * s, y)], fill=GRID, width=1)

    serif = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", 118 * s)
    sans = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30 * s)
    mono = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf", 21 * s)

    # mark tile top-left
    mark = draw_mark(72 * s // 8 * 8 // 8)  # placeholder, replaced below
    mark = draw_mark(72)
    mark = mark.resize((72 * s, 72 * s), Image.LANCZOS)
    img.paste(mark, (80 * s, 78 * s), mark)

    d.text((80 * s, 190 * s), "LearnPath", font=serif, fill=FG)
    d.text((82 * s, 330 * s), "Learn anything. Build everything.", font=sans, fill=MUTED)
    sub = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24 * s)
    d.text((82 * s, 392 * s), "Free, structured learning paths built", font=sub, fill=MUTED)
    d.text((82 * s, 428 * s), "from the best resources on the web.", font=sub, fill=MUTED)

    tag = "ROADMAPS   PRACTICE   PROJECTS   PROGRESS"
    tb = d.textbbox((0, 0), tag, font=mono)
    pad = 16 * s
    d.rounded_rectangle([82 * s, 500 * s, 82 * s + (tb[2] - tb[0]) + pad * 2, 500 * s + (tb[3] - tb[1]) + pad],
                        radius=10 * s, outline=(255, 255, 255, 40), width=2)
    d.text((82 * s + pad, 500 * s + pad // 2), tag, font=mono, fill=TEAL)

    nodes = [
        (0.00, 0.06, 0.86), (0.12, 0.16, 0.70), (0.24, 0.13, 0.52), (0.36, 0.30, 0.60),
        (0.48, 0.42, 0.40), (0.60, 0.55, 0.50), (0.72, 0.66, 0.28), (0.85, 0.80, 0.36),
        (1.00, 0.93, 0.14),
    ]
    draw_constellation(d, 700 * s, 70 * s, 430 * s, 470 * s, nodes)

    img = img.resize((W, H), Image.LANCZOS).convert("RGB")
    img.save(path_out, "PNG", optimize=True)
    return os.path.getsize(path_out)


def main():
    os.makedirs(PUB, exist_ok=True)
    os.makedirs(BRAND, exist_ok=True)

    # favicon.ico: 16/32/48
    ico = os.path.join(PUB, "favicon.ico")
    imgs = [draw_mark(n) for n in (16, 32, 48)]
    imgs[0].save(ico, format="ICO", sizes=[(16, 16), (32, 32), (48, 48)], append_images=imgs[1:])

    # apple touch + avatar
    draw_mark(180).save(os.path.join(PUB, "apple-touch-icon.png"), "PNG", optimize=True)
    draw_mark(512).save(os.path.join(PUB, "icon-512.png"), "PNG", optimize=True)

    # light variant for docs/light surfaces
    draw_mark(512, tile=(15, 118, 110, 255), path=FG, origin=FG).save(
        os.path.join(BRAND, "mark-light-512.png"), "PNG", optimize=True)

    og_bytes = make_og(os.path.join(PUB, "og.png"))
    shutil.copyfile(os.path.join(PUB, "og.png"), os.path.join(BRAND, "social-preview.png"))

    for f in ("favicon.ico", "apple-touch-icon.png", "icon-512.png", "og.png"):
        print(f, os.path.getsize(os.path.join(PUB, f)), "bytes")
    print("og optimized:", og_bytes, "bytes")


if __name__ == "__main__":
    main()
