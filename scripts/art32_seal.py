#!/usr/bin/env python3
"""32 точки: тюленька сверху, 4 направления (up/down/left/right).

32x32 RGBA, прозрачность. Серо-белое тело, тёмная обводка, три тона тени.
Детали: усы точками, когти на ластах, блик полосой на спине,
пятна с рваным краем, нос с ноздрями. Тени под ногами нет (её рисует игра).
Строй держит с 16-точечных: овал сверху, белый живот, глаза по направлению.
База рисуется головой вниз, остальные — lossless-поворотом.
Повтор: python3 scripts/art32_seal.py
"""
from PIL import Image, ImageDraw, ImageFilter, ImageOps

W, H = 32, 32
O = (58, 62, 72, 255)      # тёмная обводка
B = (148, 154, 166, 255)   # тело
S1 = (128, 134, 148, 255)  # тень тон 1
S2 = (110, 116, 130, 255)  # тень тон 2
S3 = (88, 94, 110, 255)    # тень тон 3
L = (172, 178, 190, 255)   # светлый кант слева
WW = (242, 242, 246, 255)  # белое
E = (18, 18, 24, 255)      # почти-чёрный

OUT = {
    "down": "tulenko.bratuxa.zomb.top/img/top_seal_down.png",
    "up": "tulenko.bratuxa.zomb.top/img/top_seal_up.png",
    "left": "tulenko.bratuxa.zomb.top/img/top_seal_left.png",
    "right": "tulenko.bratuxa.zomb.top/img/top_seal_right.png",
}


def draw_down():
    body = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(body)
    # хвост сверху + раздвоенный кончик
    d.ellipse([13, 1, 18, 6], fill=B)
    d.ellipse([11, 0, 14, 3], fill=B)
    d.ellipse([17, 0, 20, 3], fill=B)
    # туловище — вертикальный овал
    d.ellipse([8, 4, 23, 29], fill=B)
    # ласты по бокам
    d.ellipse([2, 12, 8, 21], fill=B)
    d.ellipse([23, 12, 29, 21], fill=B)

    px = body.load()
    # три тона тени: свет слева-сверху, глубже к правому низу
    for y in range(H):
        for x in range(W):
            if not px[x, y][3]:
                continue
            if x >= 22 or (x >= 19 and y >= 24):
                px[x, y] = S2
            elif x >= 19 or y >= 26:
                px[x, y] = S1
    # самый тёмный тон — крайний правый-нижний край
    for y in range(H):
        for x in range(W):
            if px[x, y][3] and x >= 23 and y >= 20:
                px[x, y] = S3
    # светлый кант слева
    for y in range(6, 26):
        if px[8, y][3]:
            px[8, y] = L

    # блик полосой на спине (слева от хребта)
    for y in range(6, 14):
        if px[10, y][3]:
            px[10, y] = L
    if px[11, 6][3]:
        px[11, 6] = L

    # белые пятна с рваным краем: спинка + морда/живот
    d.ellipse([12, 6, 19, 12], fill=WW)
    d.ellipse([11, 15, 20, 27], fill=WW)
    px = body.load()
    # рвём край: снимаем зубцы по контуру пятен
    for x, y in [(12, 6), (18, 6), (12, 12), (19, 11), (13, 5),
                 (11, 15), (20, 16), (11, 25), (20, 26), (15, 27), (16, 27)]:
        if px[x, y] == WW:
            px[x, y] = B if y < 14 else S1
    # рваные тёмные крапинки на серой спине
    for x, y in [(9, 8), (14, 7), (21, 9), (9, 11), (16, 10),
                 (22, 12), (11, 13), (20, 13), (9, 14)]:
        if px[x, y][3] and px[x, y] not in (WW, E):
            px[x, y] = S3

    # глаза смотрят вниз: два глаза + блик
    d.rectangle([12, 19, 13, 21], fill=E)
    d.rectangle([18, 19, 19, 21], fill=E)
    d.point([(12, 19), (18, 19)], fill=WW)
    # нос с ноздрями
    d.rectangle([14, 23, 17, 24], fill=E)
    d.point([(14, 25), (17, 25)], fill=E)  # ноздри
    # усы точками, по три с каждой стороны носа
    d.point([(11, 22), (9, 23), (11, 24)], fill=E)
    d.point([(20, 22), (22, 23), (20, 24)], fill=E)
    # когти на ластах — светлые точки на кончиках
    d.point([(2, 15), (2, 17), (3, 16)], fill=WW)
    d.point([(29, 15), (29, 17), (28, 16)], fill=WW)

    # тёмная обводка: дилатация маски на 1px под телом
    alpha = body.split()[3]
    dil = alpha.filter(ImageFilter.MaxFilter(3))
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(out)
    od.bitmap([0, 0], dil, fill=O)
    return Image.alpha_composite(out, body)


base = draw_down()
sprites = {
    "down": base,
    "up": base.transpose(Image.ROTATE_180),
    "right": base.transpose(Image.ROTATE_90),
    "left": base.transpose(Image.ROTATE_270),
}
for name, im in sprites.items():
    # transpose lossless — размер держим строго 32x32
    assert im.size == (32, 32), (name, im.size)
    im.save(OUT[name])
    print("saved", OUT[name], im.size)
