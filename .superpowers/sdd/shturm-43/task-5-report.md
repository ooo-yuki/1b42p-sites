# Task 5 report: Three сцена + камеры 1/3

- Статус: DONE
- Коммит: `212dedb` — «shturm: three сцена свет камеры V-1/3 🎥» (4 files: `src/three/scene.ts`, `src/three/cameraRig.ts` created; `package.json`, `bun.lock` — dev-dep `@types/three`)
- База: `7111605` (master HEAD на старте)

## Что сделано
- `src/three/scene.ts` — `initScene(canvas): {scene,camera,renderer}` по брифу verbatim: background/fog `0x87ceeb` (20–90), `WebGLRenderer` antialias, pixelRatio `min(devicePixelRatio,2)`, PCFSoft тени, ACESFilmic, камера 75° (0.1–300), hemi-свет (0.6) + dir-солнце (1.5, позиция 20/30/10, shadowmap 2048, frustum ±25), земля 90×90 `MeshStandardMaterial` roughness 1, receiveShadow.
- `src/three/cameraRig.ts` — `setView('first'|'third')` + `updateCamera(camera, {x,z,yaw})` по брифу verbatim (1-е лицо: высота 1.62; 3-е: offset sin/cos×2.2 + 0.8/2.4), `KeyV`-переключение. Плюс `getView()` (для тестов/отладки) и `typeof window` guard вокруг listener (SSR-безопасность, на поведение в браузере не влияет).

## Проверки
- `bun run typecheck` (`tsc --noEmit`): ✅ чисто после установки `@types/three@0.185.4` (без неё — TS7016, three@0.170 не шиппит свои типы; до Task 5 three-импортов в `src/` не было, поэтому проблема всплыла только сейчас).
- Brief steps 1–2 (код) + step 3 (коммит): ✅ все чекбоксы закрыты.
- Проверка в браузере (как требует step 2): ❌ не выполнялась — сцена нигде не монтируется (`main.tsx` всё ещё заглушка), нечего открывать. Монтирование/рендер-цикл — задача следующих тасков (06+).

## Concerns
- `innerWidth/innerHeight` и `devicePixelRatio` в `scene.ts` — голые глобалы без resize-handler; при ресайзе окна aspect не обновится. Кандидат на Task 6 (рендер-цикл): добавить `resize` listener.
- Камера в 3-м лице не делает lookAt/offset от yaw по вертикали — только `rotation.set(0, yaw, 0)`; pitch (мышь) — тоже в следующий таск.
- `@types/three@0.185.4` новее `three@0.170.0` — несовпадений типов typecheck не показал, но при апгрейде three версии держать в sync.
