# Tasks: Task Title Utility (`task-title-v2`)

> **Target Folder**: `dev/task-title-v2/`
> **Source Plan**: `dev/task-title-v2/plan.md`
> **Consistency Gate**: READY (evaluated in TASK-01)
> **Progress**: 10/10 tasks completed (100%)

---

## Progress Overview

| Phase / Group | Done / Active Tasks | Status |
|---|---|---|
| Phase 1: Consistency Preflight & Setup (TASK-01) | 1/1 | DONE |
| Phase 2: Test Authorship & Harness (TASK-02, TASK-03) | 2/2 | DONE |
| Phase 3: Test Validation & Freeze (TASK-04, TASK-05) | 2/2 | DONE |
| Phase 4: Implementation & Execution (TASK-06, TASK-07) | 2/2 | DONE |
| Phase 5: Implementation Review (TASK-08) | 1/1 | DONE |
| Phase 6: Ship & Archive (TASK-09, TASK-10) | 2/2 | DONE |
| **Total** | **10/10** | **100%** |

---

## Task Details

- [x] **TASK-01: Artifact Consistency Preflight (`comp-analyze`)**
  - **Criteria**: All (AC-01 through AC-07)
  - **Description / Deliverable**: Run cross-artifact consistency analysis across `intent.md` and `plan.md`.
  - **Depends on**: None
  - **Verification**: `comp-analyze` consistency analysis table; status READY.
  - **Review**: Coordinator self-check
  - **Assignee / Write scope**: Coordinator (`dev/task-title-v2/walkthrough.md`)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-02: Pre-Implementation Test Authorship (`comp-test-author`)**
  - **Criteria**: AC-01, AC-02, AC-03, AC-04, AC-05, AC-06, AC-07
  - **Description / Deliverable**: Dispatch fresh test-author subagent (`<COMPASS_ROOT>/agents/comp-test-author.md`) using `subagent_spawn` with write-only tool (`write`). Test author receives only public contract and runner conventions. Deliverable: `tests/task-title.test.mjs`.
  - **Depends on**: TASK-01
  - **Verification**: Test file created with comprehensive cases covering all ACs; syntax valid.
  - **Review**: Coordinator validation
  - **Assignee / Write scope**: Subagent `comp-test-author` (job_mve4dw89_1, tools: `write`) (`tests/task-title.test.mjs`)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-03: Coordinator Control Harness Execution**
  - **Criteria**: AC-01 through AC-07
  - **Description / Deliverable**: Run coordinator control harness (`dev/task-title-v2/coordinator-controls.mjs`) against temp copies: (1) stub control, (2) positive reference control, (3) plausible wrong-rule negative controls. Ensure `src/task-title.mjs` remains byte-for-byte unchanged.
  - **Depends on**: TASK-02
  - **Verification**: Stub fails meaningfully, positive passes 100%, wrong-rule mutants fail on relevant assertions.
  - **Review**: Coordinator validation
  - **Assignee / Write scope**: Coordinator (`dev/task-title-v2/coordinator-controls.mjs`, `dev/task-title-v2/walkthrough.md`)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-04: Independent Test Validation Gate (`comp-reviewer`)**
  - **Criteria**: AC-01 through AC-07
  - **Description / Deliverable**: Dispatch fresh read-only reviewer subagent (`<COMPASS_ROOT>/agents/comp-reviewer.md`) using `subagent_spawn` (tools: `read`, `grep`, `find`, `ls`). Review criteria-to-assertion coverage, control harness evidence, and candidate freeze resources.
  - **Depends on**: TASK-03
  - **Verification**: Reviewer verdict: `Test validation: PASS`.
  - **Review**: Independent fresh reviewer
  - **Assignee / Write scope**: Subagent `comp-reviewer` (job_mve4gah1_2, tools: `read`, `grep`, `find`, `ls`) (read-only)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-05: Test Freeze & Inventory Registration**
  - **Criteria**: All
  - **Description / Deliverable**: Freeze exact test snapshot. Record SHA-256 hashes of `TASK.md`, `package.json`, `tests/task-title.test.mjs`, `dev/task-title-v2/coordinator-controls.mjs`, Node version (v26.9.0), and runner command (`node --test tests/*.test.mjs`) in `dev/task-title-v2/freeze-inventory.json`.
  - **Depends on**: TASK-04
  - **Verification**: Freeze inventory file created and verified.
  - **Review**: Coordinator validation
  - **Assignee / Write scope**: Coordinator (`dev/task-title-v2/freeze-inventory.json`, `dev/task-title-v2/walkthrough.md`)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-06: Isolated Implementation (`comp-implementer`)**
  - **Criteria**: AC-01 through AC-07
  - **Description / Deliverable**: Dispatch fresh implementer subagent (`<COMPASS_ROOT>/agents/comp-implementer.md`) using `subagent_spawn` with write-only tool (`write`). Implementer receives sanitized public contract and initial production stub; no test paths, names, assertions, or test outputs. Implementer writes only `src/task-title.mjs`.
  - **Depends on**: TASK-05
  - **Verification**: `src/task-title.mjs` updated with clean, minimal implementation.
  - **Review**: Coordinator verification
  - **Assignee / Write scope**: Subagent `comp-implementer` (job_mve4ixhs_3, tools: `write`) (`src/task-title.mjs`)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-07: Coordinator Freeze Verification & Suite Execution**
  - **Criteria**: All ACs
  - **Description / Deliverable**: Verify all frozen resource hashes match `freeze-inventory.json` exactly. Execute `node --test tests/*.test.mjs` against the updated `src/task-title.mjs`.
  - **Depends on**: TASK-06
  - **Verification**: Hashes byte-for-byte identical. All tests pass with zero failures.
  - **Review**: Coordinator validation
  - **Assignee / Write scope**: Coordinator (`dev/task-title-v2/walkthrough.md`)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-08: Independent Implementation Review (`comp-reviewer`)**
  - **Criteria**: AC-01 through AC-07
  - **Description / Deliverable**: Dispatch distinct fresh read-only reviewer subagent (`<COMPASS_ROOT>/agents/comp-reviewer.md`) using `subagent_spawn` (tools: `read`, `grep`, `find`, `ls`). Review implementation against criteria, suite freeze integrity, and coordinator execution evidence.
  - **Depends on**: TASK-07
  - **Verification**: Reviewer verdict: `Implementation review: PASS / READY`.
  - **Review**: Independent fresh reviewer
  - **Assignee / Write scope**: Subagent `comp-reviewer` (job_mve4kora_4, tools: `read`, `grep`, `find`, `ls`) (read-only)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-09: Pre-flight Verification & Local Ship (`comp-ship`)**
  - **Criteria**: All
  - **Description / Deliverable**: Final verification check of zero external dependencies, clean git status, complete walkthrough evidence, and delivery readiness.
  - **Depends on**: TASK-08
  - **Verification**: All delivery gates satisfied.
  - **Review**: Coordinator validation
  - **Assignee / Write scope**: Coordinator (`dev/task-title-v2/walkthrough.md`)
  - **Execution**: Serial
  - **Status**: DONE

- [x] **TASK-10: Workspace Archiving (`comp-done`)**
  - **Criteria**: All
  - **Description / Deliverable**: Move `dev/task-title-v2/` to `dev/_archived/<YYYYMMDD>/task-title-v2/` and verify integrity of archived files.
  - **Depends on**: TASK-09
  - **Verification**: Original folder moved cleanly, archive destination contains all artifacts.
  - **Review**: Coordinator validation
  - **Assignee / Write scope**: Coordinator
  - **Execution**: Serial
  - **Status**: DONE

---

## Definition of Done (DoD)

1. Mọi tiêu chí AC-01 đến AC-07 được kiểm thử và đạt 100%.
2. Tách biệt hoàn toàn vai trò: test-author, test-reviewer, implementer, implementation-reviewer là các subagent riêng biệt.
3. Bộ test được kiểm soát bằng stub, positive reference và wrong-rule negative controls trên bản sao tạm mà không làm biến đổi `src/task-title.mjs`.
4. Đóng băng snapshot với đầy đủ SHA-256 hashes của TASK.md, package.json, test suite, harness script, phiên bản Node và runner command.
5. Triển khai không rò rỉ thông tin test, không thêm dependency bên ngoài, code tối giản theo nguyên lý Ponytail.
6. Cả hai vòng review độc lập (pre-freeze test validation và implementation review) đều đạt PASS.
7. Toàn bộ tài liệu SDD và logs thực thi được ghi nhận trong `walkthrough.md` và được lưu trữ an toàn trong `dev/_archived/YYYYMMDD/task-title-v2/`.
