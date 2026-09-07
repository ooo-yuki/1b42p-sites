#!/usr/bin/env python3
"""tulenko: стража и сокамерники по закону PIXEL_STANDARD. 32x32 RGBA, 8 кадров.

Закон: свет слева сверху (HL #F0D294), тень к фиолету (SH #704858),
обводка INK #2E1E14 (чёрная запрещена), мягкая фиолет-тень под ногами
3 слоя, без подушки, без дизеринга, кластеры >= 2 px (кроме искры),
пуговицы/кокарда как гвоздь: тёмное ядро + искра 1 px слева сверху.
Шаг: f0 выпад L, f1 проход, f2 выпад R, f3 проход (руки в противофазе).
"""
from PIL import Image

BASE = "/root/sites/tulenko.bratuxa.zomb.top/img"
S = 32

INK = (46, 30, 20, 255)        # обводка, не чёрная
HL = (240, 210, 148, 255)      # светлая кромка: верх+лево, к жёлтому
SH = (112, 72, 88, 255)        # тень: низ+право, к фиолету
SPARK = (232, 222, 202, 255)   # искра (1 px слева сверху, можно 1 px)
SHADOW = (50, 34, 70)          # мягкая тень под ногами (фиолет)

SKIN = (255, 221, 181, 255)
SKIN_SH = (232, 186, 142, 255)

# стража, синяя форма
B = (52, 102, 220, 255)
B_L = (141, 189, 245, 255)     # свет рукава/фаски
B_D = (40, 56, 148, 255)       # тень синего
B_DV = (56, 52, 138, 255)      # тень к фиолету
B_FOLD = (30, 44, 118, 255)    # складки
TROU = (26, 30, 52, 255)
GOLD = (255, 210, 60, 255)
GOLD_L = (255, 226, 140, 255)
GOLD_D = (176, 120, 32, 255)
WHITE = (232, 236, 244, 255)
BELT = (36, 34, 48, 255)
BELT_L = (72, 70, 90, 255)
BOOT = (30, 30, 44, 255)
BOOT_L = (92, 96, 112, 255)
POUCH = (82, 62, 38, 255)
POUCH_D = (54, 40, 24, 255)

# сокамерник, рыжая роба
R = (255, 111, 32, 255)
R_L = (255, 162, 82, 255)
R_D = (203, 76, 20, 255)
R_DV = (170, 70, 50, 255)      # тень к фиолету
R_SEAM = (150, 54, 30, 255)    # швы
SASH = (150, 70, 22, 255)
SASH_D = (110, 50, 16, 255)
HAIR = (110, 66, 34, 255)
HAIR_L = (152, 98, 52, 255)
HAIR_D = (74, 48, 28, 255)
SHOE = (40, 36, 44, 255)


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def r(im, x0, y0, x1, y1, c):
    px = im.load()
    for y in range(max(0, y0), min(S, y1 + 1)):
        for x in range(max(0, x0), min(S, x1 + 1)):
            px[x, y] = c


def soft_shadow(im, x0, x1, yb):
    """Фиолет-тень под ногами: 3 слоя, к краям уже."""
    px = im.load()
    for dx, dy, a in ((1, 0, 40), (0, 1, 28), (1, 2, 16)):
        yy = yb + dy
        if not 0 <= yy < S:
            continue
        for x in range(x0 + dx + 1, x1 - dx):
            rr, gg, bb, al = px[x, yy]
            px[x, yy] = (SHADOW[0], SHADOW[1], SHADOW[2],
                         max(al, a) if al else a)


def outline(im):
    """Обводка INK: прозрачный пиксель рядом с непрозрачным -> INK."""
    src = im.copy().load()
    dst = im.load()
    for y in range(S):
        for x in range(S):
            if src[x, y][3] == 0:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < S and 0 <= ny < S and src[nx, ny][3] != 0:
                        dst[x, y] = INK
                        break


def cloth_edges(im, x0, y0, x1, y1, light, dark):
    """Свет сверху/слева, тень снизу/справа. Без подушки."""
    px = im.load()
    for x in range(x0, x1 + 1):
        px[x, y0] = light
    for y in range(y0, y1 + 1):
        px[x0, y] = light
        px[x1, y] = dark
    for x in range(x0, x1 + 1):
        px[x, y1] = dark


# шаг: (низ_брюк_L, подошва_L, низ_брюк_R, подошва_R, кисть_L, кисть_R)
PHASE = {
    0: (26, 30, 25, 29, 24, 23),
    1: (25, 29, 25, 29, 23, 24),
    2: (25, 29, 26, 30, 24, 23),
    3: (25, 29, 25, 29, 24, 23),
}


def legs_trouser(im, f):
    ll_bot, ll_sole, rl_bot, rl_sole, _, _ = PHASE[f]
    for (x0, x1, bot, sole) in ((9, 13, ll_bot, ll_sole),
                                (18, 22, rl_bot, rl_sole)):
        r(im, x0, 23, x1, bot, TROU)
        r(im, x0, 23, x0, bot, HL)            # свет слева
        r(im, x1, 23, x1, bot, B_DV)          # тень справа к фиолету
        r(im, x0 + 2, 24, x0 + 2, bot, B_FOLD)  # складка 1 px
        r(im, x0, bot + 1, x1, sole - 1, BOOT)
        r(im, x0, bot + 1, x1 + 1, bot + 1, BOOT_L)  # верх сапога, блик
        r(im, x0, bot + 1, x0 + 1, sole - 1, BOOT_L)  # блик слева кластером
        r(im, x1, bot + 2, x1, sole - 1, SH)  # тень справа к фиолету
        r(im, x0, sole, x1, sole, INK)        # подошва


def legs_shoe(im, f):
    ll_bot, ll_sole, rl_bot, rl_sole, _, _ = PHASE[f]
    for (x0, x1, bot, sole) in ((9, 13, ll_bot, ll_sole),
                                (18, 22, rl_bot, rl_sole)):
        r(im, x0, 23, x1, bot, SHOE)
        r(im, x0, 23, x1, 23, R_L)            # свет сверху
        r(im, x0, 23, x0, bot, R_L)           # свет слева
        r(im, x1, 23, x1, bot, R_DV)          # тень справа
        r(im, x0, bot + 1, x1, sole - 1, BOOT)
        r(im, x0, bot + 1, x1 + 1, bot + 1, BOOT_L)
        r(im, x0, bot + 1, x0 + 1, sole - 1, BOOT_L)
        r(im, x1, bot + 2, x1, sole - 1, SH)
        r(im, x0, sole, x1, sole, INK)


def arms(im, f, sleeve, sleeve_l, sleeve_d, cuff):
    _, _, _, _, hl, hr = PHASE[f]
    for (x0, x1, hand) in ((5, 7, hl), (24, 26, hr)):
        r(im, x0, 15, x1, 21, sleeve)
        r(im, x0, 15, x0, 21, sleeve_l)       # свет слева
        r(im, x0, 15, x1, 15, sleeve_l)       # свет сверху
        r(im, x1, 15, x1, 21, sleeve_d)       # тень справа
        r(im, x0, 20, x1, 21, cuff)           # манжета/обшлаг
        r(im, x0, 20, x0, 21, HL if cuff == GOLD else sleeve_l)
        r(im, x0, 22, x1, hand, SKIN)
        r(im, x0, 22, x0, hand, HL)
        r(im, x1, 22, x1, hand, SKIN_SH)      # тень руки справа


def head(im):
    r(im, 10, 10, 21, 14, SKIN)
    r(im, 10, 10, 10, 14, HL)                 # свет слева
    r(im, 10, 10, 21, 10, HL)                 # свет сверху
    r(im, 21, 10, 21, 14, SKIN_SH)            # тень справа
    r(im, 9, 12, 9, 13, SKIN)                 # уши кластерами
    r(im, 22, 12, 22, 13, SKIN_SH)
    r(im, 13, 12, 14, 13, INK)                # глаза 2 px
    r(im, 17, 12, 18, 13, INK)
    r(im, 15, 13, 16, 13, SKIN_SH)            # нос
    r(im, 14, 14, 17, 14, SKIN_SH)            # шея в тени


def guard(f):
    im = new()
    soft_shadow(im, 7, 24, 29)
    legs_trouser(im, f)
    r(im, 8, 15, 23, 23, B)                   # форма
    cloth_edges(im, 8, 15, 23, 23, B_L, B_DV)
    r(im, 8, 23, 23, 23, SH)                  # низ в фиолет-тень
    r(im, 11, 16, 11, 20, B_FOLD)             # складки
    r(im, 20, 16, 20, 20, B_FOLD)
    r(im, 12, 16, 12, 17, B_L)                # стежки кластерами
    r(im, 19, 18, 19, 19, B_L)
    r(im, 15, 15, 16, 20, B_D)                # планка
    r(im, 15, 15, 15, 20, B_L)
    for y in (16, 18, 20):                    # пуговицы: светлое ядро 2 px
        r(im, 15, y, 16, y, WHITE)
        r(im, 15, y, 15, y, GOLD_L)
    r(im, 8, 15, 10, 16, GOLD)                # погоны
    r(im, 21, 15, 23, 16, GOLD)
    r(im, 8, 15, 8, 16, GOLD_L)
    r(im, 10, 15, 10, 16, GOLD_D)
    r(im, 23, 15, 23, 16, GOLD_D)
    r(im, 8, 21, 23, 23, BELT)                # ремень
    r(im, 8, 21, 23, 21, BELT_L)
    r(im, 8, 23, 23, 23, SH)
    r(im, 14, 21, 17, 23, GOLD)               # пряжка
    r(im, 14, 21, 17, 21, GOLD_L)
    r(im, 17, 21, 17, 23, GOLD_D)
    r(im, 15, 22, 16, 22, BELT)
    r(im, 20, 22, 23, 25, POUCH)              # подсумок
    r(im, 20, 22, 23, 22, POUCH_D)
    r(im, 23, 22, 23, 25, SH)
    r(im, 21, 24, 22, 24, POUCH_D)
    arms(im, f, B, B_L, B_DV, GOLD)
    head(im)
    r(im, 10, 2, 21, 7, B)                    # фуражка
    cloth_edges(im, 10, 2, 21, 7, B_L, B_DV)
    r(im, 10, 7, 21, 7, B_DV)                 # околыш в тени
    r(im, 14, 4, 17, 6, GOLD)                 # кокарда как гвоздь
    r(im, 14, 4, 17, 4, GOLD_L)
    r(im, 14, 4, 14, 6, GOLD_L)
    r(im, 17, 4, 17, 6, GOLD_D)
    r(im, 15, 5, 16, 6, B_D)                  # ядро кокарды
    r(im, 13, 3, 13, 3, SPARK)                # искра 1 px слева сверху
    r(im, 9, 8, 22, 9, BOOT)                  # козырёк
    r(im, 10, 8, 11, 8, BOOT_L)               # блик кластером
    r(im, 22, 8, 22, 9, SH)
    outline(im)
    return im


def mate(f):
    im = new()
    soft_shadow(im, 7, 24, 29)
    legs_shoe(im, f)
    r(im, 8, 15, 23, 24, R)                   # роба
    cloth_edges(im, 8, 15, 23, 24, R_L, R_DV)
    r(im, 8, 24, 23, 24, SH)                  # низ в фиолет-тень
    r(im, 11, 16, 11, 21, R_SEAM)             # швы
    r(im, 20, 16, 20, 21, R_SEAM)
    r(im, 11, 17, 11, 18, R_L)                # стежки кластерами
    r(im, 20, 19, 20, 20, R_L)
    r(im, 12, 18, 15, 21, R_L)                # карман на груди
    r(im, 12, 18, 15, 18, R_SEAM)             # клапан
    r(im, 12, 18, 12, 21, R_SEAM)
    r(im, 15, 18, 15, 21, R_SEAM)
    r(im, 12, 21, 15, 21, R_SEAM)
    r(im, 13, 19, 14, 20, R)
    r(im, 13, 19, 14, 19, R_SEAM)             # пуговка кармана 2 px
    r(im, 8, 22, 23, 23, SASH)                # опояска
    r(im, 8, 22, 23, 22, R_L)
    r(im, 8, 23, 23, 23, SASH_D)
    r(im, 14, 22, 17, 23, SASH_D)             # узел
    r(im, 14, 22, 15, 22, R_L)
    arms(im, f, R, R_L, R_DV, R_D)
    head(im)
    r(im, 10, 2, 21, 9, HAIR)                 # волосы
    cloth_edges(im, 10, 2, 21, 9, HAIR_L, HAIR_D)
    r(im, 10, 8, 21, 9, HAIR_D)               # чёлка в тени
    r(im, 15, 8, 16, 9, HAIR)                 # пробор
    r(im, 11, 3, 12, 4, HAIR_L)               # блик кластером
    outline(im)
    return im


if __name__ == "__main__":
    out = {}
    for f in range(4):
        out[f"top_guard_{f}.png"] = guard(f)
        out[f"top_mate_{f}.png"] = mate(f)
    for n, im in out.items():
        assert im.size == (S, S) and im.mode == "RGBA"
        im.save(f"{BASE}/{n}")
        print(n, "ok")
