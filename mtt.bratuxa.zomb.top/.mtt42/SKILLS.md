# SKILLS.md — вечный чеклист МТТ ⁴²

> Приказ МТТ: при работе с этим проектом смотреть ВСЕ эти скиллы и файлы
> В КАЖДОМ ПРОМПТЕ, даже если кажется ненужным. Список — закон, а не совет.

## Tier 0 — каждый промпт, без исключений

| # | Источник | Что смотреть |
|---|----------|--------------|
| 1 | `AGENTS.md` | always mtt42; авторитеты; нерушимое; сборка-проверка-коммит |
| 2 | `PRODUCT.md` | правда о продукте, нерушимое (фантики/сейвы/юмор42), принципы |
| 3 | `DESIGN.md` | мир: пиксель-стиль, `monospace`, акцент `#ff9f1c`, HUD-стекло, ствол XXL |
| 4 | `.mtt42/config.json` | `screen-first`: новая сцена начинается со скрина/кадра |
| 5 | `.mtt42/surfaces/*.md` | брифы arena/lobby/shop + direction-контракты |
| 6 | `impeccable` (SKILL.md) | фрейм любой UI-работы |
| 7 | `impeccable/reference/craft-floor.md` | порог качества + запреты — ПЕРЕД правками UI |
| 8 | Системный промпт | скиллы первее всего; честность цифр; tools вместо слов; проверка после записи |
| 9 | Память (MEMORY.md/USER.md) | люди, святыни, инфра, запреты — всегда авторитетны |
| 10 | `using-superpowers` | скилл-чек РАНЬШЕ любого ответа/действия |
| 11 | superpowers-гейты | `brainstorming` (креатив — только после аппрува) → `writing-plans` → `executing-plans`/`subagent-driven-development`; `verification-before-completion` перед каждым клеймом |
| 12 | browser-верификация DOM-first | `headless-render-verification` + `scripted-page-probes`; скрины врут — DOM правит |
| 13 | Правило МТТ | апдейты игры: тегать @MeMATT0 и давать ссылку https://mtt.bratuxa.zomb.top/ в том же сообщении |
| 14 | SKILL50+ | постоянный арсенал: 50/50 стоят — сканировать триггеры КАЖДЫЙ промпт, грузить по триггерам, сомневаешься — грузи (см. раздел SKILL50+ ниже) |

## Tier 1 — по типу задачи (триггер → скилл)

- UI новый/переделка → `frontend-design` + `shadcn`
- Новая фича/баг/рефактор → `test-driven-development` (RED→GREEN→REFACTOR, тест падает первым)
- Перед коммитом → `requesting-code-review` (статскан, типчек, саморевью вручную + пометка)
- Баг непонятный → `systematic-debugging` (4 фазы, чинить причину, не симптом)
- 3D-сцены/камера/текстуры → `threejs-fundamentals` + `threejs-interaction` + `threejs-animation` + `threejs-materials`/`threejs-textures` по делу
- Проверка в браузере → `headless-render-verification` + `scripted-page-probes` (click→settle→read; `__mtt`-хуки вместо гаданий)
- Деплой/роутер/сервисы → `battalion-site-ops` + `battalion-sites` (API — docker `bat42/mtt-api`, код запечён в образ: после правок `server.ts` — пересборка + recreate; systemd `mtt-api` НЕ трогать — конфликт за :8095)
- Тексты в стиле → `42-content` (тон 42, «Мы уже победили»)
- Многозадачка со спекой → `writing-plans` → `executing-plans` / `subagent-driven-development`
- Перед клеймом «готово/починил/тесты зелёные» → `verification-before-completion`
- Финиш ветки → `finishing-a-development-branch`; прилетевшее ревью → `receiving-code-review`

## SKILL50+ — постоянный арсенал (50/50 стоят, закон)

Приказ МТТ: арсенал используется на постоянной основе в проекте. Каждый промпт —
прогон глазами по триггерам ниже, загрузка ВСЕХ сработавших (`skill_view`), сомнение = грузить.
Таблица-источник: https://docs.google.com/spreadsheets/d/1k4gk6B_kfoPXQt7RTYvHgTGbXqBAbifBAjTAnEOgeGs/edit?usp=sharing

- План/понимание: `find-skills` (не знаешь чем делать) · `grill-me` / `grill-with-docs` (дожми план/дизайн) · `wayfinder` (кусок больше сессии) · `to-spec` (промпт→спека) · `to-tickets` (план→тикеты) · `brainstorming` (креатив — ОБЯЗАТЕЛЬНО первым) · `writing-plans` → `executing-plans` / `subagent-driven-development` (многозадачка) · `handoff` (сжатие контекста) · `research` (разведка) · `teach` (объяснить)
- Код: `implement` (работа по спеке/тикетам) · `tdd` + `test-driven-development` (RED→GREEN) · `prototype` (черновик ради ответа) · `ponytail` (ленивейшее рабочее) · `codebase-design` + `domain-modeling` (глубокие модули/домен) · `improve-codebase-architecture` (точки углубления) · `triage` (входящие issue/PR) · `resolving-merge-conflicts` (конфликты) · `code-review` + `requesting-code-review` (ревью до/после) · `diagnosing-bugs` + `systematic-debugging` (непонятный баг — 4 фазы)
- UI/дизайн: `frontend-design` + `web-design-guidelines` (любой UI) · `design-taste-frontend` (анти-слоп) · `ui-ux-pro-max` (разбор дизайна) · `brandkit` (фирменные картинки) · `theme-factory` (темы артефактов) · `shadcn` (компоненты) · `image-to-code` (скрин→код) · `web-artifacts-builder` (сложные артефакты) · `vercel-react-best-practices` (перф React) · `impeccable` + craft-floor (фрейм, уже Tier 0)
- Браузер/проверка: `agent-browser` + `browser-use` (живой браузер) · `headless-render-verification` + `scripted-page-probes` (DOM-first пруфы, уже Tier 0) · `webapp-testing` (тесты веба) · `verification-before-completion` (клеймы — только свежей командой, уже Tier 0)
- Данные/доки/тексты: `supabase-postgres-best-practices` (Postgres) · `pptx` · `productivity:pdf` · `productivity:docx` · `productivity:xlsx` · `doc-coauthoring` (доки) · `seo-audit` (SEO) · `copywriting` (маркетинг-тексты) · `42-content` (тон 42, уже Tier 1)
- Агенты/мета: `subagent-driven-development` (параллельные агенты) · `mcp-builder` (MCP) · `skill-creator` (новые скиллы) · `new-skill` (каркас скилла)

## Red Flags — STOP и читай SKILLS.md

- «Мелочь, чеклист не нужен»
- «Я уже читал SKILLS.md когда-то»
- «Сначала код, чеклист потом»
- «Скилл-гейт — оверхед»
- «Этот промпт — исключение»

**All of these mean: stop, read the law file, then continue.**

## Железо 42 LIVE (не выдумывать заново)

- Стек: Bun + React + TS + three.js. Сборка: `bun build ./index.html --outdir ./dist` (НЕ `main.tsx` — прод подхватит старье).
- Прод: https://mtt.bratuxa.zomb.top/ (роутер читает workdir живьём). API: docker `infra-mtt-api-1` :8095, образ `bat42/mtt-api:latest`.
- Проверки: `bunx tsc --noEmit -p tsconfig.json`, `bun build ./server.ts --target bun`, Playwright СТРОГО последовательно (параллель = флаки по CPU), строгий `curl https://mtt.bratuxa.zomb.top/` без `-k`.
- Сейвы святы: `mtt_shop_v1` (фантики/стволы), `mtt_keys_v1` (ремап), `mtt_char` (боец), `mtt_xp_v1` (опыт), `mtt_token` (сессия) — merge поверх, не сносить.
- Пароли — только хеш на сервере (`Bun.password`), показать нельзя; смена — через `/api/password` со старым.
- Админка — только `ADMIN_LOGIN` (env контейнера); чужим 403.
- Дизайн: `Courier New`, жёсткие тени `4px 4px 0 #000`, виньетка, ствол XXL по центру, прицел `mix-blend-mode:difference`.

## Ритуал каждого промпта

1. Прочитать Tier 0 (файлы — целиком или сверить diff, скиллы — SKILL.md + нужный reference).
2. Выбрать Tier 1 по триггерам. Сомневаешься — грузи, лишний контекст лучше пропущенного.
3. Строить: типчек → сборка → живые проверки (строгий curl 200, скрин глазами, E2E без моков, сьют последовательно).
4. Перед коммитом: ревью-пайплайн. После: коммит, честные цифры строк.
5. Никаких клеймов без `verification-before-completion`: тесты/билд — свежей командой в этом же заходе, вывод+exit code в руках.
6. Финиш ветки — только через `finishing-a-development-branch`; прилетевшее ревью — через `receiving-code-review`.

## Authority

Full law: `.mtt42/SKILLS.md` в репозитории. Скилл `mtt42` — обёртка (discoverability); файл — авторитет. Когда расходятся, файл wins.
