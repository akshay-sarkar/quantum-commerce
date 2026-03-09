---
name: add-feature
description: Scaffold a complete full-stack feature for Quantum Commerce end-to-end. Use when the user says "add a feature", "implement X", "build the X flow", or "I want to add X to the app". Walks through backend model → GraphQL → frontend in order. Best for learning — explains each step.
---

# Add Feature

You are guiding the implementation of a complete full-stack feature in Quantum Commerce. This skill walks through the full stack in order, explaining each layer so the user understands what they're building and why.

**This is a learning project. After each step, pause and explain what was just built and why it matters before moving to the next step.**

## Step 1: Define the Feature

Ask the user:
1. What feature are you building? (e.g. "order history", "product reviews", "wishlist")
2. Who uses this feature? (any user, logged-in users only, admins only?)
3. What should a user be able to do? (list the actions: view orders, place order, cancel order, etc.)
4. Any constraints or preferences?

After gathering requirements, write a short feature summary:
```
Feature: {Name}
User stories:
- As a [role], I can [action] so that [benefit]
- ...
GraphQL operations needed: [list queries/mutations]
New models needed: [list models or "none"]
Frontend pages/components needed: [list]
```

Show this to the user and confirm before proceeding.

## Step 2: Backend — Data Model

If a new model is needed:

1. Explain: "First we'll define how the data is stored in MongoDB. This is the schema."
2. Use the `add-model` skill flow to create the model file
3. After creating: explain what each field does and why it's typed that way

If using an existing model, explain which one and why no new model is needed.

## Step 3: Backend — GraphQL Types

1. Explain: "Now we expose this data through GraphQL — the API layer between backend and frontend."
2. Add the new GraphQL type(s) and operation(s) to `backend/src/graphQL/typeDefs/typeDefs.ts`
3. After each addition, explain: "This `input` type defines what data the client sends. The return type defines what the client gets back."

## Step 4: Backend — Resolvers

1. Explain: "Resolvers are the functions that actually run when a query or mutation is called."
2. Use the `add-resolver` skill flow to implement the resolver logic
3. Call attention to: auth check pattern, error handling, why the logic is on the backend not frontend

## Step 5: Frontend — TypeScript Interfaces

1. Read `frontend/quantumcommerce-frontend/models/index.ts`
2. Add the matching TypeScript interface for the new data type
3. Explain: "We mirror the backend type on the frontend so TypeScript can catch errors when we use this data."

## Step 6: Frontend — GraphQL Operations

1. Read `frontend/quantumcommerce-frontend/graphql/gql.ts`
2. Add the query/mutation using `gql` template literals
3. Explain: "This is the client-side declaration of what data we're asking for. Apollo will use this to call our backend."

## Step 7: Frontend — Component(s)

1. Use the `add-component` skill flow for each needed component
2. Wire up Apollo (`useQuery`/`useMutation`) and explain: "Apollo gives us loading, error, and data states automatically."
3. Connect to Zustand cart store if relevant

## Step 8: Frontend — Page (if needed)

1. Use the `add-page` skill flow to create the page
2. Compose the components into the page
3. Add route to Navbar if it should be discoverable

## Step 9: Test the Feature

Guide the user through testing:
1. "Start both servers: `npm run dev` in backend and frontend"
2. "Test the backend first: open http://localhost:4000/graphql and run [the query/mutation]"
3. "Then test in the browser: navigate to [the route]"
4. "Check DevTools Network tab to confirm the GraphQL request is being made"

## Step 10: Recap

Summarise what was built:
- Files created/modified (list each one)
- How the data flows: Browser → Apollo → GraphQL → Resolver → MongoDB → back
- What's still missing or could be improved
- Suggest: "Run `/extract-errors` to check for TypeScript issues"
