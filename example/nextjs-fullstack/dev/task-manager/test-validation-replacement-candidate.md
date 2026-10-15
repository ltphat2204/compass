# Independent replacement-suite validation

Test validation: BLOCKED

Reviewer: /root/example2_replacement_review; fresh independent reviewer, authored none of reviewed tests/resources or implementation. Standard review, medium product risk. Read complete PRD revision 2 and plan revision 3 before actual assertions; reviewed current comp-review and comp-implement testing policy. Production source/internals were not inspected or used as an expected-result oracle.

## Material finding

BLOCKER — tests/ui.spec.mjs:26–27, used at :96 and :134: `announcedFailure` accepts any newly visible alert/status/field message. A successful-save notification such as “Lưu thành công”, or a late progress announcement such as “Đang lưu”, satisfies the same predicate as an error. The PRD experience and UI/network sections, AC-05, require error reporting, no false success, and response/error-based settlement. Existing retained-view/data/draft and call-count checks remain useful, but do not distinguish an erroneous success notice from an error or prove that the request has settled. The added HARNESS case at :154 only accepts a valid uncertainty/reload message; it does not reject these plausible defective observations. This weakens the previous error-content assertion and leaves the replacement gate incomplete.

Smallest correction before freeze: retain flexible accessible error/uncertainty/reload semantics without forcing an exact label; wait for genuine failed-response/abort handling and an error outcome, not mere new text. Add focused browser harness controls using the same settlement/error helper that accept the valid uncertainty/reload outcome and reject success and late-progress announcements. Preserve pending locks, view/data/draft retention, no-retry and reload checks. No application behavior or PRD change is needed for this pre-freeze candidate correction.

## Source-to-assertion evidence

Paths relative to example/nextjs-fullstack/.

| Criterion/rule | Agreed source and expected rationale | Actual assertion | Execution/control evidence | Finding |
|---|---|---|---|---|
| AC-01 CRUD/cancel/filter | PRD main flow: saved edits/toggles, cancel preserves data, filters alter visibility, confirm delete | ui.spec.mjs complete CRUD scenario checks UI text, API equality after cancellation, both filter transitions and deletion; checkbox click now waits for persisted completed value | Collected; shared cancellation model accepts unchanged state/rejects mutation | Covered; replacing check/uncheck with click plus persisted-result polling is justified |
| AC-02 data rules | PRD business rules: trim, internal spaces, duplicates, false default, immutable identity, 1–200 Unicode code points | contract.mjs first three cases assert exact values and 200/201 boundaries, reject invalid input without changing saved task | Correct reference accepted; trim/default/identity/UTF-16/length/empty-title mutants rejected | Covered, unchanged |
| AC-02/03 requests/errors | PRD API: strict objects/fields/types, nonempty PATCH, malformed JSON 400, unsupported type 415, missing ID 404, sanitized error envelope and empty DELETE 204 | contract.mjs strict-request, transport and delete cases; error helper checks status/envelope/redaction | Unknown-field/empty-PATCH/boolean/content-type/delete-idempotence mutants rejected | Covered, unchanged |
| AC-04 durability/schema | PRD storage: initial empty state, restart preserves saved data, repeated schema preserves records | run.mjs temporary database, init, save/update, stop/init/start, full-record equality | Lifecycle reference accepted; volatile/destructive-init rejected through shared unchanged assertion | Covered pre-freeze; full replacement app run pending |
| AC-05 pending/no optimism | PRD UI/network: lock submitting control until response; update list only after success | ui.spec.mjs gated POST/PATCH/DELETE, stableControl targets DOM position despite label changes, pending disabled and unchanged view/data assertions | Shared interaction controls reject unlocked and optimistic outcomes; real HARNESS browser case tracks changed label while disabled | Covered; positional locator assumes stable relative control order, adequate for assigned harness repair |
| AC-05 failure/recovery | PRD errors: retain draft/state, announce failure, no false success/no automatic mutation retry, 404 reload, lost response may already commit | ui.spec.mjs 400/404/500/connection/lost-response POST matrix and edit/delete/completion failure cases retain input/view/data, observe 1 request and reload; announcedFailure only checks new message | Interaction controls reject clearing input/state/retry; HARNESS 1/1 accepts valid locked error. Missing rejection of success/progress as error settlement | BLOCKER above; other failure/recovery assertions retained and strengthened by reload checks |
| AC-05 real storage failure | PRD storage errors return sanitized 500 without reporting save success | run.mjs SQLite exclusive lock, API 500/error check, GET absence | Wired unchanged; full replacement app execution pending | Covered pre-freeze |
| AC-06 source/freshness/order | PRD storage/main flow: server-backed fresh results, descending createdAt and stable ID tie order | contract.mjs GET membership/full fields/order/repeated equality/deletion; outcomes.mjs tieOrder; ui.spec blocks Storage.setItem and reloads | Omission/order controls rejected; tie fixtures accept either fixed direction and reject unstable/unsorted ties | Covered; production equal timestamps not forced, later source review still required |
| AC-07 safe text/accessibility/layout | PRD experience: label, named controls, keyboard/focus, literal HTML and no page overflow at 360/1280 | ui.spec keyboard submit/style focus, accessible name, HTML literal/sentinel, emoji title, viewport overflow | Scenario collected; plan explicitly retains screenshot/focus inspection | Automated coverage plus later declared manual visual check |
| AC-08 execution/config | PRD handoff and plan: reproducible setup/build/typecheck/lint/tests | package scripts invoke run.mjs/node:test/Playwright/db:init; locked dependencies and serial Playwright config | 31/31 controls, 12 scenarios collected, HARNESS 1/1 actual browser pass | Wiring inspected; full replacement acceptance/delivery gates pending, not a prefreeze blocker by itself |

## Evidence and change control

Coordinator evidence inspected: /tmp/compass-example2-controls-replacement.log (31/31, no skips), /tmp/compass-example2-collection-replacement.log (12 scenarios), /tmp/compass-example2-harness-regression.log (1/1 real-browser regression). Commands are the package controls script, Playwright collection, and HARNESS-filtered Playwright run from example/nextjs-fullstack/. No independent runner execution or application acceptance is claimed.

Inspected all seven tests resources and package.json, complete lock identity/importer, tsconfig.json and pnpm-workspace.yaml. Compared replacement UI assertions with archived v1. Only PRD, plan and ui.spec.mjs differ from the v1 manifest; the other ten bound resources are identical. Archived v1 files match every v1 manifest hash; retained v1 validation report matches its recorded report hash. Full PRD r2/plan r3 revise every section and retain product/AC semantics; permitted label changes, response-based checkbox results and post-error reload locks do not justify dropping error semantics.

All 13 supplied snapshot hashes matched at inspection and final verification; exact tests inventory is seven files, without additions. Reviewed snapshot is unchanged. Only this authorized report was written. Any relevant input change invalidates this review. Coordinator must obtain fresh validation after the candidate correction and freeze only a PASS snapshot.

## Bound SHA-256 identities

```json
{
  "PRD.md": "f575b0a27ecfb87990d9e85885487f2851daef55157407e015fd73feee484a69",
  "dev/task-manager/plan.md": "2577316025a749d7e90e4bdc8f1bf509f6b9bc69ccf02d8ca766cb06136c9869",
  "package.json": "2eaaea4fadfc09f4e49042e23e9e6ea5f7ea622122f1664d5c39322556cc706c",
  "pnpm-lock.yaml": "450162d6f22628f4ea4964283f61ff6473c2fa74b1246033a61681b16d57572b",
  "pnpm-workspace.yaml": "6f096f437a72ffe947829a23631ecb9992533a8b307f4978e4ebfa27b2318be6",
  "tsconfig.json": "8725c2e3b4cc0b08998cc052744d2ccd490d08a4705e68ae52bf1315d0ad5c41",
  "tests/api.test.mjs": "f09ff3abc2d7a0b80d0a92b0bd70e71ca6ccf71d00d2ac16a8b3dba5bbf483d5",
  "tests/contract.mjs": "e517080d005b41aeed1b771938c3d0c02a5d06fd95e18d3838a477425f0ef7ab",
  "tests/controls.test.mjs": "5d2bd281ed569f064fc7a9992ecb6976c3d433ad58da2f6a296d9a931c903266",
  "tests/outcomes.mjs": "adcc475ac7de5268dde94c8b8207a22ed546cbd3b58ca3d8b6414ff982c80dad",
  "tests/playwright.config.mjs": "9617836cb866fbe0038f509ed6d8109664b8e9d73adf638f7699f6d30efca688",
  "tests/run.mjs": "5cdae5bd63f3ad10f1d9c049c008d5ddaac789798d3caec5d99960424e3c6942",
  "tests/ui.spec.mjs": "146f182f9cf744b2e41b3e59433e97e0db189b8fd64d44eaf87a915cc05c0266"
}
```

Skipped: full replacement application acceptance and production-source review; both remain later gates. Risk: current helper can accept success/progress as failure settlement.
