# Docker Cheat Sheet

Daily commands, Dockerfile best practices, and Compose patterns.

## Daily Commands

```bash
# Containers
docker run -d --name api -p 8080:80 --env-file .env image:tag
docker ps -a                          # all containers, incl. stopped
docker logs -f --tail 100 api         # follow logs
docker exec -it api sh                # shell into a running container
docker stop api && docker rm api

# Images
docker build -t app:1.2.0 .
docker images
docker image prune -f                 # dangling layers

# Debugging
docker inspect api                    # full config JSON
docker stats                          # live CPU/memory per container
docker cp api:/var/log/app.log ./     # pull a file out

# The big cleanup (careful)
docker system prune -a --volumes
```

## Dockerfile Best Practices

The reference PHP-FPM example — every rule annotated:

```dockerfile
# 1. Pin the base — 'latest' is a deploy-time surprise
FROM php:8.4-fpm-alpine AS base

RUN docker-php-ext-install pdo_mysql opcache

# 2. Dependency layer FIRST — caches until composer.json changes
FROM base AS build
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --prefer-dist

# 3. Source last — code changes don't bust the dependency cache
COPY . .
RUN composer dump-autoload --optimize

# 4. Slim runtime stage — build tools never ship
FROM base AS runtime
WORKDIR /app
COPY --from=build /app /app

# 5. Never run as root
RUN addgroup -S app && adduser -S app -G app
USER app

# 6. Health check feeds orchestrators and the deploy gate
HEALTHCHECK --interval=30s --timeout=3s \
    CMD php-fpm-healthcheck || exit 1

EXPOSE 9000
CMD ["php-fpm"]
```

The rules, distilled:

| Rule | Why |
|------|-----|
| Multi-stage builds | Build tools & dev deps stay out of the runtime image |
| Order layers by change frequency (deps → code) | Cache hits = seconds instead of minutes |
| Pin base image versions | Reproducible builds |
| `.dockerignore` from day one | `node_modules`, `.git`, `.env` never enter the context |
| `USER app`, never root | Container escape ≠ root on host |
| One process per container | Logs, restarts, scaling all stay sane |
| `HEALTHCHECK` always | Orchestrators and [deploy verification](../../DEPLOYMENT_GUIDE.md) need it |

```
# .dockerignore — minimum viable
.git
node_modules
vendor
.env*
storage/logs
tests
```

## Compose for Local Dev

```yaml
# compose.yaml
services:
  app:
    build: .
    ports: ["8080:80"]
    env_file: .env
    volumes:
      - .:/app                 # live code mount (dev only!)
    depends_on:
      db:
        condition: service_healthy

  db:
    image: mysql:8.4
    environment:
      MYSQL_DATABASE: app
      MYSQL_ROOT_PASSWORD: secret     # dev only — never prod
    volumes:
      - dbdata:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 5s
      retries: 10

  redis:
    image: redis:7-alpine

volumes:
  dbdata:
```

```bash
docker compose up -d
docker compose logs -f app
docker compose exec app sh
docker compose down            # add -v to also wipe volumes
```

- `depends_on` + `condition: service_healthy` — not just start order, actual readiness
- Named volumes for data; bind mounts for live code in dev only
- One `compose.yaml` + `compose.override.yaml` for personal tweaks (gitignored)

## Images in CI

The [gating pattern](../../LINTING_GATES.md) extends to images:

```yaml
- name: Build image
  run: docker build -t app:${{ github.sha }} .

- name: Scan for vulnerabilities
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: app:${{ github.sha }}
    exit-code: '1'              # HIGH/CRITICAL findings block the pipeline
    severity: HIGH,CRITICAL
```

Tag with the git SHA (traceable) plus a moving tag (`latest`, `1.2`); push only from CI, never from laptops.

## Quick Diagnosis

| Symptom | First Command |
|---------|---------------|
| Container exits immediately | `docker logs api` — usually a config/env crash |
| "Works locally, dies in container" | `docker exec -it api env` — missing env var |
| Port refuses connection | `docker port api` + is the app binding `0.0.0.0`, not `127.0.0.1`? |
| Disk mysteriously full | `docker system df` |
| Slow builds | Layer order — deps before code; check `.dockerignore` |

## See Also

- [Deployment Guide](../../DEPLOYMENT_GUIDE.md)
- [CLI Cheat Sheet](../cli/CLI_CHEAT_SHEET.md)
- [Azure Essentials](../azure/AZURE_ESSENTIALS.md) — running these images in the cloud
