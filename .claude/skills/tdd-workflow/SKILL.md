---
name: tdd-workflow
description: Test-driven development workflow with Red-Green-Refactor cycle, coverage requirements, and test patterns for Jest/Vitest and Playwright. Activate when adding new features, fixing bugs, or building test coverage.
origin: ECC
---

# TDD Workflow

## When to Activate

- Building any new feature or function
- Fixing a bug (write failing test first)
- Adding test coverage to existing code
- Refactoring code that lacks tests

## The Cycle

### 1. Document the User Story

```
As a [user type]
I want to [action]
So that [benefit]
```

### 2. RED — Write Failing Tests

Write tests that describe expected behaviour BEFORE writing any implementation:

```typescript
// Jest/Vitest unit test
describe('calculateCartTotal', () => {
  it('should sum all item prices × quantities', () => {
    const items = [
      { price: 10, quantity: 2 },
      { price: 5, quantity: 1 },
    ]
    expect(calculateCartTotal(items)).toBe(25)
  })

  it('should return 0 for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0)
  })

  it('should handle items with quantity 0', () => {
    expect(calculateCartTotal([{ price: 10, quantity: 0 }])).toBe(0)
  })
})
```

Run tests: `npm test` — they MUST fail at this point.

### 3. GREEN — Implement Minimal Code

Write only enough to make the tests pass:

```typescript
function calculateCartTotal(items: Array<{ price: number; quantity: number }>): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}
```

Run tests again — they MUST pass.

### 4. REFACTOR

Improve code quality while keeping all tests green.

### 5. Verify Coverage

```bash
npm run test:coverage   # or npx jest --coverage
```

Minimum thresholds:
- General code: 80%
- Auth, security, payments: 100%

## Integration Test Pattern

```typescript
// Test GraphQL resolver end-to-end
describe('syncCart mutation', () => {
  beforeEach(async () => {
    await Cart.deleteMany({})
  })

  it('should update cart for authenticated user', async () => {
    const token = generateTestToken({ id: testUserId })
    const response = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: SYNC_CART_MUTATION, variables: { input: testCartInput } })

    expect(response.body.data.syncCart.items).toHaveLength(1)
  })

  it('should reject unauthenticated requests', async () => {
    const response = await request(app)
      .post('/graphql')
      .send({ query: SYNC_CART_MUTATION, variables: { input: testCartInput } })

    expect(response.body.errors[0].message).toContain('Must be logged in')
  })
})
```

## E2E Test Pattern (Playwright)

```typescript
test('user can add product to cart', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-testid="add-to-cart-1"]')
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')
})
```

## Anti-Patterns

- Writing tests after the implementation
- Tests that test internal implementation (test behaviour, not internals)
- Shared mutable state between tests (use `beforeEach` to reset)
- Skipping mocks for external services (DB, APIs, third-party)
- `describe.skip` or `it.skip` left in codebase

**Tests are the safety net that enables confident refactoring and rapid development.**
