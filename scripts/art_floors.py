#!/usr/bin/env python3
"""Круг красоты 4: три пола 16x16, вид строго сверху.

food — столовая: светлая шахматка 8x8.
wash — душ: синий кафель 8x8.
cell — камера: тёплые доски вдоль (вертикальные полосы 4px).
Швы тёмные, зерно пятнами, края чуть темнее, углы прозрачные.
Повтор: python3 scripts/art_floors.py
"""
from PIL import Image

W, H = 16, 16

FLOORS = {
    "tulenko.bratuxa.zomb.top/img/top_floor_food.png": (
        (233, 229, 219, 255), (214, 207, 192, 255), (158, 149, 132, 255), "checker8"),
    "tulenko.bratuxa.zomb.top/img/top_floor_wash.png": (
        (152, 191, 216, 255), (126, 169, 199, 255), (79, 114, 144, 255), "checker8"),
    "tulenko.bratuxa.zomb.top/img/top_floor_cell.png": (
        (179, 139, 93, 255), (163, 123, 79, 255), (108, 78, 48, 255), "boards4"),
}

GRAIN_A = [(2, 2), (11, 2), (4, 5), (13, 4), (2, 10), (5, 12),
           (10, 10), (13, 13), (3, 13), (11, 5)]
GRAIN_B = [(5, 3), (13, 1), (1, 6), (9, 3), (4, 9),
           (12, 8), (6, 14), (10, 13)]

for out, (base_a, base_b, seam, kind) in FLOORS.items():
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    px = im.load()

    def is_a(x, y):
        if kind == "checker8":
            return (x < 8 and y < 8) or (x >= 8 and y >= 8)
        return (x // 4) % 2 == 0  # boards4: вертикальные доски по 4px

    for y in range(H):
        for x in range(W):
            px[x, y] = base_a if is_a(x, y) else base_b

    if kind == "checker8":
        for i in range(16):
            px[7, i] = seam
            px[i, 7] = seam
    else:
        for y in range(H):  # вертикальные швы между досками
            for sx in (3, 7, 11):
                px[sx, y] = seam
        for jx, jy in [(1, 5), (5, 11), (9, 4), (13, 10)]:  # стыки досок
            px[jx, jy] = seam
            px[jx + 1, jy] = seam

    for x, y in GRAIN_A:  # зерно пятнами — только тона плит, без новых
        px[x, y] = base_b if is_a(x, y) else base_a
    for x, y in GRAIN_B:
        px[x, y] = base_a if is_a(x, y) else base_b

    for i in range(16):  # край клетки темнее — сетка читается
        px[i, 0] = seam
        px[i, 15] = seam
        px[0, i] = seam
        px[15, i] = seam
    for x, y in [(0, 0), (15, 0), (0, 15), (15, 15)]:
        px[x, y] = (0, 0, 0, 0)

    im.save(out)
    print("wrote", out)
