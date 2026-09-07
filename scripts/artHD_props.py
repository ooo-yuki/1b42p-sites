#!/usr/bin/env python3
"""tulenko вещи по закону: 8 спрайтов 32x32 RGBA одним почерком.

Закон (scripts/PIXEL_STANDARD.md): свет слева сверху (фаска HL #F0D294),
тень справа/снизу к фиолету (SH #704858), обводка INK #2E1E14 (чёрная запрещена),
вид три четверти, гвоздь с искрой, мягкая фиолет-тень под объектом,
запрет подушки, кластеры >= 2 px (кроме искры), без дизеринга, фон прозрачный.

Те же сюжеты что были: поднос с едой, плакат-закат, плакат-ночь, крышка бочки,
вагонетка с углём, настенный факел, открытый ящик с тряпками, ящик с мешком.
"""
from PIL import Image

BASE = "/root/sites/tulenko.bratuxa.zomb.top/img"
S = 32

INK = (46, 30, 20, 255)
WOOD = (140, 98, 60, 255)
WOOD_TOP = (166, 122, 78, 255)
FRAME = (172, 128, 80, 255)
HL = (240, 210, 148, 255)
GRAIN = (102, 68, 44, 255)
SH = (112, 72, 88, 255)
DEEP = (70, 46, 66, 255)
NAIL = (58, 40, 30, 255)
SPARK = (232, 222, 200, 255)
HOLE = (38, 26, 30, 255)
SHADOW = (50, 34, 70)

PLATE, SOUP, SOUP_D = (222, 206, 176, 255), (214, 140, 72, 255), (170, 100, 84, 255)
MUG, MUG_D, BREAD = (150, 104, 64, 255), (110, 76, 88, 255), (206, 164, 104, 255)
APPLE, APPLE_D, APPLE_L = (178, 72, 60, 255), (130, 52, 66, 255), (232, 170, 140, 255)
STEAM = (216, 202, 180, 255)

SKY1, SKY2, SKY3 = (240, 200, 120, 255), (230, 140, 80, 255), (190, 86, 80, 255)
SUN = (244, 224, 160, 255)
SEA1, SEA2 = (70, 120, 150, 255), (50, 88, 120, 255)
MOUNT = (96, 62, 88, 255)
BAND = (140, 52, 60, 255)
NSKY, NMOON = (36, 52, 96, 255), (232, 220, 180, 255)
NSEA, NGLINT = (52, 110, 150, 255), (190, 210, 220, 255)
STAR = (220, 216, 200, 255)

HOOP, HOOP_L = (110, 100, 120, 255), (180, 172, 190, 255)
PLUG = (120, 84, 52, 255)

COAL, COAL_L = (48, 40, 58, 255), (96, 88, 120, 255)
WHEEL, TIRE = (120, 88, 56, 255), (84, 66, 88, 255)

HANDLE = (130, 92, 56, 255)
BOWL, BOWL_D = (96, 64, 60, 255), (66, 46, 66, 255)
FLY, FLO, FLR = (246, 214, 120, 255), (224, 128, 56, 255), (168, 72, 52, 255)

RAG_R, RAG_RD, RAG_RL = (158, 76, 72, 255), (112, 52, 52, 255), (198, 132, 118, 255)
RAG_B, RAG_BD, RAG_BL = (110, 120, 140, 255), (78, 88, 108, 255), (158, 172, 196, 255)
RAG_T, RAG_TD, RAG_TL = (180, 158, 118, 255), (138, 118, 82, 255), (220, 200, 160, 255)
SACK, SACK_D, SACK_L = (178, 152, 108, 255), (140, 112, 118, 255), (220, 198, 152, 255)
ROPE, ROPE_D = (192, 172, 122, 255), (150, 126, 86, 255)


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def rect(img, x0, y0, x1, y1, fill):
    px = img.load()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if 0 <= x < S and 0 <= y < S:
                px[x, y] = fill


def box(img, x0, y0, x1, y1, fill):
    rect(img, x0, y0, x1, y1, INK)
    rect(img, x0 + 1, y0 + 1, x1 - 1, y1 - 1, fill)


def soft_shadow(img, x0, x1, y):
    px = img.load()
    for dx, dy, a in [(1, 0, 40), (0, 1, 28), (1, 2, 16)]:
        for x in range(x0 + dx + 1, x1 - dx):
            if 0 <= x < S and 0 <= y + dy < S:
                r, g, b, al = px[x, y + dy]
                px[x, y + dy] = (SHADOW[0], SHADOW[1], SHADOW[2],
                                 max(al, a) if al else a)


def nail(img, cx, cy):
    px = img.load()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            px[cx + dx, cy + dy] = INK
    px[cx, cy] = NAIL
    px[cx - 1, cy] = NAIL
    px[cx, cy - 1] = NAIL
    px[cx + 1, cy] = NAIL
    px[cx, cy + 1] = NAIL
    px[cx - 1, cy - 1] = SPARK


def grain(img, x0, y0, x1, y1, seed=0):
    px = img.load()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x * 7 + y * 13 + seed) % 17 == 0 and x + 2 <= x1 and y + 1 <= y1:
                if px[x, y][3] and px[x, y] != INK:
                    px[x, y] = GRAIN
                    px[x + 1, y] = GRAIN
                    if (x + y) % 2 == 0 and x + 2 <= x1:
                        px[x + 2, y] = GRAIN
                    else:
                        px[x + 1, y + 1] = GRAIN


def brace(img, x0, y0, x1, y1):
    px = img.load()
    n, h = x1 - x0, y1 - y0
    for side in (0, 1):
        for i in range(n + 1):
            t = i / max(n, 1)
            y = y0 + round(t * h) if side == 0 else y1 - round(t * h)
            x = x0 + i
            if y0 <= y <= y1 and px[x, y] != INK:
                px[x, y] = FRAME
            if y0 <= y + 1 <= y1 and px[x, y + 1] != INK:
                px[x, y + 1] = INK


def frame(img, x0, y0, x1, y1, field, seed=2):
    """Лоб: рама + фаска HL сверху/слева + тень SH снизу/справа + гвозди."""
    box(img, x0, y0, x1, y1, FRAME)
    px = img.load()
    for x in range(x0 + 1, x1):
        px[x, y0 + 1] = HL
    for y in range(y0 + 1, y1):
        px[x0 + 1, y] = HL
        px[x1 - 1, y] = SH
    for x in range(x0 + 1, x1):
        px[x, y1 - 1] = SH
    rect(img, x0 + 3, y0 + 3, x1 - 3, y1 - 3, field)
    grain(img, x0 + 3, y0 + 3, x1 - 3, y1 - 3, seed=seed)
    for nx, ny in [(x0 + 2, y0 + 2), (x1 - 2, y0 + 2),
                   (x0 + 2, y1 - 2), (x1 - 2, y1 - 2)]:
        nail(img, nx, ny)


def lid(img, x0, y0, x1, y1):
    box(img, x0, y0, x1, y1, WOOD_TOP)
    px = img.load()
    for x in range(x0 + 1, x1):
        px[x, y0 + 1] = HL
    for y in range(y0 + 1, y1):
        px[x0 + 1, y] = HL
        px[x1 - 1, y] = SH
    grain(img, x0 + 1, y0 + 2, x1 - 1, y1 - 1, seed=9)


def curl(img, x, y0, y1, flip=False):
    """Пар завитком: S-изгиб колонкой 2 px, верх тоньше. Кластеры >= 2."""
    px = img.load()
    h = y1 - y0
    for i, y in enumerate(range(y0, y1 + 1)):
        t = i / max(h, 1)
        dx = 0 if t < 0.35 else (1 if (t < 0.7) != flip else -1)
        if t > 0.85:
            xx = x + dx + 1
            if 0 <= xx < S and 0 <= y < S and px[xx, y][3] == 0:
                px[xx, y] = STEAM
            continue
        for xx in (x + dx, x + dx + 1):
            if 0 <= xx < S and 0 <= y < S and px[xx, y][3] == 0:
                px[xx, y] = STEAM


# --- 1. Поднос с едой: верхняя грань с едой + лоб, пар завитками ---
def food():
    img = new()
    px = img.load()
    soft_shadow(img, 4, 27, 27)
    # лоб подноса
    frame(img, 4, 20, 27, 26, WOOD, seed=4)
    # верхняя грань
    box(img, 5, 9, 26, 19, WOOD_TOP)
    for x in range(6, 26):
        px[x, 10] = HL
    for y in range(10, 19):
        px[6, y] = HL
        px[25, y] = SH
    # тарелка с похлёбкой слева
    for y in range(11, 18):
        for x in range(7, 15):
            dx, dy = (x - 10.5) / 3.6, (y - 14) / 2.8
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = PLATE
    for y in range(12, 17):
        for x in range(8, 14):
            dx, dy = (x - 10.5) / 2.5, (y - 14) / 2.0
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = SOUP
    px[9, 13] = HL
    px[10, 13] = HL
    px[12, 15] = SOUP_D
    px[11, 15] = SOUP_D
    for y in range(11, 18):  # контур тарелки 1 px
        for x in range(7, 15):
            dx, dy = (x - 10.5) / 3.6, (y - 14) / 2.8
            if 0.82 <= dx * dx + dy * dy <= 1.0:
                px[x, y] = INK
    # кружка справа сверху
    box(img, 16, 10, 21, 15, MUG)
    for x in range(17, 21):
        px[x, 11] = HL
    for y in range(11, 15):
        px[20, y] = MUG_D
    px[17, 12] = INK
    px[18, 12] = INK  # ручка-загиб кластером
    px[17, 13] = INK
    # булка снизу по центру
    for x in range(15, 22):
        px[x, 17] = BREAD
        px[x, 18] = BREAD
    px = img.load()
    box(img, 15, 16, 21, 18, BREAD)
    px[16, 16] = HL
    px[17, 16] = HL
    px[20, 17] = GRAIN
    # яблоко справа снизу
    for y in range(15, 19):
        for x in range(22, 26):
            dx, dy = (x - 23.5) / 1.8, (y - 16.5) / 1.8
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = APPLE
    px[23, 18] = APPLE_D
    px[24, 18] = APPLE_D
    px[22, 15] = APPLE_L
    px[23, 15] = APPLE_L
    px[24, 14] = GRAIN  # черенок кластером
    px[24, 15] = GRAIN
    curl(img, 9, 4, 7)
    curl(img, 12, 3, 7, flip=True)
    return img


# --- 2/3. Плакаты: рама INK + фаска HL слева/сверху, гвозди по углам ---
def poster_base(sky_bands, sun_xy, sun_r, sun_col, birds, sea_glints, bottom):
    img = new()
    px = img.load()
    soft_shadow(img, 6, 25, 29)
    box(img, 7, 2, 24, 28, FRAME)
    for x in range(8, 24):
        px[x, 3] = HL
    for y in range(3, 28):
        px[8, y] = HL
        px[23, y] = SH
    for x in range(8, 24):
        px[x, 27] = SH
    # картина внутри
    for i, (y0, y1, col) in enumerate(sky_bands):
        rect(img, 10, y0, 21, y1, col)
    sx, sy = sun_xy
    for y in range(sy - sun_r, sy + sun_r + 1):
        for x in range(sx - sun_r, sx + sun_r + 1):
            dx, dy = x - sx, y - sy
            if dx * dx + dy * dy <= sun_r * sun_r and 10 <= x <= 21:
                px[x, y] = sun_col
    px[sx - 1, sy - 1] = HL
    px[sx, sy - 1] = HL
    for bx, by in birds:  # чайки: галочки кластерами 3 px
        px[bx, by] = INK
        px[bx + 1, by - 1] = INK
        px[bx + 2, by] = INK
    for y0, y1, col in [(18, 20, SEA1), (21, 23, SEA2)]:
        rect(img, 10, y0, 21, y1, col)
    for gx, gy, gl in sea_glints:
        px[gx, gy] = gl
        px[gx + 1, gy] = gl
    rect(img, 10, 24, 21, 26, bottom)
    px[10, 24] = HL
    px[11, 24] = HL
    for nx, ny in [(9, 3), (22, 3), (9, 26), (22, 26)]:
        nail(img, nx, ny)
    return img


def poster():
    return poster_base(
        [(5, 9, SKY1), (10, 13, SKY2), (14, 17, SKY3)],
        (15, 13), 3, SUN,
        [(11, 8), (18, 7)], [(13, 19, HL), (16, 21, HL)], BAND)


def poster_1():
    img = poster_base(
        [(5, 17, NSKY)], (16, 9), 3, NMOON,
        [], [(13, 19, NGLINT), (15, 21, NGLINT), (14, 20, NGLINT)], SEA2)
    px = img.load()
    for sx, sy in [(11, 6), (20, 6), (13, 12), (19, 13), (11, 15)]:  # звёзды парами
        px[sx, sy] = STAR
        px[sx + 1, sy] = STAR
    px[15, 8] = GRAIN
    px[17, 10] = GRAIN
    return img


# --- 4. Крышка бочки сверху: круг, доски, обручи, пробка ---
def barrel():
    img = new()
    px = img.load()
    soft_shadow(img, 5, 26, 28)
    cx, cy, r = 15.5, 14.5, 10.0
    for y in range(3, 27):  # лицо крышки
        for x in range(4, 28):
            dx, dy = (x - cx) / r, (y - cy) / r
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = WOOD_TOP
    for y in range(3, 27):  # обруч: сплошное кольцо 2 px
        for x in range(4, 28):
            dx, dy = (x - cx) / r, (y - cy) / r
            d = dx * dx + dy * dy
            if 0.63 <= d <= 0.71:
                s = (x - cx) + (y - cy)
                px[x, y] = HOOP_L if s < -2 else (SH if s > 3 else HOOP)
    for gx in (12, 16, 20):  # вертикальные щели досок внутри обруча
        for y in range(3, 27):
            dx, dy = (gx - cx) / r, (y - cy) / r
            if dx * dx + dy * dy < 0.55:
                px[gx, y] = INK
    for y in range(3, 27):  # светлая кромка сверху/слева, тень снизу/справа
        for x in range(4, 28):
            dx, dy = (x - cx) / r, (y - cy) / r
            d = dx * dx + dy * dy
            s = (x - cx) + (y - cy)
            if 0.78 <= d <= 0.95 and -9 <= s <= -5 and px[x, y] != INK:
                px[x, y] = HL
            elif 0.78 <= d <= 0.95 and 5 <= s <= 9 and px[x, y] != INK:
                px[x, y] = SH
    for y in range(3, 27):  # контур 1 px
        for x in range(4, 28):
            dx, dy = (x - cx) / r, (y - cy) / r
            if 0.90 <= dx * dx + dy * dy <= 1.0:
                px[x, y] = INK
    box(img, 14, 13, 17, 16, PLUG)  # пробка
    px[15, 14] = HL
    return img


# --- 5. Вагонетка с углём три четверти: кузов + колесо + ручки ---
def cart():
    img = new()
    px = img.load()
    soft_shadow(img, 5, 26, 29)
    # ручки вверх по бокам
    for y in range(6, 12):
        px[5, y] = HANDLE
        px[6, y] = INK if y in (6, 11) else HANDLE
        px[26, y] = HANDLE
        px[25, y] = INK if y in (6, 11) else HANDLE
    rect(img, 5, 6, 6, 6, HL)
    rect(img, 25, 6, 26, 6, HL)
    # верхняя грань кузова
    box(img, 6, 9, 25, 13, WOOD_TOP)
    for x in range(7, 25):
        px[x, 10] = HL
    # уголь горкой
    for y in range(4, 10):
        for x in range(8, 24):
            if 10 - abs(x - 16) * 0.55 <= y <= 9 and (x + y) % 3 != 0:
                px[x, y] = COAL
    for x in range(10, 20, 2):
        px[x, 5] = COAL_L
    px[12, 6] = COAL_L
    px[13, 6] = COAL_L
    px[18, 7] = COAL_L
    # лоб кузова с рамой
    frame(img, 6, 13, 25, 21, WOOD, seed=6)
    # колесо
    cx, cy, r = 16, 24, 4.2
    for y in range(20, 29):
        for x in range(11, 22):
            dx, dy = (x - cx) / r, (y - cy) / r
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = WHEEL
    for y in range(20, 29):
        for x in range(11, 22):
            dx, dy = (x - cx) / r, (y - cy) / r
            if 0.72 <= dx * dx + dy * dy <= 1.0:
                px[x, y] = TIRE
            elif dx * dx + dy * dy < 0.3 and px[x, y] != INK:
                px[x, y] = WOOD_TOP
    px[cx - 2, cy - 2] = HL
    px[cx - 1, cy - 2] = HL
    px[cx + 2, cy + 1] = SH
    nail(img, cx, cy)
    return img


# --- 6. Настенный факел: кронштейн + рукоять + чаша + огонь ---
def torch():
    img = new()
    px = img.load()
    soft_shadow(img, 11, 21, 28)
    # кронштейн от стены слева
    box(img, 2, 5, 12, 8, FRAME)
    for x in range(3, 12):
        px[x, 6] = HL
    nail(img, 4, 6)
    # вертикальная рукоять
    box(img, 12, 8, 16, 22, HANDLE)
    for y in range(9, 22):
        px[13, y] = HL
        px[15, y] = SH
    grain(img, 13, 9, 15, 21, seed=3)
    # чаша
    box(img, 10, 20, 19, 24, BOWL)
    for x in range(11, 19):
        px[x, 21] = HL
    for y in range(21, 24):
        px[18, y] = BOWL_D
    nail(img, 12, 23)
    nail(img, 17, 23)
    # огонь: языки с сужением кверху, блик к жёлтому
    for x in range(11, 18):
        px[x, 19] = FLR
    for x in range(11, 18):
        px[x, 18] = FLO
    px[11, 18] = FLR
    px[17, 18] = FLR
    for x in range(12, 17):
        px[x, 17] = FLO
        px[x, 16] = FLO
    px[12, 17] = FLR
    px[16, 17] = FLR
    for x in range(12, 17):
        px[x, 15] = FLY
        px[x, 14] = FLY
    px[12, 15] = FLO
    px[16, 15] = FLO
    px[13, 13] = FLY
    px[14, 13] = FLY
    px[14, 12] = FLY
    px[15, 12] = FLY
    px[13, 16] = HL
    px[14, 16] = HL
    px[15, 11] = FLY  # искры парами
    px[16, 11] = FLY
    px[12, 9] = FLY
    px[13, 9] = FLY
    return img


# --- 7. Открытый ящик: створки врозь, нутро, три тряпки, лоб ---
def crate_1():
    img = new()
    px = img.load()
    soft_shadow(img, 5, 26, 27)
    for fx0 in (0, 27):  # створки на полу слева и справа
        box(img, fx0, 8, fx0 + 4, 20, WOOD_TOP)
        for gy in (11, 14, 17):
            for x in range(fx0 + 1, fx0 + 4):
                px[x, gy] = GRAIN
        px[fx0 + 1, 9] = HL
        px[fx0 + 2, 19] = SH
        nail(img, fx0 + 2, 12)
    box(img, 5, 5, 26, 23, FRAME)
    for x in range(6, 26):
        px[x, 6] = HL
    box(img, 7, 7, 24, 21, HOLE)
    box(img, 9, 9, 15, 14, RAG_R)  # красная
    for x in range(10, 15):
        px[x, 9] = RAG_RL
    px[12, 12] = RAG_RD
    px[13, 11] = RAG_RD
    box(img, 14, 12, 22, 17, RAG_B)  # сизая
    for x in range(15, 22):
        px[x, 12] = RAG_BL
    px[17, 15] = RAG_BD
    px[19, 14] = RAG_BD
    box(img, 10, 15, 17, 20, RAG_T)  # песочная
    for x in range(11, 17):
        px[x, 15] = RAG_TL
    px[13, 18] = RAG_TD
    for nx, ny in [(7, 7), (24, 7), (7, 21), (24, 21)]:
        nail(img, nx, ny)
    box(img, 4, 23, 27, 29, FRAME)  # лоб снизу
    for x in range(5, 27):
        px[x, 24] = HL
        px[x, 28] = SH
    px[5, 25] = HL
    px[26, 27] = SH
    grain(img, 5, 25, 26, 27, seed=7)
    px[9, 26] = GRAIN
    px[10, 26] = GRAIN
    px[20, 26] = GRAIN
    px[21, 26] = GRAIN
    return img


# --- 8. Низкий ящик с мешком: узел, верёвка, складки ---
def crate_2():
    img = new()
    px = img.load()
    soft_shadow(img, 5, 26, 28)
    for y in range(5, 22):  # мешок
        for x in range(6, 26):
            dx, dy = (x - 16) / 9.0, (y - 13.5) / 7.5
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = SACK
    for y in range(5, 22):  # фиолет-затенение справа и снизу
        for x in range(6, 26):
            dx, dy = (x - 16) / 9.0, (y - 13.5) / 7.5
            if dx * dx + dy * dy <= 1.0 and (x >= 20 or y >= 18):
                px[x, y] = SACK_D
    for x in range(10, 15):  # жёлтый блик слева сверху
        px[x, 8] = SACK_L
    px[9, 9] = SACK_L
    px[8, 11] = SACK_L
    for fx, fy0, fy1 in [(13, 11, 18), (18, 10, 19)]:  # складки
        for y in range(fy0, fy1):
            px[fx, y] = SACK_D
        px[fx - 1, fy0] = SACK_L
    cx, cy, rx, ry = 16, 13.5, 9.0, 7.5  # контур 1 px
    for y in range(5, 22):
        for x in range(6, 26):
            dx, dy = (x - cx) / rx, (y - cy) / ry
            if 0.90 <= dx * dx + dy * dy <= 1.0:
                px[x, y] = INK
    for x in range(12, 21):  # верёвка
        px[x, 7] = ROPE_D
        px[x, 6] = ROPE
    box(img, 14, 2, 17, 5, SACK)  # узел
    px[15, 3] = SACK_L
    frame(img, 5, 17, 26, 27, WOOD, seed=8)  # низкий корпус-лоб
    return img


MAKERS = {"top_prop_food": food, "top_prop_poster": poster,
          "top_prop_poster_1": poster_1, "top_prop_barrel": barrel,
          "top_prop_cart": cart, "top_prop_torch": torch,
          "top_prop_crate_1": crate_1, "top_prop_crate_2": crate_2}

if __name__ == "__main__":
    for name, fn in MAKERS.items():
        im = fn()
        assert im.size == (32, 32) and im.mode == "RGBA"
        im.save(f"{BASE}/{name}.png")
    print("ok: " + ", ".join(MAKERS))
