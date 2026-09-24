"""Фоновая обработка Blender-карты для MTT Game (запуск: blender --background --python).
1. Хитбоксам в коллекции Collision/Колизия/Коллизия добавляет префикс col_.
2. Spawn/Spawn.001 переименовывает в Spawn1/Spawn2.
3. Сохраняет .blend и экспортирует GLB.
"""
import bpy
import os

BLEND = r"C:\Users\matt2\Documents\проект карты .blend"
EXPORT = r"C:\Users\matt2\Documents\map_export.glb"

COLLISION_NAMES = {"collision", "колизия", "коллизия"}


def all_objs(col):
    for o in col.objects:
        yield o
    for child in col.children:
        yield from all_objs(child)


def main():
    # 1. Хитбоксы
    hitboxes = []
    for col in bpy.data.collections:
        if col.name.strip().lower() in COLLISION_NAMES:
            hitboxes.extend(list(all_objs(col)))
    print(f"[MTT] hitbox objects found: {len(hitboxes)}")
    renamed = 0
    for o in hitboxes:
        if not o.name.startswith("col_"):
            o.name = "col_" + o.name
            renamed += 1
    print(f"[MTT] renamed to col_: {renamed}")

    # 2. Спавны -> Spawn1 / Spawn2
    spawns = [o for o in bpy.data.objects
              if o.type == 'EMPTY' and o.name.lower().replace(' ', '').startswith('spawn')]
    # сортируем: точное "Spawn" первым
    spawns.sort(key=lambda o: (0 if o.name == 'Spawn' else 1, o.name))
    print(f"[MTT] spawn empties: {[o.name for o in spawns]}")
    for i, o in enumerate(spawns[:2]):
        o.name = f"Spawn{i + 1}"
    print(f"[MTT] spawns now: {[o.name for o in bpy.data.objects if o.type == 'EMPTY' and 'spawn' in o.name.lower()]}")

    # 3. Сохранить .blend
    bpy.ops.wm.save_mainfile()

    # 4. Экспорт GLB (всё: карта + Collision + спавны)
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


main()
