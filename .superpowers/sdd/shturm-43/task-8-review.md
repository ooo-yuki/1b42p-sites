# Task 8 review — 3 карты визуал + коллизии

Вердикт: Spec ✅ / Quality: высокая (минорные замечания, не блокеры)

Коммит 864a0a5 `shturm: 3 карты двор остров неон 🗺️` — сообщение verbatim из брифа, файлы `src/sim/maps.ts` + `src/three/mapsVisual.ts`, stat совпадает с диффом (6ec5124..864a0a5).

## Spec (бриф — единственный источник)
- [x] Step 1 maps.ts: MAPS yard/island/neon — size 42/60/50, спавны и obstacles побайтово как в брифе (yard 3 спавна + 2 препятствия, island 2 спавна + 0, neon 2 спавна + 1).
- [x] Step 2 mapsVisual.ts: merged статика (периметр + препятствия через `mergeGeometries`, исходники dispose), неон-фонари — стойки merged + emissive-лампы + PointLight без castShadow.
- [x] Commit step выполнен.
- Экстра вне брифа (`Spawn`/`MapDef`/`MapId`/`satisfies Record`, `resolveCircle` push-out + кламп, `disposeMapVisual`, цвета стен/земли/ламп) — оправданная обвязка, спеку не противоречит.

## Global-инварианты
- [x] `src/sim/maps.ts` — чистый TS, нет `document`/`window`/`three` (grep чист).
- [x] Направление зависимости `three/mapsVisual.ts` → `sim/maps`, обратного нет.
- [x] Ни один PointLight не выставляет `castShadow` (grep: только `statics.castShadow`, комментарий фиксирует намерение).
- [x] Спавны/препятствия/лампы внутри границ (yard half 21: ±18; island half 30: ±25; neon half 25: ±20; лампы r = half−4).

## Findings (построчно)
1. [minor] `resolveCircle`: кламп к границам не выставляет `hit=true` — `true` возвращается только при столкновении с препятствием; коллизию со стеной вызывающий код отличить не может.
2. [minor] `resolveCircle`: порядок «кламп → push-out» — препятствие у стены могло бы вытолкнуть сущность обратно за границу без повторного клампа; на текущих картах не триггерится (все obstacles глубоко внутри).
3. [minor/robustness] `mergeGeometries(parts)` / `mergeGeometries(poleGeos)` без null-check — при неудаче мержа в Mesh уйдёт null-геометрия; риск низкий (атрибуты Box+Cylinder однородны).
4. [info] Отчёт честно фиксирует concerns (physical-lights intensity под three 0.170, интеграция в цикл — скоуп Task 9–10); typecheck заявлен чисто, код ему соответствует.
