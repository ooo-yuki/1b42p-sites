#!/usr/bin/env python3
"""tulenko круг 9: вещи не клоны — открытый ящик, низкий ящик с мешком, плакат с волной. 32x32."""
from PIL import Image, ImageDraw

BASE = "/root/sites/tulenko.bratuxa.zomb.top/img"
S = 32

FLOOR = (205, 205, 214)
FDARK = (160, 160, 172)
INK = (35, 25, 18)
SH1 = (140, 140, 152)
SH2 = (115, 115, 128)
SH3 = (90, 90, 105)

WOOD = (122, 86, 58)
GRAIN = (96, 64, 40)
LIGHT = (150, 112, 76)
EDGE = (196, 158, 112)
DARKW = (74, 48, 30)

HOLE = (45, 30, 20)
RAG_R = (150, 70, 70)
RAG_RD = (110, 50, 50)
RAG_RL = (190, 120, 110)
RAG_B = (105, 115, 135)
RAG_BD = (75, 85, 105)
RAG_BL = (150, 165, 190)
RAG_T = (175, 155, 115)
RAG_TD = (135, 115, 80)
RAG_TL = (215, 195, 155)

SACK = (175, 150, 105)
SACK_D = (140, 115, 80)
SACK_L = (215, 195, 150)
ROPE = (190, 170, 120)
ROPE_D = (150, 125, 85)

SKY0 = (25, 40, 80)
SKY1 = (40, 70, 130)
MOON = (235, 235, 215)
MOON_D = (200, 200, 180)
WAVE_D = (30, 80, 150)
WAVE_M = (60, 140, 200)
FOAM = (240, 245, 250)


def floor():
    img = Image.new("RGB", (S, S))
    px = img.load()
    for y in range(S):
        for x in range(S):
            px[x, y] = FLOOR if (x // 4 + y // 4) % 2 == 0 else FDARK
    return img


def shadow3(img, x0, y0, x1, y1):
    px = img.load()
    for y in range(y0 + 1, y1 + 1):
        if 0 <= x1 + 1 < S:
            px[x1 + 1, y] = SH1
    for x in range(x0 + 1, x1 + 2):
        if 0 <= y1 + 1 < S and 0 <= x < S:
            px[x, y1 + 1] = SH1
    if x1 + 2 < S:
        for y in range(y0 + 2, y1 + 1):
            px[x1 + 2, y] = SH2
    if y1 + 2 < S:
        for x in range(x0 + 2, x1 + 2):
            if 0 <= x < S:
                px[x, y1 + 2] = SH2
    if x1 + 3 < S:
        for y in range(y0 + 3, y1 + 1):
            px[x1 + 3, y] = SH3
    if y1 + 3 < S:
        for x in range(x0 + 3, x1 + 3):
            if 0 <= x < S:
                px[x, y1 + 3] = SH3


def front_face(d, px, y0, y1):
    grad = [(79, 55, 34), (72, 50, 31), (66, 45, 28), (60, 40, 24),
            (53, 35, 21), (46, 30, 18)]
    d.line([(0, y0), (31, y0)], fill=EDGE)
    for i, y in enumerate(range(y0 + 1, y1)):
        c = grad[min(i, len(grad) - 1)] if y1 - y0 > 4 else grad[min(i * 2, len(grad) - 1)]
        d.line([(0, y), (31, y)], fill=c)
    for gx in (7, 15, 23):
        for y in range(y0 + 1, y1):
            px[gx, y] = (60, 40, 24)
    if y1 - y0 > 3:
        px[8, y0 + 2] = (70, 72, 80)
        px[23, y0 + 2] = (70, 72, 80)
    d.line([(0, y1), (31, y1)], fill=(20, 14, 10))


def crate_open():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    shadow3(img, 5, 5, 26, 31)
    # крышки врозь: две створки лежат на полу слева и справа
    for fx0 in (0, 27):
        d.rectangle([fx0, 8, fx0 + 4, 20], fill=WOOD, outline=INK)
        for gy in (11, 14, 17):
            d.line([(fx0, gy), (fx0 + 4, gy)], fill=GRAIN)
        d.line([(fx0 + 2, 9), (fx0 + 2, 19)], fill=GRAIN)
        px[fx0 + 2, 10] = LIGHT
        px[fx0 + 1, 18] = DARKW
        px[fx0 + 3, 18] = DARKW
    # корпус: верхняя обвязка
    d.rectangle([5, 5, 26, 23], fill=WOOD, outline=INK)
    d.rectangle([5, 5, 26, 23], outline=INK)
    for x in range(6, 26):
        if x % 3 == 0:
            px[x, 6] = LIGHT
        px[x, 22] = GRAIN
    # тёмное нутро
    d.rectangle([7, 7, 24, 21], fill=HOLE, outline=INK)
    # тряпка 1: красная, левый верх
    d.rectangle([9, 9, 15, 14], fill=RAG_R, outline=RAG_RD)
    d.line([(9, 11), (15, 11)], fill=RAG_RD)
    d.line([(11, 9), (11, 14)], fill=RAG_RD)
    for x in range(10, 15):
        px[x, 9] = RAG_RL
    px[14, 13] = RAG_RL
    # тряпка 2: сизая, правый бок
    d.rectangle([14, 12, 22, 17], fill=RAG_B, outline=RAG_BD)
    d.line([(14, 14), (22, 14)], fill=RAG_BD)
    d.line([(18, 12), (18, 17)], fill=RAG_BD)
    for x in range(15, 22):
        px[x, 12] = RAG_BL
    px[21, 16] = RAG_BL
    # тряпка 3: песочная, низ
    d.rectangle([10, 15, 17, 20], fill=RAG_T, outline=RAG_TD)
    d.line([(10, 17), (17, 17)], fill=RAG_TD)
    d.line([(13, 15), (13, 20)], fill=RAG_TD)
    for x in range(11, 17):
        px[x, 15] = RAG_TL
    px[16, 19] = RAG_TL
    # гвозди обвязки
    for nx, ny in [(6, 6), (25, 6), (6, 22), (25, 22)]:
        px[nx, ny] = LIGHT
    front_face(d, px, 24, 31)
    img.save(f"{BASE}/top_prop_crate_1.png")


def crate_sack():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    shadow3(img, 5, 12, 26, 29)
    # низкий корпус: верхняя обвязка
    d.rectangle([5, 12, 26, 23], fill=WOOD, outline=INK)
    for x in range(6, 26):
        if x % 2 == 0:
            px[x, 13] = LIGHT
        if x % 3 == 0:
            px[x, 20] = GRAIN
    d.line([(5, 17), (26, 17)], fill=GRAIN)
    for nx in (6, 15, 25):
        px[nx, 14] = LIGHT
        px[nx, 21] = DARKW
    # мешок сверху
    d.ellipse([7, 12, 24, 24], outline=INK)
    for y in range(13, 24):
        for x in range(8, 24):
            dx, dy = (x - 15.5) / 8.5, (y - 18) / 6.0
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = SACK
    for y in range(19, 24):  # затенение низа
        for x in range(8, 24):
            dx, dy = (x - 16.5) / 8.0, (y - 18) / 6.0
            if dx * dx + dy * dy <= 1.0 and (x + y) % 2 == 0:
                px[x, y] = SACK_D
    for x in range(10, 15):  # блик
        px[x, 14] = SACK_L
    px[9, 15] = SACK_L
    px[10, 15] = SACK_L
    # складки мешка
    for fx, fy0, fy1 in [(11, 16, 22), (19, 16, 22), (15, 18, 23)]:
        for y in range(fy0, fy1):
            px[fx, y] = SACK_D
    # горловина и узел
    d.rectangle([12, 7, 18, 13], fill=SACK, outline=INK)
    d.ellipse([12, 5, 18, 10], fill=SACK_L, outline=INK)
    px[15, 7] = SACK_D
    d.line([(12, 11), (18, 11)], fill=ROPE_D)
    d.line([(12, 12), (18, 12)], fill=ROPE)
    px[13, 11] = INK
    px[17, 12] = INK
    front_face(d, px, 24, 29)
    img.save(f"{BASE}/top_prop_crate_2.png")


def poster_wave():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    # небо: градиент сверху вниз
    for y in range(3, 28):
        t = (y - 3) / 24.0
        c = tuple(int(SKY0[i] + (SKY1[i] - SKY0[i]) * t) for i in range(3))
        d.line([(7, y), (22, y)], fill=c)
    # звёзды
    for sx, sy in [(9, 4), (13, 6), (21, 5), (8, 12), (12, 15), (21, 13), (10, 18)]:
        px[sx, sy] = FOAM
    # луна с кратерами и ореолом
    d.ellipse([14, 5, 21, 12], outline=MOON_D)
    d.ellipse([15, 6, 20, 11], fill=MOON)
    px[16, 8] = MOON_D
    px[18, 9] = MOON_D
    px[17, 7] = MOON_D
    px[16, 6] = FOAM
    px[15, 11] = MOON_D
    # волна: тёмная масса
    for y in range(19, 28):
        d.line([(7, y), (22, y)], fill=WAVE_D)
    # гребень: светлая кромка с пеной
    for x in range(7, 23):
        crest = 19 if (x % 4 < 2) else 20
        px[x, crest] = WAVE_M
        px[x, crest + 1] = FOAM if x % 2 == 0 else WAVE_M
    d.line([(7, 23), (22, 23)], fill=WAVE_M)
    for x in range(8, 22, 3):  # блики на воде
        px[x, 25] = WAVE_M
    # рамка и тень как у poster
    d.rectangle([6, 2, 23, 29], outline=INK)
    shadow3(img, 6, 2, 23, 29)
    img.save(f"{BASE}/top_prop_poster_1.png")


crate_open()
crate_sack()
poster_wave()
print("saved 32: crate_1, crate_2, poster_1")
