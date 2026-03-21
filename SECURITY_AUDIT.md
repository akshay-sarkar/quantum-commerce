# Security Audit Report — Quantum Commerce
_Audited: 2026-03-09 | Branch: Integration_

---

## HIGH Severity

### 1. [Auth] Google OAuth accounts can be hijacked via regular login
**File:** `backend/src/graphQL/resolvers/resolvers.ts:218`

When a Google OAuth user is created, their password is set to a bcrypt hash of
their own **email address**:
```ts
const hashedPassword = await hashPassword(payload?.email ?? ('' + JWT_SECRET));
```
The regular `login` mutation has no guard against G_BUYER accounts. An attacker
who knows a victim's email can call `login({ email: "victim@gmail.com", password:
"victim@gmail.com" })` and it will succeed — because the stored hash matches the
email string.

**Fix:** In the `login` resolver, after fetching the user, check `user.userType`:
```ts
if (user.userType === 'G_BUYER') {
  throw new Error('Please sign in with Google');
}
```

---

### 2. [Auth] Hardcoded fallback JWT secret
**File:** `backend/src/utils/auth.ts:5-6`

```ts
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
```
If `JWT_SECRET` is missing from the environment (misconfiguration, missing `.env`),
the server silently falls back to a known public string. Anyone can forge valid
JWTs with that string.

**Fix:** Fail fast at startup instead of falling back:
```ts
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET environment variable is not set');
```

---

### 3. [Rate Limiting] No rate limiting on any endpoint
**File:** `backend/src/index.ts` — no `express-rate-limit` or similar middleware

`/login`, `/register`, and `syncCart` are completely unprotected. An attacker can
run unlimited credential-stuffing or brute-force attacks with no throttling.

**Fix:** Install `express-rate-limit` and apply strict limits to auth routes:
```bash
npm install express-rate-limit
```
```ts
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/graphql', authLimiter);
```
Consider a tighter limit (5 req / 15 min) specifically for login/register by
inspecting the GraphQL operation name in a custom handler.

---

### 4. [Secrets] `.gitignore` file is deleted
**Status:** `D .gitignore` in working tree (not yet committed, but at risk)

The root `.gitignore` was deleted. Without it, `git add .` on any future commit
will include `.env`, `credentials.json`, `token.json`, and other secret files,
potentially pushing them to the remote repository.

**Fix:** Restore it immediately:
```bash
git checkout HEAD -- .gitignore
```
Verify `.env`, `*.pem`, `credentials.json`, and `token.json` are listed in it.

---

## MEDIUM Severity

### 5. [Auth] Google login error handler returns a string instead of throwing
**File:** `backend/src/graphQL/resolvers/resolvers.ts:186-188`

```ts
} catch (error: any) {
  console.error('Google verification failed:', error.message);
  return `Google login failed`;   // ← returns a plain string, not AuthPayload
}
```
The return type of `loginWithGoogle` is `AuthPayload!` (object with `token` and
`user`). Returning a string causes a type mismatch that Apollo may surface as an
unexpected error structure, and error details are swallowed silently.

**Fix:**
```ts
} catch (error: any) {
  throw new Error('Google authentication failed. Please try again.');
}
```

---

### 6. [GraphQL] Introspection enabled in production
**File:** `backend/src/index.ts:33`

```ts
introspection: true,
```
Introspection exposes the full schema (all types, queries, mutations, arguments)
to anyone who sends an introspection query. This is useful in development but is
a reconnaissance gift to attackers in production.

**Fix:**
```ts
introspection: process.env.NODE_ENV !== 'production',
```

---

### 7. [GraphQL] No query depth or complexity limiting
**File:** `backend/src/index.ts` — no depth-limit or complexity plugin installed

A malicious client can send deeply nested queries that force the server to do
exponential work (e.g. `product { addedBy { ... } }` recursively). This is a
potential DoS vector.

**Fix:** Install `graphql-depth-limit`:
```bash
npm install graphql-depth-limit
```
```ts
import depthLimit from 'graphql-depth-limit';

const server = new ApolloServer({
  validationRules: [depthLimit(5)],
  ...
});
```

---

### 8. [Validation] `syncCart` — no server-side quantity bounds
**File:** `backend/src/graphQL/resolvers/resolvers.ts:147-156`

The `quantity` field from client input is written directly to the database with no
validation. A client can send `quantity: 0`, `quantity: -5`, or `quantity: 999999`.
The Cart model has `min: 1` on the schema but that only fires on `save()`, not on
`findOneAndUpdate()` with raw objects.

**Fix:** Validate quantity in the resolver before writing:
```ts
if (item.quantity < 1 || item.quantity > 100 || !Number.isInteger(item.quantity)) {
  throw new Error(`Invalid quantity for product ${item.productId}`);
}
```

---

### 9. [Validation] `syncCart` — no limit on cart array size
**File:** `backend/src/graphQL/resolvers/resolvers.ts:147-156`

There is no cap on how many items can be sent in a single `syncCart` call. A
client could send thousands of items in one request, triggering thousands of DB
lookups (`findProductByIdentifier` fires per item) and overwriting the cart.

**Fix:** Add a guard at the top of the syncCart resolver:
```ts
const MAX_CART_ITEMS = 100;
if (items.length > MAX_CART_ITEMS || savedForLaterItems.length > MAX_CART_ITEMS) {
  throw new Error('Cart exceeds maximum allowed items');
}
```

---

### 10. [Auth] `NODE_ENV` not enforced — Apollo may expose stack traces
**File:** `backend/src/index.ts`

Apollo Server 2/3 suppresses stack traces automatically when `NODE_ENV=production`.
If the server starts without `NODE_ENV` being set (misconfiguration), internal
error details and stack traces will be returned to clients in GraphQL error
responses.

**Fix:** Add a startup guard:
```ts
if (!process.env.NODE_ENV) {
  console.warn('WARNING: NODE_ENV is not set. Defaulting to development mode.');
}
```
And ensure `NODE_ENV=production` is explicitly set in the Docker environment and
EC2 deployment scripts.

---

## LOW Severity

### 11. [Validation] No max-length on firstName, lastName, or email
**File:** `backend/src/graphQL/resolvers/resolvers.ts:71-77`

firstName and lastName have no upper length bound. Very long strings can bloat
the database and cause subtle issues in rendering contexts.

**Fix:**
```ts
if (firstName.trim().length > 50) throw new Error('First name is too long');
if (lastName.trim().length > 50)  throw new Error('Last name is too long');
if (email.length > 254)           throw new Error('Email is too long');
```

---

### 12. [Auth] No upper bound on password length (bcrypt 72-char truncation)
**File:** `backend/src/graphQL/resolvers/resolvers.ts:79`

bcrypt silently truncates input at 72 characters. A password of 72 chars and one
of 1000 chars with the same first 72 characters are treated as identical. This is
rarely exploited but also allows giant strings to be submitted with no rejection.

**Fix:** Cap input before hashing:
```ts
if (password.length > 72) throw new Error('Password must be 72 characters or fewer');
```

---

### 13. [JWT] 5-day token expiry with no refresh mechanism
**File:** `backend/src/utils/auth.ts:7`

`JWT_EXPIRES_IN = '5d'` — tokens are valid for 5 days with no revocation mechanism
(no token blocklist, no refresh token flow). A stolen token stays valid for up to
5 days.

**Fix (short-term):** Reduce to `'1d'` or `'8h'`.
**Fix (long-term):** Implement a short-lived access token + refresh token pattern,
or maintain a server-side token blocklist (Redis) for logout invalidation.

---

### 14. [Logging] Cart contents logged to browser console in production
**File:** `frontend/quantumcommerce-frontend/components/CartSyncBridge.tsx:53,65,73,100`

Multiple `console.log` statements output full cart data, product names, and sync
state to the browser console. This is visible to anyone who opens DevTools.

**Fix:** Remove or gate behind a dev flag:
```ts
if (process.env.NODE_ENV === 'development') {
  console.log("Fetched cart data:", data);
}
```

---

### 15. [Auth] `isAuthenticated` is based on user object presence, not token validity
**File:** `frontend/quantumcommerce-frontend/contexts/AuthContext.tsx:108`

```ts
isAuthenticated: !!user,
```
If the token expires but `user` is still in sessionStorage (e.g. tab left open),
`isAuthenticated` remains `true` client-side. The server will correctly reject
calls, but the UI will not reflect the expired state until the next API call fails.

**Fix:** On every app load, validate the token expiry client-side using a JWT
decode library (no secret needed for decoding, only for verification):
```ts
import { jwtDecode } from 'jwt-decode';
const decoded = jwtDecode<{ exp: number }>(token);
if (decoded.exp * 1000 < Date.now()) { logout(); }
```

---

## Passed Checks

- Email validated with regex server-side ✓
- Password complexity enforced (letter + number, min 6 chars) ✓
- Generic error message on login failure — no user enumeration ✓
- Duplicate email check before register ✓
- Google OAuth: `audience`, `issuer`, and `email_verified` all validated ✓
- `password` field excluded from GraphQL `User` type — cannot be queried ✓
- MongoDB queries use Mongoose parameterization — no raw query injection risk ✓
- Token stored in `sessionStorage` (not `localStorage`) — cleared on tab close ✓
- CORS origins loaded from environment variable, not hardcoded ✓
- `csrfPrevention: true` set on Apollo Server ✓
- No `.env` committed to git history ✓
- Bearer token stripping handled gracefully — invalid tokens return empty context ✓

---

## Recommended Fix Order

1. **Restore `.gitignore`** — takes 30 seconds, prevents catastrophic secret leaks
2. **Block G_BUYER login via password** — one-line fix, closes account takeover hole
3. **Fail fast on missing JWT_SECRET** — one-line fix, eliminates forged-token risk
4. **Add rate limiting** — install one package, add ~10 lines in `index.ts`
5. **Fix Google login error handler** — change `return string` to `throw new Error`
6. **Disable introspection in production** — one-line fix
7. **Add syncCart quantity + array-size validation** — prevents data integrity abuse
8. **Add query depth limiting** — install one package, add one validation rule
9. **Remove or gate console.logs** — cleanup pass before next production deploy
10. **Add field length validation** — register resolver, ~4 lines
