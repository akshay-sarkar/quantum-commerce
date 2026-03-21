# Verify

Run a comprehensive verification pipeline before committing or opening a PR.

## Verification Order

Execute checks in this exact order (build is the gating step):

1. **Build** — `npm run build` (stop here if it fails)
2. **Type check** — `npx tsc --noEmit`
3. **Lint** — `npm run lint`
4. **Tests** — `npm test`
5. **Secret scan** — check for hardcoded credentials
6. **Console audit** — check for leftover `console.log` statements

## Execution Modes

| Mode | What runs |
|------|-----------|
| `quick` | Build + types only |
| `full` | All checks |
| `pre-commit` | Build + types + lint + tests |
| `pre-pr` | All checks including security scan |

## Output Format

```
Build          ✅ / ❌
Type errors    ✅ 0 / ❌ N errors
Lint issues    ✅ 0 / ❌ N issues
Tests          ✅ X passed / ❌ Y failed (Z% coverage)
Secrets        ✅ clean / ❌ found
console.log    ✅ none / ⚠️ N found

PR Ready: YES / NO
```

## Fix Suggestions

For each failure, suggest the specific command or agent to resolve it:
- Build failure → `/build-fix`
- Test failures → `/tdd`
- Security issues → use `security-reviewer` agent
