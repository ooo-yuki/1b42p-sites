"""Экспорт Blender-карты в GLB для MTT Game (запуск: blender --background --python).
БЕЗ сохранения .blend (безопасно при открытом Blender у художника):
1. Объектам коллекции туман/fog/tuman даёт префикс fog_ (вид задаёт игра, важна только форма).
2. Докатывает col_ хитбоксам и Spawn1/Spawn2, если чего-то не хватает.
3. Экспортирует GLB (карта + Collision + спавны + туман).
"""
import bpy
import os

EXPORT = r"C:\Users\matt2\Documents\map_export.glb"

COLLISION_NAMES = {"collision", "колизия", "коллизия"}
FOG_NAMES = {"туман", "fog", "tuman"}


def all_objs(col):
    for o in col.objects:
        yield o
    for child in col.children:
        yield from all_objs(child)


def main():
    # 1. Туман -> fog_ (только MESH; .blend НЕ сохраняем — переименование живёт до конца сессии)
    fog_n = 0
    for col in bpy.data.collections:
        if col.name.strip().lower() in FOG_NAMES:
            for o in all_objs(col):
                if o.type == 'MESH' and not o.name.startswith("fog_"):
                    o.name = "fog_" + o.name
                    fog_n += 1
    print(f"[MTT] fog renamed: {fog_n}")

    # 2. Хитбоксы -> col_ (докат)
    hitboxes = []
    for col in bpy.data.collections:
        if col.name.strip().lower() in COLLISION_NAMES:
            hitboxes.extend(list(all_objs(col)))
    renamed = 0
    for o in hitboxes:
        if not o.name.startswith("col_"):
            o.name = "col_" + o.name
            renamed += 1
    print(f"[MTT] hitboxes: {len(hitboxes)}, renamed to col_: {renamed}")

    # 3. Спавны -> Spawn1 / Spawn2 (докат)
    spawns = [o for o in bpy.data.objects
              if o.type == 'EMPTY' and o.name.lower().replace(' ', '').startswith('spawn')]
    spawns.sort(key=lambda o: (0 if o.name == 'Spawn' else 1, o.name))
    for i, o in enumerate(spawns[:2]):
        want = f"Spawn{i + 1}"
        if o.name != want:
            o.name = want
    print(f"[MTT] spawns: {[o.name for o in bpy.data.objects if o.type == 'EMPTY' and 'spawn' in o.name.lower()]}")

    # 4. Экспорт GLB (.blend НЕ трогаем; use_selection=False — выделять ничего не надо)
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
