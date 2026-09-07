#!/usr/bin/env python3
"""tulenko эталон коробки: HD-копия + перерисовка ящиков тем же почерком. 32x32 RGBA.

Закон (см. scripts/PIXEL_STANDARD.md): свет слева сверху, тень к фиолету,
блик к жёлтому, запрет подушки и чёрной обводки, вид три четверти,
гвоздь с искрой, clusters чистые.
"""
from PIL import Image

BASE = "/root/sites/tulenko.bratuxa.zomb.top/img"
S = 32

INK = (46, 30, 20, 255)        # обводка: тёмно-коричневая, не чёрная
WOOD = (140, 98, 60, 255)      # лоб, основа
WOOD_TOP = (166, 122, 78, 255) # верхняя грань, светлее
FRAME = (172, 128, 80, 255)    # рама и раскос
HL = (240, 210, 148, 255)      # фаска/блик: сдвиг к жёлтому
GRAIN = (102, 68, 44, 255)     # зерно-штрихи
SH = (112, 72, 88, 255)        # тень: сдвиг к фиолету
DEEP = (70, 46, 66, 255)       # глубокая фиолет-тень
NAIL = (58, 40, 30, 255)       # гвоздь: тёмная точка
SPARK = (232, 222, 200, 255)   # искра гвоздя (1 px слева сверху)
HOLE = (38, 26, 30, 255)       # нутро открытого ящика
SHADOW = (50, 34, 70)          # мягкая тень под коробкой (фиолет, alpha слоями)

RAG_R, RAG_RD, RAG_RL = (158, 76, 72, 255), (112, 52, 52, 255), (198, 132, 118, 255)
RAG_B, RAG_BD, RAG_BL = (110, 120, 140, 255), (78, 88, 108, 255), (158, 172, 196, 255)
RAG_T, RAG_TD, RAG_TL = (180, 158, 118, 255), (138, 118, 82, 255), (220, 200, 160, 255)
SACK, SACK_D, SACK_L = (178, 152, 108, 255), (140, 112, 118, 255), (220, 198, 152, 255)
ROPE, ROPE_D = (192, 172, 122, 255), (150, 126, 86, 255)


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def soft_shadow(img, x0, x1, y):
    """Мягкая тень под коробкой: 3 слоя, к краям прозрачнее."""
    px = img.load()
    for dx, dy, a in [(1, 0, 40), (0, 1, 28), (1, 2, 16)]:
        for x in range(x0 + dx + 1, x1 - dx):
            r, g, b, al = px[x, y + dy]
            px[x, y + dy] = (SHADOW[0], SHADOW[1], SHADOW[2], max(al, a) if al else a)


def rect(img, x0, y0, x1, y1, fill):
    px = img.load()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            px[x, y] = fill


def box(img, x0, y0, x1, y1, fill):
    """Прямоугольник с обводкой INK."""
    d = img.load()
    rect(img, x0, y0, x1, y1, INK)
    rect(img, x0 + 1, y0 + 1, x1 - 1, y1 - 1, fill)
    return d


def nail(img, cx, cy):
    """Гвоздь 3x3: тёмная точка + белая искра слева сверху."""
    px = img.load()
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            px[cx + dx, cy + dy] = INK
    px[cx, cy] = NAIL
    px[cx - 1, cy] = NAIL
    px[cx, cy - 1] = NAIL
    px[cx + 1, cy] = NAIL
    px[cx, cy + 1] = NAIL
    px[cx - 1, cy - 1] = SPARK


def grain(img, x0, y0, x1, y1, seed=0):
    """Зерно: короткие диагональные штрихи 2-3 px, детерминированно, редко."""
    px = img.load()
    for y in range(y0, y1 + 1):
        for x in range(x0, x1 + 1):
            if (x * 7 + y * 13 + seed) % 17 == 0 and x + 2 <= x1 and y + 1 <= y1:
                px[x, y] = GRAIN
                px[x + 1, y] = GRAIN
                if (x + y) % 2 == 0 and x + 2 <= x1:
                    px[x + 2, y] = GRAIN
                else:
                    px[x + 1, y + 1] = GRAIN


def brace(img, x0, y0, x1, y1):
    """X-раскос: две сплошные диагонали 2 px. Кромка INK, тело FRAME,
    без пунктира и крошки внутри."""
    px = img.load()
    n = x1 - x0
    h = y1 - y0
    for side in (0, 1):
        for i in range(n + 1):
            t = i / max(n, 1)
            y = y0 + round(t * h) if side == 0 else y1 - round(t * h)
            x = x0 + i
            yy = y
            if y0 <= yy <= y1 and px[x, yy] != INK:
                px[x, yy] = FRAME
            yy = y + 1
            if y0 <= yy <= y1 and px[x, yy] != INK:
                px[x, yy] = INK


def frame(img, x0, y0, x1, y1, field, cross=True, center_nail=True):
    """Лоб: рама по периметру + поле досок + гвозди.
    cross: X-раскос (только если поле высокое); иначе щели досок."""
    box(img, x0, y0, x1, y1, FRAME)
    px = img.load()
    for x in range(x0 + 1, x1):  # фаска: светлая кромка сверху
        px[x, y0 + 1] = HL
    for y in range(y0 + 1, y1):  # свет слева
        px[x0 + 1, y] = HL
        px[x1 - 1, y] = SH     # тень справа
    for x in range(x0 + 1, x1):  # тень снизу
        px[x, y1 - 1] = SH
    rect(img, x0 + 3, y0 + 3, x1 - 3, y1 - 3, field)
    grain(img, x0 + 3, y0 + 3, x1 - 3, y1 - 3, seed=2)
    if cross and (y1 - y0) >= 12:
        brace(img, x0 + 3, y0 + 3, x1 - 3, y1 - 3)
    else:  # низкое поле: две щели между досками
        for my in (y0 + (y1 - y0) // 3 + 1, y0 + 2 * (y1 - y0) // 3 + 1):
            for x in range(x0 + 3, x1 - 2):
                px[x, my] = GRAIN
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    spots = [(x0 + 2, y0 + 2), (x1 - 2, y0 + 2),
             (x0 + 2, y1 - 2), (x1 - 2, y1 - 2)]
    if center_nail and cross and (y1 - y0) >= 12:
        spots.append((cx, cy))
    for nx, ny in spots:
        nail(img, nx, ny)


def lid(img, x0, y0, x1, y1):
    """Верхняя грань: доски + фаска светлой кромкой, свет слева сверху."""
    box(img, x0, y0, x1, y1, WOOD_TOP)
    px = img.load()
    for x in range(x0 + 1, x1):
        px[x, y0 + 1] = HL
    for y in range(y0 + 1, y1):
        px[x0 + 1, y] = HL
        px[x1 - 1, y] = SH
    my = (y0 + y1) // 2
    for x in range(x0 + 1, x1):
        if x % 5 == 0:
            px[x, my] = INK
        elif (x * 3) % 7 == 0:
            px[x, my] = GRAIN
    grain(img, x0 + 1, y0 + 2, x1 - 1, y1 - 1, seed=9)


def closed():
    """Закрытый ящик — копия эталона: верхняя грань + лоб с X-раскосом."""
    img = new()
    soft_shadow(img, 5, 26, 27)
    lid(img, 5, 4, 26, 8)
    frame(img, 5, 9, 26, 26, WOOD)
    return img


def crate_open():
    """Открытый ящик: створки врозь, нутро, три тряпки. Тот же сюжет что был."""
    img = new()
    px = img.load()
    soft_shadow(img, 5, 26, 27)
    for fx0 in (0, 27):  # створки лежат на полу слева и справа
        box(img, fx0, 8, fx0 + 4, 20, WOOD_TOP)
        for gy in (11, 14, 17):
            for x in range(fx0 + 1, fx0 + 4):
                px[x, gy] = GRAIN
        px[fx0 + 1, 9] = HL
        px[fx0 + 2, 19] = SH
        nail(img, fx0 + 2, 12)
    box(img, 5, 5, 26, 23, FRAME)  # верхняя обвязка
    for x in range(6, 26):
        px[x, 6] = HL
    box(img, 7, 7, 24, 21, HOLE)  # тёмное нутро
    # тряпка 1: красная
    box(img, 9, 9, 15, 14, RAG_R)
    for x in range(10, 15):
        px[x, 9] = RAG_RL
    for y in range(10, 14):
        px[9, y] = RAG_RL
    px[12, 12] = RAG_RD
    px[13, 11] = RAG_RD
    # тряпка 2: сизая
    box(img, 14, 12, 22, 17, RAG_B)
    for x in range(15, 22):
        px[x, 12] = RAG_BL
    px[21, 16] = RAG_BL
    px[17, 15] = RAG_BD
    px[19, 14] = RAG_BD
    # тряпка 3: песочная
    box(img, 10, 15, 17, 20, RAG_T)
    for x in range(11, 17):
        px[x, 15] = RAG_TL
    px[16, 19] = RAG_TL
    px[13, 18] = RAG_TD
    for nx, ny in [(7, 7), (24, 7), (7, 21), (24, 21)]:
        nail(img, nx, ny)
    frame(img, 4, 23, 27, 30, WOOD, cross=False, center_nail=False)  # лоб снизу, той же рукой
    return img


def crate_sack():
    """Низкий ящик с мешком. Тот же сюжет что был."""
    img = new()
    px = img.load()
    soft_shadow(img, 5, 26, 28)
    # мешок: эллипс + узел + верёвка + складки, свет слева сверху
    for y in range(5, 22):
        for x in range(6, 26):
            dx, dy = (x - 16) / 9.0, (y - 13.5) / 7.5
            if dx * dx + dy * dy <= 1.0:
                px[x, y] = SACK
    for y in range(5, 22):  # фиолет-затенение: сплошь справа и снизу
        for x in range(6, 26):
            dx, dy = (x - 16) / 9.0, (y - 13.5) / 7.5
            if dx * dx + dy * dy <= 1.0 and (x >= 20 or y >= 18):
                px[x, y] = SACK_D
    for x in range(10, 15):  # жёлтый блик слева сверху
        px[x, 8] = SACK_L
    px[9, 9] = SACK_L
    px[8, 11] = SACK_L
    for fx, fy0, fy1 in [(13, 11, 18), (18, 10, 19)]:
        for y in range(fy0, fy1):
            px[fx, y] = SACK_D
        px[fx - 1, fy0] = SACK_L
    cx, cy, rx, ry = 16, 13.5, 9.0, 7.5  # контур мешка, 1 px
    for y in range(5, 22):
        for x in range(6, 26):
            dx, dy = (x - cx) / rx, (y - cy) / ry
            if 0.90 <= dx * dx + dy * dy <= 1.0:
                px[x, y] = INK
    for x in range(12, 21):  # верёвка поверх контура
        px[x, 7] = ROPE_D
        px[x, 6] = ROPE
    box(img, 14, 2, 17, 5, SACK)  # узел поверх верёвки
    px[15, 3] = SACK_L
    for x in range(10, 15):
        if px[x, 6] != INK:
            px[x, 6] = ROPE
    frame(img, 5, 17, 26, 27, WOOD)  # низкий корпус-лоб
    return img


if __name__ == "__main__":
    c = closed()
    c.save(f"{BASE}/top_prop_crate_hd.png")
    c.save(f"{BASE}/top_prop_crate.png")
    crate_open().save(f"{BASE}/top_prop_crate_1.png")
    crate_sack().save(f"{BASE}/top_prop_crate_2.png")
    print("ok: hd, crate, crate_1, crate_2")
