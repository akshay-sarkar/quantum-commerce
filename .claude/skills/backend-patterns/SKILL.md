---
name: backend-patterns
description: Backend architecture patterns, API design, database optimisation, and server-side best practices for Node.js, Express, and GraphQL APIs.
origin: ECC
---

# Backend Patterns

## When to Activate

- Designing GraphQL resolvers or REST endpoints
- Implementing service or repository layers
- Optimising database queries (N+1, indexing)
- Adding middleware (auth, logging, rate limiting)
- Structuring error handling and validation for APIs
- Setting up background jobs or async processing

## GraphQL Resolver Pattern

```typescript
// ✅ Thin resolver — delegates to service layer
const resolvers = {
  Query: {
    products: async (_: unknown, __: unknown, context: Context) => {
      return productService.getAll()
    },
    product: async (_: unknown, { id }: { id: string }, context: Context) => {
      return productService.getById(id)
    },
  },
  Mutation: {
    syncCart: async (_: unknown, { input }: SyncCartInput, context: Context) => {
      if (!context.user) throw new Error('Unauthenticated')
      return cartService.sync(context.user.id, input)
    },
  },
}
```

## Service Layer Pattern

```typescript
// Business logic separated from data access
class ProductService {
  async getAll(): Promise<IProduct[]> {
    return Product.find({ isActive: true }).lean()
  }

  async getById(id: string): Promise<IProduct | null> {
    return Product.findOne({ $or: [{ id }, { _id: id }] }).lean()
  }
}
```

## Middleware Pattern (Express)

```typescript
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Unauthorised' })

  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
```

## Database Patterns

### N+1 Query Prevention

```typescript
// ❌ BAD: N+1 — one query per item
for (const item of cartItems) {
  item.product = await Product.findById(item.productId)
}

// ✅ GOOD: Batch fetch
const productIds = cartItems.map(i => i.productId)
const products = await Product.find({ _id: { $in: productIds } })
const productMap = new Map(products.map(p => [p._id.toString(), p]))
cartItems.forEach(item => { item.product = productMap.get(item.productId.toString()) })
```

### Select Only Needed Fields

```typescript
// ✅ Select only what you need
const products = await Product.find({ isActive: true })
  .select('id name price category imageUrl')
  .lean()

// ❌ Avoid selecting everything when not needed
const products = await Product.find({})
```

## Centralised Error Handler

```typescript
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message)
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

// In Apollo Server context
const formatError = (error: GraphQLError) => {
  if (error.originalError instanceof AppError) {
    return { message: error.message, code: error.originalError.statusCode }
  }
  console.error('Unexpected error:', error)
  return { message: 'Internal server error', code: 500 }
}
```

## Retry with Exponential Backoff

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: Error
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
      }
    }
  }
  throw lastError!
}
```

## Rate Limiting

```typescript
class RateLimiter {
  private requests = new Map<string, number[]>()

  check(identifier: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now()
    const recent = (this.requests.get(identifier) || [])
      .filter(t => now - t < windowMs)

    if (recent.length >= maxRequests) return false

    recent.push(now)
    this.requests.set(identifier, recent)
    return true
  }
}
```

## Structured Logging

```typescript
const log = (level: 'info' | 'warn' | 'error', message: string, context?: object) => {
  console.log(JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...context }))
}
```
