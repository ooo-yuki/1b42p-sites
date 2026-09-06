# Task 5 brief (single source of truth)

### Task 5: Ночь X — катовер (единственный таск с даунтаймом)

**Files:** нет (только команды + проверка).

**Interfaces:**
- Consumes: зелёная матрица Task 4, окно 5–10 мин согласовано.
- Produces: Caddy на 80/443, 20/20 HTTPS 200, браузер чистый.

- [ ] **Step 1: Переключение (секунды)**

```bash
cp /root/sites/infra/Caddyfile /etc/caddy/Caddyfile
systemctl stop chaev-site
systemctl enable --now caddy
sleep 3
ss -tlnp | grep -E ':80 |:443 '
```

Expected: 80/443 держит caddy, не python3.

- [ ] **Step 2: curl 20/20 по HTTPS**

```bash
for d in 1b42p 42laiv 42vs ai-714ef0 brohacho chaev denis doom evaelph gtaevv hub miqqil mtt pampers sasha setden skitons smolgrad svyatoslav shturm; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 https://$d.bratuxa.zomb.top/);
  echo "$d -> $code";
done
```

Expected: все 200. Если >0 не-200 — откат: `systemctl stop caddy; systemctl start chaev-site` (<1 мин), разбираемся днём.

- [ ] **Step 3: Браузер (shturm меню+бой, 3 соседа), консоль 0 ошибок**

```bash
git -C /root/sites log --oneline -1 && echo NIGHT-X-OK
```

Зафиксировать хэш и скрины в отчёт; commit не нужен (конфиг уже в git).


