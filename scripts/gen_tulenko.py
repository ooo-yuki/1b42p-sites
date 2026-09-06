#!/usr/bin/env python3
"""Рисовальщик картинок для игры «Побег тюленьки».

Каждый кадр задан строками знаков 16x16, знак — цвет из PALETTE.
'.' — прозрачное дно. Чужих картинок нет, только Pillow.

Запуск: python3 scripts/gen_tulenko.py  (из корня дела /root/sites)
Ждём: ALL_OK — каждая картинка открывается, размер 16x16, есть прозрачность.
"""

import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "tulenko.bratuxa.zomb.top", "img")

PALETTE = {
    "D": (58, 62, 72, 255),      # тёмный контур
    "G": (148, 154, 166, 255),   # серая тюленька
    "W": (242, 242, 246, 255),   # белый живот / стрелка
    "B": (18, 18, 24, 255),      # чёрный: глаз, нос, сапоги
    "P": (255, 150, 170, 255),   # розовая щёка
    "U": (52, 102, 220, 255),    # синяя стража
    "u": (28, 58, 150, 255),     # тёмно-синяя фуражка
    "S": (255, 221, 181, 255),   # лицо стражника
    "Y": (255, 210, 60, 255),    # жёлтый ключ
    "O": (198, 148, 24, 255),    # тень ключа
    "F": (168, 174, 186, 255),   # серая рыба
    "f": (110, 116, 128, 255),   # тёмный хвост рыбы
    "E": (52, 199, 88, 255),     # зелёный выход
    "e": (24, 140, 58, 255),     # тёмно-зелёный край
    "C": (122, 86, 58, 255),     # коричневая стена
    "c": (74, 50, 34, 255),      # швы стены
    "L": (205, 205, 214, 255),   # светлый пол
    "l": (160, 160, 172, 255),   # сетка пола
    "I": (105, 105, 116, 255),   # железо решётки
    "i": (60, 60, 70, 255),      # тёмное железо
    "N": (219, 132, 64, 255),    # рыжее: камера, одеяло
    "n": (150, 84, 36, 255),     # тёмно-рыжее
    "H": (141, 189, 245, 255),   # синий душ
    "h": (58, 110, 190, 255),    # тёмно-синий слив
    "V": (150, 62, 56, 255),     # красная крыша
    "v": (96, 36, 32, 255),      # швы крыши
}

SEAL_IDLE_0 = (
    "................",
    "................",
    ".....DDDDD......",
    "....DGGGGGD.....",
    "...DGWWWWWGD....",
    "...DGWWWWWGDD...",
    "..DGWBWWWGGBD...",
    "..DGWWWWWGGBD...",
    "..DGWWPWGGD.....",
    "..DDGWWWWGGD....",
    "...DGGGGGGD.....",
    "....DGGGGGD.....",
    "....DDGGDDD.....",
    ".....DD.DD......",
    "................",
    "................",
)

FLIP_A = ("....DDGGDDD.....", ".....DD.DD......")
FLIP_B = (".....DGGGD......", "......DDDD......")


def with_flip(rows, flip):
    rows = list(rows)
    rows[12], rows[13] = flip
    return tuple(rows)


def blink(rows):
    rows = list(rows)
    rows[6] = rows[7]  # глаз закрыт: строка с глазом = строке без глаза
    return tuple(rows)


def shift(rows, dx):
    out = []
    for r in rows:
        if dx < 0:
            out.append(r[-dx:] + "." * (-dx))
        elif dx > 0:
            out.append("." + r[:15])
        else:
            out.append(r)
    return tuple(out)


GUARD_BASE = (
    "................",
    ".....uuuuu......",
    "....uuuuuuu.....",
    ".....BBBBB......",
    ".....SSSSS......",
    ".....SBSBSS.....",
    ".....SSSSS......",
    "....UUUUUUU.....",
    "...SUUUUUUUS....",
    "...SUUUUUUUS....",
    "....UDDDDDU.....",
    "....UUU.UUU.....",
    "....UUU.UUU.....",
    "....BBB.BBB.....",
    "................",
    "................",
)

GUARD_1 = (
    "................",
    ".....uuuuu......",
    "....uuuuuuu.....",
    ".....BBBBB......",
    ".....SSSSS......",
    ".....SBSBSS.....",
    ".....SSSSS......",
    "....UUUUUUU.....",
    "...SUUUUUUUS....",
    "...SUUUUUUUS....",
    "....UDDDDDU.....",
    "...UUU...UUU....",
    "...UUU...UUU....",
    "...BBB...BBB....",
    "................",
    "................",
)

FLOOR = (
    ".llllllllllllll.",
    "lLLLLLLLLLLLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLlLLLLlLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLlLLLLlLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLlLLLLlLLLLl",
    "lLLLLLLLLLLLLLLl",
    "lLLLLLLLLLLLLLLl",
    ".llllllllllllll.",
)


def on_floor(rows, top=0):
    """Накладывает строки предмета на пол (точка = оставить пол)."""
    base = [list(r) for r in FLOOR]
    for y, row in enumerate(rows):
        for x, ch in enumerate(row):
            if ch != ".":
                base[top + y][x] = ch
    return tuple("".join(r) for r in base)


KEY = (
    "................",
    "................",
    "................",
    "................",
    "......YYYY......",
    "......YLLY......",
    "......YYYY......",
    ".......YO.......",
    ".......YOO......",
    ".......YO.......",
    ".......YOO......",
    ".......YO.......",
    "................",
    "................",
    "................",
    "................",
)

FISH = (
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    ".....FFFFFf.....",
    "...FBFFFFFffLLL.",
    ".....FFFFFf.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
)

WALL = (
    ".cccccccccccccc.",
    "cCCCCcCCCCcCCCCc",
    "cCCcCCCCcCCCCcCc",
    "cCCCCcCCCCcCCCCc",
    "cccccccccccccccc",
    "cCCcCCCCcCCCCcCc",
    "cCCCCcCCCCcCCCCc",
    "cCCcCCCCcCCCCcCc",
    "cccccccccccccccc",
    "cCCCCcCCCCcCCCCc",
    "cCCcCCCCcCCCCcCc",
    "cCCCCcCCCCcCCCCc",
    "cccccccccccccccc",
    "cCCcCCCCcCCCCcCc",
    "cCCCCcCCCCcCCCCc",
    ".cccccccccccccc.",
)

BAR_ROW = "..Ii...Ii...Ii.."
RAIL_ROW = "..IIIIIIIIIIII.."
BARS = (
    "................",
    RAIL_ROW,
    BAR_ROW,
    BAR_ROW,
    BAR_ROW,
    BAR_ROW,
    BAR_ROW,
    RAIL_ROW,
    BAR_ROW,
    BAR_ROW,
    BAR_ROW,
    BAR_ROW,
    BAR_ROW,
    RAIL_ROW,
    "................",
    "................",
)

EXIT = (
    ".eeeeeeeeeeeeee.",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEWWWEEEEEe",
    "eEEEEWWWWWWWEEEe",
    "eEEEEEEWWWEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    "eEEEEEEEEEEEEEEe",
    ".eeeeeeeeeeeeee.",
)

TOP_FLOOR = FLOOR

TOP_WALL = (
    "..BBBBBBBBBBBB..",
    ".BWWWWWWWWWWWWB.",
    ".BWBBWWBBWWBBWB.",
    ".BWWWWWWWWWWWWB.",
    ".BWWWWWWWWWWWWB.",
    ".BWWBBWWBBWWBBB.",
    ".BWWWWWWWWWWWWB.",
    ".BBBBBBBBBBBBBB.",
    ".BWWWWWWWWWWWWB.",
    ".BWBBWWBBWWBBWB.",
    ".BWWWWWWWWWWWWB.",
    ".BWWWWWWWWWWWWB.",
    ".BWWBBWWBBWWBBB.",
    ".BWWWWWWWWWWWWB.",
    ".BBBBBBBBBBBBBB.",
    "..BBBBBBBBBBBB..",
)

TOP_DOOR = on_floor((
    "................",
    "................",
    "................",
    "...DDDDDDDDDD...",
    "...DCCCCCCCCD...",
    "...DCCYCCCCCD...",
    "...DCCCCCCCCD...",
    "...DDDDDDDDDD...",
    ".......DD.......",
    ".......DD.......",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
))

TOP_BED = on_floor((
    "................",
    "..DDDDDDDDDDDD..",
    "..DCCWWWWWWWWD..",
    "..DCWWWWWWWWND..",
    "..DCWWWWWWWNNND.",
    "..DCWWWWWWWNNND.",
    "..DCWWWWWWWNNND.",
    "..DCWWWWWWWNNND.",
    "..DCCWWWWWWND...",
    "..DDDDDDDDDDDD..",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
))

TOP_TABLE = on_floor((
    "................",
    "................",
    "....DDDDDDDD....",
    "....DCCCCCCD....",
    "....DCWWCCCD....",
    "....DCWWCCYD....",
    "....DCCCCCCD....",
    "....DCCYWWCD....",
    "....DCCWWCCD....",
    "....DCCCCCCD....",
    "....DDDDDDDD....",
    "................",
    "................",
    "................",
    "................",
    "................",
))

TOP_SHOWER = on_floor((
    "................",
    "..hhhhhhhhhhhh..",
    "..hHHHHHHHHHHh..",
    "..hHHWWHHWWHHh..",
    "..hHHHHHHHHHHh..",
    "..hHHWWHHHHWHh..",
    "..hHHHHHHHHHHh..",
    "..hHHHBBBBHHHh..",
    "..hHHHBBBBHHHh..",
    "..hHHHHHHHHHHh..",
    "..hHHWHHHHWHHh..",
    "..hHHHHHHHHHHh..",
    "..hhhhhhhhhhhh..",
    "................",
    "................",
    "................",
))

TOP_BENCH = on_floor((
    "................",
    "................",
    "...DDDDDDDDDD...",
    "...DIIIIIIIIID..",
    "...DIiIIIIiYID..",
    "...DIIIIIIIIID..",
    "...DIiIIIIiDID..",
    "...DIIIIIIIIID..",
    "...DDDDDDDDDD...",
    "....BBB.BBB.....",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
))

TOP_ROOF = (
    "..vvvvvvvvvvvv..",
    ".vVVVVVVVVVVVVv.",
    ".vVvvVVVvvVVVvV.",
    ".vVVVVVVVVVVVVv.",
    ".vVVVVVVVVVVVVv.",
    ".vVvvVVVvvVVVvV.",
    ".vVVVVVVVVVVVVv.",
    ".vvvvvvvvvvvvvv.",
    ".vVVVVVVVVVVVVv.",
    ".vVvvVVVvvVVVvV.",
    ".vVVVVVVVVVVVVv.",
    ".vVVVVVVVVVVVVv.",
    ".vVvvVVVvvVVVvV.",
    ".vVVVVVVVVVVVVv.",
    ".vvvvvvvvvvvvvv.",
    "..vvvvvvvvvvvv..",
)

# Тюленька сверху: серо-белое тело, глаза и нос смотрят в сторону.
TOP_SEAL_DOWN = (
    "................",
    "................",
    "................",
    ".....DDDDD......",
    "....DGGGGGD.....",
    "...DGGGGGGGD....",
    "...DGGWWWGGD....",
    "..DGGWWWWWGGD...",
    "..DGWWWWWWWGD...",
    "..DGWBBBWWWGD...",
    "..DGWWWBWWGD....",
    "..DGGWWWWGGD....",
    "...DGGGGGGD.....",
    "....DDDDDD......",
    "................",
    "................",
)

TOP_SEAL_UP = (
    "................",
    "................",
    "................",
    ".....DDDDD......",
    "....DGGGGGD.....",
    "...DGWWWBWGDD...",
    "..DGGWWWBWGGD...",
    "..DGWBBBWWWGD...",
    "..DGWWWWWWWGD...",
    "..DGGWWWWWGGD...",
    "...DGGWWWGGD....",
    "...DGGGGGGGD....",
    "....DGGGGGD.....",
    ".....DDDDD......",
    "................",
    "................",
)

TOP_SEAL_LEFT = (
    "................",
    "................",
    "................",
    ".....DDDDD......",
    "....DGGGGGD.....",
    "...DGGGGGGGD....",
    "..DGGWWWGGGD....",
    "..DGWWWWWGGGDD..",
    ".DBBWWWWWGGBBD..",
    "..DGBWWWWGGGDD..",
    "..DGGWWWGGGD....",
    "...DGGGGGGGD....",
    "....DGGGGGD.....",
    ".....DDDDD......",
    "................",
    "................",
)

TOP_SEAL_RIGHT = (
    "................",
    "................",
    "................",
    ".....DDDDD......",
    "....DGGGGGD.....",
    "...DGGGGGGGD....",
    "....DGGWWWGGD...",
    "..DDGGWWWWWGD...",
    "..DBBGGWWWWWBBD.",
    "..DDGGWWWWBGD...",
    "....DGGWWWGGD...",
    "...DGGGGGGGD....",
    "....DGGGGGD.....",
    ".....DDDDD......",
    "................",
    "................",
)

# Стража сверху: синяя форма, лицо и фуражка, два кадра шага.
TOP_GUARD_0 = (
    "................",
    "................",
    "................",
    ".....uuuuu......",
    "....uuuuuuu.....",
    "...DUUUUUUUD....",
    "...DUUSSSUUD....",
    "..DUUSBSBSUUD...",
    "..DUUSSSSUUD....",
    "..DUUUUUUUUD....",
    "...DUUUUUUUD....",
    "....UUU.UUU.....",
    "....UUU.UUU.....",
    "....BBB.BBB.....",
    "................",
    "................",
)

TOP_GUARD_1 = (
    "................",
    "................",
    "................",
    ".....uuuuu......",
    "....uuuuuuu.....",
    "...DUUUUUUUD....",
    "...DUUSSSUUD....",
    "..DUUSBSBSUUDD..",
    "..DUUSSSSUUD....",
    "..DUUUUUUUUD....",
    "...DUUUUUUUD....",
    "...UUU...UUU....",
    "...UUU...UUU....",
    "...BBB...BBB....",
    "................",
    "................",
)

FRAMES = {
    "seal_idle_0": SEAL_IDLE_0,
    "seal_idle_1": blink(with_flip(SEAL_IDLE_0, FLIP_B)),
    "seal_waddle_0": with_flip(shift(SEAL_IDLE_0, -1), FLIP_A),
    "seal_waddle_1": with_flip(shift(SEAL_IDLE_0, 0), FLIP_B),
    "seal_waddle_2": with_flip(shift(SEAL_IDLE_0, 1), FLIP_A),
    "seal_waddle_3": blink(with_flip(shift(SEAL_IDLE_0, 0), FLIP_B)),
    "guard_0": GUARD_BASE,
    "guard_1": GUARD_1,
    "tile_floor": FLOOR,
    "tile_wall": WALL,
    "tile_bars": BARS,
    "tile_key": on_floor(KEY),
    "tile_fish": on_floor(FISH),
    "tile_exit": EXIT,
    "top_seal_up": TOP_SEAL_UP,
    "top_seal_down": TOP_SEAL_DOWN,
    "top_seal_left": TOP_SEAL_LEFT,
    "top_seal_right": TOP_SEAL_RIGHT,
    "top_guard_0": TOP_GUARD_0,
    "top_guard_1": TOP_GUARD_1,
    "top_floor": TOP_FLOOR,
    "top_wall": TOP_WALL,
    "top_door": TOP_DOOR,
    "top_bed": TOP_BED,
    "top_table": TOP_TABLE,
    "top_shower": TOP_SHOWER,
    "top_bench": TOP_BENCH,
    "top_roof": TOP_ROOF,
}


def render(name, rows):
    assert len(rows) == 16, f"{name}: строк {len(rows)}, ждём 16"
    img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    px = img.load()
    for y, row in enumerate(rows):
        assert len(row) == 16, f"{name} ряд {y}: знаков {len(row)}, ждём 16"
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            assert ch in PALETTE, f"{name} ряд {y}: знак {ch!r} без цвета"
            px[x, y] = PALETTE[ch]
    return img


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    assert len(FRAMES) == 28, f"кадров {len(FRAMES)}, ждём 28"
    for name, rows in FRAMES.items():
        render(name, rows).save(os.path.join(OUT_DIR, name + ".png"))
    # Проверка открытием: размер 16x16 и прозрачность.
    for name in FRAMES:
        path = os.path.join(OUT_DIR, name + ".png")
        with Image.open(path) as img:
            img.load()
            if img.size != (16, 16):
                print(f"FAIL {name}: размер {img.size}")
                sys.exit(1)
            alpha = img.convert("RGBA").getchannel("A")
            if alpha.getextrema()[0] != 0:
                print(f"FAIL {name}: нет прозрачности")
                sys.exit(1)
    print("ALL_OK")


if __name__ == "__main__":
    main()
