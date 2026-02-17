# CLAUDE.md

## Critical Rules

- **Never commit `.env` or credential files** — use `.gitignore` and GitHub Secrets
- **Always run `npm run lint` before committing** — Husky pre-commit hook enforces Prettier
- **Backend security logic only** — rate limiting, validation, and auth checks belong on the backend, not frontend
- **Test locally before pushing to `main`** — push to `main` triggers production deployment

## Project Overview

Quantum Commerce is a full-stack e-commerce platform. GraphQL API backend deployed via Docker on AWS EC2, Next.js frontend auto-deployed on Vercel.

**Production URLs**:
- Frontend: https://quantum-commerce-pi.vercel.app
- Backend API: https://quantumapi.sarkars.shop/graphql
- Docker Hub Image: `bwoytech/quantum-commerce`

## Quick Start

### Backend (`/backend`)

```bash
npm install               # Install dependencies
npm run dev               # Dev server with hot reload, port 4000
# Verify: curl http://localhost:4000/graphql → should return GraphQL playground
```

### Frontend (`/frontend/quantumcommerce-frontend`)

```bash
npm install               # Install dependencies
npm run dev               # Next.js dev server, port 3000
# Verify: open http://localhost:3000 → should show homepage
```

### Seed Database

```bash
cd backend && npm run seed
# Expected: "Database seeded successfully" with admin + test users + sample products
```

## Development Workflows

### Adding a New Feature (Step-by-Step)

1. Ensure you're on `Integration` branch: `git checkout Integration`
2. Backend changes in `/backend/src/` — add schema types, resolvers, models as needed
3. Frontend changes in `/frontend/quantumcommerce-frontend/src/`
4. Test locally: run both `npm run dev` servers, verify in browser
5. Run `npm run lint` in both directories
6. Commit and push to `Integration`
7. When ready for production: merge `Integration` → `main` (triggers auto-deploy)

### Deployment (Automated via CI/CD)

1. Push to `main` branch
2. GitHub Actions auto-detects backend/frontend changes
3. **Backend path**: Docker Buildx → build multi-platform image (AMD64/ARM64) → push to Docker Hub with auto-incremented version tag → SSH deploy to EC2 via `deploy.sh`
4. **Frontend path**: Build check runs → Vercel auto-deploys
5. **Verify**: Hit https://quantumapi.sarkars.shop/graphql and https://quantum-commerce-pi.vercel.app

### Manual Docker Deployment (if needed)

```bash
./build-and-push.sh <version>          # Local: build & push image to Docker Hub
# SSH into EC2, then:
./deploy.sh <version>                  # EC2: pull image & restart container
```

## Tech Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Apollo Client
- **Backend**: Express, Apollo Server, TypeScript, Mongoose, JWT (jsonwebtoken + bcryptjs)
- **Database**: MongoDB Atlas
- **Infra**: Docker (multi-platform), AWS EC2, Vercel, Cloudflare (DNS + Flexible SSL)
- **CI/CD**: GitHub Actions → Docker Hub → EC2 (auto-versioning via git tags)

## Key Conventions

- **TypeScript** everywhere — backend uses CommonJS, frontend uses ESM
- **Frontend path alias**: `@/*` maps to `src/*`
- **Client components** use `'use client'` directive (Next.js App Router)
- **GraphQL schema and resolvers** are co-located in `backend/src/index.ts`
- **Auth flow**: JWT Bearer tokens → sessionStorage → Apollo Client authLink → GraphQL context
- **Formatting**: Prettier (single quotes) enforced via Husky pre-commit hook + lint-staged on `*.{ts,js,css,md}`
- **Naming**: Use kebab-case for file/folder names, camelCase for variables/functions, PascalCase for components

## Repository Structure

```text
quantum-commerce/
├── .github/workflows/deploy.yml       # CI/CD pipeline
├── backend/
│   ├── src/
│   │   ├── index.ts                   # Express + Apollo Server + schema + resolvers
│   │   ├── models/                    # Mongoose models (User, Product, Cart, Address)
│   │   └── seed.ts                    # Database seeder
│   ├── Dockerfile                     # Multi-stage build (Node 24-alpine)
│   ├── build-and-push.sh              # Docker build & push script
│   └── package.json
└── frontend/quantumcommerce-frontend/
    ├── src/
    │   ├── app/                       # Pages: layout, home, products, login, cart
    │   ├── components/                # Navbar, ProtectedRoute
    │   ├── contexts/                  # AuthContext (React Context API)
    │   └── lib/                       # Apollo Client setup with auth link
    └── package.json
```

## Environment Variables

### Backend (`.env`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `quantumcommerce` |
| `JWT_SECRET` | JWT signing secret | (keep secret) |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `CORS_ALLOWED_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:3000,https://quantum-commerce-pi.vercel.app` |

### Frontend (`.env.local`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint | `https://quantumapi.sarkars.shop/graphql` |

### GitHub Secrets (CI/CD)

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `EC2_SSH_KEY`, `EC2_HOST`, `EC2_USERNAME`

## Database Models

- **User**: email, password, firstName, lastName, userType (BUYER/ADMIN), address ref
- **Product**: name, description, price, inventory, category (Electronics/Clothing/Books/Furniture), imageUrl, addedBy ref
- **Cart**: userId (unique), items [{productId, quantity}], updatedAt
- **Address**: street, city, state, zip, country

## Completed Features

- **Authentication**: Login/signup with JWT, AuthContext (sessionStorage), ProtectedRoute, Apollo Client auto-injects Authorization headers
- **Product Catalog**: GraphQL queries, product listing with images, responsive Tailwind UI
- **Deployment**: Dockerized backend on EC2, frontend on Vercel, Cloudflare SSL/DNS
- **CI/CD**: GitHub Actions auto-detects changes, semantic versioning, Docker build/push/deploy
- **Security**: CORS configured, Cloudflare Flexible SSL, CSRF protection, JWT auth

## Not Yet Implemented

| Feature | Notes | Priority |
|---------|-------|----------|
| Rate Limiting | Backend-only (frontend can be bypassed). Protect registration endpoint. | High |
| Shopping Cart UI | Backend mutations exist. Wire up frontend cart page. | High |
| Checkout / Orders | No order model, payment, or checkout flow yet. | Medium |
| Admin Panel | ADMIN role exists in schema. No admin UI for product management. | Medium |
| Testing | No test suite (`npm test` is a stub). Add unit + integration tests. | Medium |

## Troubleshooting

### CORS Errors

**Symptom**: `Access-Control-Allow-Origin` errors in browser console
**Cause**: Frontend origin not in `CORS_ALLOWED_ORIGINS`
**Fix**: Add the frontend URL to `CORS_ALLOWED_ORIGINS` in backend `.env` and restart the server

### Mixed Content (HTTPS → HTTP)

**Symptom**: Browser blocks requests from Vercel (HTTPS) to EC2 (HTTP)
**Cause**: Cloudflare Flexible SSL terminates HTTPS at Cloudflare, forwards HTTP to EC2
**Fix**: Use the Cloudflare proxied domain (`quantumapi.sarkars.shop`) instead of direct EC2 IP

### MongoDB Atlas Connection Failed

**Symptom**: `MongoServerError: connection refused`
**Cause**: EC2 IP not whitelisted in Atlas
**Fix**: Go to MongoDB Atlas → Network Access → Add EC2's public IP (or `0.0.0.0/0` for dev)

### Docker Build Fails on EC2

**Symptom**: `exec format error` when running container
**Cause**: Image built for wrong architecture
**Fix**: Use multi-platform build: `docker buildx build --platform linux/amd64,linux/arm64`

### Auth Token Issues

**Symptom**: Protected routes redirect to login despite being logged in
**Cause**: Token expired or missing from sessionStorage
**Fix**: Check browser DevTools → Application → Session Storage for `token`. If expired, log in again.

## Git Workflow

- **`main`** — production branch, push triggers auto-deployment
- **`Integration`** — feature integration branch, merge to `main` when ready
- Backend changes on `main` → Docker build → EC2 deploy
- Frontend changes on `main` → Vercel auto-deploys
- Pre-commit hooks run Prettier via lint-staged

## User (AKSHAY) Preferences

- Prefers guided learning through leading questions over direct answers
- Approaches development with production-ready practices from the start
- Building this as a portfolio project to demonstrate full-stack + DevOps skills
