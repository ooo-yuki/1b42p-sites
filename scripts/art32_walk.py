#!/usr/bin/env python3
"""Вторые кадры ходьбы: покачивание сдвигом низа на точку.

Читает кадры 0, пишет кадры 1 рядом. Строй держит, палитру не трогает.
Повтор: python3 scripts/art32_walk.py
"""
from PIL import Image

PAIRS = [
    ('tulenko.bratuxa.zomb.top/img/top_seal_up.png',
     'tulenko.bratuxa.zomb.top/img/top_seal_up_1.png'),
    ('tulenko.bratuxa.zomb.top/img/top_seal_down.png',
     'tulenko.bratuxa.zomb.top/img/top_seal_down_1.png'),
    ('tulenko.bratuxa.zomb.top/img/top_seal_left.png',
     'tulenko.bratuxa.zomb.top/img/top_seal_left_1.png'),
    ('tulenko.bratuxa.zomb.top/img/top_seal_right.png',
     'tulenko.bratuxa.zomb.top/img/top_seal_right_1.png'),
    ('tulenko.bratuxa.zomb.top/img/top_guard_0.png',
     'tulenko.bratuxa.zomb.top/img/top_guard_2.png'),
    ('tulenko.bratuxa.zomb.top/img/top_guard_1.png',
     'tulenko.bratuxa.zomb.top/img/top_guard_3.png'),
    ('tulenko.bratuxa.zomb.top/img/top_mate_0.png',
     'tulenko.bratuxa.zomb.top/img/top_mate_2.png'),
    ('tulenko.bratuxa.zomb.top/img/top_mate_1.png',
     'tulenko.bratuxa.zomb.top/img/top_mate_3.png'),
]


def waddle(src, dst):
    im = Image.open(src).convert('RGBA')
    w, h = im.size
    assert (w, h) == (32, 32), src
    px = im.load()
    out = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    ox = out.load()
    assert px is not None and ox is not None
    # Верх стоит, низ качается: ряды 0-19 как были,
    # ряды 20-27 на точку влево, ряды 28-31 на точку вправо.
    for y in range(32):
        if y < 20:
            dx = 0
        elif y < 28:
            dx = -1
        else:
            dx = 1
        for x in range(32):
            nx = x + dx
            if 0 <= nx < 32:
                ox[nx, y] = px[x, y]
    out.save(dst)


def main():
    for src, dst in PAIRS:
        waddle(src, dst)
        im = Image.open(dst)
        assert im.size == (32, 32) and im.mode == 'RGBA', dst
        print('WALK_OK', dst)


if __name__ == '__main__':
    main()
