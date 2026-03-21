# Code Review

Systematically review uncommitted code changes for security, quality, and best practices.

## Severity Levels

### CRITICAL — Block commit immediately
- Hardcoded credentials, API keys, tokens
- Injection vulnerabilities (SQL, NoSQL, command)
- XSS vulnerabilities
- Path traversal

### HIGH — Block commit
- Functions > 50 lines
- Nesting depth > 4 levels
- Missing error handling
- Unsafe type casts or `any` abuse
- Unhandled promise rejections

### MEDIUM — Warn but allow
- Mutation patterns
- Test coverage gaps
- Missing input validation
- `console.log` left in production code

## Process

1. Identify modified files: `git diff --staged` and `git diff`
2. Examine each file against the criteria above
3. Note specific line numbers and file paths for each finding
4. Report consolidated findings by severity

## Enforcement

**Never approve code with security vulnerabilities.**

Commits containing CRITICAL or HIGH issues should be blocked.

## Output Format

```
CRITICAL: [file:line] — description
HIGH:     [file:line] — description
MEDIUM:   [file:line] — description

Verdict: APPROVED / BLOCKED
```
