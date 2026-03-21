---
name: docker-patterns
description: Docker and Docker Compose patterns for local development, container security, networking, volume strategies, and multi-platform builds. Activate when working on Dockerfile, docker-compose, or deployment configuration.
origin: ECC
---

# Docker Patterns

## When to Activate

- Setting up or modifying Dockerfile
- Reviewing Docker Compose configuration
- Troubleshooting container networking or volume issues
- Building multi-platform images (AMD64/ARM64)
- Migrating from local dev to containerised workflow

## Multi-Stage Dockerfile (this project's pattern)

```dockerfile
# Stage: dependencies
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Stage: build
FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm prune --production

# Stage: production (minimal image)
FROM node:24-alpine AS production
WORKDIR /app
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001
USER appuser
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
COPY --from=build --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=build --chown=appuser:appgroup /app/package.json ./
ENV NODE_ENV=production
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:4000/graphql || exit 1
CMD ["node", "dist/index.js"]
```

## Multi-Platform Build (AMD64 + ARM64)

```bash
# Build and push multi-platform image
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t bwoytech/quantum-commerce:1.0.0 \
  --push .
```

## .dockerignore

```
node_modules
dist
.git
.env
.env.*
*.log
coverage
```

## Volume Strategies

```yaml
volumes:
  # Named volume: persists across restarts (use for DB data)
  mongodata:

  # Bind mount: maps host to container (use for hot reload in dev)
  # - .:/app

  # Anonymous volume: protect container paths from bind mount override
  # - /app/node_modules
```

## Container Security

```dockerfile
# 1. Use specific tags — never :latest
FROM node:24.2-alpine3.20

# 2. Run as non-root
RUN addgroup -g 1001 -S app && adduser -S app -u 1001
USER app

# 3. No secrets in image layers — use runtime env vars
# NEVER: ENV API_KEY=sk-xxxxx
```

## Debugging Commands

```bash
# View logs
docker compose logs -f app
docker compose logs --tail=50

# Shell into container
docker compose exec app sh

# Inspect
docker compose ps
docker stats

# Rebuild
docker compose up --build
docker compose build --no-cache app

# Clean up
docker compose down -v    # WARNING: removes volumes too
docker system prune       # Remove unused images/containers
```

## Anti-Patterns

```
❌ Using :latest tag — pin to specific versions
❌ Running as root — always create a non-root user
❌ Secrets in docker-compose.yml — use .env files (gitignored)
❌ Storing data in containers without volumes — data lost on restart
❌ One giant container with all services — one process per container
```
