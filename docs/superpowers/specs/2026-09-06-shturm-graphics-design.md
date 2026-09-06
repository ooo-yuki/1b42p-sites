# ШТУРМ-43: графика AAA — дизайн

Дата: 2026-09-06. Заказчик: Miqqil⁴². Референс: PUBG-скрин (трава, солнце, облака, грунт, дымка).
Путь: architectural (новые подсистемы: небо, трава, грунт, свет, вода).

## Цели и бюджет

- 60 FPS на среднем железе; просадка <30 FPS 2 с → уже существующий `lowDetail` (pixelRatio 1, споты выкл).
- Трава: ≤2 draw calls на карту, +0 CPU на кадр (ветер в шейдере), тени от травы ВЫКЛ.
- Замеры до/после: `__shturm.draw()` (calls/triangles), `fpsAvg`, скрины 3 карты × 2 вида.

## 1. Небо/солнце/облака — новый `src/three/sky.ts`

- Купол: `SphereGeometry(280, 16, 12)`, `BackSide`, `ShaderMaterial` (без тумана: `fog: false`):
  Uniforms: `topColor`, `horizonColor`, `sunDir`, `sunColor`, `cloudT`.
  Фрагмент: микс top→horizon по `normalize(vWorld).y`; диск солнца `smoothstep(cos(0.9993…))` + гало `pow(max(dot(dir,sunDir),0), 350)`; облака — 2 слоя value-noise fbm от `dir.xz/dir.y`, дрейф `cloudT`, покрытие 0.45, только выше горизонта, подкрашены `sunColor` у солнца.
- Настроение на карту: расширить существующий `applyMapMood(map)` в `main.tsx` (не плодить параллельную функцию): вместо заливки `scene.background` — параметры купола + экспозиция (см. §4):
  yard: top 0x3a7bd5, horizon 0xbfe3f0, sun 0xfff3d6, высоко; island: top 0x2f6fd0, horizon 0xcfeaf2, sun ярче; neon: top 0x120a2e, horizon 0xff7a3c, sun низко (закат), облака фиолетовые.
- Солнце-свет (`DirectionalLight`) и `sunDir` купола — один вектор на карту (сейчас расходятся).

## 2. Трава — новый `src/three/grass.ts`

- Куст: 2 скрещенных квада 0.9×0.55 м (4 tris), текстура травинок 128×128 (canvas, alphaTest 0.45, DoubleSide).
- `InstancedMesh`: HIGH 22000 / LOW 7000 (двор+остров; неон 12000/4000, тёмная). Матрицы статичны, `frustumCulled = false`, `castShadow = false`, `receiveShadow = false`.
- Ветер через `onBeforeCompile`: в вершинный шейдер `transformed.x += bend`, где `bend = (position.y/0.55)^2 * (0.12*sin(uTime*1.6 + wx*0.5 + wz*0.3) + 0.05*sin(uTime*3.7 + wz*0.8))`; `uTime` обновляется в `step()`. Фаза от мировых координат инстанса (через `instanceMatrix[3].xz`).
- Расстановка: seeded RNG (`mulberry32(seed)` из `game-logic`-стиля, сид = `seed карты + 0x9e37`), в обход: круги препятствий +2 м, спавны +3 м, пруд двора +1 м, границы −1 м. Высота/поворот/оттенок — джиттер на инстанс.
- Цвета: двор 0x4a7a33→0x6a9a3f, остров 0x7a8a3f→0xa8a052 (суше), неон 0x1d3a2a→0x2a6a4a с emissive 0x0a2a1a×0.4.
- Адаптив: `setGrassDetail(low: boolean)` пересчитывает `mesh.count` (первые N инстансов — ближние к центру? нет: перемешать при построении, count срезает равномерно). Вызывать из существующего lowDetail-переключателя в `step()`.

## 3. Грунт и материалы

- Двор: новая canvas-текстура `grassGround` 512² (пятна 3 зелёных + проплешины `#6b5a3a`, шум), repeat 14; `roughness 1`.
- Стены/камни: `stone` 256² (кирпично-шумные блоки + потёки) для `matWall` всех карт (оттенок через `color`), `matStone` острова.
- Тёмные/резина/дерево/трубы/вывески — без новых текстур, только `roughness/envMapIntensity` подтянуть (дерево 0.8→0.65, резина ок).
- Пальмы острова: `crownMat` emissive 0.55→0.25 (сейчас светятся в темноте), плюс та же трава вокруг.

## 4. Свет

- `applyMapMood` расширить: `exposure` (yard 1.0, island 1.05, neon 0.95), hemi sky/ground под карту, sun intensity yard 1.5/island 1.6/neon 0.9 (как есть) + цвет из небесного `sun`.
- Тени солнца: оставить 2048/±25 (уже ок, не трогаем — перф).
- Bloom остаётся только neon (порог/сила как есть).

## 5. Вода

- Пруд двора: круг r=4 в точке (10, -2) (свободно от препятствий/спавнов/банок), y=0.06; материал как лужи + `map: waterTex` (скролл уже есть через shared `onBeforeRender`? у пруда свой оффсет — отдельный инстанс текстуры), `envMapIntensity 2.0` — солнечный блик.
- Кольцо острова: `opacity 0.8→0.9`, `envMapIntensity 1.2`, roughness 0.25→0.15.
- Лужи двора: без изменений.

## Вне скоупа (YAGNI)

Ленсфлэр, объёмные облака, отражения в реальном времени (reflector), тесселяция грунта, ночной режим, смена погоды.
