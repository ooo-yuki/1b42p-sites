# Task 5 review: Three сцена + камеры 1/3

Вердикт Spec: ✅
Quality: good

## Spec-check (бриф vs код)
- `initScene(canvas): {scene,camera,renderer}` — ✅ сигнатура и возврат совпадают.
- background/fog `0x87ceeb` (20–90) — ✅.
- `WebGLRenderer` antialias + pixelRatio `min(devicePixelRatio,2)` — ✅.
- PCFSoft тени + ACESFilmic — ✅.
- камера 75° (0.1–300) — ✅.
- hemi `0x87ceeb/0x8b4513, 0.6` — ✅.
- dir-солнце `0xffffcc, 1.5`, поз. 20/30/10, castShadow, mapSize 2048, frustum ±25 — ✅.
- земля 90×90 `MeshStandardMaterial 0x6a8f5f roughness 1`, receiveShadow — ✅.
- `setView('first'|'third')` + `updateCamera(camera,{x,z,yaw})` (1-е: 1.62; 3-е: sin/cos×2.2+0.8/2.4; rotation 0/yaw/0) — ✅ verbatim.
- `KeyV`-переключение — ✅.
- Global «three только рендер» — ✅, логики sim в `src/three/` нет.

## Findings (построчно)
1. `scene.ts` verbatim по бригу step 1 — отклонений нет.
2. `cameraRig.ts` verbatim по бригу step 2 + два безопасных дополнения: `getView()` (тесты/отладка) и `typeof window` guard (SSR) — на поведение в браузере не влияют, breaking нет.
3. Отчёт честно фиксирует: проверка в браузере не выполнялась (сцена нигде не монтируется, `main.tsx` — заглушка) — код шага 2 готов, отложено на Task 6+ (монтирование/рендер-цикл); планировочный зазор, не вина реализации.
4. `@types/three@0.185.4` при `three@0.170.0` — typecheck чист, но версии держать в sync при апгрейде three.
5. Concern (не блокер, кандидат в Task 6): голые `innerWidth/innerHeight`/`devicePixelRatio` без resize-handler — aspect не обновится при ресайзе.
6. Concern (не блокер, в следующий таск): 3-е лицо без lookAt/pitch — только `rotation.set(0,yaw,0)`; мышь — позже.
7. Diff extra: `package.json`/`bun.lock` только reformat + dev-dep `@types/three` — мусорных изменений нет.
