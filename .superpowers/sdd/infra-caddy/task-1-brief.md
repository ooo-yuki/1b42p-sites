# Task 1 brief (single source of truth)

### Task 1: Установка Caddy на хост

**Files:**
- Create: `infra/Caddyfile` (скелет: глобал + заглушка, полный текст — Task 3)
- Modify: нет.

**Interfaces:**
- Consumes: ничего.
- Produces: `caddy version` отвечает 2.x; `systemctl status caddy` существует но НЕ запущен (порты заняты роутером).

- [ ] **Step 1: Поставить официальный репозиторий и пакет**

```bash
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install -y caddy
caddy version
```

- [ ] **Step 2: Запретить автозапуск до ночи X и проверить**

```bash
systemctl stop caddy; systemctl disable caddy
systemctl status caddy --no-pager | head -n 3
ss -tlnp | grep -E ':80 |:443 ' | head
```

Expected: caddy установлен, остановлен; 80/443 держит только python3 router.py.

- [ ] **Step 3: Скелет Caddyfile в git + commit**

```caddy
{
	email admin@bratuxa.zomb.top
	log {
		output file /var/log/caddy/access.log {
			roll_size 50MiB
			roll_keep 10
		}
		format json
	}
}
# Хосты добавит Task 3. До ночи X этот файл НЕ активен.
```

```bash
mkdir -p /root/sites/infra
git add infra/Caddyfile
git commit -m "infra: Caddy установлен, скелет конфига 🏆"
```


