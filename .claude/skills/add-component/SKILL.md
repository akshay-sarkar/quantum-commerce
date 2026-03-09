---
name: add-component
description: Scaffold a new React component for the Quantum Commerce frontend following project conventions. Use when the user says "add a component", "create a component", "new component for X", or "build a reusable X". Handles TypeScript, Tailwind qc-* classes, and Apollo/Zustand integration.
---

# Add Component

You are creating a new React component for the Quantum Commerce frontend. This project uses Next.js App Router with TypeScript, Tailwind CSS v4, and a custom `qc-*` CSS variable system.

## Step 1: Gather Requirements

Ask the user:
1. What is the component name? (PascalCase, e.g. `OrderCard`, `SearchBar`, `PriceTag`)
2. What does this component do? What does it display or handle?
3. Where will it live? Options:
   - `components/` — shared, reusable components
   - `app/{page}/_components/` — page-specific components (not shared)
4. Does it need any of these?
   - Authentication state (import `useAuth` from `contexts/AuthContext`)
   - Cart state (import `useCartStore` from `stores/cartStore`)
   - GraphQL data (Apollo `useQuery` or `useMutation`)
   - Client-side interactivity (needs `'use client'` directive)
   - Theme awareness (import `useTheme` from `contexts/ThemeContext`)
5. What props does it accept?

## Step 2: Read Reference Files

Before writing, read:
- `frontend/quantumcommerce-frontend/app/globals.css` — to understand the `qc-*` color and animation classes available
- `frontend/quantumcommerce-frontend/models/index.ts` — to use existing TypeScript interfaces
- The most similar existing component (e.g. `components/Product.tsx` for a product-related component)

## Step 3: Create the Component

Create the file at the correct path. Follow these conventions:

```tsx
'use client'; // include only if the component uses hooks, event handlers, or browser APIs

import { ... } from '...';

interface {ComponentName}Props {
  // typed props — never use `any`
}

export default function {ComponentName}({ prop1, prop2 }: {ComponentName}Props) {
  // hooks at the top
  // derived state next
  // event handlers

  return (
    // JSX using Tailwind + qc-* classes
    // Use qc-card for card containers
    // Use qc-text for primary text, qc-muted for secondary text
    // Use qc-accent for highlighted/interactive elements
    // Use qc-border for borders
    // Use qc-surface for section backgrounds
  );
}
```

## Step 4: Integration Patterns

**Apollo Query:**
```tsx
import { useQuery } from '@apollo/client';
import { QUERY_NAME } from '@/graphql/gql';

const { data, loading, error } = useQuery(QUERY_NAME);
if (loading) return <div className="qc-muted">Loading...</div>;
if (error) return <div className="text-red-500">Error: {error.message}</div>;
```

**Zustand Cart:**
```tsx
import { useCartStore } from '@/stores/cartStore';
const { cart, addToCart, removeFromCart } = useCartStore();
```

**Auth:**
```tsx
import { useAuth } from '@/contexts/AuthContext';
const { user, isAuthenticated } = useAuth();
```

## Step 5: Summary

Tell the user:
- File path created
- Props it accepts
- Any imports it needs from other parts of the project
- How to use it: `<{ComponentName} prop1={...} />`
- If it needs a GraphQL query that doesn't exist yet: "Use `/add-resolver` to create the backend endpoint first"
