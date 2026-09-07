#!/usr/bin/env python3
"""tulenko: 14 картинок корпусов 32x32 по закону PIXEL_STANDARD.

Клетки (непрозрачные 32x32, свет слева сверху):
  top_h качалка (стойка со штангой), top_o котёл, top_v фургон,
  top_a верстак, top_c КПП (будка+шлагбаум), top_z забор, top_u лаз.
Люди (RGBA, фон прозрачный, 2 кадра шагом ног/рук):
  top_cook повар (белый колпак+фартук), top_boss начальник (тёмный
  костюм+красный галстук), top_warden смотритель (серая форма+фуражка).

Закон: HL #F0D294 верх/лево, SH #704858 низ/право, обводка INK #2E1E14
(чёрного нет), кластеры >=2 px, без диттеринга и подушки.
Повтор: python3 scripts/artHD_new.py (запуск из корня /root/sites).
"""
from PIL import Image

BASE = "tulenko.bratuxa.zomb.top/img"
S = 32

INK = (46, 30, 20, 255)
HL = (240, 210, 148, 255)
SH = (112, 72, 88, 255)
SPARK = (232, 222, 202, 255)
SHADOW = (50, 34, 70)

SKIN = (255, 221, 181, 255)
SKIN_SH = (232, 186, 142, 255)


def new(alpha=True):
    return Image.new("RGBA", (S, S), (0, 0, 0, 0) if alpha else (0, 0, 0, 255))


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


def soft_shadow(im, x0, x1, yb):
    px = im.load()
    for dx, dy, a in ((1, 0, 40), (0, 1, 28), (1, 2, 16)):
        yy = yb + dy
        if not 0 <= yy < S:
            continue
        for x in range(x0 + dx + 1, x1 - dx):
            rr, gg, bb, al = px[x, yy]
            px[x, yy] = (SHADOW[0], SHADOW[1], SHADOW[2],
                         max(al, a) if al else a)


def frame(im, x0, y0, x1, y1, c):
    """Прямоугольник с фаской: свет верх/лево, тень низ/право."""
    r(im, x0, y0, x1, y1, c)
    px = im.load()
    for x in range(x0, x1 + 1):
        px[x, y0] = HL
        px[x, y1] = SH
    for y in range(y0, y1 + 1):
        px[x0, y] = HL
        px[x1, y] = SH


def floor_plates(im, a, b, seam):
    r(im, 0, 0, 31, 31, seam)
    for sx, sy in ((0, 0), (16, 0), (0, 16), (16, 16)):
        face = a if (sx + sy) // 16 % 2 == 0 else b
        r(im, sx + 1, sy + 1, sx + 14, sy + 14, face)
        px = im.load()
        for x in range(sx + 1, sx + 15):
            px[x, sy + 1] = HL
        for y in range(sy + 1, sy + 15):
            px[sx + 1, y] = HL


def nail(im, x, y):
    """Заклёпка 2x2 + искра 1 px слева сверху (искре можно 1 px)."""
    r(im, x, y, x + 1, y + 1, (58, 40, 30, 255))
    im.load()[x - 1, y - 1] = SPARK


# ---------- клетки ----------

def tile_h():
    im = new(False)
    floor_plates(im, (122, 118, 112, 255), (108, 104, 100, 255), INK)
    STEEL = (150, 156, 170, 255)
    STEEL_D = (88, 90, 108, 255)
    BAR = (70, 60, 52, 255)
    # скамья вдоль низа
    frame(im, 6, 22, 25, 27, BAR)
    r(im, 8, 23, 23, 24, (126, 96, 62, 255))
    # стойки
    for x0 in (7, 23):
        frame(im, x0, 8, x0 + 1, 22, STEEL)
        r(im, x0 + 1, 8, x0 + 1, 22, STEEL_D)
    # гриф штанги поперёк
    r(im, 4, 10, 27, 11, STEEL)
    r(im, 4, 10, 27, 10, HL)
    r(im, 4, 11, 27, 11, STEEL_D)
    # блины кластерами
    for x0 in (4, 24):
        r(im, x0, 6, x0 + 3, 15, (60, 52, 70, 255))
        r(im, x0, 6, x0, 15, HL)
        r(im, x0 + 3, 6, x0 + 3, 15, SH)
    nail(im, 9, 24)
    nail(im, 22, 24)
    return im


def tile_o():
    im = new(False)
    floor_plates(im, (140, 132, 120, 255), (126, 118, 108, 255), INK)
    IRON = (74, 74, 88, 255)
    IRON_D = (48, 46, 60, 255)
    # очаг
    frame(im, 5, 20, 26, 28, (96, 62, 44, 255))
    r(im, 7, 22, 24, 26, (150, 70, 30, 255))
    r(im, 9, 23, 15, 25, (255, 170, 60, 255))
    r(im, 17, 23, 22, 25, (255, 170, 60, 255))
    # котёл: круг-эллипс сверху
    for y in range(6, 22):
        for x in range(6, 26):
            dx, dy = (x - 15.5) / 9.5, (y - 13.5) / 7.5
            if dx * dx + dy * dy <= 1.0:
                im.load()[x, y] = IRON
    px = im.load()
    for x in range(7, 25):  # свет сверху слева дугой
        for y in range(6, 22):
            dx, dy = (x - 15.5) / 9.5, (y - 13.5) / 7.5
            d = dx * dx + dy * dy
            if 0.55 < d <= 1.0 and (y < 12 or x < 13):
                px[x, y] = HL if y < 10 else IRON
            if 0.55 < d <= 1.0 and (y > 16 or x > 19):
                px[x, y] = SH
    for y in range(10, 18):  # варево
        for x in range(10, 22):
            dx, dy = (x - 15.5) / 6.0, (y - 13.5) / 4.5
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = (150, 180, 90, 255)
    r(im, 10, 10, 21, 11, (190, 215, 130, 255))  # блик варева кластером
    for x, y in ((8, 8), (22, 8)):
        nail(im, x, y)
    return im


def tile_v():
    im = new(False)
    floor_plates(im, (118, 114, 110, 255), (104, 100, 98, 255), INK)
    BODY = (70, 130, 150, 255)
    BODY_D = (46, 88, 108, 255)
    # кузов фургона сверху
    frame(im, 5, 6, 26, 24, BODY)
    r(im, 6, 7, 25, 23, BODY)
    px = im.load()
    for x in range(6, 26):
        px[x, 7] = HL
    for y in range(7, 24):
        px[6, y] = HL
        px[25, y] = BODY_D
    # кабина (лобовое снизу)
    r(im, 6, 19, 25, 23, (60, 110, 130, 255))
    r(im, 8, 20, 23, 22, (180, 220, 235, 255))
    r(im, 8, 20, 23, 20, HL)
    r(im, 23, 20, 23, 22, BODY_D)
    # колёса кластерами по бокам
    for y0 in (8, 16):
        for x0 in (3, 27):
            r(im, x0, y0, x0 + 1, y0 + 3, (40, 38, 46, 255))
            r(im, x0, y0, x0 + 1, y0, HL)
    # фары
    r(im, 7, 25, 10, 26, (255, 230, 150, 255))
    r(im, 21, 25, 24, 26, (255, 230, 150, 255))
    nail(im, 8, 10)
    nail(im, 22, 10)
    return im


def tile_a():
    im = new(False)
    floor_plates(im, (122, 116, 108, 255), (110, 104, 98, 255), INK)
    WOOD = (140, 98, 58, 255)
    # верстак
    frame(im, 4, 12, 27, 22, WOOD)
    r(im, 6, 14, 25, 20, (166, 122, 74, 255))
    r(im, 6, 14, 25, 15, HL)
    # тиски слева
    frame(im, 4, 10, 9, 14, (90, 94, 108, 255))
    r(im, 5, 8, 8, 9, (60, 62, 76, 255))
    # молот и пила на столе кластерами
    r(im, 11, 16, 17, 17, (80, 78, 90, 255))  # головка молота
    r(im, 11, 16, 11, 17, HL)
    r(im, 18, 16, 23, 17, (150, 110, 70, 255))  # ручка
    r(im, 12, 19, 20, 20, (180, 186, 200, 255))  # полотно пилы
    r(im, 12, 19, 20, 19, HL)
    r(im, 21, 19, 24, 20, (110, 70, 40, 255))  # ручка пилы
    # ножки
    for x0 in (5, 24):
        r(im, x0, 23, x0 + 2, 28, WOOD)
        r(im, x0 + 2, 23, x0 + 2, 28, SH)
    nail(im, 7, 15)
    nail(im, 24, 15)
    return im


def tile_c():
    im = new(False)
    floor_plates(im, (126, 120, 114, 255), (112, 106, 102, 255), INK)
    WALL = (150, 140, 120, 255)
    # будка КПП слева
    frame(im, 3, 6, 13, 24, WALL)
    r(im, 4, 7, 12, 23, (168, 158, 138, 255))
    r(im, 5, 9, 10, 14, (90, 150, 180, 255))  # окно
    r(im, 5, 9, 10, 9, HL)
    r(im, 5, 9, 5, 14, HL)
    r(im, 10, 9, 10, 14, SH)
    r(im, 5, 17, 10, 22, (110, 80, 50, 255))  # дверь будки
    # крыша будки
    frame(im, 2, 3, 14, 6, (120, 70, 50, 255))
    # шлагбаум поперёк
    r(im, 14, 12, 15, 24, (120, 120, 130, 255))  # стойка
    r(im, 14, 12, 14, 24, HL)
    for x in range(15, 30, 4):  # полосатое плечо кластерами
        r(im, x, 10, min(x + 1, 29), 11, (220, 220, 225, 255))
        r(im, x + 2, 10, min(x + 3, 29), 11, (200, 50, 40, 255))
    r(im, 15, 10, 29, 10, HL)
    r(im, 15, 11, 29, 11, SH)
    return im


def tile_z():
    im = new(False)
    floor_plates(im, (118, 114, 108, 255), (106, 102, 98, 255), INK)
    # столбы
    for x0 in (3, 14, 25):
        frame(im, x0, 4, x0 + 3, 27, (110, 80, 52, 255))
        r(im, x0, 4, x0 + 3, 5, HL)
        nail(im, x0 + 1, 8)
        nail(im, x0 + 1, 22)
    # две перекладины с колючкой
    for y0 in (9, 21):
        r(im, 3, y0, 28, y0 + 1, (140, 104, 66, 255))
        r(im, 3, y0, 28, y0, HL)
        r(im, 3, y0 + 1, 28, y0 + 1, SH)
    # сетка: редкие вертикали кластерами 2 px
    for x in range(7, 28, 4):
        r(im, x, 11, x, 12, (150, 154, 168, 255))
        r(im, x, 18, x, 19, (150, 154, 168, 255))
    return im


def tile_u():
    im = new(False)
    floor_plates(im, (124, 118, 112, 255), (110, 104, 100, 255), INK)
    # лаз: тёмная дыра со сколом плит
    px = None
    for y in range(9, 24):
        for x in range(8, 24):
            dx, dy = (x - 15.5) / 7.5, (y - 16.0) / 6.5
            if dx * dx + dy * dy <= 1.0:
                im.load()[x, y] = (24, 20, 30, 255)
    px = im.load()
    for x in range(8, 24):  # светлая кромка сверху слева
        for y in range(9, 24):
            dx, dy = (x - 15.5) / 7.5, (y - 16.0) / 6.5
            d = dx * dx + dy * dy
            if 0.6 < d <= 1.0 and (y < 13 or x < 12):
                px[x, y] = HL
            if 0.6 < d <= 1.0 and (y > 19 or x > 20):
                px[x, y] = SH
    # ступени вниз кластерами
    r(im, 11, 17, 20, 18, (52, 46, 60, 255))
    r(im, 12, 20, 19, 21, (38, 32, 46, 255))
    r(im, 11, 17, 20, 17, (90, 84, 104, 255))
    # откинутая крышка люка справа
    frame(im, 23, 8, 29, 20, (140, 98, 58, 255))
    r(im, 24, 9, 28, 19, (166, 122, 74, 255))
    nail(im, 25, 11)
    return im


# ---------- люди ----------

def legs(im, f, trouser, boot=(30, 30, 44, 255)):
    long_left = (f == 0)
    for x0, x1, long in ((9, 13, long_left), (18, 22, not long_left)):
        bot, sole = (26, 30) if long else (25, 29)
        r(im, x0, 23, x1, bot, trouser)
        r(im, x0, 23, x0, bot, HL)
        r(im, x1, 23, x1, bot, SH)
        r(im, x0, bot + 1, x1, sole - 1, boot)
        r(im, x0, bot + 1, x1, bot + 1, (92, 96, 112, 255))
        r(im, x0, sole, x1, sole, INK)


def arms(im, f, sleeve, sleeve_l, sleeve_d):
    dl = 1 if f == 0 else 0
    dr = 0 if f == 0 else 1
    for x0, x1, d in ((5, 7, dl), (24, 26, dr)):
        r(im, x0, 15, x1, 21, sleeve)
        r(im, x0, 15, x0, 21, sleeve_l)
        r(im, x0, 15, x1, 15, sleeve_l)
        r(im, x1, 15, x1, 21, sleeve_d)
        r(im, x0, 22, x1, 23 + d, SKIN)
        r(im, x0, 22, x0, 23 + d, HL)
        r(im, x1, 22, x1, 23 + d, SKIN_SH)


def head(im):
    r(im, 10, 10, 21, 14, SKIN)
    r(im, 10, 10, 21, 10, HL)
    r(im, 10, 10, 10, 14, HL)
    r(im, 21, 10, 21, 14, SKIN_SH)
    r(im, 9, 12, 9, 13, SKIN)
    r(im, 22, 12, 22, 13, SKIN_SH)
    r(im, 13, 12, 14, 13, INK)
    r(im, 17, 12, 18, 13, INK)
    r(im, 15, 13, 16, 13, SKIN_SH)
    r(im, 14, 14, 17, 14, SKIN_SH)


def body(im, f, base, light, dark, apron=None):
    r(im, 8, 15, 23, 23, base)
    px = im.load()
    for x in range(8, 24):
        px[x, 15] = light
    for y in range(15, 24):
        px[8, y] = light
        px[23, y] = dark
    for x in range(8, 24):
        px[x, 23] = SH
    if apron:
        r(im, 12, 16, 19, 23, apron)
        r(im, 12, 16, 12, 23, HL)
        r(im, 19, 16, 19, 23, dark)
        r(im, 12, 23, 19, 23, SH)


def person_cook(f):
    im = new()
    soft_shadow(im, 7, 24, 29)
    legs(im, f, (70, 74, 84, 255))
    body(im, f, (120, 128, 138, 255), (170, 178, 190, 255),
         (80, 84, 98, 255), apron=(232, 236, 244, 255))
    r(im, 14, 16, 17, 18, (200, 60, 50, 255))  # поварёшка на фартуке
    arms(im, f, (120, 128, 138, 255), (170, 178, 190, 255), (80, 84, 98, 255))
    head(im)
    r(im, 9, 4, 22, 9, (232, 236, 244, 255))  # колпак
    r(im, 9, 4, 22, 4, HL)
    r(im, 9, 4, 9, 9, HL)
    r(im, 22, 4, 22, 9, (170, 178, 190, 255))
    r(im, 9, 8, 22, 9, (200, 208, 218, 255))  # околыш
    outline(im)
    return im


def person_boss(f):
    im = new()
    soft_shadow(im, 7, 24, 29)
    legs(im, f, (34, 32, 44, 255))
    body(im, f, (48, 46, 62, 255), (86, 84, 106, 255), (56, 50, 80, 255))
    r(im, 14, 15, 17, 20, (232, 236, 244, 255))  # рубашка
    r(im, 15, 16, 16, 22, (190, 40, 36, 255))  # галстук
    r(im, 15, 16, 15, 22, (240, 120, 110, 255))
    arms(im, f, (48, 46, 62, 255), (86, 84, 106, 255), (56, 50, 80, 255))
    head(im)
    r(im, 10, 7, 21, 9, (60, 44, 34, 255))  # зачёс
    r(im, 10, 7, 21, 7, (120, 92, 62, 255))
    r(im, 10, 7, 10, 9, (120, 92, 62, 255))
    outline(im)
    return im


def person_warden(f):
    im = new()
    soft_shadow(im, 7, 24, 29)
    legs(im, f, (40, 42, 56, 255))
    body(im, f, (74, 78, 92, 255), (128, 132, 150, 255), (58, 54, 88, 255))
    r(im, 8, 21, 23, 23, (36, 38, 50, 255))  # ремень
    r(im, 8, 21, 23, 21, (80, 82, 100, 255))
    r(im, 14, 21, 17, 23, (255, 210, 60, 255))  # пряжка
    r(im, 14, 21, 17, 21, (255, 226, 140, 255))
    r(im, 15, 16, 16, 16, (255, 210, 60, 255))  # значок 2 px
    r(im, 15, 18, 16, 18, (255, 210, 60, 255))
    arms(im, f, (74, 78, 92, 255), (128, 132, 150, 255), (58, 54, 88, 255))
    head(im)
    r(im, 10, 3, 21, 7, (74, 78, 92, 255))  # фуражка
    r(im, 10, 3, 21, 3, (128, 132, 150, 255))
    r(im, 10, 3, 10, 7, (128, 132, 150, 255))
    r(im, 21, 3, 21, 7, (58, 54, 88, 255))
    r(im, 15, 4, 16, 6, (255, 210, 60, 255))  # кокарда
    r(im, 14, 3, 14, 3, SPARK)
    r(im, 9, 8, 22, 9, (36, 38, 50, 255))  # козырёк
    r(im, 9, 8, 10, 8, (92, 96, 112, 255))
    outline(im)
    return im


def main():
    out = []
    for name, fn in [("top_h", tile_h), ("top_o", tile_o), ("top_v", tile_v),
                     ("top_a", tile_a), ("top_c", tile_c), ("top_z", tile_z),
                     ("top_u", tile_u)]:
        im = fn().convert("RGB")
        assert im.size == (32, 32)
        p = f"{BASE}/{name}.png"
        im.save(p)
        out.append(p)
    for name, fn in [("top_cook", person_cook), ("top_boss", person_boss),
                     ("top_warden", person_warden)]:
        for f in (0, 1):
            im = fn(f)
            assert im.size == (32, 32) and im.mode == "RGBA"
            p = f"{BASE}/{name}_{f}.png"
            im.save(p)
            out.append(p)
    for p in out:
        print("OK", p)


if __name__ == "__main__":
    main()
