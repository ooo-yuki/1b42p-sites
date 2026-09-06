#!/usr/bin/env python3
"""tulenko круг красоты 4: вещи сверху 16x16. Ящик с планками, поднос с едой, плакат с закатом."""
from PIL import Image, ImageDraw

BASE = "/root/sites/tulenko.bratuxa.zomb.top/img"
S = 16

WOOD = (122, 86, 58)
GRAIN = (96, 64, 40)
LIGHT = (150, 112, 76)
EDGE = (196, 158, 112)
FRAME = (60, 38, 22)
LEG = (48, 30, 18)
FLOOR = (205, 205, 214)
FDARK = (160, 160, 172)
SH1 = (140, 140, 152)   # тень тон 1
SH2 = (115, 115, 128)   # тень тон 2
INK = (35, 25, 18)      # тёмная обводка


def floor():
    img = Image.new("RGB", (S, S))
    px = img.load()
    for y in range(S):
        for x in range(S):
            px[x, y] = FLOOR if (x // 2 + y // 2) % 2 == 0 else FDARK
    return img


def shadow(img, x0, y0, x1, y1):
    """Тень справа+снизу в два тона вокруг rect."""
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


def crate():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    x0, y0, x1, y1 = 2, 2, 12, 12
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = WOOD
    # Зерно дерева
    for y in (4, 8, 11):
        for x in range(x0 + 1, x1):
            if (x + y) % 3:
                px[x, y] = GRAIN
    for y in (3, 7):
        for x in range(x0 + 1, x1):
            if (x * 2 + y) % 4 == 0:
                px[x, y] = LIGHT
    # Планки: две тёмные щели поперёк
    for x in range(x0, x1 + 1):
        px[x, 5] = GRAIN
        px[x, 9] = GRAIN
        px[x, 6] = LIGHT  # светлая кромка под щелью
        px[x, 10] = LIGHT
    # Вертикальная планка-стяжка по центру
    for y in range(y0, y1 + 1):
        px[7, y] = GRAIN
        px[8, y] = LIGHT
    for y in (5, 9):
        px[7, y] = INK
        px[8, y] = INK
    # Светлый край сверху/слева
    for x in range(x0, x1 + 1):
        px[x, y0] = EDGE
    for y in range(y0, y1 + 1):
        px[x0, y] = EDGE
    d.rectangle([x0, y0, x1, y1], outline=INK)
    # Гвозди по углам
    for gx, gy in [(3, 3), (11, 3), (3, 11), (11, 11)]:
        px[gx, gy] = LEG
    shadow(img, x0, y0, x1, y1)
    img.save(f"{BASE}/top_prop_crate.png")


def food():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    # Поднос 1..14 x 2..13
    x0, y0, x1, y1 = 1, 2, 14, 13
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = (168, 168, 180)
    d.rectangle([x0, y0, x1, y1], outline=INK)
    for x in range(x0, x1 + 1):
        px[x, y0] = (220, 220, 230)  # светлый край
    # Миска супа слева: кольцо d6 в (2..7, 5..10), центр (4.5,7.5)
    d.ellipse([2, 5, 7, 10], fill=(240, 240, 246), outline=INK)
    d.ellipse([3, 6, 6, 9], fill=(220, 150, 60), outline=(150, 95, 35))
    px[4, 7] = (255, 225, 170)  # блик
    px[5, 7] = (255, 225, 170)
    # Хлеб справа вверху: буханка 9..13 x 3..6
    for y in range(3, 7):
        for x in range(9, 14):
            px[x, y] = (190, 130, 70)
    d.rectangle([9, 3, 13, 6], outline=INK)
    for x in range(9, 14):
        px[x, 3] = (235, 195, 130)  # корка-блик
    px[10, 5] = GRAIN
    px[12, 4] = GRAIN
    # Кружка справа внизу: корпус 9..12 x 8..12 + ручка
    for y in range(8, 13):
        for x in range(9, 13):
            px[x, y] = (90, 140, 190)
    d.rectangle([9, 8, 12, 12], outline=INK)
    for y in range(8, 13):
        px[9, y] = (160, 205, 235)  # блик слева
    px[10, 9] = (200, 230, 250)
    d.rectangle([13, 9, 14, 11], outline=INK)  # ручка
    shadow(img, x0, y0, x1, y1)
    img.save(f"{BASE}/top_prop_food.png")


def poster():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    # Плакат 3..12 x 2..13
    x0, y0, x1, y1 = 3, 2, 12, 13
    # Закат: три полосы
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if y <= 5:
                px[x, y] = (250, 200, 90)   # жёлтое небо
            elif y <= 9:
                px[x, y] = (235, 120, 50)   # рыжий закат
            else:
                px[x, y] = (90, 50, 70)     # тёмная земля/море
    # Солнце
    d.ellipse([6, 4, 9, 7], fill=(255, 245, 200), outline=(180, 100, 40))
    px[7, 5] = (255, 255, 255)
    # Чайка: галочка из двух штрихов
    px[5, 4] = INK
    px[6, 3] = INK
    px[7, 4] = INK
    px[10, 6] = INK
    px[11, 5] = INK
    # Горизонт
    for x in range(x0, x1 + 1):
        px[x, 10] = INK
    # Светлый край слева + рамка
    for y in range(y0, y1 + 1):
        px[x0, y] = (255, 230, 170)
    d.rectangle([x0, y0, x1, y1], outline=INK)
    shadow(img, x0, y0, x1, y1)
    img.save(f"{BASE}/top_prop_poster.png")


crate()
food()
poster()
print("saved crate, food, poster")
