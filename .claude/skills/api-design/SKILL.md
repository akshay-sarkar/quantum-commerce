---
name: api-design
description: REST and GraphQL API design patterns covering resource structure, HTTP semantics, response formatting, pagination, authentication, rate limiting, and versioning.
origin: ECC
---

# API Design Patterns

## When to Activate

- Designing new GraphQL queries or mutations
- Adding REST endpoints
- Deciding on response structure
- Implementing pagination or filtering
- Planning API versioning

## GraphQL Schema Design

### Naming Conventions

```graphql
# ✅ Queries: noun-based, descriptive
type Query {
  products: [Product!]!
  product(id: ID!): Product
  myCart: Cart
  me: User
}

# ✅ Mutations: verb-noun pattern
type Mutation {
  register(input: RegisterInput!): AuthPayload!
  login(input: LoginInput!): AuthPayload!
  syncCart(input: SyncCartInput!): Cart!
}
```

### Input Types

```graphql
# ✅ Always use input types for mutations
input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
}

# ✅ Return types should include all fields needed by clients
type AuthPayload {
  token: String!
  user: User!
}
```

### Error Handling in GraphQL

```graphql
# Surface errors via extensions, not HTTP status codes
{
  "errors": [{
    "message": "Email already registered",
    "extensions": { "code": "DUPLICATE_EMAIL", "field": "email" }
  }]
}
```

## REST API Structure (if applicable)

```
# Resource-based URLs
GET    /api/products          # List
GET    /api/products/:id      # Single
POST   /api/products          # Create
PUT    /api/products/:id      # Replace
PATCH  /api/products/:id      # Update
DELETE /api/products/:id      # Delete

# Query params for filtering/sorting/pagination
GET /api/products?category=Electronics&sort=price&limit=20&offset=0
```

## Consistent Response Envelope

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

## Pagination

**Cursor-based** (preferred for large datasets):
```graphql
type ProductConnection {
  edges: [ProductEdge!]!
  pageInfo: PageInfo!
}
type PageInfo {
  hasNextPage: Boolean!
  endCursor: String
}
```

**Offset-based** (OK for small datasets or search):
```
GET /api/products?page=2&limit=20
```

## Authentication

```
# Bearer token in Authorization header
Authorization: Bearer <jwt-token>

# Never in query params — appears in server logs
❌ GET /api/products?token=abc123
```

## HTTP Status Codes

| Code | When |
|------|------|
| 200 | Success with data |
| 201 | Resource created |
| 400 | Bad request / validation failed |
| 401 | Unauthenticated |
| 403 | Unauthorised (authenticated but no permission) |
| 404 | Resource not found |
| 422 | Validation failed (semantic error) |
| 429 | Rate limit exceeded |
| 500 | Server error |
