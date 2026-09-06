#!/usr/bin/env python3
"""Круг красоты 1: тюленька вид строго сверху, глаза смотрят вверх.

Рисует tulenko.bratuxa.zomb.top/img/top_seal_up.png 16x16 с прозрачностью.
Голова вверху спрайта, зрачки строкой выше белков (взгляд вверх), ласты
по бокам, серо-белое тело, тёмная обводка, два тона тени справа. Тени под
ногами нет — её рисует игра.

Повтор (из /root/sites): python3 tulenko.bratuxa.zomb.top/scripts/art_seal_up.py
"""
from PIL import Image

PALETTE = {
    ".": None,                      # прозрачность
    "O": (43, 52, 64, 255),         # тёмная обводка
    "B": (232, 237, 242, 255),      # серо-белое тело
    "L": (247, 250, 252, 255),      # светлый блик слева
    "S": (185, 196, 208, 255),      # тень тон 1
    "D": (142, 154, 168, 255),      # тень тон 2 (у правого края)
    "F": (154, 167, 181, 255),      # ласты
    "W": (107, 122, 140, 255),      # пятна
    "E": (255, 255, 255, 255),      # белки глаз
    "P": (20, 26, 34, 255),         # зрачки (строка выше белков = взгляд вверх)
    "N": (43, 52, 64, 255),         # нос
}

ROWS = [
    "................",
    ".....OOOOOO.....",
    "....OBBBBBBO....",
    "...OBBPBBPBBO...",  # placeholder, заменяется ниже
    "...OBBEBBEBBO...",
    "...OBBBNNBBBO...",
    ".OFOLBBBBSSDOFO.",
    ".OFOLBWBBWSDOFO.",
    ".OFOLBBBBSSDOFO.",
    ".OFOLBBWWBSDOFO.",
    "...OLBBBBSSDO...",
    "...OLBBBBSSDO...",
    "....OBBDDBBO....",
    ".....OBDDBO.....",
    "......OOOO......",
    "................",
]

# Строка 3: зрачки в колонках 6 и 9 (симметрия центра 7-8), строка 4 — белки.
# Собираем программно, чтобы не ошибиться в длине.
def _mk_eye_row(fill):
    row = ["B"] * 8
    row[2] = fill
    row[5] = fill
    return "...O" + "".join(row) + "O..."

ROWS[3] = _mk_eye_row("P")
ROWS[4] = _mk_eye_row("E")


def main():
    assert len(ROWS) == 16 and all(len(r) == 16 for r in ROWS), "сетка не 16x16"
    img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    for y, row in enumerate(ROWS):
        for x, ch in enumerate(row):
            color = PALETTE[ch]
            if color is not None:
                img.putpixel((x, y), color)
    img.save("tulenko.bratuxa.zomb.top/img/top_seal_up.png")
    print("ok: img/top_seal_up.png 16x16")


if __name__ == "__main__":
    main()
