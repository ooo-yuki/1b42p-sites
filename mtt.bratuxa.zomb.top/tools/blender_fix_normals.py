"""Пересчёт нормалей карты наружу + переэкспорт GLB."""
import bpy
import os

EXPORT = r"C:\Users\matt2\Documents\map_export.glb"

o = bpy.data.objects.get('карта ')
for x in bpy.data.objects:
    x.select_set(False)
bpy.context.view_layer.objects.active = o
o.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')
print("[MTT] normals recalculated")
bpy.ops.wm.save_mainfile()

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
