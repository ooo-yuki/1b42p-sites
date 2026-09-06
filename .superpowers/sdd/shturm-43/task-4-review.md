# Task 4 review: Мобы + волны + автобаланс

**Вердикт: Spec ✅ | Quality: OK**
**Commit:** 7111605 (parent 320cf68), 4 файла: `src/sim/enemies.ts`, `src/sim/waves.ts`, `src/sim/autobalance.ts`, `tests/waves.test.ts`
**Проверено:** 2026-09-05 — `bun test`: 4 pass / 0 fail; `tsc --noEmit`: чисто.

## Spec (бриф — нормативный блок кода, побайтово)
- ENEMIES ✅ — runner 40/5.0/10/c1, shooter 50/3.2/8/c2, tank 200/2.0/20/c4, boss 1200/3.0/25/c99 — verbatim.
- BUDGET ✅ — `[0,10,14,18,24,30,36]` — verbatim.
- Волна 7 = босс ✅ — `n>=7 → [boss, runner, runner, shooter]`, тест `some(s => s.type==='boss')` проходит.
- Волна 1 дешёвая ✅ — бюджет 10 → tank,tank,shooter, длина 3 < 12.
- autobalance ✅ — `deaths>=2→0.85; deaths==0 && accuracy>0.4→1.15; иначе 1.0` — verbatim, пороги точные.
- Тест ✅ — verbatim из брифа, оба кейса зелёные.
- Commit ✅ — сообщение `shturm: sim мобы волны автобаланс 🐛`, staged 4 файла.

## Global (логика только sim)
- ✅ Дифф — только `src/sim/*` + `tests/`; ни одного файла рендера/игры не тронуто.
- ✅ `grep ENEMIES|makeWave|autobalance src/ -l | grep -v src/sim/` — пусто (использований вне sim нет).

## Findings (построчно)
1. [info] Сигнатура `autobalance(deaths, accuracy)` vs однострочный интерфейс брифа `autobalance(stats)` — расхождение только со строкой-резюме; нормативный код брифа (Step 3) — два числа, реализация ему соответствует. При интеграции с Task 5+ обернуть в `stats` при необходимости. Не блокер.
2. [nit] Отчёт пишет «Волна 1 даёт 3 танка (4+4+2 → tank,tank,shooter)» — фактически 2 танка + шутер (длина 3). Арифметика бюджета верная, ошибка только в слове отчёта. Не блокер.
3. [info] `makeWave`: жадный набор tank→shooter→runner, cap 20 только на танки; при текущих бюджетах (≤36) cap недостижим — ок для Task 4.
4. [info] `BUDGET[n] ?? 10` — волны вне 0..6 (кроме ≥7) падают на бюджет 10; поведение разумное, тестами не покрыто — ок для Task 4.
