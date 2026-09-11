#!/usr/bin/env python3
"""Bake Szeged DAE (SketchUp, Z_UP, inches) -> textured mesh + atlas + solids.

Reads tools/szeged-src/model.dae + tools/szeged-src/textures/model/*, writes:
  src/assets/szeged.mesh.json   indexed mesh, meters, Y_UP, center at 0:
    {format:"szeged-mesh-3", positions, normals, colors, uv,
     pos_index, nor_index, col_index, atlas, unresolved}
    positions/normals/colors are flat triples (unique entries only);
    pos_index/nor_index address one VERTEX each (per corner, len=tris*3);
    col_index addresses one color (per triangle, len=tris) — color is
    constant across a triangle's 3 corners, so per-tri storage suffices.
    uv is a flat pair array, ONE PAIR PER CORNER (len=tris*3*2), already in
    atlas coordinates honoring three.js flipY (uv (0,0) = bottom-left):
      u=(x+u_dae*w)/W, v=1-(y+v_dae*h)/H   (u_dae/v_dae fract()'d).
    Consumer expands corner c of triangle t as:
      P=positions[3*pos_index[c]], N=normals[3*nor_index[c]],
      C=colors[3*col_index[t]], UV=uv[2*c:2*c+2].
  src/assets/szeged-atlas.jpg   2048-wide shelf-packed atlas (tiles<=256px,
    JPEG q~82, budget <=1.5MB; tiles shrink-wrapped with 4px padding).
  src/assets/szeged.solids.json [{x,z,hx,hz,h}] (meters)
  tools/szeged-spawn.json {x,z} — RECOMMENDED_SPAWN (см. ниже).

РЕШЕНИЕ ПО ПАЛИТРЕ (зафиксировано): col_index/palette ОСТАВЛЕНЫ как tint —
mesh-3 = mesh-2 + uv + atlas. Diffuse-цвет материала всегда пишется в colors
и умножается поверх атласа (движок: vertexColors=true, material.color=white).
Белый severe-fallback убран: нетекстурированные треугольники смотрят в белую
8x8-плашку атласа (uv в её центр), а tint несёт их diffuse-цвет; текстуры,
чьи файлы не нашлись на диске, тоже идут в белую плашку и попадают в список
unresolved (их diffuse-tint при этом сохраняется).

Pipeline: parse <triangles> (per-<input> offsets honored, TEXCOORD first set
used, UV fract()'d for tiling) -> material: diffuse tint + texture file via
effect sampler->surface->image chain -> inches->meters (*0.0254),
Z_UP->Y_UP (x,y,z)->(x,z,-y) [--flip-z gives (x,z,y)] ->
drop meshes whose center is further than 3 sigma from median of centers ->
downscale so bbox <=120m on bigger XZ side, bbox center XZ at (0,0) ->
vertex dedup (positions round(3), normals round(2), colors round(3)) ->
atlas shelf-pack (PIL, tiles max side 256, LANCZOS) -> uv in atlas coords ->
per-mesh AABBs -> drop near-flat large slabs (h<1м, area>25м²: земля) ->
voxel merge on 2m grid -> drop boxes h<0.3, area<0.09 -> split hx,hz<=12м.

--true-scale: вместо 3-сигма фильтра — кроп по плотному ядру
(CORE_X0..X1, CORE_Y0..Y1 в метрах SketchUp-плоскости) и ЧЕСТНЫЙ масштаб:
дюймы->метры x0.0254 без ужимания; ужать (равномерно, включая Y) только если
ядро больше TRUE_MAX_SIDE=350м на большей стороне XZ.

Исходники текстур (tools/szeged-src/textures/) в git НЕ коммитятся
(.gitignore: szeged-src/); коммитятся только bake-скрипт, атлас, меш,
движок и тесты.

Needs PIL (atlas packing).
"""
import argparse
import json
import math
import os
import statistics
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image

C = "{http://www.collada.org/2005/11/COLLADASchema}"
FORMAT = "szeged-mesh-3"
INCH = 0.0254
MAX_SIDE = 120.0
TRUE_MAX_SIDE = 350.0
# Плотное ядро карты в метрах SketchUp-плоскости (x, глубина y):
# окно 350x350 с макс. плотностью мешей (сетка 50м + скользящее окно 350м,
# шаг 10м): x[100,450], y[-900,-550] — 547/1902 мешей, ~13.8k/53.7k tris.
# В мировых координатах bake: world x = x, world z = -y (flip по умолчанию).
CORE_X0, CORE_X1 = 100.0, 450.0
CORE_Y0, CORE_Y1 = -900.0, -550.0
CELL = 2.0
WHITE = (1.0, 1.0, 1.0)

ATLAS_W = 2048
TILE_MAX = 256
TILE_PAD = 4
ATLAS_Q = 82
ATLAS_BUDGET = int(1.5 * 1024 * 1024)
WHITE_TILE = 8


def floats(text):
    return [float(v) for v in text.split()]


def effect_style(root, effect_id):
    """(diffuse rgb, texture sampler sid|None) of an effect.

    Diffuse color is ALWAYS returned (white default) — it becomes the tint
    multiplied over the atlas. Textured effects additionally carry the
    sampler sid from <texture>; untextured ones carry None (-> white tile).
    """
    for e in root.iter(C + "effect"):
        if e.get("id") != effect_id:
            continue
        rgb = WHITE
        d = e.find(".//" + C + "diffuse")
        if d is not None:
            col = d.find(C + "color")
            if col is not None and col.text:
                r, g, b = floats(col.text)[:3]
                rgb = (r, g, b)
        tex = e.find(".//" + C + "texture")
        samp = tex.get("texture") if tex is not None else None
        return (rgb, samp)
    return (WHITE, None)


def clean(v):
    """round() may yield -0.0; normalize it to 0.0 for compact output."""
    return 0.0 if v == 0 else v


def fract(v):
    return v - math.floor(v)


def recommended_spawn(solids, rad=2.0, bound=183.0, step=1.0):
    """Ближайшая к (0,0) точка, свободная кругом rad от солидов.

    Дистанция — круг против AABB как engine solidHit (все солиды без скидок
    по h: baked solids все h>=0.3 и движок колизит их на y=0). Кандидаты —
    сетка step внутри ±bound, сортировка по (dist², x, z) детерминирована;
    первый свободный и есть ближайший. None — свободного места нет вообще.
    """
    r2 = rad * rad
    boxes = [(s["x"] - s["hx"], s["x"] + s["hx"],
              s["z"] - s["hz"], s["z"] + s["hz"]) for s in solids]

    def free(x, z):
        for (x0, x1, z0, z1) in boxes:
            cx = x0 if x < x0 else (x1 if x > x1 else x)
            cz = z0 if z < z0 else (z1 if z > z1 else z)
            dx, dz = x - cx, z - cz
            if dx * dx + dz * dz < r2:
                return False
        return True

    n = int(bound / step)
    cand = []
    for ix in range(-n, n + 1):
        for iz in range(-n, n + 1):
            x, z = ix * step, iz * step
            cand.append((x * x + z * z, x, z))
    cand.sort()
    for _, x, z in cand:
        if free(x, z):
            return (clean(round(x, 3)), clean(round(z, 3)))
    return None


def main():
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--flip-z", action="store_true",
                    help="map (x,y,z)->(x,z,y) instead of (x,z,-y)")
    ap.add_argument("--true-scale", action="store_true",
                    help="crop to dense core + honest inch->meter scale, "
                    "shrink only if core exceeds 350m")
    ap.add_argument("--src", default=str(here / "szeged-src" / "model.dae"))
    ap.add_argument("--tex-dir",
                    default=str(here / "szeged-src" / "textures" / "model"))
    ap.add_argument("--mesh-out",
                    default=str(here.parent / "src" / "assets" / "szeged.mesh.json"))
    ap.add_argument("--atlas-out",
                    default=str(here.parent / "src" / "assets" / "szeged-atlas.jpg"))
    ap.add_argument("--solids-out",
                    default=str(here.parent / "src" / "assets" / "szeged.solids.json"))
    a = ap.parse_args()
    flip = -1.0 if not a.flip_z else 1.0

    tree = ET.parse(a.src)
    root = tree.getroot()

    # image id -> texture filename (model/material_*.jpg)
    image_file = {}
    for im in root.iter(C + "image"):
        f = im.find(C + "init_from")
        if f is not None and f.text:
            image_file[im.get("id")] = f.text.strip()

    # profile_COMMON newparams: surface sid -> image id; sampler sid -> surface sid
    surf_img = {}
    samp_surf = {}
    for p in root.iter(C + "profile_COMMON"):
        for n in p.findall(C + "newparam"):
            sid = n.get("sid")
            s = n.find(C + "surface")
            if s is not None:
                f = s.find(C + "init_from")
                if f is not None and f.text:
                    surf_img[sid] = f.text.strip()
            s2 = n.find(C + "sampler2D")
            if s2 is not None:
                src = s2.find(C + "source")
                if src is not None and src.text:
                    samp_surf[sid] = src.text.strip()

    # material id -> (diffuse rgb, texture basename|None)
    mat_style = {}
    for m in root.iter(C + "material"):
        ie = m.find(C + "instance_effect")
        if ie is None:
            mat_style[m.get("id")] = (WHITE, None)
        else:
            rgb, samp = effect_style(root, ie.get("url", "").lstrip("#"))
            fn = None
            if samp is not None:
                surf = samp_surf.get(samp, samp)
                img_id = surf_img.get(surf, surf)
                init = image_file.get(img_id)
                if init is not None:
                    fn = init.split("/")[-1]
            mat_style[m.get("id")] = (rgb, fn)

    # geometry id -> {symbol: (rgb, basename|None, material id)}
    geom_sym = {}
    for ig in root.iter(C + "instance_geometry"):
        gid = ig.get("url", "").lstrip("#")
        slot = geom_sym.setdefault(gid, {})
        for im in ig.iter(C + "instance_material"):
            sym = im.get("symbol")
            if sym in slot:
                continue
            mid = im.get("target", "").lstrip("#")
            rgb, fn = mat_style.get(mid, (WHITE, None))
            slot[sym] = (rgb, fn, mid)

    geoms = {}
    for g in root.iter(C + "geometry"):
        mesh = g.find(C + "mesh")
        if mesh is None:
            continue
        srcs = {}
        for s in mesh.findall(C + "source"):
            fa = s.find(C + "float_array")
            if fa is not None and fa.text:
                srcs["#" + s.get("id")] = floats(fa.text)
        verts = mesh.find(C + "vertices")
        if verts is None:
            continue
        # <vertices> maps its own inputs (usually POSITION [+NORMAL]):
        # vertex index -> array index per semantic
        vert_inputs = {}
        for i in verts.findall(C + "input"):
            arr = srcs.get(i.get("source"))
            if arr is not None:
                vert_inputs[i.get("semantic")] = arr
        if "POSITION" not in vert_inputs:
            continue
        pos_src = vert_inputs["POSITION"]
        vert_nor = vert_inputs.get("NORMAL")  # may be absent
        sym = geom_sym.get(g.get("id"), {})
        tris = []
        for t in mesh.findall(C + "triangles"):
            # per-input offsets: each <input> has its own offset into the
            # interleaved p-stream; stride = max offset + 1. Never assume
            # VERTEX is first or that inputs follow any fixed order.
            offs = {}
            for i in t.findall(C + "input"):
                offs[i.get("semantic")] = (
                    int(i.get("offset", "0")), i.get("source"))
            if "VERTEX" not in offs:
                continue
            stride = max(o for o, _ in offs.values()) + 1
            v_off = offs["VERTEX"][0]
            n_off, n_src = offs.get("NORMAL", (None, None))
            tri_nor = srcs.get(n_src) if n_src else None
            # first TEXCOORD set wins (SketchUp writes one)
            t_off, tri_tex = None, None
            if "TEXCOORD" in offs:
                t_off = offs["TEXCOORD"][0]
                tri_tex = srcs.get(offs["TEXCOORD"][1])
            p = t.find(C + "p")
            if p is None or not p.text:
                continue
            idx = [int(v) for v in p.text.split()]
            rgb, fn, mid = sym.get(t.get("material"), (WHITE, None, t.get("material")))
            tris.append((stride, v_off, n_off, tri_nor, t_off, tri_tex,
                         idx, rgb, fn, mid))
        if tris:
            geoms[g.get("id")] = (pos_src, vert_nor, tris)

    def rot(px, py, pz):
        return (px * INCH, pz * INCH, flip * py * INCH)

    def rotn(nx, ny, nz):
        return (nx, nz, flip * ny)

    # per-mesh transformed tris + aabb + center
    meshes = []  # (tris_xyz_list, aabb, center)
    # tri entry: (corners, color, texfile|None, uvraws[(u,v)|None x3])
    for gid, (pos, vnor, tblocks) in geoms.items():
        tris = []  # [([(x,y,z,nx,ny,nz) x3], color, texfile, [(u,v)|None x3])]
        for stride, v_off, n_off, tri_nor, t_off, tri_tex, idx, color, fn, mid in tblocks:
            for k in range(0, len(idx), stride * 3):
                corners = []
                uvraws = []
                for c in range(3):
                    base = k + c * stride
                    vi = idx[base + v_off]
                    x, y, z = rot(pos[vi * 3], pos[vi * 3 + 1],
                                  pos[vi * 3 + 2])
                    if tri_nor is not None:
                        ni = idx[base + n_off]
                        nx, ny, nz = rotn(tri_nor[ni * 3],
                                         tri_nor[ni * 3 + 1],
                                         tri_nor[ni * 3 + 2])
                    elif vnor is not None:
                        nx, ny, nz = rotn(vnor[vi * 3], vnor[vi * 3 + 1],
                                         vnor[vi * 3 + 2])
                    else:
                        nx = ny = nz = None  # -> face normal below
                    corners.append([x, y, z, nx, ny, nz])
                    if fn is not None and t_off is not None and tri_tex is not None:
                        ti = idx[base + t_off]
                        uvraws.append((fract(tri_tex[ti * 2]),
                                       fract(tri_tex[ti * 2 + 1])))
                    else:
                        uvraws.append(None)
                if any(c[3] is None for c in corners):
                    ax, ay, az = corners[0][:3]
                    bx, by, bz = corners[1][:3]
                    cx_, cy, cz = corners[2][:3]
                    ux, uy, uz = bx - ax, by - ay, bz - az
                    vx, vy, vz = cx_ - ax, cy - ay, cz - az
                    nx = uy * vz - uz * vy
                    ny = uz * vx - ux * vz
                    nz = ux * vy - uy * vx
                    ln = math.sqrt(nx * nx + ny * ny + nz * nz)
                    if ln > 0:
                        nx, ny, nz = nx / ln, ny / ln, nz / ln
                    else:
                        nx, ny, nz = 0.0, 1.0, 0.0
                    for c in corners:
                        c[3], c[4], c[5] = nx, ny, nz
                tris.append((corners, color, fn, uvraws))
        if not tris:
            continue
        xs = [c[0] for t, _, _, _ in tris for c in t]
        ys = [c[1] for t, _, _, _ in tris for c in t]
        zs = [c[2] for t, _, _, _ in tris for c in t]
        aabb = (min(xs), max(xs), min(ys), max(ys), min(zs), max(zs))
        cx = (aabb[0] + aabb[1]) / 2
        cy = (aabb[2] + aabb[3]) / 2
        cz = (aabb[4] + aabb[5]) / 2
        meshes.append([tris, aabb, (cx, cy, cz)])

    n_raw_meshes = len(meshes)
    n_raw_tris = sum(len(m[0]) for m in meshes)

    if a.true_scale:
        # кроп по ядру: центр меша (мировые метры; x=x_su, z=-y_su при
        # flip по умолчанию) должен лежать внутри ядра
        if a.flip_z:
            wz0, wz1 = CORE_Y0, CORE_Y1
        else:
            wz0, wz1 = -CORE_Y1, -CORE_Y0
        kept = [m for m in meshes
                if CORE_X0 <= m[2][0] <= CORE_X1
                and wz0 <= m[2][2] <= wz1]
        n_dropped = len(meshes) - len(kept)
        meshes = kept
        if not meshes:
            sys.exit("true-scale: ядро пусто, нечего печь")
    else:
        # outlier meshes: center further than 3 sigma from median of centers
        centers = [m[2] for m in meshes]
        med = [statistics.median([c[i] for c in centers]) for i in range(3)]
        dists = [math.dist(c, med) for c in centers]
        mdist = statistics.median(dists)
        sigma = statistics.pstdev(dists) if len(dists) > 1 else 0.0
        kept = [m for m, d in zip(meshes, dists) if d <= mdist + 3 * sigma]
        n_dropped = len(meshes) - len(kept)
        meshes = kept

    # global bbox, downscale to <=120m on bigger XZ side, center XZ at origin
    gx0 = min(m[1][0] for m in meshes); gx1 = max(m[1][1] for m in meshes)
    gz0 = min(m[1][4] for m in meshes); gz1 = max(m[1][5] for m in meshes)
    sx, sz = gx1 - gx0, gz1 - gz0
    if a.true_scale:
        # честный масштаб: ужать только если ядро больше 350м
        scale = min(1.0, TRUE_MAX_SIDE / max(sx, sz))
    else:
        scale = min(1.0, MAX_SIDE / max(sx, sz))
    cx, cz = (gx0 + gx1) / 2, (gz0 + gz1) / 2

    # global dedup: positions round(3), normals round(2), colors round(3)
    pos_map, nor_map, col_map = {}, {}, {}
    positions, normals, colors = [], [], []
    pos_index, nor_index, col_index = [], [], []
    corner_tex = []  # per corner: (texfile|None, u_raw, v_raw)
    used_files = set()
    missing_files = set()
    no_uv_tris = 0
    aabbs = []
    for tris, aabb, _ in meshes:
        npx = []
        for corners, color, fn, uvraws in tris:
            cr, cg, cb = (clean(round(v, 3)) for v in color)
            ckey = (cr, cg, cb)
            ci = col_map.get(ckey)
            if ci is None:
                ci = len(colors) // 3
                col_map[ckey] = ci
                colors += [cr, cg, cb]
            col_index.append(ci)
            for (x, y, z, nx, ny, nz), uvraw in zip(corners, uvraws):
                X = clean(round((x - cx) * scale, 3))
                Y = clean(round(y * scale, 3))
                Z = clean(round((z - cz) * scale, 3))
                pkey = (X, Y, Z)
                pi = pos_map.get(pkey)
                if pi is None:
                    pi = len(positions) // 3
                    pos_map[pkey] = pi
                    positions += [X, Y, Z]
                NX = clean(round(nx, 2))
                NY = clean(round(ny, 2))
                NZ = clean(round(nz, 2))
                nkey = (NX, NY, NZ)
                ni = nor_map.get(nkey)
                if ni is None:
                    ni = len(normals) // 3
                    nor_map[nkey] = ni
                    normals += [NX, NY, NZ]
                pos_index.append(pi)
                nor_index.append(ni)
                npx.append((X, Y, Z))
                if fn is not None and uvraw is not None:
                    p = Path(a.tex_dir) / fn
                    if p.is_file():
                        used_files.add(fn)
                        corner_tex.append((fn, uvraw[0], uvraw[1]))
                    else:
                        missing_files.add(fn)
                        corner_tex.append((None, 0.0, 0.0))
                else:
                    if fn is not None:
                        no_uv_tris += 1
                    corner_tex.append((None, 0.0, 0.0))
        xs = [p[0] for p in npx]; ys = [p[1] for p in npx]
        zs = [p[2] for p in npx]
        aabbs.append((min(xs), max(xs), min(ys), max(ys),
                      min(zs), max(zs)))

    # ---- atlas: tiles <=256px, shelf pack into ATLAS_W-wide strip ----
    tiles = {}  # fn -> PIL image (RGB, thumbnailed)
    for fn in sorted(used_files):
        try:
            im = Image.open(Path(a.tex_dir) / fn).convert("RGB")
            im.load()
        except Exception as e:
            print(f"atlas: skip {fn}: {e}", flush=True)
            missing_files.add(fn)
            continue
        im.thumbnail((TILE_MAX, TILE_MAX), Image.Resampling.LANCZOS)
        tiles[fn] = im
    # drop corners whose tile failed to load -> white
    if missing_files:
        corner_tex = [(None if t in missing_files else t, u, v)
                      for (t, u, v) in corner_tex]
        for fn in list(missing_files):
            tiles.pop(fn, None)
    rects = {}  # fn -> (x, y, w, h) in PIL coords
    # white tile first at (0,0)
    rects["@white"] = (0, 0, WHITE_TILE, WHITE_TILE)
    sx0 = WHITE_TILE + TILE_PAD
    y = 0
    row_h = WHITE_TILE
    x = sx0
    for fn in sorted(tiles, key=lambda f: (-tiles[f].height, -tiles[f].width, f)):
        w, h = tiles[fn].size
        if x + w > ATLAS_W:
            y += row_h + TILE_PAD
            x = 0
            row_h = 0
        rects[fn] = (x, y, w, h)
        x += w + TILE_PAD
        row_h = max(row_h, h)
    H = y + row_h
    atlas = Image.new("RGB", (ATLAS_W, H), (0, 0, 0))
    wx, wy, ww, wh = rects["@white"]
    white = Image.new("RGB", (ww, wh), (255, 255, 255))
    atlas.paste(white, (wx, wy))
    for fn, im in tiles.items():
        rx, ry, w, h = rects[fn]
        atlas.paste(im, (rx, ry))
    Path(a.atlas_out).parent.mkdir(parents=True, exist_ok=True)
    aq = ATLAS_Q
    while True:
        atlas.save(a.atlas_out, "JPEG", quality=aq, optimize=True)
        if os.path.getsize(a.atlas_out) <= ATLAS_BUDGET or aq <= 60:
            break
        aq -= 4
    atlas_bytes = os.path.getsize(a.atlas_out)

    # ---- uv per corner in atlas coords (three.js flipY convention) ----
    wcx, wcy = wx + ww / 2, wy + wh / 2
    white_uv = ((wcx) / ATLAS_W, 1.0 - (wcy) / H)
    uv = []
    for (t, u_raw, v_raw) in corner_tex:
        if t is None:
            uu, vv = white_uv
        else:
            rx, ry, w, h = rects[t]
            uu = (rx + u_raw * w) / ATLAS_W
            vv = 1.0 - (ry + v_raw * h) / H
        uv += [clean(round(uu, 4)), clean(round(vv, 4))]

    fx0 = min(a[0] for a in aabbs); fx1 = max(a[1] for a in aabbs)
    fz0 = min(a[4] for a in aabbs); fz1 = max(a[5] for a in aabbs)
    W, D = fx1 - fx0, fz1 - fz0

    # solids: per-mesh AABB -> 2m voxel grid (cell: bottom=min, top=max),
    # greedy rect merge of equal (bottom, top) cells, drop h<0.3 / area<0.09.
    # Плоская земля в солиды не идёт: почти-плоский (h<1м) меш большой
    # площади (>25м²) — это плита/земля, ходить можно и так (groundAt=0).
    # Без этого воксели плит с одинаковым (bottom,top) сливаются в боксы
    # 56x64м и замуровывают улицы. Плюс кап бокса: hx,hz<=12м с нарезкой.
    FLAT_H = 1.0
    FLAT_AREA = 25.0
    BOX_CAP = 12.0
    n_flat_skipped = 0

    def split_box(b):
        x0, x1 = b["x"] - b["hx"], b["x"] + b["hx"]
        z0, z1 = b["z"] - b["hz"], b["z"] + b["hz"]
        nx = max(1, math.ceil((x1 - x0) / (2 * BOX_CAP)))
        nz = max(1, math.ceil((z1 - z0) / (2 * BOX_CAP)))
        if nx == 1 and nz == 1:
            return [b]
        out = []
        for ix in range(nx):
            for iz in range(nz):
                sx0 = x0 + (x1 - x0) * ix / nx
                sx1 = x0 + (x1 - x0) * (ix + 1) / nx
                sz0 = z0 + (z1 - z0) * iz / nz
                sz1 = z0 + (z1 - z0) * (iz + 1) / nz
                out.append({"x": (sx0 + sx1) / 2, "z": (sz0 + sz1) / 2,
                            "hx": (sx1 - sx0) / 2, "hz": (sz1 - sz0) / 2,
                            "h": b["h"]})
        return out

    def voxel_merge(aabbs, quant):
        nonlocal n_flat_skipped
        cells = {}
        for (x0, x1, y0, y1, z0, z1) in aabbs:
            if (y1 - y0) < FLAT_H and (x1 - x0) * (z1 - z0) > FLAT_AREA:
                n_flat_skipped += 1
                continue
            if x1 <= x0 or z1 <= z0 or y1 <= y0:
                continue
            b = math.floor(y0 / quant) * quant
            t = math.floor(y1 / quant) * quant
            for gx in range(math.floor(x0 / CELL), math.floor(x1 / CELL) + 1):
                for gz in range(math.floor(z0 / CELL), math.floor(z1 / CELL) + 1):
                    key = (gx, gz)
                    if key in cells:
                        cb, ct = cells[key]
                        cells[key] = (min(cb, b), max(ct, t))
                    else:
                        cells[key] = (b, t)
        boxes = []
        while cells:
            start = min(cells)
            key_ht = cells[start]
            ax0, az0 = start
            ax1 = ax0
            while (ax1 + 1, az0) in cells and cells[(ax1 + 1, az0)] == key_ht:
                ax1 += 1
            az1 = az0
            while True:
                row = [(gx, az1 + 1) for gx in range(ax0, ax1 + 1)]
                if all(c in cells and cells[c] == key_ht for c in row):
                    az1 += 1
                else:
                    break
            for gx in range(ax0, ax1 + 1):
                for gz in range(az0, az1 + 1):
                    del cells[(gx, gz)]
            b, t = key_ht
            h = t - b
            if h < 0.3:
                continue
            x0, x1 = ax0 * CELL, (ax1 + 1) * CELL
            z0, z1 = az0 * CELL, (az1 + 1) * CELL
            if (x1 - x0) * (z1 - z0) < 0.09:
                continue
            boxes.append({"x": (x0 + x1) / 2, "z": (z0 + z1) / 2,
                          "hx": (x1 - x0) / 2, "hz": (z1 - z0) / 2, "h": h})
        return boxes

    solids = []
    budget = 2000 if a.true_scale else 1500
    for quant in (0.0, 0.5, 1.0, 2.0):
        q = quant if quant > 0 else 1e-9
        n_flat_skipped = 0
        raw = voxel_merge(aabbs, q)
        # кап бокса: нарезка гигантов на плитки hx,hz<=12м (до проверки бюджета)
        capped = []
        n_split = 0
        for b in raw:
            parts = split_box(b)
            if len(parts) > 1:
                n_split += 1
            capped.extend(parts)
        solids = capped
        if len(solids) <= budget:
            break

    r3 = lambda v: clean(round(v, 3))
    mesh_out = {"format": FORMAT,
                "positions": positions,
                "normals": normals,
                "colors": colors,
                "uv": uv,
                "pos_index": pos_index,
                "nor_index": nor_index,
                "col_index": col_index,
                "atlas": Path(a.atlas_out).name,
                "unresolved": sorted(missing_files)}
    solids_out = [{k: r3(s[k]) for k in ("x", "z", "hx", "hz", "h")}
                  for s in solids]

    Path(a.mesh_out).parent.mkdir(parents=True, exist_ok=True)
    with open(a.mesh_out, "w") as f:
        json.dump(mesh_out, f, separators=(",", ":"))
        f.write("\n")
    with open(a.solids_out, "w") as f:
        json.dump(solids_out, f, separators=(",", ":"))
        f.write("\n")

    # RECOMMENDED_SPAWN: ближайшая к (0,0) свободная кругом r=2м точка.
    # bound = half арены - 2м от края (half как в engine buildSzeged).
    spawn = recommended_spawn(solids, bound=max(W, D) / 2 + 10 - 2)
    if spawn is None:
        print("SPAWN-CHECK: FAIL свободного места нет", flush=True)
    else:
        with open(here / "szeged-spawn.json", "w") as f:
            json.dump({"x": spawn[0], "z": spawn[1]},
                      f, separators=(",", ":"))
            f.write("\n")
        print(f"SPAWN-CHECK: OK [{spawn[0]},{spawn[1]}]", flush=True)
    mbytes = os.path.getsize(a.mesh_out)
    sbytes = os.path.getsize(a.solids_out)
    print(f"meshes={len(meshes)}(+{n_dropped} outliers of {n_raw_meshes}) "
          f"raw_tris={n_raw_tris} uverts={len(positions) // 3} "
          f"unormals={len(normals) // 3} ucolors={len(colors) // 3} "
          f"tris={len(col_index)} solids={len(solids)} "
          f"flat_skipped={n_flat_skipped} split={n_split} quant={q} "
          f"size={W:.1f}x{D:.1f} scale={scale:.4f} "
          f"mesh={mbytes / 1048576:.2f}MB solids={sbytes // 1024}KB",
          flush=True)
    print(f"atlas={ATLAS_W}x{H} tiles={len(tiles)} "
          f"atlas_bytes={atlas_bytes} jpeg_q={aq} "
          f"tex_resolved={len(tiles)}/{len(image_file)} "
          f"missing={sorted(missing_files) or '-'} "
          f"no_uv_tris={no_uv_tris}",
          flush=True)
    # коридор-чек: BFS по сетке 2м от спавна к спавну (углы ядра, как в
    # engine buildSzeged). Путь обязан существовать, иначе улицы замурованы.
    xs = positions[0::3]
    zs = positions[2::3]
    ex0, ex1, ez0, ez1 = min(xs), max(xs), min(zs), max(zs)
    half = max(ex1 - ex0, ez1 - ez0) / 2 + 10
    S = half - 10
    spawns = [(-S, -S), (S, -S), (-S, S), (S, S)]
    maxb = max(max(s["hx"], s["hz"]) for s in solids) if solids else 0.0
    print(f"half={half:.1f} S={S:.1f} maxbox={maxb:.1f}", flush=True)

    def blocked(px, pz, rad=1.0):
        for s in solids:
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

    def bfs(a, b):
        # сетка 2м, 4-связность; координаты клеток -> мировые
        from collections import deque
        cell = 2.0
        gx = lambda v: round(v / cell)
        start, goal = (gx(a[0]), gx(a[1])), (gx(b[0]), gx(b[1]))
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
            d = bfs(free[i], free[i + 1])  # type: ignore[arg-type]
            legs.append(-1 if d is None else d)
            if d is None:
                ok = False
        print(f"CORRIDOR-CHECK: {'OK' if ok else 'FAIL'} legs={legs}", flush=True)


if __name__ == "__main__":
    sys.exit(main())
