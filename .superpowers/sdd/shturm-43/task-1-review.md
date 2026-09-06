# Task 1 — ревью: скаффолд shturm.bratuxa.zomb.top

## Вердикт
- **Spec: ✅** — все 6 пунктов брифа выполнены дословно (см. таблицу ниже).
- **Quality: NeedsFix** — код чистый, но в коммит попал build-артефакт `dist/` и нет `.gitignore` (мелкий фикс отдельной задачей).

## Spec-проверка (бриф — факт)
| Пункт брифа | Факт | Статус |
|---|---|---|
| package.json: name shturm-43, scripts dev/build/test, deps react/react-dom/three, devDeps plugin-react/typescript/vite | `shturm.bratuxa.zomb.top/package.json` — всё verbatim, плюс обоснованные `typecheck` + `@types/*` | ✅ |
| vite.config.ts дословно по брифу | `shturm.bratuxa.zomb.top/vite.config.ts` — байт в байт | ✅ |
| index.html: lang=ru, title «ШТУРМ-43 — Мы уже победили 🏆», #root + #game, /src/main.tsx | `shturm.bratuxa.zomb.top/index.html` — verbatim | ✅ |
| src/main.tsx: рендер «ШТУРМ-43 загружается… 🏆» | `shturm.bratuxa.zomb.top/src/main.tsx` — verbatim | ✅ |
| 4 GLB из 1b42p в public/models/ | Attack 454K / Dead 456K / Running 428K / Walking 433K; `cmp` Attack — идентичен источнику | ✅ |
| build → dist/index.html | `shturm.bratuxa.zomb.top/dist/index.html` (351 B) существует, dist/models/ на месте | ✅ |
| Global Constraints: коммит `shturm:` + эмодзи, русский UI | `2abe6ab` «shturm: скаффолд vite+react+ts+three, модели шубы 🏆» | ✅ |

## Findings
- [Important] `shturm.bratuxa.zomb.top/dist/` закоммичен (build-артефакт: `dist/index.html`, `dist/assets/*.js`, дубли GLB в `dist/models/`) — добавить `.gitignore` (dist/, node_modules/) и вычистить `dist/` из git отдельной задачей. Путь: `shturm.bratuxa.zomb.top/dist/`.
- [Minor] Отклонение от брифа (обоснованное, не нарушение): `package.json` — добавлены `@types/react`, `@types/react-dom` и скрипт `typecheck`; без них `tsc --noEmit` падал, на рантайм не влияет. Путь: `shturm.bratuxa.zomb.top/package.json`.
- [Minor] `bun.lock` закоммичен (254 строки) — приемлемо для bun-проекта, фиксирует зависимости; оставить. Путь: `shturm.bratuxa.zomb.top/bun.lock`.
- [Minor] `node_modules/` на диске не закоммичена (игнорируется глобально), но проектного `.gitignore` нет — покрыть тем же фиксом, что и `dist/`.
