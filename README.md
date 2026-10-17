# Compass

**English** | [Tiếng Việt](README.vi.md) | [简体中文](README.zh-CN.md)

[![skills.sh](https://skills.sh/b/ltphat2204/compass)](https://skills.sh/ltphat2204/compass)

Licensed under the [Apache License 2.0](LICENSE).

**Turn an idea or bug report into clear requirements, working code, and verification evidence.**

Compass is a set of nine skills for your coding agent. Start with `comp-engineer`; it chooses the next useful step, uses your repository's conventions, and scales the planning to the task.

## Why Compass exists

AI can generate code faster than a developer can understand what was built or verify that it solves the right problem. Newcomers may get a working result without understanding its behavior or limits. Experienced developers may still have to do the analysis, split the work, anticipate edge cases, and direct every next step. Compass is designed to close both gaps.

It helps newcomers connect an idea to concrete behavior, understand meaningful decisions, and see how results are verified. For experienced developers, it investigates the codebase, challenges assumptions, compares approaches, and carries authorized work through verification. The user owns the goal and consequential product choices; the agent handles engineering analysis and execution within that scope.

Compass adapts to the request, whether it is a symptom, an unclear idea, or a milestone. It keeps the next step understandable and uses evidence to determine whether the work is complete.

## Philosophy

**Goals provide direction; evidence determines the next step.** Responsibilities and quality gates stay consistent while execution adapts to task size, risk, and available tools.

1. **Intent before implementation.** Define the problem, scope, constraints, and observable success criteria. Inspect the repository first; ask when a material decision cannot be inferred.
2. **Evidence before prescription.** Use existing architecture, conventions, toolchain, and CI. Do not impose a stack, layer, or dependency the task does not need.
3. **The smallest change that fully solves the task.** Reuse existing patterns and scale safeguards to behavioral and data impact.
4. **Distributed execution with clear accountability.** The coordinator assigns and integrates work and decides DONE; implementers work within scope; reviewers check independently.
5. **Verification demonstrates outcomes.** Every criterion has a check and actual evidence. Reports, missing tools, and skipped checks do not count as passes.
6. **Traceability survives change.** Preserve intent → plan → task → evidence → delivery links, stable IDs, decisions, notes, and history when resuming or replanning.
7. **Autonomy follows authorization.** Continue safe work within scope. Merges, deployments, destructive data changes, and external actions follow project authorization and rules.

## Install

Choose one route for each coding agent.

### Codex

Run in your terminal:

```sh
codex plugin marketplace add ltphat2204/compass
codex plugin add compass@compass
```

Open a new Codex session and select `compass:comp-engineer`, or type `$compass:comp-engineer` in the CLI. Requires a Codex version with `codex plugin` support.

### Claude Code

Run inside Claude Code:

```text
/plugin marketplace add ltphat2204/compass
/plugin install compass@compass
```

Start with `/compass:comp-engineer`.

### Cursor, GitHub Copilot, OpenCode, and other agents

Run from the project where you want Compass:

```sh
npx skills add ltphat2204/compass --skill '*' --copy
```

Select your coding agent when prompted. This installs all nine skills and their resources into that project. Select `comp-engineer` in your agent to start.

[Update, uninstall, project roles, and troubleshooting →](docs/installation.md)

## Start working

For the Codex plugin:

```text
$compass:comp-engineer Add CSV export for tasks. Allow scoped subagents
and independent review. Implement, verify, and hand off locally.
```

In Claude Code, use `/compass:comp-engineer`. With copied skills, select `comp-engineer` or use your host's skill syntax.

Describe a feature, a bug, or an uncertain idea. Compass inspects the repository, clarifies consequential decisions, and carries the authorized work through planning, implementation, and verification. A request to plan or review stops at that stage.

## How it works

```text
Intent → Plan → Tasks → Implement → Ship → Done
```

Analysis and review check the handoffs. Small tasks use shorter documents; behavior changes still require separate test authorship, independent validation, and frozen tests before implementation. A host without the required subagents can plan and review, but cannot pass the implementation gate.

Compass keeps requirements, tasks, and evidence in `dev/{feature}/`. It uses your existing stack and tools. Deployments, merges, and destructive operations follow the authorization and rules of your project.

| Skill | Use it to |
|---|---|
| `comp-engineer` | Coordinate the full workflow or resume work |
| `comp-intent` | Clarify the problem and success criteria |
| `comp-plan` | Choose an implementation approach |
| `comp-tasks` | Track work and dependencies |
| `comp-analyze` | Check requirements and artifact consistency |
| `comp-implement` | Implement ready tasks and verify results |
| `comp-review` | Review the changes against requirements |
| `comp-ship` | Check and deliver the result |
| `comp-done` | Archive accepted work |

## Learn more

- [Workflow, testing gates, and examples](docs/workflow.md)
- [Installation and updates](docs/installation.md)
- [Working apps: React, Next.js, and Next.js + NestJS](example/README.md)
- [Verification results and host limits](evals/results.md)
- [Maintainer checks and plugin submission](docs/publishing.md)
