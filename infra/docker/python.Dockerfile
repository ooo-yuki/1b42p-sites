# Общий Python-образ (bat42bot, chaev-site роутер). Python 3.11 как на хосте.
# Контекст сборки — папка приложения; старт задаётся через compose `command`.
# Доп. pip-пакеты — через build arg PIP_PKGS.
FROM python:3.11-slim
ARG PIP_PKGS=""
WORKDIR /app
COPY . .
RUN (test -f requirements.txt && pip install --no-cache-dir -r requirements.txt) ; \
    (test -n "$PIP_PKGS" && pip install --no-cache-dir $PIP_PKGS) ; true
