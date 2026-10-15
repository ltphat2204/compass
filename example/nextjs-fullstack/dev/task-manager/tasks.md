# Tasks: Next.js full stack task manager

Source: [PRD](../../PRD.md), [plan revision 3](plan.md).

| Group | DONE / active |
| --- | --- |
| Preparation | 1 / 1 |
| Test authorship and gates | 2 / 2 |
| Implementation | 1 / 1 |
| Verification and handoff | 2 / 2 |
| Total | 6 / 6 |

- [x] **TASK-01: Prepare official standalone scaffold**
  - Criteria: AC-08; supports all application criteria.
  - Deliverable: official Next.js App Router TypeScript scaffold, pinned dependencies/lockfile, scripts, baseline evidence.
  - Depends on: none. Assignee: coordinator; scope: example scaffold/config only. Execution: serial.
  - Verification: install, typecheck, lint, build in project; record actual versions/commands. Review: coordinator baseline check; no behavior accepted here.
  - Status: DONE — official create-next-app 16.4.1 scaffold; pnpm install, build, lint and typecheck exit 0. See walkthrough baseline evidence.
- [x] **TASK-02: Author independent acceptance tests**
  - Criteria: AC-01–AC-08 and PRD business/API/error rules.
  - Deliverable: candidate validation/API/persistence/browser tests and positive/negative controls in separate test-author scope.
  - Depends on: TASK-01. Assignee: fresh test author; tests/fixtures/harness only. Execution: serial.
  - Verification: coordinator runs runner/controls, distinguishes missing behavior from broken harness; source-to-assertion mapping. Review: TASK-03 independent reviewer.
  - Status: DONE — replacement suite independently validated after full revision; controls31/31, browser harness3/3, collect14. V1 history retained.
- [x] **TASK-03: Independently validate, freeze and document test-read guidance**
  - Criteria: mandatory Compass testing gate supporting AC-01–AC-08.
  - Deliverable: independent PASS, exact suite inventory/hashes and source/dependency identities, fresh sanitized implementer packet and explicit test-read guidance.
  - Depends on: TASK-02. Assignee: fresh test reviewer; coordinator owns manifest/access evidence. Execution: serial.
  - Verification: agreed-rule coverage, correct/wrong controls, immutable suite; verify packet/read scope before dispatch; shared filesystem allowed per merged main policy. Review: fresh reviewer must not have authored resources.
  - Status: DONE — fresh replacement reviewer PASS; FROZEN v2 on exact PRD r2/plan r3/resource snapshot; v1 retained.
- [x] **TASK-04: Implement task manager UI, Route Handlers and SQLite**
  - Criteria: AC-01–AC-07.
  - Deliverable: production files in plan section 2; no test/artifact writes.
  - Depends on: TASK-03. Assignee: fresh implementer with sanitized context. Execution: serial.
  - Verification: implementer permitted non-test checks; coordinator runs frozen suite in TASK-05. Review: fresh final reviewer after integration.
  - Status: DONE — implementation accepted against frozen v2; independent final source/spec review READY.
- [x] **TASK-05: Verify integrated acceptance and stable final review**
  - Criteria: AC-01–AC-08.
  - Deliverable: actual API, restart/schema, browser/error/accessibility evidence and independent final review snapshot in walkthrough.
  - Depends on: TASK-04. Assignee: coordinator and fresh final reviewer. Execution: serial.
  - Verification: plan matrix commands, frozen hashes before/after, visible focus/360/1280 inspection; no unresolved blocker.
  - Status: DONE — all acceptance/static/integrity checks PASS; independent aggregate review READY.
- [x] **TASK-06: Document and hand off locally**
  - Criteria: AC-08 and PRD handoff/history requirement.
  - Deliverable: project README, accurate example overview, append-only skill/prompt history, completed artifacts with links to evidence.
  - Depends on: TASK-05. Assignee: coordinator; documentation only. Execution: serial.
  - Verification: instructions/links match actual setup and checks; final scoped documentation review. No production deploy or remote delivery required.
  - Status: DONE — README/overview/history/evidence reviewed in stable aggregate snapshot; local handoff READY, no remote delivery required.

Definition of Done: all active criteria/gates have current evidence; freeze integrity holds; required independent review READY; user-data/security rules retained; no unavailable check reported PASS. Coordinator alone updates completion/progress and logs each accepted task in walkthrough.
