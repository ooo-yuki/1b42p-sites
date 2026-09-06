# Surface brief — terminal

Scope: текстовая игра-взлом (`terminal.html`, `src/terminal/*`, `src/Terminal.tsx`).
Mode: Experience. Гость — связист батальона: командами вскрывает узлы,
читает логи корпораций и распутывает заговор БРОТОВОД-Х.

## Direction contract

THESIS: настоящий чёрный терминал, а не чат-косметика: промпт, история,
↑↓ по командам, табы-автодополнение; победа — флаг root42.
OWN-WORLD: ночь DESIGN.md; моноширинный phosphor-зелёный текст поверх ночи,
кобальт — системные строки, алый — тревоги и БРОТОВОД-Х; курсор-блок мигает.
STORY: гость печатает help, учит scan/connect/read/decrypt/inject, собирает
3 фрагмента ключа из логов и вскрывает ядро. Финал — «Мы уже победили».
FIRST VIEWPORT: терминал на весь столбец (boot-лог 42, промпт
`bratuxa@42:~$`), под ним пилюля «В зал автоматов».
FORM: чистый движок `src/terminal/engine.ts` (команда→строки+состояние) +
вьюха; 4 узла, 10 файлов, сейв прогресса podval-стилем (`sasha_term42_v1`).
FINISH: unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying
its provenance.
