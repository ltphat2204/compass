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
| OpenCode | `.opencode/skills/` or `.agents/skills/` | Use the native skill tool/selector or ask for `comp-engineer` |
| Other Agent Skills host | Its documented skill directory | Its selector, or explicitly load the installed `comp-engineer/SKILL.md` |

Keep all nine sibling folders and their resources together. Resolve cross-skill links from the loaded file's real location. Bare `comp-*` names identify capabilities; use plugin-qualified names when the host namespaces them. Generic skill copying and skills CLI install skills/resources only. Compass's project installer also renders native project roles for Codex, Claude and OpenCode; Claude plugin-qualified roles require loading the plugin.

Sources: [Codex skill discovery](https://learn.chatgpt.com/docs/build-skills), [Claude skill locations](https://code.claude.com/docs/en/skills), [Cursor skills](https://prod.cursor.com/help/customization/skills), [Copilot skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills), [OpenCode skills](https://opencode.ai/docs/skills/).

## Native lifecycle hooks

Repository marketplace plugins bundle four command hooks in the native default `hooks/hooks.json`: UserPromptSubmit (goal intake), PreToolUse (frozen resources), PostToolUse (stale evidence), and Stop (explicit completion attempt). Codex and Claude Code share the command protocol used here; Codex supplies `CLAUDE_PLUGIN_ROOT` for compatibility. Python 3.9+ and enabled/trusted native hooks are required. Confirm the actual event/tool coverage before relying on a guard.

Use the [coordinator hook contract](hooks.md) when the runtime is present. Copied skills, project installer payloads, and the skills-only submission ZIP have no runtime hooks and retain manual gates. Hooks are workflow guardrails, not filesystem isolation or proof of independent review.

OpenCode 2 has a separate project adapter: configure the checkout's `integrations/opencode` directory, whose `index.js` forwards to the shared Python checks. The installed 2.0.32 rejects configured file paths. Its completion check uses bounded post-success continuation, not a synchronous Stop veto; plugin reload resets in-memory tracking. Native checks passed all four hooks on Codex CLI 0.162.1, Claude Code 2.1.302 and OpenCode 2.0.32. These hook checks are separate from the historical full-workflow and role evidence below.

Sources: [Codex hooks](https://learn.chatgpt.com/docs/hooks), [plugin discovery](https://developers.openai.com/plugins/build/plugins#configure-lifecycle-hooks), [Claude hooks](https://code.claude.com/docs/en/hooks).

## Stage capability preflight

Check capabilities when entering the stage that needs them, and again after changing host/session or relevant tools. The coordinator records actual tool names, observed behavior, authorization, limits and missing evidence in the existing plan/walkthrough; do not create a second task system or inject every host's configuration. A CLI version, role file or previous host's report cannot prove current capabilities. Skills do not grant permission to use tools.

| Stage | Required observation | If unavailable |
|---|---|---|
| Intent / Plan / Analyze | Read applicable instructions, repository and existing artifacts; inspect contracts and evidence using exposed tools | Explain missing inputs and continue independent authorized discovery; do not claim requirements are ready without material facts |
| Test author / validation | Authorized fresh minimal-context test author and independent test reviewer; coordinator can run actual runner and spec-derived controls, identify source/suite/resources and preserve private evidence | Prepare useful public criteria/plan; test gate stays BLOCKED, never author self-approval or a fabricated PASS |
| Behavior Implement | Current independent PASS and FROZEN suite; fresh implementation context without private cases/history; explicit read guidance/write ownership, ready dependencies, production editing tools and coordinator-run checks | Behavior implementation BLOCKED; planning/review and independent non-behavior work may continue. Missing host-enforced filesystem isolation alone does not block |
| Review | Fresh reviewer that authored none of the snapshot, stable identities, actual source/callers and coordinator verification evidence; any required human/specialist review | Mandatory review remains PENDING. Only policy-permitted low/medium-risk final self-review may be labelled as such; it cannot replace independent pre-freeze test validation |
| Ship | Current criteria/integration/review evidence, actual repository delivery tools/access and action-specific authorization | Give verified local handoff when permitted; remote review/merge/deployment remains explicitly pending or not applicable according to scope |
| Resume on another host | Reconcile existing IDs/artifact root/status/evidence and source/suite identities; check the next stage's current capabilities; build the role-specific sanitized packet | Preserve valid progress and pending gates; never send full private walkthrough to an implementer or infer transferred approval |

Use [portable role packets](../../comp-implement/references/packets.md) and [strict testing](../../comp-implement/references/testing.md). Fresh context excludes coordinator conversation history; a new directory does not erase an inherited context. Prompt boundaries are behavioral instructions, not OS security controls. Do not change permissions, install global tools, choose paid providers or alter credentials to manufacture readiness.

## Evidence levels and support matrix

Record installation (payload/lifecycle), discovery (host actually lists/loads skills and roles), workflow (observed full test-author → independent validation → freeze → implementation → review) and resume separately. A schema validator or green package test establishes only its own layer. Runtime events, source/suite identities and coordinator execution evidence are required for workflow claims. Missing CLI, authentication, tools or reviewer is PENDING/BLOCKED with the affected stage; never PASS. Record host version, surface, date, command, outcome, source revision and limitations for each run.

The baseline below was updated 2026-10-18; it records the environment inspected while developing these adapters, not universal support guarantees. See the repository's `evals/results.md` for actual executed evaluation evidence and later changes. Model behavior varies by session and policy; repeat stage preflight rather than trusting this table.

| Host / surface | Observed version | Discovery / resources | Delegation / independent review | Resume / workflow evidence | Limits and sources |
|---|---|---|---|---|---|
| Codex CLI | 0.162.1 | Project skill path documented; installer/schema checks and actual discovery are separate | Native custom TOML roles documented; parent permissions apply; validate fresh tools/context in the active session | Durable C19 independently accepted: native fresh author/review/sterile implementation/final review,3production test methods PASS twice,49immutable identities unchanged, final READY, terminal0 and4/4 tracker. Encrypted-assignment/generic-role/behavioral-filesystem limitations retained; earlier courier/quota failures preserved. Separate C20 handoff accepted with recorded limits | [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents); role metadata cannot override parent sandbox/approval/provider/MCP permissions |
| Claude Code CLI / plugin | 2.1.300 historical; interactive2.1.302 | Plugin manifest reads canonical resources; copied skills use native directory | Native Markdown roles with tool allowlists; use fresh non-fork workers | C19 independently accepted on CLI2.1.302: native skill/roles, revised and reviewed v2 freeze,13tests PASS twice,26immutable files unchanged, final READY and8/8 active tasks complete. Resumed earlier Claude scaffold; context separation observed, not filesystem-enforced. No Claude-specific cross-host resume claimed | [Subagents](https://code.claude.com/docs/en/sub-agents); plugin roles and copied project roles use different namespaces; a tool allowlist does not enforce test secrecy |
| Cursor IDE / agent surfaces | Unavailable locally | Skill paths documented; local copy checks do not prove IDE discovery | Use only exposed authorized native delegation; no role file format assumed here | Supported project packaging; native discovery, delegation, full workflow and resume UNVERIFIED / PENDING | [Skills](https://prod.cursor.com/help/customization/skills); distinguish actual IDE/agent build and tools |
| GitHub Copilot CLI | Unavailable locally | `.github/skills/` documented; installed resource checks are packaging only | Use actual CLI capabilities; Compass does not claim native role adaptation here | Supported project packaging; native discovery, delegation, full workflow and resume UNVERIFIED / PENDING | [Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills), [CLI commands](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) |
| GitHub Copilot IDE surfaces | Not inspected | Check documented skill support for the specific IDE/extension | Do not infer CLI delegation or invocation parity | Supported skill packaging; IDE discovery/delegation/workflow/resume UNVERIFIED / PENDING; no IDE evaluation performed | Same official skill source; record IDE/extension versions separately |
| OpenCode CLI | 1.17.10; temporary1.18.0 | Managed native catalog loaded nine skills and three roles; user-authorized free DeepSeek responds on1.18.0 (free-tier minimum) | Actual native Task comp-implementer dispatch and child export observed; reviewer permission map loaded; not a general enforcement proof | C19 scoped full lifecycle accepted: native distinct role contexts,7production tests PASS and final READY; source binding reconstructed, minor scope deviations retained. C20 Codex→OpenCode handoff independently accepted: actual fresh native implementer/reviewer, frozen4tests PASS; minor packet-scope deviations retained | [Agents](https://opencode.ai/docs/agents/), [Config](https://opencode.ai/docs/config/); `--pure` disables external plugins, not global settings/skills |

## Native role adapter contract

Keep `agents/comp-test-author.md`, `agents/comp-implementer.md` and `agents/comp-reviewer.md` as the single responsibility source. Installed native wrappers adapt metadata only; they must not fork the workflow, select models, rewrite permissions globally or relax gates. Managed role files follow the same ownership/hash and no-overwrite rules as skills.

| Target | Native project role files | Permission meaning |
|---|---|---|
| Claude | `.claude/agents/comp-*.md` | Preserve source `tools` allowlists; reviewer has Read/Glob/Grep only |
| Codex | `.codex/agents/comp-*.toml` | `name`, `description`, `developer_instructions`; read-only responsibility is behavioral under inherited parent permissions, not a Claude-equivalent tool sandbox |
| OpenCode | `.opencode/agents/comp-*.md` | v1 `description`, `mode: subagent`, `permission`; deny by default, reviewer read/glob/grep only, task delegation denied |
| Cursor / Copilot | Common role packets inside installed skills | No native wrapper claimed until its format and lifecycle are verified |

Claude plugin discovery continues to use the original `agents/` directory. Avoid loading plugin roles plus copied copies in one session. Unsupported source role metadata must be reported rather than silently dropped. Successful rendering validates file semantics only; it is not proof the host used the role or respected its responsibilities.

Codex evaluation notes: durable session history can expose native subagent activity and actual spawn arguments that CLI JSON omits. In the observed CLI, `--ephemeral` prevented later stored-thread inspection; a non-ephemeral probe exposed parent/child IDs and `fork_turns: none`. Use the installed version's [App Server read APIs](https://learn.chatgpt.com/docs/app-server) for the evaluator's own threads only. Assignment bodies were encrypted: matching ciphertext proves delivery, not plaintext sanitization. Audit a separate dispatcher's actual public inputs/read history when private coordinator context cannot be inspected directly.

OpenCode evaluation notes: set the project explicitly with `run --dir PROJECT` and confirm the tool working directory before dispatch. Use native Task to invoke these `mode: subagent` roles; selecting one as the primary `run --agent` fell back to the default agent in the observed CLI. Invalidate the context after a wrong-workspace or private-context leak. Model choice remains an explicit user/session decision, never part of generated roles.

## Capability mapping

- Read the actual host/repository instructions, including `AGENTS.md`, `CLAUDE.md`, or scoped rules when applicable. Do not import another host's private configuration or reinterpret installed skills as approval to act.
- Discover the tools actually exposed. Use native file/search/shell/review tools; do not invent Codex tool names on Claude, Cursor or Copilot. Preserve project-specific command conventions and working directories.
- Delegate only when the host exposes an authorized subagent facility. Claude plugin roles `compass:comp-test-author`, `compass:comp-implementer`, and `compass:comp-reviewer` are available choices; give them actual installed skill/reference paths plus distinct sanitized packets. Other hosts use native subagents with equivalent role boundaries. Do not assume identical APIs, inherited context, checkout isolation, or a fixed concurrency limit. A role's tool list does not enforce filesystem read isolation.
- The Claude reviewer role has only Read/Glob/Grep tools. The coordinator runs checks and supplies execution evidence; the reviewer inspects source and evidence without claiming it executed those checks. Tool restrictions do not replace host permissions or write-scope discipline for implementers.
- For behavior changes, [strict testing](../../comp-implement/references/testing.md) requires separate fresh test/implementation subagents, pre-implementation freeze, and sanitized contexts and instructions not to inspect tests through tools, files, Git, logs, artifacts or remote access. Shared filesystems and host permissions are allowed; host-enforced isolation is optional and its absence does not block implementation. Missing delegation blocks implementation; do not claim a folder/worktree or role prompt enforces secrecy. For non-behavior work only, unavailable delegation permits inline/serial execution. Required independent/human review stays PENDING; an author's second pass is self-review.
- For hosts without skill discovery, explicitly load the relevant skill and resources on demand. Do not inject all nine instructions into every task. For a separate reviewer session, provide a stable snapshot and criteria and verify independence; importing another task's final conclusion is not review evidence.

Installation targets only an explicitly selected project. Do not install globally, change other projects, relax permission rules, or enable experimental agent-team features merely to run Compass. Keep the same criteria, task IDs, artifact root, coordinator ownership and gates across hosts.
