#!/usr/bin/env python3
"""Render LearnPath Journal cover art (1200x630) — brand language, topic-meaningful geometry.

Palette (from docs/DESIGN-SYSTEM.md): BG #090A0C, surface #12151C, FG #F4F1EA,
MUTED #9AA3B2, TEAL #2DD4BF, AMBER #F5B942. Restrained, editorial, subtle glow.
Run: python3 scripts/render-blog-covers.py  (writes public/blog/covers/*.png)
"""
import math
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (9, 10, 12)
SURFACE = (18, 21, 28)
FG = (244, 241, 234)
MUTED = (154, 163, 178)
TEAL = (45, 212, 191)
AMBER = (245, 185, 66)

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_R = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "blog", "covers")


def font(size, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_R, size)


def spaced(draw, xy, text, f, fill, spacing=6):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=f, fill=fill)
        x += draw.textlength(ch, font=f) + spacing
    return x


def glow(img, center, radius, color, layers=14):
    """Soft radial glow via alpha-composited circles."""
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for i in range(layers, 0, -1):
        r = radius * (0.35 + 0.65 * i / layers)
        a = int(34 * (1 - i / layers) ** 1.6) + 4
        d.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], fill=color + (a,))
    img.alpha_composite(overlay)


def base(category):
    img = Image.new("RGBA", (W, H), BG + (255,))
    d = ImageDraw.Draw(img)
    # subtle grid
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, W, 48):
        gd.line([(x, 0), (x, H)], fill=(255, 255, 255, 7), width=1)
    for y in range(0, H, 48):
        gd.line([(0, y), (W, y)], fill=(255, 255, 255, 7), width=1)
    img.alpha_composite(grid)
    d = ImageDraw.Draw(img)
    # frame
    d.rounded_rectangle([24, 24, W - 24, H - 24], radius=18, outline=(255, 255, 255, 22), width=1)
    # eyebrow + category
    spaced(d, (56, 52), "LEARNPATH JOURNAL", font(17), MUTED, spacing=7)
    spaced(d, (56, H - 78), category.upper(), font(15), TEAL, spacing=6)
    return img


def node(d, c, r, color, ring=False):
    if ring:
        d.ellipse([c[0] - r * 2.1, c[1] - r * 2.1, c[0] + r * 2.1, c[1] + r * 2.1], outline=color + (90,), width=2)
    d.ellipse([c[0] - r, c[1] - r, c[0] + r, c[1] + r], fill=color + (255,))


def path_line(d, pts, color, width=6, alpha=235):
    d.line(pts, fill=color + (alpha,), width=width, joint="curve")


# ---------------------------------------------------------------- cover 1
def cover_agents():
    img = base("AI & tooling")
    d = ImageDraw.Draw(img, "RGBA")
    hub = (760, 300)
    satellites = [(560, 170), (560, 430), (960, 170), (960, 430), (760, 105), (760, 495)]
    for s in satellites:
        path_line(d, [hub, s], MUTED, width=3, alpha=110)
    glow(img, hub, 120, TEAL)
    d = ImageDraw.Draw(img, "RGBA")
    for s in satellites:
        node(d, s, 9, AMBER)
    node(d, hub, 16, TEAL, ring=True)
    # terminal chevron motif, left
    tf = font(120)
    d.text((110, 240), ">", font=tf, fill=TEAL + (230,))
    d.text((205, 240), "_", font=tf, fill=FG + (200,))
    spaced(d, (112, 400), "MODEL + HARNESS", font(19), MUTED, spacing=5)
    img.convert("RGB").save(os.path.join(OUT, "ai-coding-agents-2026.png"))


# ---------------------------------------------------------------- cover 2
def cover_security():
    img = base("Security")
    d = ImageDraw.Draw(img, "RGBA")
    # shield outline (right)
    cx, cy = 830, 310
    shield = [
        (cx, cy - 160),
        (cx + 130, cy - 105),
        (cx + 130, cy + 30),
        (cx, cy + 165),
        (cx - 130, cy + 30),
        (cx - 130, cy - 105),
    ]
    d.line(shield + [shield[0]], fill=FG + (210,), width=6, joint="curve")
    glow(img, (cx, cy - 10), 130, AMBER)
    d = ImageDraw.Draw(img, "RGBA")
    node(d, (cx, cy - 30), 12, TEAL, ring=True)
    # circuit traces from shield to left keyhole line
    for (y0, x1) in [(200, 420), (310, 360), (420, 420)]:
        path_line(d, [(cx - 130, y0), (x1, y0)], MUTED, width=3, alpha=120)
        node(d, (x1, y0), 7, AMBER)
    # left: keyhole = circle + slot, minimal
    kx, ky = 210, 300
    d.ellipse([kx - 52, ky - 88, kx + 52, ky + 16], outline=TEAL + (235,), width=6)
    d.line([(kx, ky + 4), (kx, ky + 96)], fill=TEAL + (235,), width=10)
    spaced(d, (112, 495), "TRUST NOTHING. VERIFY EVERYTHING.", font(18), MUTED, spacing=4)
    img.convert("RGB").save(os.path.join(OUT, "security-for-ai-apps.png"))


# ---------------------------------------------------------------- cover 3
def cover_languages():
    img = base("Ecosystem")
    d = ImageDraw.Draw(img, "RGBA")
    # two paths crossing at a decision node
    fork = (620, 330)
    teal_path = [(140, 470), (360, 400), fork, (850, 190), (1060, 150)]
    amber_path = [(140, 190), (360, 250), fork, (850, 470), (1060, 510)]
    path_line(d, teal_path, TEAL, width=6, alpha=225)
    path_line(d, amber_path, AMBER, width=6, alpha=225)
    glow(img, fork, 110, TEAL)
    d = ImageDraw.Draw(img, "RGBA")
    node(d, fork, 15, FG, ring=True)
    for p in teal_path[::2]:
        node(d, p, 7, TEAL)
    for p in amber_path[::2]:
        node(d, p, 7, AMBER)
    # type glyphs
    tf = font(96)
    d.text((150, 90), "TS", font=tf, fill=TEAL + (225,))
    d.text((945, 275), "Py", font=tf, fill=AMBER + (225,))
    spaced(d, (150, 500), "ONE FORK. TWO REAL ECOSYSTEMS.", font(18), MUTED, spacing=4)
    img.convert("RGB").save(os.path.join(OUT, "typescript-vs-python-2026.png"))


# ---------------------------------------------------------------- cover 4
def cover_learning():
    img = base("Learning")
    d = ImageDraw.Draw(img, "RGBA")
    # ascending staircase path with a node on each step
    steps = [(170, 480), (330, 480), (330, 400), (490, 400), (490, 320), (650, 320), (650, 240), (810, 240), (810, 165), (990, 165)]
    path_line(d, steps, MUTED, width=5, alpha=170)
    for i, s in enumerate(steps):
        color = TEAL if i < len(steps) - 1 else AMBER
        node(d, s, 8, color)
    glow(img, steps[-1], 120, AMBER)
    d = ImageDraw.Draw(img, "RGBA")
    node(d, steps[-1], 13, AMBER, ring=True)
    # cursor arrow at the last step (you are here → next)
    ax, ay = 1015, 130
    d.polygon([(ax, ay), (ax + 44, ay + 20), (ax + 22, ay + 26), (ax + 30, ay + 52), (ax + 18, ay + 56), (ax + 10, ay + 30), (ax - 4, ay + 44)], fill=FG + (235,))
    spaced(d, (170, 500), "TYPE IT. RUN IT. BREAK IT. PROVE IT.", font(18), MUTED, spacing=4)
    img.convert("RGB").save(os.path.join(OUT, "learning-to-code-with-ai.png"))


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    cover_agents()
    cover_security()
    cover_languages()
    cover_learning()
    print("covers written to", os.path.abspath(OUT))
