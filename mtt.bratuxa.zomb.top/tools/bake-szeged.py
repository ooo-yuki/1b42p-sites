#!/usr/bin/env python3
"""Bake Szeged DAE (SketchUp, Z_UP, inches) -> mesh + solids JSON.

Reads tools/szeged-src/model.dae, writes:
  src/assets/szeged.mesh.json   indexed mesh, meters, Y_UP, center at 0:
    {format:"szeged-mesh-2", positions, normals, colors,
     pos_index, nor_index, col_index}
    positions/normals/colors are flat triples (unique entries only);
    pos_index/nor_index address one VERTEX each (per corner, len=tris*3);
    col_index addresses one color (per triangle, len=tris) — color is
    constant across a triangle's 3 corners, so per-tri storage suffices.
    Consumer expands corner c of triangle t as:
      P=positions[3*pos_index[c]], N=normals[3*nor_index[c]],
      C=colors[3*col_index[t]].
  src/assets/szeged.solids.json [{x,z,hx,hz,h}] (meters)

Pipeline: parse only <triangles> (per-<input> offsets honored, UV ignored) ->
material diffuse color per tri -> inches->meters (*0.0254),
Z_UP->Y_UP (x,y,z)->(x,z,-y) [--flip-z gives (x,z,y)] ->
drop meshes whose center is further than 3 sigma from median of centers ->
downscale so bbox <=120m on bigger XZ side, bbox center XZ at (0,0) ->
vertex dedup (positions round(3), normals round(2), colors round(3)) ->
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
FORMAT = "szeged-mesh-2"
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


def clean(v):
    """round() may yield -0.0; normalize it to 0.0 for compact output."""
    return 0.0 if v == 0 else v


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
            p = t.find(C + "p")
            if p is None or not p.text:
                continue
            idx = [int(v) for v in p.text.split()]
            color = sym.get(t.get("material"), WHITE)
            tris.append((stride, v_off, n_off, tri_nor, idx, color))
        if tris:
            geoms[g.get("id")] = (pos_src, vert_nor, tris)

    def rot(px, py, pz):
        return (px * INCH, pz * INCH, flip * py * INCH)

    def rotn(nx, ny, nz):
        return (nx, nz, flip * ny)

    # per-mesh transformed tris + aabb + center
    meshes = []  # (tris_xyz_list, color_list, aabb, center)
    for gid, (pos, vnor, tblocks) in geoms.items():
        tris = []  # [([(x,y,z,nx,ny,nz) x3], color)]
        for stride, v_off, n_off, tri_nor, idx, color in tblocks:
            for k in range(0, len(idx), stride * 3):
                corners = []
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
                tris.append((corners, color))
        if not tris:
            continue
        xs = [c[0] for t, _ in tris for c in t]
        ys = [c[1] for t, _ in tris for c in t]
        zs = [c[2] for t, _ in tris for c in t]
        aabb = (min(xs), max(xs), min(ys), max(ys), min(zs), max(zs))
        cx = (aabb[0] + aabb[1]) / 2
        cy = (aabb[2] + aabb[3]) / 2
        cz = (aabb[4] + aabb[5]) / 2
        meshes.append([tris, aabb, (cx, cy, cz)])

    n_raw_meshes = len(meshes)
    n_raw_tris = sum(len(m[0]) for m in meshes)

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

    # global dedup: positions round(3), normals round(2), colors round(3)
    pos_map, nor_map, col_map = {}, {}, {}
    positions, normals, colors = [], [], []
    pos_index, nor_index, col_index = [], [], []
    aabbs = []
    for tris, aabb, _ in meshes:
        npx = []
        for corners, color in tris:
            cr, cg, cb = (clean(round(v, 3)) for v in color)
            ckey = (cr, cg, cb)
            ci = col_map.get(ckey)
            if ci is None:
                ci = len(colors) // 3
                col_map[ckey] = ci
                colors += [cr, cg, cb]
            col_index.append(ci)
            for (x, y, z, nx, ny, nz) in corners:
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
        xs = [p[0] for p in npx]; ys = [p[1] for p in npx]
        zs = [p[2] for p in npx]
        aabbs.append((min(xs), max(xs), min(ys), max(ys),
                      min(zs), max(zs)))

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

    r3 = lambda v: clean(round(v, 3))
    mesh_out = {"format": FORMAT,
                "positions": positions,
                "normals": normals,
                "colors": colors,
                "pos_index": pos_index,
                "nor_index": nor_index,
                "col_index": col_index}
    solids_out = [{k: r3(s[k]) for k in ("x", "z", "hx", "hz", "h")}
                  for s in solids]

    Path(a.mesh_out).parent.mkdir(parents=True, exist_ok=True)
    with open(a.mesh_out, "w") as f:
        json.dump(mesh_out, f, separators=(",", ":"))
        f.write("\n")
    with open(a.solids_out, "w") as f:
        json.dump(solids_out, f, separators=(",", ":"))
        f.write("\n")

    import os
    mbytes = os.path.getsize(a.mesh_out)
    sbytes = os.path.getsize(a.solids_out)
    print(f"meshes={len(meshes)}(+{n_dropped} outliers of {n_raw_meshes}) "
          f"raw_tris={n_raw_tris} uverts={len(positions) // 3} "
          f"unormals={len(normals) // 3} ucolors={len(colors) // 3} "
          f"tris={len(col_index)} solids={len(solids)} "
          f"size={W:.1f}x{D:.1f} scale={scale:.4f} "
          f"mesh={mbytes / 1048576:.2f}MB solids={sbytes // 1024}KB",
          flush=True)


if __name__ == "__main__":
    sys.exit(main())
