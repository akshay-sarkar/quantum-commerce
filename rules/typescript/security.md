# TypeScript Security

Applies to: `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

## Secret Management

```typescript
// ✅ ALWAYS: Environment variables with startup validation
const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) throw new Error('JWT_SECRET environment variable is required')

const mongoUri = process.env.MONGODB_URI
if (!mongoUri) throw new Error('MONGODB_URI environment variable is required')

// ❌ NEVER: Hardcoded secrets
const jwtSecret = 'hardcoded-secret-123'
```

## Type-Safe Environment Access

```typescript
// Create a validated env config at startup
const config = {
  jwtSecret: requireEnv('JWT_SECRET'),
  mongoUri: requireEnv('MONGODB_URI'),
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
} as const

function requireEnv(key: string): string {
  const value = process.env[key]
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}
```

## Input Sanitisation

```typescript
// ✅ Validate before any DB operation
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
})

// In resolver
const validated = LoginSchema.safeParse(args.input)
if (!validated.success) {
  throw new Error(validated.error.errors[0].message)
}
```

## Avoiding Prototype Pollution

```typescript
// ❌ Dangerous — merging user input directly
Object.assign(target, userInput)

// ✅ Safe — validate schema first, then spread known fields
const { email, firstName } = RegisterSchema.parse(userInput)
const user = new User({ email, firstName })
```

## Reference

See `rules/common/security.md` for the full security checklist and incident response protocol.

Use the `security-reviewer` agent for thorough audits before production deployments.
