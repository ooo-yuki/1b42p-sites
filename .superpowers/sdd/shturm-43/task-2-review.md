# Task 2 review: sim игрок

Spec: ✅
Quality: Approved

## Проверено
- `shturm.bratuxa.zomb.top/src/sim/player.ts` — verbatim по брифу: createPlayer (hp 100, stamina 43), movePlayer, ходьба 4 / бег 7, расход 10/с, реген 12/с.
- `shturm.bratuxa.zomb.top/tests/player.test.ts` — verbatim по брифу, один тест спринта.
- `shturm.bratuxa.zomb.top/.gitignore` — `node_modules/`, без `dist/` ✅.
- Global: логика только в sim (дифф 3 файла, UI не тронут) ✅.
- Коммит `b2a12b9` `shturm: sim игрок ходьба/бег/стамина 43 🏃` ✅ (префикс + эмодзи).

## Findings
- [Important] `shturm.bratuxa.zomb.top/src/sim/math.ts` из Files брифа не создан (в `src/sim/` только `player.ts`). Спеки содержимого в брифе нет, тесты не зависят — решить до Task 3: создать заглушку или убрать из Files.
- [Minor] `src/sim/player.ts:2` — `InputState.dt` дублирует аргумент `dt` в `movePlayer`. Оставлено verbatim по брифу, ок; Task 3+ использовать аргумент.
- [Minor] `tests/player.test.ts` — покрыт только спринт (stamina<43, speed>4.5); нет проверки ходьбы 4, регена стамины, фиксированного степа 1/60 из Produces.
