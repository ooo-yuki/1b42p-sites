"""Покраска деревьев карты (земля уже покрашена юзером, верх — чёрный).
- Все полигоны -> материал Material (пустой слот дропает vertex colors при экспорте).
- Стволы (0.3-2м): коричневые. Кроны (>2м): цвет по земле под ними
  (фиолетовая/красная/бирюзовая зона или зелень с вариацией).
- Сохранение .blend + переэкспорт GLB.
"""
import bpy
import os
import random
from mathutils.kdtree import KDTree

EXPORT = r"C:\Users\matt2\Documents\map_export.glb"
GROUND_Y = 0.3
TRUNK_TOP = 2.0

random.seed(42)

o = bpy.data.objects.get('карта ')
me = o.data

# 1. Все полигоны на Material, пустой слот удалить
for p in me.polygons:
    p.material_index = 0
mat0 = me.materials[0]
me.materials.clear()
me.materials.append(mat0)
print("[MTT] all polys -> Material")

# 2. KDTree земли (x, z) -> цвет
a = me.color_attributes['Attribute']
verts = me.vertices
loops = me.loops
ground_idx = []
for i, lp in enumerate(loops):
    if verts[lp.vertex_index].co.z < GROUND_Y:
        ground_idx.append(i)
kd = KDTree(len(ground_idx))
for k, i in enumerate(ground_idx):
    v = verts[loops[i].vertex_index].co
    kd.insert((v.x, v.y, 0.0), k)
kd.balance()
print(f"[MTT] ground loops: {len(ground_idx)} / {len(loops)}")


def ground_color(x, y):
    _, k, _ = kd.find((x, y, 0.0))
    return tuple(a.data[ground_idx[k]].color[:3])


BROWN = (0.32, 0.20, 0.11)
PURPLE = (0.45, 0.14, 0.55)
BURNED = (0.25, 0.14, 0.08)
TEAL = (0.08, 0.32, 0.28)

n_trunk = n_canopy = 0
for i, lp in enumerate(loops):
    vco = verts[lp.vertex_index].co
    y = vco.z
    if y < GROUND_Y:
        continue
    if y < TRUNK_TOP:
        a.data[i].color = (BROWN[0], BROWN[1], BROWN[2], 1.0)
        n_trunk += 1
    else:
        g = ground_color(vco.x, vco.y)
        r, gg, b = g
        if b > 0.22 and r > 0.18:
            c = PURPLE
        elif r > 0.30 and gg < 0.25:
            c = BURNED
        elif b > 0.20 and r < 0.20:
            c = TEAL
        else:
            c = (0.10 + random.random() * 0.06, 0.38 + random.random() * 0.10, 0.10 + random.random() * 0.04)
        a.data[i].color = (c[0], c[1], c[2], 1.0)
        n_canopy += 1

print(f"[MTT] painted trunks: {n_trunk}, canopy: {n_canopy}")
me.update()
bpy.ops.wm.save_mainfile()

bpy.ops.object.select_all(action='DESELECT')
bpy.ops.export_scene.gltf(
    filepath=EXPORT,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
)
print(f"[MTT] exported: {EXPORT} ({os.path.getsize(EXPORT)} bytes)")
