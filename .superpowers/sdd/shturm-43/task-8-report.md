# Task 8 report — 3 карты визуал + коллизии

Статус: DONE
Коммит: 864a0a5 `shturm: 3 карты двор остров неон 🗺️`

## Что сделано
- `src/sim/maps.ts` — MAPS yard 42 / island 60 / neon 50, спавны и obstacles verbatim из брифа + типы MapId/MapDef/Spawn + `resolveCircle` (push-out препятствий и кламп к границам).
- `src/three/mapsVisual.ts` — `buildMapVisual(map)` (земля + merged статика периметр+препятствия через `mergeGeometries`, неон-фонари: стойки merged + emissive-лампы + PointLight без castShadow) + `disposeMapVisual`.

## Проверки
- `bun run typecheck` — чисто (exit 0).

## Concerns
- PointLight intensity/distance/decay подобраны под three 0.170 physical lights (neon 60/35, остальные 25/22) — при смене тонемаппинга может понадобиться подкрутка.
- Интеграция `buildMapVisual` в игровой цикл / смену карт (Task 9–10) — вне скоупа, API готов.
