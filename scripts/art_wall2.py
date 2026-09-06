#!/usr/bin/env python3
"""Круг красоты 2: top_wall — стена вид строго сверху, кирпичная кладка.

16x16 RGBA. Кирпич 8x4 со швами (ложковая перевязка, сдвиг через ряд):
  M шов/раствор (48,46,54), L светлый верх ряда (198,132,100),
  C тело кирпича (158,92,66), S бока темнее (132,74,56),
  D тень низа ряда (116,62,48).
Схема ряда (4px): верх L, середина C с тёмными боками S у швов, низ D,
каждый 4-й ряд — горизонтальный шов M. Вертикальные швы M со сдвигом 4px.
Повтор: python3 scripts/art_wall2.py
"""
from PIL import Image

W, H = 16, 16
M = (48, 46, 54, 255)
L = (198, 132, 100, 255)
C = (158, 92, 66, 255)
S = (132, 74, 56, 255)
D = (116, 62, 48, 255)

OUT = "tulenko.bratuxa.zomb.top/img/top_wall.png"


def vseam(x, band):
    """Вертикальный шов: чётные ряды на x=7,15; нечётные со сдвигом — x=3,11."""
    return x in ((7, 15) if band % 2 == 0 else (3, 11))


img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
px = img.load()
for y in range(H):
    band, r = divmod(y, 4)
    for x in range(W):
        if r == 3 or vseam(x, band):  # швы
            px[x, y] = M
        elif r == 0:  # светлый верх ряда
            px[x, y] = L
        elif r == 2:  # тень низа ряда
            px[x, y] = D
        elif vseam(x - 1, band) or vseam(x + 1, band):  # бока темнее у шва
            px[x, y] = S
        else:
            px[x, y] = C

img.save(OUT)
print("saved", OUT, img.size)
