#!/usr/bin/env python3
"""tulenko закон красоты: 8 клеток 32x32 RGBA по PIXEL_STANDARD.

Те же сюжеты: top_floor=плиты, top_floor_food=шахматка, top_floor_wash=кафель,
top_floor_cell=доски, top_wall=кирпич, top_wall_face=лицо стены, top_door=дверь,
top_roof=рубероид. Свет слева сверху (HL #F0D294 верх/лево, SH #704858 низ/право),
обводка INK #2E1E14 (чёрного нет), сколы и зерно штрихами-кластерами >=2px,
без диттеринга и подушки. Углы прозрачные у полов (1px), стены/дверь/крыша встык.
Повтор: python3 scripts/artHD_tiles.py (запуск из корня /root/sites).
"""
from PIL import Image

BASE = "tulenko.bratuxa.zomb.top/img"
S = 32

INK = (46, 30, 20, 255)
HL = (240, 210, 148, 255)
SH = (112, 72, 88, 255)
DEEP = (70, 46, 66, 255)


def rnd(x, y, s):
    h = (x * 374761393 + y * 668265263 + s * 2246822519) & 0xFFFFFFFF
    h ^= h >> 13
    h = (h * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFF) / 65535.0


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def bevel(px, x0, y0, x1, y1):
    """Фаска по закону: свет верх/лево, тень низ/право. Без подушки."""
    for x in range(x0, x1 + 1):
        px[x, y0] = HL
        px[x, y1] = SH
    for y in range(y0, y1 + 1):
        px[x0, y] = HL
        px[x1, y] = SH


def grain_h(px, x, y, n, col, x1lim):
    n = min(n, x1lim - x + 1)
    for i in range(max(n, 2)):
        px[x + i, y] = col


def grain_v(px, x, y, n, col, y1lim):
    n = min(n, y1lim - y + 1)
    for i in range(max(n, 2)):
        px[x, y + i] = col


def chip(px, x, y, dark):
    """Скол 2px кластером + светлая кромка сверху слева."""
    px[x, y] = dark
    px[x + 1, y] = dark
    px[x, y - 1] = HL


def corners_clear(img):
    px = img.load()
    for x, y in ((0, 0), (31, 0), (0, 31), (31, 31)):
        px[x, y] = (0, 0, 0, 0)


def slab_field(name, pal_mid, pal_light, seam, seed, wood=False, glint=False):
    """Полы 2x2 плиты 14px, шов 2px (15..16), кант 1px INK."""
    img = new()
    px = img.load()
    for y in range(S):
        for x in range(S):
            px[x, y] = seam
    slabs = [(1, 1), (17, 1), (1, 17), (17, 17)]
    for i, (sx, sy) in enumerate(slabs):
        face = pal_light if i in (0, 3) else pal_mid
        dark = tuple(int(v * 0.82) for v in face) + (255,)
        face = face + (255,)
        for y in range(sy, sy + 14):
            for x in range(sx, sx + 14):
                px[x, y] = face
        bevel(px, sx, sy, sx + 13, sy + 13)
        # зерно: редкие штрихи 2-3px
        for gy in range(sy + 2, sy + 12):
            for gx in range(sx + 2, sx + 10):
                t = rnd(gx, gy, seed + i)
                if wood:
                    if t < 0.10:
                        grain_h(px, gx, gy, 3 if t < 0.04 else 2, dark, sx + 12)
                else:
                    if t < 0.06:
                        grain_h(px, gx, gy, 2, dark, sx + 12)
        # сколы: 2 на плиту, кластером
        for c in range(2):
            cx = sx + 2 + int(rnd(c, i, seed + 90) * 9)
            cy = sy + 3 + int(rnd(i, c, seed + 91) * 8)
            chip(px, cx, cy, seam if len(seam) == 4 else seam + (255,))
        if glint:  # кафельный блик: короткий штрих-кластер слева сверху
            gx, gy = sx + 3, sy + 3
            for dx, dy in ((0, 0), (1, 0), (0, 1), (1, 1), (2, 1)):
                px[gx + dx, gy + dy] = (235, 244, 250, 255)
    # кант клетки INK, углы прозрачные
    for x in range(1, S - 1):
        px[x, 0] = INK
        px[x, S - 1] = INK
    for y in range(1, S - 1):
        px[0, y] = INK
        px[S - 1, y] = INK
    corners_clear(img)
    img.save(f"{BASE}/{name}.png")
    print("saved", name)


def floors():
    slab_field("top_floor", (191, 192, 201), (205, 205, 214),
               (142, 143, 152), seed=10)
    slab_field("top_floor_food", (214, 207, 192), (233, 229, 219),
               (158, 149, 132), seed=20)
    slab_field("top_floor_wash", (126, 169, 199), (152, 191, 216),
               (79, 114, 144), seed=30, glint=True)


def cell():
    """Доски: горизонтальные плахи 8px + щели INK, зерно вдоль."""
    img = new()
    px = img.load()
    MID, LIGHT, SEAM = (163, 123, 79), (179, 139, 93), (108, 78, 48)
    dark = (132, 96, 60, 255)
    for y in range(S):
        band, r = divmod(y, 8)
        for x in range(S):
            if r == 7 or y in (0, 31):
                px[x, y] = INK if y in (0, 31) and x > 0 and x < 31 else SEAM + (255,)
            elif r == 0:
                px[x, y] = HL if x > 0 else INK
            elif r in (5, 6):
                px[x, y] = SH if r == 6 and 0 < x < 31 else (LIGHT + (255,) if x % 2 else MID + (255,))
            else:
                px[x, y] = LIGHT + (255,) if (x + band) % 2 else MID + (255,)
    for y in range(S):
        if y % 8 in (1, 2, 3, 4):
            px[0, y] = HL
            if S - 1 > 0:
                px[S - 1, y] = SH
    # зерно вдоль досок + сколы
    for y in range(2, 30):
        if y % 8 == 7:
            continue
        for x in range(2, 28):
            t = rnd(x, y, 44)
            if t < 0.08:
                grain_h(px, x, y, 3 if t < 0.03 else 2, dark, 30)
    for c in range(4):
        cx = 3 + int(rnd(c, 7, 45) * 25)
        cy = 2 + int(rnd(7, c, 46) * 27)
        if cy % 8 != 7:
            chip(px, cx, cy, SEAM + (255,))
    for x in range(1, S - 1):
        px[x, 0] = INK
        px[x, S - 1] = INK
    for y in range(1, S - 1):
        px[0, y] = HL if px[0, y] != INK else INK
        px[S - 1, y] = SH
    corners_clear(img)
    img.save(f"{BASE}/top_floor_cell.png")
    print("saved top_floor_cell")


def brick(px, courses=4, h=8, seed=0, face=False):
    M = (48, 46, 54, 255)
    L = (198, 132, 100, 255)
    C = (158, 92, 66, 255)
    Sd = (132, 74, 56, 255)
    D = (116, 62, 48, 255)
    CHIP = (96, 50, 38, 255)

    def vseam(x, band):
        return x in ((15, 31) if band % 2 == 0 else (7, 23))

    for y in range(S):
        band, r = divmod(y, h)
        for x in range(S):
            if r == 7 or vseam(x, band):
                px[x, y] = M
            elif r == 0:
                px[x, y] = HL if not (vseam(x - 1, band) or vseam(x + 1, band)) else M
            elif r in (5, 6):
                v = D if not (vseam(x - 1, band) or vseam(x + 1, band)) else Sd
                px[x, y] = CHIP if rnd(x, y, seed + 2) < 0.06 else (SH if r == 6 and v == D else v)
            elif vseam(x - 1, band) or vseam(x + 1, band):
                px[x, y] = Sd
            else:
                t = rnd(x, y, seed + 3)
                if t < 0.05:
                    px[x, y] = CHIP
                elif t < 0.12:
                    px[x, y] = L
                else:
                    px[x, y] = C
    # штрихи-зерно на кирпиче + пара сколов с кромкой
    for y in range(2, 30):
        for x in range(2, 29):
            if px[x, y][0] > 140 and rnd(x, y, seed + 5) < 0.05:
                grain_h(px, x, y, 2, Sd, 30)
    for c in range(3):
        cx = 3 + int(rnd(c, 1, seed + 6) * 25)
        cy = 2 + int(rnd(1, c, seed + 7) * 27)
        if px[cx, cy] not in (M, HL, SH):
            chip(px, cx, cy, CHIP)
    px[15, 7] = INK
    px[7, 15] = INK
    if face:
        # лицо стены: два глазных гнезда + щель рта, резные, со светом сверху
        for ex in (9, 20):
            for dy in range(3):
                for dx in range(4):
                    px[ex + dx, 12 + dy] = DEEP
            for dx in range(4):
                px[ex + dx, 12] = HL
                px[ex + dx, 14] = INK
            px[ex - 1, 13] = INK
            px[ex + 4, 13] = INK
            px[ex + 1, 13] = (200, 170, 120, 255)
        for dx in range(8):
            px[11 + dx, 22] = DEEP
            px[11 + dx, 21] = INK
        for dx in range(8):
            if dx % 2 == 0:
                px[11 + dx, 22] = INK


def walls():
    img = new()
    brick(img.load(), seed=100)
    img.save(f"{BASE}/top_wall.png")
    print("saved top_wall")
    img2 = new()
    brick(img2.load(), seed=200, face=True)
    img2.save(f"{BASE}/top_wall_face.png")
    print("saved top_wall_face")


def door():
    img = new()
    px = img.load()
    FR, FRD = (58, 62, 72, 255), (30, 32, 40, 255)
    BL, BM, BD = (225, 178, 120, 255), (146, 104, 66, 255), (96, 62, 38, 255)
    GAP = INK
    MT, MTL, RV = (170, 170, 182, 255), (230, 230, 238, 255), (60, 62, 70, 255)
    for y in range(S):
        for x in range(S):
            edge = min(x, 31 - x, y, 31 - y)
            if edge < 2:
                if edge == 0:
                    px[x, y] = FR
                else:
                    px[x, y] = HL if (y == 1 and 1 < x < 30) or (x == 1 and 1 < y < 30) else (SH if (y == 30 - 1 or x == 30 - 1) else FRD)
                continue
            bx = x - 2
            if bx % 4 == 3 or y in (1, 2, 29, 30):
                px[x, y] = GAP
                continue
            t = rnd(x, y, 11)
            if y == 3:
                px[x, y] = HL if px[x, y] != GAP else GAP
            elif rnd(x // 1, 0, 12 + (bx % 4)) < 0.30:
                px[x, y] = BD
            elif t < 0.18:
                px[x, y] = BL
            elif t < 0.30:
                px[x, y] = BM
            else:
                px[x, y] = BM if (x + y) % 2 else BD
    # зерно вдоль досок
    for y in range(4, 28):
        for x in range(3, 28):
            if px[x, y] != GAP and rnd(x, y, 13) < 0.07:
                grain_v(px, x, y, 2, BD, 28)
    # скобы с заклёпками + кольцо
    for by in (8, 22):
        for x in range(2, 30):
            px[x, by] = MT
            px[x, by + 1] = MT
        for x in range(2, 30):
            px[x, by] = MTL
        for x in range(2, 30):
            if x % 4 == 3:
                px[x, by + 1] = SH
        for rx in (4, 27):
            px[rx, by] = RV
            px[rx + 1, by] = RV
            px[rx, by + 1] = RV
            px[rx + 1, by + 1] = RV
            px[rx, by - 1] = HL
    for dx, dy in ((0, 0), (1, 0), (0, 1), (1, 1)):
        px[15 + dx, 15 + dy] = INK
    for x in range(14, 18):
        px[x, 14] = HL
        px[x, 18] = SH
    for y in range(14, 19):
        px[14, y] = HL
        px[18, y] = SH
    img.save(f"{BASE}/top_door.png")
    print("saved top_door")


def roof():
    img = new()
    px = img.load()
    BAS = (62, 66, 71, 255)
    RDK = (44, 47, 52, 255)
    WEAR = (108, 104, 90, 255)
    for y in range(S):
        band, r = divmod(y, 8)
        for x in range(S):
            edge = min(x, 31 - x, y, 31 - y)
            if edge < 2:
                px[x, y] = (140, 145, 150, 255) if edge == 0 else (105, 109, 114, 255)
                continue
            if r == 7:
                px[x, y] = INK
            elif r == 0:
                px[x, y] = HL
            elif r == 6:
                px[x, y] = SH
            else:
                t = rnd(x, y, 42 + band)
                px[x, y] = WEAR if t < 0.08 else (RDK if t < 0.20 else BAS)
    for x in range(1, 31):
        px[x, 1] = HL
        px[x, 30] = SH
    for y in range(1, 31):
        px[1, y] = HL
        px[30, y] = SH
    # потёртости штрихами + сколы
    for y in range(3, 29):
        for x in range(3, 28):
            if px[x, y] == BAS and rnd(x, y, 49) < 0.06:
                grain_h(px, x, y, 2, WEAR, 30)
    for c in range(3):
        cx = 3 + int(rnd(c, 3, 50) * 25)
        cy = 3 + int(rnd(3, c, 51) * 24)
        if px[cx, cy] == BAS:
            chip(px, cx, cy, RDK)
    img.save(f"{BASE}/top_roof.png")
    print("saved top_roof")


if __name__ == "__main__":
    floors()
    cell()
    walls()
    door()
    roof()
