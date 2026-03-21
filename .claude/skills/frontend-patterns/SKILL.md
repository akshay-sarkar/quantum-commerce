---
name: frontend-patterns
description: Modern React and Next.js patterns for performant, maintainable UI. Activate when building components, managing state, or implementing forms and accessibility.
origin: ECC
---

# Frontend Patterns

## When to Activate

- Building React components or custom hooks
- Managing complex component state
- Implementing forms with validation
- Adding accessibility features
- Optimising component performance

## Component Architecture

### Composition over Inheritance

```typescript
// ✅ Compose small, focused components
function ProductCard({ product }: { product: IProduct }) {
  return (
    <div className="qc-card">
      <ProductImage src={product.imageUrl} alt={product.name} />
      <ProductInfo name={product.name} price={product.price} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
```

### Props Typing

```typescript
// ✅ Named interface for props
interface ButtonProps {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
}

// ❌ Avoid React.FC — use plain function
export function Button({ onClick, disabled, children, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{children}</button>
}
```

## Custom Hooks

```typescript
// Reusable debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Toggle hook
function useToggle(initial = false) {
  const [value, setValue] = useState(initial)
  const toggle = useCallback(() => setValue(v => !v), [])
  return [value, toggle] as const
}
```

## State Management

### When to Use What

| Scope | Tool |
|-------|------|
| Component-local UI state | `useState` |
| Derived/computed values | `useMemo` |
| Global persistent state | Zustand |
| Server state (GraphQL) | Apollo Client |
| Theme, Auth | Context API |

### Immutable State Updates

```typescript
// ✅ Spread — create new object
setState(prev => ({ ...prev, loading: true }))

// ✅ Map — create new array
setItems(prev => prev.map(item => item.id === id ? { ...item, qty: qty + 1 } : item))

// ❌ Never mutate directly
state.items.push(newItem)
```

## Performance

```typescript
// Memoize expensive calculations
const sortedProducts = useMemo(
  () => products.slice().sort((a, b) => a.price - b.price),
  [products]
)

// Memoize callbacks passed to children
const handleAddToCart = useCallback((id: string) => {
  addItem(id)
}, [addItem])

// Lazy load heavy components
const AdminPanel = lazy(() => import('@/components/AdminPanel'))
```

## Error Boundaries

```typescript
'use client'
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return <div>Something went wrong.</div>
    return this.props.children
  }
}
```

## Accessibility

- Always provide `aria-label` for icon-only buttons
- Manage focus when opening modals/dialogs
- Support keyboard navigation (Enter/Space for interactive elements)
- Use semantic HTML elements (`button`, `nav`, `main`, `section`)
