#!/usr/bin/env python3
"""Круг красоты 1: top_guard_0 — стражник строго сверху, кадр 1 (ноги врозь).

Запуск из корня дела: python3 scripts/art_guard_0.py
Ждём: ART_GUARD_0_OK — 16x16 RGBA, есть прозрачность.
"""

import os

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tulenko.bratuxa.zomb.top", "img", "top_guard_0.png")

PAL = {
    "D": (58, 62, 72, 255),      # тёмная обводка
    "U": (52, 102, 220, 255),    # синяя форма
    "u": (28, 58, 150, 255),     # тёмно-синий: фуражка + тень формы
    "S": (255, 221, 181, 255),   # лицо и кисти рук
    "B": (18, 18, 24, 255),      # козырёк, глаза, сапоги
    "Y": (255, 210, 60, 255),    # эполеты, пряжка
    "H": (141, 189, 245, 255),   # блик на фуражке
}

ROWS = (
    "................",  # 0
    "................",  # 1
    ".....DDDDD......",  # 2 верх фуражки
    "....DuuuuuD.....",  # 3 тулья
    "...DuuHuuuuD....",  # 4 тулья широкая + блик
    "...DUBBBBUD.....",  # 5 чёрный козырёк
    "...DUUSSSUUD....",  # 6 лицо под козырьком
    "..DUUSBSBSUUD...",  # 7 глаза
    "..DUUSSSSSUUD...",  # 8 подбородок
    ".DYUUUUUUUUUYD..",  # 9 плечи шире + эполеты
    ".DSUUUUUUUuuSD..",  # 10 руки S по бокам, тень u справа
    ".DSUUUDYDUuuSD..",  # 11 ремень + пряжка, тень справа
    "..DUUU...UUUD...",  # 12 шаг: ноги врозь (кадр 1)
    "..DUUu...UuUD...",  # 13 тень на ногах
    "..DBBB...BBBD...",  # 14 сапоги врозь
    "................",  # 15
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
    print("ART_GUARD_0_OK", OUT)


if __name__ == "__main__":
    main()
