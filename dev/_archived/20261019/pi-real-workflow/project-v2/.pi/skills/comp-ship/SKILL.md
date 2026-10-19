---
name: comp-ship
description: Verify and deliver completed SDD work using repository checks, branch and commit conventions, review tooling, and CI; handle failure loops and authorized merges.
---

# Compass Shipping & Delivery Skill (`comp-ship`)

Use the current host's native skill invocation and exposed tools; bare `comp-*` names identify capabilities, not a fixed command syntax. Honor applicable host/repository instructions (including `AGENTS.md` or `CLAUDE.md`) and permissions; missing delegation never waives mandatory review.

Deliver verified work through the repository's established review process, preserving traceable artifacts and explicit authorization for merge or production changes.

---

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

## Standard Shipping Pipeline

```text
Pre-flight verification -> Branch -> Atomic commits -> Review handoff -> CI/feedback -> Authorized merge
```

Keep these delivery responsibilities; adapt host, commands, and applicable gates to the project. For local-only work, record remote operations as not applicable and provide an accepted handoff rather than inventing a remote workflow.

## Step 1: Pre-flight Verification

Apply [stage capability preflight](../comp-engineer/references/hosts.md#stage-capability-preflight) for verification, review and delivery using actual exposed tools/access and action-specific authorization. Record installation, discovery, workflow and resume evidence separately; missing runtime or required review evidence remains pending across hosts.

A standalone request to review delivery readiness uses read-only analysis/review and returns findings. Do not log, stage, commit, push, or open review until the user requests execution of delivery.

1. Read the current artifacts, including embedded spike sections when applicable. Confirm task completion and acceptance evidence. A spike delivers a learning result; do not publish or integrate experimental code as production work without a new authorized scope.
2. Require a current delivery analysis and final implementation review: use [comp-analyze](../comp-analyze/SKILL.md) and [comp-review](../comp-review/SKILL.md) when available. Otherwise check criterion/task/evidence coverage and mandatory rules, then review both compliance and actual change quality using the plan's risk/reviewer gates. Ensure the review checks the [debug artifact rule](../comp-engineer/rules/no-debug-artifacts.md). High-risk work requires independent or human review. Missing required evidence/reviewer or unresolved BLOCKER findings prevent delivery; absence of an optional skill does not.
3. Request a fresh independent final reviewer when available and authorized, even after inline implementation. Provide current intent/constraints, actual combined diff, relevant tests/callers, evidence, and snapshot identity; pause writes in reviewed scope. Reviewer must not have authored that change. If unavailable, document permitted self-review fallback for low/medium risk; mandatory independent/human gates remain pending. Reject stale approvals and run affected re-review after fixes.
4. Record input/revision scope, reviewer, findings, and resolution in walkthrough. Re-run affected gates after criteria or code changes; self-review is not independent review.
5. Confirm the plan's verification matrix against repository guidance, manifests, scripts, and CI. Run the applicable checks for affected components and all required delivery gates using actual commands and working directories. Tests, lint, typecheck, build, document validation, or manual acceptance checks apply only where relevant.
6. Record exact commands/procedures, observed results, and unavailable checks in `walkthrough.md`. Never equate an unavailable or skipped check with a pass.
7. Fix failures caused by the change within scope and re-run affected checks. Distinguish unrelated baseline failures; do not silently repair unrelated work or declare a required failing gate green.

## Step 2: Branch & Change Review

For behavior delivery, first verify the [strict test gate](../comp-implement/references/testing.md): pre-implementation authorship/freeze, sanitized implementer context and test-read guidance, current suite inventory/hashes, and coordinator-run results. Frozen test changes require complete intent/plan revision and a replacement reviewed freeze; missing evidence blocks delivery.

When native hooks are active, finish the [hook completion contract](../comp-engineer/references/hooks.md) against the current snapshot before claiming DONE. A missing, failed or stale record is not a pass; report BLOCKED when the required evidence cannot be obtained. Hook acceptance does not itself authorize release, merge or deployment.

1. Inspect working-tree changes, current branch, remote configuration, and target branch. Preserve unrelated user changes and reuse a suitable existing feature branch.
2. Follow repository naming conventions; otherwise use `feat/<slug>`, `fix/<slug>`, `refactor/<slug>`, `docs/<slug>`, or `test/<slug>`.
3. Use the actual review target from repository configuration or the user's request. If it cannot be determined and would change the delivery, ask before pushing or opening review.

## Step 3: Atomic Commits

1. Stage only files belonging to the task; review the staged diff.
2. Follow repository commit conventions. Default to Conventional Commits: `<type>(<scope>): <short imperative description>`; group changes into cohesive commits.
3. Do not include agent co-author attribution, bot badges, or AI signatures in commits or review descriptions.

## Step 4: Review Handoff

1. Use the configured hosting service and available CLI, API, or connector. Push and create a PR or equivalent review only within the user's authorized delivery scope. Tool availability does not grant permission.
2. For GitHub, `gh pr create` and `gh pr checks` are examples, not prerequisites. Use a body file or structured argument for multiline descriptions; supply the actual base branch.
3. Write a concise review description covering the problem, resulting behavior, material changes, verification evidence and limitations, and links to the Compass artifacts.
4. Attach the created review to the current chat when the environment provides that capability. If access or tooling is unavailable, preserve the prepared artifacts and report the exact blocked step.

## Step 5: CI & Feedback Loop

1. Inspect checks using the host's tools. Distinguish pending, failed, absent, and passed checks; absence of CI is not a passing CI result.
2. On failure, inspect logs and explain the cause. Fix issues caused by this change within authorized scope, update artifacts where necessary, verify locally, commit/push to the same review branch, and re-check.
3. Ask only when the next action requires a product decision, unavailable credentials, changed scope, or authorization for a consequential action. Stop repeating an unchanged failure when no new evidence or safe correction exists; report the blocker.
4. When required checks pass, report readiness and request merge authorization unless already explicitly given. Follow the repository's merge strategy and target branch. Deployment is a separate action requiring authorization.
5. After confirmed merge or accepted local completion, hand off to `comp-done`. Do not archive pending delivery as completed.
