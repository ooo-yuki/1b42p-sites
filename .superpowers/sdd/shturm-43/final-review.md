# ШТУРМ-43 — финальное ревью whole-branch (2abe6ab..73fac07)

Дата: 2026-09-05. Объём: 24 файла, +1482. Коммиты: T1 aa9f297..2abe6ab … T10 65339a3 → fix 73fac07.
Проверено: spec, plan, progress.md (целиком, все rulings), task-1..10 review (+R1/R2), код src/sim+three+ui+game, tests/, shots/ (menu, boss — глазами), живой прогон: bun test, tsc, build.

## Вердикт: MERGE READY ✅

Блокеров нет. Оба load-bearing фикса приземлены и сверены с кодом 1:1 (V single-source, summonCd).

## Spec (раздел-чеk)

- 3 карты ✅: `sim/maps.ts` yard 42 / island 60 / neon 50; меню: Двор 1Б42П / Остров / Неон-город; скрин neon консистентен.
- 3 ствола ✅: `sim/weapons.ts` П-42 (25/12/120/0.35/0.5°/1.1с/60м), А-43 (16/30/210/0.11/1.8°/1.8с/80м), Д-42 (6×12/6/42/0.9/конус 5°/2.4с); смена 1/2/3+колесо, R — в App/loop.
- Волны 7+босс ✅: `sim/waves.ts` n>=7 → boss+свита; `sim/enemies.ts` boss hp 1200; shots: «Волна 7/7 — БОСС Чайка Рукрасии», мобы 5; тесты: 7-я волна содержит босса, 1-я дешёвая.
- Автобаланс ⚠️ упрощён, принято: `sim/autobalance.ts` — чистая функция (deaths/accuracy → 0.85/1.15/1.0), решение в sim, детерминировано; без окна 60с / пресетов ×0.8/×1.0/×1.25 / порогов ×0.6–×1.6 из спеки §9 — кандидат на следующий таск, не блокер v1.
- V 1/3 ✅: единственный тоггл — `App.tsx:114-117`; модульный listener из `cameraRig.ts` удалён (файл 17 строк, только set/get/update); main слушает `shturm:view` + тест-хук `window.__shturm.view`.
- 42+ FPS ⚠️ принято с оговоркой: headless CPU-растр 16–45 (boss-кадр 16, third/move 100 по отчёту T10); pixelRatio-cap, пулы, fog-cull, SpotLight-guard на месте; замер 42+ на реальном GPU — ручной чек после мержа.
- Архитектура ✅: логика только в `sim/` — grep damage/spawn/autobalance по `three/`+`ui/` пуст; связь через `gameStore`; `AMMO_FULL` в UI остался только в тексте-подсказке меню (строка 210), патроны ведёт цикл из снапшота.

## Rulings леджера — сверка

- dist/ в git ✅ (спек §13 + STATIC_ROOTS, `dist/{index.html,assets,models}` на месте) — ревьюерский Important T1 отклонён обоснованно.
- math.ts не создаём ✅ — математика тривиальна (hypot в resolveCircle), спеки содержимого не было.
- V single-source ✅ (см. выше); остаток — безвредный двойной setView (App напрямую + через событие в main, идемпотентно) → can-defer.
- summonCd ✅ ADDRESSED: `main.tsx:58` поле 12, `:173` сброс в startWave, `:490-495` декремент + одиночный пуш 2 раннеров; старый `%12==0` тик-спам удалён; потребление очереди (1/0.8с) покрывает 2/12с.

## Проверки живьём (этот прогон)

- `bun test`: 4 pass / 0 fail (player, waves ×2, weapons).
- `bunx tsc --noEmit`: 0 ошибок.
- `bun run build`: ✓ 48 модулей, `dist/assets/index-*.js` 771 КБ (gzip 211 КБ), dist 2.5МБ (модели). Ворнинг чанка >500КБ — can-defer (code-split).
- Shots: 9 шт, menu/boss/first/third/fire проверены глазами; консоль 0 ошибок по отчёту T10 (harness :9222).

## Deferred-триаж

- must-fix: — (пусто; F1 и summonCd закрыты).
- can-defer: HUD без стамины (стор обновляет, Hud не рендерит); `window.__shturm.view` не пишет в стор (только тест-хук); V двойной setView (идемпотентно); камера без коллизии с препятствиями (fire.png артефакт); автобаланс упрощённый (окно 60с+пресеты); чанк 771КБ (code-split); моб-эмулятор 390×844 не прогнан; пауза-скрин не снят (pause/resume проверены хуком); `window.__shturm` в проде осознанно; SLOTS/pollKeys/stale-slot/mouseLeave мелочи T9 — по отчёту T10 закрыты (mouseLeave/touchCancel/blur сбрасывают, tracer fade каждый кадр, SpotLight-guard).
