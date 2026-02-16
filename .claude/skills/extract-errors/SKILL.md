---
name: extract-errors
description: Scan the Quantum Commerce codebase for errors, warnings, and issues. Use when user says "extract errors", "find errors", "check for bugs", or "scan for issues".
---

# Extract Errors

## Instructions

Scan the codebase for errors and potential issues. Report findings grouped by category.

### Step 1: Check for TypeScript Errors

Run TypeScript compiler in both backend and frontend without emitting:

```bash
cd backend && npx tsc --noEmit 2>&1
cd frontend/quantumcommerce-frontend && npx tsc --noEmit 2>&1
```

### Step 2: Run Linters

```bash
cd backend && npm run lint 2>&1
cd frontend/quantumcommerce-frontend && npm run lint 2>&1
```

### Step 3: Scan for Common Code Issues

Search the codebase for:
- `console.log` statements left in production code
- Hardcoded secrets or API keys (strings matching password, secret, key patterns)
- `any` type usage in TypeScript files
- Unhandled promise rejections (async without try/catch)
- TODO/FIXME/HACK comments that need attention

### Step 4: Report

Present findings in this format:

```
## Error Report

### TypeScript Errors
- [file:line] description

### Lint Warnings
- [file:line] description

### Code Issues
- [file:line] category: description

### Summary
- X TypeScript errors
- X lint warnings
- X code issues found
```

If no errors found in a category, report "None found" for that section.
