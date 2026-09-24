"""Финалка Blender-карты для MTT Game (Blender должен быть ЗАКРЫТ у юзера).
1. Хитбоксам в 'колизия ' без префикса col_ — добавляет (регистр не важен).
2. Спавны Spawn1/Spawn2 — только проверка, не трогаем.
3. Все полигоны 'карта' -> Material (иначе vertex colors дропаются).
4. Красит ТОЛЬКО почти-чёрные вершины выше земли (раскраску юзера не трогает):
   стволы 0.3-2м коричневые, кроны >2м по цвету зоны под ними.
5. Сохранение .blend + экспорт GLB.
"""
import bpy
import os
import random
from mathutils.kdtree import KDTree

EXPORT = r"C:\Users\matt2\Documents\map_export.glb"
COLLISION_NAMES = {"collision", "колизия", "коллизия"}
GROUND_Y = 0.3
TRUNK_TOP = 2.0
BLACK_LVL = 0.30

random.seed(42)


def all_objs(col):
    for o in col.objects:
        yield o
    for child in col.children:
        yield from all_objs(child)


# 1. Префиксы хитбоксов
hitboxes = []
for col in bpy.data.collections:
    if col.name.strip().lower() in COLLISION_NAMES:
        hitboxes.extend(list(all_objs(col)))
renamed = 0
for o in hitboxes:
    if not o.name.lower().startswith("col_"):
        o.name = "col_" + o.name
        renamed += 1
print(f"[MTT] hitboxes: {len(hitboxes)}, prefixed now: {renamed}")

# 2. Спавны
spawns = sorted(o.name for o in bpy.data.objects if o.type == 'EMPTY' and 'spawn' in o.name.lower())
print(f"[MTT] spawns: {spawns}")

# 3. Материал
o = bpy.data.objects.get('карта ') or bpy.data.objects.get('карта')
me = o.data
for p in me.polygons:
    p.material_index = 0
mat0 = me.materials[0]
me.materials.clear()
me.materials.append(mat0)
print("[MTT] all polys -> Material")

# 3b. Vertex colors -> Base Color (иначе экспорт дропает раскраску).
# Делаем каждый раз в памяти: сейвы из фона могут не прилипать.
if mat0.use_nodes:
    nt = mat0.node_tree
    bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
    attr = None
    for n in nt.nodes:
        if n.type == 'ATTRIBUTE' and getattr(n, 'attribute_name', '') == 'Attribute':
            attr = n
            break
    if attr is None:
        attr = nt.nodes.new('ShaderNodeAttribute')
        attr.attribute_name = 'Attribute'
        attr.location = (-400, 200)
    sock = bsdf.inputs.get('Base Color')
    if sock and not sock.is_linked:
        nt.links.new(attr.outputs['Color'], sock)
        print("[MTT] linked Attribute.Color -> Base Color")
    else:
        print("[MTT] Base Color already linked")

# 4. Покраска только чёрного
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

BROWN = (0.32, 0.20, 0.11)
ZONE = {
    'purple': (0.45, 0.14, 0.55),
    'burned': (0.25, 0.14, 0.08),
    'teal': (0.08, 0.32, 0.28),
}
n_trunk = n_canopy = n_skip = 0
for i, lp in enumerate(loops):
    vco = verts[lp.vertex_index].co
    if vco.z < GROUND_Y:
        continue
    col = a.data[i].color
    if col[0] + col[1] + col[2] >= BLACK_LVL:
        n_skip += 1
        continue
    if vco.z < TRUNK_TOP:
        a.data[i].color = (BROWN[0], BROWN[1], BROWN[2], 1.0)
        n_trunk += 1
    else:
        _, k, _ = kd.find((vco.x, vco.y, 0.0))
        r, g, b = a.data[ground_idx[k]].color[:3]
        if b > 0.22 and r > 0.18:
            c = ZONE['purple']
        elif r > 0.30 and g < 0.25:
            c = ZONE['burned']
        elif b > 0.20 and r < 0.20:
            c = ZONE['teal']
        else:
            c = (0.10 + random.random() * 0.06, 0.38 + random.random() * 0.10, 0.10 + random.random() * 0.04)
        a.data[i].color = (c[0], c[1], c[2], 1.0)
        n_canopy += 1
print(f"[MTT] painted trunks: {n_trunk}, canopy: {n_canopy}, kept user colors: {n_skip}")

me.update()
bpy.ops.wm.save_mainfile()
print("[MTT] blend saved")

for x in bpy.data.objects:
    x.select_set(True)
bpy.ops.export_scene.gltf(
    filepath=EXPORT,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_cameras=False,
    export_lights=False,
)
print(f"[MTT] exported: {EXPORT} ({os.path.getsize(EXPORT)} bytes)")
