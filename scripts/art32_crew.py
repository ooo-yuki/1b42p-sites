#!/usr/bin/env python3
"""tulenko 32pt: top_guard_0/1 (стража), top_mate_0/1 (рыжий сокамерник). Вид сверху-сбоку, 32x32 RGBA."""
from PIL import Image

S = 32
O = (58, 62, 72, 255)      # тёмная обводка
DK = (18, 18, 24, 255)     # козырёк / сапоги
SKIN = (255, 221, 181, 255)
SKIN_SH = (232, 186, 142, 255)
GOLD = (255, 210, 60, 255)
WHITE = (232, 236, 244, 255)

# стража, синий
B = (52, 102, 220, 255)
B_D = (28, 58, 150, 255)
B_D2 = (20, 42, 112, 255)
B_L = (141, 189, 245, 255)
TROU = (26, 30, 52, 255)
BOOT_HI = (48, 52, 68, 255)
BELT = (32, 32, 40, 255)
POUCH = (82, 62, 38, 255)
POUCH_D = (54, 40, 24, 255)

# сокамерник, рыжий
R = (255, 111, 32, 255)
R_D = (203, 76, 20, 255)
R_D2 = (148, 54, 14, 255)
R_L = (255, 162, 82, 255)
HAIR = (110, 66, 34, 255)
HAIR_D = (74, 48, 28, 255)
HAIR_L = (152, 98, 52, 255)
SASH = (150, 70, 22, 255)
SHOE = (40, 36, 44, 255)


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def r(im, x0, y0, x1, y1, c):
    px = im.load()
    for y in range(max(0, y0), min(S, y1 + 1)):
        for x in range(max(0, x0), min(S, x1 + 1)):
            px[x, y] = c


def outline(im):
    """Тёмная обводка: прозрачный пиксель рядом с непрозрачным -> O."""
    src = im.copy().load()
    dst = im.load()
    for y in range(S):
        for x in range(S):
            if src[x, y][3] == 0:
                for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < S and 0 <= ny < S and src[nx, ny][3] != 0:
                        dst[x, y] = O
                        break


def legs_guard(im, f):
    # f=0: левая нога вперёд; f=1: наоборот
    ll = (9, 13) if f == 0 else (18, 22)
    rl = (18, 22) if f == 0 else (9, 13)
    for lx, long in ((ll, True), (rl, False)):
        x0, x1 = lx
        r(im, x0, 23, x1, 26 if long else 25, TROU)
        r(im, x0, 26 if long else 25, x0, 26 if long else 25, B_D2)  # складка
        r(im, x0, 27 if long else 26, x1, 29 if long else 28, DK)
        r(im, x0, 27 if long else 26, x1, 27 if long else 26, (72, 76, 94, 255))  # верх сапога
        r(im, x0, 27 if long else 26, x0, 29 if long else 28, BOOT_HI)  # блик сапога
        r(im, x0, 30 if long else 29, x1, 30 if long else 29, O)  # подошва


def legs_mate(im, f):
    ll = (9, 13) if f == 0 else (18, 22)
    rl = (18, 22) if f == 0 else (9, 13)
    for lx, long in ((ll, True), (rl, False)):
        x0, x1 = lx
        r(im, x0, 24, x1, 26 if long else 25, SHOE)
        r(im, x0, 26 if long else 25, x0, 26 if long else 25, HAIR_D)  # щиколотка
        r(im, x0, 27 if long else 26, x1, 29 if long else 28, DK)
        r(im, x0, 27 if long else 26, x1, 27 if long else 26, (72, 76, 94, 255))  # верх обуви
        r(im, x0, 30 if long else 29, x1, 30 if long else 29, O)  # подошва


def arms(im, f, sleeve, cuff):
    # покачивание рук: кадр 0 — левая ниже
    dl = 1 if f == 0 else 0
    dr = 0 if f == 0 else 1
    for (x0, x1, d) in ((5, 7, dl), (24, 26, dr)):
        r(im, x0, 15, x1, 21, sleeve)
        if x0 < 16:
            r(im, x1, 15, x1, 21, B_D if sleeve == B else R_D)  # тень рукава
        else:
            r(im, x1, 15, x1, 21, B_D if sleeve == B else R_D)
        r(im, x0, 20, x1, 21, cuff)  # манжета/обшлаг
        r(im, x0, 22, x1, 24 + d, SKIN)
        r(im, x1, 22, x1, 24 + d, SKIN_SH)


def head_common(im):
    r(im, 10, 10, 21, 14, SKIN)
    r(im, 20, 10, 21, 14, SKIN_SH)  # тень справа
    r(im, 9, 12, 9, 13, SKIN)       # уши
    r(im, 22, 12, 22, 13, SKIN_SH)
    r(im, 13, 12, 14, 13, DK)       # глаза
    r(im, 17, 12, 18, 13, DK)
    r(im, 15, 13, 16, 13, SKIN_SH)  # нос
    r(im, 14, 14, 17, 14, SKIN)     # шея


def guard(f):
    im = new()
    legs_guard(im, f)
    # торс: форма
    r(im, 8, 15, 23, 23, B)
    r(im, 8, 15, 9, 20, B_L)     # свет слева
    r(im, 22, 15, 23, 23, B_D)   # тень справа
    r(im, 11, 16, 11, 20, B_D2)  # складки
    r(im, 20, 16, 20, 20, B_D2)
    r(im, 15, 15, 16, 20, B_D)   # планка
    for y in (16, 18, 20):       # пуговицы
        r(im, 15, y, 16, y, WHITE)
    r(im, 8, 15, 10, 15, GOLD)   # погоны
    r(im, 21, 15, 23, 15, GOLD)
    # ремень с пряжкой
    r(im, 8, 21, 23, 23, BELT)
    r(im, 8, 21, 23, 21, (52, 52, 64, 255))
    r(im, 14, 21, 17, 23, GOLD)  # пряжка
    r(im, 15, 22, 16, 22, BELT)
    # подсумок справа
    r(im, 20, 22, 23, 25, POUCH)
    r(im, 20, 22, 23, 23, POUCH_D)
    r(im, 21, 24, 22, 24, POUCH_D)
    arms(im, f, B, GOLD)
    head_common(im)
    # фуражка с кокардой
    r(im, 10, 2, 21, 7, B)
    r(im, 10, 2, 21, 2, B_L)     # верх блик
    r(im, 10, 3, 10, 7, B_L)
    r(im, 20, 3, 21, 7, B_D)
    r(im, 10, 7, 21, 7, B_D)     # околыш
    r(im, 14, 5, 17, 7, GOLD)    # кокарда
    r(im, 15, 5, 16, 6, B_L)
    # козырёк
    r(im, 9, 8, 22, 9, DK)
    r(im, 10, 8, 11, 8, (92, 96, 112, 255))
    outline(im)
    return im


def mate(f):
    im = new()
    legs_mate(im, f)
    # роба
    r(im, 8, 15, 23, 24, R)
    r(im, 8, 15, 9, 23, R_L)     # свет слева
    r(im, 22, 15, 23, 24, R_D)   # тень справа
    r(im, 11, 16, 11, 23, R_D2)  # швы
    r(im, 20, 16, 20, 23, R_D2)
    r(im, 11, 17, 11, 17, R_L)   # стежки
    r(im, 11, 20, 11, 20, R_L)
    r(im, 20, 17, 20, 17, R_L)
    r(im, 20, 20, 20, 20, R_L)
    # карман на груди слева
    r(im, 12, 18, 15, 21, R_L)
    r(im, 12, 18, 15, 18, R_D2)  # клапан
    r(im, 12, 18, 12, 21, R_D2)
    r(im, 15, 18, 15, 21, R_D2)
    r(im, 12, 21, 15, 21, R_D2)
    r(im, 13, 19, 14, 20, R)
    r(im, 13, 19, 13, 19, R_D2)  # пуговка кармана
    # опояска
    r(im, 8, 22, 23, 23, SASH)
    r(im, 14, 22, 17, 23, (110, 50, 16, 255))  # узел
    arms(im, f, R, R_D)
    head_common(im)
    # волосы
    r(im, 10, 2, 21, 9, HAIR)
    r(im, 10, 2, 21, 3, HAIR_L)  # блик
    r(im, 10, 4, 10, 9, HAIR_L)
    r(im, 20, 4, 21, 9, HAIR_D)  # тень
    r(im, 10, 8, 21, 9, HAIR_D)  # чёлка
    r(im, 15, 8, 16, 9, HAIR)    # пробор
    outline(im)
    return im


if __name__ == "__main__":
    base = "tulenko.bratuxa.zomb.top/img"
    out = {"top_guard_0.png": guard(0), "top_guard_1.png": guard(1),
           "top_mate_0.png": mate(0), "top_mate_1.png": mate(1)}
    for n, im in out.items():
        assert im.size == (32, 32) and im.mode == "RGBA"
        im.save(f"{base}/{n}")
        print(n, "ok")
