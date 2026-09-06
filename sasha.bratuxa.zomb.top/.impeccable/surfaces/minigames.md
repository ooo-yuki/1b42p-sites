# Surface brief — minigames

Scope: витрина мини-игр (`minigames.html`, `src/minigames/*`, `src/Minigames.tsx`).
Mode: Operate. Гость с главной жмёт «Мини-игры», за секунды выбирает во что
зарубиться — офлайн сразу, онлайн позже. Поиска и матчмейкинга на странице нет.

## Direction contract

THESIS: витрина — аркадный зал, а не список ссылок: одна игра-карточка =
один автомат; тестовый кликер с бейджем «тест», боевые позже. Поиска нет.
OWN-WORLD: ночь DESIGN.md, кобальт интерактива, алые акценты, пилюли 999px,
Segoe UI, Lucide + data-icon; карточки полной композицией shadcn.
STORY: гость видит зал, читает что за игра и онлайн ли она, жмёт «Открыть» —
играет на её странице. Новые завозы появляются сами из реестра.
FIRST VIEWPORT: заголовок «Мини-игры» + подзаголовок 42, сетка автоматов
(карточка: название, описание, бейджи режим/тест, кнопка «Открыть»).
FORM: реестр `src/minigames/registry.ts` (id/title/desc/href/mode/test) +
вьюха; новая игра = одна запись, без правок вьюхи.
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying
its provenance.
