# TypeScript Hooks (Claude Code)

Applies to: `**/*.ts`, `**/*.tsx`, `**/*.js`, `**/*.jsx`

## Recommended PostToolUse Hooks

Configure in `~/.claude/settings.json` or `.claude/settings.local.json`:

### Auto-format after edit
Run Prettier on any edited TypeScript/JavaScript file:
```json
{
  "postToolUse": {
    "Edit": "npx prettier --write $FILE"
  }
}
```

### TypeScript check after edit
Run type check on `.ts`/`.tsx` modifications:
```json
{
  "postToolUse": {
    "Edit": "npx tsc --noEmit 2>&1 | head -20"
  }
}
```

### Alert on console.log
Detect `console.log` introduced in an edited file:
```json
{
  "postToolUse": {
    "Edit": "grep -n 'console.log' $FILE && echo '⚠️  console.log found'"
  }
}
```

## Recommended Stop Hooks

Check all modified files for console.log before session ends:
```json
{
  "stop": "git diff --name-only | xargs grep -l 'console.log' 2>/dev/null && echo '⚠️  console.log in modified files'"
}
```

## Notes

- Use hooks for well-defined, trusted workflows
- Test hooks locally before adding to shared config
- See `rules/common/hooks.md` for general hook guidance
