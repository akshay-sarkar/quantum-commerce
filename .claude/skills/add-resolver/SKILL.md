---
name: add-resolver
description: Add a new GraphQL type, query, or mutation to the Quantum Commerce backend. Use when the user says "add a query", "add a mutation", "new GraphQL endpoint", "expose X via GraphQL", or "add resolver for X". Adds both the typeDef and resolver together.
---

# Add Resolver

You are adding a new GraphQL operation (query or mutation) to the Quantum Commerce backend. This involves editing two files together: `typeDefs.ts` and `resolvers.ts`.

## Step 1: Gather Requirements

Ask the user:
1. Is this a **Query** (read data) or **Mutation** (write/change data)?
2. What is the operation name? (e.g. `createOrder`, `getOrdersByUser`, `updateProductInventory`)
3. What are the input arguments (name + type)?
4. What does it return (type + nullable/non-null)?
5. Does it require authentication? (should it check for a logged-in user?)
6. What should it do? (brief description of the business logic)

## Step 2: Read Existing Files

Before writing, read:
- `backend/src/graphQL/typeDefs/typeDefs.ts` — understand existing types and where to add new ones
- `backend/src/graphQL/resolvers/resolvers.ts` — understand the resolver pattern, especially how auth is checked

## Step 3: Add the TypeDef

Edit `backend/src/graphQL/typeDefs/typeDefs.ts`:

1. If a new input type or return type is needed, add it at the top of the type definitions
2. Add the operation to the `Query` or `Mutation` block with correct TypeScript-style types (String!, Int, [Type!]!, etc.)
3. Keep alphabetical order where possible

Auth pattern to know: the context has `context.user` if authenticated. Check it like:
```typescript
if (!context.user) throw new Error('Authentication required');
```

## Step 4: Add the Resolver

Edit `backend/src/graphQL/resolvers/resolvers.ts`:

Follow the existing resolver conventions:
```typescript
operationName: async (_: unknown, { arg1, arg2 }: { arg1: string; arg2: number }, context: Context) => {
  // 1. Auth check (if required)
  if (!context.user) throw new Error('Authentication required');

  // 2. Input validation
  if (!arg1) throw new Error('arg1 is required');

  // 3. Business logic
  try {
    // database operations
    return result;
  } catch (error) {
    throw new Error(`Failed to operationName: ${(error as Error).message}`);
  }
},
```

Add it to the correct block: `Query: { ... }` or `Mutation: { ... }`.

## Step 5: Add Frontend GraphQL (optional)

Ask: "Do you want me to also add the query/mutation to the frontend `graphql/gql.ts` file?"

If yes, read `frontend/quantumcommerce-frontend/graphql/gql.ts` first and add the matching GraphQL document.

## Step 6: Summary

Tell the user:
- What typeDef was added
- What resolver was added
- Auth: required or not
- Next steps: "Test it with the GraphQL playground at http://localhost:4000/graphql" and "Use `/add-component` to wire this up to the UI"
