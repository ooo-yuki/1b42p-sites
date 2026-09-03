FROM python:3.11-slim
WORKDIR /srv/sites
COPY . /srv/sites
EXPOSE 80 443
CMD ["python3","router.py"]
