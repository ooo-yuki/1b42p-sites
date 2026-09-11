#!/usr/bin/env python3
"""London Task 1+2: генератор процедурного Лондона 170x170 -> szeged-mesh-3.

Выход (байт-в-байт схема szeged-mesh-3):
  src/assets/szeged.mesh.json, src/assets/szeged.solids.json,
  src/assets/szeged-atlas.jpg, tools/szeged-spawn.json
Layout: поле 170, канал z+-4 с водой, улицы сетка 6м + 3 переулка 4м,
площадь (0,-45) 40x40, >=24 домов-коробок (фасад mi%4 curated, скатные
крыши cur-roof), STREET_TILE-тег для задачи 4, спавн у площади.
Seed 42, только PIL+stdlib. Исходники фото Szeged НЕ используются.

Run: python3 tools/build-london.py --seed 42
"""
import argparse
import json
import math
import os
import random
from pathlib import Path

from PIL import Image

FORMAT = "szeged-mesh-3"
SEED = 42
FIELD = 170.0  # x,z in [-85,85]
HALF = FIELD / 2
CANAL_HALF = 4.0  # канал вдоль X: z in [-4,4]

ATLAS_W = 2048
TILE_MAX = 512
TILE_PAD = 16
EDGE_EXT = 2
ATLAS_Q = 82
ATLAS_Q_MIN = 40
ATLAS_BUDGET = int(1.5 * 1024 * 1024)
WHITE_TILE = 8

# Curated плитки (tools/szeged-curated/*.jpg -> имена cur-* в атласе)
CUR_WALLS = ["cur-wall1.jpg", "cur-wall2.jpg",
             "cur-wall3.jpg", "cur-wall4.jpg"]
CUR_ROOF = "cur-roof.jpg"
CUR_SRC = {"cur-wall1.jpg": "wall1.jpg", "cur-wall2.jpg": "wall2.jpg",
           "cur-wall3.jpg": "wall3.jpg", "cur-wall4.jpg": "wall4.jpg",
           "cur-roof.jpg": "roof.jpg"}
# Процедурки (seed 42, тайлятся идеально)
PROC_ROOF = "zz_roof.png"
PROC_WARM = "zz_plaster_warm.png"
PROC_COOL = "zz_plaster_cool.png"
PROC_ASPH = "zz_asphalt.png"
PROC_PAVE = "zz_pavement.png"  # task4: брусчатка улиц/площади
PROC_SLATE = "zz_slate.png"    # task4: сланец скатных крыш
PROC_LEAF = "zz_leaf.png"      # task4: листва крон
PROC_BARK = "zz_bark.png"      # task4: кора стволов
PROC_WOOD = "zz_wood.png"      # task4: дерево лавок
PROC_TILES = {PROC_ROOF: "roof", PROC_WARM: "plaster_warm",
              PROC_COOL: "plaster_cool", PROC_ASPH: "asphalt",
              PROC_PAVE: "pavement", PROC_SLATE: "slate",
              PROC_LEAF: "leaf", PROC_BARK: "bark",
              PROC_WOOD: "wood",
              "zz_clock.png": "clockface"}
# Брусчатка улиц (задача 4).
STREET_TILE = PROC_PAVE

GROUND_TINT = (0.42, 0.4, 0.37)  # страховочная земля -> асфальт
WATER_TINT = (0.25, 0.45, 0.75)  # вода канала
WHITE = (1.0, 1.0, 1.0)

PLAZA = (-20.0, 20.0, -65.0, -25.0)  # x0,x1,z0,z1, центр (0,-45)
PLAZA_C = (0.0, -45.0)


def fract(v):
    return v - math.floor(v)


def clean(v):
    """round() даёт -0.0; нормализуем в 0.0 для компактности."""
    return 0.0 if v == 0 else v


def box_uv(nx, ny, nz, X, Y, Z, s=4.0, sv=None):
    """planar box-mapping: проекция по доминантной оси нормали,
    1 тайл на s метров по u и sv метров по v (sv — пропорция фото)."""
    sv = s if sv is None else sv
    ax, ay, az = abs(nx), abs(ny), abs(nz)
    if ax >= ay and ax >= az:
        return (fract(Z / s), fract(Y / sv))
    if az >= ax and az >= ay:
        return (fract(X / s), fract(Y / sv))
    return (fract(X / s), fract(Z / sv))


class Baker:
    """Хелперы add_box/add_tri + солиды + индексы/uv в координатах атласа."""

    def __init__(self):
        self.pos_map, self.nor_map, self.col_map = {}, {}, {}
        self.positions, self.normals, self.colors = [], [], []
        self.pos_index, self.nor_index, self.col_index = [], [], []
        self.corner_tex = []  # per corner: (tile, u_raw, v_raw)
        self.solids = []

    def _corner(self, p, n, tile, u_raw, v_raw):
        X, Y, Z = (clean(round(v, 3)) for v in p)
        pkey = (X, Y, Z)
        pi = self.pos_map.get(pkey)
        if pi is None:
            pi = len(self.positions) // 3
            self.pos_map[pkey] = pi
            self.positions += [X, Y, Z]
        NX, NY, NZ = (clean(round(v, 2)) for v in n)
        nkey = (NX, NY, NZ)
        ni = self.nor_map.get(nkey)
        if ni is None:
            ni = len(self.normals) // 3
            self.nor_map[nkey] = ni
            self.normals += [NX, NY, NZ]
        self.pos_index.append(pi)
        self.nor_index.append(ni)
        self.corner_tex.append((tile, u_raw, v_raw))

    def add_tri(self, p1, p2, p3, tile, tint, uvscale, sv=None,
                outward_from=None):
        """Один треугольник с face-нормалью. outward_from: точка, ОТ которой
        должна смотреть нормаль (winding самокорректируется под FrontSide)."""
        ax, ay, az = p1
        bx, by, bz = p2
        cx, cy, cz = p3
        ux, uy, uz = bx - ax, by - ay, bz - az
        vx, vy, vz = cx - ax, cy - ay, cz - az
        nx = uy * vz - uz * vy
        ny = uz * vx - ux * vz
        nz = ux * vy - uy * vx
        ln = math.sqrt(nx * nx + ny * ny + nz * nz)
        if ln > 0:
            nx, ny, nz = nx / ln, ny / ln, nz / ln
        else:
            nx, ny, nz = 0.0, 1.0, 0.0
        if outward_from is not None:
            gx = (ax + bx + cx) / 3 - outward_from[0]
            gy = (ay + by + cy) / 3 - outward_from[1]
            gz = (az + bz + cz) / 3 - outward_from[2]
            if nx * gx + ny * gy + nz * gz < 0:
                bx, by, bz, cx, cy, cz = cx, cy, cz, bx, by, bz
                nx, ny, nz = -nx, -ny, -nz
        cr, cg, cb = (clean(round(v, 3)) for v in tint)
        ckey = (cr, cg, cb)
        ci = self.col_map.get(ckey)
        if ci is None:
            ci = len(self.colors) // 3
            self.col_map[ckey] = ci
            self.colors += [cr, cg, cb]
        self.col_index.append(ci)
        n = (nx, ny, nz)
        for (X, Y, Z) in ((ax, ay, az), (bx, by, bz), (cx, cy, cz)):
            u, v = box_uv(nx, ny, nz, X, Y, Z, uvscale, sv)
            self._corner((X, Y, Z), n, tile, u, v)

    def add_box(self, cx, cy, cz, sx, sy, sz, tile, tint, uvscale, sv=None):
        """12 tris (2 на грань) с нормалями наружу и planar-UV
        по доминантной оси (1 тайл/sv метров, sv с пропорцией фото)."""
        x0, x1 = cx - sx / 2, cx + sx / 2
        y0, y1 = cy - sy / 2, cy + sy / 2
        z0, z1 = cz - sz / 2, cz + sz / 2
        c = (cx, cy, cz)
        faces = [
            [(x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1)],
            [(x0, y0, z0), (x0, y0, z1), (x1, y0, z1), (x1, y0, z0)],
            [(x1, y0, z0), (x1, y0, z1), (x1, y1, z1), (x1, y1, z0)],
            [(x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (x0, y0, z1)],
            [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)],
            [(x0, y0, z0), (x0, y1, z0), (x1, y1, z0), (x1, y0, z0)],
        ]
        for q in faces:
            self.add_tri(q[0], q[1], q[2], tile, tint, uvscale, sv, c)
            self.add_tri(q[0], q[2], q[3], tile, tint, uvscale, sv, c)

    def add_solid(self, x, z, hx, hz, h, deck=False, tag=None):
        s = {"x": clean(round(x, 3)), "z": clean(round(z, 3)),
             "hx": clean(round(hx, 3)), "hz": clean(round(hz, 3)),
             "h": clean(round(h, 3))}
        if deck:
            s["deck"] = True
        if tag is not None:
            s["tag"] = tag
        self.solids.append(s)

    def add_octa(self, cx, cy, cz, r, tile, tint, uvscale, sv=None):
        """Октаэдр-блоб (крона дерева, шар фонаря): 8 tris, нормали наружу."""
        top = (cx, cy + r, cz)
        bot = (cx, cy - r, cz)
        v = [(cx + r, cy, cz), (cx, cy, cz + r),
             (cx - r, cy, cz), (cx, cy, cz - r)]
        c = (cx, cy, cz)
        for i in range(4):
            self.add_tri(top, v[i], v[(i + 1) % 4],
                         tile, tint, uvscale, sv, c)
            self.add_tri(bot, v[(i + 1) % 4], v[i],
                         tile, tint, uvscale, sv, c)


def proc_tile(kind, prng):
    S = 256
    if kind == "clockface":
        # Циферблат Биг-Бена: каменный фон (края однородные — стык бесшовный),
        # слоновая кость, чёрный обод, 12 меток, стрелки ~10:09, центр.
        base = (118, 116, 110)
        im = Image.new("RGB", (S, S))
        px = im.load()
        assert px is not None
        for yy in range(S):
            for xx in range(S):
                n = prng.randint(-5, 5)
                px[xx, yy] = (base[0] + n, base[1] + n, base[2] + n)
        cx = cy = S // 2
        R = 104
        for yy in range(S):
            for xx in range(S):
                dx, dy = xx - cx, yy - cy
                r = math.sqrt(dx * dx + dy * dy)
                if r <= R:
                    px[xx, yy] = (238, 232, 214)  # слоновая кость
                if R - 5 <= r <= R:
                    px[xx, yy] = (20, 20, 22)  # обод
        for h in range(12):  # часовые метки
            ang = h * math.pi / 6
            big = (h % 3 == 0)
            wdt = 5 if big else 3
            leng = 20 if big else 12
            for t in range(leng):
                rr = R - 8 - t
                ex = int(round(cx + rr * math.sin(ang)))
                ey = int(round(cy - rr * math.cos(ang)))
                for o in range(-wdt // 2, wdt // 2 + 1):
                    px[min(S - 1, max(0, ex + o)),
                       min(S - 1, max(0, ey))] = (20, 20, 22)
        def hand(ang, leng, wdt):
            for t in range(leng):
                ex = int(round(cx + t * math.sin(ang)))
                ey = int(round(cy - t * math.cos(ang)))
                for ox in range(-wdt, wdt + 1):
                    for oy in range(-wdt, wdt + 1):
                        X, Y = ex + ox, ey + oy
                        if 0 <= X < S and 0 <= Y < S:
                            px[X, Y] = (15, 15, 17)
        hand(-2.35, 52, 3)  # часовая ~10:09
        hand(1.05, 78, 2)   # минутная
        px[cx, cy] = (15, 15, 17)
        return im
    TAU0 = 2 * math.pi
    if kind == "pavement":
        # Брусчатка: ряды 64x32 со сдвигом полблока (running bond),
        # периоды делят 256 — стык бесшовный. Тёмные швы, светлый камень.
        base = (172, 168, 160)
        im = Image.new("RGB", (S, S))
        px = im.load()
        assert px is not None
        for yy in range(S):
            row = yy // 32
            off = 32 if row % 2 else 0
            for xx in range(S):
                bx = (xx + off) % S
                joint = (bx % 64) < 3 or (yy % 32) < 3
                wx = math.sin(TAU0 * 3 * xx / S) * math.sin(TAU0 * 2 * xx / S)
                wy = math.sin(TAU0 * 2 * yy / S) * math.sin(TAU0 * 3 * yy / S)
                n = prng.randint(-7, 7) + int(5 * wx * wy)
                if joint:
                    n -= 58
                r = min(255, max(0, base[0] + n))
                g = min(255, max(0, base[1] + n))
                bb = min(255, max(0, base[2] + n))
                px[xx, yy] = (r, g, bb)
        return im
    if kind == "slate":
        # Сланец: ряды 64x32 со сдвигом, тёмно-сизые пластины,
        # детерминированный тон пластины ((ix*7+iy*13)%5), тёмные швы.
        im = Image.new("RGB", (S, S))
        px = im.load()
        assert px is not None
        for yy in range(S):
            row = yy // 32
            off = 32 if row % 2 else 0
            for xx in range(S):
                bx = (xx + off) % S
                ix, iy = (bx // 64) % 4, row % 8
                joint = (bx % 64) < 2 or (yy % 32) < 2
                tone = ((ix * 7 + iy * 13) % 5 - 2) * 6
                wx = math.sin(TAU0 * 5 * xx / S) * math.sin(TAU0 * 7 * yy / S)
                n = prng.randint(-6, 6) + int(5 * wx) + tone
                if joint:
                    n -= 34
                r = min(255, max(0, 74 + n))
                g = min(255, max(0, 82 + n))
                bb = min(255, max(0, 96 + n))
                px[xx, yy] = (r, g, bb)
        return im
    if kind == "leaf":
        # Листва: периодические пятна (синусы) + крап, глубина без белого.
        base = (56, 108, 50)
        im = Image.new("RGB", (S, S))
        px = im.load()
        assert px is not None
        for yy in range(S):
            wy = math.sin(TAU0 * 4 * yy / S + 0.5) * math.sin(TAU0 * 6 * yy / S)
            for xx in range(S):
                wx = math.sin(TAU0 * 5 * xx / S) * math.sin(TAU0 * 3 * xx / S + 1.1)
                n = prng.randint(-13, 13) + int(16 * wx * wy)
                r0 = prng.random()
                if r0 < 0.06:
                    n -= 30
                elif r0 > 0.95:
                    n += 24
                r = min(255, max(0, base[0] + n))
                g = min(255, max(0, base[1] + n))
                bb = min(255, max(0, base[2] + n // 2))
                px[xx, yy] = (r, g, bb)
        return im
    if kind == "bark":
        # Кора: вертикальные периодические борозды + крап, трещины тёмные.
        base = (94, 70, 48)
        im = Image.new("RGB", (S, S))
        px = im.load()
        assert px is not None
        for yy in range(S):
            for xx in range(S):
                groove = math.sin(TAU0 * 8 * xx / S +
                                  2.2 * math.sin(TAU0 * 3 * xx / S))
                streak = math.sin(TAU0 * 2 * xx / S + TAU0 * 5 * yy / S)
                n = prng.randint(-9, 9) + int(14 * groove) + int(6 * streak)
                if fract(xx * 0.37 + yy * 0.11) < 0.05:
                    n -= 34
                r = min(255, max(0, base[0] + n))
                g = min(255, max(0, base[1] + n))
                bb = min(255, max(0, base[2] + n))
                px[xx, yy] = (r, g, bb)
        return im
    if kind == "wood":
        # Дерево лавок: горизонтальные доски 64px + волокно вдоль X.
        base = (152, 114, 72)
        im = Image.new("RGB", (S, S))
        px = im.load()
        assert px is not None
        for yy in range(S):
            plank = (yy // 64) % 4
            tone = ((plank * 11) % 3 - 1) * 6
            for xx in range(S):
                grain = math.sin(TAU0 * 2 * xx / S + plank +
                                 1.8 * math.sin(TAU0 * 6 * xx / S))
                n = prng.randint(-7, 7) + int(9 * grain) + tone
                if (yy % 64) < 2:
                    n -= 58
                r = min(255, max(0, base[0] + n))
                g = min(255, max(0, base[1] + n))
                bb = min(255, max(0, base[2] + n))
                px[xx, yy] = (r, g, bb)
        return im
    if kind == "roof":
        base, amp = (148, 146, 142), 8
    elif kind == "plaster_warm":
        base, amp = (232, 222, 202), 6
    elif kind == "plaster_cool":
        base, amp = (212, 218, 226), 6
    else:  # asphalt
        base, amp = (88, 88, 90), 12
    im = Image.new("RGB", (S, S))
    px = im.load()
    assert px is not None
    TAU = 2 * math.pi
    for yy in range(S):
        wy = math.sin(TAU * 2 * yy / S) * math.sin(TAU * 3 * yy / S)
        wy2 = math.sin(TAU * 5 * yy / S + 1.3) * math.sin(TAU * 7 * yy / S)
        for xx in range(S):
            wx = math.sin(TAU * 3 * xx / S) * math.sin(TAU * 2 * xx / S)
            wx2 = math.sin(TAU * 7 * xx / S) * math.sin(TAU * 5 * xx / S + 0.7)
            n = prng.randint(-amp, amp) + int(7 * wx * wy) + int(6 * wx2 * wy2)
            if kind == "roof":
                n += 7 if ((xx // 128) + (yy // 128)) % 2 == 0 else -7
            if kind == "asphalt":
                r0 = prng.random()
                if r0 < 0.02:
                    n -= 28
                elif r0 > 0.98:
                    n += 24
            r = min(255, max(0, base[0] + n))
            g = min(255, max(0, base[1] + n))
            b = min(255, max(0, base[2] + n))
            px[xx, yy] = (r, g, b)
    if kind == "roof":
        for k in range(0, S, 64):
            for d in range(2):
                for yy in range(S):
                    px[(k + d) % S, yy] = (110, 108, 104)
                for xx in range(S):
                    px[xx, (k + d) % S] = (110, 108, 104)
    return im


def edge_extend(im, e=EDGE_EXT):
    w, h = im.size
    ext = Image.new("RGB", (w + 2 * e, h + 2 * e))
    ext.paste(im, (e, e))
    nz = Image.Resampling.NEAREST
    ext.paste(im.crop((0, 0, 1, h)).resize((e, h), nz), (0, e))
    ext.paste(im.crop((w - 1, 0, w, h)).resize((e, h), nz), (w + e, e))
    ext.paste(im.crop((0, 0, w, 1)).resize((w, e), nz), (e, 0))
    ext.paste(im.crop((0, h - 1, w, h)).resize((w, e), nz), (e, h + e))
    for (px, py, dx, dy) in ((0, 0, 0, 0), (w - 1, 0, w + e, 0),
                             (0, h - 1, 0, h + e),
                             (w - 1, h - 1, w + e, h + e)):
        ext.paste(im.crop((px, py, px + 1, py + 1)).resize((e, e), nz),
                  (dx, dy))
    return ext


def grid_plate(b, x0, x1, z0, z1, y, cell, tile, tint, uvscale):
    """Плоская плита три-сеткой (up-нормали) — земля/пол."""
    nx = max(1, round((x1 - x0) / cell))
    nz = max(1, round((z1 - z0) / cell))
    dx, dz = (x1 - x0) / nx, (z1 - z0) / nz
    below = (x0, y - 1.0, z0)
    for ix in range(nx):
        for iz in range(nz):
            ax, az = x0 + ix * dx, z0 + iz * dz
            qx, qz = ax + dx, az + dz
            b.add_tri((ax, y, az), (ax, y, qz), (qx, y, qz),
                      tile, tint, uvscale, None, below)
            b.add_tri((ax, y, az), (qx, y, qz), (qx, y, az),
                      tile, tint, uvscale, None, below)


def recommended_spawn(solids, cx=0.0, cz=0.0, rad=2.0, bound=85.0, step=1.0):
    """Ближайшая к (cx,cz) точка, свободная кругом rad от солидов
    (круг против AABB как engine solidHit). Детерминирована."""
    r2 = rad * rad
    boxes = [(s["x"] - s["hx"], s["x"] + s["hx"],
              s["z"] - s["hz"], s["z"] + s["hz"]) for s in solids]

    def free(x, z):
        for (x0, x1, z0, z1) in boxes:
            qx = x0 if x < x0 else (x1 if x > x1 else x)
            qz = z0 if z < z0 else (z1 if z > z1 else z)
            dx, dz = x - qx, z - qz
            if dx * dx + dz * dz < r2:
                return False
        return True

    n = int(bound / step)
    cand = []
    for ix in range(-n, n + 1):
        for iz in range(-n, n + 1):
            x, z = ix * step, iz * step
            cand.append(((x - cx) ** 2 + (z - cz) ** 2, x, z))
    cand.sort()
    for _, x, z in cand:
        if free(x, z):
            return (clean(round(x, 3)), clean(round(z, 3)))
    return None


def main():
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--mesh-out",
                    default=str(here.parent / "src" / "assets" /
                                "szeged.mesh.json"))
    ap.add_argument("--atlas-out",
                    default=str(here.parent / "src" / "assets" /
                                "szeged-atlas.jpg"))
    ap.add_argument("--solids-out",
                    default=str(here.parent / "src" / "assets" /
                                "szeged.solids.json"))
    ap.add_argument("--spawn-out", default=str(here / "szeged-spawn.json"))
    a = ap.parse_args()
    rng = random.Random(a.seed)
    prng = random.Random(42)
    b = Baker()

    # ---- земля: две плиты три-сеткой по обе стороны канала ----
    grid_plate(b, -HALF, HALF, CANAL_HALF + 0.3, HALF, 0.0, 2.0,
               PROC_ASPH, GROUND_TINT, 4.0)
    grid_plate(b, -HALF, HALF, -HALF, -(CANAL_HALF + 0.3), 0.0, 2.0,
               PROC_ASPH, GROUND_TINT, 4.0)

    # ---- канал: вода (только меш, без солида) + стенки-берега h=1 ----
    b.add_box(0, -0.6, 0, FIELD, 0.2, CANAL_HALF * 2,
              PROC_ASPH, WATER_TINT, 4.0)

    AV = [-75.0, -45.0, -15.0, 15.0, 45.0, 75.0]  # авеню 6м, шаг ~30м
    AH = [-75.0, -45.0, -15.0, 15.0, 45.0, 75.0]

    def bank_runs():
        """Прогоны берегов с разрывами под мосты (задача 3) на авеню."""
        gaps = sorted(v for v in AV)
        cuts = [-HALF]
        for v in gaps:
            cuts += [v - 3.0, v + 3.0]
        cuts += [HALF]
        runs = []
        for i in range(0, len(cuts), 2):
            x0, x1 = cuts[i], cuts[i + 1]
            if x1 - x0 < 0.5:
                continue
            # нарезка прогонов >20м (кап бокса hx<=12)
            n = max(1, math.ceil((x1 - x0) / 20.0))
            for k in range(n):
                runs.append((x0 + (x1 - x0) * k / n,
                             x0 + (x1 - x0) * (k + 1) / n))
        return runs

    for x0, x1 in bank_runs():
        cx, sx = (x0 + x1) / 2, x1 - x0
        for zc in (CANAL_HALF, -CANAL_HALF):
            b.add_box(cx, 0.0, zc, sx, 1.0, 0.6,
                      PROC_COOL, (0.6, 0.62, 0.65), 4.0)
            b.add_solid(cx, zc, sx / 2, 0.3, 1.0)

    # ---- улицы: авеню 6м (верх 0.06), переулки 4м, площадь ----
    for xv in AV:  # вертикальные, разрыв над каналом (мосты — задача 3)
        for z0, z1 in ((CANAL_HALF + 0.3, HALF), (-HALF, -(CANAL_HALF + 0.3))):
            b.add_box(xv, 0.01, (z0 + z1) / 2, 6.0, 0.1, z1 - z0,
                      STREET_TILE, (0.9, 0.9, 0.9), 4.0)
    # горизонтальные — сегментами между вертикальными (без z-fight)
    bounds = [-HALF] + [v for xv in AV for v in (xv - 3.0, xv + 3.0)] + [HALF]
    for zh in AH:
        for i in range(0, len(bounds), 2):
            x0, x1 = bounds[i], bounds[i + 1]
            if x1 - x0 < 0.5:
                continue
            b.add_box((x0 + x1) / 2, 0.01, zh, x1 - x0, 0.1, 6.0,
                      STREET_TILE, (0.9, 0.9, 0.9), 4.0)
    # 3 переулка 4м
    ALLEYS = [
        (-40.0, -36.0, 8.0, 64.0),    # A1 N-S, восток куска 18м под дома
        (36.0, 40.0, -82.0, -8.0),    # A2 N-S, запад куска 18м под дома
    ]
    for x0, x1, z0, z1 in ALLEYS:
        b.add_box((x0 + x1) / 2, -0.01, (z0 + z1) / 2, x1 - x0, 0.1, z1 - z0,
                  STREET_TILE, (0.88, 0.88, 0.88), 4.0)
    # A3 E-W: сегментами (мимо авеню и A1 — без копланарных стыков)
    A3Z = (66.0, 70.0)
    a3cuts = sorted(set(bounds + [-40.0, -36.0]))
    for i in range(0, len(a3cuts), 2):
        x0, x1 = a3cuts[i], a3cuts[i + 1]
        if x1 - x0 < 0.5:
            continue
        b.add_box((x0 + x1) / 2, -0.008, (A3Z[0] + A3Z[1]) / 2,
                  x1 - x0, 0.1, A3Z[1] - A3Z[0],
                  STREET_TILE, (0.88, 0.88, 0.88), 4.0)
    # площадь 40x40, центр (0,-45)
    px0, px1, pz0, pz1 = PLAZA
    b.add_box((px0 + px1) / 2, 0.0, (pz0 + pz1) / 2,
              px1 - px0, 0.1, pz1 - pz0,
              STREET_TILE, (0.85, 0.82, 0.78), 4.0)

    # ---- дома-коробки в кварталах между авеню ----
    xivs = [(bounds[i], bounds[i + 1]) for i in range(0, len(bounds), 2)
            if bounds[i + 1] - bounds[i] >= 9.0]
    zivs = xivs  # та же сетка по z
    alley_rects = [(-40.0, -36.0, 8.0, 64.0), (36.0, 40.0, -82.0, -8.0),
                   (-HALF, HALF, A3Z[0], A3Z[1])]
    canal_rect = (-HALF, HALF, -(CANAL_HALF + 1.0), CANAL_HALF + 1.0)
    plaza_rect = (px0 - 1.0, px1 + 1.0, pz0 - 1.0, pz1 + 1.0)

    def overlap(r, s):
        return r[0] < s[1] and r[1] > s[0] and r[2] < s[3] and r[3] > s[2]

    def split_piece(piece, cut):
        """Вычесть cut из piece -> до 4 подпямоугольников."""
        x0, x1, z0, z1 = piece
        cx0, cx1, cz0, cz1 = cut
        ix0, ix1 = max(x0, cx0), min(x1, cx1)
        iz0, iz1 = max(z0, cz0), min(z1, cz1)
        if ix0 >= ix1 or iz0 >= iz1:
            return [piece]
        out = []
        if x0 < ix0:
            out.append((x0, ix0, z0, z1))
        if ix1 < x1:
            out.append((ix1, x1, z0, z1))
        if z0 < iz0:
            out.append((ix0, ix1, z0, iz0))
        if iz1 < z1:
            out.append((ix0, ix1, iz1, z1))
        return out

    houses = []  # (x,z,w,d,h)
    pieces_all = []
    for xi0, xi1 in xivs:
        for zi0, zi1 in zivs:
            pieces = [(xi0, xi1, zi0, zi1)]
            for cut in [canal_rect, plaza_rect] + alley_rects:
                nxt = []
                for pc in pieces:
                    if overlap(pc, cut):
                        nxt.extend(split_piece(pc, cut))
                    else:
                        nxt.append(pc)
                pieces = nxt
            pieces_all.extend(pieces)

    def place_in(qx0, qx1, qz0, qz1):
        """Один дом в кусок; широкие куски — пополам под два дома."""
        m = 0.8
        qw, qd = (qx1 - qx0), (qz1 - qz0)
        if qw - 2 * m >= 2 * 10.0 + 0.6 and qw >= qd:
            xm = (qx0 + qx1) / 2
            place_in(qx0, xm - 0.3, qz0, qz1)
            place_in(xm + 0.3, qx1, qz0, qz1)
            return
        if qd - 2 * m >= 2 * 8.0 + 0.6 and qd > qw:
            zm = (qz0 + qz1) / 2
            place_in(qx0, qx1, qz0, zm - 0.3)
            place_in(qx0, qx1, zm + 0.3, qz1)
            return
        if qw - 2 * m < 10.0 or qd - 2 * m < 8.0:
            return
        w = min(16.0, qw - 2 * m, 10.0 + rng.random() * 6.0)
        d = min(12.0, qd - 2 * m, 8.0 + rng.random() * 4.0)
        h = 9.0 + rng.random() * 6.0
        jx = (rng.random() - 0.5) * max(0.0, (qw - 2 * m) - w)
        jz = (rng.random() - 0.5) * max(0.0, (qd - 2 * m) - d)
        houses.append(((qx0 + qx1) / 2 + jx, (qz0 + qz1) / 2 + jz,
                       w, d, h))

    for (qx0, qx1, qz0, qz1) in pieces_all:
        place_in(qx0, qx1, qz0, qz1)
    assert len(houses) >= 24, f"домов {len(houses)} < 24"

    # пропорции curated (h/w) — без искажений фото
    cur_aspect = {}
    for cur_name, src_name in CUR_SRC.items():
        p = here / "szeged-curated" / src_name
        try:
            with Image.open(p) as im:
                cur_aspect[cur_name] = im.size[1] / max(1, im.size[0])
        except Exception as e:
            print(f"curated: missing {src_name}: {e}", flush=True)
    missing_cur = [c for c in list(CUR_SRC) if c not in cur_aspect]
    unresolved = list(missing_cur)

    # ---- Task 2: интерьеры, балконы, крыши-террасы ----
    # Стены комнаты — тонкие боксы с разрывом 2м (дверь); цельный солид дома
    # заменяется сегментами стен; ступени 0.5м (степ движка ≤1.1м).
    WT = 0.4       # толщина стен
    DOOR_W = 2.0   # ширина дверного проёма
    DOOR_H = 2.6   # высота проёма (выше — перемычка, только меш)
    BALC_H = 3.0   # высота балконной плиты
    RISE = 0.5     # высота ступени
    TREAD = 0.6    # глубина ступени
    STAIR_W = 2.0  # ширина лестницы = вылет балкона

    house_rect = [(hx - w / 2, hx + w / 2, hz - d / 2, hz + d / 2)
                  for (hx, hz, w, d, h) in houses]

    def hits(a, b, pad=0.0):
        return (a[0] < b[1] + pad and a[1] > b[0] - pad and
                a[2] < b[3] + pad and a[3] > b[2] - pad)

    canal_r = (-HALF, HALF, -(CANAL_HALF + 1.0), CANAL_HALF + 1.0)
    plaza_r = (px0 - 1.0, px1 + 1.0, pz0 - 1.0, pz1 + 1.0)
    placed_feat = []

    def feat_clear(r, self_i):
        for j, hr in enumerate(house_rect):
            if j != self_i and hits(r, hr, 0.25):
                return False
        if hits(r, canal_r, 0.25) or hits(r, plaza_r, 0.25):
            return False
        return not any(hits(r, fr, 0.25) for fr in placed_feat)

    order = sorted(range(len(houses)),
                   key=lambda i: (houses[i][0], houses[i][1]))

    def far_spawn(i):
        hx, hz, w, d, _h = houses[i]
        return not (hx - w / 2 < 8.0 and hx + w / 2 > -8.0 and
                    hz - d / 2 < PLAZA_C[1] + 8.0 and
                    hz + d / 2 > PLAZA_C[1] - 8.0)

    avail = [i for i in order if far_spawn(i)]
    interior_ids = set(avail[:8])
    through_ids = set(avail[:2])
    used = set(interior_ids)
    terrace_ids = []
    for i in avail:  # нужен интерьер w>=12 под прямой марш 18 ступеней
        if i in used:
            continue
        if houses[i][2] >= 12.0:
            terrace_ids.append(i)
            used.add(i)
        if len(terrace_ids) == 3:
            break
    assert len(terrace_ids) == 3, f"террас {len(terrace_ids)} < 3"
    terrace_set = set(terrace_ids)
    house_h = {i: 9.0 for i in terrace_ids}  # плоская крыша, короткий марш

    def balc_rect(i, side, dirx):
        hx, hz, w, d, _h = houses[i]
        zf = hz + side * d / 2
        x_lo = hx - 5.6 if dirx < 0 else hx - 2.0
        x_hi = hx + 2.0 if dirx < 0 else hx + 5.6
        z_lo, z_hi = ((zf, zf + side * STAIR_W) if side > 0
                      else (zf + side * STAIR_W, zf))
        return (x_lo, x_hi, z_lo, z_hi)

    balcony_spots = []  # (i, side, dirx)
    for i in avail:
        if i in used:
            continue
        for (side, dirx) in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
            r = balc_rect(i, side, dirx)
            if feat_clear(r, i):
                balcony_spots.append((i, side, dirx))
                used.add(i)
                placed_feat.append(r)
                break
        if len(balcony_spots) == 4:
            break
    assert len(balcony_spots) == 4, f"балконов {len(balcony_spots)} < 4"

    def wall_seg(cx, cz, sx, sz, H, tile, tsv):
        b.add_box(cx, H / 2 - 0.05, cz, sx, H + 0.05, sz,
                  tile, WHITE, 8.0, tsv)
        b.add_solid(cx, cz, sx / 2, sz / 2, H, tag="wall")

    def door_face(dx, wz, H, tile, tsv):
        # перемычка над проёмом — только меш; порог — низкий маркер солида
        b.add_box(dx, (DOOR_H + H) / 2, wz, DOOR_W, H - DOOR_H, WT,
                  tile, WHITE, 8.0, tsv)
        b.add_solid(dx, wz, DOOR_W / 2, 0.3, 0.12, tag="door")

    def build_interior(hx, hz, w, d, H, tile, tsv, through):
        x0, x1 = hx - w / 2, hx + w / 2
        zN, zS = hz - d / 2, hz + d / 2
        for (ax, bx_) in ((x0, hx - DOOR_W / 2), (hx + DOOR_W / 2, x1)):
            wall_seg((ax + bx_) / 2, zS - WT / 2, bx_ - ax, WT, H,
                     tile, tsv)
        door_face(hx, zS - WT / 2, H, tile, tsv)
        segs = ((x0, hx - DOOR_W / 2), (hx + DOOR_W / 2, x1)) if through \
            else ((x0, x1),)
        for (ax, bx_) in segs:
            wall_seg((ax + bx_) / 2, zN + WT / 2, bx_ - ax, WT, H,
                     tile, tsv)
        if through:
            door_face(hx, zN + WT / 2, H, tile, tsv)
        for wx_ in (x0 + WT / 2, x1 - WT / 2):
            wall_seg(wx_, hz, WT, d - 2 * WT, H, tile, tsv)
        fw, fd = w - 2 * WT, d - 2 * WT
        b.add_box(hx, 0.06, hz, fw, 0.12, fd, PROC_WARM, WHITE, 4.0)
        b.add_solid(hx, hz, fw / 2, fd / 2, 0.12)

    def build_steps_x(x_start, zc, dirx, n, wdt):
        # x_start — внешний край нижней ступени; рост верха к dirx
        for j in range(1, n + 1):
            top = clean(round(RISE * j, 3))
            cx = x_start + dirx * (j - 0.5) * TREAD
            b.add_box(cx, top / 2, zc, TREAD, top, wdt,
                      PROC_COOL, WHITE, 4.0)
            b.add_solid(cx, zc, TREAD / 2, wdt / 2, top, tag="step")

    def build_balcony(hx, hz, w, d, side, dirx, tile, tsv):
        zf = hz + side * d / 2
        zc = zf + side * STAIR_W / 2
        b.add_box(hx, BALC_H - 0.075, zc, 4.0, 0.15, STAIR_W,
                  PROC_COOL, WHITE, 4.0)
        b.add_solid(hx, zc, 2.0, STAIR_W / 2, BALC_H,
                    deck=True, tag="balcony")
        zo = zf + side * (STAIR_W - 0.1)
        b.add_box(hx, BALC_H + 0.5, zo, 4.0, 1.0, 0.2,
                  tile, WHITE, 8.0, tsv)
        b.add_solid(hx, zo, 2.0, 0.1, BALC_H + 1.0, tag="rail")
        xs = hx - 1.9 if dirx > 0 else hx + 1.9  # дальняя от лестницы
        b.add_box(xs, BALC_H + 0.5, zc, 0.2, 1.0, STAIR_W,
                  tile, WHITE, 8.0, tsv)
        b.add_solid(xs, zc, 0.1, STAIR_W / 2, BALC_H + 1.0, tag="rail")
        if dirx > 0:
            build_steps_x(hx + 2.0 + 6 * TREAD, zc, -1, 6, STAIR_W)
        else:
            build_steps_x(hx - 2.0 - 6 * TREAD, zc, 1, 6, STAIR_W)

    def build_terrace(hx, hz, w, d, H, tile, tsv):
        x0, x1 = hx - w / 2, hx + w / 2
        zN, zS = hz - d / 2, hz + d / 2
        n = int(round(H / RISE))  # 18 при H=9
        xs0 = x0 + WT  # марш внутри, от западной стены
        zc = zN + WT + STAIR_W / 2
        build_steps_x(xs0, zc, 1, n, STAIR_W)
        hx0, hx1 = xs0 + (n - 3) * TREAD - 0.2, xs0 + n * TREAD + 0.2
        hz0 = max(zN, zc - STAIR_W / 2 - 0.2)
        hz1 = min(zS, zc + STAIR_W / 2 + 0.2)
        for (ax, bx_, az, bz) in ((x0, hx0, zN, zS), (hx1, x1, zN, zS),
                                  (hx0, hx1, hz1, zS), (hx0, hx1, zN, hz0)):
            if bx_ - ax < 0.1 or bz - az < 0.1:
                continue
            cx_, cz_ = (ax + bx_) / 2, (az + bz) / 2
            b.add_box(cx_, H - 0.075, cz_, bx_ - ax, 0.15, bz - az,
                      PROC_COOL, WHITE, 4.0)
            b.add_solid(cx_, cz_, (bx_ - ax) / 2, (bz - az) / 2, H,
                        deck=True, tag="terrace")
        pt = 0.25  # парапет h=1 по краю; над дверью — разрыв 2м,
        # иначе колонна парапета (h=H+1 от земли) затыкает проём
        parapets = [(hx, zN + pt / 2, w, pt),
                    (x0 + pt / 2, hz, pt, d - 2 * pt),
                    (x1 - pt / 2, hz, pt, d - 2 * pt)]
        for (ax, bx_) in ((x0, hx - DOOR_W / 2), (hx + DOOR_W / 2, x1)):
            parapets.append(((ax + bx_) / 2, zS - pt / 2, bx_ - ax, pt))
        for (cx_, cz_, sx, sz) in parapets:
            b.add_box(cx_, H + 0.5, cz_, sx, 1.0, sz,
                      tile, WHITE, 8.0, tsv)
            b.add_solid(cx_, cz_, sx / 2, sz / 2, H + 1.0, tag="parapet")

    for mi, (hx, hz, w, d, h) in enumerate(houses):
        H = house_h.get(mi, h)
        facade = CUR_WALLS[mi % len(CUR_WALLS)]
        if facade in missing_cur:
            facade = PROC_WARM
        fsv = 8.0 * cur_aspect.get(facade, 1.0)
        if mi in interior_ids or mi in terrace_set:
            build_interior(hx, hz, w, d, H, facade, fsv,
                           mi in through_ids)
        else:
            b.add_box(hx, H / 2 - 0.05, hz, w, H + 0.05, d,
                      facade, WHITE, 8.0, fsv)
            b.add_solid(hx, hz, w / 2, d / 2, H)
        if mi in terrace_set:
            build_terrace(hx, hz, w, d, H, facade, fsv)
            continue
        # скатная крыша-призма (декор, не deck): конёк вдоль длинной оси
        rh = 2.5 + rng.random() * 0.7
        ov = 0.4
        rsv = 3.0 * cur_aspect.get(CUR_ROOF, 1.0)
        roof_tile = PROC_SLATE  # task4: скатные крыши — сланец
        yb = H - 0.05
        if w >= d:
            x0, x1 = hx - w / 2 - ov, hx + w / 2 + ov
            z0, z1 = hz - d / 2 - ov, hz + d / 2 + ov
            zm = hz
            rc = (hx, yb, hz)
            # фронтоны (фасад) на торцах x
            for xe, out in ((x0, (hx - 1, yb, hz)), (x1, (hx + 1, yb, hz))):
                b.add_tri((xe, yb, z0), (xe, yb, z1), (xe, yb + rh, zm),
                          facade, WHITE, 8.0, fsv, out)
            # скаты (черепица)
            for sgn, out in ((1, (hx, yb, hz + 1)), (-1, (hx, yb, hz - 1))):
                ze = zm + sgn * (d / 2 + ov)
                b.add_tri((x0, yb, ze), (x1, yb, ze), (x1, yb + rh, zm),
                          roof_tile, WHITE, 3.0, rsv, out)
                b.add_tri((x0, yb, ze), (x1, yb + rh, zm), (x0, yb + rh, zm),
                          roof_tile, WHITE, 3.0, rsv, out)
        else:
            x0, x1 = hx - w / 2 - ov, hx + w / 2 + ov
            z0, z1 = hz - d / 2 - ov, hz + d / 2 + ov
            xm = hx
            rc = (hx, yb, hz)
            for ze, out in ((z0, (hx, yb, hz - 1)), (z1, (hx, yb, hz + 1))):
                b.add_tri((x0, yb, ze), (x1, yb, ze), (xm, yb + rh, ze),
                          facade, WHITE, 8.0, fsv, out)
            for sgn, out in ((1, (hx + 1, yb, hz)), (-1, (hx - 1, yb, hz))):
                xe = xm + sgn * (w / 2 + ov)
                b.add_tri((xe, yb, z0), (xe, yb, z1), (xm, yb + rh, z1),
                          roof_tile, WHITE, 3.0, rsv, out)
                b.add_tri((xe, yb, z0), (xm, yb + rh, z1), (xm, yb + rh, z0),
                          roof_tile, WHITE, 3.0, rsv, out)

    # ---- балконы на цельных домах (интерьеры/террасы выше) ----
    for (bi, side, dirx) in balcony_spots:
        hx, hz, w, d, h = houses[bi]
        facade = CUR_WALLS[bi % len(CUR_WALLS)]
        if facade in missing_cur:
            facade = PROC_WARM
        fsv = 8.0 * cur_aspect.get(facade, 1.0)
        build_balcony(hx, hz, w, d, side, dirx, facade, fsv)

    # ---- Task 3: мосты + Биг-Бен + башенки + арки ----
    # Мосты: deck h=1.2 через канал (z+-4.6), ступени 0.4/0.8 с обеих сторон,
    # парапеты h=2.2 (=deck+1) сегментами над берегами — пролёт над водой
    # открыт, иначе колонны парапетов затыкают проход под мостом в движке.
    BRIDGE_H = 1.2
    BRIDGE_XS = (-50.0, 0.0, 50.0)
    for bx in BRIDGE_XS:
        b.add_box(bx, BRIDGE_H - 0.075, 0.0, 6.0, 0.15, 9.2,
                  PROC_COOL, WHITE, 4.0)
        b.add_solid(bx, 0.0, 3.0, 4.6, BRIDGE_H, deck=True, tag="bridge")
        for sgn in (1, -1):
            for (zc, top) in ((sgn * 5.5, 0.5), (sgn * 4.9, 1.0)):
                b.add_box(bx, top / 2, zc, 6.0, top, 0.6,
                          PROC_COOL, WHITE, 4.0)
                b.add_solid(bx, zc, 3.0, 0.3, top, tag="step")
            for sx in (bx - 2.9, bx + 2.9):
                for zc in (5.0, -5.0):
                    b.add_box(sx, BRIDGE_H + 0.5, zc, 0.2, 1.0, 3.0,
                              PROC_COOL, WHITE, 4.0)
                    b.add_solid(sx, zc, 0.1, 1.5, BRIDGE_H + 1.0,
                                tag="parapet")
    # Биг-Бен на площади: башня 8x8x30, пояс циферблатов, шпиль-пирамида.
    BB = (0.0, -58.0)
    b.add_box(BB[0], 15.0 - 0.05, BB[1], 8.0, 30.0 + 0.05, 8.0,
              PROC_WARM, WHITE, 8.0)
    b.add_solid(BB[0], BB[1], 4.0, 4.0, 30.0, tag="tower")
    b.add_box(BB[0], 26.5, BB[1], 8.4, 3.0, 8.4,
              "zz_clock.png", WHITE, 8.0, 3.0)
    bx0, bx1, bz0, bz1 = BB[0] - 4.0, BB[0] + 4.0, BB[1] - 4.0, BB[1] + 4.0
    apex = (BB[0], 36.0, BB[1])
    bb_out = (BB[0], 29.0, BB[1])
    for (p1, p2) in (((bx0, 30.0, bz0), (bx1, 30.0, bz0)),
                     ((bx1, 30.0, bz0), (bx1, 30.0, bz1)),
                     ((bx1, 30.0, bz1), (bx0, 30.0, bz1)),
                     ((bx0, 30.0, bz1), (bx0, 30.0, bz0))):
        b.add_tri(p1, p2, apex, PROC_SLATE, WHITE, 3.0, None, bb_out)
    # 2 башенки 5x5x18 по краям площади + пирамидки.
    for (tx, tz) in ((-15.0, -32.0), (15.0, -32.0)):
        b.add_box(tx, 9.0 - 0.05, tz, 5.0, 18.0 + 0.05, 5.0,
                  PROC_WARM, WHITE, 8.0)
        b.add_solid(tx, tz, 2.5, 2.5, 18.0, tag="turret")
        cap = (tx, 21.0, tz)
        t_out = (tx, 17.0, tz)
        for (p1, p2) in (((tx - 2.5, 18.0, tz - 2.5), (tx + 2.5, 18.0, tz - 2.5)),
                         ((tx + 2.5, 18.0, tz - 2.5), (tx + 2.5, 18.0, tz + 2.5)),
                         ((tx + 2.5, 18.0, tz + 2.5), (tx - 2.5, 18.0, tz + 2.5)),
                         ((tx - 2.5, 18.0, tz + 2.5), (tx - 2.5, 18.0, tz - 2.5))):
            b.add_tri(p1, p2, cap, PROC_SLATE, WHITE, 3.0, None, t_out)
    # Арки в переулках: 2 столба h=4.5 + перекладина deck h=5 (низ 4.0).
    ARCHES = [(-38.0, 20.0, 40.0, 55.0), (38.0, -25.0, -55.0)]
    for (acx, *azs) in ARCHES:
        for az in azs:
            for sgn in (1, -1):
                sx = acx + sgn * 2.4
                b.add_box(sx, 4.5 / 2 - 0.05, az, 0.6, 4.5 + 0.05, 0.8,
                          PROC_WARM, WHITE, 4.0)
                b.add_solid(sx, az, 0.3, 0.4, 4.5, tag="arch")
            b.add_box(acx, 4.5, az, 5.6, 1.0, 0.8,
                      PROC_WARM, WHITE, 4.0)
            b.add_solid(acx, az, 2.8, 0.4, 5.0, deck=True, tag="archtop")

    # ---- Task 4: зелень — деревья, лавки, фонари ----
    # Только PIL-процедурки (pavement/slate/leaf/bark/wood), детерминировано.
    # Солиды компактные (ствол/лавка/столб ≤1м), шаг ≥2.5м — коридор-BFS цел.
    LEAF_TINT = WHITE
    LAMP_GLOBE_TINT = (1.0, 0.93, 0.75)  # светлый тинт, emissive нет
    LAMP_POLE_TINT = (0.3, 0.3, 0.33)
    placed_green = []  # (x, z, rad)

    def green_free(x, z, rad):
        if not (-HALF + 2 < x < HALF - 2 and -HALF + 2 < z < HALF - 2):
            return False
        if abs(z) < CANAL_HALF + 1.2:  # не в канале
            return False
        for s in b.solids:
            if s["h"] < 0.5:
                continue
            if abs(x - s["x"]) <= s["hx"] + rad and \
               abs(z - s["z"]) <= s["hz"] + rad:
                return False
        for (gx, gz, gr) in placed_green:
            if abs(x - gx) < rad + gr + 1.6 and \
               abs(z - gz) < rad + gr + 1.6:
                return False
        return True

    def build_tree(cx, cz):
        b.add_box(cx, 1.5, cz, 0.5, 3.0, 0.5, PROC_BARK, WHITE, 2.0)
        b.add_solid(cx, cz, 0.25, 0.25, 3.0, tag="trunk")
        b.add_octa(cx, 3.9, cz, 1.6, PROC_LEAF, LEAF_TINT, 2.0)
        b.add_octa(cx + 0.9, 3.2, cz + 0.3, 1.1, PROC_LEAF, LEAF_TINT, 2.0)
        b.add_octa(cx - 0.8, 3.3, cz - 0.4, 1.0, PROC_LEAF, LEAF_TINT, 2.0)
        placed_green.append((cx, cz, 1.6))

    def build_bench(cx, cz, along_x):
        if along_x:
            b.add_box(cx, 0.55, cz, 1.8, 0.12, 0.5, PROC_WOOD, WHITE, 2.0)
            b.add_box(cx, 0.95, cz - 0.28, 1.8, 0.7, 0.1,
                      PROC_WOOD, WHITE, 2.0)
            for sgn in (1, -1):
                b.add_box(cx + sgn * 0.75, 0.25, cz, 0.12, 0.5, 0.4,
                          PROC_WOOD, WHITE, 2.0)
            b.add_solid(cx, cz, 0.9, 0.3, 1.0, tag="bench")
        else:
            b.add_box(cx, 0.55, cz, 0.5, 0.12, 1.8, PROC_WOOD, WHITE, 2.0)
            b.add_box(cx + 0.28, 0.95, cz, 0.1, 0.7, 1.8,
                      PROC_WOOD, WHITE, 2.0)
            for sgn in (1, -1):
                b.add_box(cx, 0.25, cz + sgn * 0.75, 0.4, 0.5, 0.12,
                          PROC_WOOD, WHITE, 2.0)
            b.add_solid(cx, cz, 0.3, 0.9, 1.0, tag="bench")
        placed_green.append((cx, cz, 0.9))

    def build_lamp(cx, cz):
        b.add_box(cx, 1.8, cz, 0.25, 3.6, 0.25,
                  PROC_ASPH, LAMP_POLE_TINT, 2.0)
        b.add_solid(cx, cz, 0.15, 0.15, 3.6, tag="lamp")
        b.add_octa(cx, 3.85, cz, 0.35, PROC_WARM, LAMP_GLOBE_TINT, 2.0)
        placed_green.append((cx, cz, 0.4))

    # Кандидаты: деревья — кольцо площади + берега канала;
    # лавки — сетка площади; фонари — кромки авеню (сдвиг 4.2м от оси).
    tree_cands = []
    for x in (-18.0, -12.0, -6.0, 0.0, 6.0, 12.0, 18.0):
        tree_cands += [(x, -27.0), (x, -63.0)]
    for z in (-57.0, -51.0, -45.0, -39.0, -33.0):
        tree_cands += [(-18.0, z), (18.0, z)]
    for x in (-70.0, -55.0, -30.0, -10.0, 10.0, 30.0, 55.0, 70.0):
        tree_cands += [(x, 7.0), (x, -7.0)]
    bench_cands = []
    for x in (-15.0, -7.5, 0.0, 7.5, 15.0):
        for z in (-60.0, -52.5, -45.0, -37.5, -30.0):
            bench_cands.append((x, z))
    lamp_cands = []
    for xv in AV:
        for zh in (-75.0, -60.0, -45.0, -30.0, -15.0, 15.0,
                   30.0, 45.0, 60.0, 75.0):
            lamp_cands.append((xv + 4.2, zh))
    for zh in AH:
        for xv in (-60.0, -30.0, 30.0, 60.0):
            lamp_cands.append((xv, zh + 4.2))
    rng.shuffle(tree_cands)
    rng.shuffle(bench_cands)
    rng.shuffle(lamp_cands)
    tree_cands.sort(key=lambda p: (p[0], p[1]))
    bench_cands.sort(key=lambda p: (p[0], p[1]))
    lamp_cands.sort(key=lambda p: (p[0], p[1]))

    n_tree = n_bench = n_lamp = 0
    for (cx, cz) in tree_cands:
        if n_tree >= 14:
            break
        if green_free(cx, cz, 1.6):
            build_tree(round(cx, 3), round(cz, 3))
            n_tree += 1
    for i, (cx, cz) in enumerate(bench_cands):
        if n_bench >= 9:
            break
        if green_free(cx, cz, 0.9):
            build_bench(round(cx, 3), round(cz, 3), along_x=(i % 2 == 0))
            n_bench += 1
    for (cx, cz) in lamp_cands:
        if n_lamp >= 12:
            break
        if green_free(cx, cz, 0.6):
            build_lamp(round(cx, 3), round(cz, 3))
            n_lamp += 1
    assert n_tree >= 12, f"деревьев {n_tree} < 12"
    assert n_bench >= 8, f"лавок {n_bench} < 8"
    assert n_lamp >= 10, f"фонарей {n_lamp} < 10"

    # ---- атлас: процедурки + curated, shelf-pack как в bake ----
    proc_images = {pname: proc_tile(kind, prng)
                   for pname, kind in PROC_TILES.items()}
    tiles = {}
    for cur_name, src_name in CUR_SRC.items():
        if cur_name in missing_cur:
            continue
        try:
            im = Image.open(here / "szeged-curated" / src_name).convert("RGB")
            im.load()
        except Exception as e:
            print(f"atlas: skip curated {cur_name}: {e}", flush=True)
            unresolved.append(cur_name)
            continue
        im.thumbnail((TILE_MAX, TILE_MAX), Image.Resampling.LANCZOS)
        tiles[cur_name] = im
    for pname, pim in proc_images.items():
        tiles[pname] = pim

    rects = {}
    E = EDGE_EXT
    rects["@white"] = (E, E, WHITE_TILE, WHITE_TILE)
    sx0 = E + WHITE_TILE + TILE_PAD
    y = E
    row_h = WHITE_TILE
    x = sx0
    for fn in sorted(tiles, key=lambda f: (-tiles[f].height,
                                           -tiles[f].width, f)):
        w, h = tiles[fn].size
        if x + w + E > ATLAS_W:
            y += row_h + TILE_PAD
            x = E
            row_h = 0
        rects[fn] = (x, y, w, h)
        x += w + TILE_PAD
        row_h = max(row_h, h)
    H = y + row_h + E
    atlas = Image.new("RGB", (ATLAS_W, H), (0, 0, 0))
    wx, wy, ww, wh = rects["@white"]
    atlas.paste(Image.new("RGB", (ww, wh), (255, 255, 255)), (wx, wy))
    for fn, im in tiles.items():
        rx, ry, w, h = rects[fn]
        atlas.paste(edge_extend(im), (rx - E, ry - E))
    Path(a.atlas_out).parent.mkdir(parents=True, exist_ok=True)
    aq = ATLAS_Q
    while True:
        atlas.save(a.atlas_out, "JPEG", quality=aq, optimize=True)
        if os.path.getsize(a.atlas_out) <= ATLAS_BUDGET or aq <= ATLAS_Q_MIN:
            break
        aq -= 4
    atlas_bytes = os.path.getsize(a.atlas_out)

    # ---- uv углов в координатах атласа (flipY-инверт как в bake) ----
    wcx, wcy = wx + ww / 2, wy + wh / 2
    white_uv = (wcx / ATLAS_W, 1.0 - wcy / H)
    uv = []
    for (t, u_raw, v_raw) in b.corner_tex:
        if t is None or t not in rects:
            uu, vv = white_uv
        else:
            rx, ry, w, h = rects[t]
            uu = (rx + u_raw * w) / ATLAS_W
            vv = 1.0 - (ry + (1.0 - v_raw) * h) / H
        uv += [clean(round(uu, 4)), clean(round(vv, 4))]

    xs = b.positions[0::3]
    zs = b.positions[2::3]
    ex0, ex1, ez0, ez1 = min(xs), max(xs), min(zs), max(zs)
    mesh_out = {"format": FORMAT,
                "positions": b.positions,
                "normals": b.normals,
                "colors": b.colors,
                "uv": uv,
                "pos_index": b.pos_index,
                "nor_index": b.nor_index,
                "col_index": b.col_index,
                "atlas": Path(a.atlas_out).name,
                "unresolved": sorted(set(unresolved)),
                "proc": sorted(PROC_TILES),
                "atlas_h": H,
                "core_rect": [round(-HALF, 3), round(HALF, 3),
                              round(-HALF, 3), round(HALF, 3)],
                "atlas_tiles": {fn: list(rects[fn]) for fn in sorted(rects)}}
    Path(a.mesh_out).parent.mkdir(parents=True, exist_ok=True)
    with open(a.mesh_out, "w") as f:
        json.dump(mesh_out, f, separators=(",", ":"))
        f.write("\n")
    with open(a.solids_out, "w") as f:
        json.dump(b.solids, f, separators=(",", ":"))
        f.write("\n")

    # спавн: свободная точка у площади
    spawn = recommended_spawn(b.solids, cx=PLAZA_C[0], cz=PLAZA_C[1])
    if spawn is None:
        print("SPAWN-CHECK: FAIL свободного места нет", flush=True)
    else:
        with open(a.spawn_out, "w") as f:
            json.dump({"x": spawn[0], "z": spawn[1]},
                      f, separators=(",", ":"))
            f.write("\n")
        print(f"SPAWN-CHECK: OK [{spawn[0]},{spawn[1]}]", flush=True)

    half = max(ex1 - ex0, ez1 - ez0) / 2 + 10
    maxb = max(max(s["hx"], s["hz"]) for s in b.solids)
    print(f"bbox x[{ex0:.1f},{ex1:.1f}] z[{ez0:.1f},{ez1:.1f}] "
          f"half={half:.1f} maxbox={maxb:.1f}", flush=True)
    print(f"houses={len(houses)} tris={len(b.col_index)} "
          f"uverts={len(b.positions) // 3} solids={len(b.solids)}",
          flush=True)
    t2tags: dict = {}
    for s in b.solids:
        t2tags[s.get("tag", "-")] = t2tags.get(s.get("tag", "-"), 0) + 1
    print(f"t2 interior={len(interior_ids) + len(terrace_ids)} "
          f"through={len(through_ids)} doors={t2tags.get('door', 0)} "
          f"balconies={len(balcony_spots)} terraces={len(terrace_ids)} "
          f"steps={t2tags.get('step', 0)} walls={t2tags.get('wall', 0)} "
          f"rails={t2tags.get('rail', 0)} parapets={t2tags.get('parapet', 0)}",
          flush=True)
    print(f"t3 bridges=3 arches=5 tower=1 turrets=2 "
          f"bridge_solids={sum(1 for s in b.solids if s.get('tag') == 'bridge')} "
          f"arch_solids={sum(1 for s in b.solids if s.get('tag') in ('arch', 'archtop'))}",
          flush=True)
    print(f"t4 trees={n_tree} benches={n_bench} lamps={n_lamp} "
          f"trunks={sum(1 for s in b.solids if s.get('tag') == 'trunk')} "
          f"street={STREET_TILE} roofs=slate",
          flush=True)
    print(f"atlas={ATLAS_W}x{H} tiles={len(tiles)} "
          f"atlas_bytes={atlas_bytes} jpeg_q={aq}", flush=True)

    # коридор-чек: BFS по сетке 2м между 4 углами (как в bake)
    S = half - 10
    spawns = [(-S, -S), (S, -S), (-S, S), (S, S)]

    def blocked(px, pz, rad=1.0):
        for s in b.solids:
            if s["h"] < 0.5:
                continue
            if abs(px - s["x"]) <= s["hx"] + rad and \
               abs(pz - s["z"]) <= s["hz"] + rad:
                return True
        return False

    def nearest_free(qx, qz):
        if not blocked(qx, qz):
            return (qx, qz)
        for r in range(2, 40, 2):
            for dx in range(-r, r + 1, 2):
                for dz in (-r, r):
                    if not blocked(qx + dx, qz + dz):
                        return (qx + dx, qz + dz)
            for dz in range(-r + 2, r, 2):
                for dx in (-r, r):
                    if not blocked(qx + dx, qz + dz):
                        return (qx + dx, qz + dz)
        return None

    def bfs(aa, bb):
        from collections import deque
        cell = 2.0
        gx = lambda v: round(v / cell)
        start, goal = (gx(aa[0]), gx(aa[1])), (gx(bb[0]), gx(bb[1]))
        seen = {start}
        q = deque([start])
        dist = {start: 0}
        while q:
            cx, cz = q.popleft()
            if (cx, cz) == goal:
                return dist[(cx, cz)]
            for dx, dz in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, nz = cx + dx, cz + dz
                if (nx, nz) in seen:
                    continue
                if blocked(nx * cell, nz * cell):
                    continue
                seen.add((nx, nz))
                dist[(nx, nz)] = dist[(cx, cz)] + 1
                q.append((nx, nz))
        return None

    free = [nearest_free(qx, qz) for qx, qz in spawns]
    if any(p is None for p in free):
        print("CORRIDOR-CHECK: FAIL spawn inside solid", flush=True)
    else:
        legs = []
        ok = True
        for i in range(len(free) - 1):
            d = bfs(free[i], free[i + 1])
            legs.append(-1 if d is None else d)
            if d is None:
                ok = False
        print(f"CORRIDOR-CHECK: {'OK' if ok else 'FAIL'} legs={legs}",
              flush=True)


if __name__ == "__main__":
    main()
