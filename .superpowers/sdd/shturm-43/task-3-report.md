# Task 3 report — Оружие хитскан 3 ствола

- Статус: DONE
- Коммит: 320cf68 `shturm: sim 3 ствола хитскан 🔫` (parent b2a12b9)
- Файлы:
  - `shturm.bratuxa.zomb.top/src/sim/weapons.ts` (create) — `Slot`, `WEAPONS`, `fireShot`
  - `shturm.bratuxa.zomb.top/tests/weapons.test.ts` (create) — дробовик 6 дробин
- TDD: FAIL подтверждён (Cannot find module '../src/sim/weapons') → PASS после реализации
- Тесты: `bun test` — 2 pass, 0 fail (player + weapons)
- Typecheck: `bun run typecheck` (tsc --noEmit) — чисто
- ТТХ (из брифа, дословно): pistol 25/12/120/0.35/0.5/1.1/1/60; auto 16/30/210/0.11/1.8/1.8/1/80; shotgun 12/6/42/0.9/5/2.4/6/25; falloff дробовика 0.5x после 15м
- Rulings соблюдены: math.ts не создавался; PlayerState не импортировался (fireShot чистый хитскан dist/seed, dt не требуется); API `fireShot` как в шаге 1/3 брифа
- Concerns:
  - В брифе строка Interfaces упоминает `fire(sim, slot, now)` / `reload()` — шаги 1/3 конкретизируют `fireShot(slot, dist, seed)`; реализован `fireShot`. Если Task 4+ нужен `fire` с симуляцией магазина/интервалов — расширить в следующей задаче.
  - `seed` в текущей реализации не используется (детерминированный веер без разброса); разброс/spread/range пока декларативные поля ТТХ.
