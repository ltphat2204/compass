# Scoped independent replacement-suite re-review

Test validation: PASS

Reviewer: /root/example2_replacement_review; independent, authored none of reviewed tests/resources or production implementation. Standard review; medium product risk. This scoped review closes the sole blocker in /tmp/compass-example2-replacement-review.md. Expectations were derived from full PRD r2 and plan r3 in the initial review; their exact identities remain unchanged. Reviewed current comp-review/testing policy, complete corrected ui.spec.mjs, current coordinator logs, and all current snapshot identities. No production implementation or generated internals were used as an oracle.

## Finding closure and retained evidence

| Criterion/rule | Agreed source + expected rationale | Assertion/control inspected | Execution evidence | Finding |
|---|---|---|---|---|
| AC-05 actual failed settlement | PRD UI/network: mutation errors and lost responses require failure handling; a pending announcement is not settlement | ui.spec.mjs failedRequest registers requestfinished/requestfailed before action, selects relevant mutation URL/method, resolves real response status or abort; announcedFailure awaits it and requires status >=400 or failed=true | HARNESS uses a real intercepted POST returning 500; verifies settled={status:500}, then exercises the same helper | Previous blocker closed |
| AC-05 error/uncertainty/recovery announcement | PRD experience/network and r2 clarification: visible failure or uncertain-result/reload advice, no false success; label changes and retained reload lock permitted | announcedFailure requires newly visible error/uncertainty/retry/reload semantics, excludes progress prefix; accepts accessible alert/status/field-associated messages without exact label; no sender re-enable requirement | Three actual browser harness controls: valid “Chưa biết kết quả. Tải lại danh sách để kiểm tra.” accepted, “Lưu thành công” and “Đang lưu” rejected by predicate timeout; 3/3 pass | Previous false-positive regression closed |
| AC-05 pending locks/no optimism | PRD: submitting control locked and list updates only after successful response | Existing delayed POST/PATCH/DELETE gates and stableControl targeting retained; pending checks require disabled sender and unchanged view/data | Unchanged shared controls reject unlocked/optimistic outcomes; harness still asserts disabled sender across changed label and error | Covered |
| AC-05 retained drafts/view/data, no retry, reload | PRD: errors retain form/state; do not auto retry; reload resolves uncertain saved result | POST 400/404/500/connection/lost-response and edit/delete/complete 500 scenarios retain input/view, assert API data and one request, monitor no second request, then reload; lost response requires persisted task to reappear | Unchanged shared controls reject false state, cleared input and retry; corrected suite collects all scenarios | Covered; app acceptance remains pending |
| AC-01/06 CRUD/cancel/filter/freshness | PRD flows and server-backed list; response-based completion allowed | Complete CRUD assertions remain; click plus GET completed polling proves post-response result, cancel compares saved state; localStorage write prohibition/reload retained | Unchanged cancellation/order/omission/tie controls; scenario collected | Initial review coverage retained |
| AC-02/03 validation/API | PRD title/identity/strict objects/status/envelopes/error sanitization | contract.mjs and api.test.mjs hashes unchanged, including boundary and rejection assertions | 31/31 controls, zero skip/failure; positive spec model and plausible defective models use shared assertions | Initial review coverage retained |
| AC-04 durable persistence/schema; AC-05 storage errors | PRD durable SQLite, safe reinit, sanitized failed write | run.mjs temporary DB, real SQLite lock, repeat schema/restart/full-record equality unchanged; outcomes unchanged | Independent lifecycle controls unchanged and pass | Initial review coverage retained; integrated execution later |
| AC-07 accessibility/text/widths | PRD labels/keyboard/focus/safe literal HTML/no overflow at 360/1280 | Existing browser assertions unchanged | Scenario collected; plan still requires screenshot/focus inspection | Initial review coverage retained |
| AC-08 reproducible local checks | Plan delivery commands and locked runtime/config | All package/lock/workspace/tsconfig and runner/config hashes unchanged; serial Playwright runner remains wired | 14 browser scenarios collected, 31 controls pass, 3 HARNESS controls pass | Prefreeze harness evidence sufficient; full acceptance/build/delivery gates remain |

No unresolved material mismatch, unsupported expectation or missing required prefreeze check found. This approves the corrected candidate for exact coordinator freeze; it is not application acceptance or final implementation review. Flexible failure wording covers validation, connectivity, uncertainty and recovery without reinstating the unsupported immediate re-enable rule.

## Execution and snapshot

Inspected coordinator logs /tmp/compass-example2-controls-replacement2.log (31/31, zero skips/failures), /tmp/compass-example2-collection-replacement2.log (14 browser scenarios), /tmp/compass-example2-harness-regression2.log (3/3 actual-browser controls). Package controls and Playwright collection/HARNESS runs use example/nextjs-fullstack/ as working directory. Reviewer performed read-only static/hash checks, not independent runner execution.

All 13 provided hashes matched initially and finally; only tests/ui.spec.mjs differs from the prior reviewed candidate, with exact seven-file tests inventory unchanged. Prior BLOCKED report and immutable v1 history are preserved. Full PRD r2/plan r3, six other tests resources and four dependency/config resources are unchanged. Only this authorized report was written. Relevant input changes invalidate this PASS.

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
  "tests/ui.spec.mjs": "fd1735f49da8c71922873052fe3b44b08bd60bae0c765afaf1266e63d027ef63"
}
```

Skipped: full replacement application acceptance and production-source review; both remain required later gates. Residual limits: finite no-retry observation, generated equal-timestamp integration coverage, and subjective focus/layout inspection remain as documented in the initial review.
