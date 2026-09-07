#!/usr/bin/env python3
"""tulenko 32 точки: глубина — лицо стены и бока мебели. 32x32.
top_wall_face.png: НОВАЯ — лицо стены: тёмный кирпич в тени, верхняя кромка светлая.
top_bed/table/bench/prop_crate: ПЕРЕРИСОВКА — верх как был по строю, низ (ряды 24..31) — тёмный бок с тенью.
Повтор: python3 scripts/art32_depth.py (из корня /root/sites)"""
from PIL import Image, ImageDraw

SITE = "tulenko.bratuxa.zomb.top/img/"
S = 32
SIDE_Y = 24  # ряды 24..31 — бок


def rnd(x, y, s):
    h = (x * 374761393 + y * 668265263 + s * 2246822519) & 0xFFFFFFFF
    h ^= h >> 13
    h = (h * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFF) / 65535.0


def wall_face():
    M = (30, 28, 34, 255)
    L = (140, 90, 66, 255)
    HI = (218, 156, 122, 255)
    LE = (198, 132, 100, 255)
    C = (110, 62, 44, 255)
    Sd = (92, 52, 40, 255)
    D = (80, 44, 34, 255)
    CHIP = (66, 36, 28, 255)
    SH = (22, 20, 26, 255)
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    px = img.load()

    def vseam(x, band):
        return x in ((15, 31) if band % 2 == 0 else (7, 23))

    for y in range(S):
        for x in range(S):
            if y == 0:
                px[x, y] = HI
            elif y == 1:
                px[x, y] = LE
            else:
                yy = y - 2
                band, r = divmod(yy, 8)
                if r == 7 or vseam(x, band):
                    px[x, y] = M
                elif r == 0:
                    px[x, y] = HI if rnd(x, y, 11) < 0.2 else L
                elif r in (5, 6):
                    v = D if not (vseam(x - 1, band) or vseam(x + 1, band)) else Sd
                    px[x, y] = CHIP if rnd(x, y, 12) < 0.06 else v
                elif vseam(x - 1, band) or vseam(x + 1, band):
                    px[x, y] = Sd
                else:
                    t = rnd(x, y, 13)
                    if t < 0.05:
                        px[x, y] = CHIP
                    elif t < 0.12:
                        px[x, y] = L
                    else:
                        px[x, y] = C
    for x in range(S):
        px[x, 31] = SH
    img.save(SITE + "top_wall_face.png")
    print("saved", SITE + "top_wall_face.png", img.size)


def side_strip_rgb(img, top_edge, base, dark, seam=None, plank_ys=(), leg_xs=()):
    """Низ 24..31 — тёмный бок: светлая кромка сверху, градиент вниз, швы/ножки, тень снизу."""
    px = img.load()
    for y in range(SIDE_Y, S):
        for x in range(S):
            if y == SIDE_Y:
                px[x, y] = top_edge
            elif y == S - 1:
                px[x, y] = (20, 14, 10)
            else:
                k = (y - SIDE_Y) / (S - 1 - SIDE_Y)
                px[x, y] = tuple(int(b + (d - b) * k) for b, d in zip(base, dark))
                if seam is not None and x % 8 == 7:
                    px[x, y] = seam
                if y in plank_ys:
                    px[x, y] = seam if seam is not None else dark
    for lx in leg_xs:
        for y in range(SIDE_Y + 1, S - 1):
            for dx in (0, 1, 2, 3):
                if 0 <= lx + dx < S:
                    px[lx + dx, y] = dark if dx in (0, 3) else base
    return img


# ---- bed: верх как в art32_furn.bed ----
def bed():
    O = (58, 62, 72, 255)
    WOOD = (139, 94, 52, 255)
    WOOD_L = (160, 112, 64, 255)
    POST = (90, 58, 30, 255)
    POST_D = (60, 38, 20, 255)
    M1 = (205, 205, 215, 255)
    M2 = (168, 173, 190, 255)
    M_SH = (150, 155, 175, 255)
    PIL = (240, 238, 230, 255)
    SEAM = (200, 196, 184, 255)
    SEAM_D = (175, 170, 158, 255)
    GIN = (210, 110, 40, 255)
    GIN_L = (228, 132, 58, 255)
    FOLD = (170, 82, 28, 255)
    FOLD_D = (140, 64, 22, 255)
    EDGE = (150, 70, 25, 255)
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, 31, 31], fill=O)
    d.rectangle([1, 1, 30, 30], fill=WOOD)
    d.rectangle([1, 1, 30, 2], fill=WOOD_L)
    d.rectangle([1, 1, 2, 30], fill=WOOD_L)
    for x0, y0 in ((1, 1), (27, 1), (1, 27), (27, 27)):
        d.rectangle([x0, y0, x0 + 3, y0 + 3], fill=POST)
        d.rectangle([x0, y0, x0 + 1, y0 + 1], fill=POST_D)
    for x in range(6, 26):
        c = M1 if (x // 2) % 2 == 0 else M2
        d.rectangle([x, 4, x, 25], fill=c)
    d.rectangle([6, 9, 25, 10], fill=M_SH)
    d.rectangle([8, 4, 23, 9], fill=PIL)
    d.rectangle([8, 4, 23, 5], fill=(250, 248, 242, 255))
    d.rectangle([9, 6, 22, 7], fill=SEAM)
    d.rectangle([9, 7, 22, 7], fill=SEAM_D)
    d.rectangle([6, 16, 25, 25], fill=GIN)
    d.rectangle([6, 16, 25, 17], fill=GIN_L)
    for fx in (10, 15, 20):
        d.rectangle([fx, 16, fx + 1, 25], fill=FOLD)
        d.rectangle([fx + 1, 16, fx + 1, 25], fill=FOLD_D)
    d.rectangle([6, 24, 25, 25], fill=EDGE)
    img = img.convert("RGB")
    side_strip_rgb(img, top_edge=(160, 112, 64), base=(96, 62, 34),
                   dark=(48, 30, 16), seam=(60, 38, 20),
                   plank_ys=(), leg_xs=(1, 27))
    img.save(SITE + "top_bed.png")
    print("saved", SITE + "top_bed.png", img.size)


# ---- table: верх как в art32_furn.table ----
def table():
    WOOD = (122, 86, 58)
    GRAIN = (96, 64, 40)
    LIGHT = (150, 112, 76)
    EDGE = (196, 158, 112)
    FRAME = (60, 38, 22)
    LEG = (48, 30, 18)
    FLOOR = (205, 205, 214)
    FDARK = (160, 160, 172)
    img = Image.new("RGB", (S, S))
    px = img.load()
    for y in range(S):
        for x in range(S):
            px[x, y] = FLOOR if (x // 4 + y // 4) % 2 == 0 else FDARK
    d = ImageDraw.Draw(img)
    d.rectangle([2, 2, 29, 29], fill=WOOD)
    d.rectangle([2, 2, 29, 29], outline=FRAME)
    d.rectangle([2, 2, 29, 3], fill=EDGE)
    d.rectangle([2, 2, 3, 29], fill=EDGE)
    px[2, 2] = (220, 185, 140)
    for y in (6, 9, 12, 22, 25, 27):
        for x in range(4, 30):
            if (x + y) % 3:
                px[x, y] = GRAIN
    for y in (8, 14, 24):
        for x in range(4, 30):
            if (x * 2 + y) % 4 == 0:
                px[x, y] = LIGHT
    d.ellipse([23, 7, 27, 11], fill=GRAIN)
    d.ellipse([24, 8, 26, 10], fill=LIGHT)
    px[25, 9] = (70, 45, 25)
    for lx, ly in [(2, 2), (26, 2), (2, 26), (26, 26)]:
        d.rectangle([lx, ly, lx + 3, ly + 3], fill=LEG)
        d.rectangle([lx, ly, lx + 1, ly + 1], fill=(30, 18, 10))
    d.ellipse([6, 12, 19, 25], fill=(240, 240, 246), outline=(70, 70, 90))
    d.ellipse([8, 14, 17, 23], fill=(220, 150, 60), outline=(150, 95, 35))
    d.ellipse([10, 15, 14, 19], fill=(235, 170, 85))
    for hx, hy in [(10, 16), (11, 16), (10, 20), (15, 15)]:
        px[hx, hy] = (255, 225, 170)
    px[11, 15] = (255, 245, 220)
    d.ellipse([21, 12, 27, 18], fill=(215, 215, 225), outline=(140, 140, 155))
    px[23, 14] = (255, 255, 255)
    px[24, 14] = (255, 255, 255)
    d.rectangle([23, 18, 25, 26], fill=(200, 200, 210))
    d.rectangle([23, 18, 23, 26], fill=(140, 140, 155))
    d.rectangle([25, 18, 25, 26], fill=(140, 140, 155))
    side_strip_rgb(img, top_edge=(196, 158, 112), base=(86, 60, 38),
                   dark=(40, 26, 15), seam=(60, 40, 24),
                   plank_ys=(28,), leg_xs=(2, 26))
    img.save(SITE + "top_table.png")
    print("saved", SITE + "top_table.png", img.size)


FLOOR = (205, 205, 214)
FDARK = (160, 160, 172)
SH1 = (140, 140, 152)
SH2 = (115, 115, 128)
INK = (35, 25, 18)
WOOD = (122, 86, 58)
GRAIN = (96, 64, 40)
LIGHT = (150, 112, 76)
EDGE = (196, 158, 112)
STEEL = (150, 158, 170)
STEEL_D = (110, 118, 132)
STEEL_L = (210, 218, 230)
STEEL_HL = (240, 245, 250)


def floor_img():
    img = Image.new("RGB", (S, S))
    px = img.load()
    for y in range(S):
        for x in range(S):
            px[x, y] = FLOOR if (x // 4 + y // 4) % 2 == 0 else FDARK
    return img


def shadow(img, x0, y0, x1, y1):
    px = img.load()
    for y in range(y0 + 1, y1 + 1):
        if x1 + 1 < S:
            px[x1 + 1, y] = SH1
    for x in range(x0 + 1, x1 + 2):
        if y1 + 1 < S and x < S:
            px[x, y1 + 1] = SH1
    if x1 + 2 < S:
        for y in range(y0 + 2, y1 + 1):
            px[x1 + 2, y] = SH2
    if y1 + 2 < S:
        for x in range(x0 + 2, x1 + 2):
            if x < S:
                px[x, y1 + 2] = SH2


def rivet(d, x, y):
    d.ellipse([x - 1, y - 1, x + 1, y + 1], fill=STEEL_D, outline=INK)
    d.point((x, y), fill=STEEL_HL)


# ---- bench: верх как в art32_props.bench ----
def bench():
    img = floor_img()
    px = img.load()
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 4, 6, 27, 23
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = STEEL
    for y in range(y0 + 2, y1 - 1, 3):
        for x in range(x0 + 1, x1):
            if (x + y) % 2 == 0:
                px[x, y] = STEEL_D
    for x in range(x0, x1 + 1):
        px[x, y0] = STEEL_HL
        px[x, y0 + 1] = STEEL_L
    for y in range(y0, y1 + 1):
        px[x0, y] = STEEL_L
    d.rectangle([x0, y0, x1, y1], outline=INK)
    for rx, ry in [(x0 + 2, y0 + 3), (x1 - 2, y0 + 3), (x0 + 2, y1 - 2),
                   (x1 - 2, y1 - 2), (x0 + 2, 14), (x1 - 2, 14)]:
        rivet(d, rx, ry)
    d.rectangle([x0 - 1, 10, x0 + 4, 19], fill=STEEL_D, outline=INK)
    d.rectangle([x0 + 5, 12, x0 + 8, 17], fill=STEEL_L, outline=INK)
    for y in range(13, 17):
        px[x0 + 6, y] = INK if y % 2 == 0 else STEEL_D
    px[x0 + 2, 11] = STEEL_HL
    px[x0 + 2, 18] = STEEL_HL
    for i in range(9):
        px[11 + i, 20 - i // 2] = WOOD
        px[11 + i, 21 - i // 2] = GRAIN
    d.rectangle([19, 13, 24, 17], fill=STEEL_D, outline=INK)
    d.rectangle([19, 13, 24, 14], fill=STEEL_L)
    px[20, 16] = STEEL_HL
    for i in range(8):
        px[13 + i, 8 + (i // 4)] = (200, 60, 50)
    d.rectangle([13, 8, 16, 10], fill=(200, 60, 50), outline=INK)
    for i in range(5):
        px[17 + i, 9] = STEEL_HL
        px[17 + i, 10] = STEEL_D
    d.point((21, 9), fill=INK)
    shadow(img, x0 - 1, y0, x1, y1)
    side_strip_rgb(img, top_edge=(210, 218, 230), base=(96, 102, 116),
                   dark=(48, 52, 64), seam=(70, 76, 90),
                   plank_ys=(28,), leg_xs=())
    img.save(SITE + "top_bench.png")
    print("saved", SITE + "top_bench.png", img.size)


# ---- crate: верх как в art32_props.crate ----
def crate():
    img = floor_img()
    px = img.load()
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 5, 5, 26, 26
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = WOOD
    for y in range(y0 + 1, y1):
        for x in range(x0 + 1, x1):
            if (x * 2 + y * 3) % 7 == 0:
                px[x, y] = GRAIN
            elif (x + y * 2) % 9 == 0:
                px[x, y] = LIGHT
    for sy in (10, 16, 22):
        for x in range(x0, x1 + 1):
            px[x, sy] = GRAIN
            if sy + 1 <= y1:
                px[x, sy + 1] = LIGHT
        for x in range(x0, x1 + 1):
            if x % 4 == 0:
                px[x, sy] = INK
    for y in range(y0, y1 + 1):
        px[15, y] = GRAIN
        px[16, y] = LIGHT
    for sy in (10, 16, 22):
        px[15, sy] = INK
        px[16, sy] = INK
    for x in range(x0, x1 + 1):
        px[x, y0] = EDGE
    for y in range(y0, y1 + 1):
        px[x0, y] = EDGE
    d.rectangle([x0, y0, x1, y1], outline=INK)
    for gx, gy in [(7, 7), (24, 7), (7, 24), (24, 24), (15, 13), (15, 19)]:
        d.ellipse([gx - 1, gy - 1, gx + 1, gy + 1], fill=(70, 72, 80), outline=INK)
        d.point((gx, gy), fill=(230, 235, 240))
    shadow(img, x0, y0, x1, y1)
    side_strip_rgb(img, top_edge=(196, 158, 112), base=(86, 60, 38),
                   dark=(40, 26, 15), seam=(60, 40, 24),
                   plank_ys=(28,), leg_xs=())
    # гвозди на боковой грани
    for gx in (8, 23):
        px[gx, 26] = (70, 72, 80)
    img.save(SITE + "top_prop_crate.png")
    print("saved", SITE + "top_prop_crate.png", img.size)


wall_face()
bed()
table()
bench()
crate()
