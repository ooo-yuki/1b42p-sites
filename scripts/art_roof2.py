#!/usr/bin/env python3
"""Круг красоты 2 — крыша сверху 16x16: рубероид полосами, швы, парапет, потертости."""
import random
from PIL import Image

OUT = "tulenko.bratuxa.zomb.top/img/top_roof.png"
S = 16
rnd = random.Random(42)

BASE = (62, 66, 71)
ROLL_DARK = (44, 47, 52)
SEAM = (112, 118, 124)
PARAPET = (140, 145, 150)
PARAPET_DARK = (105, 109, 114)
WEAR = (108, 104, 90)
WEAR2 = (84, 88, 82)

img = Image.new("RGB", (S, S), BASE)
px = img.load()

for y in range(S):
    for x in range(S):
        col = list(BASE)
        lane = x % 4
        if lane == 0:
            col = list(ROLL_DARK)
        elif lane == 3:
            col = list(SEAM)
        n = rnd.randint(-6, 6)
        px[x, y] = tuple(max(0, min(255, c + n)) for c in col)

# поперечный шов рулона посередине (едва светлее)
for x in range(1, S - 1):
    r, g, b = px[x, 8]
    px[x, 8] = (min(255, r + 14), min(255, g + 14), min(255, b + 14))

# потертости пятнами
spots = [(3, 3), (10, 4), (5, 11), (12, 12), (2, 9)]
for sx, sy in spots:
    for dx, dy in [(0, 0), (1, 0), (0, 1)]:
        x, y = sx + dx, sy + dy
        if 1 <= x < S - 1 and 1 <= y < S - 1 and px[x, y] != SEAM:
            c = WEAR if (dx + dy) % 2 == 0 else WEAR2
            n = rnd.randint(-5, 5)
            px[x, y] = tuple(max(0, min(255, v + n)) for v in c)

# крап-зерно рубероида
for _ in range(40):
    x = rnd.randint(1, S - 2)
    y = rnd.randint(1, S - 2)
    r, g, b = px[x, y]
    d = rnd.choice([-12, 12])
    px[x, y] = (max(0, min(255, r + d)), max(0, min(255, g + d)), max(0, min(255, b + d)))

# край парапета светлой полосой
for i in range(S):
    px[i, 0] = PARAPET
    px[i, S - 1] = PARAPET_DARK
    px[0, i] = PARAPET
    px[S - 1, i] = PARAPET_DARK
px[0, 0] = PARAPET
px[S - 1, 0] = PARAPET
px[0, S - 1] = PARAPET
px[S - 1, S - 1] = PARAPET

img.save(OUT)
print("saved", OUT)
