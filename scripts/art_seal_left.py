#!/usr/bin/env python3
"""Круг красоты 1: тюленька вид сверху, глаза влево → top_seal_left.png.

Запуск из корня дела: python3 scripts/art_seal_left.py
Ждём: OK — 16x16, есть прозрачность, тень под ногами не рисуем (её даёт игра).
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "tulenko.bratuxa.zomb.top", "img", "top_seal_left.png")

PALETTE = {
    "D": (40, 44, 54, 255),      # тёмная обводка
    "G": (150, 156, 168, 255),   # серое тело
    "g": (110, 116, 130, 255),   # тёмная тень (тон 2)
    "W": (240, 240, 245, 255),   # бело-серый живот/блик
    "B": (15, 15, 20, 255),      # глаз/нос
}

ART = (
    "................",
    ".......DDD......",
    "......DGGGDD....",
    "......DGGGgDD...",
    "...DDDDGGGGGD...",
    "..DGGGGgGGGGGDD.",
    ".DGGBBGGGGWWGGGD",
    ".DGBWBGGWWWWGGGD",
    "DDGGGBBGWWWWWGGD",
    ".DGGGGGgGWWWWGGD",
    ".DGGgGGGGGWWGGGD",
    "..DGGGGgGGGGGGD.",
    "...DDDGGGGGDD...",
    "......DGGGgD....",
    "......DGGGDD....",
    ".......DDD......",
)

assert len(ART) == 16 and all(len(r) == 16 for r in ART), "сетка обязана быть 16x16"

img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
px = img.load()
for y, row in enumerate(ART):
    for x, ch in enumerate(row):
        if ch == ".":
            continue
        px[x, y] = PALETTE[ch]

img.save(OUT)
print("OK", OUT)
