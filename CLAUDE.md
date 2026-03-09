# CLAUDE.md

## Critical Rules

- **Never commit `.env` or credential files** — use `.gitignore` and GitHub Secrets
- **Always run `npm run lint` before committing** — Husky pre-commit hook enforces Prettier
- **Backend security logic only** — rate limiting, validation, and auth checks belong on the backend, not frontend
- **Test locally before pushing to `main`** — push to `main` triggers production deployment
- **Working branch is `Integration`** — never commit directly to `main`

## Project Overview

Quantum Commerce is a full-stack e-commerce platform built as a portfolio project. GraphQL API backend deployed via Docker on AWS EC2, Next.js frontend auto-deployed on Vercel.

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
# Default credentials: admin@quantumcommerce.com / admin123, akshay.sarkar@quantumcommerce.com / test123
```

## Development Workflows

### Adding a New Feature (Step-by-Step)

1. Ensure you're on `Integration` branch: `git checkout Integration`
2. Backend changes in `/backend/src/` — add types to `graphQL/typeDefs/typeDefs.ts`, resolvers to `graphQL/resolvers/resolvers.ts`, models to `models/`
3. Frontend changes in `/frontend/quantumcommerce-frontend/` — pages in `app/`, components in `components/`, state in `stores/`
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

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Apollo Client, Zustand
- **Backend**: Express, Apollo Server, TypeScript, Mongoose, JWT (jsonwebtoken + bcryptjs), google-auth-library
- **Database**: MongoDB Atlas
- **Infra**: Docker (multi-platform AMD64/ARM64), AWS EC2, Vercel, Cloudflare (DNS + Flexible SSL)
- **CI/CD**: GitHub Actions → Docker Hub → EC2 (auto-versioning via git tags)

## Key Conventions

- **TypeScript** everywhere — backend uses CommonJS (`tsc` to `dist/`), frontend uses ESM
- **Frontend path alias**: `@/*` maps to project root (e.g. `@/components/Navbar`)
- **Client components** use `'use client'` directive (Next.js App Router)
- **GraphQL schema** lives in `backend/src/graphQL/typeDefs/typeDefs.ts`
- **GraphQL resolvers** live in `backend/src/graphQL/resolvers/resolvers.ts`
- **Auth flow**: JWT Bearer tokens → sessionStorage → Apollo Client authLink → GraphQL context
- **Cart state**: Zustand (localStorage) + CartSyncBridge component syncs to server on auth
- **Theme state**: ThemeContext (localStorage) → `data-theme` attribute on `<html>` → CSS variables
- **Formatting**: Prettier (single quotes) enforced via Husky pre-commit hook + lint-staged on `*.{ts,js,css,md}`
- **Naming**: kebab-case for files/folders, camelCase for variables/functions, PascalCase for components

## Repository Structure

```text
quantum-commerce/
├── .github/workflows/deploy.yml         # CI/CD pipeline (backend Docker + frontend Vercel)
├── backend/
│   ├── src/
│   │   ├── index.ts                     # Express + Apollo Server entry point
│   │   ├── config/
│   │   │   └── database.ts              # MongoDB connection via Mongoose
│   │   ├── graphQL/
│   │   │   ├── typeDefs/typeDefs.ts     # All GraphQL type definitions
│   │   │   └── resolvers/resolvers.ts   # All GraphQL resolvers
│   │   ├── models/
│   │   │   ├── User.ts                  # User schema (BUYER, ADMIN, G_BUYER)
│   │   │   ├── Product.ts               # Product schema (Electronics/Clothing/Books/Furniture)
│   │   │   ├── Cart.ts                  # Cart schema (userId unique, items array)
│   │   │   └── Address.ts               # Address schema
│   │   ├── utils/
│   │   │   └── auth.ts                  # JWT helpers, bcrypt, token generation
│   │   └── scripts/
│   │       └── seed.ts                  # Dev database seeder
│   ├── dist/                            # Compiled JS output (gitignored)
│   ├── Dockerfile                       # Multi-stage build (Node 24-alpine)
│   ├── build-and-push.sh                # Docker build & push script
│   └── package.json
└── frontend/quantumcommerce-frontend/
    ├── app/
    │   ├── layout.tsx                   # Root layout: providers, Navbar, Footer, CartSyncBridge
    │   ├── page.tsx                     # Homepage: hero, categories, tech stack, CTA
    │   ├── login/page.tsx               # Login + signup form with Google OAuth
    │   ├── products/page.tsx            # Product grid with GraphQL query
    │   ├── cart/page.tsx                # Cart page (ProtectedRoute)
    │   ├── cart/_components/
    │   │   ├── CartList.tsx             # Cart items list with quantity controls
    │   │   └── SaveForLaterList.tsx     # Save-for-later items (local only)
    │   ├── about/page.tsx               # About page: tech stack, author info
    │   └── globals.css                  # Tailwind + custom qc-* CSS variables & animations
    ├── components/
    │   ├── Navbar.tsx                   # Top nav: logo, links, theme toggle, cart badge, auth
    │   ├── Footer.tsx                   # Footer
    │   ├── Product.tsx                  # Product card: image, name, price, add/remove cart
    │   ├── ProductImage.tsx             # Product image with fallback
    │   ├── GoogleLoginButton.tsx        # Google OAuth button (@react-oauth/google)
    │   ├── CartSyncBridge.tsx           # Invisible: syncs Zustand cart ↔ server (debounced 700ms)
    │   └── ProtectedRoute.tsx           # Redirects unauthenticated users to /login
    ├── contexts/
    │   ├── AuthContext.tsx              # Auth state: user, token, login/signup/logout/googleLogin
    │   └── ThemeContext.tsx             # Dark/light theme with localStorage persistence
    ├── graphql/
    │   ├── client.ts                    # Apollo Client: HTTP link + auth link (Bearer token)
    │   └── gql.ts                       # All GraphQL queries and mutations
    ├── stores/
    │   └── cartStore.ts                 # Zustand: cart + saveForLater, persisted to localStorage
    ├── hooks/
    │   └── useLocalStorage.ts           # Custom localStorage hook
    ├── models/
    │   └── index.ts                     # TypeScript interfaces: IProduct, IUser, ICart, etc.
    ├── providers/
    │   ├── ApolloProvider.tsx           # Apollo Client provider wrapper
    │   └── GoogleAuthProvider.tsx       # Google OAuth provider wrapper
    ├── types/
    │   └── global.d.ts                  # Global type declarations
    └── package.json
```

## Environment Variables

### Backend (`.env`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `quantumcommerce` |
| `JWT_SECRET` | JWT signing secret | (keep secret, min 32 chars) |
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `CORS_ALLOWED_ORIGINS` | Allowed origins (comma-separated) | `http://localhost:3000,https://quantum-commerce-pi.vercel.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth app client ID | (from Google Cloud Console) |
| `ADMIN_PASSWORD` | Admin seed user password | `admin123` |
| `USER_PASSWORD` | Test seed user password | `test123` |

### Frontend (`.env.local`)

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_GRAPHQL_URL` | GraphQL endpoint | `https://quantumapi.sarkars.shop/graphql` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID (public) | (from Google Cloud Console) |

### GitHub Secrets (CI/CD)

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `EC2_SSH_KEY`, `EC2_HOST`, `EC2_USERNAME`

## Database Models

- **User**: `email` (unique), `password`, `firstName`, `lastName`, `userType` (BUYER/ADMIN/G_BUYER), `address` (ref), `createdAt`
- **Product**: `id` (custom string), `name`, `description`, `price`, `inventory`, `category`, `imageUrl`, `isActive`, `addedBy` (ref), `createdAt`
- **Cart**: `userId` (unique ref), `items` [{`product` ref, `quantity`}], `updatedAt`
- **Address**: `street`, `city`, `state`, `zip`, `country`

## GraphQL API

### Queries
| Query | Auth | Description |
|-------|------|-------------|
| `products` | No | Fetch all products |
| `product(id)` | No | Fetch single product (custom id or MongoDB _id) |
| `me` | Yes | Current authenticated user |
| `myCart` | Yes | Current user's cart with populated products |
| `systemStatus` | No | API health check with DB status |

### Mutations
| Mutation | Auth | Description |
|----------|------|-------------|
| `register(input)` | No | Create account (email, password, firstName, lastName) |
| `login(input)` | No | Login with email + password → JWT |
| `loginWithGoogle(idToken)` | No | Login/create account via Google → JWT |
| `syncCart(input)` | Yes | Upsert cart items to server |

## Completed Features

- **Authentication**: JWT login/signup with validation, Google OAuth 2.0, AuthContext (sessionStorage), ProtectedRoute, Apollo Client auto-injects Bearer token
- **User Types**: BUYER (email/password), G_BUYER (Google OAuth), ADMIN
- **Product Catalog**: GraphQL product queries, responsive product grid, product cards with cart integration
- **Shopping Cart**: Zustand state (localStorage), add/remove/quantity controls, save-for-later, CartSyncBridge syncs both cart and save-for-later to server on login
- **Save-for-Later Server Sync**: Persisted to MongoDB via `savedForLaterItems` on Cart model; synced bidirectionally on auth and on change (debounced)
- **Theme System**: Dark/light mode toggle, CSS variables, localStorage persistence
- **Pages**: Home, Products, Cart (protected), Login/Signup, About
- **Deployment**: Dockerized backend on EC2 (multi-platform), frontend on Vercel, Cloudflare SSL/DNS
- **CI/CD**: GitHub Actions auto-detects changes, semantic versioning, Docker build/push/deploy pipeline

## Not Yet Implemented

| Feature | Notes | Priority |
|---------|-------|----------|
| Rate Limiting | Backend-only. Protect registration + login endpoints | High |
| Checkout / Orders | No Order model, payment processing, or checkout flow | High |
| Product Filtering & Search | No filter by category/price, no search bar | Medium |
| Admin Panel | ADMIN role exists; no UI to add/edit/delete products | Medium |
| Testing | `npm test` is a stub. Needs unit + integration tests | Medium |
| Wishlist | No wishlist feature | Low |
| Order History | Users can't view past orders | Low |

## Known Bugs

_No known bugs at this time._

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
**Fix**: MongoDB Atlas → Network Access → Add EC2's public IP (or `0.0.0.0/0` for dev)

### Docker Build Fails on EC2

**Symptom**: `exec format error` when running container
**Cause**: Image built for wrong architecture
**Fix**: Use multi-platform build: `docker buildx build --platform linux/amd64,linux/arm64`

### Auth Token Issues

**Symptom**: Protected routes redirect to login despite being logged in
**Cause**: Token expired or missing from sessionStorage
**Fix**: Check DevTools → Application → Session Storage for `token`. If missing/expired, log in again.

### Cart Not Syncing

**Symptom**: Cart items missing after login
**Cause**: CartSyncBridge debounce or race condition; or cart was never synced before logout
**Fix**: Add item to cart after logging in — CartSyncBridge fetches server cart on auth, then syncs on change

## Git Workflow

- **`main`** — production branch, push triggers auto-deployment
- **`Integration`** — active development branch, always work here
- Backend changes on `main` → Docker build → EC2 deploy
- Frontend changes on `main` → Vercel auto-deploys
- Pre-commit hooks run Prettier via lint-staged

## Claude Code Skills

Skills are invoked with `/skill-name` and help automate common tasks in this project.

### Active Skills (use these)

| Skill | When to Use |
|-------|-------------|
| `/frontend-design` | Building or redesigning any UI — pages, components, layouts. Generates high-quality, production-grade React/Tailwind code. Use before writing any frontend component from scratch. |
| `/extract-errors` | Scan the codebase for TypeScript errors, runtime bugs, and warnings before committing or debugging. |

### Recommended Skills to Add

These don't exist yet but would be high-value for this project:

| Skill | What It Would Do | Why Useful |
|-------|-----------------|------------|
| `/graphql-schema` | Generate or update GraphQL typeDefs and matching TypeScript interfaces together | Schema + types drift constantly as features grow |
| `/test-writer` | Generate Jest/Vitest unit tests for resolvers, components, and utilities | Test coverage is currently zero |
| `/security-review` | Check auth flows, input validation, JWT handling, and exposed endpoints for vulnerabilities | Auth + API surface changes frequently |
| `/seed-data` | Generate realistic seed data scripts for new models | Speeds up local dev when adding new features |

## User (AKSHAY) Preferences

- Learning project — prefers guided questions over direct answers to build understanding
- Production-ready practices from day one (Docker, CI/CD, JWT, CORS, etc.)
- Portfolio project demonstrating full-stack + DevOps skills
- Comfortable with TypeScript, GraphQL, Next.js App Router patterns
