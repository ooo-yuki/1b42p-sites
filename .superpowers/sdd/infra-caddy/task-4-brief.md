# Task 4 brief (single source of truth)

### Task 4: Репетиция на локальных портах

**Files:** временные, вне git (`/tmp/caddy-rehearse/`).

**Interfaces:**
- Consumes: Caddyfile Task 3, контейнер :8081, роутер-тыл (запустить вручную на 8080 для репетиции, прод-роутер на 80/443 НЕ трогаем).
- Produces: матрица curl 20/20 через Caddy :8080/:8443 с Host-заголовками.

- [ ] **Step 1: Поднять тыл + Caddy на тестовых портах**

```bash
mkdir -p /tmp/caddy-rehearse
sed -e 's/:80/:8080/' -e 's/:443/:8443/' /root/sites/infra/Caddyfile > /tmp/caddy-rehearse/Caddyfile.test
(nohup python3 /root/sites/router.py >/tmp/caddy-rehearse/router.log 2>&1 &) || true
caddy start --config /tmp/caddy-rehearse/Caddyfile.test
sleep 2
```

- [ ] **Step 2: Матрица 20 хостов**

```bash
for d in 1b42p 42laiv 42vs ai-714ef0 brohacho chaev denis doom evaelph gtaevv hub miqqil mtt pampers sasha setden skitons smolgrad svyatoslav shturm; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -H "Host: $d.bratuxa.zomb.top" http://127.0.0.1:8080/);
  echo "$d -> $code";
done
```

Expected: 20 строк, все 200. Иначе — чинить конфиг, Task 5 запрещён.

- [ ] **Step 3: Прибрать репетицию**

```bash
caddy stop; pkill -f 'python3 /root/sites/router.py'; sleep 1
systemctl is-active chaev-site
```

Expected: прод-роутер active (его не трогали), тестовые процессы мертвы.


