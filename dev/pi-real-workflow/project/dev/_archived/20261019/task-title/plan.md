# Plan: Task Title Normalization Utility (`normalizeTaskTitle`)

> **Target Folder**: `dev/task-title/`  
> **Source Intent**: `dev/task-title/intent.md`  
> **Mode**: Light  
> **Status**: Ready for Task Breakdown  
> **Test Gate**: FROZEN  
> **Suite Inventory & Hashes**:
> - `tests/task-title.test.mjs`: `f8486a3ddb214665e4799351f5b13569569dc8219fa1fd7083100fca20e90701`
> - **Test Validation Report**: `job_mve3ycqf_2` (PASS)
> - **Author**: `job_mve3w0um_1` (`comp-test-author`)
> - **Reviewer**: `job_mve3ycqf_2` (`comp-reviewer`)
> - **Runtime / Runner**: Node.js built-in `node:test` + `node:assert/strict`
>
> **Consistency Gate**: READY  
> **Risk & Review Gate**: Medium Risk (public module contract / shared utility). Mandatory independent test validation before freeze; sanitized implementer context; coordinator-run frozen suite; mandatory independent final review.

---

## 1. Strategy & Principles
- **Ponytail Simplicity**: Implement the minimal correct solution in `src/task-title.mjs` using native ECMAScript string operations and regex (`\s+` or `\p{White_Space}+` with Unicode flag `u`). No external dependencies.
- **Strict Testing Separation**:
  - Behavior change requires strict test pre-authorship.
  - A fresh Pi subagent (`comp-test-author`) writes `tests/task-title.test.mjs` from a minimal spec packet without seeing implementation code.
  - Coordinator executes candidate test suite and controls (positive & negative controls).
  - A fresh independent Pi reviewer subagent (`comp-reviewer`) performs test validation.
  - Suite is frozen with SHA-256 hashes recorded.
  - A fresh sanitized Pi subagent (`comp-implementer`) implements `src/task-title.mjs` without reading tests, test files, test names, or assertion code.
  - Coordinator verifies frozen suite integrity and executes the suite.
  - A fresh independent Pi reviewer subagent (`comp-reviewer`) performs final code & spec compliance review.

---

## 2. Deliverables & Architecture
- `tests/task-title.test.mjs`: Node.js built-in test runner test file covering AC-01 through AC-05.
- `src/task-title.mjs`: Production implementation exporting `normalizeTaskTitle(value)`.
- `dev/task-title/walkthrough.md`: Coordinator record of execution, subagent job IDs, hashes, evidence, and results.

---

## 3. Ordered Roadmap & Verification Matrix

### Verification Matrix

| Criterion | Expected Result / Rule | Test Case & Type | Command / Working Dir | Gate |
|---|---|---|---|---|
| **AC-01** | `normalizeTaskTitle` is a function export | Function export check | `node --test tests/task-title.test.mjs` | Test Freeze & Acceptance |
| **AC-02** | Non-strings throw `TypeError` | Check null, undefined, number, object, bool, symbol | `node --test tests/task-title.test.mjs` | Test Freeze & Acceptance |
| **AC-03** | Leading/trailing whitespace trimmed; internal Unicode whitespace collapsed to `' '` | Space, tab, `\n`, `\r`, `\u00A0`, `\u2003` collapsed | `node --test tests/task-title.test.mjs` | Test Freeze & Acceptance |
| **AC-04** | Case and punctuation preserved | Mixed case, symbols (`!`, `#`, `-`) unchanged | `node --test tests/task-title.test.mjs` | Test Freeze & Acceptance |
| **AC-05** | Empty string or whitespace-only throws `Error` | `""`, `"   "`, `"\t\n"` throw `Error` (not requiring `TypeError`) | `node --test tests/task-title.test.mjs` | Test Freeze & Acceptance |

### Roadmap Phases
1. **Phase 1: Strict Test Authorship & Validation**:
   - Subagent spawn: `comp-test-author` creates candidate `tests/task-title.test.mjs`.
   - Coordinator runs candidate suite against existing stub (verifies harness and expected failure).
   - Coordinator runs spec-derived positive control (mock passing implementation) and negative control (mutated/flawed implementation) to verify test suite efficacy.
   - Subagent spawn: independent `comp-reviewer` validates tests against intent.
   - Suite frozen; SHA-256 hash recorded.
2. **Phase 2: Sanitized Implementation & Verification**:
   - Subagent spawn: `comp-implementer` in fresh context implements `src/task-title.mjs`.
   - Coordinator verifies frozen suite hash intact.
   - Coordinator runs `npm test` (`node --test tests/*.test.mjs`).
3. **Phase 3: Review, Shipping & Done**:
   - Subagent spawn: independent `comp-reviewer` validates implementation and spec compliance.
   - Coordinator runs pre-flight shipping verification (`comp-ship`).
   - Archive completed directory to `dev/_archived/<YYYYMMDD>/task-title/` (`comp-done`).

---

## 4. Agent Protocol & Review Gates
- Test Author: Subagent via `subagent_spawn` using `agents/comp-test-author.md`.
- Test Reviewer: Subagent via `subagent_spawn` using `agents/comp-reviewer.md`.
- Implementer: Subagent via `subagent_spawn` using `agents/comp-implementer.md`.
- Final Reviewer: Subagent via `subagent_spawn` using `agents/comp-reviewer.md`.
- No self-review permitted for test validation or final review.
