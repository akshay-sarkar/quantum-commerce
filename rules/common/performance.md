# Performance

## Model Selection for AI Tasks

| Model | Best For |
|-------|----------|
| Haiku 4.5 | Lightweight tasks, simple code gen — 3x cost savings |
| Sonnet 4.6 | Primary coding and orchestration (default) |
| Opus 4.5 | Architectural decisions, deep reasoning |

## Context Window Strategy

- Avoid the final 20% of context for large refactors or multi-file features
- Single-file edits and docs are low-sensitivity to context limits
- Break large tasks into phases if context is filling up

## Build Performance

When builds fail:
1. Use the `build-error-resolver` agent
2. Fix errors incrementally (one at a time)
3. Verify the build passes after each fix

## Database Query Performance

- Select only columns you need (no `SELECT *` / `.find({})` without `.select()`)
- Batch fetches to avoid N+1 queries
- Index fields used in frequent queries (`email`, `userId`, `productId`)
- Use `.lean()` in Mongoose for read-only queries (returns plain JS objects, faster)

## Frontend Performance

- Prefer Server Components for data fetching (reduces client JS)
- Memoize expensive computations with `useMemo`
- Memoize callbacks passed to children with `useCallback`
- Lazy-load heavy components with `React.lazy()`
- Avoid unnecessary re-renders by keeping state as local as possible
