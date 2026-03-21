# ECC Source Manifest

Source tracking for files imported from [everything-claude-code](https://github.com/affaan-m/everything-claude-code).

**Base URL**: `https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/`

To re-fetch any file, use: `WebFetch <raw-url>` and overwrite the local file.

---

## Commands (`.claude/commands/`)

| Local File | Source URL |
|-----------|-----------|
| `plan.md` | `commands/plan.md` |
| `tdd.md` | `commands/tdd.md` |
| `code-review.md` | `commands/code-review.md` |
| `build-fix.md` | `commands/build-fix.md` |
| `refactor-clean.md` | `commands/refactor-clean.md` |
| `verify.md` | `commands/verify.md` |
| `test-coverage.md` | `commands/test-coverage.md` |
| `skill-create.md` | `commands/skill-create.md` |

## Agents (`.claude/agents/`)

| Local File | Source URL |
|-----------|-----------|
| `architect.md` | `agents/architect.md` |
| `planner.md` | `agents/planner.md` |
| `typescript-reviewer.md` | `agents/typescript-reviewer.md` |
| `build-error-resolver.md` | `agents/build-error-resolver.md` |
| `security-reviewer.md` | `agents/security-reviewer.md` |
| `tdd-guide.md` | `agents/tdd-guide.md` |
| `code-reviewer.md` | `agents/code-reviewer.md` |

## Skills (`.claude/skills/<name>/SKILL.md`)

| Local Path | Source URL |
|-----------|-----------|
| `nextjs-turbopack/SKILL.md` | `skills/nextjs-turbopack/SKILL.md` |
| `frontend-patterns/SKILL.md` | `skills/frontend-patterns/SKILL.md` |
| `backend-patterns/SKILL.md` | `skills/backend-patterns/SKILL.md` |
| `docker-patterns/SKILL.md` | `skills/docker-patterns/SKILL.md` |
| `api-design/SKILL.md` | `skills/api-design/SKILL.md` |
| `tdd-workflow/SKILL.md` | `skills/tdd-workflow/SKILL.md` |
| `e2e-testing/SKILL.md` | `skills/e2e-testing/SKILL.md` |

> Note: `security-review/SKILL.md` already existed as a project-specific skill. The ECC version was not imported to avoid overwriting project-specific content.

## Rules (`rules/`)

### `rules/common/`
| Local File | Source URL |
|-----------|-----------|
| `coding-style.md` | `rules/common/coding-style.md` |
| `git-workflow.md` | `rules/common/git-workflow.md` |
| `testing.md` | `rules/common/testing.md` |
| `security.md` | `rules/common/security.md` |
| `performance.md` | `rules/common/performance.md` |
| `patterns.md` | `rules/common/patterns.md` |
| `hooks.md` | `rules/common/hooks.md` |
| `agents.md` | `rules/common/agents.md` |

### `rules/typescript/`
| Local File | Source URL |
|-----------|-----------|
| `coding-style.md` | `rules/typescript/coding-style.md` |
| `hooks.md` | `rules/typescript/hooks.md` |
| `patterns.md` | `rules/typescript/patterns.md` |
| `security.md` | `rules/typescript/security.md` |
| `testing.md` | `rules/typescript/testing.md` |

---

## How to Update

When the upstream repo is updated, re-fetch individual files:

```
1. WebFetch https://raw.githubusercontent.com/affaan-m/everything-claude-code/main/<source-url>
2. Overwrite the corresponding local file
3. Review for any conflicts with project-specific content
```

Last imported: 2026-03-20
