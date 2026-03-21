# Agent Orchestration

## Available Agents (this project)

Stored in `.claude/agents/`:

| Agent | Use When |
|-------|----------|
| `planner` | Starting any complex feature — creates a phased plan |
| `architect` | System design decisions, trade-off evaluation |
| `tdd-guide` | Adding tests or building new features TDD-style |
| `code-reviewer` | After writing code, before committing |
| `typescript-reviewer` | TypeScript-specific type safety review |
| `security-reviewer` | After writing auth/input/API code, before deploy |
| `build-error-resolver` | When the build is broken |

## When to Use Each Agent

**Starting a feature** → `planner` first, then `architect` if design is complex

**After writing code** → `code-reviewer` and `typescript-reviewer`

**Before committing** → `security-reviewer` if touched auth, inputs, or API surface

**Build broken** → `build-error-resolver`

**Adding tests** → `tdd-guide`

## Parallel Execution

For independent operations, run agents in parallel:

```
✅ Run code-reviewer + security-reviewer simultaneously
✅ Run typescript-reviewer + tdd-guide simultaneously
❌ Don't run planner + architect simultaneously (architect needs the plan)
```

## Agent Invocation Pattern

When using the Agent tool:
1. Provide a clear, complete task description
2. Include relevant file paths
3. State what output you expect (analysis, code, plan)
4. Specify if the agent should write code or just research
