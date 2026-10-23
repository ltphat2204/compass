# Working with Compass

[Install Compass](../README.md#install), then describe your outcome to `comp-engineer`. It chooses the next useful action from the repository and existing artifacts. You can also select a stage directly.

## Principles

- Clarify the problem and observable success criteria before choosing an implementation.
- Reuse the repository's architecture, tools, and conventions; make the smallest complete change.
- Match documentation depth to task size while keeping verification proportional to risk.
- Preserve task IDs, decisions, history, and evidence when work resumes or scope changes.
- Explain meaningful choices and representative checks so the user can understand the result.
- Continue within authorization; merges, deployments, destructive changes, and external actions follow project rules.

Compass is intended to help newcomers understand what they are building and experienced developers coordinate investigation, implementation, and review without driving every step themselves.

## Stages

| Skill | Responsibility | Output |
|---|---|---|
| [comp-engineer](../.agents/skills/comp-engineer/SKILL.md) | Coordinate and resume the lifecycle | Next action and handoff |
| [comp-intent](../.agents/skills/comp-intent/SKILL.md) | Clarify requirements and decisions | `intent.md` |
| [comp-plan](../.agents/skills/comp-plan/SKILL.md) | Choose the approach and verification | `plan.md` |
| [comp-tasks](../.agents/skills/comp-tasks/SKILL.md) | Track coverage, owners, and dependencies | `tasks.md` |
| [comp-analyze](../.agents/skills/comp-analyze/SKILL.md) | Check requirements and consistency | Read-only findings, READY/BLOCKED |
| [comp-implement](../.agents/skills/comp-implement/SKILL.md) | Implement ready work and integrate | Changes, checks, walkthrough |
| [comp-review](../.agents/skills/comp-review/SKILL.md) | Review a stable snapshot | Findings and gate status |
| [comp-ship](../.agents/skills/comp-ship/SKILL.md) | Verify and deliver within authorization | Delivery evidence |
| [comp-done](../.agents/skills/comp-done/SKILL.md) | Archive accepted work | Preserved archive |

A planning or review request does not authorize implementation or shipping. Standalone analysis/review is read-only. Shipping can mean local handoff; it does not imply deployment or remote merging.

Before implementation, present the current intent and plan (or the embedded learning plan for a spike) and wait for the user to approve both. This applies to light work and milestone children too. An initial implementation request, readiness, or silence does not approve artifacts the user has not seen. Only a pre-existing, host-confirmed active automation goal covering this work skips the pause. Never create a Codex Goal for an ordinary request or to bypass approval. Preserve valid approval on resume; material changes to scope, acceptance criteria, or approach require renewed approval. Tiny non-behavior direct corrections are exempt because they have no intent/plan handoff. See the [approval gate](../.agents/skills/comp-engineer/references/adaptive-workflow.md#approval-before-implementation).

## Choose the amount of work

| Situation | Approach |
|---|---|
| Small feature or bug | Smallest useful slice, short artifacts, focused verification |
| Unclear idea | Investigate and show a concrete example before consequential decisions |
| Milestone | Map outcomes, detail the next ready child, then check parent integration |
| Resume or change scope | Preserve valid evidence and IDs; revise affected requirements and tasks |
| Feasibility question | Timeboxed spike, findings and stop/go; no assumed production implementation |

Standard mode uses full artifacts. Light mode keeps them concise with the same mandatory gates. Spike mode records the learning plan in intent and findings in the walkthrough; production implementation requires a new scope. Low-risk corrections without behavior changes can finish inline without a feature folder.

Milestone children do not complete the parent until its integration and acceptance criteria pass. See [adaptive routing](../.agents/skills/comp-engineer/references/adaptive-workflow.md).

## Artifacts

The default is `dev/{feature-slug}/`; an existing or user-selected root is preserved.

```text
dev/{feature-slug}/
├── intent.md       # Problem, scope, criteria, decisions
├── plan.md         # Approach and verification gates
├── tasks.md        # Stable IDs, owners, dependencies, progress
└── walkthrough.md  # Actual changes, checks, evidence, limits
```

`comp-done` archives to `_archived/YYYYMMDD/{feature-slug}/` after confirmed delivery or accepted local completion, without overwriting existing work.

## Testing and review gates

Behavior changes, including hotfixes, follow this sequence:

1. A separate test author derives tests from the agreed intent, plan, and contracts.
2. A fresh independent reviewer validates the tests against the complete agreed rules, maps rules to assertions in both directions, and inspects coordinator-run harness checks plus correct/defective controls for changed non-trivial business rules.
3. Only `Test validation: PASS` for the exact source/suite snapshot permits freezing the inventory and hashes against the intent/plan versions.
4. A fresh implementer receives a sanitized packet and instructions not to inspect tests, fixtures, private cases, or test history, and not to edit or run the frozen suite.
5. The coordinator runs the checks privately, gives criterion-level feedback, integrates changes, and records actual evidence.

A shared filesystem is supported; host-enforced isolation is optional. Separate authorship, independent validation, freeze, and sanitized context remain mandatory, including light mode. Missing prerequisites block behavior implementation; hashes and green runs alone do not approve tests.

Changes to frozen tests or expectation-affecting resources require scoped intent/plan impact assessment, revision only where agreed behavior changes, affected task/evidence reconciliation, and a newly independently reviewed/frozen replacement suite. Preserve prior versions and history.

Reproduce a bug when practical and establish a failing baseline before the fix. If reproduction is unavailable, record the limit and evidence used. Test business rules at the lowest useful layer, integration boundaries when changed, and critical journeys when needed. Visual outcomes may use justified manual checks. There is no new percentage-coverage target.

Before planning, requirements must be clear and observable. Before implementation, intent, plan, tasks, and verification must agree. Before shipping, current checks and required reviews must pass. Missing tools, reviewers, or evidence leave the gate pending; they do not count as success.

Workers have bounded packets and write scopes; one writer owns each shared file/resource. They return changes and actual results. The coordinator owns the shared tracker, walkthrough, integration, and DONE decision. Run independent tasks concurrently only when dependencies and contracts are ready. Before Ship, use a fresh independent reviewer when available and authorized; self-review is allowed only by risk and policy, and cannot replace a required human reviewer.

For conflicts, the agreed intent defines outcomes, project instructions constrain the implementation, and plans/tasks implement the intent. Material conflicts need an authorized owner's decision rather than silently dropping a rule.

See [testing guidance](../.agents/skills/comp-implement/references/testing.md), [delegation protocol](../.agents/skills/comp-implement/references/delegation.md), [portable packets](../.agents/skills/comp-implement/references/packets.md), and [host capabilities](../.agents/skills/comp-engineer/references/hosts.md).

## Examples

Codex plugin syntax uses `$compass:comp-*`; Claude uses `/compass:comp-*`. Copied skills use the host's selector or skill syntax.

```text
$compass:comp-engineer Investigate this timeout and fix its root cause.
Allow scoped subagents and independent review; hand off locally.

$compass:comp-plan Plan from dev/retry/intent.md.

$compass:comp-review Review the changes against dev/retry/; report only.

$compass:comp-engineer Use a 30-minute spike to assess parser feasibility.
Provide findings and a stop/go recommendation; do not implement for production.
```

Three [working examples](../example/README.md) cover React + Vite, full-stack Next.js, and Next.js + NestJS. Their recorded checks are local, with production deployment and Safari/Firefox outside the recorded verification. [Evaluation cases](../evals/cases.md) and [results](../evals/results.md) distinguish package checks, native discovery, model workflows, and cross-host resume; passing one does not establish the others.

Verification runs on stable inputs before one combined requirements/code/test-quality review. Ship reuses current evidence; stage transitions do not trigger duplicate checks or reviews. After edits, rerun affected checks and scoped review; expand scope when impact is uncertain. Strict test independence and frozen-suite integrity remain required.
