#!/usr/bin/env python3
"""Лицо крупно 64: face_wisp — дух-проводник крупным планом.

Запуск из корня дела: python3 scripts/art64_face.py
Ждём: ART64_FACE_OK — 64x64 RGBA, есть прозрачность.
Строй держим по старому face_wisp 32: круглая бледно-голубая аура,
фарфоровое лицо, тёмная обводка. Новое: белые волосы прядями,
красные глаза с бликами, тёплая улыбка, шаль с узором снизу.
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "tulenko.bratuxa.zomb.top", "img")
OUT = os.path.join(IMG, "face_wisp.png")
S = 64

PAL = {
    "aura": (150, 220, 235, 255),   # аура — строй со старого 32
    "glow": (185, 236, 246, 255),   # внутреннее свечение ауры
    "face": (225, 245, 250, 255),   # фарфоровое лицо — строй
    "shade": (120, 180, 200, 255),  # тень на лице/волосах — строй
    "dark": (20, 40, 55, 255),      # тёмная обводка — строй
    "hair": (246, 252, 255, 255),   # белые волосы
    "hair_sh": (170, 210, 226, 255),  # тень прядей
    "sclera": (240, 250, 253, 255), # белок глаз
    "iris": (205, 45, 50, 255),     # красная радужка
    "iris_d": (140, 25, 32, 255),   # глубина радужки
    "pupil": (105, 14, 20, 255),    # зрачок
    "catch": (255, 178, 178, 255),  # нижний блик в глазу
    "white": (255, 255, 255, 255),  # верхний блик
    "blush": (245, 172, 172, 255),  # тёплый румянец
    "lip": (215, 120, 126, 255),    # тёплые губы
    "lip_d": (168, 78, 84, 255),    # контур улыбки
    "lip_l": (255, 206, 206, 255),  # свет на губах
    "nose": (208, 182, 178, 255),   # носик
    "shawl": (70, 130, 160, 255),   # шаль
    "shawl_d": (44, 94, 120, 255),  # складки шали
    "trim": (235, 190, 120, 255),   # тёплая кайма шали
    "pat_c": (240, 235, 210, 255),  # узор: кремовый ромб
    "pat_r": (230, 120, 110, 255),  # узор: коралловая точка
}


def build():
    px = [[(0, 0, 0, 0) for _ in range(S)] for _ in range(S)]

    def dot(x, y, c):
        if 0 <= x < S and 0 <= y < S:
            px[y][x] = c

    def disc(cx, cy, r, c):
        for y in range(S):
            for x in range(S):
                if (x - cx) ** 2 + (y - cy) ** 2 <= r * r and px[y][x][3] == 0:
                    px[y][x] = c

    def oval(cx, cy, rx, ry, c, over=False):
        for y in range(S):
            for x in range(S):
                if ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1:
                    if over or px[y][x][3] == 0:
                        px[y][x] = c

    P = PAL
    # 1. Аура духа: плотный диск + мягкий висп-край с прозрачностью.
    disc(32, 31, 30, P["aura"])
    disc(32, 31, 27, P["glow"])
    for y in range(S):
        for x in range(S):
            d = ((x - 32) ** 2 + (y - 31) ** 2) ** 0.5
            if 30 < d <= 31.5:
                px[y][x] = (150, 220, 235, 90)

    # 2. Белые волосы — масса за лицом и пряди по бокам.
    oval(32, 26, 23, 24, P["hair"], over=True)
    for y in range(8, 56):  # боковые пряди-шторки
        for x in range(6, 15):
            if ((x - 12) / 7) ** 2 + ((y - 30) / 26) ** 2 <= 1:
                px[y][x] = P["hair"]
        for x in range(49, 58):
            if ((x - 52) / 7) ** 2 + ((y - 30) / 26) ** 2 <= 1:
                px[y][x] = P["hair"]
    for x, y in (  # теневые штрихи-разделители прядей
        (10, 20), (10, 28), (10, 36), (10, 44), (13, 16), (13, 48),
        (54, 20), (54, 28), (54, 36), (54, 44), (51, 16), (51, 48),
        (20, 9), (26, 7), (32, 6), (38, 7), (44, 9),
    ):
        dot(x, y, P["hair_sh"])
        dot(x, y + 1, P["hair_sh"])
        dot(x, y + 2, P["shade"])
    for x in range(18, 47):  # чёлка прядями надо лбом
        edge = 12 + abs(x - 32) // 3
        for y in range(edge, edge + 5 + (x % 3)):
            dot(x, y, P["hair"])
            if y == edge + 4 + (x % 3):
                dot(x, y, P["hair_sh"])

    # 3. Лицо — фарфоровый овал поверх волос.
    oval(32, 34, 17, 20, P["face"], over=True)
    for y in range(16, 53):  # тень-серп справа и снизу
        for x in range(S):
            if ((x - 32) / 17) ** 2 + ((y - 34) / 20) ** 2 <= 1 < \
               ((x - 33.5) / 16) ** 2 + ((y - 33) / 19) ** 2:
                px[y][x] = P["shade"]
    for cx in (23, 41):  # тёплый румянец
        for y in range(39, 44):
            for x in range(cx - 2, cx + 3):
                if abs(x - cx) + abs(y - 41) <= 3:
                    dot(x, y, P["blush"])

    # 4. Брови — светлые дуги.
    for bx in (21, 35):
        for i in range(8):
            dot(bx + i, 27 - (i if i < 4 else 7 - i) // 2, P["hair_sh"])

    # 5. Красные глаза с бликами.
    for ox in (0, 14):
        for y in range(32, 39):  # белок
            for x in range(21 + ox, 29 + ox):
                dot(x, y, P["sclera"])
        for x in range(22 + ox, 28 + ox):  # обводка сверху тёмная
            dot(x, 31, P["dark"])
        dot(21 + ox, 39, P["dark"])  # снизу лёгкая: уголки + тень
        dot(28 + ox, 39, P["dark"])
        for x in range(22 + ox, 28 + ox):
            dot(x, 39, P["shade"])
        for y in range(32, 39):
            dot(20 + ox, y, P["dark"])
            dot(29 + ox, y, P["dark"])
        for y in range(33, 37):  # красная радужка
            for x in range(23 + ox, 27 + ox):
                dot(x, y, P["iris"])
        for y in range(33, 37):  # глубина справа-снизу
            dot(26 + ox, y, P["iris_d"])
            dot(25 + ox, 36, P["iris_d"])
        dot(24 + ox, 34, P["pupil"])  # зрачок
        dot(25 + ox, 34, P["pupil"])
        dot(24 + ox, 35, P["pupil"])
        dot(23 + ox, 33, P["white"])  # большой блик
        dot(24 + ox, 33, P["white"])
        dot(23 + ox, 34, P["white"])
        dot(25 + ox, 36, P["catch"])  # тёплый нижний блик

    # 6. Носик — два тёплых пикселя.
    dot(31, 42, P["nose"])
    dot(32, 42, P["nose"])
    dot(32, 43, P["shade"])

    # 7. Тёплая улыбка.
    for x in range(26, 39):
        dot(x, 46, P["lip_d"])
    dot(25, 45, P["lip_d"])
    dot(39, 45, P["lip_d"])
    dot(24, 44, P["lip_d"])
    dot(40, 44, P["lip_d"])
    for x in range(26, 39):
        dot(x, 47, P["lip"])
        dot(x, 48, P["lip"])
    for x in range(29, 36):
        dot(x, 48, P["lip_l"])
    dot(25, 46, P["lip_d"])
    dot(39, 46, P["lip_d"])
    for x in (27, 37):  # ямочки улыбки
        dot(x, 44, P["blush"])

    # 8. Шаль с узором — драпировка снизу.
    for y in range(52, 63):
        w = 6 + (y - 52) * 2
        for x in range(32 - w, 32 + w + 1):
            dot(x, y, P["shawl"])
    for y in range(52, 63):  # складки
        for x in (32 - 12, 32 - 4, 32 + 5, 32 + 13):
            if 0 <= x < S:
                dot(x, y, P["shawl_d"])
                if (y + x) % 4 == 0:
                    dot(x + 1, y, P["shawl_d"])
    for x in range(20, 45):  # тёплая кайма сверху
        dot(x, 52, P["trim"])
        dot(x, 53, P["trim"] if x % 2 == 0 else P["shawl"])
    for i, x in enumerate(range(22, 43, 6)):  # кремовые ромбы
        dot(x, 56, P["pat_c"])
        dot(x - 1, 57, P["pat_c"])
        dot(x + 1, 57, P["pat_c"])
        dot(x, 58, P["pat_c"])
        dot(x, 57, P["pat_r"])
    for x in range(14, 51):  # нижняя кайма
        dot(x, 62, P["trim"])
    dot(32, 51, P["face"])  # подбородок поверх шали

    im = Image.new("RGBA", (S, S))
    im.putdata([px[y][x] for y in range(S) for x in range(S)])
    assert im.size == (64, 64), "сетка не 64x64"
    im.save(OUT)
    print("ART64_FACE_OK", OUT)


if __name__ == "__main__":
    build()
