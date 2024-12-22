# web-glossary

## Сборка контейнера из исходников

```bash
wget https://github.com/asmalcev/web-glossary/archive/refs/heads/main.zip

unzip main.zip

cd web-glossary-main

docker-compose up
```

## Запуск готового контейнера

```yml
version: "3.8"

services:
  api:
    image: qzerrty/web-glossary-main-api
    ports:
      - "8000:8000"
```

```bash
docker-compose up
```

## Документация API

- `openapi.json` — Спека API
- `/docs` — Документация API
