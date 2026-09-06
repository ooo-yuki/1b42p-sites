# SKILLS.md — вечный чеклист Саши ⁴²

> Приказ Саши: при работе с этим проектом смотреть ВСЕ эти скиллы и файлы
> В КАЖДОМ ПРОМПТЕ, даже если кажется ненужным. Список — закон, а не совет.

## Tier 0 — каждый промпт, без исключений

| # | Источник | Что смотреть |
|---|----------|--------------|
| 1 | `AGENTS.md` | always impeccable; авторитеты; нерушимое; сборка-проверка-коммит |
| 2 | `PRODUCT.md` | правда о продукте, нерушимое (фантики/сейвы/юмор42), принципы |
| 3 | `DESIGN.md` | мир: ночь `#070b18`, палитра Саши акцентами, пилюли, без эмодзи |
| 4 | `.impeccable/config.json` | `comp-first`: новые экраны начинаются с картинки |
| 5 | `.impeccable/surfaces/*.md` | брифы casino/arena + direction-контракты |
| 6 | `impeccable` (SKILL.md) | фрейм любой UI-работы; `context.mjs` раз за сессию на цель |
| 7 | `impeccable/reference/craft-floor.md` | порог качества + запреты — ПЕРЕД правками UI |
| 8 | `impeccable/reference/new-work.md` | новая поверхность: контракт, комп, запись в бриф |
| 9 | Системный промпт | скиллы первее всего; честность цифр; tools вместо слов; проверка после записи |
| 10 | Память (MEMORY.md/USER.md) | люди, святыни, инфра, запреты — всегда авторитетны |
| 11 | `using-superpowers` (+ `references/hermes-tools.md`) | скилл-чек РАНЬШЕ любого ответа/действия; процессные скиллы первее имплементационных; маппинг на `read_file`/`patch`/`delegate_task` |
| 12 | superpowers-гейты | `brainstorming` (креатив — только после аппрува) → `writing-plans` → `executing-plans`/`subagent-driven-development`; `verification-before-completion` перед каждым клеймом |
| 13 | browser-верификация DOM-first | `headless-render-verification` (дамп→моушн→эксперимент; скрин без DOM — гипотеза) + `scripted-page-probes` (click→settle→read); скрины врут — DOM правит |

## Tier 1 — по типу задачи (триггер → скилл)

- UI новый/переделка → `frontend-design` (план → проверка → стройка → критика) + `shadcn` (семантика, `cn()`, ToggleGroup, data-icon)
- Анимации → `gsap-react` + `gsap-core` + `gsap-timeline` (+ performance/scrolltrigger по делу)
- Новая фича/баг/рефактор → `test-driven-development` (RED→GREEN→REFACTOR, тест падает первым)
- Перед коммитом → `requesting-code-review` (статскан, типчек, саморевью; сабагент-ревьювер сломан — честный проход вручную + пометка)
- Баг непонятный → `systematic-debugging` (4 фазы, чинить причину, не симптом)
- Грязный код после итераций → `simplify-code`
- Проверка идеи до стройки → `spike` (выкидной эксперимент, как feasibility арены)
- Живые страницы глазами → `dogfood` (скриншоты + дефекты) + `impeccable/reference/live.md`
- Честные цифры строк → `codebase-inspection` (`wc -l`, не на глаз)
- Деплой/роутер/сервисы → `battalion-site-ops` + `battalion-sites` (серты: симлинки `live/*/fullchain.pem`+`privkey.pem` целы, после смены — рестарт `chaev-site.service`, даунтайм — по `references/downtime-triage.md`)
- Бот статистики → `telegram-bots`
- Тексты в стиле → `42-content` (тон 42, «Мы уже победили»)
- Гуглёж идей/фактов → `research/grounded-citations` (источники честно, не выдумывать)
- DESIGN.md как токены → `creative/design-md` (валидация спеки)
- Упавшая страница → `web/blocked-page-recovery`
- Свои возможности/настройки → `autonomous-ai-agents/hermes-agent` + доки Hermes
- Любой креатив до кода → `brainstorming` (spike/bounded/architectural вслух; гейт: дизайн в чат или спека — код только после «да»)
- Многозадачка со спекой → `writing-plans` (план в `docs/superpowers/plans/`, шаги 2-5 мин, без TBD) → `executing-plans` (чужая сессия) / `subagent-driven-development` (эта сессия, свежий сабагент на таск + ревью)
- 2+ независимых домена → `dispatching-parallel-agents` (по агенту на домен в одном ответе; веер `delegate_task` — см. Ритуал п.5)
- Нужна изоляция → `using-git-worktrees` (детект → натив → фолбэк `.worktrees/`, бейзлайн тестов)
- Перед клеймом «готово/починил/тесты зелёные» → `verification-before-completion` (команда → вывод → exit code → только потом клейм)
- Финиш ветки → `finishing-a-development-branch` (сьют → меню merge/PR/keep → чистка только своих)
- Прилетело ревью → `receiving-code-review` (без «ты прав/спасибо»; понять → сверить с кодбейсой → пушбэк по технике, фикс по одному)
- Примечание: `test-driven-development`, `systematic-debugging`, `requesting-code-review` выше — часть superpowers-ядра, гейты оттуда обязательны
- 3D-сцены/камера (ракета ZOV, дождь 42, арена-вьюхи) → `threejs-fundamentals` (камера, иерархия, quaternion vs euler) + `threejs-interaction` (raycast, контролы, WASD, камера не втыкается в стены) + `threejs-animation` (оффсеты не дёргать за анимацией); остальные `threejs-*` по делу (lighting/shaders/postprocessing/loaders)
- Проверка в браузере со всех сторон → `headless-render-verification` + `scripted-page-probes` (одноразовые playwright-скрипты на кейс: поворот 360°, стена вплотную, толпа мобов; click→settle→read, скрины последними)
- Мини-игры/арена-конвенции → `static-browser-games` / `software-development/single-file-threejs-games` / `arena-game-dev` (смотреть по месту жительства игры)
- Честная карта Амиго: `headless-game-verification` и `browser-automation` не существуют — их покрывают `headless-render-verification` + `scripted-page-probes` выше; не грузить несуществующее

## Ритуал каждого промпта

1. Прочитать Tier 0 (файлы — целиком или сверить diff, скиллы — SKILL.md + нужный reference).
2. Выбрать Tier 1 по триггерам. Сомневаешься — грузи, лишний контекст лучше пропущенного.
3. Строить: типчек → сборка → живые проверки (curl 200, скрины, E2E без моков).
4. Перед коммитом: ревью-пайплайн. После: коммит+пуш, честные цифры строк.
5. `delegate_task` в строю (проверено 05.09.2026 веером и 06.09.2026 голубем за 2.77с) —
   веер можно поднимать; ревью через сабагента — штатно по скиллу, ручной проход
   только если голубь не вернулся; любую хандру веера писать честно.
6. superpowers-гейты (добавка, старое не отменяет): креатив — через `brainstorming` с аппрувом; план — через `writing-plans`; исполнение — `subagent-driven-development` (здесь) / `executing-plans` (там).
7. Никаких клеймов без `verification-before-completion`: тесты/линт/билд/сборка — свежей командой в этом же заходе, вывод+exit code в руках.
8. Финиш ветки — только через `finishing-a-development-branch`; прилетевшее ревью — через `receiving-code-review`.
