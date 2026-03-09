---
name: add-page
description: Scaffold a new Next.js App Router page for the Quantum Commerce frontend. Use when the user says "add a page", "create a route", "new page for X", or "I need a /route-name page". Handles metadata, protected routes, Apollo integration, and layout structure.
---

# Add Page

You are creating a new page in the Quantum Commerce Next.js App Router frontend.

## Step 1: Gather Requirements

Ask the user:
1. What is the route? (e.g. `/orders`, `/profile`, `/admin/products`) — this determines the folder path
2. What is the page's purpose? What should it show or do?
3. Does it require authentication? (use `ProtectedRoute`)
4. Does it fetch data from the backend? (GraphQL query)
5. Does it need client-side interactivity or is it server-renderable?

## Step 2: Read Reference Files

Before writing, read:
- `frontend/quantumcommerce-frontend/app/products/page.tsx` — example of a data-fetching page
- `frontend/quantumcommerce-frontend/app/cart/page.tsx` — example of a protected page
- `frontend/quantumcommerce-frontend/app/globals.css` — available `qc-*` classes

## Step 3: Create the Page

Create the file at `frontend/quantumcommerce-frontend/app/{route}/page.tsx`.

**Standard page structure:**

```tsx
'use client'; // include if using hooks

import { Suspense } from 'react';
// other imports

export default function {PageName}Page() {
  return (
    <main className="min-h-screen qc-bg">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* page content */}
      </div>
    </main>
  );
}
```

**Protected page (requires login):**
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function {PageName}Page() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen qc-bg">
        {/* protected content */}
      </main>
    </ProtectedRoute>
  );
}
```

**Page with GraphQL data:**
```tsx
'use client';

import { useQuery } from '@apollo/client';
import { QUERY_NAME } from '@/graphql/gql';

export default function {PageName}Page() {
  const { data, loading, error } = useQuery(QUERY_NAME);

  if (loading) return <div className="min-h-screen qc-bg flex items-center justify-center"><p className="qc-muted">Loading...</p></div>;
  if (error) return <div className="min-h-screen qc-bg flex items-center justify-center"><p className="text-red-500">{error.message}</p></div>;

  return (
    <main className="min-h-screen qc-bg">
      {/* content using data */}
    </main>
  );
}
```

## Step 4: Conventions to Follow

- Use `qc-bg` for the page background, `qc-surface` for card/section backgrounds
- Use `qc-text` for primary text, `qc-muted` for secondary text
- Use `max-w-7xl mx-auto px-4` for the content container
- Add `py-12` or `py-16` top/bottom padding for breathing room
- For page headings use `text-2xl font-bold qc-text` or larger

## Step 5: Update Navigation (if needed)

Ask: "Should this page be linked in the Navbar?"

If yes, read `frontend/quantumcommerce-frontend/components/Navbar.tsx` and add a link following the existing pattern.

## Step 6: Summary

Tell the user:
- Route created: `/route-name`
- File path: `app/{route}/page.tsx`
- Auth protected: yes/no
- Data fetched: query name or none
- Next steps: what components or resolvers still need to be built
