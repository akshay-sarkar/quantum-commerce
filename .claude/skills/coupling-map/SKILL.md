---
name: coupling-map
description: >
  Co-change guide for Quantum Commerce — which files must change together.
  Activate this skill whenever you are about to edit GraphQL types, resolvers,
  frontend queries, models, or auth logic. Also use it when the user says
  "I changed X, what else needs updating?", "what files are coupled?",
  or before committing to do a coupling checklist. Use this proactively
  any time a file with known coupling is touched.
origin: quantum-commerce (derived from git history, 47 commits)
---

# Coupling Map

This skill documents which files consistently change together in Quantum Commerce,
based on analysis of the git history. When you touch one file in a coupling group,
check whether the coupled files also need updating before you finish.

---

## Coupling Group 1 — GraphQL Schema (strongest coupling)

**Files:**
- `backend/src/graphQL/typeDefs/typeDefs.ts`
- `backend/src/graphQL/resolvers/resolvers.ts`

**Rule:** These two files changed together in every single feature commit. Never edit
one without checking whether the other needs a matching update. Adding a type without
a resolver (or vice versa) will cause a runtime schema mismatch.

---

## Coupling Group 2 — Full-Stack Feature (the 3-file frontend sync)

When you add or change a GraphQL query or mutation that returns a new type, or changes
the shape of an existing return type, these three frontend files need to stay in sync:

**Files:**
- `frontend/quantumcommerce-frontend/graphql/gql.ts` — the Apollo document
- `frontend/quantumcommerce-frontend/models/index.ts` — the TypeScript interface
- *(optionally)* the component or page that calls the query

**Rule:** Any time `typeDefs.ts` gets a new type or field, check `models/index.ts` for
the matching TypeScript interface. Any time `resolvers.ts` gets a new query/mutation,
check `gql.ts` for the matching Apollo document.

**Full-stack feature checklist:**
1. `backend/src/models/` — new Mongoose model (if needed)
2. `backend/src/graphQL/typeDefs/typeDefs.ts` — schema type + Query/Mutation declaration
3. `backend/src/graphQL/resolvers/resolvers.ts` — resolver implementation
4. `frontend/quantumcommerce-frontend/graphql/gql.ts` — Apollo `gql` document
5. `frontend/quantumcommerce-frontend/models/index.ts` — TypeScript interface
6. Frontend component or page that uses the data

---

## Coupling Group 3 — Authentication

When editing auth logic, these files travel together:

**Files:**
- `backend/src/graphQL/resolvers/resolvers.ts`
- `backend/src/models/User.ts`
- `backend/src/utils/auth.ts`
- `frontend/quantumcommerce-frontend/contexts/AuthContext.tsx`
- `frontend/quantumcommerce-frontend/graphql/gql.ts`
- `frontend/quantumcommerce-frontend/models/index.ts`

**Rule:** Auth changes ripple from the User model through JWT utilities to the resolver,
then surface in AuthContext and the login mutation on the frontend.

---

## Coupling Group 4 — Cart Feature

**Files:**
- `frontend/quantumcommerce-frontend/stores/cartStore.ts`
- `frontend/quantumcommerce-frontend/components/CartSyncBridge.tsx`
- `frontend/quantumcommerce-frontend/app/cart/_components/CartList.tsx`
- `backend/src/graphQL/resolvers/resolvers.ts` (syncCart mutation)
- `backend/src/graphQL/typeDefs/typeDefs.ts`

**Rule:** Cart state lives in Zustand (`cartStore.ts`) and is synced to the server via
`CartSyncBridge.tsx`. Any change to cart shape needs to update both the Zustand store
and the GraphQL schema together.

---

## Coupling Group 5 — Theme

**Files:**
- `frontend/quantumcommerce-frontend/contexts/ThemeContext.tsx`
- `frontend/quantumcommerce-frontend/app/globals.css`
- `frontend/quantumcommerce-frontend/components/Navbar.tsx`

**Rule:** Theme state flows from `ThemeContext` → `data-theme` on `<html>` → CSS
variables in `globals.css`. Navbar renders the toggle. Changing CSS variables without
updating ThemeContext (or vice versa) breaks the theme toggle.

---

## Commit Convention

Based on git history, this project follows Conventional Commits:

| Prefix | Use for |
|--------|---------|
| `feat:` | New feature (dominant — 19 of 29 conventional commits) |
| `fix:` | Bug fix |
| `refactor:` | Code restructuring without behaviour change |
| `docs:` | Documentation only |
| `style:` | Formatting, no logic change |

Format: `<type>: <short imperative description>`

Examples from history:
- `feat: add admin functionalities for user and product management`
- `fix: resolve 4 HIGH severity security vulnerabilities`
- `refactor: standardize quotes and formatting across components and contexts`

---

## Pre-Commit Coupling Checklist

Run this mentally before every commit:

- [ ] If `typeDefs.ts` changed → did `resolvers.ts` change too?
- [ ] If `resolvers.ts` added a new query/mutation → did `gql.ts` get the Apollo doc?
- [ ] If `typeDefs.ts` added a new return type → did `models/index.ts` get the interface?
- [ ] If `User.ts` changed → did `auth.ts` and `AuthContext.tsx` stay consistent?
- [ ] If `cartStore.ts` changed → did `CartSyncBridge.tsx` stay consistent?
- [ ] If `ThemeContext.tsx` changed → did `globals.css` CSS variables stay consistent?
