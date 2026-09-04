# AGENTS.md — skitons.bratuxa.zomb.top

## Всегда работаем по скиллу impeccable
UI-работа — строго по `/root/.hermes/skills/impeccable/` (4.1.3): перед правками UI грузить `reference/craft-floor.md`. BuildPath: code (см. `.impeccable/config.json`).

## 3D — по three.js-скиллам
`threejs-fundamentals`, `threejs-geometry`, `threejs-lighting`, `threejs-animation` — руководствоваться ими, не памятью.

## Авторитеты
- `PRODUCT.md` — правда о продукте и балансе.
- `DESIGN.md` — визуальный мир, менять только редизайном.
- Файлы < 400 строк; ответственность разделена: `src/game/*` — логика, `src/three/builders/*` — модели, `src/three/CafeScene.ts` — сцена, `src/ui/*` — React.

## Сборка и проверка
- `export PATH="$HOME/.bun/bin:$PATH"; bun install; bun run typecheck; bun run build`
- `node --check` для JS; `curl -k -H "Host: skitons.bratuxa.zomb.top" https://127.0.0.1/ -o /dev/null -w "%{http_code}\n"`
- Коммит в `origin master` после задачи. Порядок ссылок: хаб 1Б42П → торнадо-игры → остальные → Танки в конце.
