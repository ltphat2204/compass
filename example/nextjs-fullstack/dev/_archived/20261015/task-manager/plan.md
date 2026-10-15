# Plan: Next.js full stack task manager

- Revision: 3, 2026-10-15 (Asia/Ho_Chi_Minh).
- Intent: [PRD.md](PRD.md) revision 2, existing AC-01–AC-08; no duplicate intent.
- Mode: Standard. Risk: medium (HTTP validation and durable user data).
- Requirements: READY, based on the existing PRD and coordinator review of its rules, failure paths and observable criteria.
- Artifact consistency: READY for preparation. Main policy update 93bfe64 is merged: shared filesystem is permitted with fresh sanitized contexts and explicit test-read guidance. Test validation/freeze v1 completed; delivery paused for full PRD r2/plan r3 revision and replacement suite validation/freeze v2.

## 1. Strategy & principles

Deliver the independent Vietnamese task manager described in the PRD, using UI → same-origin Route Handlers → SQLite. Preserve the exact API contract, Unicode title rules, failure recovery and durable storage. No authentication, ORM, deployment or shared dependency on example 1.

Use the official create-next-app scaffold, App Router, TypeScript, ESLint and plain CSS. Resolve and pin scaffold/dependency versions during preparation and commit the pnpm lockfile. Registry inspection on this host returned next/create-next-app 16.4.1; official scaffold has since run successfully; see walkthrough. Host: Node v26.9.0, pnpm 10.22.0. The built-in node:sqlite DatabaseSync opened an in-memory database successfully (SQLite 3.53.4); use it to avoid a native dependency. Document the tested Node version and recheck compatibility during build.

Official references: [installation](https://nextjs.org/docs/app/getting-started/installation), [SQLite](https://nodejs.org/api/sqlite.html). Package availability and the local SQLite probe are preparation evidence, not application acceptance.

## 2. Deliverables & architecture

All production files stay inside `example/nextjs-fullstack/`:

- `src/app/page.tsx`, `layout.tsx`, `globals.css`: accessible, responsive Vietnamese UI, loading/retry, mutation locks, explicit failure recovery and no task localStorage.
- `src/app/api/tasks/route.ts` and `[id]/route.ts`: GET/POST/PATCH/DELETE contracts from PRD; Node runtime, uncached reads and sanitized errors.
- `src/lib/tasks.ts`: public Task type and request validation (trim; 1–200 Unicode code points; exact allowed fields/types).
- `src/lib/db.ts`: SQLite schema and prepared statements; configurable `DATABASE_PATH`, persistent default under `data/`; schema creation is idempotent and never seeds or deletes data. Stable descending createdAt/ID ordering.
- `scripts/init-db.ts`: explicit repeatable schema initialization using the same database code.
- Manifest, pnpm lockfile, TypeScript/ESLint/Next config, `.gitignore`, `.env.example` and README: standalone install/run/build/typecheck/test and database instructions. Ignore database files, build output and dependency directories.
- Candidate tests/resources, immutable freeze manifests and reports: coordinator/test-author owned; paths and exact commands settled before freeze, never supplied to implementer.

Public contract is exactly the PRD API table and Task fields. No new exports are required outside this example. There were no application callers, fixtures, manifests or CI in example 2 at initial inspection. Official scaffold/configuration now exists; no task behavior has been implemented. Existing examples and root scripts remain unaffected, apart from updating example overview after verified delivery.

## 3. Ordered roadmap & verification

1. Prepare scaffold/configuration and baseline commands; verify install, typecheck, lint and build. Do not implement task behavior yet.
2. Separate test author derives tests from PRD and public API. Coordinator runs candidate suite and spec-derived positive/negative controls; fresh independent reviewer validates coverage/expectations. Freeze exact inventory, hashes, source revisions and dependency/config identities only after PASS. Scaffold baseline is complete; actual test harness commands will replace planned commands before freeze.
3. Apply current main policy (93bfe64): native agents may share filesystem/checkout. Give implementer fresh sanitized context, identify tests/resources/reports not to inspect, restrict searches to production scope, and forbid running/probing/modifying tests. Prompt guidance is a workflow boundary, not guaranteed secrecy. Required subagents are available; no isolation exception or new runtime is needed.
4. Dispatch fresh implementer only after gate 2/3, with PRD, sanitized architecture/public contracts and production scope. Coordinator integrates and runs frozen checks, then requests fresh final source/spec/evidence review.
5. Complete README, overview and actual skill/prompt history. Deliver locally after all acceptance and review gates; no deployment, remote push or merge is included. Archive only after confirmed acceptance.

Commands now include actual scaffold scripts and candidate harness: `pnpm test` runs `node tests/run.mjs`, which orchestrates controls, HTTP assertions, Playwright, real storage failures and restart/schema checks. `pnpm test:controls` runs independent spec controls. `pnpm db:init` remains a public implementation deliverable. Unavailable checks are not passes. Working directory for all commands: `example/nextjs-fullstack/`.

| Criterion | Expected result / verification | Planned check | Gate |
| --- | --- | --- | --- |
| AC-01 | CRUD, edit cancel, delete confirm/cancel and filters persist through API | `pnpm test` (includes Playwright), browser UI → HTTP → real temporary SQLite | Acceptance |
| AC-02 | Exact fields/types, trimmed 1–200 code points, malformed JSON/content type rejection, literal HTML | `pnpm test`, validation and HTTP boundary assertions | Acceptance |
| AC-03 | Status/envelopes and unknown-ID errors match PRD; storage errors do not expose internals | `pnpm test`, isolated HTTP/API integration | Acceptance |
| AC-04 | Restart retains records; repeated init preserves records | `pnpm test`, separate processes sharing temporary database; `pnpm db:init` twice | Acceptance |
| AC-05 | GET retry, failed mutation retains state/input, no false success or automatic mutation retry | `pnpm test` (includes Playwright), controlled network and lost-response scenarios | Acceptance |
| AC-06 | Uncached saved list after mutation/reload; no task localStorage | `pnpm test` (includes Playwright) and direct GET assertions | Acceptance |
| AC-07 | Labels, keyboard/focus, literal text and no page overflow at 360/1280 | Browser assertions plus coordinator screenshot/focus inspection (visual appearance needs manual review) | Acceptance |
| AC-08 | Reproducible standalone setup; production build/typecheck/lint and complete tests pass | `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test` (includes Playwright) | Delivery |

Controls must demonstrate spec-correct behavior accepted and plausible incorrect rules rejected by meaningful assertions. A missing-import failure, successful collection or passing build is insufficient. Reviewer reports criterion-to-assertion coverage and control evidence before freeze. After freeze verify hashes before/after each run; any suite repair requires a complete PRD/plan revision and replacement independent validation/freeze, retaining the previous version.

## 4. Agent protocol & review

- Coordinator: artifacts/progress, integration, test execution, freeze manifests and delivery decisions.
- Fresh test author: tests, fixtures and harness only; receives PRD/public contracts/runtime conventions, no implementation solution.
- Fresh test reviewer: authors none of reviewed resources; reviews source requirements, executable controls, runner results and exact suite snapshot. Required PASS before freeze.
- Fresh implementer: production scope only, no tests, reports, assertions, history or frozen-suite execution. Receives criterion-level feedback only.
- Fresh final reviewer: source quality, spec compliance, integrated evidence and stable snapshot; required READY before delivery. Re-review any changed reviewed scope.

Execution is serial because each gate supplies the next prerequisite. No shared-artifact writers or parallel implementation are needed. Missing required subagents, independent test validation, freeze, required review or acceptance evidence blocks behavior/delivery. Shared filesystem alone does not block under the merged policy. Retain separate authorship/review, test-read guidance, all data/security rules and honest evidence.

## 5. Task handoff

See [tasks.md](tasks.md). Coverage: AC-01–AC-07 → TASK-02/03/04/05; AC-08 → TASK-01/05/06. Every behavior task depends on independently reviewed freeze and documented test-read guidance. No active criterion is deferred or dropped.

Revision history: r1 recorded the branch-local isolation blocker. User identified the already merged upstream policy fix; fetched/merged origin/main, then reviewed all plan sections for r2 before test freeze. Product intent/AC are unchanged; no frozen suite exists to invalidate.

Revision 3 (replacement freeze): reviewed all five substantive sections and metadata against PRD revision 2. Architecture/scope, public API, task mapping and retained data/security/review gates remain unchanged. V1 controls 31/31/API 5/5 PASS; browser 2/11, with observed harness assumptions about changing labels, immediate checkbox state and post-error re-enablement. Build/typecheck/lint PASS. Preserve original suite/archive/manifest/report; reopen affected test validation/acceptance tasks, hold production writes and dispatch original test author to create replacement suite. Replacement review must validate stable control targeting, response-based checkbox outcomes and explicit error/reload recovery without weakening pending locks, retained state, no-retry or persistence checks. Only fresh PASS and exact replacement freeze permit acceptance to resume; final independent source review remains required.
