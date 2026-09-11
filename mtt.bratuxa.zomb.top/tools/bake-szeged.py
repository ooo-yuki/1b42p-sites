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
      u=(x+u_dae*w)/W, v=1-(y+(1-v_dae)*h)/H   (u_dae/v_dae fract()'d).
    V-invert inside the tile ((1-v_dae)) because SketchUp writes TEXCOORD
    in GL convention (v=0 = BOTTOM of the image) while PIL tiles are stored
    top-down (row 0 = TOP of the image): v_dae=0 must sample the BOTTOM row
    of the tile. White @white fallback (no texture) untouched.
    Consumer expands corner c of triangle t as:
      P=positions[3*pos_index[c]], N=normals[3*nor_index[c]],
      C=colors[3*col_index[t]], UV=uv[2*c:2*c+2].
  src/assets/szeged-atlas.jpg   2048-wide shelf-packed atlas (tiles<=512px,
    JPEG q~82 (прижать до 40 при переполнении 1.5MB), shrink-wrapped with
    16px padding + 2px edge-extend против mip-кровотечения).
  src/assets/szeged.solids.json [{x,z,hx,hz,h}] (meters)
  tools/szeged-spawn.json {x,z} — RECOMMENDED_SPAWN (см. ниже).

РЕШЕНИЕ ПО ПАЛИТРЕ (зафиксировано): col_index/palette ОСТАВЛЕНЫ как tint —
mesh-3 = mesh-2 + uv + atlas. Diffuse-цвет материала всегда пишется в colors
и умножается поверх атласа (движок: vertexColors=true, material.color=white).
Белой плашки почти нет: нетекстурированные треугольники получают planar
box-mapping (проекция по доминантной оси нормали, 1 тайл/4м) в процедурные
плитки (roof/plaster_warm/plaster_cool/asphalt, seed 42) по нормали/высоте/
тинту; отсутствующие файлы material_1..4 (кровля) — в процедурный roof.
Белая 8x8-плашка — только аварии загрузки.

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
import random
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
TILE_MAX = 512
TILE_PAD = 16
EDGE_EXT = 2
ATLAS_Q = 82
ATLAS_Q_MIN = 40
ATLAS_BUDGET = int(1.5 * 1024 * 1024)
WHITE_TILE = 8


def floats(text):
    return [float(v) for v in text.split()]


def effect_style(effect_el, image_file):
    """(diffuse rgb, texture basename|None) of one <effect> element.

    Diffuse color is ALWAYS returned (white default) — it becomes the tint
    multiplied over the atlas. Textured effects additionally carry the
    resolved texture basename; untextured ones carry None (-> white tile).

    sampler->surface->image chain is resolved LOCALLY: sids are looked up
    only among this effect's own profile_COMMON newparams (COLLADA sid
    scope is the effect). Global sid tables are wrong: SketchUp reuses
    identical sids across effects, so a global dict lets the last writer
    rebind everyone's materials to чужое фото. newparam без sid
    игнорируется честно — на него нельзя сослаться из <texture>.
    """
    rgb = WHITE
    d = effect_el.find(".//" + C + "diffuse")
    if d is not None:
        col = d.find(C + "color")
        if col is not None and col.text:
            r, g, b = floats(col.text)[:3]
            rgb = (r, g, b)
    tex = effect_el.find(".//" + C + "texture")
    samp = tex.get("texture") if tex is not None else None
    fn = None
    if samp is not None:
        surf_img = {}
        samp_surf = {}
        for p in effect_el.findall(C + "profile_COMMON"):
            for n in p.findall(C + "newparam"):
                sid = n.get("sid")
                if sid is None:
                    continue
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
        surf = samp_surf.get(samp, samp)
        img_id = surf_img.get(surf, surf)
        init = image_file.get(img_id)
        if init is not None:
            fn = init.split("/")[-1]
    return (rgb, fn)


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

    # material id -> (diffuse rgb, texture basename|None).
    # Цепочка texture->sampler->surface->image резолвится ЛОКАЛЬНО внутри
    # каждого <effect> (см. effect_style): никаких глобальных surf_img /
    # samp_surf — sid'ы SketchUp повторяются между эффектами.
    mat_style = {}
    effects = {}
    for e in root.iter(C + "effect"):
        effects[e.get("id")] = e
    for m in root.iter(C + "material"):
        ie = m.find(C + "instance_effect")
        if ie is None:
            mat_style[m.get("id")] = (WHITE, None)
        else:
            el = effects.get(ie.get("url", "").lstrip("#"))
            if el is None:
                mat_style[m.get("id")] = (WHITE, None)
            else:
                mat_style[m.get("id")] = effect_style(el, image_file)

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
    fn_tris = {}  # texfile -> triangle count (для fallback-ранжирования)
    fn_rgb = {}  # texfile -> first seen diffuse rgb
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
                if fn is not None:
                    fn_tris[fn] = fn_tris.get(fn, 0) + 1
                    if fn not in fn_rgb:
                        fn_rgb[fn] = color
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
        # flip по умолчанию) должен лежать внутри ядра; ИСКЛЮЧЕНИЕ — плоская
        # земля (h<1м, площадь>25м² — те же FLAT-пороги, что flat-skip для
        # солидов): её включаем по ПЕРЕСЕЧЕНИЮ bbox с ядром, иначе плиты,
        # частично накрывающие ядро, выкидываются и в земле дыры (сквозь
        # них скайбокс). Из солидов такие меши по-прежнему исключаются
        # (flat-skip ниже живёт).
        if a.flip_z:
            wz0, wz1 = CORE_Y0, CORE_Y1
        else:
            wz0, wz1 = -CORE_Y1, -CORE_Y0

        def in_core(m):
            cx, _, cz = m[2]
            if CORE_X0 <= cx <= CORE_X1 and wz0 <= cz <= wz1:
                return True
            x0, x1, y0, y1, z0, z1 = m[1]
            flat = (y1 - y0) < 1.0 and (x1 - x0) * (z1 - z0) > 25.0
            return flat and x0 <= CORE_X1 and x1 >= CORE_X0 \
                and z0 <= wz1 and z1 >= wz0

        kept = [m for m in meshes if in_core(m)]
        n_flat_kept = sum(1 for m in kept
                          if not (CORE_X0 <= m[2][0] <= CORE_X1
                                  and wz0 <= m[2][2] <= wz1))
        n_dropped = len(meshes) - len(kept)
        meshes = kept
        if not meshes:
            sys.exit("true-scale: ядро пусто, нечего печь")
        # Плоские плиты-«апроны» тянутся на сотни метров за ядро: включаем их
        # целиком — и честный масштаб схлопывается (ядро 350м тонет в 935м
        # бокса). Поэтому треугольники плоских мешей с центром ВНЕ ядра
        # подрезаем по окну ядра (Sutherland–Hodgman в XZ, атрибуты — lerp
        # по ребру): покрытие ядра полное, бокс остаётся ядерным.
        n_clipped_tris = 0
        clipped = []
        for tris, aabb, center in meshes:
            cx, _, cz = center
            if CORE_X0 <= cx <= CORE_X1 and wz0 <= cz <= wz1:
                clipped.append([tris, aabb, center])
                continue
            x0, x1, y0, y1, z0, z1 = aabb
            if not ((y1 - y0) < 1.0 and (x1 - x0) * (z1 - z0) > 25.0):
                clipped.append([tris, aabb, center])
                continue
            RX = (CORE_X0, CORE_X1)
            RZ = (wz0, wz1)
            new_tris = []
            for corners, color, fn, uvraws in tris:
                # вершина: [x,y,z,nx,ny,nz] + uvraw; полигон в XZ
                poly = [([c[0], c[1], c[2], c[3], c[4], c[5]],
                         list(u) if u is not None else None)
                        for c, u in zip(corners, uvraws)]

                def clip_edge(poly, axis, bound, keep_le):
                    out = []
                    for (p1, u1), (p2, u2) in zip(poly, poly[1:] + poly[:1]):
                        v1, v2 = p1[axis], p2[axis]
                        i1 = (v1 <= bound) if keep_le else (v1 >= bound)
                        i2 = (v2 <= bound) if keep_le else (v2 >= bound)
                        if i1:
                            out.append((p1, u1))
                        if i1 != i2:
                            t = (bound - v1) / (v2 - v1)
                            pm = [a + (b - a) * t
                                  for a, b in zip(p1, p2)]
                            um = None
                            if u1 is not None and u2 is not None:
                                um = [a + (b - a) * t
                                      for a, b in zip(u1, u2)]
                            out.append((pm, um))
                    return out

                for axis, bound, keep_le in ((0, RX[0], False),
                                             (0, RX[1], True),
                                             (2, RZ[0], False),
                                             (2, RZ[1], True)):
                    poly = clip_edge(poly, axis, bound, keep_le)
                    if len(poly) < 3:
                        break
                if len(poly) < 3:
                    continue
                # веер от вершины 0; вырожденные отбрасываем
                for i in range(1, len(poly) - 1):
                    vs = [poly[0], poly[i], poly[i + 1]]
                    ax, az = vs[0][0][0], vs[0][0][2]
                    bx, bz = vs[1][0][0], vs[1][0][2]
                    cxx, czz = vs[2][0][0], vs[2][0][2]
                    if abs((bx - ax) * (czz - az)
                           - (cxx - ax) * (bz - az)) < 1e-9:
                        continue
                    nc = [[v[0], v[1], v[2], v[3], v[4], v[5]]
                          for v, _ in vs]
                    nu = [tuple(v[1]) if v[1] is not None else None
                          for v in vs]
                    new_tris.append((nc, color, fn, nu))
                    n_clipped_tris += 1
            if new_tris:
                xs = [c[0] for t, _, _, _ in new_tris for c in t]
                ys = [c[1] for t, _, _, _ in new_tris for c in t]
                zs = [c[2] for t, _, _, _ in new_tris for c in t]
                naabb = (min(xs), max(xs), min(ys), max(ys),
                         min(zs), max(zs))
                ncen = ((naabb[0] + naabb[1]) / 2,
                        (naabb[2] + naabb[3]) / 2,
                        (naabb[4] + naabb[5]) / 2)
                clipped.append([new_tris, naabb, ncen])
        meshes = clipped
        # Страховочная земля: в исходнике есть настоящие пустоты (ни земли,
        # ни зданий — сквозь них скайбокс). Плоскость y=-0.3 по окну ядра
        # (+2м поля) ячейками 10м, намотка вверх: белая плашка + земляной
        # тинт. Из солидов вылетает по flat-skip, дыры закрыты навсегда.
        GROUND_Y = -0.3
        GROUND_CELL = 10.0
        GROUND_TINT = (0.42, 0.4, 0.37)
        GM = 2.0
        plane_tris = []
        _gx = CORE_X0 - GM
        while _gx < CORE_X1 + GM - 1e-9:
            _x1 = min(_gx + GROUND_CELL, CORE_X1 + GM)
            _gz = wz0 - GM
            while _gz < wz1 + GM - 1e-9:
                _z1 = min(_gz + GROUND_CELL, wz1 + GM)
                q = [[_gx, GROUND_Y, _gz, 0.0, 1.0, 0.0],
                     [_x1, GROUND_Y, _gz, 0.0, 1.0, 0.0],
                     [_x1, GROUND_Y, _z1, 0.0, 1.0, 0.0],
                     [_gx, GROUND_Y, _z1, 0.0, 1.0, 0.0]]
                plane_tris.append(([q[0], q[2], q[1]], GROUND_TINT, None,
                                   [None, None, None]))
                plane_tris.append(([q[0], q[3], q[2]], GROUND_TINT, None,
                                   [None, None, None]))
                _gz = _z1
            _gx = _x1
        paabb = (CORE_X0 - GM, CORE_X1 + GM, GROUND_Y, GROUND_Y,
                 wz0 - GM, wz1 + GM)
        pcen = ((paabb[0] + paabb[1]) / 2, GROUND_Y,
                (paabb[4] + paabb[5]) / 2)
        meshes.append([plane_tris, paabb, pcen])
        n_ground_tris = len(plane_tris)
    else:
        # outlier meshes: center further than 3 sigma from median of centers
        centers = [m[2] for m in meshes]
        med = [statistics.median([c[i] for c in centers]) for i in range(3)]
        dists = [math.dist(c, med) for c in centers]
        mdist = statistics.median(dists)
        sigma = statistics.pstdev(dists) if len(dists) > 1 else 0.0
        kept = [m for m, d in zip(meshes, dists) if d <= mdist + 3 * sigma]
        n_dropped = len(meshes) - len(kept)
        n_flat_kept = 0
        n_clipped_tris = 0
        n_ground_tris = 0
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
    # baked-координаты окна ядра (для ground-coverage теста): X=(x-cx)*scale
    if a.true_scale:
        wz0b, wz1b = (CORE_Y0, CORE_Y1) if a.flip_z else (-CORE_Y1, -CORE_Y0)
        core_rect = [clean(round((CORE_X0 - cx) * scale, 3)),
                     clean(round((CORE_X1 - cx) * scale, 3)),
                     clean(round((wz0b - cz) * scale, 3)),
                     clean(round((wz1b - cz) * scale, 3))]
    else:
        core_rect = None
    # ---- procedural tiles (seeded, tileable): закрываем дыры исходника ----
    # Генерация картинок недоступна, рисуем кодом: попиксельный шум тайлится
    # идеально, пятна — синусами с целыми периодами, швы мембраны — по сетке,
    # делящей размер. Детерминировано (seed 42), в git не коммитится ничего —
    # плитки живут только в памяти и запекаются в атлас.
    PROC_SIZE = 256
    PROC_ROOF = 'zz_roof.png'
    PROC_WARM = 'zz_plaster_warm.png'
    PROC_COOL = 'zz_plaster_cool.png'
    PROC_ASPH = 'zz_asphalt.png'
    PROC_TILES = {PROC_ROOF: 'roof', PROC_WARM: 'plaster_warm',
                  PROC_COOL: 'plaster_cool', PROC_ASPH: 'asphalt'}
    _prng = random.Random(42)

    def _proc_tile(kind):
        if kind == 'roof':
            base, amp = (148, 146, 142), 8
        elif kind == 'plaster_warm':
            base, amp = (232, 222, 202), 6
        elif kind == 'plaster_cool':
            base, amp = (212, 218, 226), 6
        else:  # asphalt
            base, amp = (88, 88, 90), 12
        S = PROC_SIZE
        im = Image.new('RGB', (S, S))
        px = im.load()
        assert px is not None
        TAU = 2 * math.pi
        for yy in range(S):
            wy = math.sin(TAU * 2 * yy / S) * math.sin(TAU * 3 * yy / S)
            wy2 = math.sin(TAU * 5 * yy / S + 1.3) * math.sin(TAU * 7 * yy / S)
            for xx in range(S):
                wx = math.sin(TAU * 3 * xx / S) * math.sin(TAU * 2 * xx / S)
                wx2 = math.sin(TAU * 7 * xx / S) * math.sin(TAU * 5 * xx / S + 0.7)
                # два слоя пятен (целые периоды — шва нет) + зерно
                n = _prng.randint(-amp, amp) + int(7 * wx * wy) + int(6 * wx2 * wy2)
                if kind == 'roof':
                    # листы мембраны 128px: лёгкая шахматная разница тона
                    n += 7 if ((xx // 128) + (yy // 128)) % 2 == 0 else -7
                if kind == 'asphalt':
                    # крупный щебень: редкие тёмные/светлые вкрапления
                    r0 = _prng.random()
                    if r0 < 0.02:
                        n -= 28
                    elif r0 > 0.98:
                        n += 24
                r = min(255, max(0, base[0] + n))
                g = min(255, max(0, base[1] + n))
                b = min(255, max(0, base[2] + n))
                px[xx, yy] = (r, g, b)
        if kind == 'roof':
            for k in range(0, S, 64):
                for d in range(2):
                    for yy in range(S):
                        px[(k + d) % S, yy] = (110, 108, 104)
                    for xx in range(S):
                        px[xx, (k + d) % S] = (110, 108, 104)
        return im

    proc_images = {pname: _proc_tile(kind)
                   for pname, kind in PROC_TILES.items()}

    def _box_uv(nx, ny, nz, X, Y, Z, s=4.0, sv=None):
        # planar box-mapping: проекция по доминантной оси нормали,
        # 1 тайл на s метров по u и sv метров по v (sv — пропорция фото,
        # чтобы не сплющивать; по умолчанию квадрат).
        sv = s if sv is None else sv
        ax, ay, az = abs(nx), abs(ny), abs(nz)
        if ax >= ay and ax >= az:
            return (fract(Z / s), fract(Y / sv))
        if az >= ax and az >= ay:
            return (fract(X / s), fract(Y / sv))
        return (fract(X / s), fract(Z / sv))

    def _proc_pick(ny, Y, cr, cb):
        # какой процедурный тайл на плоский угол: вверх — крыша (низко —
        # асфальт), вниз — холодная штукатурка, бока — по теплоте тинта.
        if ny > 0.5:
            return PROC_ROOF if Y >= 0.5 else PROC_ASPH
        if ny < -0.5:
            return PROC_COOL
        return PROC_WARM if cr > cb else PROC_COOL
    # Fallback-текстуры: отсутствующие на диске файлы (крыши сидят на
    # material_1..4.jpg — их нет) мапим на ближайшую resolved по
    # diffuse-цвету (ничья — чаще используемая, затем имя), а не на белую
    # плашку. unresolved при этом честно хранит исходные имена.
    tex_avail = {p.name for p in Path(a.tex_dir).iterdir()} \
        if Path(a.tex_dir).is_dir() else set()
    # пропорции исходников (h/w) — для честного box-ретайлинга: тайл ложится
    # без сплющивания (только заголовки, быстро).
    fn_aspect = {}
    for _fn in set(fn_tris):
        _p = Path(a.tex_dir) / _fn
        if _p.is_file():
            try:
                with Image.open(_p) as _im:
                    fn_aspect[_fn] = _im.size[1] / max(1, _im.size[0])
            except Exception:
                pass
    resolved = sorted(fn for fn in set(fn_tris) if fn in tex_avail)
    fallback = {}
    for fn in set(fn_tris):
        if fn in tex_avail:
            continue
        if fn in ('material_1.jpg', 'material_2.jpg', 'material_3.jpg',
                  'material_4.jpg'):
            # исходников нет на диске (учёт: missing) — кладём процедурную
            # крышу вместо чужого фото по цвету: все четыре — кровля.
            fallback[fn] = PROC_ROOF
            continue
        rgb = fn_rgb.get(fn, WHITE)

        def key(r, _rgb=rgb):
            dr = fn_rgb.get(r, WHITE)
            return (sum((x - y) ** 2 for x, y in zip(dr, _rgb)),
                    -fn_tris.get(r, 0), r)

        if resolved:
            fallback[fn] = min(resolved, key=key)
    n_fallback_corners = 0

    # global dedup: positions round(3), normals round(2), colors round(3)
    pos_map, nor_map, col_map = {}, {}, {}
    positions, normals, colors = [], [], []
    pos_index, nor_index, col_index = [], [], []
    corner_tex = []  # per corner: (texfile|None, u_raw, v_raw)
    used_files = set()
    missing_files = set()
    no_uv_tris = 0
    # честный учёт углов: с реальной текстурой / плоские (fn None -> белая
    # плашка) / отсутствующие файлы (-> белая плашка, имена в unresolved)
    n_tex_corners = 0
    n_flat_corners = 0
    n_missing_corners = 0
    n_box_corners = 0
    aabbs = []
    for tris, aabb, _ in meshes:
        npx = []
        for corners, color, fn, uvraws in tris:
            # stretch-fix: фото, растянутое больше чем на 6x6м/тайл цельным
            # куском (span>0.5), — переложить box-тайлингом того же тайла
            # (4м, пропорция фото): резко вместо мыла. Мелкий настоящий
            # тайлинг (span мелкий) и кропы не трогаем.
            retile = False
            rsv = 4.0
            if fn is not None and fn in tex_avail and \
                    all(u is not None for u in uvraws):
                _bp = [((c[0] - cx) * scale, c[1] * scale, (c[2] - cz) * scale)
                       for c in corners]
                _ax, _ay, _az = _bp[0]
                _bx, _by, _bz = _bp[1]
                _dx, _dy, _dz = _bp[2]
                _ux, _uy, _uz = _bx - _ax, _by - _ay, _bz - _az
                _vx, _vy, _vz = _dx - _ax, _dy - _ay, _dz - _az
                _cxp = _uy * _vz - _uz * _vy
                _cyp = _uz * _vx - _ux * _vz
                _czp = _ux * _vy - _uy * _vx
                _A = 0.5 * math.sqrt(_cxp * _cxp + _cyp * _cyp + _czp * _czp)
                (_u0, _v0), (_u1, _v1), (_u2, _v2) = uvraws  # type: ignore[misc]
                _a = abs((_u1 - _u0) * (_v2 - _v0) -
                         (_u2 - _u0) * (_v1 - _v0)) / 2
                _sp = max(abs(_u1 - _u0), abs(_u2 - _u0), abs(_u2 - _u1),
                          abs(_v1 - _v0), abs(_v2 - _v0), abs(_v2 - _v1))
                if _a > 1e-9 and _sp > 0.5 and (_A / _a) > 36.0:
                    retile = True
                    rsv = 4.0 * fn_aspect.get(fn, 1.0)
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
                    if fn in tex_avail:
                        if retile:
                            # растянутое фото: тот же тайл, box-тайлинг 4м
                            bu, bv = _box_uv(NX, NY, NZ, X, Y, Z, 4.0, rsv)
                            used_files.add(fn)
                            corner_tex.append((fn, bu, bv))
                            n_box_corners += 1
                        else:
                            used_files.add(fn)
                            corner_tex.append((fn, uvraw[0], uvraw[1]))
                            n_tex_corners += 1
                    elif fn in fallback:
                        used_files.add(fallback[fn])
                        corner_tex.append((fallback[fn], uvraw[0], uvraw[1]))
                        missing_files.add(fn)
                        n_fallback_corners += 1
                        # файл отсутствует: угол семплит ЧУЖОЙ тайл, а не
                        # свою текстуру — честно идёт в missing, не в textured
                        n_missing_corners += 1
                    else:
                        missing_files.add(fn)
                        corner_tex.append((None, 0.0, 0.0))
                        n_missing_corners += 1
                else:
                    if fn is not None:
                        # материал с текстурой, но у блока нет TEXCOORD:
                        # box-mapping в его же тайл (или его fallback) —
                        # угол НЕ белый, идёт в box-учёт.
                        no_uv_tris += 1
                        tgt = fn if fn in tex_avail else fallback.get(fn)
                        if tgt is None:
                            missing_files.add(fn)
                            corner_tex.append((None, 0.0, 0.0))
                            n_missing_corners += 1
                        else:
                            bu, bv = _box_uv(NX, NY, NZ, X, Y, Z, 4.0,
                                             4.0 * fn_aspect.get(tgt, 1.0))
                            used_files.add(tgt)
                            corner_tex.append((tgt, bu, bv))
                            n_box_corners += 1
                    else:
                        # плоский исходник без текстуры: box-mapping в
                        # процедурный тайл по нормали/высоте/тинту; tint
                        # diffuse поверх сохраняется (col_index как был).
                        pname = _proc_pick(NY, Y, cr, cb)
                        bu, bv = _box_uv(NX, NY, NZ, X, Y, Z)
                        used_files.add(pname)
                        corner_tex.append((pname, bu, bv))
                        n_flat_corners += 1
                        n_box_corners += 1
        xs = [p[0] for p in npx]; ys = [p[1] for p in npx]
        zs = [p[2] for p in npx]
        aabbs.append((min(xs), max(xs), min(ys), max(ys),
                      min(zs), max(zs)))

    # ---- atlas: tiles <=256px, shelf pack into ATLAS_W-wide strip ----
    tiles = {}  # fn -> PIL image (RGB, thumbnailed)
    for fn in sorted(used_files):
        if fn in proc_images:
            continue  # процедурные — из памяти, на диске их нет и не надо
        try:
            im = Image.open(Path(a.tex_dir) / fn).convert("RGB")
            im.load()
        except Exception as e:
            print(f"atlas: skip {fn}: {e}", flush=True)
            missing_files.add(fn)
            continue
        im.thumbnail((TILE_MAX, TILE_MAX), Image.Resampling.LANCZOS)
        tiles[fn] = im
    # процедурные плитки — из памяти (на диске исходников нет, это нормально)
    for pname, pim in proc_images.items():
        tiles[pname] = pim
    # drop corners whose tile failed to load -> white
    n_load_fail_corners = 0
    if missing_files:
        dropped = []
        for (t, u, v) in corner_tex:
            if t is not None and t in missing_files:
                dropped.append((None, u, v))
                n_load_fail_corners += 1
            else:
                dropped.append((t, u, v))
        corner_tex = dropped
        n_tex_corners -= n_load_fail_corners
        n_missing_corners += n_load_fail_corners
        for fn in list(missing_files):
            tiles.pop(fn, None)
    rects = {}  # fn -> (x, y, w, h) in PIL coords (сам тайл, без extend)
    # edge-extend: растягиваем крайние пиксели тайла на EDGE_EXT px в паддинг,
    # чтобы мипы на минификации семплили свой цвет, а не соседа. Extend живёт
    # строго внутри TILE_PAD=16, расстояние между тайлами держится.
    E = EDGE_EXT

    def edge_extend(im, e=E):
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

    # white tile first; поле E по краям — extend крайних тайлов не вылезает
    rects["@white"] = (E, E, WHITE_TILE, WHITE_TILE)
    sx0 = E + WHITE_TILE + TILE_PAD
    y = E
    row_h = WHITE_TILE
    x = sx0
    for fn in sorted(tiles, key=lambda f: (-tiles[f].height, -tiles[f].width, f)):
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
    white = Image.new("RGB", (ww, wh), (255, 255, 255))
    atlas.paste(white, (wx, wy))
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
            # GL TEXCOORD (v=0 = низ картинки) vs PIL-тайл сверху вниз:
            # инверт v внутри тайла; белый фолбэк (t is None) не трогать.
            vv = 1.0 - (ry + (1.0 - v_raw) * h) / H
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
                "unresolved": sorted(missing_files),
                "proc": sorted(PROC_TILES),
                "atlas_h": H,
                "core_rect": core_rect,
                "atlas_tiles": {fn: list(rects[fn]) for fn in sorted(rects)}}
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
          f"flat_skipped={n_flat_skipped} flat_kept={n_flat_kept} "
          f"clipped_tris={n_clipped_tris} "
          f"ground_tris={n_ground_tris} "
          f"split={n_split} quant={q} "
          f"size={W:.1f}x{D:.1f} scale={scale:.4f} "
          f"mesh={mbytes / 1048576:.2f}MB solids={sbytes // 1024}KB",
          flush=True)
    print(f"atlas={ATLAS_W}x{H} tiles={len(tiles)} "
          f"atlas_bytes={atlas_bytes} jpeg_q={aq} "
          f"tex_resolved={len(tiles)}/{len(image_file)} "
          f"missing={sorted(missing_files) or '-'} "
          f"fallback={fallback or '-'} fb_corners={n_fallback_corners} "
          f"no_uv_tris={no_uv_tris}",
          flush=True)
    n_all_corners = n_tex_corners + n_flat_corners + n_missing_corners
    if n_all_corners > 0:
        pt = 100.0 * n_tex_corners / n_all_corners
        pf = 100.0 * n_flat_corners / n_all_corners
        pm = 100.0 * n_missing_corners / n_all_corners
    else:
        pt = pf = pm = 0.0
    # углы с fn, но без UV (no_uv_tris, счёт покорнерный) идут в box, не в
    # missing: текстура есть (или её fallback), угол семплит свой тайл.
    # flat-углы тоже в box (процедурный тайл), белая плашка — только аварии
    # загрузки (load_fail) и tgt None.
    print(f"corners={n_all_corners} textured={n_tex_corners} ({pt:.1f}%) "
          f"flat={n_flat_corners} ({pf:.1f}%) "
          f"missing={n_missing_corners} ({pm:.1f}%) "
          f"box={n_box_corners} "
          f"load_fail_corners={n_load_fail_corners}",
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
