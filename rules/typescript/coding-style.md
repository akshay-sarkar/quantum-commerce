# TypeScript Coding Style

Applies to: `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

## Types and Interfaces

```typescript
// ✅ interface for extensible object shapes
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

// ✅ type for unions, intersections, utility types
type UserType = 'BUYER' | 'ADMIN' | 'G_BUYER'
type PartialUser = Partial<User>

// ✅ Explicit types on public APIs and component props
function getUser(id: string): Promise<User | null>

// ❌ Never use any — use unknown for safer narrowing
function processInput(data: any)     // ❌
function processInput(data: unknown) // ✅
```

## Immutability

```typescript
// ✅ Spread to create new objects
const updated = { ...user, firstName: 'New Name' }

// ✅ Map/filter to create new arrays
const active = products.filter(p => p.isActive)

// ❌ Direct mutation
user.firstName = 'New Name'
items.push(newItem)
```

## Error Handling

```typescript
// ✅ async/await with try/catch
async function fetchProduct(id: string): Promise<IProduct> {
  try {
    const product = await Product.findById(id)
    if (!product) throw new AppError(404, 'Product not found')
    return product
  } catch (error) {
    if (error instanceof AppError) throw error
    throw new AppError(500, 'Failed to fetch product')
  }
}

// ✅ Narrow unknown error types
catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error'
  logger.error(message)
}
```

## Input Validation (Zod)

```typescript
import { z } from 'zod'

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
})

type RegisterInput = z.infer<typeof RegisterSchema>

function validateRegister(input: unknown): RegisterInput {
  return RegisterSchema.parse(input)
}
```

## React Components

```typescript
// ✅ Named interface for props
interface ProductCardProps {
  product: IProduct
  onAddToCart: (id: string) => void
}

// ✅ Plain function, not React.FC
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return <div>{product.name}</div>
}
```

## Logging

```typescript
// ✅ Use a logger (or structured console) in server code
logger.info('User registered', { userId: user.id })

// ❌ No console.log in production code
console.log('user:', user)
```
