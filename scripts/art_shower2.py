#!/usr/bin/env python3
"""tulenko круг красоты 2: душ сверху 16x16. Кафель 4x4, лейка, струи, лужа."""
from PIL import Image, ImageDraw

OUT = "/root/sites/tulenko.bratuxa.zomb.top/img/top_shower.png"
S = 16

img = Image.new("RGB", (S, S))
px = img.load()

# Кафель 4x4: плитки 4px, швы тёмные
A = (159, 200, 216)  # светлая плитка
B = (143, 184, 200)  # тёмная плитка (шахматка)
GROUT = (90, 122, 138)
for y in range(S):
    for x in range(S):
        tx, ty = x // 4, y // 4
        base = A if (tx + ty) % 2 == 0 else B
        if x % 4 == 3 or y % 4 == 3:
            px[x, y] = GROUT
        else:
            px[x, y] = base

d = ImageDraw.Draw(img)
# Лейка: круг сверху по центру (8,3) r=3, тёмный корпус + обод
cx, cy, r = 8, 3, 3
d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(58, 74, 82), outline=(42, 56, 63))
# Крепление трубы сверху
d.rectangle([7, 0, 9, 1], fill=(42, 56, 63))
# Дырки лейки — светлые точки
for hx, hy in [(6, 3), (8, 3), (10, 3), (7, 4), (9, 4), (8, 2)]:
    px[hx, hy] = (232, 244, 248)

# Струи: светлые точки вниз от лейки
for jx, jy in [(6, 6), (8, 6), (10, 6), (7, 8), (9, 8), (6, 10), (8, 10), (10, 10), (7, 12), (9, 12)]:
    px[jx, jy] = (232, 244, 248)

# Лужа: блин снизу + блик
d.ellipse([4, 12, 12, 15], fill=(207, 234, 242))
px[6, 13] = (255, 255, 255)
px[7, 13] = (255, 255, 255)

img.save(OUT)
print("saved", OUT)
