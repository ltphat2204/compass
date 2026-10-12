# Host Integration

Read when running Compass on a new agent host or adapting delegation. The host supplies discovery, invocation, tools and permissions; Compass supplies lifecycle, artifact ownership, verification and review gates.

## Discovery and invocation

| Host | Project skill location | Invocation |
|---|---|---|
| Codex | `.agents/skills/` | Mention `comp-engineer` using the host's skill selector; CLI/IDE examples use `$comp-engineer` |
| Claude Code, plugin | Manifest points to `.agents/skills/` inside the plugin | `/compass:comp-engineer` |
| Claude Code, copied skills | `.claude/skills/` | `/comp-engineer` |
| Cursor | `.cursor/skills/` or `.agents/skills/` | `/comp-engineer` or select the skill with `@` |
| GitHub Copilot | `.github/skills/`; supported surfaces also discover `.agents/skills/` | Ask to use `comp-engineer`; CLI supports `/comp-engineer` |
| Other Agent Skills host | Its documented skill directory | Its selector, or explicitly load the installed `comp-engineer/SKILL.md` |

Keep all nine sibling folders and their resources together. Resolve cross-skill links from the loaded file's real location. Bare `comp-*` names in the instructions identify capabilities; use plugin-qualified names when the host namespaces them. A copied skill installation contains no Claude plugin agents; native roles are available only when the plugin is loaded.

Sources: [Codex skill discovery](https://learn.chatgpt.com/docs/build-skills), [Claude skill locations](https://code.claude.com/docs/en/skills), [Cursor skills](https://prod.cursor.com/help/customization/skills), [Copilot skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills).

## Capability mapping

- Read the actual host/repository instructions, including `AGENTS.md`, `CLAUDE.md`, or scoped rules when applicable. Do not import another host's private configuration or reinterpret installed skills as approval to act.
- Discover the tools actually exposed. Use native file/search/shell/review tools; do not invent Codex tool names on Claude, Cursor or Copilot. Preserve project-specific command conventions and working directories.
- Delegate only when the host exposes an authorized subagent facility. Claude plugin roles `compass:comp-implementer` and `compass:comp-reviewer` are optional choices; give them the actual installed skill/reference paths plus the scoped packet. Other hosts use their native worker/reviewer facility. Do not assume identical APIs, inherited context, checkout isolation, or a fixed concurrency limit.
- The Claude reviewer role has only Read/Glob/Grep tools. The coordinator runs checks and supplies execution evidence; the reviewer inspects source and evidence without claiming it executed those checks. Tool restrictions do not replace host permissions or write-scope discipline for implementers.
- When delegation is absent, implement inline/serially and record that fallback. Required independent or named human review stays PENDING until supplied. A second pass by the author is self-review, not independent review.
- For hosts without skill discovery, explicitly load the relevant skill and resources on demand. Do not inject all nine instructions into every task. For a separate reviewer session, provide a stable snapshot and criteria and verify independence; importing another task's final conclusion is not review evidence.

Installation targets only an explicitly selected project. Do not install globally, change other projects, relax permission rules, or enable experimental agent-team features merely to run Compass. Keep the same criteria, task IDs, artifact root, coordinator ownership and gates across hosts.
