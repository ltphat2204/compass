# Intent: Task Title Normalization Utility (`normalizeTaskTitle`)

> **Target Folder**: `dev/task-title/`  
> **Intent Type**: Feature (`feat`)  
> **Status**: Ready for Requirements Analysis  
> **Mode**: Light  
> **Requirements Gate**: READY (Analyzed via comp-analyze criteria: all 5 ACs unambiguous, observable, error types specified, boundary & failure expectations defined, zero dependencies constraint verified)  
> **Standards & Evidence**: Node.js built-in test runner, ECMAScript module (`type: module`), dependency-free.

---

## 1. Problem Statement & Goals
Add a clean, dependency-free utility function `normalizeTaskTitle(value)` to `src/task-title.mjs` to ensure consistent formatting of task titles across a disposable JavaScript project.

---

## 2. Users & Scenarios
- Developers and internal modules passing user-provided or external task titles to the system.
- Ensures titles have no excess leading/trailing whitespace, internal whitespace sequences (including Unicode whitespace) are collapsed to single spaces, case/punctuation are preserved, and invalid inputs (non-strings or whitespace-only strings) fail fast with appropriate errors.

---

## 3. Scope & Agreed Acceptance Criteria
- **In Scope**:
  - `src/task-title.mjs`: Export named function `normalizeTaskTitle(value)`.
  - Input validation: Reject non-string inputs with `TypeError`.
  - Empty check: Reject titles that are empty or whitespace-only after trimming with `Error`.
  - Normalization: Strip leading and trailing whitespace; collapse consecutive internal Unicode whitespace characters into a single standard space (`\u0020`).
  - Formatting preservation: Preserve character case and punctuation exactly.
- **Out of Scope**:
  - External dependencies.
  - Title truncation, slugification, HTML escaping, or spelling correction.
- **Acceptance Criteria**:
  - **AC-01**: `normalizeTaskTitle` is exported as a named export from `src/task-title.mjs`.
  - **AC-02**: Non-string inputs (e.g., `null`, `undefined`, `123`, `true`, `{}`, `[]`, `Symbol()`) throw a `TypeError`.
  - **AC-03**: Leading and trailing whitespace is removed. Any internal sequence of one or more Unicode whitespace characters (spaces, tabs, newlines, non-breaking spaces `\u00A0`, etc.) is collapsed to a single standard ASCII space (`\u0020`).
  - **AC-04**: Letters' case (uppercase, lowercase, mixed) and all punctuation marks (e.g. `!`, `?`, `-`, `#`, quotes) are preserved without modification.
  - **AC-05**: If the input string is empty or contains only whitespace (so it becomes empty after trimming), throw an `Error` (standard `Error`, not requiring `TypeError`).

---

## 4. Codebase Context & Blast Radius
- `src/task-title.mjs`: Currently exports a placeholder stub throwing `new Error("Not implemented")`.
- `package.json`: Configured with `"type": "module"`, script `"test": "node --test tests/*.test.mjs"`.
- Blast radius: Isolated to `src/task-title.mjs` and new tests under `tests/`.

---

## 5. Constraints & Key Decisions
- Zero third-party dependencies (use native JavaScript string & regex capabilities, e.g. `^\s+`, `\s+$`, `\s+` or `\p{White_Space}` / standard Unicode regex).
- Verified with Node.js built-in test runner (`node:test` and `node:assert/strict`).
- Follow strict testing rules: test authored by isolated subagent before implementation, independently reviewed, frozen, implementer given sanitized context without test access, coordinator-run execution.

---

## 6. Open Questions
None. All requirements in `TASK.md` are specific, concrete, and unambiguous.

---

## 7. Expected Deliverables
- `dev/task-title/intent.md`
- `dev/task-title/plan.md`
- `dev/task-title/tasks.md`
- `dev/task-title/walkthrough.md`
- `tests/task-title.test.mjs` (candidate, reviewed, frozen suite)
- `src/task-title.mjs` (minimal correct implementation)
