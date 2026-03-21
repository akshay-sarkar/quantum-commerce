# Coding Style

## Core Principles

### Immutability
**ALWAYS create new objects, NEVER mutate existing ones** — prevents hidden side effects and enables safe concurrent operations.

```typescript
// ✅
return { ...user, name: newName }
return items.filter(i => i.id !== id)

// ❌
user.name = newName
items.splice(index, 1)
```

### File Organisation
- Prefer many small, focused files (200–400 lines, max 800)
- Organise by feature, not by type
- High cohesion within a file, low coupling between files

### Error Handling
- Handle errors at every level — never swallow silently
- UI: user-friendly messages
- Server: detailed logging without leaking sensitive data
- Always use `try/catch` with `async/await`

### Input Validation
- Validate all external data at system boundaries
- Use schema-based validation (Zod) where available
- Fail fast with descriptive error messages
- Never trust user input, URL params, or external API responses

## Code Quality Checklist

Before marking work complete:
- [ ] Code is readable without comments (self-documenting names)
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] Nesting depth ≤ 4 levels
- [ ] All errors handled (no empty catch blocks)
- [ ] No magic numbers — use named constants
- [ ] Immutable patterns used throughout
- [ ] No `console.log` in production code paths
