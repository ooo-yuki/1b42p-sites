"""
Blender: экспорт карты для MTT Game (без коллизии — коллизия генерируется в движке)
================================================================================

Инструкция:
1. Вкладка Scripting → New → вставь скрипт → ▶ Run Script
2. Найди Spawn (Empty) и перемести в точку спавна
3. Повтори ▶ Run Script
4. Скопируй map_export.glb → src/assets/custom-map.glb → bun run build

Скрипт ТОЛЬКО экспортирует GLB. Коллизия создаётся автоматически в игре.
"""

import bpy
import os

EXPORT_NAME = "map_export.glb"
SPAWN_NAME = "Spawn"


def main():
    if SPAWN_NAME not in bpy.data.objects:
        empty = bpy.data.objects.new(SPAWN_NAME, None)
        bpy.context.scene.collection.objects.link(empty)
        empty.empty_display_type = 'PLAIN_AXES'
        empty.location = (0, 0, 0)
        print("[MTT] Создан Spawn в (0, 0, 0) — перемести!")

    blend_path = bpy.data.filepath
    export_path = os.path.join(os.path.dirname(blend_path), EXPORT_NAME) if blend_path else os.path.join(os.path.expanduser("~"), "Desktop", EXPORT_NAME)

    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.data.objects:
        obj.select_set(True)

    bpy.ops.export_scene.gltf(
        filepath=export_path,
        use_selection=False,
        export_format='GLB',
        export_apply=True,
        export_cameras=False,
        export_lights=False,
    )
    print(f"[MTT] Экспорт: {export_path}")
    print(f"[MTT] Скопируй в src/assets/custom-map.glb → bun run build")


main()
