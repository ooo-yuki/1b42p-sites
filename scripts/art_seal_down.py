#!/usr/bin/env python3
"""Круг красоты 1: top_seal_down — тюленька вид строго сверху, глаза вниз.

16x16 RGBA. Палитра как у соседей (top_seal_up/left):
  O outline (58,62,72), B тело (148,154,166), S тень 2-й тон (110,116,130),
  W белое (242,242,246), E почти-чёрный (18,18,24).
Тень под ногами рисует игра — здесь её нет.
Повтор: python3 scripts/art_seal_down.py
"""
from PIL import Image, ImageDraw

W, H = 16, 16
O = (58, 62, 72, 255)
B = (148, 154, 166, 255)
S = (110, 116, 130, 255)
WW = (242, 242, 246, 255)
E = (18, 18, 24, 255)

OUT = "tulenko.bratuxa.zomb.top/img/top_seal_down.png"

body = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(body)
# хвост (сверху, голова смотрит вниз)
d.ellipse([6, 1, 9, 3], fill=B)
# туловище — вертикальный овал
d.ellipse([4, 2, 11, 14], fill=B)
# ласты по бокам
d.ellipse([1, 6, 4, 10], fill=B)
d.ellipse([11, 6, 14, 10], fill=B)

# второй тон тени: правая сторона + низ (свет слева-сверху)
px = body.load()
for y in range(H):
    for x in range(W):
        if px[x, y][3]:
            if x >= 8 or y >= 12:
                px[x, y] = S

# белые пятна: спинка-верх и морда-живот (чистые пятна цвета)
d.ellipse([6, 3, 9, 6], fill=WW)      # пятно на спине
d.ellipse([5, 7, 10, 13], fill=WW)    # морда/живот
# тёмные пятна на спине для фактуры
for x, y in [(5, 5), (10, 5), (5, 9), (10, 9)]:
    if body.getpixel((x, y))[3]:
        pass
d.point([(5, 4), (10, 4)], fill=S)

# глаза смотрят вниз: два раздельных глаза + нос ниже по центру
d.rectangle([6, 10, 6, 11], fill=E)
d.rectangle([9, 10, 9, 11], fill=E)
d.point([(7, 12), (8, 12)], fill=E)  # нос по центру снизу — направление взгляда вниз

# тёмная обводка: дилатация маски на 1px, кладётся под тело
alpha = body.split()[3]
from PIL import ImageFilter
dil = alpha.filter(ImageFilter.MaxFilter(3))
out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(out)
od.bitmap([0, 0], dil, fill=O)
out = Image.alpha_composite(out, body)
out.save(OUT)
print("saved", OUT, out.size)
