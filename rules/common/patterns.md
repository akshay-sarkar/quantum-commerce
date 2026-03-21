# Common Patterns

## Starting New Features

1. Search for existing patterns in the codebase first (don't reinvent)
2. Use the `architect` agent for design decisions
3. Use the `planner` agent to break the work into phases
4. Get approval on the plan before writing code

## Repository Pattern

Encapsulate data access behind a consistent interface:

```typescript
interface ProductRepository {
  findAll(filters?: ProductFilters): Promise<IProduct[]>
  findById(id: string): Promise<IProduct | null>
  create(data: CreateProductDto): Promise<IProduct>
  update(id: string, data: Partial<IProduct>): Promise<IProduct>
  delete(id: string): Promise<void>
}
```

Benefits:
- Business logic depends on the interface, not the storage mechanism
- Easy to swap DB implementations
- Simplifies testing (mock the interface)

## Consistent API Response Envelope

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
```

Use this shape for all REST and GraphQL responses.

## Error Handling Pattern

```typescript
// ✅ Typed error class
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message)
  }
}

// ✅ Always catch and transform in resolvers/controllers
try {
  const result = await service.doThing()
  return result
} catch (error) {
  if (error instanceof AppError) throw error
  throw new AppError(500, 'Internal server error')
}
```

## Agent Orchestration

Use parallel agents for independent operations:
- Architecture + security review can run simultaneously
- Code review + test generation can run simultaneously

Sequential when dependent:
- Plan → implement → review → test
