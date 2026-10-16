# Walkthrough: Next.js full stack task manager

## 2026-10-15 — Preparation and execution prerequisites

- User request: `/goal hoàn thành example 2 theo đúng convention`.
- Applied `comp-engineer`, Ponytail; read adaptive workflow and strict-testing requirements. Identified example 2 as `example/nextjs-fullstack/`; PRD is the existing intent, AC-01–AC-08. No application source/manifest/tests existed; Git working tree was initially clean.
- Requirements review (`comp-analyze`, coordinator self-review): READY for planning. PRD defines product flows, validation, HTTP errors, persistence, recovery, scope and observable acceptance. No blocking product question found.
- Applied `comp-plan` and `comp-tasks`: created standard plan and six-task tracker in the project-local `dev/task-manager/`, matching example 1's artifact convention while preserving the existing root PRD.
- Environment observed: Node v26.9.0, pnpm 10.22.0; registry next/create-next-app 16.4.1. Built-in node:sqlite in-memory open/query/close succeeded, SQLite 3.53.4. These are environment probes, not application tests.
- Isolation investigation: native collaboration agents share filesystem and unrestricted tools. A distinct folder/worktree or prompt restriction does not enforce read isolation. Docker responds (server 28.5.1), but no existing configured isolated implementer has been verified; no new isolation runtime was built. CLI availability alone does not establish isolation. Example 1 plan explicitly records an exception limited to that project, so it cannot authorize this example.
- Artifact consistency (`comp-analyze`, coordinator): READY for preparation; all AC map to tasks and planned checks, task dependencies retain test author → independent validation → freeze/access gate → fresh implementer → integrated verification/final review. Planned commands remain unexecuted until scaffold/harness exists.
- Behavior execution: BLOCKED pending verified access isolation or an explicit example-2-only exception. No behavior source written, no candidate suite authored/frozen, no application check claimed, no delivery/archive/remote operation performed.

Next safe work: scaffold baseline, independent test authorship and validation; implementation waits for all test/access gates. If user authorizes instruction/write-scope separation, record the exact scope, owner, rationale and retained gates before implementation; never claim host-enforced secrecy.

## TASK-01 — Official scaffold baseline

- Read/applied `vercel:nextjs` for App Router conventions. Inspected `pnpm dlx create-next-app@16.4.1 --help` before choosing options.
- Executed `pnpm dlx create-next-app@16.4.1 /tmp/compass-example2.GqXdJY/nextjs-fullstack --ts --eslint --app --src-dir --no-tailwind --no-react-compiler --no-agents-md --no-agent-feedback --use-pnpm --import-alias "@/*" --disable-git --skip-install --yes`; non-overwriting copy into existing project preserved PRD/history. No nested Git repository.
- In `example/nextjs-fullstack/`: `pnpm install` exit 0; scaffold resolved Next 16.4.1, React/React DOM 19.3.0, TypeScript 5.9.3, ESLint 9.39.5. Lockfile and package-manager metadata retained.
- `pnpm build` exit 0, static scaffold routes generated; `pnpm lint` exit 0. Added `typecheck` script (`next typegen && tsc --noEmit`), Node engine >=26.9.0 and compatible Node 26 typings; `pnpm typecheck` exit 0. Installed @playwright/test 1.64.1 for forthcoming browser acceptance. pnpm reported ESLint 9 deprecation; scaffold's existing ESLint major retained.
- Baseline review: coordinator self-review, scope limited to generated scaffold/configuration; no task CRUD behavior or acceptance claim. TASK-01 DONE (1/6), candidate test authorship IN_PROGRESS.
- Fresh test author `/root/example2_test_author` received only PRD, public HTTP/runtime contracts and strict-testing instructions. Owns `tests/**`; no production/artifact scope. Public operational contract clarified: `DATABASE_PATH`, `pnpm db:init`; future implementation must honor it. Test-review/freeze and read isolation remain pending.
- Asked the user for an example-2-only instruction/write-scope separation exception, explaining the exact strict-testing rule and that example 1's exception is project-specific. No answer or authorization recorded yet.

## Upstream convention correction before test freeze

User replied: “tôi đã sửa rồi mà, có merge main qua branch này chưa”. Inspected local/remote history, fetched origin and found `93bfe64 fix(testing): allow shared filesystem with test-read guidance (#4)` on main but absent from example. Merged `origin/main` into example without conflict, creating merge `37830cb`; `git merge-base --is-ancestor origin/main HEAD` exit 0.

Read the updated testing boundary: shared filesystem is permitted, fresh sanitized implementation context/test-read guidance required; no host-enforced secrecy claim. The earlier blocker was based on stale branch policy and is resolved by the actual upstream rule change, not a user exception. No additional approval is needed. Re-reviewed all plan sections into revision 2 before freeze; product PRD/criteria unchanged, test author notified. Earlier history retained as actual sequence.

## TASK-02/03 — First candidate validation (not frozen)

Fresh author `/root/example2_test_author` delivered six resources in tests/. Coordinator executed controls 17/17 PASS and Playwright collection 9 scenarios; full runner reached the missing schema command/implementation. The initial runner log predates settling `db:init` to `node scripts/init-db.ts`; this is expected missing implementation, not application acceptance.

Fresh reviewer `/root/example2_test_review` compared the exact PRD/plan/candidate hashes, reran controls and demonstrated that a faulty GET omitting the newest record passed the original order assertion. Test validation BLOCKED: missing membership/tie checks, insufficient mutation failure/lock/retry coverage and missing persistence/UI rule controls. [Full report](test-validation-candidate1.md) preserves criterion mapping, exact identities and findings. No freeze or behavior edits performed. Returned findings to original test author for correction before freeze; no product requirement changed. TASK-02 IN_PROGRESS, TASK-03 remains pending validation; progress 1/6.

## TASK-02/03 — Corrected candidate, independent PASS and FROZEN v1

Original test author corrected candidate before freeze (no product/PRD change): guarded saved-record membership/equality, stable ID tie ordering checks/controls, shared persisted/canceled/pending/failure assertions, and edit/delete/completion failure lock/state/retry checks. Coordinator reran controls 31/31 PASS and collected 11 Chromium scenarios. Current runner reaches the expected missing `scripts/init-db.ts`; app acceptance remains pending.

Fresh reviewer `/root/example2_test_review2` authored no reviewed content. [Validation report](test-validation-v1.md): PASS, all 13 declared input hashes/seven-resource inventory unchanged, source-to-assertion/control table recorded. Report retains limitations: real application/storage/browser execution and production ID tie-order source review still required.

Coordinator verified exact identities and froze v1 in `test-freeze.json`, preserving reviewed PRD/plan/config/lock/suite/report in `test-suite-v1.tar.gz`. Test gate: FROZEN. All later suite changes require full PRD/plan revision and replacement review/freeze. TASK-02 and TASK-03 DONE; progress 3/6.

Sanitized fresh implementer packet prepared outside tests/artifacts. Permitted production scope: src/**, scripts/init-db.ts, next.config.ts, .env.example, public/**. Forbidden: tests/**, artifacts/reports/history, test execution/probing, dependency/config resources in frozen inventory. Only coordinator handles suite execution and receives detailed evidence. Shared filesystem explicitly allowed by merged main policy; no enforced secrecy claimed.

## TASK-04/05 — Production handoff and first acceptance attempt

Fresh implementer `/root/example2_implementer` read only the sanitized packet/PRD and allowed production paths. Delivered src/lib/{tasks,db,task-api}.ts, App Router API routes/page/layout/CSS, scripts/init-db.ts, .env.example and Next config. Uses built-in SQLite/prepared statements, durable writes before success, schema CREATE IF NOT EXISTS, descending createdAt/id, uncached GET, strict boundary validation, Vietnamese accessible CRUD/filter UI and reload recovery. Removed incompatible generated cache flags; no dependencies or frozen config changed. Production build and scoped lint PASS; no tests read/run by implementer. Implementation context is now closed.

Coordinator verified frozen-v1 hashes/inventory before and after acceptance. Actual `pnpm test` on production server/temp database: controls 31/31 PASS, HTTP/API 5/5 PASS, browser 2/11 PASS and 9 failures. `pnpm typecheck` and whole-project `pnpm lint` exit 0. Restart/real-lock stages were not reached because browser stage failed. Private full run log: /tmp/compass-example2-acceptance-v1.log.

Observed harness failures: checkbox `check()` insists immediate checked state before saved server response; strict button-name locators disappear when pending labels change; post-failure assertions require senders enabled even when explicit reload recovery keeps mutations blocked. These expectations are not required by the PRD. No production change made to fit them, no passing application claim.

## Full source revision before frozen-test replacement

Preserved test-freeze-v1.json, immutable test-suite-v1.tar.gz and validation-v1 report. Re-reviewed every PRD section into revision 2 and every plan section into revision 3. Product criteria/IDs/API/data/error rules unchanged; clarified response-based verification and permitted pending/reload labels/states. Requirements/consistency coordinator self-review: READY for replacement test preparation; all AC/task/check mappings retained. Reopened TASK-02/03 and invalidated v1 browser acceptance/test validation for replacement scope; source implementation held, TASK-04 not DONE. Progress 1/6 valid accepted tasks. Original test author receives harness-only repair and current agreed source; independent replacement validation/freeze must precede resuming acceptance. No user exception or scope reduction.

## Independent source review and manual visual evidence

Fresh independent reviewer `/root/example2_final_review` reviewed 18 stable production/spec hashes without test author/implementation authorship. [Source review](source-review.md): no material production findings; deterministic SQL `ORDER BY createdAt DESC, id DESC` and matching UI comparison confirmed. Aggregate delivery remains pending replacement suite/acceptance/docs.

Setup concern: plain Node `db:init` does not load Next env files. README now documents exported `DATABASE_PATH` for both init and application; .env.example is reference only. No dependency/source change needed.

Coordinator started production preview at 127.0.0.1:3103. Manual Chromium flow added three records through UI, toggled completion, captured and visually inspected screenshots at 1280 and 360. Layout is readable, controls wrap within viewport, no horizontal overflow; keyboard Tab focused Thêm with visible 3px outline. No pageerror observed. Preview records created by this check were deleted afterward; pre-existing records preserved. Screenshot artifacts live in the chat visualization directory (`example2-desktop.png`, `example2-mobile.png`), outside test/source resources. This confirms subjective layout/focus; it does not replace frozen acceptance.

Replacement candidate prepared by original independent author; only ui.spec.mjs changed. Coordinator ran unchanged controls 31/31, collected 12 scenarios and executed standalone browser harness regression 1/1 PASS (progress label and meaningful uncertainty error with locked sender). Requested fresh independent `/root/example2_replacement_review` against PRD r2/plan r3/current resource hashes before replacement freeze. Production source remains unchanged.

## Replacement candidate review — correction before freeze v2

Fresh independent `/root/example2_replacement_review` returned BLOCKED on unchanged 13-input snapshot: announcedFailure accepted any newly visible message, so success or late progress could satisfy error settlement. [Report](test-validation-replacement-candidate.md). Other coverage retained. Returned only this finding to original author: preserve meaningful error/uncertainty semantics and actual request settlement; add positive/negative browser harness controls against the same helper. V2 is not frozen; direct candidate correction is allowed under existing PRD r2/plan r3. No production writes or rule weakening.

## Replacement independent PASS and FROZEN v2

Original author strengthened only ui.spec.mjs before freeze. Same helper now requires requestfinished/requestfailed evidence of HTTP failure/abort and newly announced meaningful error/uncertainty/reload semantics. Three actual-browser harness controls accept a valid uncertainty/reload state while retaining the pending-renamed locked sender; reject success and late progress via the same helper. Preservation/pending/no-retry/recovery assertions retained.

Coordinator executed controls31/31, harness3/3 and collection14. Fresh independent replacement reviewer re-reviewed exact changed scope and all bound identities: [PASS report](test-validation-v2.md), 13 hashes unchanged. Coordinator froze exactly that snapshot as v2 in test-freeze.json/test-freeze-v2.json and preserved test-suite-v2.tar.gz. FROZEN v1/report/archive remain untouched. TASK-02/03 DONE again, progress3/6; production context closed and behavior unchanged, acceptance may resume.

Removed unreferenced generated page.module.css and five default public SVG assets after confirming no production references. No runtime behavior affected. Coordinator rebuilt final production source: exit0, dynamic API routes generated, no build warnings. Whole-project lint rerun for the replacement harness.

## TASK-05 — Final-source acceptance against FROZEN v2

Coordinator working directory for commands: `example/nextjs-fullstack/`.

| Check | Actual result |
| --- | --- |
| `pnpm install --frozen-lockfile` | exit0, lockfile satisfied |
| `pnpm build` | exit0; static page and dynamic task API routes generated; no build warning |
| `pnpm typecheck` | exit0, no TypeScript errors |
| `pnpm lint` | exit0, whole project including replacement tests |
| `pnpm test` | exit0; controls31/31, HTTP/API5/5, Chromium14/14 |
| SQLite integration in test runner | Real exclusive-lock POST returns sanitized500 and no saved record; repeat schema and real process restart retain all updated task fields |
| Frozen integrity before/after | Exact seven-resource inventory, all13 input hashes and independent report hash match v2 |
| Visual/keyboard | Actual screenshots inspected at360/1280; visible3px focus, no page horizontal overflow or browser pageerror |

Fourteen browser tests comprise eleven application acceptance scenarios and three isolated harness controls; the latter are not application feature coverage. API tests assert trim/code-point boundaries, strict objects/types/status/envelopes, immutable fields, membership/saved data freshness, deterministic ordering and repeated-delete404. Real-browser scenarios prove CRUD/cancel/filter/reload, GET recovery, failed/lost-response POST plus edit/delete/completion locks/retention/no retries, safe literal HTML, labels, keyboard and widths. Lost-response scenario proves server may have committed even though UI retains draft until explicit reload. Production tie order additionally verified in independent source review because live timestamps are not forced equal.

Private full acceptance log `/tmp/compass-example2-acceptance-v2.log`; final build log `/tmp/compass-example2-build.log`. Node emits MODULE_TYPELESS_PACKAGE_JSON when detecting TypeScript ESM for db:init, and pnpm reports143 for intentional SIGTERM server cleanup/restart. Top-level test exits0; no error is hidden or skipped. These informational lifecycle/module warnings are retained rather than modifying frozen package configuration for cosmetic cleanup. Review must acknowledge these limits.

README now documents default/custom exported DATABASE_PATH and the distinction from Next env files, actual scripts, test lifecycle and local-only scope. Overview updated with actual example2 results; final source/spec/evidence/docs review pending. TASK-04/05/06 are not yet DONE.

## TASK-04/05/06 — Independent final READY and local delivery

Fresh independent aggregate reviewer `/root/example2_final_review` inspected actual combined production/spec/tests/docs and coordinator evidence, authored none of reviewed changes. [Final report](final-review.md): READY for local handoff, no material findings, AC-01–AC-08 and all six tasks covered. Verified all42 review snapshot hashes, current13 frozen inputs, exact7-resource test inventory, current/v2 manifest equality, both v1/v2 archive/source/report identities. Source secondary ordering confirmed. Reviewer did not claim independent browser/build execution: those results are coordinator-owned and documented above.

Delivery analysis READY: every AC maps to current passed checks, frozen testing/context requirements met under merged main policy, user data/security rules retained. TASK-04/05/06 DONE after applicable independent review; final progress6/6. Coordinator appended only result/status metadata after review; source/config/tests/PRD/plan unchanged.

Local delivery uses branch example and Conventional Commit `feat(examples): add verified Next.js SQLite task manager`. No push, PR, remote CI, production deployment or merge into main is part of this local handoff. Main was already merged into example earlier at user's steering; no extra merge authorization is required for that completed local operation. Feature artifacts remain in project-local dev/task-manager pending user acceptance; not archived as if a remote delivery occurred. Safari/Firefox and multiuser/auth behavior are unverified/out of scope.

## 2026-10-15 — Accepted handoff, example-1 comparison and archive

User accepted local delivery: “ok duyệt”, then required dev specs remain inside example and comparison against example1. Compared project-local PRD/plan/tasks/walkthrough, root README/skill and prompt history, test suites/freezes v1/v2 and review snapshot. These delivery artifacts are present; example2 also retains independent review reports. Found one organization difference: PRD was still at project root. Moved PRD together with all completed artifacts into `example/nextjs-fullstack/dev/_archived/20261015/task-manager/`, matching example1's project-local spec grouping and comp-done's accepted-completion archive rule. Example1 itself remains unchanged.

Updated relative Markdown links and current manifest relocation using example1's existing relocation pattern. Canonical v1/v2 manifests and suite archives remain byte-identical; original requirement/plan snapshots remain inside the v2 archive. No test expectation, product requirement, implementation, dependency or verification result changed. Completion remains6/6 and user-accepted; no remote push/deploy authorized. Narrow archive verification checks preserved inventory, links, immutable snapshots and current mapped hashes; runtime tests need not rerun for relocation only.
