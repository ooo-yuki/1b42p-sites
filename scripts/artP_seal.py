#!/usr/bin/env python3
"""tulenko тюленька в перспективе три четверти: 8 спрайтов 32x32 RGBA.

Мерка 1: все люди в перспективе три четверти, а не строгий верх.
Видна морда и верх спины, ласты уходят вниз-назад, глаза по направлению.
Строй старых держит: торпеда-тело, боковые ласты, хвост-рыбка, белое
брюхо/морда, тёмная морда-нос, серый мех, блик полосой, рваные пятна.
Закон scripts/PIXEL_STANDARD.md: свет слева сверху (HL #F0D294 к жёлтому),
тень справа/снизу (SH #704858 к фиолету), обводка INK #2E1E14 (чёрная
запрещена), без подушки, кластеры >=2px, без дизеринга, фон прозрачный,
мягкая фиолет-тень 40/28/16.
down/up — одна ось (морда юг/север), left/right — своя (морда запад/восток);
up/right — зеркало своей оси, свет/тень кладутся ПОСЛЕ зеркала.
Кадр _1: ласты на 1px наружу + хвост в сторону.
Повтор: python3 scripts/artP_seal.py
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
BELLY = (240, 232, 214, 255)   # морда/светлое, тёплое белое
BELLY_D = (214, 198, 176, 255)  # тень светлого
SPOT = (94, 88, 104, 255)      # рваные пятна
EYE = (26, 18, 24, 255)        # глаза/нос тёмные, не чёрные
SPARK = (232, 222, 200, 255)   # искра глаз + когти (кластеры 2px)
WHISK = (232, 222, 200, 255)   # усы (линии 3px — кластеры)
GSHADOW = (50, 34, 70)         # мягкая тень под телом


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def ell(img, cx, cy, rx, ry, fill):
    px = img.load()
    for y in range(max(0, cy - ry), min(S, cy + ry + 1)):
        for x in range(max(0, cx - rx), min(S, cx + rx + 1)):
            if ((x - cx) / max(rx, 1)) ** 2 + ((y - cy) / max(ry, 1)) ** 2 <= 1.0:
                px[x, y] = fill


def rect(img, x0, y0, w, h, fill):
    px = img.load()
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if 0 <= x < S and 0 <= y < S:
                px[x, y] = fill


def outline(img):
    """Обводка INK только по внешнему краю (сосед — прозрачность).
    Детали лица (усы/искры/глаза) не черним — как в старых."""
    px = img.load()
    keep = (WHISK, SPARK, EYE)
    edge = []
    for y in range(S):
        for x in range(S):
            if px[x, y][3] == 0 or px[x, y] in keep:
                continue
            for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
                if 0 <= nx < S and 0 <= ny < S and px[nx, ny][3] == 0:
                    edge.append((x, y))
                    break
    for x, y in edge:
        px[x, y] = INK


def draw_down(frame):
    """Морда на юг: спина сверху, голова наплывом снизу, хвост-рыбка сверху."""
    img = new()
    px = img.load()
    out = 1 if frame else 0
    # спина — верх спины (масса сверху)
    ell(img, 16, 12, 6, 8, FUR)
    # голова — отдельный объём, наплыв на тело (перспектива)
    ell(img, 16, 21, 6, 5, FUR)
    # ласты уходят вниз-назад (кадр 1 — на 1px наружу)
    ell(img, 8 - out, 19, 3, 2, FUR)
    ell(img, 24 + out, 19, 3, 2, FUR)
    # хвост клином + раздвоение рожками 2px (кадр 1 — в сторону)
    for y, hw in ((3, 3), (4, 2), (5, 2), (6, 1)):
        for x in range(16 - hw, 17 + hw):
            px[x, y] = FUR
    for tx in (13 - out, 18 + out):
        px[tx, 2] = FUR
        px[tx, 3] = FUR
    # морда — светлая плоскость лица на голове
    ell(img, 16, 23, 4, 3, BELLY)
    # рваные пятна только по меху спины (кластеры, угол сколот — рваный край)
    for x0, y0, w, h in ((17, 7, 3, 2), (11, 10, 2, 2),
                         (19, 11, 2, 2), (14, 14, 3, 2)):
        for dy in range(h):
            for dx in range(w):
                if dx == 0 and dy == 0:
                    continue  # скол угла
                x, y = x0 + dx, y0 + dy
                if px[x, y] == FUR:
                    px[x, y] = SPOT
    return img


def draw_left(frame):
    """Морда на запад: спина справа, голова наплывом слева, хвост справа."""
    img = new()
    px = img.load()
    out = 1 if frame else 0
    # спина — верх спины (масса справа)
    ell(img, 20, 16, 8, 6, FUR)
    # голова — отдельный объём, наплыв слева
    ell(img, 11, 16, 5, 6, FUR)
    # ласты уходят вниз-назад: ближняя большая внизу, дальняя выглядывает
    ell(img, 17, 23 + out, 3, 2, FUR)   # ближняя, вниз
    ell(img, 17, 9 - out, 2, 2, FUR)    # дальняя, за спиной
    # хвост клином + раздвоение рожками 2px (кадр 1 — в сторону)
    for x, hh in ((28, 3), (27, 2), (26, 2), (25, 1)):
        for y in range(16 - hh, 17 + hh):
            px[x, y] = FUR
    for ty in (13 - out, 19 + out):
        px[29, ty] = FUR
        px[28, ty] = FUR
    # морда — светлая плоскость лица
    ell(img, 9, 16, 3, 4, BELLY)
    # рваные пятна только по меху спины (кластеры, угол сколот)
    for x0, y0, w, h in ((20, 12, 3, 2), (24, 15, 2, 2),
                         (17, 17, 2, 2), (22, 18, 2, 2)):
        for dy in range(h):
            for dx in range(w):
                if dx == 0 and dy == 0:
                    continue  # скол угла
                x, y = x0 + dx, y0 + dy
                if px[x, y] == FUR:
                    px[x, y] = SPOT
    return img


def face_down(img, frame):
    """Лицо на юг: глаза вперёд-вниз, нос, рот, усы, когти."""
    px = img.load()
    out = 1 if frame else 0
    for ex in (12, 18):
        rect(img, ex, 20, 2, 3, EYE)
        rect(img, ex, 20, 2, 1, SPARK)   # искра 2px — кластер
    rect(img, 15, 24, 3, 1, EYE)         # нос
    rect(img, 15, 26, 3, 1, EYE)         # рот
    for wy in (23, 24):                  # усы 3px, якорь у края морды
        for i in range(3):
            px[9 + i, wy] = WHISK
            px[20 + i, wy] = WHISK
    for cx in (6 - out, 25 + out):       # когти внутри кончиков ласт
        px[cx, 18] = SPARK
        px[cx, 19] = SPARK


def face_left(img, frame):
    """Лицо на запад: оба глаза на плоскости морды, нос, рот, усы, когти."""
    px = img.load()
    out = 1 if frame else 0
    for ey in (13, 17):
        rect(img, 8, ey, 2, 3, EYE)
        rect(img, 8, ey, 2, 1, SPARK)
    rect(img, 6, 15, 2, 2, EYE)          # нос
    rect(img, 6, 18, 2, 1, EYE)          # рот
    for wx in (3, 4, 5):                 # усы 3px, якорь у края морды
        px[wx, 15] = WHISK
        px[wx, 17] = WHISK
    for cx in (17, 18):                  # когти внутри ласт
        px[cx, 24 + out] = SPARK         # ближняя ласта
        px[cx, 8 - out] = SPARK          # дальняя ласта


def light_and_shadow(img, direction):
    """Свет сверху/слева, тень снизу/справа; блик полосой по спине."""
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
    for y in range(S):
        for x in range(S):
            if px[x, y] != BELLY:
                continue
            if is_edge(x + 1, y) or is_edge(x, y + 1):
                px[x, y] = BELLY_D
    stripe = {
        "down": [(x, y) for y in range(6, 14) for x in (12, 13)],
        "up": [(x, y) for y in range(18, 26) for x in (12, 13)],
        "left": [(x, y) for x in range(16, 25) for y in (12, 13)],
        "right": [(x, y) for x in range(7, 16) for y in (12, 13)],
    }[direction]
    for x, y in stripe:
        if px[x, y] in (FUR, FUR_L):
            px[x, y] = HL


def soft_shadow(img):
    """Мягкая фиолет-тень справа-снизу, три слоя 40/28/16, к краям уже."""
    px = img.load()
    marks = []
    for y in range(S):
        for x in range(S):
            if px[x, y] != INK:
                continue
            if x + 1 < S and px[x + 1, y][3] == 0:
                marks.append((x + 1, y, 40))
            if y + 1 < S and px[x, y + 1][3] == 0:
                marks.append((x, y + 1, 40))
            if x + 1 < S and y + 1 < S and px[x + 1, y + 1][3] == 0:
                marks.append((x + 1, y + 1, 28))
            if x + 2 < S and y + 1 < S and px[x + 2, y + 1][3] == 0:
                marks.append((x + 2, y + 1, 16))
            if x + 1 < S and y + 2 < S and px[x + 1, y + 2][3] == 0:
                marks.append((x + 1, y + 2, 16))
    for nx, ny, a in marks:
        r, g, b, al = px[nx, ny]
        if al == 0:
            px[nx, ny] = (GSHADOW[0], GSHADOW[1], GSHADOW[2], a)
        elif (r, g, b) == GSHADOW and al < a:
            px[nx, ny] = (r, g, b, a)


def build(direction, frame):
    if direction in ("down", "up"):
        img = draw_down(frame)
        face_down(img, frame)   # лицо в локальной оси, ДО зеркала
        if direction == "up":
            img = img.transpose(Image.FLIP_TOP_BOTTOM)
    else:
        img = draw_left(frame)
        face_left(img, frame)   # лицо в локальной оси, ДО зеркала
        if direction == "right":
            img = img.transpose(Image.FLIP_LEFT_RIGHT)
    outline(img)
    light_and_shadow(img, direction)   # свет всегда слева сверху
    soft_shadow(img)
    return img


def main():
    made = []
    for d in ("up", "down", "left", "right"):
        for f in (0, 1):
            name = f"top_seal_{d}{'' if f == 0 else '_1'}.png"
            im = build(d, f)
            assert im.size == (32, 32) and im.mode == "RGBA", (name, im.size)
            im.save(f"{BASE}/{name}")
            made.append(name)
    print(" ".join(made))


if __name__ == "__main__":
    main()
