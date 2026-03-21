# Plan

Activate the planner agent to establish a structured approach before implementation begins.

## Core Function

The planner performs four essential tasks:
1. Clarifies what requires construction
2. Highlights potential complications
3. Organises work into manageable phases
4. **MUST receive user approval before proceeding**

## When to Use

Apply `/plan` when tackling:
- New features or substantial architectural modifications
- Complex refactoring initiatives
- Multi-file changes affecting several components
- Ambiguous or unclear specifications

## Process Flow

1. Analyse the request
2. Break into phases with concrete steps
3. Identify component relationships and dependencies
4. Evaluate obstacles and risks
5. **WAIT for explicit user confirmation before touching any files**

## Approval Protocol

- Proceed: "yes", "go ahead", "proceed"
- Modify: "modify: [changes]" or "different approach: [alternative]"

**The planner will NOT write any code until you explicitly confirm.**

## After Plan Approval

- `/tdd` — test-driven development
- `/build-fix` — compilation issues
- `/code-review` — quality assessment
