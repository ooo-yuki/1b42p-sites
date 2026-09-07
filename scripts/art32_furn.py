#!/usr/bin/env python3
"""tulenko 32 точки: мебель сверху — кровать, стол, душ. 32x32 каждый.
Повтор: python3 scripts/art32_furn.py (из корня /root/sites)"""
from PIL import Image, ImageDraw

ROOT = "tulenko.bratuxa.zomb.top/img"
S = 32

def save(img, name):
    p = f"{ROOT}/{name}"
    img.save(p)
    print("saved", p, img.size)

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
    # светлая кромка рамы сверху/слева
    d.rectangle([1, 1, 30, 2], fill=WOOD_L)
    d.rectangle([1, 1, 2, 30], fill=WOOD_L)
    # угловые стойки 4x4
    for x0, y0 in ((1, 1), (27, 1), (1, 27), (27, 27)):
        d.rectangle([x0, y0, x0 + 3, y0 + 3], fill=POST)
        d.rectangle([x0, y0, x0 + 1, y0 + 1], fill=POST_D)
    # матрас в вертикальную полоску 6..25 x 4..25
    for x in range(6, 26):
        c = M1 if (x // 2) % 2 == 0 else M2
        d.rectangle([x, 4, x, 25], fill=c)
    # тень под подушкой и одеялом
    d.rectangle([6, 9, 25, 10], fill=M_SH)
    # подушка 8..23 x 4..9 + шов
    d.rectangle([8, 4, 23, 9], fill=PIL)
    d.rectangle([8, 4, 23, 5], fill=(250, 248, 242, 255))
    d.rectangle([9, 6, 22, 7], fill=SEAM)
    d.rectangle([9, 7, 22, 7], fill=SEAM_D)
    # одеяло 6..25 x 16..25
    d.rectangle([6, 16, 25, 25], fill=GIN)
    d.rectangle([6, 16, 25, 17], fill=GIN_L)
    for fx in (10, 15, 20):
        d.rectangle([fx, 16, fx + 1, 25], fill=FOLD)
        d.rectangle([fx + 1, 16, fx + 1, 25], fill=FOLD_D)
    d.rectangle([6, 24, 25, 25], fill=EDGE)
    save(img, "top_bed.png")

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
    # зерно: горизонтальные штрихи
    for y in (6, 9, 12, 22, 25, 27):
        for x in range(4, 30):
            if (x + y) % 3:
                px[x, y] = GRAIN
    for y in (8, 14, 24):
        for x in range(4, 30):
            if (x * 2 + y) % 4 == 0:
                px[x, y] = LIGHT
    # сучок
    d.ellipse([23, 7, 27, 11], fill=GRAIN)
    d.ellipse([24, 8, 26, 10], fill=LIGHT)
    px[25, 9] = (70, 45, 25)
    # ножки 4x4 по углам
    for lx, ly in [(2, 2), (26, 2), (2, 26), (26, 26)]:
        d.rectangle([lx, ly, lx + 3, ly + 3], fill=LEG)
        d.rectangle([lx, ly, lx + 1, ly + 1], fill=(30, 18, 10))
    # миска: внешнее кольцо, суп, блики
    d.ellipse([6, 12, 19, 25], fill=(240, 240, 246), outline=(70, 70, 90))
    d.ellipse([8, 14, 17, 23], fill=(220, 150, 60), outline=(150, 95, 35))
    d.ellipse([10, 15, 14, 19], fill=(235, 170, 85))
    for hx, hy in [(10, 16), (11, 16), (10, 20), (15, 15)]:
        px[hx, hy] = (255, 225, 170)
    px[11, 15] = (255, 245, 220)
    # ложка справа: черпак + ручка
    d.ellipse([21, 12, 27, 18], fill=(215, 215, 225), outline=(140, 140, 155))
    px[23, 14] = (255, 255, 255)
    px[24, 14] = (255, 255, 255)
    d.rectangle([23, 18, 25, 26], fill=(200, 200, 210))
    d.rectangle([23, 18, 23, 26], fill=(140, 140, 155))
    d.rectangle([25, 18, 25, 26], fill=(140, 140, 155))
    save(img, "top_table.png")

def shower():
    A = (159, 200, 216)
    B = (143, 184, 200)
    GROUT = (90, 122, 138)
    JET = (232, 244, 248)
    img = Image.new("RGB", (S, S))
    px = img.load()
    # кафель 8x8: плитка 8px, шов 1px
    for y in range(S):
        for x in range(S):
            tx, ty = x // 8, y // 8
            base = A if (tx + ty) % 2 == 0 else B
            if x % 8 == 7 or y % 8 == 7:
                px[x, y] = GROUT
            else:
                px[x, y] = base
    d = ImageDraw.Draw(img)
    # труба-крепление сверху
    d.rectangle([14, 0, 18, 3], fill=(42, 56, 63))
    # лейка: круг центр (16,7) r=6
    d.ellipse([10, 1, 22, 13], fill=(58, 74, 82), outline=(42, 56, 63))
    d.ellipse([12, 3, 20, 11], fill=(70, 88, 97))
    for hx, hy in [(13, 7), (16, 7), (19, 7), (14, 9), (18, 9),
                   (16, 5), (13, 5), (19, 5), (15, 10), (17, 10)]:
        px[hx, hy] = JET
    # струи: пунктирные вертикали + капли
    for jx in (12, 16, 20):
        for jy in range(14, 24, 2):
            px[jx, jy] = JET
            if jx != 16:
                px[jx + 1, jy + 1] = (200, 225, 235)
    for jx, jy in [(14, 15), (18, 17), (14, 21), (18, 23)]:
        px[jx, jy] = (200, 225, 235)
    # лужа снизу + блик
    d.ellipse([8, 24, 24, 31], fill=(207, 234, 242), outline=(150, 190, 205))
    d.ellipse([11, 26, 21, 30], fill=(220, 240, 248))
    for hx in (12, 13, 14):
        px[hx, 27] = (255, 255, 255)
    px[18, 29] = (255, 255, 255)
    save(img, "top_shower.png")

bed()
table()
shower()
