# Skill Create

Analyse the repository's git history to extract coding patterns and generate SKILL.md files.

## Usage

```bash
/skill-create                    # Analyse current repo
/skill-create --commits 100      # Analyse last 100 commits
/skill-create --output ./skills  # Custom output directory
/skill-create --instincts        # Generate instincts too
```

## What Gets Analysed

The tool detects five pattern categories:

1. **Commit conventions** — message prefixes like "feat:", "fix:"
2. **File co-changes** — files that consistently change together
3. **Workflow sequences** — repeated file modification patterns
4. **Architecture** — folder structure and naming standards
5. **Testing patterns** — test locations and conventions

## Output Format

Generated SKILL.md files include:
- Frontmatter metadata (name, description, origin)
- Detected commit conventions
- Code architecture documentation
- Workflow sequences
- Testing standards

## SKILL.md Structure

```markdown
---
name: skill-name
description: When to activate this skill and what it covers
origin: your-repo
---

# Skill Name

## When to Activate
[Trigger conditions]

## Patterns
[Extracted patterns with code examples]
```

## Use Case

Run `/skill-create` after building a significant feature to capture the patterns you established. This creates institutional memory that future sessions can reference.
