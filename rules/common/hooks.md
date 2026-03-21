# Hooks (Claude Code)

## Hook Types

| Type | When it fires |
|------|--------------|
| `PreToolUse` | Before a tool executes |
| `PostToolUse` | After a tool executes |
| `Stop` | At session end |

## Permissions Guidance

- Enable hooks for trusted, well-defined workflows
- Disable for exploratory or experimental work
- Configure `allowedTools` in `~/.claude/settings.json` rather than using `--dangerously-skip-permissions`

## Useful Hook Ideas for This Project

**PostToolUse — after Edit on `.ts`/`.tsx` files:**
- Auto-format with Prettier
- Run `tsc --noEmit` to catch type errors immediately
- Alert if `console.log` was introduced

**Stop hook:**
- Check all modified files for `console.log` before session ends
- Report uncommitted changes

## TodoWrite Tool

Use the TodoWrite tool when:
- Task is complex enough to need tracking (3+ steps)
- You want to confirm understanding of requirements with the user
- Implementation details need to be displayed

A well-structured todo list reveals problems: misordered steps, omitted items, wrong level of detail, or misunderstood scope.
