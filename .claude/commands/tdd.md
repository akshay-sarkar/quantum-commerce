# TDD

Enforce test-driven development by guiding through the RED → GREEN → REFACTOR cycle.

## Core Workflow

**Tests must be written BEFORE implementation.**

1. **Scaffold interfaces** — define types upfront
2. **Write failing tests** — describe expected behaviour
3. **Run tests** — confirm they FAIL
4. **Implement minimal code** — just enough to pass tests
5. **Refactor** — improve while keeping tests green
6. **Verify 80%+ coverage**

## When to Use

- Building new features
- Adding functions or utilities
- Fixing bugs (write a failing test first)
- Refactoring existing code
- Developing auth, payment, or other critical business logic

## Coverage Standards

| Code Type | Minimum Coverage |
|-----------|-----------------|
| General code | 80% |
| Auth, security, financial logic | 100% |

## Test Types Required

- **Unit tests** — function-level behaviour
- **Integration tests** — component/API-level
- **Edge cases** — null/undefined, empty inputs, boundary values, error paths

## Integration

- `/plan` — understand requirements first
- `/build-fix` — resolve build errors blocking tests
- `/code-review` — review after implementation
