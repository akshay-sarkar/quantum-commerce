# TypeScript Testing

Applies to: `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

## Framework

- **Unit + Integration**: Jest (backend) / Jest + React Testing Library (frontend)
- **E2E**: Playwright for critical user flows

## Unit Test Pattern (Jest)

```typescript
// backend/src/__tests__/auth.test.ts
import { generateToken, verifyToken } from '../utils/auth'

describe('auth utilities', () => {
  describe('generateToken', () => {
    it('should return a JWT string', () => {
      const token = generateToken({ id: 'user-1', email: 'test@test.com' })
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })
  })

  describe('verifyToken', () => {
    it('should decode a valid token', () => {
      const payload = { id: 'user-1', email: 'test@test.com' }
      const token = generateToken(payload)
      const decoded = verifyToken(token)
      expect(decoded.id).toBe(payload.id)
    })

    it('should throw on invalid token', () => {
      expect(() => verifyToken('invalid.token.here')).toThrow()
    })
  })
})
```

## React Component Test Pattern (RTL)

```typescript
// frontend/.../ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from './ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: 'prod-1',
    name: 'Test Product',
    price: 29.99,
    imageUrl: '',
  }

  it('should render product name and price', () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />)
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('$29.99')).toBeInTheDocument()
  })

  it('should call onAddToCart when button is clicked', () => {
    const onAddToCart = jest.fn()
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />)
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(onAddToCart).toHaveBeenCalledWith('prod-1')
  })
})
```

## E2E Test Pattern (Playwright)

```typescript
// tests/e2e/cart.spec.ts
import { test, expect } from '@playwright/test'

test('user can add product to cart', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-testid="add-to-cart-prod-1"]')
  await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1')
})
```

Use `data-testid` attributes for stable E2E selectors. Avoid class or text selectors.

## Reference

See `rules/common/testing.md` for coverage requirements and TDD workflow.

Use the `tdd-guide` and `e2e-runner` agents for support.
