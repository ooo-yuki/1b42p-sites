#!/usr/bin/env python3
"""Круг красоты 2: top_door — дверь в полу, вид сверху.

Запуск из корня дела: python3 scripts/art_door2.py
Ждём: ART_DOOR_2_OK — 16x16 RGBA, есть прозрачность.
Дверь: три доски вдоль (вертикально), тёмные щели между ними,
светлый блик по верху досок, две железные скобы с заклёпками,
кольцо по центру.
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tulenko.bratuxa.zomb.top", "img", "top_door.png")

PAL = {
    "D": (58, 62, 72, 255),      # тёмная обводка
    "K": (26, 18, 12, 255),      # тёмные щели между досками
    "W": (146, 104, 66, 255),    # дерево, основа
    "L": (225, 178, 120, 255),   # светлый блик по верху досок
    "G": (96, 62, 38, 255),      # зерно дерева
    "M": (170, 170, 182, 255),   # железо скоб и кольца
    "m": (90, 92, 104, 255),     # тёмная окантовка железа
    "N": (60, 62, 70, 255),      # заклёпки
    "H": (230, 230, 238, 255),   # блик на железе
    "O": (20, 14, 10, 255),      # дырка кольца / тень
}

ROWS = (
    ".DDDDDDDDDDDDDD.",  # 0 верхняя обводка
    "DLLLLKLLLLKLLLLD",  # 1 блик по верху досок
    "DWGWWKWWGWKWWGWD",  # 2 доски + зерно
    "DWWWGKWWWWKGWWWD",  # 3
    "DMMNMMHHMMMMNMMD",  # 4 верхняя скоба + блик + заклёпки
    "DWWWGKWWWWKGWWWD",  # 5
    "DWWWGKmMMmKGWWWD",  # 6 верх кольца
    "DWWWGKMOOMKGWWWD",  # 7 бока кольца
    "DWGWWKMOOMKWWGWD",  # 8 бока кольца + зерно
    "DWWWWKmMMmKWWWWD",  # 9 низ кольца
    "DWWWGKWWWWKGWWWD",  # 10
    "DMMNMMHHMMMMNMMD",  # 11 нижняя скоба + блик + заклёпки
    "DWGWWKWWGWKWWGWD",  # 12
    "DWWWGKWWWWKGWWWD",  # 13
    "DGWWWKWWWWKWWGWD",  # 14 низ досок, тень зерна
    ".DDDDDDDDDDDDDD.",  # 15 нижняя обводка
)


def main():
    assert len(ROWS) == 16 and all(len(r) == 16 for r in ROWS), "сетка не 16x16"
    im = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    px = im.load()
    for y, row in enumerate(ROWS):
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            px[x, y] = PAL[ch]
    im.save(OUT)
    back = Image.open(OUT)
    assert back.size == (16, 16), back.size
    assert any(p[3] == 0 for p in back.getdata()), "нет прозрачности"
    print("ART_DOOR_2_OK", OUT)


if __name__ == "__main__":
    main()
