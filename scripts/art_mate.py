#!/usr/bin/env python3
"""Круг красоты 4: top_mate_0/1 — сокамерник в рыжей робе строго сверху, два кадра шага.

Запуск из корня дела: python3 scripts/art_mate.py
Ждём: ART_MATE_OK — оба 16x16 RGBA, есть прозрачность.
Строй держим по top_guard_0 (art_guard_0.py): та же сетка силуэта.
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMG = os.path.join(ROOT, "tulenko.bratuxa.zomb.top", "img")
OUTS = (os.path.join(IMG, "top_mate_0.png"), os.path.join(IMG, "top_mate_1.png"))

PAL = {
    "D": (58, 62, 72, 255),     # тёмная обводка (как у стражи — строй)
    "R": (255, 111, 32, 255),   # рыжая роба — яркая, цепляет глаз
    "r": (203, 76, 20, 255),    # тень 1 на робе
    "q": (150, 50, 12, 255),    # тень 2 глубокая (ноги)
    "W": (74, 48, 28, 255),     # волосы (вместо фуражки стражи)
    "S": (255, 221, 181, 255),  # лицо и кисти рук
    "B": (18, 18, 24, 255),     # глаза, тапки
    "L": (255, 190, 90, 255),   # светлый кант ворота + пуговица
}

HEAD = (
    "................",  # 0
    "................",  # 1
    ".....DDDDD......",  # 2 верх головы
    "....DWWWWWD.....",  # 3 волосы
    "...DWWWWWWWD....",  # 4 волосы широко
    "...DWWWWWWWD....",  # 5 затылок сверху
    "...DRSSSSSRD....",  # 6 лицо под волосами
    "..DRRSBSBSRRD...",  # 7 глаза
    "..DRRSSSSSRRD...",  # 8 подбородок
    ".DLRRRRRRRRRLD..",  # 9 плечи + светлый кант
    ".DSRRRRRRRrrSD..",  # 10 руки S по бокам, тень r справа
    ".DSRRRDLDRrrSD..",  # 11 пуговица L, тень справа
)

# LEGS_0: кадр 0 (ноги врозь):
LEGS_0 = (
    "..DRRR...RRRD...",  # 12 шаг врозь
    "..DRRq...qRRD...",  # 13 глубокая тень на ногах
    "..DBBB...BBBD...",  # 14 тапки врозь
    "................",  # 15
)

LEGS_1 = (
    "...DRRRRRRD.....",  # 12 ноги вместе
    "...DRRrrRRD.....",  # 13 тень на ногах
    "...DBBBBBBD.....",  # 14 тапки вместе
    "................",  # 15
)


def build(rows, out):
    assert len(rows) == 16 and all(len(r) == 16 for r in rows), "сетка не 16x16"
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    px = im.load()
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            px[x, y] = PAL[ch]
    im.save(out)


def main():
    rows0 = HEAD + LEGS_0
    rows1 = HEAD + LEGS_1
    assert len(rows0) == 16 and len(rows1) == 16
    build(rows0, OUTS[0])
    build(rows1, OUTS[1])
    for p in OUTS:
        back = Image.open(p)
        assert back.size == (16, 16), (p, back.size)
        assert any(px[3] == 0 for px in back.getdata()), "нет прозрачности: " + p
    print("ART_MATE_OK", OUTS[0], OUTS[1])


if __name__ == "__main__":
    main()
