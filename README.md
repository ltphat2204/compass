# Compass

**English** | [Tiếng Việt](README.vi.md) | [简体中文](README.zh-CN.md)

[![skills.sh](https://skills.sh/b/ltphat2204/compass)](https://skills.sh/ltphat2204/compass)

**Turn an idea or bug report into clear requirements, working code, and verification evidence.**

Compass is a set of nine skills for your coding agent. Start with `comp-engineer`; it chooses the next useful step, uses your repository's conventions, and scales the planning to the task.

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
