---
name: security-review
description: Audit the Quantum Commerce codebase for security vulnerabilities. Use when the user says "security review", "check security", "audit auth", "find vulnerabilities", or "is this secure". Checks JWT, auth flows, input validation, CORS, rate limiting, and exposed endpoints.
---

# Security Review

You are performing a security audit of the Quantum Commerce backend and frontend. Work through each category methodically and report findings with severity (High / Medium / Low) and a concrete fix for each issue.

## Step 1: Authentication & JWT

Read:
- `backend/src/utils/auth.ts`
- `backend/src/graphQL/resolvers/resolvers.ts` (login, register, googleLogin resolvers)

Check:
- [ ] Is `JWT_SECRET` loaded from env? Is the default secret changed in production?
- [ ] Is JWT expiry set appropriately? (current: 5 days — consider shorter for sensitive ops)
- [ ] Are tokens verified server-side on every protected request?
- [ ] Does the `context` function in `index.ts` correctly reject invalid tokens (not just ignore them)?
- [ ] Google OAuth: Is the `idToken` fully validated (audience, issuer, email_verified)?

## Step 2: Input Validation

Read the `register` and `login` resolvers.

Check:
- [ ] Email: validated with regex server-side?
- [ ] Password: minimum length + complexity enforced server-side?
- [ ] firstName/lastName: length limits? XSS-safe (not rendered as HTML)?
- [ ] Are all user-supplied strings sanitized before use in queries?
- [ ] Are MongoDB queries using parameterized inputs (Mongoose handles this, verify no raw query construction)?

## Step 3: Rate Limiting

Check `backend/src/index.ts`:
- [ ] Is there any rate limiting middleware (express-rate-limit or similar)?
- [ ] Is the `/register` endpoint protected against brute-force?
- [ ] Is the `/login` endpoint protected against credential stuffing?

If missing, flag as **High** and suggest: `npm install express-rate-limit` with a snippet.

## Step 4: CORS Configuration

Read `backend/src/index.ts`.

Check:
- [ ] Is `CORS_ALLOWED_ORIGINS` set from env (not hardcoded)?
- [ ] Are allowed origins restricted to known domains (no `*` in production)?
- [ ] Are credentials (`credentials: true`) only used when needed?

## Step 5: Token Storage

Read `frontend/quantumcommerce-frontend/contexts/AuthContext.tsx` and `graphql/client.ts`.

Check:
- [ ] Tokens stored in `sessionStorage` (cleared on tab close — good) vs `localStorage` (persists — XSS risk)?
- [ ] Is there any token sent in URL parameters (never acceptable)?
- [ ] Are tokens only sent over HTTPS in production?

## Step 6: GraphQL Security

Check `backend/src/index.ts` Apollo Server config:

- [ ] Is `introspection` disabled in production? (exposes full schema to attackers)
- [ ] Is there query depth limiting? (deeply nested queries = DoS risk)
- [ ] Is there query complexity limiting?
- [ ] Are errors revealing stack traces in production? (`NODE_ENV=production` suppresses this in Apollo)

## Step 7: Sensitive Data Exposure

Search the codebase:
- [ ] Any `console.log` with user data, tokens, or passwords?
- [ ] Passwords returned in any GraphQL response type?
- [ ] Any hardcoded secrets in source files (check for strings matching `secret`, `key`, `password`, `token`)?

## Step 8: Environment Variables

Check `.gitignore`:
- [ ] Is `.env` in `.gitignore`?
- [ ] Are any secrets committed to git history? (`git log --all -- .env`)

## Step 9: Report

Present findings in this format:

```
## Security Audit Report — Quantum Commerce

### High Severity
- [Area] Issue description
  Fix: concrete recommendation

### Medium Severity
- [Area] Issue description
  Fix: concrete recommendation

### Low Severity
- [Area] Issue description
  Fix: concrete recommendation

### Passed Checks
- List what's already secure

### Recommended Next Actions (in priority order)
1. ...
2. ...
```

After the report, ask: "Would you like me to implement any of these fixes?"
