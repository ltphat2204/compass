---
name: comp-analyze
description: Review SDD requirements quality and cross-artifact consistency before planning, implementation, or delivery; report traceable findings without editing artifacts.
---

# Compass Artifact Analysis (`comp-analyze`)

Use the current host's native skill invocation and exposed tools; bare `comp-*` names identify capabilities, not a fixed command syntax. Honor applicable host/repository instructions (including `AGENTS.md` or `CLAUDE.md`) and permissions; missing delegation never waives mandatory review.

Use this read-only gate for requirements quality or consistency between intent, plan, tasks, and evidence. It does not test implementation correctness or grant delivery permission.

## Decisions, Modes & Existing Work

- Match the requested action: a standalone analysis, review, or readiness assessment is read-only. Report findings without entering implementation/shipping, repairing artifacts, or logging to walkthrough unless those writes were requested. Mandatory logging applies when actually executing an authorized stage, not when assessing it.
- Follow higher-priority platform instructions and explicit user authorization. Within the project, user-agreed outcomes define intent; mandatory repository/constitution rules constrain the solution; plans/tasks implement that intent; code is evidence of current behavior, not permission to change requirements. Resolve harmless stale details from evidence. For material intent/rule conflicts, identify the conflict and ask the authorized owner; record any approved exception, scope, owner, and rationale. Never silently weaken security/data safeguards or mandatory gates.
- Choose **standard** for substantial or risky work, **light** for small bounded work, and **spike** for an explicitly exploratory task. Record the choice; the user can override document size, but required safety and verification still apply. Light artifacts may combine sections and omit empty phases. A spike keeps `intent.md` plus `walkthrough.md`, with its learning plan/checklist embedded in intent; production implementation uses a new or revised standard/light plan after the learning result is accepted.
- On rerun, read existing artifacts and evidence first. Preserve user edits, criterion/task IDs, completed work, decisions, and walkthrough history. Update only affected sections; append IDs for new work. Changed behavior reopens affected tasks with a reason and invalidates their checks/review. Removed work is marked `SUPERSEDED` with a reason, not silently deleted or counted DONE. Recompute progress from active tasks; do not reset it to zero.

---


## Inputs & Scope

- Resolve the requested feature folder and existing repository guidance. Default: `dev/{feature-slug}/`. Use actual paths and available discovery tools; no specific stack, specs folder, or CodeGraph dependency is required.
- Read only relevant artifact sections and the repository evidence needed to validate their claims. Standard/light work uses `intent.md`, `plan.md`, and `tasks.md`; spikes may embed the plan and checklist in `intent.md`, with results in `walkthrough.md`.
- Select the requested gate: **requirements** before planning, **consistency** after task generation/before implementation, or **delivery** after implementation. Missing required inputs block that gate; an intentionally omitted spike artifact does not.
- Treat explicit user decisions as intent, project constitution/repository instructions as constraints, and the plan as a proposal. Do not silently change any of them. Report material conflicts for the authorized owner to resolve; an implementation preference cannot waive a mandatory rule.

## 1. Requirements Quality

Evaluate the requirements themselves, independently of whether code or tests pass:

1. Are the problem, affected users/scenarios, desired outcome, and exclusions clear?
2. Is each acceptance criterion observable and unambiguous? Flag words such as "fast" or "secure" when their meaning materially affects acceptance.
3. Are applicable error, boundary, recovery, compatibility, security, and performance expectations defined or intentionally excluded with a rationale?
4. Are facts, agent assumptions, user decisions, and deferred questions distinguished? A blocking product choice cannot be treated as an agreed default.
5. Are acceptance outcomes separated from implementation choices? For a spike, use a learning question, time/resource bound, evidence, and a stop/go criterion rather than production promises.

Use existing criterion IDs or stable section references; new criteria use `AC-01`, `AC-02`, etc. Do not renumber existing IDs. A missing cosmetic detail is not a blocker.

## 2. Cross-Artifact Consistency

Build a compact coverage table:

| Criterion/reference | Plan decision | Task ID | Verification | Evidence (delivery only) |
|---|---|---|---|---|
| Actual criterion | Actual section | Actual task | Command/procedure + working directory | Observed result or missing |

- Flag criteria without tasks/checks, tasks without a scoped requirement or necessary supporting rationale, conflicting behavior/terminology, unsupported architecture assumptions, and dependency/order errors.
- Validate verification procedures against actual configuration when available. Unavailable checks remain unavailable; absence of CI is not a pass.
- For behavior changes, use [acceptance and business logic testing](../comp-implement/references/testing.md) to check agreed examples/expected results, existing or planned executable tests for changed rules, relevant boundary/failure and integration checks, and test-task ownership. A command alone is not behavioral coverage. During planning, tests may be planned paths; at delivery, require actual tests and current results. Justified manual checks remain valid for suitable outcomes.
- At delivery, compare completed tasks and walkthrough evidence with the current criteria and changed files. A checked box alone is not completion evidence. Changed requirements invalidate affected previous results.
- For behavior implementation readiness, require separate test authorship, reviewed freeze with inventory/hashes bound to intent/plan, documented test-read guidance and sanitized context, and sanitized packets. At delivery verify frozen-suite integrity and coordinator-run results. A frozen-test change without complete intent/plan revision and replacement freeze blocks readiness; generic inline fallback cannot waive this gate.
- Compare mandatory repository rules with all artifacts. Distinguish a proposed exception from an explicitly authorized amendment; do not weaken a rule to make the report pass.

## 3. Findings & Gate Decision

Pre-freeze behavior readiness requires a current independent `Test validation: PASS` with agreed source-to-assertion mapping, runner/control evidence, reviewer independence, and matching source/suite/resource identities. Planning readiness may name this future task; implementation readiness may not substitute a planned review or the test author's report for actual PASS. Missing evidence or changed inputs blocks freeze/implementation.

Report each finding with ID, severity, source path/section, evidence, impact, and the smallest correction. Keep stable finding IDs when re-analyzing an earlier report.

| Severity | Meaning | Gate effect |
|---|---|---|
| BLOCKER | Mandatory-rule violation, unresolved material product decision, missing required artifact, uncovered core criterion, contradiction preventing correct implementation, or absent required delivery evidence | BLOCKED |
| MAJOR | Material ambiguity, missing relevant failure behavior, unsupported assumption, or incorrect task dependency | BLOCKED until resolved or explicitly deferred by the authorized owner with bounded impact |
| MINOR | Non-blocking clarity or maintainability concern | READY with listed findings |

Return **READY** or **BLOCKED**, the reviewed inputs/current revision or content scope, coverage gaps, findings, and the next safe action. "READY for planning" is not "implementation verified" or merge approval.

Do not edit artifacts or create a report file during this read-only invocation. The invoking stage may record the report in its artifact and apply in-scope corrections when authorized. Ask only for decisions evidence cannot resolve. Re-check affected findings after corrections and whenever relevant inputs change.
