# Роутер-тыл :8080/:8443 (до нативной миграции в Caddy по плану T7).
FROM python:3.11-slim
WORKDIR /app
COPY router.py ./
CMD ["python", "router.py"]
