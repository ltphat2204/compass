# Tasks: Task Title Normalization Utility (`normalizeTaskTitle`)

> **Target Folder**: `dev/task-title/`  
> **Source Plan**: `dev/task-title/plan.md`  
> **Mode**: Light  
> **Consistency Gate**: READY (Analyzed via comp-analyze criteria: all 5 ACs covered by planned tasks, strict testing gates present, roles and write scopes disjoint)

---

## Progress Overview

| Phase / Group | Done | Total Active | Status |
|---|:---:|:---:|---|
| Phase 1: Test Authorship & Freeze | 4 | 4 | DONE |
| Phase 2: Implementation & Coordinator Checks | 2 | 2 | DONE |
| Phase 3: Review, Shipping & Done | 3 | 3 | DONE |
| **Total** | **9** | **9** | **100% Complete** |

---

## Definition of Done (DoD)
1. All criteria (AC-01 through AC-05) have test coverage in a frozen test suite.
2. Candidate test suite authored by an isolated `comp-test-author` subagent before production implementation.
3. Candidate test suite verified with coordinator-run controls (positive & negative controls).
4. Independent test validation completed by a fresh `comp-reviewer` subagent with `Test validation: PASS`.
5. Exact suite frozen with SHA-256 hash recorded; integrity verified before and after implementation.
6. Production code in `src/task-title.mjs` authored by a fresh sanitized `comp-implementer` subagent restricted from reading tests.
7. Coordinator-run frozen suite passes cleanly (`node --test tests/*.test.mjs`).
8. Independent final review completed by a fresh `comp-reviewer` subagent with PASS.
9. Pre-flight verification completed and local delivery handoff recorded via `comp-ship`.
10. Feature folder archived via `comp-done` into `dev/_archived/<YYYYMMDD>/task-title/`.

---

## Tasks

### Phase 1: Test Authorship & Freeze

- [x] **TASK-01: Strict test authorship via fresh Pi subagent**
  - **Criteria**: AC-01, AC-02, AC-03, AC-04, AC-05
  - **Description**: Spawn a fresh Pi subagent using `agents/comp-test-author.md` to author `tests/task-title.test.mjs` using Node.js built-in test runner based on a minimal spec packet.
  - **Depends on**: None
  - **Assignee / Write Scope**: Subagent (`comp-test-author`) / `tests/task-title.test.mjs`
  - **Verification**: `tests/task-title.test.mjs` exists, 30 tests covering all ACs
  - **Status**: DONE (Subagent `job_mve3w0um_1`)

- [x] **TASK-02: Coordinator candidate suite run & spec-derived controls**
  - **Criteria**: AC-01 to AC-05 verification integrity
  - **Description**: Coordinator runs candidate suite against stub (verifies harness/expected failure), then tests spec-derived positive control (mock passing implementation) and negative control (mutated implementation) to confirm assertions detect errors.
  - **Depends on**: TASK-01
  - **Assignee / Write Scope**: Coordinator / execution environment
  - **Verification**: Harness runs (4 pass, 26 fail on stub), positive control passes (30/30), NC-1 to NC-4 fail expected assertions
  - **Status**: DONE

- [x] **TASK-03: Independent test validation via fresh Pi subagent**
  - **Criteria**: AC-01 to AC-05
  - **Description**: Spawn a fresh Pi subagent using `agents/comp-reviewer.md` with read-only tools to independently validate the candidate test suite against intent and plan.
  - **Depends on**: TASK-02
  - **Assignee / Write Scope**: Subagent (`comp-reviewer`) / Read-only review
  - **Verification**: Reviewer returns `Test validation: PASS`
  - **Status**: DONE (Subagent `job_mve3ycqf_2`)

- [x] **TASK-04: Suite freeze & hash recording**
  - **Criteria**: Suite immutability
  - **Description**: Coordinator computes SHA-256 hash of `tests/task-title.test.mjs`, marks `Test gate: FROZEN`, and records manifest in walkthrough.
  - **Depends on**: TASK-03
  - **Assignee / Write Scope**: Coordinator / `dev/task-title/` artifacts
  - **Verification**: SHA-256 `f8486a3ddb214665e4799351f5b13569569dc8219fa1fd7083100fca20e90701` recorded; `Test gate: FROZEN`
  - **Status**: DONE

### Phase 2: Implementation & Coordinator Checks

- [x] **TASK-05: Sanitized implementation via fresh Pi subagent**
  - **Criteria**: AC-01 to AC-05
  - **Description**: Spawn a fresh sanitized Pi subagent using `agents/comp-implementer.md` to implement `src/task-title.mjs`. Implementer must NOT read `tests/`, test files, or test outputs.
  - **Depends on**: TASK-04
  - **Assignee / Write Scope**: Subagent (`comp-implementer`) / `src/task-title.mjs`
  - **Verification**: `src/task-title.mjs` implemented; test separation maintained
  - **Status**: DONE (Subagent `job_mve401cl_3`)

- [x] **TASK-06: Coordinator verification of suite integrity & test execution**
  - **Criteria**: AC-01 to AC-05
  - **Description**: Coordinator verifies SHA-256 hash of `tests/task-title.test.mjs` matches frozen manifest, then executes `npm test` (`node --test tests/*.test.mjs`).
  - **Depends on**: TASK-05
  - **Assignee / Write Scope**: Coordinator / test execution
  - **Verification**: Hash match confirmed (`f8486a3ddb214665e4799351f5b13569569dc8219fa1fd7083100fca20e90701`); all 30 tests pass (0 failures)
  - **Status**: DONE

### Phase 3: Review, Shipping & Done

- [x] **TASK-07: Independent final code review via fresh Pi subagent**
  - **Criteria**: AC-01 to AC-05, code quality, dependency-free, no debug artifacts
  - **Description**: Spawn a fresh Pi subagent using `agents/comp-reviewer.md` with read-only tools to independently review `src/task-title.mjs` diff against intent, plan, and quality rules.
  - **Depends on**: TASK-06
  - **Assignee / Write Scope**: Subagent (`comp-reviewer`) / Read-only review
  - **Verification**: Reviewer returns `Status: READY (PASS)` (Subagent `job_mve41hyy_4`)
  - **Status**: DONE

- [x] **TASK-08: Pre-flight shipping verification (`comp-ship`)**
  - **Criteria**: Full delivery pre-flight
  - **Description**: Coordinator performs final check verification, summarizes status, records local delivery handoff.
  - **Depends on**: TASK-07
  - **Assignee / Write Scope**: Coordinator / `dev/task-title/walkthrough.md`
  - **Verification**: Clean test run (30/30 passed), syntax checks passed, hash verified (`f8486a3ddb214665e4799351f5b13569569dc8219fa1fd7083100fca20e90701`), local delivery handoff verified
  - **Status**: DONE

- [x] **TASK-09: Archive completed workspace (`comp-done`)**
  - **Criteria**: Archival rule
  - **Description**: Move `dev/task-title/` to `dev/_archived/<YYYYMMDD>/task-title/` and verify integrity of archived artifacts.
  - **Depends on**: TASK-08
  - **Assignee / Write Scope**: Coordinator / filesystem move
  - **Verification**: Destination `dev/_archived/20261019/task-title/` confirmed with all artifacts preserved (`intent.md`, `plan.md`, `tasks.md`, `walkthrough.md`, `run-controls.mjs`)
  - **Status**: DONE
