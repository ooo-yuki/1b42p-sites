#!/usr/bin/env python3
"""tulenko тюленька HD: 8 спрайтов 32x32 RGBA по закону PIXEL_STANDARD.

Закон: свет слева сверху (HL #F0D294 к жёлтому), тень справа/снизу
(SH #704858 к фиолету), обводка INK #2E1E14 (чёрная запрещена),
запрет подушки, чистые кластеры >=2px (кроме искры 1px),
без дизеринга, фон прозрачный, мягкая фиолет-тень.
Тюленька: вид сверху-три-четверти, глаза по направлению движения,
усы, когти, блик полосой, рваные пятна. Строй держит старых спрайтов:
торпеда-тело, боковые ласты, хвост, белое брюхо, тёмная морда.
Кадры _1: ласты на 1px наружу + хвост в сторону.
"""
from PIL import Image

BASE = "/root/sites/tulenko.bratuxa.zomb.top/img"
S = 32

INK = (46, 30, 20, 255)        # обводка, не чёрная
FUR = (148, 154, 166, 255)     # мех, база (строй старых)
FUR_L = (188, 194, 206, 255)   # мех светлый (верх/лево)
FUR_D = (104, 96, 116, 255)    # мех тёмный, сдвиг к фиолету (низ/право)
SH = (112, 72, 88, 255)        # глубокая фиолет-тень, углы низа-права
HL = (240, 210, 148, 255)      # блик полосой, к жёлтому
BELLY = (240, 232, 214, 255)   # брюхо тёплое белое
BELLY_D = (214, 198, 176, 255) # тень брюха
SPOT = (94, 88, 104, 255)      # рваные пятна
EYE = (26, 18, 24, 255)        # глаза/нос тёмные, не чёрные
SPARK = (232, 222, 200, 255)   # искра глаза + когти (1px можно)
WHISK = (232, 222, 200, 255)   # усы
GSHADOW = (50, 34, 70)         # мягкая тень под телом, alpha слоями


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def ell(img, cx, cy, rx, ry, fill):
    px = img.load()
    for y in range(max(0, cy - ry), min(S, cy + ry + 1)):
        for x in range(max(0, cx - rx), min(S, cx + rx + 1)):
            if ((x - cx) / max(rx, 1)) ** 2 + ((y - cy) / max(ry, 1)) ** 2 <= 1.0:
                px[x, y] = fill


def outline(img):
    """Обводка INK только по внешнему краю (сосед — прозрачность)."""
    px = img.load()
    edge = []
    for y in range(S):
        for x in range(S):
            if px[x, y][3] == 0:
                continue
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < S and 0 <= ny < S and px[nx, ny][3] == 0:
                    edge.append((x, y))
                    break
    for x, y in edge:
        px[x, y] = INK


def local_seal(frame):
    """Локальный спрайт мордой вверх. frame 0/1."""
    img = new()
    px = img.load()
    out = 1 if frame else 0
    # тело-торпеда + голова
    ell(img, 16, 18, 5, 8, FUR)
    ell(img, 16, 8, 5, 5, FUR)
    # боковые ласты (кадр 1 — на 1px наружу)
    ell(img, 9 - out, 18, 3, 2, FUR)
    ell(img, 23 + out, 18, 3, 2, FUR)
    # хвост клином + раздвоение
    for y, hw in ((25, 3), (26, 2), (27, 2), (28, 1), (29, 1)):
        for x in range(16 - hw, 17 + hw):
            px[x, y + (0 if frame == 0 else 0)] = FUR
    px[13 - (1 if frame else 0), 28] = FUR
    px[12 - (1 if frame else 0), 28] = FUR
    px[19 + (1 if frame else 0), 28] = FUR
    px[20 + (1 if frame else 0), 28] = FUR
    # брюхо + морда-светлое пятно
    ell(img, 16, 20, 3, 6, BELLY)
    ell(img, 16, 10, 3, 2, BELLY)
    outline(img)
    # рваные пятна (кластеры 2-4px, только по меху, не по брюху)
    spots = [(12, 14, 3, 1), (20, 15, 2, 2), (13, 22, 3, 1),
             (19, 24, 2, 1), (17, 12, 2, 1), (14, 17, 2, 2)]
    for sx, sy, w, h in spots:
        for dy in range(h + 1):
            for dx in range(w):
                x, y = sx + dx, sy + dy
                if px[x, y] == FUR:
                    px[x, y] = SPOT
    # глаза по направлению (вперёд-вверх), 2x3 + искра 1px
    for ex in (13, 18):
        for dy in range(3):
            for dx in range(2):
                px[ex + dx, 5 + dy] = EYE
        px[ex, 5] = SPARK
    # нос + рот
    for dx in range(3):
        for dy in range(2):
            px[15 + dx, 9 + dy] = EYE
    px[15, 11] = EYE
    px[16, 12] = EYE
    px[17, 11] = EYE
    # усы: по 2 линии 3px с каждой стороны морды
    for wy in (10, 11):
        for i in range(1, 4):
            px[16 - 3 - i, wy] = WHISK
            px[16 + 3 + i, wy] = WHISK
    # когти: кончики ласт, кластеры 2px
    for cx in (9 - out - 3, 23 + out + 3):
        px[cx, 17] = SPARK
        px[cx, 18] = SPARK
    return img


def to_global(img, direction):
    out = new()
    p, q = img.load(), out.load()
    for y in range(S):
        for x in range(S):
            if p[x, y][3] == 0:
                continue
            if direction == "up":
                gx, gy = x, y
            elif direction == "down":
                gx, gy = 31 - x, 31 - y
            elif direction == "left":
                gx, gy = y, 31 - x
            else:  # right
                gx, gy = 31 - y, x
            q[gx, gy] = p[x, y]
    return out


def light_and_shadow(img, direction):
    """Свет сверху/слева, тень снизу/справа; блик полосой; тень под телом."""
    px = img.load()

    def is_edge(x, y):
        return not (0 <= x < S and 0 <= y < S) or px[x, y][3] == 0 or px[x, y] == INK

    for y in range(S):
        for x in range(S):
            if px[x, y] != FUR:
                continue
            t, l = is_edge(x, y - 1), is_edge(x - 1, y)
            r, b = is_edge(x + 1, y), is_edge(x, y + 1)
            if b and r and not (t or l):
                px[x, y] = SH
            elif t or l:
                px[x, y] = FUR_L
            elif b or r:
                px[x, y] = FUR_D
    # тень брюха снизу-справа
    for y in range(S):
        for x in range(S):
            if px[x, y] != BELLY:
                continue
            if is_edge(x + 1, y) or is_edge(x, y + 1):
                px[x, y] = BELLY_D
    # блик полосой по спине со стороны света
    stripe = {
        "up": [(x, y) for y in range(6, 15) for x in (13, 14)],
        "down": [(x, y) for y in range(4, 13) for x in (13, 14)],
        "left": [(x, y) for x in range(12, 20) for y in (13, 14)],
        "right": [(x, y) for x in range(8, 17) for y in (13, 14)],
    }[direction]
    for x, y in stripe:
        if px[x, y] in (FUR, FUR_L):
            px[x, y] = HL
    # мягкая фиолет-тень под телом справа-снизу, 2 слоя
    marks = []
    for y in range(S):
        for x in range(S):
            if px[x, y] == INK and (is_edge(x + 1, y) or is_edge(x, y + 1)):
                for dx, dy, a in ((1, 0, 40), (0, 1, 28)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < S and 0 <= ny < S and px[nx, ny][3] == 0:
                        marks.append((nx, ny, a))
    for nx, ny, a in marks:
        r, g, b, al = px[nx, ny]
        px[nx, ny] = (GSHADOW[0], GSHADOW[1], GSHADOW[2], max(al, a) if al else a)


def build(direction, frame):
    img = to_global(local_seal(frame), direction)
    light_and_shadow(img, direction)
    return img


def main():
    made = []
    for d in ("up", "down", "left", "right"):
        for f in (0, 1):
            name = f"top_seal_{d}{'' if f == 0 else '_1'}.png"
            build(d, f).save(f"{BASE}/{name}")
            made.append(name)
    print(" ".join(made))


if __name__ == "__main__":
    main()
