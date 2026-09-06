# SDD ledger — plan: /root/sites/docs/superpowers/plans/2026-09-06-caddy-docker-infra.md
BASE=f719672
Preflight scan (пары с общими файлами/интерфейсами):
- T1 skeleton infra/Caddyfile vs T3 full pilot-config: T3 перезаписывает целиком — ок.
- T2 container :8081 vs T3/T5: производят→потребляют — ок.
- T3 validate-gate vs T4/T5: без зелёного validate дальше нельзя — ок.
- T5 cutover vs T7/T8: сначала ночь X, потом миграции и снос — ок.
- T6 observability независим от миграций, зависит только от Caddy на 80/443 (T5) — ок.
- Global: прод (80/443, chaev-site) не трогаем до T5; T1 caddy ставим но НЕ запускаем; T4 репетиция только :8080/:8443 и временный тыл.
Scan clean, rulings на старте не нужны.
BASE-HEAD=8f5a758 (план f719672 + чужой коммит сверху; диффы тасков считать от HEAD на момент диспетча).
BASE1=8f5a758

Task 1: review Spec ✅ Quality high (1 cosmetic minor fixed inline: reset-failed caddy).
Task 1: complete (commits 8f5a758..6f0bfc4, review clean).
BASE2=85563a0

Task 2: review Spec ✅ Quality GOOD (1 minor deferred: pin digest follow-up).
Task 2: complete (commits 85563a0..b16f8b5, review clean).
BASE3=b16f8b5

Task 3 attempt 1: implementer wrote files + router binds, but validate FAILED on plan defect; summary mangled, no commit.
Ruling: `tls { dns off }` не существует в Caddy (моя ошибка в плане) — авто-TLS по умолчанию, блок удалён из плана/брифа/рабочего Caddyfile — цена ошибки: была бы невалидная конфигурация на ночи X.
Task 3: fix round 1/5 (validate + commit + report).

Task 3: attempt 1 plan-defect (tls dns off) → ruling + fix round 1 → DONE c1dc133, review Spec ✅ Quality high.
Task 3: complete (review clean).
BASE4=c1dc133

Task 4: DONE 20/20 + bonus SNI, no repo changes. Rulings из репетиции: (1) sed-метод мёртв — рабочий метод записан в план T4 (http_port/https_port, тыл на 18080/18443, схемы http+https, local_certs, caddy run фоном); (2) Ночь X: restart chaev-site а НЕ stop — роутер с новыми биндами нужен как тыл :8080 (иначе 19 хостам некуда проксировать); бекап router.py + откат с восстановлением файла; (3) /etc/caddy/Caddyfile пакетный дефолт конкурирует за :80 — Night X перезаписывает нашим (в плане); (4) первый запрос домена триггерит выпуск серта — curl-матрица T5 даёт естественный stagger.

Инцидент stray-caddy: pid 60030 (`caddy run --config /etc/caddy/Caddyfile`, остаток репетиции T4) жил с дефолтом :80→/usr/share/caddy; убит мной (kill, проверено dead), прод цел (:80 200, :8081 200, chaev-site active). Ruling: ручной caddy запрещён вне задач — только systemd-юнит; /etc/caddy/Caddyfile перезапишется нашим на ночи X (план T5) — цена ошибки: гонка за :80 и чужая заглушка вместо сайтов.

Task 4: review Spec ✅ Quality good (формально закрыт батчем; stray pid 60030 уже убит мной ранее).
Task 4: complete (no code changes).
BASE5=c1dc133

Task 5: CUTOVER-OK (даунтайм ~1 мин, матрица 20/20, браузер чист; заминка access.log owner → chown; favicon 404 pre-existing косметика).

Task 5: review Spec ✅ PASS (матрица 20/20 перепроверена, браузер canvas visible). F1 (1b42p.ru в отчёте) — не воспроизводится (grep пуст), закрыт. F2-F5 info/косметика.
Task 5: complete (CUTOVER-OK, review clean).
BASE6=c1dc133
