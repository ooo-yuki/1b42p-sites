#!/usr/bin/env python3
"""tulenko круг красоты 2: стол сверху 16x16. Дерево с зерном и светлым краем, ножки тенью, миска и ложка."""
from PIL import Image, ImageDraw

OUT = "/root/sites/tulenko.bratuxa.zomb.top/img/top_table.png"
S = 16

WOOD = (122, 86, 58)
GRAIN = (96, 64, 40)
LIGHT = (150, 112, 76)
EDGE = (196, 158, 112)
FRAME = (60, 38, 22)
LEG = (48, 30, 18)
FLOOR = (205, 205, 214)
FDARK = (160, 160, 172)

img = Image.new("RGB", (S, S))
px = img.load()

# Пол-фон шахматкой (край клетки)
for y in range(S):
    for x in range(S):
        px[x, y] = FLOOR if (x // 2 + y // 2) % 2 == 0 else FDARK

# Столешница 1..14
for y in range(1, 15):
    for x in range(1, 15):
        px[x, y] = WOOD
d = ImageDraw.Draw(img)
d.rectangle([1, 1, 14, 14], outline=FRAME)
# Светлый край: верх и лево
for x in range(1, 15):
    px[x, 1] = EDGE
for y in range(1, 15):
    px[1, y] = EDGE
px[1, 1] = (220, 185, 140)
# Зерно дерева: горизонтальные тёмные штрихи + светлые
for y in (3, 6, 11, 13):
    for x in range(2, 14):
        if (x + y) % 3:
            px[x, y] = GRAIN
for y in (4, 9, 12):
    for x in range(2, 14):
        if (x * 2 + y) % 4 == 0:
            px[x, y] = LIGHT
# Сучок
px[12, 4] = GRAIN
px[13, 4] = GRAIN
px[12, 5] = LIGHT

# Ножки по углам тенью 2x2 поверх столешницы
for lx, ly in [(1, 1), (13, 1), (1, 13), (13, 13)]:
    for dy in range(2):
        for dx in range(2):
            px[lx + dx, ly + dy] = LEG
    px[lx, ly] = (30, 18, 10)  # тёмный угол-блик тени

# Миска: кольцо d7 в (3..9, 6..12), центр (6,9) r=3
d.ellipse([3, 6, 9, 12], fill=(240, 240, 246), outline=(70, 70, 90))
d.ellipse([4, 7, 8, 11], fill=(220, 150, 60), outline=(150, 95, 35))
px[5, 8] = (255, 225, 170)  # блик супа
px[6, 8] = (255, 225, 170)

# Ложка справа от миски: черпак-овал + ручка вниз
d.ellipse([10, 6, 13, 9], fill=(215, 215, 225), outline=(140, 140, 155))
px[11, 7] = (255, 255, 255)  # блик черпака
for sy in (10, 11, 12):
    px[11, sy] = (200, 200, 210)
px[10, 12] = (140, 140, 155)
px[12, 10] = (140, 140, 155)

img.save(OUT)
print("saved", OUT)
