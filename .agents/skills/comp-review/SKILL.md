---
name: comp-review
description: Review SDD implementation compliance and change quality on stable snapshots, using fresh independent reviewers when available and risk-based gates before delivery.
---

# Compass Implementation Review (`comp-review`)

Apply the shared [verification and review policy](../comp-engineer/references/verification.md) for evidence reuse, combined final review and scoped frozen-suite repairs. Reuse recorded readiness/check/review evidence when relevant criteria, source, tests, configuration, dependencies and environment are unchanged. A stage transition does not trigger another validation. Run only missing or invalidated checks and scoped review; expand scope if impact is uncertain. One current combined requirements/code/test-quality review satisfies the final gate across stages; mandatory CI, human and independent pre-freeze test validation remain separate.


Use the current host's native skill invocation and exposed tools; bare `comp-*` names identify capabilities, not a fixed command syntax. Honor applicable host/repository instructions (including `AGENTS.md` or `CLAUDE.md`) and permissions; missing delegation never waives mandatory review.

Review the actual change against current intent, plan, tasks, repository constraints, and walkthrough evidence. This review is separate from requirements analysis and does not authorize merge or deployment. Use actual project paths and checks; no particular stack or review service is required.

## Decisions, Modes & Existing Work

- Match the requested action: a standalone analysis, review, or readiness assessment is read-only. Report findings without entering implementation/shipping, repairing artifacts, or logging to walkthrough unless those writes were requested. Mandatory logging applies when actually executing an authorized stage, not when assessing it.
- Follow higher-priority platform instructions and explicit user authorization. Within the project, user-agreed outcomes define intent; mandatory repository/constitution rules constrain the solution; plans/tasks implement that intent; code is evidence of current behavior, not permission to change requirements. Resolve harmless stale details from evidence. For material intent/rule conflicts, identify the conflict and ask the authorized owner; record any approved exception, scope, owner, and rationale. Never silently weaken security/data safeguards or mandatory gates.
- Choose **standard** for substantial or risky work, **light** for small bounded work, and **spike** for an explicitly exploratory task. Record the choice; the user can override document size, but required safety and verification still apply. Light artifacts may combine sections and omit empty phases. A spike keeps `intent.md` plus `walkthrough.md`, with its learning plan/checklist embedded in intent; production implementation uses a new or revised standard/light plan after the learning result is accepted.
- On rerun, read existing artifacts and evidence first. Preserve user edits, criterion/task IDs, completed work, decisions, and walkthrough history. Update only affected sections; append IDs for new work. Changed behavior reopens affected tasks with a reason and invalidates their checks/review. Removed work is marked `SUPERSEDED` with a reason, not silently deleted or counted DONE. Recompute progress from active tasks; do not reset it to zero.

---


## Review Timing & Independence

Apply [stage capability preflight](../comp-engineer/references/hosts.md#stage-capability-preflight) to the actual reviewer/session and use the reviewer envelope in [portable role packets](../comp-implement/references/packets.md). A rendered native role, different host name or new directory does not prove fresh context, independence or enforced read-only permissions.

- Before implementation, the plan records risk, required reviewer, and blocking gates. Reassess risk when scope changes; small diffs can still be high risk.
- Review a changed task before DONE when it touches security, persistent data, public contracts, or a prerequisite other tasks rely on. Review the full final change before ship. Low-risk work may combine these into one final review; use independent review when available and authorized, with labeled self-review as a fallback when permitted.

| Risk | Examples | Required review |
|---|---|---|
| Low | Documentation, isolated reversible changes | Focused self-review of both dimensions below; record that it was self-review |
| Medium | Shared behavior, integration or public interface changes | Both dimensions and affected caller/contract checks; independent review preferred, required if project policy/plan says so |
| High | Authorization, sensitive data, destructive migration, irreversible effects | Independent reviewer or human review of both dimensions; required reviewer unavailable means review remains PENDING and delivery is blocked |

For the final gate, use one fresh-context independent reviewer when available and authorized to assess requirements, code and test quality together. Reuse a current combined review at Ship; dispatch again only for missing or invalidated scope. An explicitly requested self-review or unavailable delegation can use labeled self-review for low/medium risk only if the plan/policy permits it; record the reason. High-risk and other mandatory independent/human gates stay PENDING when the required reviewer is unavailable. Subagent review does not replace a specifically required human or specialist approval.

A reviewer must have authored none of the changes it reviews. If this skill is invoked as the reviewer subagent, perform the assigned review and return findings; do not spawn another reviewer or edit project artifacts. The coordinator records the result during authorized execution. A standalone review remains read-only.

### Reviewer Packet & Stable Snapshot

Supply the reviewer with task/criterion references, agreed intent and constraints, actual combined diff/files, relevant callers/tests, verification evidence and limitations, risk/review gates, and snapshot identity (revision or relevant file hashes). Use a fresh context without the implementer's preferred conclusion or full conversation history. Include technical rationale only when needed to understand a tradeoff; the reviewer must inspect the actual change rather than trust a success report.

The coordinator pauses writers to reviewed files and dependencies until the review returns. The reviewer reports the snapshot it inspected and whether any input changed during review; a stale or unstable review cannot pass the current gate. Reviewers may run authorized non-mutating checks; do not modify files/shared outputs under a read-only review. Have the coordinator run checks with write side effects separately, or use an authorized isolated workspace.

A single reviewer may cover both dimensions; split reviewers only when expertise or scope justifies the extra context. Fixes go to the implementer/coordinator, then affected checks and scoped re-review run on the new snapshot.

## Two Review Dimensions

Apply the [code quality rules](../comp-engineer/rules/code-quality.md) when reviewing implementation quality.
Apply the [debug artifact rule](../comp-engineer/rules/no-debug-artifacts.md) during review. Report task-introduced temporary diagnostics as findings for the implementer to remove; rerun affected checks and review the updated snapshot. Apply the [dependency rule](../comp-engineer/rules/dependency-use.md) when dependencies changed and [compatibility rules](../comp-engineer/rules/compatibility.md) to changed public contracts and persisted formats.

For a pre-freeze test-validation assignment, use the [required independent test gate](../comp-implement/references/testing.md#independent-test-validation--required-before-freeze) instead of waiting for implementation. A fresh reviewer that authored neither suite/resources nor proposed implementation must compare agreed intent/plan to assertions in both directions, inspect coordinator-run harness and spec-derived correct/defective controls, and return `Test validation: PASS/BLOCKED` bound to input/suite identities. Low-risk self-review fallback does not apply to this gate; missing reviewer/evidence blocks freeze. Ordinary implementation review still follows the dimensions below.

1. **Spec compliance**: Does behavior meet each applicable criterion, scope boundary, failure expectation, and mandatory project rule? Identify missing behavior and extra features even when tests pass. Use the coverage mapping from artifact analysis.
2. **Implementation/artifact quality**: Inspect the actual diff and affected callers for correctness, error handling, data/security risks, compatibility, accessibility where applicable, maintainability, and needless complexity. Check that verification exercises the claimed behavior. For documentation or spikes, review content/evidence instead of inventing application tests.

For bug fixes, confirm a reproduction or equivalent evidence of the original failure, root-cause rationale, and verification of the corrected behavior. If reproduction is unavailable, state the limitation; do not claim the original issue is proven fixed.

For behavior changes, apply [acceptance and business logic testing](../comp-implement/references/testing.md). Compare test expectations directly with intent; inspect meaningful assertions, relevant boundaries/failures, and changed integration paths. Check negative-control evidence or its stated limitation. Flag tests that merely reproduce the implementation or mocks that bypass the rule. Missing required behavioral tests/evidence blocks DONE and delivery even when lint/build or other tests pass; do not demand tests for unchanged trivial code or a new coverage percentage.

## Findings & Closure

For behavior changes, also verify separate test authorship before implementation, freeze identities/inventory/hashes, documented test-read guidance and sanitized context, sanitized feedback, and coordinator-run evidence. Missing required role/context separation or a frozen-test edit without scoped intent/plan impact assessment and any required revision and a newly reviewed/frozen suite blocks DONE/delivery. Review is not permission to repair frozen tests in place, including harness errors.

- Each finding contains severity, actual path/line or artifact section, evidence, impact, and suggested correction. Avoid speculative issues with no plausible affected scenario.
- **BLOCKER**: correctness/security/data-loss issue, mandatory-rule violation, missing core behavior, or missing required verification/reviewer. Blocks DONE for the affected task and blocks delivery.
- **MAJOR**: material compatibility, integration, failure-handling, or maintainability issue. Resolve before delivery, or record an authorized deferral with impact and owner. Security, data-loss, and mandatory gates cannot be downgraded through an ordinary deferral.
- **MINOR**: non-blocking improvement; record without expanding the task automatically.
- The implementing stage fixes authorized, in-scope issues, updates the walkthrough, runs affected checks, and requests a scoped re-review. A code/criteria change invalidates the relevant earlier approval; record what the re-review covered.
- Stop an unchanged review/fix loop when there is no new evidence or safe correction; record the blocker instead of repeating attempts.

Return **READY**, **CHANGES REQUIRED**, or **PENDING REVIEW**, with risk, reviewer/independence, reviewed revision or current diff scope, findings, and checks actually performed. Never infer a pass from old evidence.

The invoking stage records this result in `walkthrough.md` and carries unresolved findings into delivery. A standalone review reports findings without modifying code or artifacts unless edits were explicitly requested.
