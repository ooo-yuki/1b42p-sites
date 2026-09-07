#!/usr/bin/env python3
"""tulenko круг 6: вещи гуще — бочка, тачка, факел. Вид сверху 32x32."""
from PIL import Image, ImageDraw
import math

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

STEEL = (150, 158, 170)
STEEL_D = (110, 118, 132)
STEEL_L = (210, 218, 230)
STEEL_HL = (240, 245, 250)

ORE1 = (120, 110, 125)
ORE2 = (85, 75, 90)
OREL = (185, 175, 190)
RUST = (150, 95, 55)
RUST_D = (110, 65, 35)


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


def rivet(d, x, y):
    d.ellipse([x - 1, y - 1, x + 1, y + 1], fill=STEEL_D, outline=INK)
    d.point((x, y), fill=STEEL_HL)


def barrel():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    cx, cy, r = 16, 15, 11
    # тело бочки
    for y in range(S):
        for x in range(S):
            dist = math.hypot(x - cx, y - cy)
            if dist <= r:
                px[x, y] = WOOD
    # клёпки вдоль: радиальные швы (8 досок)
    for k in range(8):
        a = math.pi * k / 8
        for t in range(2, r + 1):
            x = int(round(cx + math.cos(a) * t))
            y = int(round(cy + math.sin(a) * t))
            if math.hypot(x - cx, y - cy) <= r - 0.5:
                px[x, y] = GRAIN
                if 0 <= x + 1 < S and math.hypot(x + 1 - cx, y - cy) <= r - 0.5:
                    px[x + 1, y] = LIGHT
    # зерно дерева: крап
    for y in range(cy - r, cy + r + 1):
        for x in range(cx - r, cx + r + 1):
            if math.hypot(x - cx, y - cy) < r - 1:
                if (x * 3 + y * 5) % 11 == 0:
                    px[x, y] = GRAIN
                elif (x * 2 - y * 3) % 13 == 0:
                    px[x, y] = LIGHT
    # свет сверху-слева, тень снизу-справа
    for y in range(S):
        for x in range(S):
            dist = math.hypot(x - cx, y - cy)
            if r - 2.5 < dist <= r - 0.5:
                if x <= cx and y <= cy:
                    px[x, y] = EDGE
                elif x >= cx + 2 and y >= cy + 2:
                    px[x, y] = DARKW
    # два обруча с заклёпками
    for rr in (9, 5):
        for deg in range(360):
            a = math.radians(deg)
            x = int(round(cx + math.cos(a) * rr))
            y = int(round(cy + math.sin(a) * rr))
            if 0 <= x < S and 0 <= y < S and math.hypot(x - cx, y - cy) <= r:
                px[x, y] = STEEL_D
        for deg in range(0, 360, 45):
            a = math.radians(deg - 90)
            x = int(round(cx + math.cos(a) * rr))
            y = int(round(cy + math.sin(a) * rr))
            rivet(d, x, y)
        # блик обруча сверху
        for deg in range(200, 340):
            a = math.radians(deg)
            x = int(round(cx + math.cos(a) * rr))
            y = int(round(cy + math.sin(a) * rr))
            if 0 <= x < S and 0 <= y < S and px[x, y] == STEEL_D:
                px[x, y] = STEEL_L
    # крышка с зерном: центр
    d.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=(150, 112, 76), outline=INK)
    for gx, gy in [(cx - 1, cy - 1), (cx + 1, cy), (cx, cy + 1), (cx - 2, cy + 1)]:
        px[gx, gy] = GRAIN
    px[cx - 1, cy - 2] = EDGE
    px[cx, cy - 2] = EDGE
    d.point((cx, cy), fill=EDGE)
    # внешняя тёмная обводка круга
    for deg in range(360):
        a = math.radians(deg)
        x = int(round(cx + math.cos(a) * r))
        y = int(round(cy + math.sin(a) * r))
        if 0 <= x < S and 0 <= y < S:
            px[x, y] = INK
    # пробка-сучок
    px[cx + 2, cy - 3] = DARKW
    d.point((cx + 2, cy - 3), fill=INK)
    shadow3(img, cx - r, cy - r, cx + r, cy + r)
    img.save(f"{BASE}/top_prop_barrel.png")


def cart():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    # ручки: две палки вверх
    for hx in (10, 21):
        for y in range(1, 8):
            for dx in (0, 1):
                px[hx + dx, y] = WOOD if dx == 0 else LIGHT
        d.line([(hx - 1, 1), (hx - 1, 8)], fill=INK)
        d.line([(hx + 2, 1), (hx + 2, 8)], fill=INK)
        d.point((hx, 1), fill=INK)
        d.point((hx + 1, 1), fill=INK)
        # обмотка ручек
        for y in (3, 5):
            px[hx, y] = GRAIN
            px[hx + 1, y] = GRAIN
    # корыто с рудой
    x0, y0, x1, y1 = 5, 7, 26, 21
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = WOOD
    # доски корыта: вертикальные клёпки
    for sx in (10, 15, 20):
        for y in range(y0, y1 + 1):
            px[sx, y] = GRAIN
            if sx + 1 <= x1:
                px[sx + 1, y] = LIGHT
    # крап зерна
    for y in range(y0 + 1, y1):
        for x in range(x0 + 1, x1):
            if (x * 2 + y * 3) % 9 == 0:
                px[x, y] = GRAIN
    # борта: светлый край сверху/слева, тёмный снизу
    for x in range(x0, x1 + 1):
        px[x, y0] = EDGE
        px[x, y0 + 1] = LIGHT
        px[x, y1] = DARKW
    for y in range(y0, y1 + 1):
        px[x0, y] = EDGE
        px[x1, y] = DARKW
    d.rectangle([x0, y0, x1, y1], outline=INK)
    # руда внутри: комки
    chunks = [(8, 11), (12, 10), (16, 11), (20, 10), (23, 12),
              (9, 15), (13, 14), (17, 15), (21, 14), (24, 16),
              (11, 18), (15, 18), (19, 18), (22, 18)]
    for ox, oy in chunks:
        d.ellipse([ox - 2, oy - 1, ox + 1, oy + 1], fill=ORE1, outline=INK)
        px[ox - 1, oy - 1] = OREL
        px[ox, oy - 1] = OREL
        px[ox + 1, oy + 1] = ORE2
        d.point((ox, oy), fill=ORE2)
        if (ox + oy) % 3 == 0:
            px[ox, oy - 1] = RUST  # рыжая вкрапленность
            px[ox - 1, oy] = RUST_D
    # металлические уголки корыта + заклёпки
    for gx, gy in [(x0 + 1, y0 + 1), (x1 - 1, y0 + 1), (x0 + 1, y1 - 1), (x1 - 1, y1 - 1)]:
        px[gx, gy] = STEEL_D
    rivet(d, x0 + 3, y0 + 2)
    rivet(d, x1 - 3, y0 + 2)
    # колесо со спицами (вид сверху-сбоку: круг внизу)
    wx, wy, wr = 16, 25, 5
    for y in range(wy - wr, wy + wr + 1):
        for x in range(wx - wr, wx + wr + 1):
            if math.hypot(x - wx, y - wy) <= wr:
                px[x, y] = DARKW
    # спицы
    for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1), (1, 1), (-1, -1), (1, -1), (-1, 1)]:
        for t in range(1, wr):
            x, y = wx + dx * t, wy + dy * t
            if 0 <= x < S and 0 <= y < S and math.hypot(x - wx, y - wy) <= wr - 1:
                px[x, y] = WOOD
    d.ellipse([wx - wr, wy - wr, wx + wr, wy + wr], outline=INK)
    d.ellipse([wx - wr + 1, wy - wr + 1, wx + wr - 1, wy + wr - 1], outline=STEEL_D)
    d.ellipse([wx - 2, wy - 2, wx + 2, wy + 2], fill=STEEL, outline=INK)
    px[wx, wy] = STEEL_HL
    px[wx - 1, wy - 1] = STEEL_L
    shadow3(img, x0, y0, x1, wy + wr)
    img.save(f"{BASE}/top_prop_cart.png")


def torch():
    img = floor()
    px = img.load()
    d = ImageDraw.Draw(img)
    # стена сверху: тёмная полоса-держатель
    for y in range(2, 7):
        for x in range(6, 26):
            px[x, y] = (120, 118, 130) if y < 4 else (95, 93, 105)
    d.rectangle([6, 2, 25, 6], outline=INK)
    for x in range(7, 25):
        if x % 4 == 0:
            px[x, 3] = (150, 148, 160)
        px[x, 5] = (70, 68, 80)
    # скоба-кронштейн
    d.rectangle([13, 6, 18, 10], fill=STEEL_D, outline=INK)
    rivet(d, 14, 8)
    rivet(d, 17, 8)
    px[14, 7] = STEEL_L
    px[15, 7] = STEEL_L
    # древко
    for y in range(10, 23):
        for x in range(14, 18):
            px[x, y] = WOOD
    for y in range(10, 23):
        px[14, y] = EDGE
        px[17, y] = DARKW
        if y % 3 == 0:
            px[15, y] = GRAIN
            px[16, y] = GRAIN
    d.rectangle([14, 10, 17, 22], outline=INK)
    # обмотка: три витка верёвки
    for wy in (12, 15, 18):
        for x in range(14, 18):
            px[x, wy] = (190, 170, 120)
            if x % 2 == 0:
                px[x, wy + 1] = (150, 125, 85)
        d.line([(14, wy), (17, wy)], fill=INK)
    # чаша факела
    d.ellipse([12, 20, 19, 25], fill=STEEL_D, outline=INK)
    d.ellipse([13, 21, 18, 24], fill=(60, 50, 55), outline=INK)
    px[14, 22] = (255, 150, 60)
    px[15, 22] = (255, 190, 100)
    # пламя тремя языками (вид сверху: три лепестка)
    # внешний язык
    d.ellipse([12, 23, 19, 30], fill=(230, 90, 30), outline=INK)
    # средний язык
    d.ellipse([13, 23, 18, 29], fill=(250, 170, 60), outline=(150, 70, 20))
    # внутренний язык
    d.ellipse([14, 24, 17, 28], fill=(255, 235, 170), outline=(180, 110, 40))
    px[15, 25] = (255, 255, 255)
    px[16, 25] = (255, 255, 255)
    px[15, 26] = (255, 255, 255)
    # ореол-жар: точки вокруг
    for sx, sy in [(11, 26), (20, 26), (12, 29), (19, 29), (13, 30), (18, 30)]:
        px[sx, sy] = (250, 200, 130)
    # искры
    for sx, sy in [(10, 24), (21, 23), (11, 30), (20, 30)]:
        px[sx, sy] = (255, 220, 150)
    shadow3(img, 6, 2, 25, 30)
    img.save(f"{BASE}/top_prop_torch.png")


barrel()
cart()
torch()
print("saved 32: barrel, cart, torch")
