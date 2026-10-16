# Plan — Project 3 task manager

- Mode: Standard; risk: medium (public API, persistent local data).
- Revision: v2, 2026-10-15. Source: [PRD v2](PRD.md), AC-01–09.
- Baseline: `fb16e66`, branch `example`; local delivery only.

## 1. Strategy & Principles

Complete the Vietnamese task manager through browser → NestJS → SQLite, preserving every PRD rule. Generate framework scaffolds through official pinned CLIs; pnpm alone owns the workspace. No auth, ORM, orchestration framework, deployment, or dependency on other examples. Reuse conventions, not runtime imports, from prior examples.

## 2. Deliverables & Architecture

- `apps/web`: Next.js 16.4.1 App Router, TypeScript, plain CSS, direct browser fetch to configured NestJS origin. Completion uses a labeled checkbox (public UI decision before freeze). No CRUD Route Handlers or database access.
- `apps/api`: NestJS 12.1.3 modules/controller/service, runtime boundary validation, consistent error filter, built-in `node:sqlite`, repeatable schema and fail-fast configuration. TypeScript 5.9.3 supported by both builds; Node >=24.15, observed 26.9.0.
- `packages/contracts`: framework-free exported Task, create/update payloads and response/error types, `workspace:*` dependencies from both apps. Compile declarations first with TypeScript.
- Root manifests, pnpm lockfile, `.gitignore`, scripts, app `.env.example`, README. Pin actual dependency resolutions; scaffold Next via create-next-app 16.4.1 and Nest via CLI 12.0.8; record exact calls and justified scaffold deletions.
- Public process/config contracts are in PRD. Dev must supervise both children and stop them on SIGINT/SIGTERM. API owns database; no seed or user DB in checks.
- `tests/v2/`: independently authored HTTP acceptance, browser journey tests and safe controls, Node test runner + Playwright 1.64.1. Tests own a separate private package/lock to keep execution dependencies immutable while implementation dependencies evolve. Controls use spec-derived reference behavior, never generated implementation as oracle.

## 3. Ordered Roadmap & Verification

1. Confirm requirements and write plan/tasks → criterion coverage and readiness.
2. Separate fresh test author → coordinator executes runner and positive/negative controls → fresh independent test reviewer → exact inventory/hashes and source identities frozen.
3. Fresh implementer receives PRD plus sanitized architecture only, no tests/history/reports. Scaffold/config/contracts/API/web/README form one cohesive write scope. Coordinator runs frozen checks; fixes use criterion-level feedback only.
4. Verify root install/build/typecheck/lint, API persistence/errors/CORS, browser behavior and process shutdown. Independent task/final review on stable snapshot; reconcile artifacts and deliver locally.

| Criterion | Expected result | Check (new unless manual) | Command / cwd | Gate |
|---|---|---|---|---|
| AC-01 | Root install resolves both apps/contracts | clean frozen-lockfile install | `pnpm install --frozen-lockfile` / project root, clean temporary copy | delivery |
| AC-02 | Browser CRUD persists through API | HTTP acceptance + browser journey + restart | `pnpm test` / root; private suite runners | acceptance |
| AC-03 | Runtime validation and error contract | HTTP boundary/Unicode/rejection/error tests | private Node runner / tests/v2 | acceptance |
| AC-04 | Shared types consumed by both apps | source/dependency inspection + typecheck, negative type control | `pnpm typecheck` / root + temporary incompatible caller | delivery |
| AC-05 | Exact allowed CORS origin/preflight | HTTP CORS cases | private Node runner / tests/v2 | acceptance |
| AC-06 | Config, outage, database failures and retry | API startup failures + browser recovery | private Node/Playwright runners | acceptance |
| AC-07 | Build dependency order; both dev processes exit | root build + real dev SIGINT/port checks | `pnpm build`, `pnpm dev` / root | delivery |
| AC-08 | CRUD/filter/cancel/delete/accessibility/mobile | Chromium journeys at 360/1280; manual visual/focus review | private Playwright runner | acceptance |
| AC-09 | Durable, repeatable schema; internal error secrecy | real temp SQLite + restart/fault tests | private Node runner | acceptance |

## 4. Agent/Human Protocol & Review

Coordinator owns lifecycle artifacts, history, integration, runs and DONE decisions. Test author owns `tests/v1/**` before freeze only; fresh reviewer writes no production/tests. Implementation owner writes production/manifests/README only after freeze, must not inspect `tests/**`, dev plan/tasks/walkthrough, skill history, test reports or other example tests. Shared filesystem is an instruction boundary, not guaranteed secrecy. No inherited full conversation for workers. No worker may delegate/commit/push/deploy. Scope is serial; build/generated resources are shared.

Before freeze require independent source→assertion mapping, actual runner/control evidence and PASS. Hash every test/fixture/config/lock/control file and PRD/plan. Any frozen-suite change requires complete PRD/plan revision, preserving old suite and manifest, new author/review/freeze and invalidated affected evidence. Coordinator verifies inventory/hashes before/after runs and delivery. Review public-contract/data prerequisites before accepting tasks and aggregate before ship. Independent review BLOCKER prevents delivery.

## 5. Task Handoff

See [tasks](tasks.md). Coverage: AC-01/04/07 → TASK-03/05; AC-02/03/05/06/09 → TASK-02/03/05; AC-08 → TASK-02/04/05; all → TASK-01/06. Artifact consistency READY for test authoring; implementation pending validated FROZEN suite.

## Complete plan revision v2

Reviewed all five sections and full AC verification matrix against PRD v2: strategy, app/contract architecture, versions/ownership/data decisions, ordered dependencies, risk/independent reviews and handoff stay unchanged. Only active suite version becomes v2, with asynchronous response-confirmed checkbox interaction instead of an immediate optimistic state requirement. No implementation workaround is authorized to satisfy the old harness.

Preserve v1 sources/suite/freeze and failed evidence; reopen TASK-02 and invalidate affected browser/integrated/final review evidence. Fresh test author receives complete PRD/plan v2 and public interaction rules, creates new suite without reading production internals. Coordinator runs old/new controls and an isolated correct delayed checkbox/wrong unpersisted-transition control. Independent reviewer validates revised sources/actual assertions/controls; a new exact inventory/source freeze is mandatory before resuming acceptance. Test-read restrictions remain in force for implementation workers. Consistency gate: READY for revised test authoring; production edits paused, acceptance pending new freeze.
