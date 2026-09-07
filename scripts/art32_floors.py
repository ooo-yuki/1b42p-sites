#!/usr/bin/env python3
"""32px floors for tulenko (game 'Pobeg tulenki').
Redraws 4 tiles 16px -> 32px: bevel seams, chips, wood grain, tile glints.
Dark edges, transparent corners (1px each, as originals).
Deterministic (seeded) pixel art, Pillow only.
Out: tulenko.bratuxa.zomb.top/img/top_floor{,_food,_wash,_cell}.png
"""
import random
from PIL import Image

N = 32
IMG_DIR = "tulenko.bratuxa.zomb.top/img"

PAL = {
    # dark(seam/edge) mid light
    "top_floor":      ((142, 143, 152), (191, 192, 201), (205, 205, 214)),
    "top_floor_food": ((158, 149, 132), (214, 207, 192), (233, 229, 219)),
    "top_floor_wash": ((79, 114, 144),  (126, 169, 199), (152, 191, 216)),
    "top_floor_cell": ((108, 78, 48),   (163, 123, 79),  (179, 139, 93)),
}

def shade(c, k):
    return tuple(max(0, min(255, int(v * k))) for v in c)

def new_canvas():
    return Image.new("RGBA", (N, N), (0, 0, 0, 0))

def put_edge(im):
    """1px dark edge on all sides (darker than seam), corners stay transparent."""
    px = im.load()
    dark = CUR_EDGE
    for x in range(1, N - 1):
        px[x, 0] = dark + (255,)
        px[x, N - 1] = dark + (255,)
    for y in range(1, N - 1):
        px[0, y] = dark + (255,)
        px[N - 1, y] = dark + (255,)

def tiled(name, seed, glint=False):
    """2x2 slabs: border 1px, seams 2px at 15..16, slabs 14px (1..14, 17..30)."""
    dark, mid, light = PAL[name]
    edge = shade(dark, 0.72)
    global CUR_EDGE
    CUR_EDGE = edge
    rng = random.Random(seed)
    im = new_canvas()
    px = im.load()
    dk, md, lt = dark + (255,), mid + (255,), light + (255,)
    # base: seam/edge dark everywhere, then slabs
    for y in range(N):
        for x in range(N):
            px[x, y] = dk
    slabs = [(1, 1), (17, 1), (1, 17), (17, 17)]
    for i, (sx, sy) in enumerate(slabs):
        # checker like original: TL+BR light, TR+BL mid
        base = lt if i in (0, 3) else md
        face_hi = light if i in (0, 3) else mid
        for y in range(sy, sy + 14):
            for x in range(sx, sx + 14):
                px[x, y] = base
        # bevel: top/left lighter, bottom/right darker
        hi = shade(face_hi, 1.10)
        lo = shade(dark, 0.9)
        for x in range(sx, sx + 14):
            px[x, sy] = hi + (255,)
            px[x, sy + 13] = lo + (255,)
        for y in range(sy, sy + 14):
            px[sx, y] = hi + (255,)
            px[sx + 13, y] = lo + (255,)
        # speckle: light pores + dark chips
        for _ in range(26):
            x = rng.randrange(sx + 1, sx + 13)
            y = rng.randrange(sy + 1, sy + 13)
            px[x, y] = shade(face_hi, 0.93) + (255,)
        for _ in range(4):  # chips: 1-2px dark nicks
            x = rng.randrange(sx + 1, sx + 12)
            y = rng.randrange(sy + 1, sy + 12)
            px[x, y] = dk
            if rng.random() < 0.5:
                px[x + 1, y] = dk
            else:
                px[x, y + 1] = dk
        if glint:  # shower glint: short diagonal highlight
            gx, gy = sx + 3, sy + 3
            g = shade((255, 255, 255), 0.92)
            for dx, dy in ((0, 0), (1, 0), (0, 1), (1, 1), (2, 1), (1, 2)):
                px[gx + dx, gy + dy] = g + (255,)
    put_edge(im)
    return im

def cell(seed=44):
    dark, mid, light = PAL["top_floor_cell"]
    edge = shade(dark, 0.7)
    global CUR_EDGE
    CUR_EDGE = edge
    rng = random.Random(seed)
    im = new_canvas()
    px = im.load()
    dk, md, lt = dark + (255,), mid + (255,), light + (255,)
    for y in range(N):
        for x in range(N):
            px[x, y] = md
    # vertical planks: seams at x=8,16,24 (1px) full height
    for x in (8, 16, 24):
        for y in range(1, N - 1):
            px[x, y] = dk
    # wood grain: vertical stripes per plank, alternating mid/light + dark grain lines
    planks = [(1, 7), (9, 15), (17, 23), (25, 30)]
    for j, (x0, x1) in enumerate(planks):
        for x in range(x0, x1 + 1):
            c = lt if (x + j) % 2 == 0 else md
            for y in range(1, N - 1):
                px[x, y] = c
        # 1-2 dark grain lines per plank, slightly wavy
        for _ in range(2):
            gx = rng.randrange(x0, x1 + 1)
            for y in range(1, N - 1):
                if rng.random() < 0.85:
                    px[gx, y] = shade(mid, 0.88) + (255,)
                if rng.random() < 0.12 and gx + 1 <= x1:
                    gx += 1
                elif rng.random() < 0.12 and gx - 1 >= x0:
                    gx -= 1
    # staggered plank-end joints (horizontal 1px seams), like original
    for (x0, x1, jy) in ((1, 7, 12), (9, 15, 20), (17, 23, 9), (25, 30, 21)):
        for x in range(x0, x1 + 1):
            px[x, jy] = dk
        # bevel under joint
        if jy + 1 < N - 1:
            for x in range(x0, x1 + 1):
                px[x, jy + 1] = shade(light, 1.05) + (255,)
    # knots + chips
    for _ in range(3):
        kx = rng.randrange(2, N - 2)
        ky = rng.randrange(2, N - 2)
        if px[kx, ky][3] == 0:
            continue
        px[kx, ky] = shade(dark, 0.85) + (255,)
    for _ in range(10):
        x = rng.randrange(1, N - 1)
        y = rng.randrange(1, N - 1)
        if px[x, y] != dk:
            px[x, y] = shade(mid, 0.9) + (255,)
    put_edge(im)
    return im

def main():
    out = {
        "top_floor.png": tiled("top_floor", seed=11),
        "top_floor_food.png": tiled("top_floor_food", seed=22),
        "top_floor_wash.png": tiled("top_floor_wash", seed=33, glint=True),
        "top_floor_cell.png": cell(),
    }
    for n, im in out.items():
        p = f"{IMG_DIR}/{n}"
        im.save(p)
        print("wrote", p, im.size)

if __name__ == "__main__":
    main()
