#!/usr/bin/env python3
"""Bake Szeged DAE (SketchUp, Z_UP, inches) -> mesh + solids JSON.

Reads tools/szeged-src/model.dae, writes:
  src/assets/szeged.mesh.json   {positions, normals, colors} (flat triples, meters, Y_UP, center at 0)
  src/assets/szeged.solids.json [{x,z,hx,hz,h}] (meters)

Pipeline: parse only <triangles> -> material diffuse color per tri ->
inches->meters (*0.0254), Z_UP->Y_UP (x,y,z)->(x,z,-y) [--flip-z gives (x,z,y)] ->
drop meshes whose center is further than 3 sigma from median of centers ->
downscale so bbox <=120m on bigger XZ side, bbox center XZ at (0,0) ->
per-mesh AABBs -> voxel merge on 2m grid -> drop boxes h<0.3, area<0.09.

stdlib only.
"""
import argparse
import json
import math
import statistics
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

C = "{http://www.collada.org/2005/11/COLLADASchema}"
INCH = 0.0254
MAX_SIDE = 120.0
CELL = 2.0
WHITE = (1.0, 1.0, 1.0)


def floats(text):
    return [float(v) for v in text.split()]


def effect_diffuse(root, effect_id):
    """Diffuse RGB of an effect; white fallback when textured/missing."""
    for e in root.iter(C + "effect"):
        if e.get("id") != effect_id:
            continue
        d = e.find(".//" + C + "diffuse")
        if d is None:
            return WHITE
        col = d.find(C + "color")
        if col is None or not col.text:
            return WHITE  # textured or procedural -> flat white
        r, g, b = floats(col.text)[:3]
        return (r, g, b)
    return WHITE


def main():
    here = Path(__file__).resolve().parent
    ap = argparse.ArgumentParser()
    ap.add_argument("--flip-z", action="store_true",
                    help="map (x,y,z)->(x,z,y) instead of (x,z,-y)")
    ap.add_argument("--src", default=str(here / "szeged-src" / "model.dae"))
    ap.add_argument("--mesh-out",
                    default=str(here.parent / "src" / "assets" / "szeged.mesh.json"))
    ap.add_argument("--solids-out",
                    default=str(here.parent / "src" / "assets" / "szeged.solids.json"))
    a = ap.parse_args()
    flip = -1.0 if not a.flip_z else 1.0

    tree = ET.parse(a.src)
    root = tree.getroot()

    # material id -> diffuse rgb
    mat_color = {}
    for m in root.iter(C + "material"):
        ie = m.find(C + "instance_effect")
        if ie is None:
            mat_color[m.get("id")] = WHITE
        else:
            mat_color[m.get("id")] = effect_diffuse(
                root, ie.get("url", "").lstrip("#"))

    # geometry id -> {symbol: rgb} via instance_geometry bindings (first wins)
    geom_sym = {}
    for ig in root.iter(C + "instance_geometry"):
        gid = ig.get("url", "").lstrip("#")
        slot = geom_sym.setdefault(gid, {})
        for im in ig.iter(C + "instance_material"):
            sym = im.get("symbol")
            if sym in slot:
                continue
            slot[sym] = mat_color.get(im.get("target", "").lstrip("#"), WHITE)

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
        pos_src = nor_src = None
        for i in verts.findall(C + "input"):
            if i.get("semantic") == "POSITION":
                pos_src = srcs.get(i.get("source"))
            elif i.get("semantic") == "NORMAL":
                nor_src = srcs.get(i.get("source"))
        if pos_src is None or nor_src is None:
            continue
        sym = geom_sym.get(g.get("id"), {})
        tris = []
        for t in mesh.findall(C + "triangles"):
            ins = t.findall(C + "input")
            stride = max(int(i.get("offset", "0")) for i in ins) + 1
            p = t.find(C + "p")
            if p is None or not p.text:
                continue
            idx = [int(v) for v in p.text.split()]
            color = sym.get(t.get("material"), WHITE)
            tris.append((stride, idx, color))
        if tris:
            geoms[g.get("id")] = (pos_src, nor_src, tris)

    def rot(px, py, pz):
        return (px * INCH, pz * INCH, flip * py * INCH)

    def rotn(nx, ny, nz):
        return (nx, nz, flip * ny)

    # per-mesh transformed tris + aabb + center
    meshes = []  # (tris_xyz_list, color_list, aabb, center)
    for gid, (pos, nor, tblocks) in geoms.items():
        pts = []   # (x, y, z, nx, ny, nz, r, g, b) per corner
        for stride, idx, color in tblocks:
            for k in range(0, len(idx), stride * 3):
                for c in range(3):
                    vi = idx[k + c * stride]
                    x, y, z = rot(pos[vi * 3], pos[vi * 3 + 1], pos[vi * 3 + 2])
                    nx, ny, nz = rotn(nor[vi * 3], nor[vi * 3 + 1], nor[vi * 3 + 2])
                    pts.append((x, y, z, nx, ny, nz) + color)
        if not pts:
            continue
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]; zs = [p[2] for p in pts]
        aabb = (min(xs), max(xs), min(ys), max(ys), min(zs), max(zs))
        cx = (aabb[0] + aabb[1]) / 2
        cy = (aabb[2] + aabb[3]) / 2
        cz = (aabb[4] + aabb[5]) / 2
        meshes.append([pts, aabb, (cx, cy, cz)])

    n_raw_meshes = len(meshes)
    n_raw_tris = sum(len(m[0]) // 3 for m in meshes)

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
    scale = min(1.0, MAX_SIDE / max(sx, sz))
    cx, cz = (gx0 + gx1) / 2, (gz0 + gz1) / 2

    positions, normals, colors = [], [], []
    aabbs = []
    for pts, aabb, _ in meshes:
        npx = []
        for (x, y, z, nx, ny, nz, r, g, b) in pts:
            X, Y, Z = (x - cx) * scale, y * scale, (z - cz) * scale
            positions += [X, Y, Z]
            normals += [nx, ny, nz]
            colors += [r, g, b]
            npx.append((X, Y, Z))
        xs = [p[0] for p in npx]; ys = [p[1] for p in npx]; zs = [p[2] for p in npx]
        aabbs.append((min(xs), max(xs), min(ys), max(ys), min(zs), max(zs)))

    fx0 = min(a[0] for a in aabbs); fx1 = max(a[1] for a in aabbs)
    fz0 = min(a[4] for a in aabbs); fz1 = max(a[5] for a in aabbs)
    W, D = fx1 - fx0, fz1 - fz0

    # solids: per-mesh AABB -> 2m voxel grid (cell: bottom=min, top=max),
    # greedy rect merge of equal (bottom, top) cells, drop h<0.3 / area<0.09
    def voxel_merge(aabbs, quant):
        cells = {}
        for (x0, x1, y0, y1, z0, z1) in aabbs:
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
    for quant in (0.0, 0.5, 1.0, 2.0):
        q = quant if quant > 0 else 1e-9
        solids = voxel_merge(aabbs, q)
        if len(solids) <= 1500:
            break

    r3 = lambda v: round(v, 3)
    mesh_out = {"positions": [r3(v) for v in positions],
                "normals": [r3(v) for v in normals],
                "colors": [r3(v) for v in colors]}
    solids_out = [{k: r3(s[k]) for k in ("x", "z", "hx", "hz", "h")} for s in solids]

    Path(a.mesh_out).parent.mkdir(parents=True, exist_ok=True)
    with open(a.mesh_out, "w") as f:
        json.dump(mesh_out, f)
    with open(a.solids_out, "w") as f:
        json.dump(solids_out, f)

    verts = len(positions) // 3
    print(f"meshes={len(meshes)}(+{n_dropped} outliers of {n_raw_meshes}) "
          f"raw_tris={n_raw_tris} verts={verts} tris={verts // 3} "
          f"solids={len(solids)} size={W:.1f}x{D:.1f} scale={scale:.4f}",
          flush=True)


if __name__ == "__main__":
    sys.exit(main())
