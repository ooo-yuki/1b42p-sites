# Task 4 report: Мобы + волны + автобаланс

**Status:** DONE
**Commit:** 7111605 `shturm: sim мобы волны автобаланс 🐛` (master, parent 320cf68)
**Files:** `src/sim/enemies.ts`, `src/sim/waves.ts`, `src/sim/autobalance.ts`, `tests/waves.test.ts`

## TDD
- FAIL: `bun test tests/waves.test.ts` до реализации — `Cannot find module '../src/sim/waves'`, 0 pass / 1 fail.
- PASS: после реализации — `bun test`: 4 pass / 0 fail (player, weapons, 2×waves), 6 expect().
- Typecheck: `bun run typecheck` (tsc --noEmit) — чисто.

## Реализация (verbatim по брифу)
- `ENEMIES`: runner 40/5.0/10/cost1, shooter 50/3.2/8/cost2, tank 200/2.0/20/cost4, boss 1200/3.0/25/cost99.
- `makeWave(n)`: бюджеты [0,10,14,18,24,30,36]; n>=7 → boss+2×runner+shooter; иначе жадный набор tank→shooter→runner, cap 20.
- `autobalance(deaths, accuracy)`: deaths>=2→0.85; deaths==0 && accuracy>0.4→1.15; иначе 1.0.

## Concerns
- Нет. Волна 1 даёт 3 танка (бюджет 10: 4+4+2 → tank,tank,shooter, длина 3 < 12 ✓). Сигнатура `autobalance(deaths, accuracy)` — числами, не объектом `stats` из брифа-интерфейса; при интеграции с Task 5+ обернуть при необходимости.
