---
name: write-tests
description: Write tests for Quantum Commerce backend resolvers or frontend components. Use when the user says "write tests", "add tests for X", "test this resolver", "test this component", or "add unit tests". Generates Jest tests for backend and React Testing Library tests for frontend.
---

# Write Tests

You are writing tests for Quantum Commerce. The project currently has no test suite — this skill helps build coverage incrementally.

## Step 1: Clarify What to Test

Ask:
1. What do you want to test? (a specific resolver, component, utility function, or full flow?)
2. Is this **backend** (resolver/model/util) or **frontend** (component/hook)?
3. Any specific cases you're worried about? (e.g. "what if user is not logged in", "what if product doesn't exist")

## Step 2: Check if Test Infrastructure Exists

Run:
```bash
# Backend
cat backend/package.json | grep -E '"test|jest|vitest'
ls backend/src/__tests__/ 2>/dev/null

# Frontend
cat frontend/quantumcommerce-frontend/package.json | grep -E '"test|jest|vitest'
ls frontend/quantumcommerce-frontend/__tests__/ 2>/dev/null
```

If no test runner is installed, recommend and offer to install:
- **Backend**: Jest + ts-jest + @types/jest + supertest
- **Frontend**: Jest + @testing-library/react + @testing-library/user-event + jest-environment-jsdom

## Step 3: Backend — Resolver Tests

For backend resolver tests, follow this pattern using Jest:

```typescript
// backend/src/__tests__/resolvers/{resolverName}.test.ts

import { resolvers } from '../graphQL/resolvers/resolvers';
import User from '../models/User';
import { generateToken } from '../utils/auth';

// Mock mongoose model
jest.mock('../models/User');

describe('{resolverName}', () => {
  const mockContext = {
    user: { userId: 'test-id', email: 'test@test.com', userType: 'BUYER' }
  };
  const mockContextUnauthenticated = { user: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should succeed with valid input', async () => {
    // arrange
    // act
    // assert
  });

  it('should throw if user is not authenticated', async () => {
    await expect(
      resolvers.Query.{resolverName}({}, {}, mockContextUnauthenticated)
    ).rejects.toThrow('Authentication required');
  });

  it('should throw if required input is missing', async () => {
    // test validation
  });
});
```

**Common cases to always test for resolvers:**
- Happy path (valid input, authenticated if required)
- Unauthenticated access attempt (if auth required)
- Invalid/missing inputs
- Resource not found
- Duplicate/conflict (for create operations)

## Step 4: Frontend — Component Tests

For frontend component tests, use React Testing Library:

```typescript
// frontend/quantumcommerce-frontend/__tests__/{ComponentName}.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {ComponentName} from '@/components/{ComponentName}';

// Mock Apollo if the component uses useQuery/useMutation
jest.mock('@apollo/client', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  gql: (str: TemplateStringsArray) => str,
}));

// Mock AuthContext if needed
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: '1', firstName: 'Test', email: 'test@test.com' },
    isAuthenticated: true,
    logout: jest.fn(),
  }),
}));

describe('{ComponentName}', () => {
  it('renders correctly', () => {
    render(<{ComponentName} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    render(<{ComponentName} />);
    await userEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(screen.getByText('...')).toBeInTheDocument();
  });
});
```

**Common cases to always test for components:**
- Renders without crashing
- Displays correct content from props
- User interactions (click, input, submit)
- Loading state
- Error state
- Authenticated vs unauthenticated view (if conditional)

## Step 5: Write the Tests

Read the target file(s) first, then write tests covering:
1. The happy path
2. Edge cases the user mentioned
3. Standard error cases (unauthenticated, not found, invalid input)

Group related tests in `describe` blocks. Name tests as "should [expected behaviour] when [condition]".

## Step 6: Setup Config (if test runner not installed)

If installing Jest for the backend:
```bash
cd backend
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest
```

Add to `backend/package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": ["**/__tests__/**/*.test.ts"]
  }
}
```

## Step 7: Summary

Tell the user:
- What tests were written
- How to run them: `npm test` in the relevant directory
- What was NOT tested and why (if anything was deliberately skipped)
- Coverage gaps to address next
