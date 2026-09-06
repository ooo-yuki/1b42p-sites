# Task 7 review — стволы/мобы/эффекты (6ec5124)

Вердикт Spec: ✅ PASS
Quality: good (4/5)

## Spec-check (по брифу)
- guns.ts `makeGun(slot: 'pistol'|'auto'|'shotgun')` — ✅ дословно из брифа: Group из 2 боксов, корпус MeshStandardMaterial 0x222222 r0.4 m0.8 (длина 0.9 shotgun / 0.6), castShadow, рукоять wood 0x7a4a21 на (0,-0.14,0.15).
- mobs.ts — ✅ 4 фигуры через `makeMob(kind)`: runner/shooter/tank/seagull; только Box/Cylinder + MeshStandardMaterial; `part()` ставит castShadow=true везде.
- effects.ts `makeTracerPool(scene, n=43)` — ✅ дословно из брифа: пул 43 THREE.Line, отрезок длиной 5, LineBasicMaterial 0xffe066 transparent opacity 0, `fire(from,dir)` кольцевой счётчик + lookAt + opacity=1.
- Global: three только рендер (нет физики/логики в файлах), PBR (MeshStandardMaterial везде; emissive только линза фонаря) — ✅.
- Diff: 60d2b4b..6ec5124, 3 файла create-only, 117 insertions, без посторонних изменений — ✅.
- Typecheck `tsc --noEmit` — ✅ exit 0 (перепроверено ревьюером).

## Findings (построчно)
1. `effects.ts:10` — трейсеры не гаснут: `fire` ставит opacity=1 без fade/таймера; после 43 выстрелов весь пул останется видимым. Нужен fade в игровом цикле (не блокер Task 7 — код из брифа, но зафиксировать на следующую задачу).
2. `mobs.ts:49-52` — SpotLight на каждого shooter (intensity 8, dist 18): при десятках стрелков дорого по draw/draw-свету; при просадке FPS заменить на emissive-конус без реального света.
3. `mobs.ts:43-48` — `lampLens` создан напрямую через `new THREE.Mesh` без castShadow (мелочь, линза emissive — тень не нужна, но не через `part()`).
4. `mobs.ts:88-94` — `makeMob` switch без default: при полном покрытии MobKind TS ok, но с `noImplicitReturns` может ругаться на missing return — сейчас typecheck чистый, ок.
5. `guns.ts:9` — `grip` без castShadow (в брифе так же — соответствует спеку, не findings против исполнителя).
6. Отчёт точен: sha/строки/коммит/статус совпадают с фактом; concerns из отчёта (fade, анимация/хитбоксы, SpotLight) подтверждаю как валидные и неблокирующие.
