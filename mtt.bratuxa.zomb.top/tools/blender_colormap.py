"""Подключить vertex colors карты к материалу и переэкспорт GLB.
Без этого экспорт дропает раскраску (warning: vertex color not used in node tree).
"""
import bpy
import os

EXPORT = r"C:\Users\matt2\Documents\map_export.glb"

mat = bpy.data.materials.get("Material")
assert mat is not None and mat.use_nodes, "material Material not found"
nt = mat.node_tree
bsdf = next(n for n in nt.nodes if n.type == 'BSDF_PRINCIPLED')
# Ищем/создаём Attribute-ноду с именем атрибута 'Attribute'
attr = None
for n in nt.nodes:
    if n.type == 'ATTRIBUTE' and getattr(n, 'attribute_name', '') == 'Attribute':
        attr = n
        break
if attr is None:
    attr = nt.nodes.new('ShaderNodeAttribute')
    attr.attribute_name = 'Attribute'
    attr.location = (-400, 200)
# Base Color <- Attribute.Color (если уже занят — не трогаем)
sock = bsdf.inputs.get('Base Color')
if sock and not sock.is_linked:
    nt.links.new(attr.outputs['Color'], sock)
    print("[MTT] linked Attribute.Color -> Base Color")
else:
    print("[MTT] Base Color already linked, kept as-is")

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
