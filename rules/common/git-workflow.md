# Git Workflow

## Commit Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
| Type | When |
|------|------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code change without feature/bug |
| `docs` | Documentation only |
| `test` | Adding or updating tests |
| `chore` | Build, CI, dependencies |
| `perf` | Performance improvement |
| `ci` | CI/CD changes |

### Examples
```
feat(cart): add save-for-later persistence to MongoDB
fix(auth): correct JWT expiry from 30d to 24h
refactor(resolvers): extract cart sync logic to service layer
```

## Pull Request Standards

- Review entire commit history (`git diff [base]...HEAD`), not just the latest commit
- Include a thorough summary of what changed and why
- Include a test plan (what to verify manually or via tests)
- Push new branches with `-u` flag: `git push -u origin branch-name`

## Branch Strategy (this project)

- **`Integration`** — active development (always work here)
- **`main`** — production (push triggers auto-deploy, never commit directly)
- Merge `Integration → main` only when ready for production

## Pre-Commit

Husky + lint-staged runs Prettier automatically on `*.{ts,js,css,md}`.

Run manually before pushing:
```bash
npm run lint    # in both /backend and /frontend/quantumcommerce-frontend
```
