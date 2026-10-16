# Independent pre-freeze test validation — candidate 2

Test validation: PASS

Reviewer: /root/example2_test_review2, fresh independent reviewer; authored none of the suite, fixtures, harness or proposed implementation. Standard review; medium product risk. Derived expected behavior from complete PRD first, then plan r2 and actual assertions; read prior candidate report afterward. Reviewed current comp-review and comp-implement/references/testing.md policy. Shared filesystem with sanitized contexts/read guidance is permitted. This report approves the candidate for coordinator freeze, not implementation or application acceptance.

## Evidence mapping

All project paths below are relative to example/nextjs-fullstack/.

| Criterion / rule | Agreed source and rationale | Actual assertion | Coordinator execution / control evidence | Finding |
|---|---|---|---|---|
| AC-01 CRUD, cancel, filters | PRD main flow: persisted add/edit/toggle/delete; edit/delete cancel preserve data; filtering changes visibility | tests/ui.spec.mjs:23–51 checks text, input reset, before/after API data for canceled actions, filter departure/re-entry, reload and confirmed deletion | Eleven browser scenarios collected. tests/controls.test.mjs:62–76 accepts preserved cancellation and rejects changed cancellation through shared unchanged assertion | Covered; browser integration acceptance remains pending |
| AC-02 title and record rules | PRD business rules: trimmed title, preserved interior whitespace, duplicates, 1–200 Unicode code points, false default, immutable ID/createdAt | tests/contract.mjs cases 1–3 directly check trimmed saved title, distinct IDs, default/updated booleans, stable identity, single/200/201 and supplementary-code-point boundaries, rejected mutations leave stored data unchanged | Five correct HTTP reference cases accepted; trim/default/identity/UTF-16/length/empty-title mutants rejected by corresponding value/status assertions | Covered |
| AC-02/03 strict requests and transport | PRD API: object bodies, allowed fields/types, nonempty PATCH, malformed JSON 400, unsupported content type 415, missing IDs 404, error code/message and no internals | tests/contract.mjs error helper and cases 3–5 assert status/envelopes/redaction, POST/PATCH invalid inputs, repeated DELETE/PATCH 404 and DELETE empty 204 | Correct reference accepted; unknown-field, empty-PATCH, wrong-boolean, wrong-content-type-status and idempotent-delete controls reject with AssertionError | Covered |
| AC-04 empty DB, durable restart, safe repeat initialization | PRD storage: fresh empty DB; mutations durable before success; repeated schema cannot delete records | tests/run.mjs:41–45 initial emptiness; :52–55 saves/updates a record, restarts with same database after second init, deep-compares all record fields | tests/controls.test.mjs:47–61 independent lifecycle accepts correct disk-backed state, rejects volatile state and destructive init via same unchanged assertion | Covered pre-freeze; real processes not yet reached |
| AC-05 loading, recovery, failed mutations | PRD UI/network: loading/retry; lock sender while pending; retain prior state/input; no automatic mutation retry; 404 asks reload; lost response may already have persisted | tests/ui.spec.mjs:52–83 GET gate/retry plus POST 400/404/500/connection/lost-response matrix; :84–116 delayed edit/delete/completion failures assert disabled sender, unchanged view/storage, retained edit input and one call. tests/run.mjs:49–51 checks actual SQLite write failure, sanitized 500 and no saved record | Independent interaction model accepts valid pending/failure state and rejects optimistic state, unlocked sender, false success, retry and cleared input using shared pending/failed assertions. Browser scenario collection includes all three additional mutation types | Covered; actual network/browser/storage execution remains pending |
| AC-06 freshness, ordering, server source | PRD API/storage and main flow: saved data visible after mutations/reload; descending creation time and fixed ID tie order; no task localStorage | tests/contract.mjs case 1 compares saved update to GET; case 5 explicitly proves membership/full fields before order, repeated GET equality and deletion absence; shared tieOrder checks equal-time ID monotonicity. tests/ui.spec.mjs:24 blocks Storage.setItem and completes CRUD/reload | Omitted-new-record mutant now rejected; newest-order mutant rejected. Equal-time fixtures accept either fixed ID direction (PRD does not choose a direction), reject unsorted IDs and changing tie order | Prior omission/tie control findings resolved; real API tie exercise depends on timestamps |
| AC-07 safe text, accessibility, responsiveness | PRD experience: input label, named buttons, keyboard/focus, literal HTML, no page overflow at 360/1280 | tests/ui.spec.mjs:117 onward checks accessible input name, keyboard focus/style, keyboard submit, literal HTML plus nonexecution sentinel, 200 emoji title, widths/overflow | Browser scenario collected; plan r2 AC-07 explicitly adds coordinator screenshot/focus inspection for visual appearance | Appropriate automated assertions plus declared later manual check |
| AC-08 reproducible local gates | PRD handoff and plan r2: standalone setup, build/typecheck/lint/test | package.json wires test to tests/run.mjs, controls to node:test and db:init to public script; harness calls HTTP runner and pinned Playwright config, then real lock/restart checks. Lockfile importer matches manifest; Node >=26.9.0 supports chosen runtime APIs | Candidate pnpm test executes 31 controls then fails at absent production scripts/init-db.ts, as expected before behavior implementation. Collection loads all 11 UI scenarios | Wiring valid for pre-freeze; delivery gates remain pending |

## Findings and closure

No unresolved material mismatch, unsupported product expectation, missing core assertion, or missing required pre-freeze evidence found. Candidate 1 material findings are resolved in this snapshot: explicit fresh-GET record membership detects omission; equal-timestamp fixtures challenge the shared order assertion without inventing an ID direction; independent lifecycle/interaction controls now challenge persistence/cancellation/mutation rules; edit/delete/completion each have pending/failure/no-retry observations.

Controls follow the PRD rather than generated implementation. They execute the same contract cases or shared outcome assertions used by integration/browser scenarios. The negative controls produce relevant AssertionErrors, rather than import/transport errors: contract mutants alter rule outcomes, lifecycle mutants lose data, interaction mutants alter state/locks/input/call count, and tie mutants alter observable ID ordering. Their 31/31 result means correct controls were accepted and defective controls rejected; it does not mean the app passed 31 acceptance tests.

Two-way traceability: contract assertions map to PRD business/API/storage rules; browser assertions map to Vietnamese user actions, error handling and experience rules; lifecycle and state controls model those same outcomes. No database table shape, internal module export, implementation strategy, ID direction, or new product feature is imposed by the tests. The plan's architecture and db:init command are public deliverables rather than private test coupling.

## Execution, snapshot and limitations

Coordinator evidence inspected:
- /tmp/compass-example2-controls-v2.log: 31 tests, 31 pass, zero failure/skip.
- /tmp/compass-example2-collection-v2.log: 11 Playwright scenarios, including POST failure matrix and edit/delete/completion pending/failure scenarios.
- /tmp/compass-example2-candidate-run-v2.log: actual pnpm test from example/nextjs-fullstack/; 31/31 controls, then pnpm db:init fails because scripts/init-db.ts has not been implemented. This is expected missing production behavior, not an app pass or a required pre-freeze application run.

Reviewer inspected all seven test resources, package.json, lockfile, workspace config and tsconfig. Read-only SHA-256 verification matched every one of 13 snapshot entries initially and finally; test inventory is exactly seven files. No project files or shared outputs modified; only this authorized report was written. Reviewer did not independently rerun commands with write side effects.

Later gates still require generated app API/browser/storage/restart execution, build/typecheck/lint, screenshot/focus review, README/setup verification, and final independent implementation review. Equal-createdAt controls prove the tie assertion detects representative defects; the HTTP scenario does not force the production app to generate equal timestamps. Later source review must confirm the stable secondary ID ordering as well as observing runtime checks. Freeze exactly the identities below and retain complete suite/config inventory. Any relevant change invalidates this PASS.

## Bound SHA-256 identities

- `PRD.md`: `3150e7d4c1f143f22d0090299370fd588c7ae47cdca0ce815120701eca2db8bc`
- `dev/task-manager/plan.md`: `e7354692aff3e58e616f5bc2ffe255c79a822a6aee8797e9afc76ec7e9b174fc`
- `package.json`: `2eaaea4fadfc09f4e49042e23e9e6ea5f7ea622122f1664d5c39322556cc706c`
- `pnpm-lock.yaml`: `450162d6f22628f4ea4964283f61ff6473c2fa74b1246033a61681b16d57572b`
- `pnpm-workspace.yaml`: `6f096f437a72ffe947829a23631ecb9992533a8b307f4978e4ebfa27b2318be6`
- `tsconfig.json`: `8725c2e3b4cc0b08998cc052744d2ccd490d08a4705e68ae52bf1315d0ad5c41`
- `tests/api.test.mjs`: `f09ff3abc2d7a0b80d0a92b0bd70e71ca6ccf71d00d2ac16a8b3dba5bbf483d5`
- `tests/contract.mjs`: `e517080d005b41aeed1b771938c3d0c02a5d06fd95e18d3838a477425f0ef7ab`
- `tests/controls.test.mjs`: `5d2bd281ed569f064fc7a9992ecb6976c3d433ad58da2f6a296d9a931c903266`
- `tests/outcomes.mjs`: `adcc475ac7de5268dde94c8b8207a22ed546cbd3b58ca3d8b6414ff982c80dad`
- `tests/playwright.config.mjs`: `9617836cb866fbe0038f509ed6d8109664b8e9d73adf638f7699f6d30efca688`
- `tests/run.mjs`: `5cdae5bd63f3ad10f1d9c049c008d5ddaac789798d3caec5d99960424e3c6942`
- `tests/ui.spec.mjs`: `c0b1c8646069dcfa942d8fdf9adf084a7aabc4c5d8bfd487397c9d19267d9992`
