# Test Coverage

Analyse and improve test coverage to 80%+ across the codebase.

## Step 1: Detect Framework and Run Coverage

| Framework | Coverage Command |
|-----------|-----------------|
| Jest | `npx jest --coverage` |
| Vitest | `npx vitest run --coverage` |
| pytest | `pytest --cov=src --cov-report=term-missing` |
| Go | `go test ./... -coverprofile=coverage.out` |
| Rust | `cargo llvm-cov` |

## Step 2: Analyse Coverage Report

Identify:
- Files below 80% threshold
- Untested functions
- Missing branch coverage
- Dead code that inflates uncovered lines

## Step 3: Prioritise Test Generation

Order of priority:
1. **Happy path** — core functionality with valid inputs
2. **Error handling** — what happens when things go wrong
3. **Edge cases** — null, empty arrays/strings, boundary values
4. **Branch coverage** — every if/else path

## Step 4: Write Missing Tests

Follow project conventions:
- Place test files adjacent to source files
- Match existing test patterns
- Mock external dependencies (DB, APIs, third-party services)
- Keep tests independent — no shared mutable state
- Use descriptive names: `should return 404 when product not found`

## Critical Areas (100% coverage target)

- Auth flows and JWT handling
- Payment/financial calculations
- Security-critical functions
- Core business logic mutations

## Step 5: Verify

Re-run coverage after writing tests. Confirm threshold is met before closing.
