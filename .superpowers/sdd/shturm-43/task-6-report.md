# Task 6 report — Шуба GLB + Mixer

- Commit: `60d2b4b` — `shturm: шуба GLB миксер walk/run/attack/dead 🧥`
- Base: `212dedb` (master HEAD на старте)
- Файл: `shturm.bratuxa.zomb.top/src/three/shuba.ts` (create, 38 строк)

## Что сделано
- `loadShuba(scene): Promise<Shuba>` — грузит 4 GLB (`Walking/Running/Attack/Dead`
  `Meshy_AI_shuba_biped_Animation_*_withSkin.glb`) через `GLTFLoader.loadAsync`,
  модель из Walking-клипа добавляется в сцену, всем мешам `castShadow = true`.
- Один `AnimationMixer`: walk/run играют сразу, бленд весами
  `t = clamp((speed-1)/4, 0, 1)`; attack-клип клонирован и сделан аддитивным
  через `AnimationUtils.makeClipAdditive`; dead — `LoopOnce + clampWhenFinished`,
  запускается по `deadFlag`.
- Экспортирован интерфейс `Shuba { model, mixer, update(speed, firing, deadFlag, dt) }`
  (дополнение к брифу ради типизации; логика update — verbatim по брифу).

## Проверки
- `bun run typecheck` (`tsc --noEmit`) — чисто, exit 0.
- GLB-файлы на месте: `public/models/Meshy_AI_shuba_biped_Animation_{Walking,Running,Attack,Dead}_withSkin.glb`.
- Совместимость с Task 5: `initScene` возвращает `{ scene, camera, renderer }` —
  `loadShuba(scene)` принимает `THREE.Scene` напрямую, конфликтов нет.

## Concerns
- Node-count спеки (26 нод) рантайм-проверкой не валидировал — GLB бинарные,
  лоадер вызывается только в браузере; пути `/models/...` предполагают
  vite `public/` (файлы там есть).
- `atkA.reset().play()` каждый кадр при `firing=true` рестартует аддитивную атаку —
  так в брифе; если стрельба будет очередями, может понадобиться триггер по фронту.
- `deadA.play()` вызывается повторно каждый кадр при `deadFlag` — из-за
  `clampWhenFinished` повторные `play()` безопасны, но намеренного одноразового
  триггера нет.
