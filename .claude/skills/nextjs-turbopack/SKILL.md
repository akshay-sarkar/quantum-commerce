---
name: nextjs-turbopack
description: Next.js 16+ patterns with Turbopack, App Router, Server Components, and performance optimisation. Activate when working on Next.js pages, layouts, or build configuration.
origin: ECC
---

# Next.js and Turbopack

## When to Activate

- Working on Next.js App Router pages or layouts
- Debugging slow dev server startup or HMR
- Optimising bundle size
- Configuring Next.js for production

## Turbopack vs Webpack

**Default for Next.js 16+**: Turbopack is the default development bundler — an incremental bundler written in Rust.

| Scenario | Use |
|----------|-----|
| Standard development | Turbopack (default) |
| Turbopack-specific bug | Switch to webpack temporarily |
| Webpack-exclusive plugin needed | Switch to webpack |

**Performance**: Up to 5–14x faster restart cycles on large projects due to file-system caching.

## App Router Patterns

### Server vs Client Components

```typescript
// Server Component (default) — can fetch data, access DB directly
export default async function ProductsPage() {
  const products = await fetchProducts() // runs on server
  return <ProductGrid products={products} />
}

// Client Component — use for interactivity, hooks, browser APIs
'use client'
export function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false)
  // ...
}
```

### Metadata

```typescript
export const metadata: Metadata = {
  title: 'Products | Quantum Commerce',
  description: 'Browse our product catalog',
}
```

### Loading and Error States

```typescript
// app/products/loading.tsx — automatic streaming
export default function Loading() {
  return <ProductGridSkeleton />
}

// app/products/error.tsx
'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <div>Something went wrong. <button onClick={reset}>Retry</button></div>
}
```

## Performance Optimisations

1. **Keep Next.js updated** — stay on recent 16.x for Turbopack improvements
2. **Don't clear cache unnecessarily** — `rm -rf .next` clears Turbopack's incremental cache
3. **Prefer Server Components** — reduces client-side JS bundle
4. **Use Bundle Analyzer** (Next.js 16.1+):
   ```bash
   ANALYZE=true npm run build
   ```

## Key Conventions (this project)

- App Router: `app/` directory with `page.tsx`, `layout.tsx`
- Client components: `'use client'` directive at top
- Path alias: `@/*` maps to project root
- Tailwind CSS v4 with `qc-*` custom variables
