# Task 9 report — React HUD + ввод + тач

DONE. Коммит 81c7866 `shturm: React HUD джойстики 📱` (3 файла: +140/−1).

Что сделано:
- `src/ui/hud.tsx` — Hud verbatim по брифу: HP/Волна/патроны/слот + подсказки V/1-2-3/R на русском.
- `src/ui/App.tsx` — App: Hud + левый стик (движение → inputBus.move), правый стик (обзор → inputBus.look), кнопки Огонь/Прицел (удержание, тач+мышь)/Перезарядка; клавиатура WASD + V (вид через cameraRig) + 1/2/3 (слот) + R (перезарядка). Экспортирован `inputBus` для игрового цикла Task 10.
- `src/main.tsx` — рендер App в #root + связка initScene(canvas #game).

Проверки:
- `bun run typecheck` (tsc --noEmit) — чисто, exit 0.

Concerns:
- HUD-показатели пока локальный useState-заглушки (hp=100, wave=1, ammo по слоту); живой цикл и сброс inputBus.reload/look — задача Task 10.
- Двойной слушатель KeyV (cameraRig.ts + App): оба тогглят вид синхронно, итог — один тоггл за нажатие, но в Task 10 слушатель из cameraRig стоит убрать.

## Fix F1 (round 1)
- Убран window keydown KeyV-listener из `src/three/cameraRig.ts` (удалён блок строк 19–23). setView/getView/updateCamera — чистые функции без сайд-эффектов.
- V-тоггл остался единственным в `src/ui/App.tsx:77` (`setView(getView() === 'first' ? 'third' : 'first')`).
- `bun run typecheck` — чисто, exit 0.
- Коммит d9573c8 `shturm: V-тоггл только в App, убрать дубль в cameraRig 📱` (1 файл, −6 строк).
- F2–F7 не тронуты, deferred в Task 10/миноры.
