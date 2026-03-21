# TypeScript Patterns

Applies to: `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

## API Response Type

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

// Usage in resolvers
function formatSuccess<T>(data: T): ApiResponse<T> {
  return { success: true, data }
}

function formatError(message: string): ApiResponse<never> {
  return { success: false, error: message }
}
```

## Custom React Hooks

```typescript
// Debounce hook — delays state updates
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage: search input with 300ms debounce
const debouncedSearch = useDebounce(searchQuery, 300)
```

## Repository Pattern (TypeScript)

```typescript
interface Repository<T, CreateDto, UpdateDto> {
  findAll(filters?: Partial<T>): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

## Async Error Boundary

```typescript
// Wrap async operations with consistent error handling
async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`[${context}] ${message}`)
    throw error
  }
}
```

## Type Guards

```typescript
// Narrowing unknown types safely
function isUser(value: unknown): value is IUser {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'userType' in value
  )
}
```
