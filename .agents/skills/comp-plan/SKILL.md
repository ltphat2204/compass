---
name: comp-plan
description: Transform SDD intent into a risk-appropriate implementation plan and preserved task tracker, with requirements readiness, review gates, and verification coverage.
---

# Compass Technical Planning (`comp-plan`)

Apply the shared [verification and review policy](../comp-engineer/references/verification.md) for evidence reuse, combined final review and scoped frozen-suite repairs. Reuse recorded readiness/check/review evidence when relevant criteria, source, tests, configuration, dependencies and environment are unchanged. A stage transition does not trigger another validation. Run only missing or invalidated checks and scoped review; expand scope if impact is uncertain. One current combined requirements/code/test-quality review satisfies the final gate across stages; mandatory CI, human and independent pre-freeze test validation remain separate.


Use the current host's native skill invocation and exposed tools; bare `comp-*` names identify capabilities, not a fixed command syntax. Honor applicable host/repository instructions (including `AGENTS.md` or `CLAUDE.md`) and permissions; missing delegation never waives mandatory review.

## Decisions, Modes & Existing Work

- Match the requested action: a standalone analysis, review, or readiness assessment is read-only. Report findings without entering implementation/shipping, repairing artifacts, or logging to walkthrough unless those writes were requested. Mandatory logging applies when actually executing an authorized stage, not when assessing it.
- Follow higher-priority platform instructions and explicit user authorization. Within the project, user-agreed outcomes define intent; mandatory repository/constitution rules constrain the solution; plans/tasks implement that intent; code is evidence of current behavior, not permission to change requirements. Resolve harmless stale details from evidence. For material intent/rule conflicts, identify the conflict and ask the authorized owner; record any approved exception, scope, owner, and rationale. Never silently weaken security/data safeguards or mandatory gates.
- Choose **standard** for substantial or risky work, **light** for small bounded work, and **spike** for an explicitly exploratory task. Record the choice; the user can override document size, but required safety and verification still apply. Light artifacts may combine sections and omit empty phases. A spike keeps `intent.md` plus `walkthrough.md`, with its learning plan/checklist embedded in intent; production implementation uses a new or revised standard/light plan after the learning result is accepted.
- On rerun, read existing artifacts and evidence first. Preserve user edits, criterion/task IDs, completed work, decisions, and walkthrough history. Update only affected sections; append IDs for new work. Changed behavior reopens affected tasks with a reason and invalidates their checks/review. Removed work is marked `SUPERSEDED` with a reason, not silently deleted or counted DONE. Recompute progress from active tasks; do not reset it to zero.

---

## Project Adaptation

Keep the Compass lifecycle and artifact handoffs; adapt implementation to repository evidence.

- Use the user's instructions, repository guidance, existing code, manifests, and CI to establish architecture, relevant paths, verification commands, and delivery conventions. Do not infer a stack from these templates.
- Use `dev/{feature-slug}/` by default; honor an established or user-selected artifact root and carry it consistently through all stages, including archiving.
- Choose available discovery tools by codebase, task scope, and user preference: CodeGraph for symbol/caller tracing; Understand Anything (UA) or Graphify for broader architecture/domain exploration and intent clarification. Reuse existing indexes/graphs, verify relevant findings against current source, and use targeted search when sufficient. RTK can reduce shell output; Ponytail reinforces simplicity. All these tools are optional; evidence-first discovery and minimal correct changes remain required.
- Read existing specs where they live. Missing tools, specs, or checks are not reasons to invent scaffolding; record the fallback, limitation, or applicable alternative.

---

Transform ready intent into an actionable plan and companion tracker in the same feature folder. Use the repository's architecture and existing artifacts.

During approach selection, read the [design principles](../comp-engineer/rules/design-principles.md), [compatibility rules](../comp-engineer/rules/compatibility.md), and [dependency rule](../comp-engineer/rules/dependency-use.md). Apply only relevant principles, prefer backward-compatible changes, and record rationale, compatibility impact, and trade-offs in the plan; do not add an acronym checklist.

If the input is a milestone parent, use the [decomposition rules](../comp-engineer/references/adaptive-workflow.md) to select a ready child before detailed planning. Keep parent constraints and criterion links in the child plan; do not expand all future children into speculative implementation tasks. A planning-only request remains planning-only.

## 1. Confirm Inputs & Requirements Readiness

Read current intent, relevant project guidance, existing plan/tasks/walkthrough, and the evidence needed for affected components. Confirm Project Context against actual code, manifests, and CI; use targeted inspection when indexed tools are unavailable.

Require a current requirements-quality gate from [comp-analyze](../comp-analyze/SKILL.md) when available. Otherwise check problem/scope, observable criteria, relevant error/recovery/non-functional expectations, and explicit assumptions directly. Record READY/BLOCKED with findings and reviewed scope in intent. Do not plan through an unresolved material product decision; correct factual stale details from evidence and ask only for choices evidence cannot settle.

## 2. Choose Plan Size & Gates

- **Standard**: use the five substantive sections below, plus metadata.
- **Light**: a compact plan may combine sections and omit empty phases. Retain outcome/scope references, actual changes, ordered work/dependencies, verification, risk/reviewer gates, and task handoff.
- **Spike**: update the bounded learning plan and checklist inside `intent.md`; keep results in `walkthrough.md`. Do not create standalone plan/tasks by default or add production architecture. If those artifacts already exist, preserve them and record which sections govern the experiment.

Record mode, source intent, status, and the risk/reviewer decision. Risk depends on behavior/data impact, not diff size. Low risk permits labeled self-review; medium risk requires affected callers/integration checks and any policy-mandated independent review; high risk requires an independent or human reviewer. Missing required review blocks delivery. Apply [comp-review](../comp-review/SKILL.md) when available; these requirements stand without it.

When delegation is available and authorized, plan scoped implementers for standard work and an independent final reviewer before Ship. Record task dependencies, write ownership/resources, parallel-safe groups, coordinator integration checks, and reviewer snapshot boundaries. Use inline/serial execution for tightly coupled work or unavailable delegation; do not weaken mandatory review. Prefer fresh packets over inherited full conversation context. See [delegation protocol](../comp-implement/references/delegation.md) when dispatch is needed.

## 3. Plan Contents

The standard layout has metadata followed by five sections:

1. **Strategy & Principles**: intended outcome, scope references, applicable constraints, relevant design principles, backward-compatibility status, and rationale for the smallest correct change.
2. **Deliverables & Architecture**: actual affected files/components/interfaces, existing patterns reused, and data/compatibility implications. Include only work the intent requires.
3. **Ordered Roadmap & Verification**: baseline/preparation, implementation, and acceptance/integration verification where applicable. Group phases by actual dependencies, not a mandatory three-phase count.
4. **Agent/Human Protocol & Review**: risk, required reviewer, review timing, blocking conditions, and how unresolved decisions or approved exceptions are handled.
5. **Task Handoff**: link to `tasks.md` and a criterion-to-task coverage table.

Include a verification matrix in the roadmap (or embedded spike plan):

| Criterion/reference | Example / expected result | Test path/name + existing/extend/new, or justified manual check | Command / working directory | Required gate |
|---|---|---|---|---|
| Existing ID or new AC-XX | Agreed observable outcome | Actual or planned check | Actual procedure / path | Acceptance/review/delivery |

For behavior changes, read [acceptance and business logic testing](../comp-implement/references/testing.md). Order separate test-author work, test review/freeze, sanitized packet preparation and test-read guidance, then fresh implementation subagents. Plan executable tests for changed rules and relevant boundary/failure/integration cases; retain adequate existing tests. Record test workspace/ownership, frozen-suite manifest and intent/plan identities, coordinator execution, and sanitized implementation packets. Light mode keeps these gates. Any frozen-test change requires scoped intent/plan impact assessment and any required revision before a replacement suite is authored/frozen. No new coverage percentage is imposed; mandatory repository gates remain required. This strict behavior gate overrides ordinary inline/delegation fallbacks.

Keep user/business outcomes separate from implementation choices. Confirm commands from the repo; manual checks are valid when suitable, unavailable checks are not passes. For bugs, include original-failure reproduction or equivalent evidence and a regression check proportional to risk. For spikes, map checks to the learning question and stop/go criterion.

## 4. Update Plan & Companion Tasks Safely

The pre-freeze test review is mandatory independent validation, including light mode: allocate a fresh test reviewer (not test author or implementation author), criterion/source-to-assertion mapping, runner validation and spec-derived positive/negative controls for changed non-trivial business rules. Require current `Test validation: PASS` before freeze; record validated source/suite identities and report reference. See [testing gate](../comp-implement/references/testing.md); generic risk-based self-review cannot replace it.

Create the plan only when absent; otherwise update the affected sections, preserving user edits and prior decisions. Record material scope changes and the checks/reviews they invalidate in walkthrough.

Use [comp-tasks](../comp-tasks/SKILL.md) when available. Otherwise maintain stable task IDs, descriptions, criterion references, dependencies, deliverables, checks, status, and progress directly. Do not regenerate an existing tracker from scratch: preserve DONE evidence, reopen only changed work with a reason, append IDs for new tasks, and retain removed work as SUPERSEDED. Count progress using active tasks.

For a spike, the companion tracker is its embedded intent checklist. Preserve existing artifact locations on resume.

## 5. Consistency Gate & Handoff

After updating tasks, use [comp-analyze](../comp-analyze/SKILL.md) in consistency mode when available; otherwise check criteria -> plan -> tasks -> verification coverage, scope/rule conflicts, terminology, and dependency order directly. Report findings with source references and severity. Missing core coverage, mandatory-rule violations, material contradictions, or unresolved consequential choices block implementation.

Record reviewed scope and READY/BLOCKED in the plan (intent for a spike). Apply authorized corrections and re-check before announcing readiness. Report changed artifact paths, preserved progress, remaining blockers, and the next safe stage; do not announce implementation readiness solely because files were written.

Before handing off to implementation, apply the [approval gate](../comp-engineer/references/adaptive-workflow.md#approval-before-implementation): present current intent/plan and a concise summary, then end the turn to await approval of both. Record approval against their current scope/version. Only a pre-existing, host-confirmed active automation goal covering this work skips this pause; record its identity/scope. Never create a Codex Goal to bypass approval. Reuse valid approval on resume and obtain it again for material revisions.

Distinguish artifact consistency from execution availability: a coherent plan can pass consistency while behavior implementation remains BLOCKED by unavailable delegation or another prerequisite. Report both explicitly; never label execution READY until its applicable prerequisites have evidence.
