---
name: e2e-testing
description: End-to-end testing patterns with Playwright for critical user flows. Activate when writing E2E tests, setting up Playwright, or debugging flaky tests.
origin: ECC
---

# E2E Testing Patterns

## When to Activate

- Writing Playwright tests for critical user flows
- Debugging flaky or unreliable tests
- Setting up Playwright in CI/CD
- Adding `data-testid` attributes for test selectors

## Project Structure

```
tests/
  e2e/
    auth.spec.ts        # Login, signup, Google OAuth
    products.spec.ts    # Browse products, search
    cart.spec.ts        # Add/remove, quantity, save for later
    checkout.spec.ts    # (future: checkout flow)
  fixtures/
    auth.fixture.ts     # Reusable authenticated page
  playwright.config.ts
```

## Page Object Model

Centralise selectors and actions in page objects:

```typescript
// tests/e2e/pages/CartPage.ts
class CartPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/cart')
  }

  async getItemCount(): Promise<number> {
    return this.page.locator('[data-testid="cart-item"]').count()
  }

  async removeItem(productId: string) {
    await this.page.click(`[data-testid="remove-${productId}"]`)
  }

  async getTotal(): Promise<string> {
    return this.page.locator('[data-testid="cart-total"]').innerText()
  }
}
```

## Writing Stable Tests

```typescript
// ✅ Use data-testid selectors — stable across UI changes
await page.click('[data-testid="add-to-cart-btn"]')

// ❌ Fragile — breaks on CSS/text changes
await page.click('.btn-primary:has-text("Add to Cart")')

// ✅ Wait for specific network response
await Promise.all([
  page.waitForResponse(resp => resp.url().includes('/graphql')),
  page.click('[data-testid="login-btn"]'),
])

// ❌ Arbitrary sleep — flaky
await page.waitForTimeout(2000)

// ✅ Wait for visible element
await expect(page.locator('[data-testid="cart-count"]')).toBeVisible()
```

## Critical Flows to Test

1. **Auth flow**: Register → Login → Protected route access → Logout
2. **Product browsing**: Load products → View product details
3. **Cart flow**: Add product → Adjust quantity → Remove item
4. **Cart sync**: Add items → Login → Verify server sync

## Handling Flaky Tests

```bash
# Identify flaky tests by running multiple times
npx playwright test tests/e2e/cart.spec.ts --repeat-each=5
```

Common fixes:
- Replace `waitForTimeout` with `waitForResponse` or `waitForSelector`
- Add `networkidle` waits when testing after navigation
- Use `expect(locator).toBeVisible()` instead of checking DOM directly

## CI Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['junit'], ['html']] : 'html',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
})
```

## Adding data-testid Attributes

When writing E2E tests, add `data-testid` to interactive elements:

```typescript
// In components
<button data-testid="add-to-cart-btn" onClick={handleAdd}>
  Add to Cart
</button>

<span data-testid="cart-count">{itemCount}</span>
```
