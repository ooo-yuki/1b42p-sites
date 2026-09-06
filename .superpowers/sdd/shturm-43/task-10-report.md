# Task 10 report — интеграция playable + build + браузер-приёмка

Статус: DONE. Дата: 2026-09-05.

## 1. Цикл (src/main.tsx)
- Фикс-степ sim 60 Гц (`STEP=1/60`, аккумулятор, кэп 15 тиков = покрытие dt-капа 0.25с) + render-снапшот каждый кадр.
- Драйверов два: rAF основной + `setInterval(50мс)`-watchdog ведёт тот же `step()`, если кадр старше 100мс.
  Причина: в headless-окружении (harness-chrome, SwiftShader) rAF не тикает без кадров композитора —
  замерено `frames:0` за 10с при живом React. С watchdog sim идёт даже при ~1 кадре/с.
- Тик: WASD/джойстик → `movePlayer`, обзор (pointer-lock + правый стик), огонь/перезарядка/кулдауны,
  хитскан с конусом, спавн очередей волн, ИИ (steering + сепарация + дистанция атаки + LOS упрощён),
  дроп 42%, автобаланс (смерть → ×0.85 мин ×0.6; чистая волна + точность>40% → ×1.15 макс ×1.6),
  передышка 10с, победа (босс убит / волна 7 зачищена), поражение (HP 0 → Dead).
- Resize-handler + pixelRatio cap (десктоп ≤2, моб ≤1.5, просадка → 1). V single-source: только App.
- Тест-хук `window.__shturm`: start/pause/resume/fire/move/view/wave/aimNearest/get/dbg.

## 2. Что связано
- sim (player/weapons/enemies/waves/maps/autobalance) → three (scene/shuba GLB+fallback-капсула/
  mobs/guns/tracers/mapsVisual/cameraRig) → ui (gameStore → App/HUD).
- HUD живой: HP/стамина/волна/слот/магазин+запас/frags/мобы/FPS/карта/сообщения, обновление ~4 Гц + по событиям.
- Меню (3 карты + 3 сложности + «В бой»), пауза (Esc/pointerlock-exit), победа/поражение со статой и рестартом.
- Deferred-миноры закрыты: tracer fade (`effects.update`), shooter SpotLight→emissive при FPS<30 2с
  (`setMobLightDetail` + pixelRatio 1), mouseLeave/touchCancel/blur-сброс залипших флагов.
- Плюс по ходу: спавн игрока вне препятствий лицом к центру; настроение света/тумана на карту
  (неон — закат 0x1a1033); fullscreen-CSS canvas; настроение применяется в startGame.

## 3. Build-вывод
- `bun test`: 4 pass / 0 fail. `bun run typecheck`: чисто. `bun run build`: ✓ built, `dist/`:
  `index.html` + `assets/index-*.js` (770 КБ, gzip ~210 КБ) + `models/` (4 GLB). Размер dist 2.5МБ.

## 4. Скриншоты (`/root/sites/.superpowers/sdd/shturm-43/shots/`)
- menu.png — меню, выбор карт/сложностей (39 КБ)
- third.png — 3-е лицо, двор, HUD живой (54 КБ)
- move.png — движение (52 КБ)
- fire.png — стрельба (61 КБ)
- kill.png — frags, дроп «патроны +», мобы 2 (57 КБ)
- first.png / first-fire.png — 1-е лицо (V), viewmodel ствола, наводка на бегуна (44/36 КБ)
- boss.png — волна 7/7, «БОСС Чайка Рукрасии», свита (37 КБ)
- neon.png — неон-закат, HUD `neon` (52 КБ)

## 5. Ошибки консоли
- `window.__conerr` (console.error + error + unhandledrejection) на всех сессиях: **пусто — 0 ошибок**.
- Проверены: загрузка, старт, движение, стрельба+киллы, V-переключение, волна босса, смена карты.

## 6. Замеры (headless SwiftShader, CPU-растр; на реальном GPU ожидается 42+)
- Движение: yaw/позиция меняются, sim realtime после кэпа тиков (t растёт 1:1 со стеной при ~1 к/с).
- Стрельба: 30→12 патронов за 8с, accuracy 100% с наводкой, frags 2, дроп сработал (reserve 210→225).
- Мобы атакуют: HP 100→76→84 (танки/стрелки), волна 7: мобы 5 (босс+свита+спавн).
- FPS в headless: 16–45 (рендер-баунд CPU); sim от рендера отвязан аккумулятором.

## 7. Коммиты (из /root/sites)
- `65339a3` shturm: ШТУРМ-43 v1 playable, 3 карты волны босс 🏆 (код + dist, спек требует dist)
- `73fac07` shturm: кулдаун спавна свиты босса 🐛 (src/main.tsx + dist)

## 9. Fix R1-R2 — кулдаун спавна свиты босса (2026-09-05)
- Код (уже был правильным, не менялся): `summonCd:12` строка 58, сброс в `startWave` строка 173,
  кулдаун строк 490–496 с `===` (только босс 7-й волны: `w.boss && w.wave===7`, `summonCd<=0` → спавн + сброс 12).
- Проверено: `bun test` — 4 pass / 0 fail; `bun run typecheck` — exit 0 (tsc --noEmit чисто);
  `bun run build` — ✓ built in 10.24s, dist обновлён (assets/index-qLSdhfSw.js 771.22 КБ, gzip 210.68 КБ).
- Коммит `73fac07` из /root/sites: `git add shturm.bratuxa.zomb.top/src/main.tsx shturm.bratuxa.zomb.top/dist`.

## 8. Concerns (не блокеры)
1. FPS замерен только на CPU-растре (16–45); 42+ на реальном GPU не проверен — нужен ручной чек на десктопе.
2. Мобильный эмулятор 390×844 не прогонялся (джойстики в коде есть, визуально не проверены).
3. `window.__shturm` (включая aimNearest) остался в прод-бандле — осознанно, для приёмки следующих тасков; убрать одной строкой если мешает.
4. Чанк 770 КБ > 500 КБ warning — code-split по желанию, не блокер.
5. Пауза-скрин не снят (CDP-таймаут на тяжёлом кадре); pause/resume проверены хуком (phases ок).
