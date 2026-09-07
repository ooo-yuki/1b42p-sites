#!/usr/bin/env python3
"""tulenko мерка 1: стража и сокамерники в перспективе три четверти.

Восемь картинок 32x32 RGBA: top_guard_0/1/2/3.png, top_mate_0/1/2/3.png.
Три четверти: видны лицо и верх формы (светлая верхняя кромка плеч,
верх фуражки/волос), тело слегка развёрнуто (левая сторона шире, правая
уходит в тень), ноги уходят вниз. Кадры шага отличаются ногами:
f0 — стойка, f1 — левая нога вперёд, f2 — ноги вместе (середина шага),
f3 — правая нога вперёд. Руки слегка качаются в противоход.

Закон scripts/PIXEL_STANDARD.md: свет слева сверху (HL #F0D294 верх/лево,
SH #704858 низ/право), обводка INK #2E1E14 (чёрная запрещена), без подушки,
без дизеринга, кластеры >= 2 px, фон прозрачный.
"""
from PIL import Image

S = 32
INK = (46, 30, 20, 255)
HL = (240, 210, 148, 255)
SH = (112, 72, 88, 255)
SKIN = (255, 221, 181, 255)
SKIN_SH = (232, 186, 142, 255)
DK = (18, 18, 24, 255)
GOLD = (255, 210, 60, 255)
WHITE = (232, 236, 244, 255)

B = (52, 102, 220, 255)
B_D = (28, 58, 150, 255)
B_D2 = (20, 42, 112, 255)
B_L = (141, 189, 245, 255)
TROU = (26, 30, 52, 255)
TROU_L = (48, 56, 88, 255)
BOOT_HI = (72, 76, 94, 255)
BELT = (32, 32, 40, 255)
BELT_L = (52, 52, 64, 255)
POUCH = (82, 62, 38, 255)
POUCH_D = (54, 40, 24, 255)

R = (255, 111, 32, 255)
R_D = (203, 76, 20, 255)
R_D2 = (148, 54, 14, 255)
R_L = (255, 162, 82, 255)
HAIR = (110, 66, 34, 255)
HAIR_D = (74, 48, 28, 255)
HAIR_L = (152, 98, 52, 255)
SASH = (150, 70, 22, 255)
SASH_D = (110, 50, 16, 255)
SHOE = (40, 36, 44, 255)

SH1 = (50, 34, 70, 102)
SH2 = (50, 34, 70, 71)
SH3 = (50, 34, 70, 41)


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def r(im, x0, y0, x1, y1, c):
    px = im.load()
    for y in range(max(0, y0), min(S, y1 + 1)):
        for x in range(max(0, x0), min(S, x1 + 1)):
            px[x, y] = c


def outline(im):
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


def shadow(im, x0, x1, y):
    # мягкая тень под ногами: три слоя, к краям уже
    r(im, x0, y, x1, y, SH1)
    r(im, x0 + 2, y + 1, x1 - 2, y + 1, SH2)


def head(im):
    # лицо три четверти: свет слева сверху, правая сторона в тени,
    # видно только левое ухо (правое ушло за разворот)
    r(im, 10, 10, 21, 14, SKIN)
    r(im, 10, 10, 13, 10, HL)       # свет на лоб слева сверху
    r(im, 20, 10, 21, 14, SKIN_SH)  # тень справа
    r(im, 9, 12, 9, 13, SKIN)       # левое ухо
    r(im, 13, 12, 14, 13, DK)       # левый глаз
    r(im, 17, 12, 18, 13, DK)       # правый глаз (ближе к краю)
    r(im, 14, 13, 15, 13, SKIN_SH)  # нос со сдвигом влево
    r(im, 14, 14, 17, 14, SKIN)


def guard_headgear(im):
    # фуражка: виден верх (светлая плоскость), козырёк сдвинут влево
    r(im, 10, 2, 21, 4, B)          # верхняя плоскость
    r(im, 10, 2, 17, 2, B_L)        # блик верха слева
    r(im, 10, 3, 10, 4, B_L)
    r(im, 20, 3, 21, 7, B_D)        # тень справа
    r(im, 10, 5, 21, 7, B)          # лобная часть
    r(im, 10, 7, 21, 7, B_D)        # околыш
    r(im, 14, 5, 17, 7, GOLD)       # кокарда
    r(im, 15, 5, 16, 6, B_L)
    r(im, 8, 8, 21, 9, DK)          # козырёк (выступает влево)
    r(im, 8, 8, 10, 8, BOOT_HI)


def mate_headgear(im):
    # волосы: виден верх (светлая плоскость), чёлка спереди
    r(im, 10, 2, 21, 4, HAIR)       # верхняя плоскость
    r(im, 10, 2, 16, 3, HAIR_L)     # блик верха слева
    r(im, 10, 4, 10, 9, HAIR_L)
    r(im, 20, 4, 21, 9, HAIR_D)     # тень справа
    r(im, 10, 5, 21, 9, HAIR)       # лобная часть
    r(im, 10, 8, 21, 9, HAIR_D)     # чёлка
    r(im, 14, 8, 15, 9, HAIR)       # пробор


def torso_guard(im):
    # верх формы: светлая кромка плеч (вид сверху), левый погон шире
    r(im, 8, 15, 21, 15, B_L)       # верх плеч
    r(im, 8, 15, 23, 23, B)
    r(im, 8, 15, 9, 20, B_L)        # свет слева
    r(im, 22, 15, 23, 23, B_D)      # тень справа
    r(im, 21, 16, 21, 20, B_D2)     # складка уходящего бока
    r(im, 11, 16, 11, 20, B_D2)     # складка
    r(im, 14, 15, 15, 20, B_D)      # планка (сдвинута влево — разворот)
    for y in (16, 18, 20):
        r(im, 14, y, 15, y, WHITE)  # пуговицы
    r(im, 7, 15, 10, 15, GOLD)      # левый погон (полный)
    r(im, 21, 15, 23, 15, GOLD)     # правый погон (укорочен)
    r(im, 8, 21, 23, 23, BELT)      # ремень
    r(im, 8, 21, 21, 21, BELT_L)
    r(im, 13, 21, 16, 23, GOLD)     # пряжка
    r(im, 14, 22, 15, 22, BELT)
    r(im, 20, 22, 23, 25, POUCH)    # подсумок на правом боку
    r(im, 20, 22, 23, 23, POUCH_D)
    r(im, 21, 24, 22, 24, POUCH_D)


def torso_mate(im):
    r(im, 8, 15, 21, 15, R_L)       # верх плеч
    r(im, 8, 15, 23, 24, R)
    r(im, 8, 15, 9, 23, R_L)        # свет слева
    r(im, 22, 15, 23, 24, R_D)      # тень справа
    r(im, 21, 16, 21, 23, R_D2)     # шов уходящего бока
    r(im, 11, 16, 11, 23, R_D2)     # шов
    r(im, 11, 17, 11, 17, R_L)
    r(im, 11, 20, 11, 20, R_L)
    r(im, 12, 18, 15, 21, R_L)      # карман слева на груди
    r(im, 12, 18, 15, 18, R_D2)
    r(im, 12, 18, 12, 21, R_D2)
    r(im, 15, 18, 15, 21, R_D2)
    r(im, 12, 21, 15, 21, R_D2)
    r(im, 13, 19, 14, 20, R)
    r(im, 13, 19, 14, 19, R_D2)
    r(im, 8, 22, 23, 23, SASH)      # опояска
    r(im, 13, 22, 16, 23, SASH_D)   # узел


# кадры шага: (левая нога x0,x1,низ штанины / правая нога / ступни y / кач рук)
FRAMES = {
    0: ((9, 12, 26), (19, 22, 26), 27, 0),
    1: ((8, 11, 27), (19, 22, 25), 28, 1),  # левая вперёд (длиннее/ниже)
    2: ((10, 13, 26), (18, 21, 26), 27, 0),  # ноги вместе
    3: ((9, 12, 25), (20, 23, 27), 28, -1),  # правая вперёд
}


def legs_guard(im, f):
    (lx0, lx1, lbot), (rx0, rx1, rbot), fy, _ = FRAMES[f]
    fwd_l = lbot > rbot
    # левая нога
    r(im, lx0, 23, lx1, lbot, TROU)
    r(im, lx0, 23, lx0, lbot, TROU_L)
    r(im, lx0, lbot + 1, lx1, lbot + 3, DK)
    r(im, lx0, lbot + 1, lx1, lbot + 1, BOOT_HI)
    if fwd_l:
        r(im, lx0, lbot + 1, lx0 + 1, lbot + 2, HL)  # носок вперёд ловит свет
    r(im, lx0, lbot + 4, lx1, lbot + 4, INK)  # подошва
    # правая нога
    r(im, rx0, 23, rx1, rbot, TROU)
    r(im, rx0, 23, rx0, rbot, TROU_L)
    r(im, rx1, 23, rx1, rbot, B_D2)  # тень уходящей ноги
    r(im, rx0, rbot + 1, rx1, rbot + 3, DK)
    r(im, rx0, rbot + 1, rx1, rbot + 1, BOOT_HI)
    if not fwd_l and f != 0:
        r(im, rx0, rbot + 1, rx0 + 1, rbot + 2, HL)
    r(im, rx0, rbot + 4, rx1, rbot + 4, INK)
    shadow(im, min(lx0, rx0) - 1, max(lx1, rx1) + 1, max(lbot, rbot) + 5)


def legs_mate(im, f):
    (lx0, lx1, lbot), (rx0, rx1, rbot), fy, _ = FRAMES[f]
    fwd_l = lbot > rbot
    r(im, lx0, 24, lx1, lbot, SHOE)
    r(im, lx0, 24, lx0, lbot, HAIR_L)
    r(im, lx0, lbot + 1, lx1, lbot + 3, DK)
    r(im, lx0, lbot + 1, lx1, lbot + 1, BOOT_HI)
    if fwd_l:
        r(im, lx0, lbot + 1, lx0 + 1, lbot + 2, HL)
    r(im, lx0, lbot + 4, lx1, lbot + 4, INK)
    r(im, rx0, 24, rx1, rbot, SHOE)
    r(im, rx0, 24, rx0, rbot, HAIR_L)
    r(im, rx1, 24, rx1, rbot, HAIR_D)
    r(im, rx0, rbot + 1, rx1, rbot + 3, DK)
    r(im, rx0, rbot + 1, rx1, rbot + 1, BOOT_HI)
    if not fwd_l and f != 0:
        r(im, rx0, rbot + 1, rx0 + 1, rbot + 2, HL)
    r(im, rx0, rbot + 4, rx1, rbot + 4, INK)
    shadow(im, min(lx0, rx0) - 1, max(lx1, rx1) + 1, max(lbot, rbot) + 5)


def arms(im, f, sleeve, sleeve_sh, cuff):
    _, _, _, sw = FRAMES[f]
    # левая рука видна полностью, правая уходит за бок (уже и выше)
    dl = 1 if sw >= 0 else 0
    dr = 0 if sw >= 0 else 1
    r(im, 5, 15, 7, 21, sleeve)
    r(im, 5, 15, 5, 21, HL if sleeve in (B, R) else sleeve)
    r(im, 5, 20, 7, 21, cuff)
    r(im, 5, 22, 7, 24 + dl, SKIN)
    r(im, 7, 22, 7, 24 + dl, SKIN_SH)
    r(im, 24, 16, 26, 21, sleeve)
    r(im, 26, 16, 26, 21, sleeve_sh)
    r(im, 24, 20, 26, 21, cuff)
    r(im, 24, 22, 26, 24 + dr, SKIN)
    r(im, 26, 22, 26, 24 + dr, SKIN_SH)


def guard(f):
    im = new()
    legs_guard(im, f)
    torso_guard(im)
    arms(im, f, B, B_D, GOLD)
    head(im)
    guard_headgear(im)
    outline(im)
    return im


def mate(f):
    im = new()
    legs_mate(im, f)
    torso_mate(im)
    arms(im, f, R, R_D, R_D)
    head(im)
    mate_headgear(im)
    outline(im)
    return im


if __name__ == "__main__":
    base = "tulenko.bratuxa.zomb.top/img"
    out = {}
    for f in range(4):
        out[f"top_guard_{f}.png"] = guard(f)
        out[f"top_mate_{f}.png"] = mate(f)
    for n, im in out.items():
        assert im.size == (32, 32) and im.mode == "RGBA"
        im.save(f"{base}/{n}")
        print(n, "ok")
