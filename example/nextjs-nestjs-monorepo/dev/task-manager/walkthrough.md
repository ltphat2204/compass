# Walkthrough — Project 3

## Entry, scope and artifacts (2026-10-15)

User: `/goal hoàn thành example 3 theo đúng convention`. Existing active goal reused. Clean baseline fb16e66 on branch example. Project 3 contained only PRD and skill history; no CodeGraph index. Read RTK, ponytail, comp-engineer/adaptive workflow, comp-plan/tasks/analyze/implement and testing/delegation rules. Standard mode, medium risk; no product blockers.

Applied comp-analyze requirements gate: PRD outcome, boundaries, errors, persistence, CORS and AC-01–09 are observable; READY for planning. Moved original PRD to `dev/task-manager/PRD.md` and repaired relative links, preserving business criteria. Added explicit env/process contracts and observed context. Applied comp-plan/comp-tasks; consistency READY for test authoring, behavior implementation pending mandatory freeze. No runtime changes yet.

Decision: built-in Node SQLite, plain CSS and pnpm workspace; avoids ORM, driver build and orchestration dependencies. Framework scaffolds must use official CLIs. Node 26.9.0/pnpm 10.22.0 observed; registry versions Next 16.4.1, Nest 12.1.3/CLI 12.0.8, Playwright 1.64.1. Consulted official Next installation/Nest first steps/Node SQLite docs, CLI options and registry metadata. No claim of executed application checks at this point.

### TASK-01 — DONE

- Scope: `PRD.md:1`, `plan.md:1`, `tasks.md:1`; source moved from project root, index link repaired in `example/README.md`.
- Verification: coordinator requirements + consistency review mapped every AC to task/check; source PRD retained and public config/process contract settled. No blocking findings.
- Risk/review: artifact-only change, labeled coordinator self-review; no claim of behavior verification.
- TASK-02 started: fresh `test_author`, no inherited history, tests-only write scope, no app code. Required independent reviewer will receive actual control execution and source/suite hashes.

## TASK-02 — Candidate v1 and coordinator controls

- Fresh test author `/root/test_author` wrote only `tests/v1/**` using PRD/plan/public contracts; no production inspected. Candidate inventory: `candidate-v1.json` (15 source/config/lock/control files; excludes generated node_modules/test-results).
- Pre-freeze coordinator inspection caught and corrected a test assumption: a lost mutation response must reconcile by GET before reattempt, so submit re-enabled immediately cannot be required. Author corrected before review/freeze; source business criteria unchanged.
- Coordinator executions from `tests/v1`: `rtk proxy pnpm controls` exit 0, correct reference HTTP 7/7, all nine wrong-rule controls rejected via AssertionError (trim, Unicode, unknown keys, boolean types, immutable identity, ordering, persistence, CORS, sanitized storage errors). Repeated on final stable candidate, same result.
- `rtk proxy pnpm controls:browser` exit 0, 5/5 correct/wrong-state controls for filter visibility, draft preservation, pending disabled submit, explicit GET retry and loading. These validate assertions, not application behavior.
- Fresh read-only `/root/test_reviewer` assigned full agreed PRD/plan, candidate identities and actual runner/control evidence. Test gate pending independent PASS; no production edits authorized yet.

### Pre-freeze independent review corrections

Reviewer requested precise per-mutant attribution; coordinator re-ran each targeted pattern: wrong trim failed title equality, UTF-16 bound failed expected creation status, unknown-key/type mutants failed 400 assertions, identity changed createdAt, ordering mismatched newest ID, persistence lost the stored task, CORS returned wildcard, secrecy leaked database path. All failed relevant ERR_ASSERTION paths, not imports/startup.

Reviewer identified insufficient isolated controls for UI mutation retry/reconciliation and cancellation/confirmation/XSS semantics, and missing accepted one-code-point title boundary. Test author assigned corrections before freeze. Checkbox completion selected as explicit public UI implementation contract in PRD/plan (reversible presentation choice within authorized scope). Requirements and consistency re-reviewed: unchanged AC-01–09, no scope expansion or product blocker; READY for revised candidate test review. Original candidate-v1 inventory preserved, no production edits.

### Independent test validation PASS

Fresh `/root/test_reviewer`, authored no suite/resources/implementation, reviewed source first and actual assertions/resources on stable candidate-v1b. Verified all 15 hashes and source identities. Initial BLOCKED findings corrected before freeze: lower valid Unicode boundary; executable retry/reconciliation/cancel/confirmation/XSS controls; explicit checkbox public UI decision. Candidate-v1 retained as history.

| Rule / source | Actual assertion path | Correct/wrong evidence | Finding |
| --- | --- | --- | --- |
| AC-03 title 1–200 code points, trim/internal spaces | HTTP title group incl. one-code-point | reference7/7; minimum/trim/Unicode mutants rejected | Covered |
| AC-03 shape/type/status/error contract | HTTP invalid-shape/error helpers | keys/types rejected | Covered |
| AC-02/09 identity/order/CRUD/persistence | HTTP CRUD/restart/storage | identity/order/persistence rejected | Covered; tie code inspection fallback |
| AC-05 exact CORS/preflight | HTTP CORS | wildcard rejected | Covered |
| AC-06/09 config/storage/secrecy | HTTP startup/write-lock/error | reference accepted, leaked path rejected | Covered |
| AC-06 no auto retry / GET before reattempt | browser shared count/trace assertions | correct traces accepted; duplicate/unreconciled writes rejected | Covered |
| AC-08 cancel/confirm/literal title | browser shared snapshots/confirmation/XSS | good controls accepted; changed state/missing confirmation/execution rejected | Covered |
| AC-01/04/07 and config/focus/empty UI | tests README delivery procedures | production checks pending | Mandatory before delivery |

Coordinator repeated exact final candidate: `pnpm controls` exit0, HTTP reference7/7 and all10 wrong-rule mutants rejected; `pnpm controls:browser` exit0,9/9. Reviewer returned Test validation PASS.

Test gate: FROZEN v1, exact validated inventory/dependency locks/source hashes in `freeze-v1.json`; suite aggregate f37b2034b58fd5500b95eeaff5379a81c8973559519882a9a2fd7b55c7fe2278. Full source/inventory check immediately before freeze PASS. Shared filesystem uses explicit test-read instructions, not secrecy claims. Sanitized `implementation-brief.md` plus agreed PRD will be the only feature artifacts given to fresh implementer. No tests/history/results inherited.

TASK-02 DONE: independent validation and coordinator-run controls pass, source/current snapshot hashes frozen. TASK-03/04 start as cohesive serial production assignment.

## Production integration and full source revision v2

Fresh implementer created production only using sanitized brief/PRD, no tests read or run. Official generators used; first Next attempt failed absent apps parent then succeeded after Nest scaffold. Direct express dependency added, unused direct schematics removed (peer warning eliminated), normal Nest watch retained for decorator metadata; dev groups TERM then KILL after3s. Worker applied ponytail/React checklist. Follow-up agent stopped due workspace credit error before final report; current files authoritative, no implementation agent active.

Coordinator ran root `pnpm test`: ordered contracts/API/web build PASS; real HTTP7/7 PASS; Chromium4/6 PASS. Both CRUD journey failures were immediate `check()` checkbox state postconditions, before waiting for saved state. Root typecheck/lint PASS. Coordinator independently used click, awaited filtered row disappearance, then direct GET: completed=true, reverse click completed=false. This proves correct saved behavior and exposes an overprescribed harness timing assumption. v1 source/resource hashes unchanged after all runs.

Per mandatory frozen-test change control, implementation/delivery paused; reviewed every PRD and plan section, preserved v1 snapshots in `revisions/v1/`, original `tests/v1/` and freeze-v1 manifest. Full PRD/plan v2 retain ACs/scope/architecture/versions; clarify response-confirmed asynchronous checkbox behavior, select new tests/v2, reopen TASK-02 and invalidate affected browser/integrated/review evidence. Requirements and cross-artifact consistency READY for new author/review/freeze, not delivery. No production checkbox workaround.

Clean temp copy created excluding dependencies/build/env/DB/output; one root frozen-lockfile install PASS (502 packages); clean build in progress. Install optional build script unrs-resolver was ignored by pnpm; root lint still PASS in original workspace, clean checks will establish impact.

### Independent harness diagnosis and delivery checks during v2 authoring

Read-only reviewer `/root/test_reviewer` independently confirmed PRD response-confirmed UI conflicts with Playwright1.64.1 `_setChecked` immediate postcondition; required v2, no waiver. Original frozen resources retained untouched.

Clean-copy cwd `/var/folders/m9/0zl66hyj73z_6282rhmg77m80000gn/T/compass-example3-clean-yhw656h1/project`: root install --frozen-lockfile, build (contracts→API→web), typecheck and lint all exit0; API oxlint0warnings/0errors. No env/DB/build/dependencies copied. Temporary web caller imported CreateTaskRequest and assigned numeric title; root typecheck failed TS2322 at caller assignment, proving incompatible shared type reaches consumer. Temporary caller removed.

Clean build without NEXT_PUBLIC_API_URL started on owned ephemeral port; Chromium observed clear NEXT_PUBLIC_API_URL configuration alert, disabled Thêm, zero `/api/tasks` requests. No same-origin fallback. Server stopped and port released.

### Dev shutdown probe details

First ad-hoc probe signaled only the outer pnpm PID, which does not model terminal Ctrl+C and did not forward SIGINT; owned groups were explicitly cleaned. Follow-up used terminal process-group signaling: both API/web served on ephemeral ports, root SIGINT and SIGTERM each freed both ports and stopped all8 observed descendants. The first follow-up printed both PASS results but its final ad-hoc cleanup awaited an already-signaled child through an unref timeout (exit13); repeated with explicit exited-state handling to obtain a clean exit. No production or frozen harness changes made for probe cleanup. Root supervisor's own source explicitly handles both signals and terminates both detached groups after grace, even wrapper-first exit.

### Independent test validation v2 PASS

Fresh-context-independent `/root/test_reviewer` re-read complete PRD/planv2 and compared actual v2 assertions/resources against preserved v1. PASS: normal click now awaits shared completion outcome (filter departure + exact saved boolean from GET), no old behavior assertion removed. All prior API/recovery/cancel/confirmation/XSS coverage retained. Six added controls accept delayed response-confirmed transitions and reject unpersisted/stale-filter defects in both directions. Coordinator actual runners: reference HTTP7/7 +10 rejected mutants; Chromium controls15/15, both exit0. Full source→assertion/control table remains as previous validated map with completion row updated here.

Test gate FROZEN v2: 15 resource hashes + source identities verified against candidate-v2; exact inventory/author/reviewer/dependency identities in freeze-v2.json. Aggregate745cd9ab5139686e4cfc23acddb260f330f8f12e94abcf226c3ab2b6d64a2bbe. v1 tests and archived v1 PRD/plan hashes separately checked unchanged. TASK-02 DONE again on valid v2 gate. Root opaque test command and README now select tests/v2; this is coordinator operational version selection only, no product behavior edits.

Repeated root dev terminal-group probe exited0: SIGINT and SIGTERM each observed both HTTP surfaces, parent+8 descendants exited and both ports reusable. No operational cleanup failure on final repeated probe.

## Current integrated acceptance and manual delivery evidence

- Root cwd project: `rtk proxy pnpm test` selected frozenv2, installed exact private lock, built contracts→API→web, actual HTTP7/7, actual Chromium6/6, exit0. Both360/1280 journeys, restart durability, lost-response reconciliation/no auto retry, loading/error/retry and failed edit/delete pass. Post-run current v2 inventory/source hashes PASS; preserved v1 resource hashes PASS.
- Root typecheck and lint exit0 in original and clean copy. Clean frozen install/build/typecheck/lint pass. Negative shared-contract caller produces TS2322 as intended, then removed. Both apps import framework-free contracts; web has no Nest/SQLite/other-example imports or duplicate CRUD routes. Built client static bundle scan for DATABASE_PATH/WEB_ORIGIN/node:sqlite returned none.
- Clean missing-public-config build: explicit alert mentions NEXT_PUBLIC_API_URL, disabled submit, no `/api/tasks` request. Real API startup invalidconfig/corruptDB/directoryDB tests and write-lock500 sanitization pass.
- Root dev clean-copy probes exit0: SIGINT/SIGTERM terminal group stops parent+8descendants and both owned ports can be rebound. API_PORT/WEB_PORT test actual documented contract. Signaling only the outer pnpm PID is not terminal Ctrl+C and is not used as the supported interruption model.
- Coordinator Chromium keyboard pass: Tab navigation reaches14 input/action targets, each computed visible outline≥2px; keyboard insertion, submit, edit/save/cancel, Space completion, allfilters, delete and retry work. Native browser confirmation accepted/dismissed through dialog API, while triggering Xóa used keyboard. Empty-list and empty-filter messages differ. Overflow absent at360px.
- Screenshots personally inspected at360/1280: clear labels/actions, no clipped/overlapping content; saved outside repo in task visualization directory as example3-mobile.png and example3-desktop.png. This is Chromium-only visual evidence, not Safari/Firefox certification.
- Deterministic tie ordering is explicit SQL `ORDER BY createdAt DESC, id DESC`; API suite checks every natural same-timestamp group and restart order. No claim of forced clock collision.

### Implementation decisions and actual worker handoff

Worker generated Next via `pnpm dlx create-next-app@16.4.1 apps/web --ts --app --src-dir --no-tailwind --eslint --use-pnpm --skip-install --disable-git --no-agents-md --no-agent-feedback --import-alias '@/*' --yes`; Nest via `pnpm dlx @nestjs/cli@12.0.8 new api --directory apps/api --skip-git --skip-install --skip-tests --package-manager pnpm --no-observe`. First Next invocation failed missing apps parent then succeeded. Worker reported an unavailable schematics12.0.8 resolution, used published12.0.7 then removed unused direct schematics to resolve TS6 peer warning. Direct express5.2.1 declared because API imports it; no ORM/nativeSQLite/extra orchestration. Removed scaffold-only service/tests/sample assets/READMEs. Runtime watch uses Nest CLI for decorator metadata; React page/layout checklist applied.

Production paths: `apps/api/src/main.ts:1` boundary/CORS/errors, `app.controller.ts:1` validation/routing, `tasks.service.ts:1` SQLite ownership; `apps/web/src/app/page.tsx:1` direct-fetch/response-confirmed UI and `globals.css:1` responsive/focus; `packages/contracts/src/index.ts:1` shared public types; root manifests/scripts/README. Implementation API/UI tasks remain pending independent aggregate review; no DONE claim before review.

Delivery consistency (`comp-analyze`, coordinator): AC-01 clean install/root commands; AC-02 real browser+API+persistence; AC-03 HTTP validation/errors; AC-04 shared imports/type-negative control; AC-05 CORS/preflight; AC-06 startup/config/outage/recovery; AC-07 ordered cleanbuild/process cleanup; AC-08 CRUD/filter/cancel/confirm/responsive/keyboard; AC-09 restart/non-destructive schema/secrecy each have current evidence above. No uncovered criterion or unauthorized scope. READY for independent final review, not final delivery yet.

## Independent final review F-01 and complete revision v3

Fresh `/root/final_reviewer`, authored no production/tests, reviewed all33production/docs hashes plus actual source/contracts/callers/assertions and freeze/change-control evidence. Snapshot manifest SHA2566dbb3d0b8329b79242eb9de832254a4bf9d32ace8611c57388c85fe4cb071cfd. CHANGES REQUIRED, medium risk, sole MAJOR F-01 at apps/api/src/main.ts:12: Express parser errors other than400 became500. Coordinator owned-temp HTTP probes confirmed unsupported JSON charset500 (requires415) and oversized invalid title500 (requires400). No other blocker identified.

Stopped delivery/behavior editing, preserved allv2sources under revisions/v2 and both old suites/freezes. Full PRD/planv3 review retains all prior sections/criteria/decisions, clarifies existing parser status obligations without changing scope or weakening limits. TASK-02 reopened; affected API/integrated/review evidence invalidated. Fresh test authorship/review/freeze precedes shared error mapping fix. Unchanged-path clean install/type/control/dev/visual evidence remains traceable to reviewed source hashes, to be checked against final snapshot before reuse.

### Pre-freeze v3 context correction

Initial v3 author packet referenced full revised sources whose reviewer rationale described shared-filter internals. To honor the stricter tests-only context boundary, coordinator invalidated that unfrozen candidate validation before any freeze/implementation and dispatched fresh `/root/boundary_test_author` with sanitized public criteria/observed HTTP behavior only. It must not read production, full shared artifacts, prior v3 candidate or reports; it may reuse original independent frozenv2 and independently author replacementv3 parser cases/reference/controls. Prior v3 candidate manifest retained as pre-freeze history; no tests/v1/v2 resource changed. This is explicit context repair, not a claim that instructions erase earlier context.

### Independent test validation v3 PASS

Replacement fresh boundary_test_author supplied sanitized criteria only and reused independent v2, never read app/shared artifacts/prior candidate. Actual candidate-v3b differs in5files, all original assertions retained. Independent test_reviewer reviewed complete sourcev3 and actual assertions/resources/context repair, PASS.

| New rule / PRD source | Actual assertion | Correct/defective control | Result |
| --- | --- | --- | --- |
| Unsupported JSON charset is415 | POST/PATCH status+sanitized envelope | charset500/400 rejected | Covered |
| Oversized invalidtitle remains400 | POST/PATCH twoMiB title status | large500/415 rejected | Covered |
| Failed request preserves task | whole snapshot after rejection/restart; PATCH includes completed | reference accepted | Covered |
| Genuine storage500 | real SQLite write-lock test unchanged | storage400 rejected | Covered |
| All prior AC coverage | existingHTTP/browser/delivery procedures retained | previous10HTTP+15UIcontrols retained | No weakening |

Coordinator exact candidate execution: pnpm controls exit0 reference9/9+15rejectedmutants; controls:browser exit0 15/15. Reviewer checked bounded/draining reference, private64KiBcap not imposed on production. Freeze-v3.json records exact15resources/source identities/author/reviewer/locks, aggregate8cfb52a9f9c415db8024e9ac29cf77966fd76531e672c2a06abef4395c582820. Verified immediately before freeze. Root opaque suite selector/README changed to v3. TASK-02 DONE; fresh production-only fix context now allowed, no tests/reports inherited.

### F-01 production fix and renewed acceptance

Fresh `/root/parser_fix` received agreed PRD/public boundary requirements and API production-only read scope, no tests/history/reports. It inspected single ApiErrors registration, changed only `apps/api/src/main.ts:12`: preserve parser415, normalize parser413 to public400, retain HttpException precedence/invalidJSON400/genuine storage500, same parser size limit and sanitized envelopes. Stable main SHA25620de457ed2c807d32674dfc949ffa733c6071e52fc1d8f8d9ee27ddd2bb5f63a. Worker API build/typecheck/lint PASS (one RTK typecheck-wrapper attempt failed, proxy rerun PASS); no acceptance suite read/run.

Coordinator root `rtk proxy pnpm test` on frozenv3 exit0: exact private lock install, contracts→API→web build, realHTTP9/9 and Chromium6/6. New unsupportedcharset415/oversizedinvalidtitle400 requests pass with unchanged storage after rejection/restart; real lockedSQLite500 still passes. All previous browser/lower-boundary/CORS/persistence/recovery assertions retained and green. Current clean-copy full checks in progress before final re-review.

Final clean-copy cwd `/var/folders/m9/0zl66hyj73z_6282rhmg77m80000gn/T/compass-example3-final-5tgd9eio/project`: new current-source copy without deps/build/env/DB/output, root frozen install→ordered build→typecheck→lint all exit0;0APIwarnings/errors. Optional unrs-resolver build ignored by pnpm, no check failure. No unused schematics peer warning. v3 source/inventory hashes and archivedv1/v2 source/resource hashes verified after renewed acceptance.

## Independent final review READY and local delivery

`/root/final_reviewer`, independent/read-only/authored no changes, returned READY (medium risk), F-01 CLOSED. Verified final33/33production/docs hashes, exactly4changes and29unchanged since originalreview, all v1/v2/v3 suite/source identities. Actual shared error mapping, exact POST/PATCH regression assertions, data snapshots/restarts, genuineSQLite500 and independent validation/control evidence reviewed. Current delivery consistency and final implementation review READY for AC-01–09, no unresolved findings. ManifestSHA87d2a472a56de0e0c4a421e9533fdd2fa82f3e58da3d47a387490ca0964df735; v3aggregate8cfb52a9f9c415db8024e9ac29cf77966fd76531e672c2a06abef4395c582820. Reviewer did not claim to rerun runtime checks.

### TASK-03 — DONE: workspace/contracts/API

- Goal/files: root manifests/lock/scripts, `packages/contracts/src/index.ts:1`, `apps/api/src/main.ts:1`, `app.controller.ts:1`, `tasks.service.ts:1`; complete public API with backend-owned durableSQLite.
- Decision: Node built-in SQLite/prepared statements and framework-free shared types, no ORM/extra orchestration; directexpress import declared; runtimeboundaryvalidation required independently of TS.
- Evidence: current frozenHTTP9/9, APIbuild/typecheck/lint, clean rootinstall/build/typecheck/lint, negativeconsumer typecheck, CORS/errors/restart/storagefault checks.
- Review: medium/publiccontract+data, independent final reviewer READY, F-01closed on current snapshot.

### TASK-04 — DONE: web user journey

- Goal/files: `apps/web/src/app/page.tsx:1`, `globals.css:1`, `layout.tsx:1`, envexample; direct API CRUD, response-confirmed updates, draft/error/recovery, keyboard and responsiveUI.
- Decision: plainCSS, labeledcheckbox, nativeconfirmation, no duplicate NextCRUD API or serverdata imports.
- Evidence: currentChromium6/6,360/1280screenshots inspected,14keyboard focus targets and action sequence, safe literaltext, filter/empty/cancel/confirmation, network/restart/lostresponse recovery.
- Review: independent actual-code/spec review READY; unchanged UI hashes retain previous manual evidence.

### TASK-05 — DONE: integrated verification/instructions

- Goal/files: rootREADME:1 and scripts/manifests; current-source clean install and dependency-ordered build, contracts/types, rootprocess supervision.
- Evidence: final fresh copy frozeninstall/build/typecheck/lint exit0; root pnpmtest exit0 HTTP9/9+Chromium6/6; reference9/9+15wrongmutants, UIcontrols15/15; source/resource integrity across3versions. Missingwebconfig alert/noCRUD, no privateconfig clientbundle, rootdev SIGINT/SIGTERM terminalgroups stop8descendants and releaseports; negativecontract caller rejected.
- Review: independent finalreview+deliveryconsistency READY. NoCI workflow existed for this example; remoteCI/PR/deployment not applicable to authorized localhandoff.

### TASK-06 — DONE: local handoff/index/history

- Goal/files: `example/README.md:1`, projectREADME/history, this folder tasks/walkthrough/freeze/source snapshots. Rootindex points currentPRD and actual observedresults; history retains failures/corrections, actualprompts/stages and limitations.
- Verification: all AC-01–09 have current evidence above; current independentreview READY and no productionchanges sinceapprovedsnapshot. Final diff/inventory audit and local ConventionalCommit follow below.
- Delivery: local branch `example`, commit subject `feat(examples): add verified Next.js NestJS task manager`. No remote push/PR/merge/production action. Keep artifacts in active `dev/task-manager/` until local completion is accepted; comp-done archive prerequisite is not yet met.

## Remaining limits

Chromium only; Safari/Firefox not checked. No production deployment/authentication/CI/CD (outside PRD local scope). Terminal Ctrl+C sends signals to its process group; sending SIGINT only to the outer pnpm PID is not the supported shutdown procedure. Optional unrs-resolver build-script warning did not affect clean build/typecheck/lint. Historical frozen v1/v2 are retained intentionally; root test selects v3.

### Final audit and commit

Completion audit PASS after independent READY: all33reviewedproduction/docs hashes match; all3frozen inventories and current/archivedsource hashes match;6/6task evidence present; README targets exist;97stagedsource/docs files contain no generatedoutput/envsecrets/userDB. Staged git diff --check PASS. ConventionalCommit `feat(examples): add verified Next.js NestJS task manager` created on branch example; workingtree observed clean. This final audit record is included by local amendment; production snapshot unchanged. No remoteoperations performed.
