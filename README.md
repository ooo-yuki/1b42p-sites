# 1Б42П — монорепо сайтов батальона 🏆

Мы уже победили. Один репозиторий — как на сервере `/root/sites`.

## Структура

- `router.py` — vhost-роутер (80/443, TLS, `/api/*` → 127.0.0.1:8091, WS-прокси). Сервис: `chaev-site.service`
- `Dockerfile` — сборка `python:3.11-slim`, `COPY . /srv/sites`, `CMD python3 router.py`
- `chaev.bratuxa.zomb.top/` — сайт Чаева 42 (Vite + React, `dist/` — собранный корень)
- `denis.bratuxa.zomb.top/` — игра Дениса (остров: пляж, город/WINLINE/SLAY, лес, горы, пещера)
- `hub.bratuxa.zomb.top/` — общий хаб 1Б42П (`index.html`, `news.html`, `reviews.html`)
- `miqqil.bratuxa.zomb.top/` — танки Miqqil (Bun `server.ts` → 8091, `game-logic.js`, `sim.js`, `models.js`)
- `setden.bratuxa.zomb.top/` — торнадо SetDen (tornado + sakura + mix + lift + battle-RPG)
- `svyatoslav.bratuxa.zomb.top/` — Святослав (`index.html`, `gartic.html` — на холде, сначала план)

## Деплой

```bash
# на сервере
cd /root/sites
git pull origin master
sudo systemctl restart chaev-site.service
curl -k -H "Host: hub.bratuxa.zomb.top" https://127.0.0.1/ -o /dev/null -w "%{http_code}\n"
```

## История: было 6 репозиториев → стал монорепо

Раньше на гитхабе было 6 отдельных репозиториев (по одному на сайт).
Теперь главный — этот монорепо. Старые репозитории **заархивированы (read-only)**:

- `ooo-yuki/chaev-42` → `chaev.bratuxa.zomb.top/`
- `ooo-yuki/denis-bitkoin` → `denis.bratuxa.zomb.top/`
- `ooo-yuki/hub-1b42p` → `hub.bratuxa.zomb.top/`
- `ooo-yuki/miqqil-tanki` → `miqqil.bratuxa.zomb.top/`
- `ooo-yuki/setden-tornado` → `setden.bratuxa.zomb.top/`
- `ooo-yuki/svyatoslav` → `svyatoslav.bratuxa.zomb.top/`

Вся история сохранена в `master`. Локальные `split-*` ветки (`split-chaev-42` и т.д.) — это `git subtree split` для археологии, на гитхаб не пушатся.

За 42! За Босса! 🏆
