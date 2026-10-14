---
name: comp-tasks
description: Create or update SDD task coverage from intent and plan while preserving IDs, completion evidence, user edits, dependencies, and progress across reruns.
---

# Compass Task Breakdown (`comp-tasks`)

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
- Prefer CodeGraph when an existing index and tool are available; otherwise use targeted search and source inspection. RTK and Ponytail are optional tools; evidence-first discovery and the smallest correct change remain required without them.
- Read existing specs where they live. Missing tools, specs, or checks are not reasons to invent scaffolding; record the fallback, limitation, or applicable alternative.

---

Maintain a checkable tracker from current intent and plan in the same feature folder. Preserve existing work on every invocation.

For milestone work, this tracker belongs to one ready child intent. Keep parent criterion references and cross-child prerequisites explicit; a sibling dependency is not DONE without delivery evidence. The parent outcome map follows [decomposition rules](../comp-engineer/references/adaptive-workflow.md), not a flattened tracker of every future child.

## 1. Read Before Writing

Read current intent, plan, tasks, walkthrough, and applicable repository constraints. For a spike, read the embedded learning plan/checklist in intent; no separate plan/tasks is required. If standard/light work has no ready intent or plan, report the missing prerequisite rather than inventing decisions.

Extract stable acceptance references, ordered work/dependencies, required checks/reviews, and deliverables. Use existing criterion IDs or stable section references; do not renumber them for presentation.

## 2. Decompose & Reconcile

Group tasks by actual dependencies or meaningful milestones. Standard/light work does not require exactly three phases; omit empty groups. For a spike, keep only bounded experiment work, evidence collection, and a stop/go conclusion.

Every active task has:

```markdown
- [ ] **TASK-XX: Task title**
  - **Criteria**: AC-XX or stable intent reference; supporting tasks explain necessity
  - **Description / Deliverable**: Specific work and actual output path
  - **Depends on**: Task IDs, or none
  - **Verification**: Criterion + example/expected result + test path/name (existing/extend/new) or justified manual check + command/procedure + working directory
  - **Review**: Required reviewer/gate from plan, if applicable
  - **Assignee / Write scope**: Coordinator or implementer; owned files/resources
  - **Execution**: Serial or parallel-safe group, with dependency/resource rationale
  - **Status**: TODO / IN_PROGRESS / BLOCKED / DONE / SUPERSEDED
```

- For delegated implementation, the coordinator is the sole writer of tasks/walkthrough/progress. Record disjoint write/resource scopes and settled dependencies before scheduling in parallel; shared config/fixtures/generated outputs also count. Workers return evidence, not DONE status.
- New trackers start with TODO; existing trackers keep matching IDs, status, user notes, and completion evidence.
- For behavior changes, apply [acceptance and business logic testing](../comp-implement/references/testing.md). Allocate a separate test-author task and review/freeze/isolation gate before implementation; behavior tasks depend on that gate. Test authors and implementers have disjoint scopes and fresh sanitized packets. Only coordinator/reviewer artifacts include test details; implementers receive production work and public criteria only. Existing sufficient tests may be retained but still need review/freeze. Frozen-test changes require complete intent/plan revision, tracker reconciliation, and a new frozen suite before resuming.
- Match tasks by intended behavior/deliverable, not line position. Allocate unused IDs for new work; never recycle old IDs.
- If a change invalidates a DONE task, reopen only affected work and add the reason and invalidated evidence/review reference to walkthrough. Changed dependencies also invalidate affected downstream checks.
- Retain removed work as SUPERSEDED with rationale/history. Exclude it from active progress; do not silently delete it or count it DONE.
- Preserve valid independent work. Do not overwrite the tracker or erase walkthrough when updating a plan. If matching existing work is materially ambiguous, report the ambiguity rather than guessing away history.

## 3. Tracker & Definition of Done

For behavior work, the test-validation task depends on test authorship and assigns a fresh independent reviewer, source-to-assertion evidence and coordinator-run controls. Freeze depends on current `Test validation: PASS` for the exact suite and agreed intent/plan; implementation depends on that freeze and verified isolation. Missing evidence/reviewer stays BLOCKED; test author self-approval is not completion.

Standard/light work writes or updates `tasks.md`; spikes update the embedded checklist in intent. Retain any existing artifact layout on resume.

Include a progress table for actual task groups plus total: DONE active tasks / all active tasks. Derive the numbers from checkboxes/status; do not initialize existing progress to `0/N`. Mark superseded rows clearly outside the active count.

Definition of Done:

1. Every acceptance criterion and required gate has an active task/check or an explicitly authorized scoped deferral.
2. DONE tasks have current verification evidence and required review; a checkbox or old test run is insufficient when related inputs changed.
3. Mandatory repository rules are satisfied; blockers and unavailable required checks/reviewers remain visible.
4. Walkthrough preserves actions, decisions, results, changed scope, and history for each task attempt.

## 4. Consistency Gate Before Implementation

Use [comp-analyze](../comp-analyze/SKILL.md) if available. Otherwise build the criterion -> plan decision -> task -> check table directly and flag uncovered core criteria, unscoped tasks, conflicting behavior/rules, unsupported assumptions, and dependency/order mistakes with source references.

Missing core coverage or material contradictions block implementation. Correct authorized artifact defects and re-check; ask for unresolved product/constraint decisions. Record reviewed scope, findings, and READY/BLOCKED in plan (intent for a spike). Never make a tracker appear ready merely by adding checked boxes.

Report actual paths, updated active progress, preserved/reopened/superseded tasks, and blockers. Hand off to implementation only when the gate is READY.
