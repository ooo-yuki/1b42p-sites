#!/usr/bin/env python3
"""32 точки: стены top_wall / top_door / top_roof (32x32 RGBA).

top_wall: кирпич рядами 16x8, ложковая перевязка (сдвиг 8px через ряд).
  Шов M (48,46,54); верх кирпича L (198,132,100) + блик; тело C (158,92,66);
  бока S (132,74,56) у швов; низ D (116,62,48); сколы детерминированным шумом.
top_door: доски ВДОЛЬ (вертикальные, ширина 4px), рама (58,62,72);
  две скобы-металл (170,170,182) с заклёпками, кольцо в центре.
top_roof: рубероид полосами (горизонтальные, высота 8px) + парапет 2px по краю.
Повтор: python3 scripts/art32_walls.py
"""
from PIL import Image

SITE = "tulenko.bratuxa.zomb.top/img/"
OUT_WALL = SITE + "top_wall.png"
OUT_DOOR = SITE + "top_door.png"
OUT_ROOF = SITE + "top_roof.png"
W = H = 32


def rnd(x, y, s):
    h = (x * 374761393 + y * 668265263 + s * 2246822519) & 0xFFFFFFFF
    h ^= h >> 13
    h = (h * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFF) / 65535.0


def wall():
    M = (48, 46, 54, 255)
    L = (198, 132, 100, 255)
    HI = (218, 156, 122, 255)
    C = (158, 92, 66, 255)
    S = (132, 74, 56, 255)
    D = (116, 62, 48, 255)
    CHIP = (96, 50, 38, 255)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = img.load()

    def vseam(x, band):
        return x in ((15, 31) if band % 2 == 0 else (7, 23))

    for y in range(H):
        band, r = divmod(y, 8)
        for x in range(W):
            if r == 7 or vseam(x, band):
                px[x, y] = M
            elif r == 0:
                px[x, y] = HI if rnd(x, y, 1) < 0.35 else L
            elif r in (5, 6):
                v = D if not (vseam(x - 1, band) or vseam(x + 1, band)) else S
                px[x, y] = CHIP if rnd(x, y, 2) < 0.06 else v
            elif vseam(x - 1, band) or vseam(x + 1, band):
                px[x, y] = S
            else:
                t = rnd(x, y, 3)
                if t < 0.05:
                    px[x, y] = CHIP
                elif t < 0.12:
                    px[x, y] = L
                else:
                    px[x, y] = C
    img.save(OUT_WALL)
    print("saved", OUT_WALL, img.size)


def door():
    FR = (58, 62, 72, 255)
    FRD = (30, 32, 40, 255)
    BL = (225, 178, 120, 255)
    BM = (146, 104, 66, 255)
    BD = (96, 62, 38, 255)
    GAP = (26, 18, 12, 255)
    MT = (170, 170, 182, 255)
    MTL = (230, 230, 238, 255)
    RV = (60, 62, 70, 255)
    RG = (90, 92, 104, 255)
    HOLE = (20, 14, 10, 255)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = img.load()
    # поле досок: x 2..29, рама 2px по краю
    for y in range(H):
        for x in range(W):
            edge = min(x, 31 - x, y, 31 - y)
            if edge < 2:
                px[x, y] = FR if edge == 0 else FRD
                continue
            bx = x - 2  # 0..27, доска 4px + шов каждый 4-й
            if bx % 4 == 3:
                px[x, y] = GAP
                continue
            if y in (1, 2, 29, 30):
                px[x, y] = GAP
                continue
            t = rnd(x, y, 11)
            # зерно: вертикальные прожилки
            if rnd(x // 1, 0, 12 + (bx % 4)) < 0.30:
                px[x, y] = BD
            elif t < 0.18:
                px[x, y] = BL
            elif t < 0.30:
                px[x, y] = BD
            else:
                px[x, y] = BM
            # сучки: пара тёмных пятен
            if (x, y) in ((9, 6), (22, 24), (9, 7), (22, 25)):
                px[x, y] = BD
            if (x, y) in ((10, 6), (23, 24)):
                px[x, y] = GAP
    # скобы: ряды y 8..11 и 20..23
    for y0 in (8, 20):
        for x in range(2, 30):
            for y in range(y0, y0 + 4):
                if y in (y0, y0 + 3):
                    px[x, y] = MTL if y == y0 else RV
                else:
                    px[x, y] = MT
        for rx in (4, 12, 19, 27):
            px[rx, y0 + 1] = RV
            px[rx, y0 + 2] = MTL
    # кольцо в центре (16,16) r=4, толщина 2
    for y in range(10, 23):
        for x in range(10, 22):
            d = ((x - 16) ** 2 + (y - 16) ** 2) ** 0.5
            if 3.0 <= d <= 5.0:
                px[x, y] = RG if rnd(x, y, 13) < 0.6 else MTL
            elif d < 3.0 and 1.0 <= d:
                px[x, y] = HOLE
    # крепления кольца
    for (x, y) in ((16, 10), (16, 11)):
        px[x, y] = RV
    img.save(OUT_DOOR)
    print("saved", OUT_DOOR, img.size)


def roof():
    P = (140, 145, 150, 255)
    PE = (105, 109, 114, 255)
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = img.load()
    for y in range(H):
        for x in range(W):
            edge = min(x, 31 - x, y, 31 - y)
            if edge == 0:
                px[x, y] = P
            elif edge == 1:
                px[x, y] = PE
                continue
            else:
                band = (y - 2) // 8  # полосы рубероида высотой 8
                base = 74 + (band % 2) * 8 + (x % 8 == 7) * -12
                t = rnd(x, y, 21)
                v = base + int(t * 22) - 8
                # светлый блик верха полосы
                if (y - 2) % 8 == 0:
                    v += 18
                # тень низа полосы
                if (y - 2) % 8 == 7:
                    v -= 16
                # вкрапления крошки
                if t > 0.93:
                    v += 30
                elif t < 0.07:
                    v -= 18
                v = max(34, min(140, v))
                px[x, y] = (v, v + 4, v + 8, 255)
    # заклёпки парапета по углам и серединам
    for (x, y) in ((0, 0), (31, 0), (0, 31), (31, 31),
                   (15, 0), (16, 0), (15, 31), (16, 31),
                   (0, 15), (0, 16), (31, 15), (31, 16)):
        px[x, y] = (70, 73, 78, 255)
    img.save(OUT_ROOF)
    print("saved", OUT_ROOF, img.size)


wall()
door()
roof()
