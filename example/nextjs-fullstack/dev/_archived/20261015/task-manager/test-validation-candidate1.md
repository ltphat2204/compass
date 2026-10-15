# Independent pre-freeze test validation — example 2

Test validation: BLOCKED

Reviewer: /root/example2_test_review, fresh independent subagent; authored none of suite, fixtures, harness, or proposed implementation. Read-only standard review, medium product risk. Read current comp-review and comp-implement/testing policy (shared filesystem allowed). Derived expected outcomes from complete PRD before inspecting assertions. No application behavior exists and no application acceptance is claimed. Missing implementation is not a validation finding.

All paths below are relative to example/nextjs-fullstack/. Inputs match /tmp/compass-example2-candidate-snapshot.json at inspection and final hash recheck; six-file tests inventory unchanged. No project files modified. Only this authorized private report written.

| Criterion / rule | Agreed source and expected rationale | Actual assertion | Execution / control evidence | Finding |
|---|---|---|---|---|
| AC-01 CRUD/cancel/filter | PRD main flow; canceled edits/deletes preserve record, filters only change visible subset | ui.spec.mjs:22–49, actual text, API record checks, checkbox/filter disappearance, confirmation accept/dismiss | Coordinator collected scenario; no executable correct/defective UI control | Planned assertions meaningful; controls missing |
| AC-02 title/data rules | PRD business rules: trim, preserve interior space, duplicates allowed, 1–200 code points, false default, immutable creation identity | contract.mjs:17–38, explicit title/default/identity equality, Unicode success/rejection and unchanged record after invalid PATCH | Reviewer reran node --test tests/controls.test.mjs: 17/17; five correct cases and 12 assertion-rejected defects | Covered core validation rules; controls independently follow spec |
| AC-03 request/status/errors | PRD API table and JSON/type/unknown-field/error rules | contract.mjs:9–14,34–44,57–59: status, error envelope/redaction, DELETE empty body and repeated delete/PATCH 404 | Model accepts correct cases; rejects unknown fields, empty PATCH, wrong boolean, wrong content-type status and idempotent-delete defect | Meaningful HTTP contract evidence, not app acceptance |
| AC-04 empty/repeat init/restart | PRD storage: empty initial DB; restart and repeat schema preserve data | run.mjs:44,51–54, compare persisted updated record after process restart and second db:init | Runner stops before this stage; no independent correct/defective persistence controls supplied | Required rule controls missing |
| AC-05 load/retry and mutation failures | PRD UI/network: loading, explicit retry, pending lock, retained input/state, no automatic mutation retry, lost-response recovery | ui.spec.mjs:51–81 POST status/network/lost-response matrix; :83–90 edit/delete 500; run.mjs:48–50 real SQLite write lock | POST matrix collected only; real lock stage not reached; no independent rule controls for these paths | Completion failure/locks/retries gap plus missing controls |
| AC-06 fresh saved data | PRD storage and main flow: GET reflects saved data; newest first; stable secondary ID for ties; no task localStorage | contract.mjs:47–59 ordering/repeated GET/deletion; ui.spec.mjs:23,41 localStorage write trap and reload | Existing order control rejected; reviewer non-mutating probe proved omission accepted by ordering/fresh-GET case | Missing membership guard and deterministic tie exercise |
| AC-07 responsive/accessibility/text | PRD experience: labels, named controls, keyboard/focus, 360/1280 no overflow, literal HTML | ui.spec.mjs:92–101 accessible input, keyboard add, script sentinel, width checks; plan AC-07 reserves visual screenshot/focus inspection | Collection only; no UI controls. Manual visual check is a legitimate later delivery check | Retain manual check; do not call collection acceptance |
| AC-08 reproducible commands | PRD handoff; plan r2 commands and Node runtime | package.json scripts; lock/config inspected; run.mjs orchestrates controls/API/browser/storage/restart | Coordinator runner log: controls 17/17 then db:init command missing. Current package now has node scripts/init-db.ts, implementation absent | Expected preimplementation limitation; supplied runner log predates package settlement |

## Material findings and smallest corrections

1. **BLOCKER — Missing required executable rule controls.** tests/controls.test.mjs:38–41 exercises only five HTTP contract cases. Nothing accepts a correct independent persistence/schema/restart or UI state model and rejects plausible destructive init, lost persistence, false success, automatic retry, or canceled-action mutation behavior through relevant assertions. Collection and a runner stopping at absent db:init do not satisfy the pre-freeze policy. Add isolated spec-derived correct/defective controls for the remaining non-trivial rules, reusing controls across rules where adequate; ensure the controls exercise the relevant acceptance assertion rather than a separate tautology. A generated production application run is not required before freeze. Coordinator supplies current-snapshot commands/results; reviewer checks the failing assertion is the relevant one.

2. **MAJOR — Fresh-GET assertion can accept omission; tied timestamps untested.** tests/contract.mjs:54 compares two findIndex values without first proving both are present. A GET that omits the newest created task returns -1 for it and 0 (or greater) for the older task, satisfying -1 < 0; repeat equality and subsequent deletion assertions still pass. Reviewer executed the real fifth case against an isolated model that omitted the newly created second task from GET: the case completed successfully (defect reproduced). Add explicit inclusion/equality for both saved records before ordering; add a corresponding omission defect control. The 15ms delay plus timestamp monotonicity/repeat-GET check (:50,55–56) never deliberately creates equal-createdAt records or proves ID-based secondary ordering. Add an isolated equal-timestamp fixture/control and assert a stable ID-based tie order. PRD does not prescribe ascending versus descending ID; do not invent a direction. Also keep assertions checking actual saved fields after mutation, rather than merely IDs.

3. **MAJOR — Completion failure and per-mutation pending/retry behavior lack assertions.** tests/ui.spec.mjs:58–81 only intercepts POST. :83–90 checks edit/delete 500 retention, but never holds their responses to prove locks/no optimistic state, counts retries, or fails a completion PATCH. An app that correctly handles add yet optimistically flips completion permanently on a failed PATCH passes these scenarios. Add the smallest representative completion failure assertion proving previous state retained; cover corresponding edit/delete/completion pending lock and no automatic retry where applicable. Reuse the existing delayed-route pattern and mutation counters rather than duplicating the whole POST matrix for every operation. Add correct/defective controls for these rules per finding 1.

No unsupported product policy is required to fix these findings. Existing Vietnamese labels and successful CRUD assertions are grounded in the PRD. Do not weaken suite expectations to accommodate missing production behavior.

## Execution and limitations

- Reviewer command, cwd example/nextjs-fullstack/: rtk proxy node --test tests/controls.test.mjs — 17/17 pass. Inspected model mutants: expected failures occur on meaningful status/value assertions; wiring is valid for this covered subset.
- Reviewer command: inline Node import of cases[4], supplying an independent HTTP response model whose GET omits the second newly saved task — case accepted; confirms finding 2 without modifying suite.
- Coordinator evidence read: /tmp/compass-example2-controls.log (17/17), /tmp/compass-example2-collection.log (9 Playwright scenarios), /tmp/compass-example2-candidate-run.log (controls pass then missing db:init command). Last log was produced before the now-settled package script; do not represent it as current package execution or as application verification.
- Runner inspection: temporary database, cleanup, real child processes, idempotent-init/restart comparison and real SQLite lock check are appropriate proposed integration wiring. Later executable verification must establish they work. No demand for an application run before implementation.
- No app/browser/storage acceptance, build/typecheck/lint, or manual visual verification performed by reviewer. These remain later delivery gates. No suite/config/source edits performed.

## Bound identities (SHA-256)

- `PRD.md`: `3150e7d4c1f143f22d0090299370fd588c7ae47cdca0ce815120701eca2db8bc`
- `dev/task-manager/plan.md`: `e7354692aff3e58e616f5bc2ffe255c79a822a6aee8797e9afc76ec7e9b174fc`
- `package.json`: `2eaaea4fadfc09f4e49042e23e9e6ea5f7ea622122f1664d5c39322556cc706c`
- `pnpm-lock.yaml`: `450162d6f22628f4ea4964283f61ff6473c2fa74b1246033a61681b16d57572b`
- `pnpm-workspace.yaml`: `6f096f437a72ffe947829a23631ecb9992533a8b307f4978e4ebfa27b2318be6`
- `tsconfig.json`: `8725c2e3b4cc0b08998cc052744d2ccd490d08a4705e68ae52bf1315d0ad5c41`
- `tests/api.test.mjs`: `f09ff3abc2d7a0b80d0a92b0bd70e71ca6ccf71d00d2ac16a8b3dba5bbf483d5`
- `tests/contract.mjs`: `f57d38ce70b883c7482faae313c8976494e72e89d0cffe8fade2609c6a3113ff`
- `tests/controls.test.mjs`: `fe1de13f1da6801081c48cd8c35519169d38720fe7d93f1752c5a16dd93b7389`
- `tests/playwright.config.mjs`: `9617836cb866fbe0038f509ed6d8109664b8e9d73adf638f7699f6d30efca688`
- `tests/run.mjs`: `eb4c70020216675f26fdf22c153ce2ad4deff821c9b90c5088b212228f3a3b1a`
- `tests/ui.spec.mjs`: `c6ae97ed71bfa4389cc72425c6a6ff66629227212afba18499a1538c1eacdd59`

Snapshot unchanged at final recheck. PASS requires correction by test author/coordinator and fresh validation of replacement identities; suite is not frozen by this report.
