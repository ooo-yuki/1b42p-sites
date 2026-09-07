#!/usr/bin/env python3
"""tulenko 32 точки: вещи сверху. Станок, ящик, поднос с едой, плакат с закатом."""
from PIL import Image, ImageDraw

BASE = "/root/sites/tulenko.bratuxa.zomb.top/img"
S = 32

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


def floor():
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


def bench():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 4, 6, 27, 23
    # станина: стальной стол
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = STEEL
    # шлифовка металла: горизонтальные полосы
    for y in range(y0 + 2, y1 - 1, 3):
        for x in range(x0 + 1, x1):
            if (x + y) % 2 == 0:
                px[x, y] = STEEL_D
    # блик сверху и слева
    for x in range(x0, x1 + 1):
        px[x, y0] = STEEL_HL
        px[x, y0 + 1] = STEEL_L
    for y in range(y0, y1 + 1):
        px[x0, y] = STEEL_L
    d.rectangle([x0, y0, x1, y1], outline=INK)
    # заклёпки по углам и бокам
    for rx, ry in [(x0 + 2, y0 + 3), (x1 - 2, y0 + 3), (x0 + 2, y1 - 2),
                   (x1 - 2, y1 - 2), (x0 + 2, 14), (x1 - 2, 14)]:
        rivet(d, rx, ry)
    # тиски слева: неподвижная и подвижная губки + винт
    d.rectangle([x0 - 1, 10, x0 + 4, 19], fill=STEEL_D, outline=INK)
    d.rectangle([x0 + 5, 12, x0 + 8, 17], fill=STEEL_L, outline=INK)
    for y in range(13, 17):
        px[x0 + 6, y] = INK if y % 2 == 0 else STEEL_D  # резьба винта
    px[x0 + 2, 11] = STEEL_HL
    px[x0 + 2, 18] = STEEL_HL
    # инструмент на столе: молоток (рукоять + боёк) диагональ
    for i in range(9):
        px[11 + i, 20 - i // 2] = WOOD
        px[11 + i, 21 - i // 2] = GRAIN
    d.rectangle([19, 13, 24, 17], fill=STEEL_D, outline=INK)
    d.rectangle([19, 13, 24, 14], fill=STEEL_L)
    px[20, 16] = STEEL_HL
    # второй инструмент: ключ/отвёртка справа вверху
    for i in range(8):
        px[13 + i, 8 + (i // 4)] = (200, 60, 50)  # красная ручка
    d.rectangle([13, 8, 16, 10], fill=(200, 60, 50), outline=INK)
    for i in range(5):
        px[17 + i, 9] = STEEL_HL  # жало
        px[17 + i, 10] = STEEL_D
    d.point((21, 9), fill=INK)
    shadow(img, x0 - 1, y0, x1, y1)
    img.save(f"{BASE}/top_bench.png")


def crate():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 5, 5, 26, 26
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = WOOD
    # зерно дерева
    for y in range(y0 + 1, y1):
        for x in range(x0 + 1, x1):
            if (x * 2 + y * 3) % 7 == 0:
                px[x, y] = GRAIN
            elif (x + y * 2) % 9 == 0:
                px[x, y] = LIGHT
    # планки: три тёмные щели поперёк + светлая кромка
    for sy in (10, 16, 22):
        for x in range(x0, x1 + 1):
            px[x, sy] = GRAIN
            if sy + 1 <= y1:
                px[x, sy + 1] = LIGHT
        for x in range(x0, x1 + 1):
            if x % 4 == 0:
                px[x, sy] = INK
    # вертикальная стяжка по центру
    for y in range(y0, y1 + 1):
        px[15, y] = GRAIN
        px[16, y] = LIGHT
    for sy in (10, 16, 22):
        px[15, sy] = INK
        px[16, sy] = INK
    # светлый край сверху/слева
    for x in range(x0, x1 + 1):
        px[x, y0] = EDGE
    for y in range(y0, y1 + 1):
        px[x0, y] = EDGE
    d.rectangle([x0, y0, x1, y1], outline=INK)
    # гвозди: шляпки с бликом
    for gx, gy in [(7, 7), (24, 7), (7, 24), (24, 24), (15, 13), (15, 19)]:
        d.ellipse([gx - 1, gy - 1, gx + 1, gy + 1], fill=(70, 72, 80), outline=INK)
        d.point((gx, gy), fill=(230, 235, 240))
    shadow(img, x0, y0, x1, y1)
    img.save(f"{BASE}/top_prop_crate.png")


def food():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 2, 4, 29, 27
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = (168, 168, 180)
    # клёпки/винты подноса по краю
    for cx in (x0 + 2, x1 - 2):
        for cy in (y0 + 2, y1 - 2):
            px[cx, cy] = STEEL_D
    d.rectangle([x0, y0, x1, y1], outline=INK)
    for x in range(x0, x1 + 1):
        px[x, y0] = (220, 220, 230)
        px[x, y0 + 1] = (195, 195, 208)
    # миска супа слева: внешнее кольцо + суп
    d.ellipse([4, 10, 15, 21], fill=(240, 240, 246), outline=INK)
    d.ellipse([6, 12, 13, 19], fill=(220, 150, 60), outline=(150, 95, 35))
    # кусочки в супе
    for ox, oy in [(8, 14), (11, 15), (9, 17)]:
        d.ellipse([ox - 1, oy - 1, ox + 1, oy], fill=(180, 110, 40), outline=(150, 95, 35))
    # блик на супе
    px[8, 13] = (255, 225, 170)
    px[9, 13] = (255, 225, 170)
    px[7, 18] = (255, 225, 170)
    # пар завитками над миской
    for sx, ph in [(7, 0), (10, 1), (13, 0)]:
        y = 9 - ph
        px[sx, y] = (235, 235, 240)
        px[sx + 1, y - 1] = (235, 235, 240)
        px[sx, y - 2] = (235, 235, 240)
        px[sx - 1, y - 3] = (235, 235, 240)
    # хлеб справа вверху: буханка + надрезы
    for y in range(6, 13):
        for x in range(18, 28):
            px[x, y] = (190, 130, 70)
    d.rectangle([18, 6, 27, 12], outline=INK)
    for x in range(18, 28):
        px[x, 6] = (235, 195, 130)
        px[x, 7] = (210, 155, 95)
    for dx, dy in [(20, 9), (23, 10), (25, 9)]:
        px[dx, dy] = GRAIN
        px[dx + 1, dy] = GRAIN
    # кружка справа внизу: корпус + ручка + чай
    for y in range(15, 25):
        for x in range(18, 25):
            px[x, y] = (90, 140, 190)
    d.rectangle([18, 15, 24, 24], outline=INK)
    for y in range(15, 25):
        px[18, y] = (160, 205, 235)
    px[19, 16] = (200, 230, 250)
    px[19, 17] = (200, 230, 250)
    d.ellipse([19, 15, 23, 18], fill=(120, 80, 40), outline=INK)  # чай
    px[20, 16] = (200, 150, 100)
    d.rectangle([25, 17, 28, 22], outline=INK)  # ручка
    px[26, 18] = (160, 205, 235)
    # пар над кружкой
    px[21, 14] = (235, 235, 240)
    px[22, 13] = (235, 235, 240)
    px[21, 12] = (235, 235, 240)
    shadow(img, x0, y0, x1, y1)
    img.save(f"{BASE}/top_prop_food.png")


def poster():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 7, 2, 24, 29
    # закат: градиент полосами
    bands = [(250, 215, 130), (250, 200, 90), (245, 165, 70), (235, 120, 50),
             (220, 90, 55), (150, 70, 70), (90, 50, 70)]
    for y in range(y0, y1 + 1):
        c = bands[min((y - y0) * len(bands) // (y1 - y0 + 1), len(bands) - 1)]
        for x in range(x0, x1 + 1):
            px[x, y] = c
    # солнце с ореолом
    d.ellipse([12, 8, 19, 15], fill=(255, 235, 170))
    d.ellipse([13, 9, 18, 14], fill=(255, 245, 200), outline=(180, 100, 40))
    px[15, 10] = (255, 255, 255)
    px[16, 10] = (255, 255, 255)
    px[15, 11] = (255, 255, 255)
    # отражение солнца на море
    for y in (21, 22, 23):
        for x in (14, 15, 16, 17):
            if (x + y) % 2 == 0:
                px[x, y] = (250, 200, 130)
    # море: нижние ряды темнее + волны
    for y in range(20, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x + y) % 5 == 0:
                px[x, y] = (70, 40, 60)
    # горизонт
    for x in range(x0, x1 + 1):
        px[x, 20] = INK
    # чайка покрупнее: две дуги
    for gx, gy in [(10, 8), (11, 7), (12, 7), (13, 8),
                   (13, 8), (14, 7), (15, 7), (16, 8)]:
        px[gx, gy] = INK
    px[20, 11] = INK
    px[21, 10] = INK
    px[22, 11] = INK
    # рамка: светлый край + дерево
    for y in range(y0, y1 + 1):
        px[x0, y] = (255, 230, 170)
    d.rectangle([x0, y0, x1, y1], outline=INK)
    d.rectangle([x0 + 1, y0 + 1, x1 - 1, y1 - 1], outline=(120, 85, 50))
    shadow(img, x0, y0, x1, y1)
    img.save(f"{BASE}/top_prop_poster.png")


bench()
crate()
food()
poster()
print("saved 32: bench, crate, food, poster")
