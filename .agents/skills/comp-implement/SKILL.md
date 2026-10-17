---
name: comp-implement
description: Execute SDD tasks with separate frozen tests and isolated implementation subagents for behavior changes, inline execution for other work, verified integration and coordinator-owned progress.
---

# Compass Implementation Skill (`comp-implement`)

Use the current host's native skill invocation and exposed tools; bare `comp-*` names identify capabilities, not a fixed command syntax. Honor applicable host/repository instructions (including `AGENTS.md` or `CLAUDE.md`) and permissions; missing delegation never waives mandatory review.

This skill drives the step-by-step execution of tasks defined in `dev/{feature-slug}/tasks.md`, ensuring transparent logging in `dev/{feature-slug}/walkthrough.md`, evidence-based impact checks, minimal correct changes, and project-appropriate verification.

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
- Prefer CodeGraph when an existing index and tool are available; otherwise use targeted search and source inspection. RTK and Ponytail are optional tools; evidence-first discovery and the smallest correct change remain required without them.
- Read existing specs where they live. Missing tools, specs, or checks are not reasons to invent scaffolding; record the fallback, limitation, or applicable alternative.

---

## Entry Gate & Resume

For a request only to assess implementation readiness, perform read-only analysis and return findings; do not start this execution workflow or write walkthrough.

The coordinator reads current intent, plan, tasks, and walkthrough before selecting work. Delegated workers read only their sanitized packet; implementation workers must not load shared artifacts or tests that the packet excludes. For a spike, use the embedded learning checklist in intent when standalone plan/tasks do not exist. Preserve existing progress and resume the next valid unfinished task.

Before editing, require a current consistency gate: use [comp-analyze](../comp-analyze/SKILL.md) if available, otherwise map criteria to plan/tasks/checks and check scope, contradictions, dependencies, and mandatory rules directly. Record the reviewed scope and READY/BLOCKED result in walkthrough. Fix authorized artifact defects before implementation; ask for unresolved material decisions. A prior gate for changed inputs does not apply automatically.

## Coordinator & Delegated Roles

Apply [stage capability preflight](../comp-engineer/references/hosts.md#stage-capability-preflight) before test authorship, independent validation and implementation. Use [portable role packets](references/packets.md), including on cross-host resume; capability checks never waive strict testing or authorize tools.

For behavior changes, read [strict testing](references/testing.md) first: a separate test-author subagent, reviewed frozen suite, sanitized context and test-read guidance, and fresh implementation subagents are mandatory before behavior edits. Missing delegation blocks implementation; generic inline fallbacks do not apply. For other work, use bounded implementers for standard work when authorized and available, with inline fallback otherwise. Read [Delegated Implementation](references/delegation.md) before dispatch.

If acting as a delegated implementer, execute only the assigned packet and return results. Do not run the whole lifecycle, delegate further, or update tasks/walkthrough/progress. The coordinator owns those artifacts and all DONE decisions; the logging rules below apply to the coordinator. Report missing context or needed write-scope expansion before acting outside the packet.

## Core Operational Rules

### 1. Evidence First Before Editing
- **Rule**: Never edit files blind. Before touching any component, inspect it using available discovery tools to identify:
  - All dependent callers and references.
  - Existing interfaces, types, or utilities that can be reused.
  - Existing characterization coverage (coordinator/test reviewer only); implementers inspect production contracts/callers without inspecting tests.

### 2. Ponytail Principle & Decision Making
- **Rule**: Always select the simplest, shortest solution that works (Ponytail Ladder: stdlib/native/minimal diff).
- **Decision Rule**: If a task or plan presents multiple valid approaches (e.g., Approach A vs Approach B):
  - Pick the simplest working approach with the smallest blast radius.
  - Explicitly document the decision in `walkthrough.md` with:
    `Decision: Chose [Approach X] over [Approach Y] because [Ponytail rationale - native feature / minimal diff / avoids extra dependencies]`.

### 3. Immediate Walkthrough Logging After Each Task
- **Rule**: Do NOT wait until the end of the session to update logs. Immediately after a task passes its checks and required task review:
  1. Append or update the task entry in `dev/{feature-slug}/walkthrough.md` detailing:
     - What was done and why.
     - Exact file paths modified or created (with line numbers/diff summary).
     - Any architectural or implementation decisions made.
     - Verification command output (e.g., test run passing).
  2. Mark the task as `[x]` in `dev/{feature-slug}/tasks.md` and update status to `DONE`.
  3. Update the Progress Overview Table in `tasks.md`.

### 4. Project-Appropriate Verification & CLI
- For behavior changes, apply [strict testing](references/testing.md): coordinator dispatches the independent test author before implementation, reviews/freezes the suite, prepares sanitized packets and test-read guidance, then dispatches fresh implementers instructed not to inspect tests. Coordinator alone runs the frozen checks and provides sanitized criterion-level feedback. Any frozen-test/resource change requires complete intent/plan revision and a new suite freeze; no percentage coverage target is added.
- Run the verification procedures recorded in `plan.md` for the affected task, using their actual working directories. Start narrow and include broader required gates before delivery.
- Log criterion-to-test references, observed results, and a brief explanation of the business rule proved and remaining limits. Passing existing checks is insufficient when they do not exercise the changed rule.
- Prefer RTK when available and compatible with repository instructions; otherwise run the native commands.
- Mark a task DONE only after its acceptance checks and required task review pass. Record failed, blocked, skipped, or unavailable checks honestly; do not count them as passes.

### 5. Risk-Based Review & Fresh Evidence

Use [comp-review](../comp-review/SKILL.md) when available. Otherwise review both spec compliance and actual change quality: request a fresh independent final reviewer when available and authorized; low-risk work permits labeled self-review when unavailable or explicitly requested; medium risk needs caller/integration checks and any reviewer required by policy/plan; high risk requires an independent or human reviewer. Review security, persistent-data, public-contract, and prerequisite tasks before DONE; review the complete change before ship. Required reviewer unavailable means PENDING, not pass.

Review a stable snapshot; pause writes to reviewed files/dependencies and identify the exact revision or relevant hashes. Record reviewer, independence, risk, reviewed scope, findings, and closure in walkthrough. Correct in-scope issues, run affected checks, and re-review changed portions. Current completion claims require evidence for the current code and criteria; BLOCKER findings prevent DONE and delivery. Keep failed/blocked task attempts in walkthrough, with the next safe action.

For spikes, verify the learning question and bounds, record the observed result and stop/go recommendation, and keep experimental output separate from production. Acceptance of learning does not authorize production integration.

---

## Standard `walkthrough.md` Task Log Format

Every completed task must produce an entry in `walkthrough.md` matching this template:

```markdown
### [TASK-XX] [Task Title]
- **Mục tiêu**: [Mục tiêu cụ thể của task]
- **Hành động đã thực hiện**:
  1. [Bước 1: Chi tiết thay đổi]
  2. [Bước 2: Chi tiết thay đổi]
- **Các file đã tạo / chỉnh sửa**:
  - `path/to/file.ext:line_number`: [Mô tả thay đổi]
- **Quyết định kỹ thuật (Decisions & Ponytail)**:
  - *Quyết định*: Đã chọn [Cách B] thay vì [Cách C].
  - *Lý do*: [Đơn giản nhất, dùng hàm có sẵn, ít diff nhất, v.v.]
- **Kết quả kiểm thử & Bằng chứng**:
  - Lệnh hoặc thao tác kiểm tra: [Actual command/procedure and working directory] $\to$ [Observed result; limitations if any].
- **Review**: [Risk, reviewer, independence, reviewed scope, findings and result]
- **Trạng thái**: [DONE only after applicable checks/review; otherwise TODO/IN_PROGRESS/BLOCKED]
```

---

## Execution Workflow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Pick Next Unfinished Task from tasks.md                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Behavior: author tests, review/freeze, prepare context     │
│    Other work: inspect affected scope and specs             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Behavior: fresh implementer with no test access           │
│    Other work: inline or scoped implementers                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Coordinator: verify freeze, run checks, obtain review     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Log details & decisions in walkthrough.md                │
│    Mark [x] and DONE in tasks.md                            │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Repeat for next task until 100% complete                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Hand-off & Progress Reporting

At the end of an execution turn, provide:
1. Short summary of tasks completed in this turn.
2. Direct link to `dev/{feature-slug}/walkthrough.md` for the user to review all changes.
3. Updated progress counter (e.g. `4/10 tasks completed`).
