---
name: comp-intent
description: Discover user intent through an adaptive interview grounded in repository evidence; resolve material decisions and write intent.md for SDD planning.
---

# Compass Intent Discovery Skill (`comp-intent`)

Use the current host's native skill invocation and exposed tools; bare `comp-*` names identify capabilities, not a fixed command syntax. Honor applicable host/repository instructions (including `AGENTS.md` or `CLAUDE.md`) and permissions; missing delegation never waives mandatory review.

This skill discovers intent through evidence, concrete proposals, and questions only where a material decision remains. It grounds the discussion in real code and specifications using repository evidence and available specifications, follows up on consequential gaps one question at a time, and generates `dev/{feature-slug}/intent.md` only when the intent is clear enough to plan.

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

## Entry and Scope

Apply [adaptive workflow](../comp-engineer/references/adaptive-workflow.md) before scaffolding. For a clear bounded request, infer criteria from the request and evidence; zero interview questions is valid. For uncertainty, offer a concrete scenario and recommendation before asking one consequential question; do not manufacture agreement or a feature folder. For milestones, write a parent outcome map and prepare the next ready child intent, keeping later children at outcome level. A standalone intent request stops at that handoff; the engineer orchestrator continues only within execution authority.

## The 4 Pillars of Intent Discovery

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Classify Intent Type (Feature / Bug / Refactor / Spike)  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Ground in Repository Evidence & Available Specs         │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Adaptive Grill (Resolve Material Decisions)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Scaffold dev/{feature-slug}/intent.md                    │
└──────────────────────────────┬──────────────────────────────┘
```

---

## Detailed Step-by-Step Instructions

### Step 1: Classify Intent & Establish Target Folder

1. **Classify Request Archetype**:
   - **Feature (`feat`)**: New user-facing capability, API endpoint, or UI flow.
   - **Bug Fix (`fix`)**: Broken behavior, exception, or UI/data mismatch.
   - **Refactor / Optimization (`refactor`)**: Code cleanup, query optimization, security hardening.
   - **Spike (`spike`)**: Feasibility check or technology experimentation.
2. **Determine Target Folder (`dev/{feature-slug}/`)**:
   - Generate a concise kebab-case slug (e.g. `dev/export-report`, `dev/fix-refresh-cookie`, `dev/search-fuzzy-ranking`).
   - Choose a concise slug unless the naming choice materially affects the request.

---

### Step 2: Codebase & Spec Discovery (Evidence First)

**Before asking questions**, inspect the actual code:
1. Inspect the affected entry points, modules, interfaces, data, and callers using the available discovery tools.
2. Read relevant specifications and repository guidance if present; record actual paths and constraints.
3. Understand:
   - What existing code already does (to avoid reinventing helpers/patterns).
   - What the root cause is (if a bug).
   - What callers/dependencies will be affected (blast radius).

---

### Step 3: Adaptive Grill (One Question at a Time)

Investigate and propose until the intent is clear enough to plan; interview only for unresolved material choices. There is no fixed question count: ask only about consequential gaps, and stop when the readiness check below passes.

- Ask one focused question, wait for the answer, then choose the next question based on it.
- First answer anything the repository, available discovery tools, or specs can establish; ask the user only for product intent, trade-offs, or facts the code cannot reveal.
- Do not repeat information the user already gave. If an answer opens a new material branch, follow it; if it resolves the issue, move on.
- Offer a recommended option and a small number of alternatives when a real choice exists. Keep the user free to propose another answer.
- Let the user defer a decision. Record it as an open question and state whether planning can proceed safely without it.
- Do not force decisions about details that do not affect scope, behavior, risk, or acceptance.

Resolve the applicable parts of this intent checklist:
- Problem and desired outcome; who needs the change and in what scenario.
- Expected behavior, including important edge cases and failure behavior.
- In-scope work and explicit exclusions.
- Constraints, compatibility needs, data/security implications, and relevant dependencies.
- Observable acceptance criteria and how success will be verified.
- Concrete examples for changed business rules: inputs/action/expected result, including relevant boundaries or rejection cases. Separate agreed rules from AI-proposed assumptions; ask only when an unresolved expectation materially changes behavior.
- Remaining decisions, each marked as resolved, intentionally deferred, or blocking.

Stop when every material item is resolved or explicitly deferred with its impact understood. If a blocking decision remains, keep interviewing instead of writing a falsely complete intent. Do not ask every checklist item mechanically when it does not apply or is already known.

Use a short free-form question by default; the following table is optional when a material choice benefits from comparing alternatives:

```markdown
## [Topic to clarify]

**Bối cảnh phát hiện trong code**: [Trích dẫn ngắn gọn từ code/tài liệu thực tế]
**Câu hỏi cần làm rõ**: [Câu hỏi cụ thể]

| Lựa chọn | Phương án | Ý nghĩa / Đánh đổi |
|---|---|---|
| **A (Khuyên dùng)** | [Phương án tối ưu, bám sát kiến trúc sẵn có] | [Ưu điểm] |
| **B** | [Phương án thay thế] | [Đánh đổi] |
| **Custom** | Ý kiến riêng của bạn | [Mô tả nếu muốn đi theo hướng khác] |

*Bạn chọn phương án nào (hoặc có định hướng khác)?*
```

---

### Requirements Quality Gate (Before Planning)

Evaluate the written requirements separately from implementation checks. Confirm clear problem/scenarios and exclusions, observable criteria, relevant failure/recovery and non-functional expectations, and explicit assumptions/decisions. Give new criteria stable `AC-XX` IDs; keep existing IDs or section references.

If available, use [comp-analyze](../comp-analyze/SKILL.md) in requirements mode. Otherwise perform those checks directly and report source-specific findings. Record `Requirements gate: READY/BLOCKED`, reviewed scope, findings, and deferred decisions in intent. Material ambiguity blocks planning; ask one consequential question at a time. An unavailable optional tool does not block the gate itself.

For a spike, specify the learning question, resource/time bound, evidence to collect, stop/go criterion, and a short plan/checklist. Do not claim production readiness. For light work, keep the fields that affect behavior, scope, decisions, and acceptance; the eight-section template below is optional.

### Step 4: Scaffold `dev/{feature-slug}/intent.md`

Once the readiness check passes, create `dev/{feature-slug}/intent.md` synthesizing the request, repository evidence, interview decisions, and any explicitly deferred questions:

```markdown
# Intent: [Task Title / Feature Name]

> **Target Folder**: `dev/{feature-slug}/`
> **Intent Type**: Feature / Bug Fix / Refactor / Spike
> **Status**: [Ready for Planning only after requirements gate passes]
> **Mode**: Standard / Light / Spike
> **Requirements gate**: [READY/BLOCKED, reviewed scope, findings and deferrals]
> **Standards & Evidence**: [Links to actual repository guidance/specs, or state none found]

---

## 1. Mục Tiêu & Bài Toán (Problem Statement & Goals)
[Mô tả chi tiết bài toán cần giải quyết, yêu cầu nghiệp vụ và giá trị mang lại sau phỏng vấn]

---

## 2. Người Dùng & Kịch Bản (Users & Scenarios)
[Ai cần thay đổi này, trong tình huống nào, và kết quả mong muốn là gì]

---

## 3. Phạm Vi & Hành Vi Đã Thống Nhất (Scope & Agreed Behavior)
- **Trong phạm vi**: [Các hành vi/kết quả được xác nhận]
- **Ngoài phạm vi**: [Những điều đã thống nhất không làm]
- **AC-01**: [Observable acceptance outcome; repeat with stable IDs as needed]

---

## 4. Bối Cảnh Codebase & Ranh Giới Ảnh Hưởng (Codebase Context & Blast Radius)
- **Files & Symbols liên quan (qua khảo sát repository)**:
  - `[actual entry point]`: Input or triggering event
  - `[actual module]`: Behavior and dependencies
  - `[actual data/interface path, if applicable]`: State and contracts
  - `[actual test/document path]`: Existing evidence
- **Spec tham chiếu**: [Actual spec paths, if present]

---

## 5. Ràng Buộc & Quyết Định (Constraints & Key Decisions)
- [Quyết định 1 đã thống nhất trong interview]
- [Quyết định 2 về cách xử lý edge cases]
- **Ràng buộc**: [Tương thích, dữ liệu, bảo mật, hiệu năng hoặc ràng buộc khác]
- **Project Context**: [Observed stack/toolchain, architecture, relevant paths, available checks with working directories, spec locations, and delivery target; mark unknowns explicitly]

---

## 6. Lộ Trình Triển Khai Đề Xuất (Suggested Roadmap)
- **Phase 0 (Safety Net)**: Ghi baseline; thêm regression/characterization check khi cần theo rủi ro.
- **Phase 1 (Core Implementation)**: Triển khai các thành phần bị ảnh hưởng bằng thay đổi nhỏ nhất đủ đúng.
- **Phase 2 (Verification & Spec Sync)**: Kiểm chứng tiêu chí chấp nhận và cập nhật tài liệu liên quan nếu có.

---

## 7. Câu Hỏi Còn Mở (Open Questions)
- [Ghi quyết định được chủ động hoãn, điều kiện để giải quyết, và ảnh hưởng nếu có]
- [Nếu không còn câu hỏi: Không còn câu hỏi chặn việc lập kế hoạch.]

---

## 8. Sản Phẩm Đầu Ra Kỳ Vọng (Expected Deliverables)
- `plan.md`: Kế hoạch kiến trúc chi tiết.
- `tasks.md`: Danh sách task tracking và Definition of Done.
- `walkthrough.md`: Nhật ký thực hiện từng task.
```

---

### Step 5: Hand Off to Planning

1. Announce the created file path: `dev/{feature-slug}/intent.md`.
2. For standard/light work, hand off to planning only after the requirements gate is READY. For a spike, execute its embedded learning checklist and record evidence in walkthrough; do not generate production scaffolding. When invoked standalone, provide the planning command if useful. Under `comp-engineer`, continue into authorized planning automatically rather than asking the user to invoke another skill:
   - *"File intent đã được tạo tại `dev/{feature-slug}/intent.md` dựa trên kết quả phỏng vấn và khảo sát repository."*
   - *"Bạn có thể bắt đầu lập kế hoạch bằng lệnh: `hãy dựa vào @dev/{feature-slug}/intent.md và viết plan để thực hiện trong cùng folder` (hoặc chọn skill `comp-plan` trên host đang dùng và truyền đường dẫn intent)."*
