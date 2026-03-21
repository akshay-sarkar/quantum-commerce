# Testing Requirements

## Minimum Coverage

**80% across all metrics**: branches, functions, lines, statements.

**100% for**: auth, security, financial calculations, core business logic.

## Required Test Types

| Type | Scope | Tools |
|------|-------|-------|
| Unit | Individual functions and utilities | Jest / Vitest |
| Integration | API endpoints, DB operations, service interactions | Jest + supertest |
| E2E | Critical user journeys | Playwright |

## TDD Workflow

**Always write tests BEFORE implementation.**

1. **RED** — Write test (expect it to fail)
2. **GREEN** — Implement minimal code (make it pass)
3. **IMPROVE** — Refactor (keep tests green)
4. Verify coverage ≥ 80%

## When Tests Fail

1. Check test isolation — is shared state leaking between tests?
2. Validate mock implementations match real interfaces
3. Fix the implementation, not the test (unless the test itself is wrong)
4. Use the `tdd-guide` agent for support

## Anti-Patterns

- Writing tests after the implementation
- Tests that depend on execution order
- Mocking the system under test
- `describe.skip` or `it.skip` left in the codebase
- Assertions that don't meaningfully verify behaviour

**Tests are not optional. They are the safety net for refactoring and confident shipping.**
