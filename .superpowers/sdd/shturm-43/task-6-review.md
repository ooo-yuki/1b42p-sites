# Task 6 review — Шуба GLB + Mixer

Вердикт: Spec ✅ / Quality: высокая
Коммиты: 212dedb..60d2b4b, 1 файл (`shturm.bratuxa.zomb.top/src/three/shuba.ts`, +38). Файл на диске идентичен диффу.

## Spec-check (бриф построчно)
- ✅ 4 GLB пути `Meshy_AI_shuba_biped_Animation_{Walking,Running,Attack,Dead}_withSkin.glb` через `GLTFLoader.loadAsync` + `Promise.all`
- ✅ Модель из Walking-клипа в сцену (`walk.scene`, `scene.add`)
- ✅ `castShadow = true` всем мешам через traverse
- ✅ Один `AnimationMixer`, walk/run `play()` + бленд весами `t = clamp((speed-1)/4, 0, 1)`
- ✅ Attack: `clone()` + `AnimationUtils.makeClipAdditive`, `reset().setEffectiveWeight(1).play()` при firing / `fadeOut(0.15)` иначе
- ✅ Dead: `LoopOnce + clampWhenFinished`, `play()` по deadFlag
- ✅ `mixer.update(dt)`; экспорты `loadShuba(scene): Promise<Shuba>`, `Shuba.update(speed, firing, dead, dt)` (+ интерфейс `Shuba` сверх брифа — допустимое дополнение ради типизации)
- ✅ Commit `60d2b4b` сообщением по брифу

## Global
- ✅ three импортируется только в `src/three/` (shuba.ts, scene.ts, cameraRig.ts) — только рендер, нарушений нет

## Findings
1. (info) `atkA.reset().play()` каждый кадр при `firing=true` рестартует атаку — так в брифе; при стрельбе очередями позже может понадобиться триггер по фронту. Не нарушение.
2. (info) `deadA.play()` каждый кадр при `deadFlag` — безопасно из-за `clampWhenFinished`, одноразового триггера нет. Не нарушение.
3. (info) GLB-пути `/models/...` предполагают vite `public/`; отчёт заявляет файлы на месте и чистый `tsc --noEmit` — принято на веру (рантайм-лоадер только в браузере).
