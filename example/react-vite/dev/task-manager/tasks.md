# Tasks

| Progress | DONE / active |
| --- | --- |
| Total | 5 / 5 |

- [x] **TASK-01: Scaffold and baseline**
  - Criteria: prerequisite for AC-01–AC-07.
  - Owner/scope: coordinator; official scaffold, manifest/lock, README.
  - Depends: none. Serial. Check: pnpm install/build/typecheck/lint; review: scaffold self-review.
  - Status: DONE.
- [x] **TASK-02: Acceptance tests**
  - Criteria: AC-01–AC-07; domain/storage tests and UI integration, manual layout checks.
  - Owner/scope: fresh test-author; separate test resources only.
  - Depends: TASK-01 and approved host protocol. Serial. Check: collection/execution and spec-derived controls.
  - Status: DONE.
- [x] **TASK-03: Independent test review, freeze, isolation**
  - Criteria: all AC and strict testing gate.
  - Owner/scope: fresh reviewer validates; coordinator freezes inventory/hashes and verifies permissions.
  - Depends: TASK-02. Serial. Check: current PASS, positive/negative controls, host-enforced read denial or explicit approved exception.
  - Status: DONE.
- [x] **TASK-04: Task manager implementation**
  - Criteria: AC-01–AC-07.
  - Owner/scope: fresh implementer; src/, index.html, permitted production config. No test access.
  - Depends: TASK-03. Serial. Check: coordinator frozen tests, build/typecheck/lint and browser CRUD/storage/layout/network.
  - Status: DONE.
- [x] **TASK-05: Review and local handoff**
  - Criteria: AC-01–AC-07 and README/history/evidence.
  - Owner/scope: independent final reviewer; coordinator documentation/integration.
  - Depends: TASK-04. Serial. Check: stable snapshot PASS, no blockers, actual acceptance evidence.
  - Status: DONE.

DoD: every AC has evidence, current frozen tests pass, independent reviews pass, mandatory gates satisfied or explicit scoped exception recorded; local instructions work. Scaffold alone does not complete the project. No archiving before accepted delivery.
