# Plan — React + Vite task manager

Mode: Standard. Intent: [PRD.md](PRD.md), AC-01–AC-07. Local delivery only.

## 1. Strategy & Principles
Preserve all PRD rules; one Vietnamese task page, no API or extra features. Use official React TypeScript Vite scaffold and pnpm. Do not overwrite existing documents.

## 2. Deliverables & Architecture
Use src/App.tsx for forms, filters and status; src/App.css and src/index.css for responsive styling; src/tasks.ts for Task, title validation, ordering, seed data and validated storage. Save before committing React state. Invalid storage must remain intact until confirmed reset. Keep input on write failure. Native confirmation for delete/reset; labeled controls and visible focus.
Tests will use a separate test author and fresh reviewer. Choose the smallest compatible runner after the execution gate is resolved; Node assertions for pure rules and browser integration for UI/storage.

## 3. Ordered Roadmap & Verification
1. Official scaffold, dependency lock and baseline build/typecheck/lint.
2. Author acceptance tests separately; execute spec-derived positive/negative controls; independent review; freeze inventory/hashes.
3. Verify implementer read isolation before dispatch; implement public requirements; coordinator runs frozen tests.
4. Independent final review and local handoff with README.

| Criteria | Planned verification | Gate |
| --- | --- | --- |
| AC-01 | Fresh storage seeds three tasks; saved [] stays empty after reload | Frozen storage integration |
| AC-02 | CRUD, toggle, edit/delete cancel and confirmation in browser | Frozen UI integration |
| AC-03 | Trim, Unicode code points, boundaries and duplicate titles | Frozen domain tests |
| AC-04 | Status filters; date ordering and stable ID tie break | Frozen domain/UI tests |
| AC-05 | Persistence, corrupt JSON/schema, read/write errors, reset/retry | Frozen storage/UI tests |
| AC-06 | 360px/1280px, keyboard, visible focus, HTML as text | Browser/manual evidence |
| AC-07 | pnpm build, pnpm typecheck, pnpm lint; CRUD network inspection | Delivery |

Commands run in example/react-vite. Test command remains pending runner selection; no claim that tests exist.

## 4. Agent Protocol & Review
Coordinator owns plan/tasks/walkthrough/history and integration. Fresh test author owns separate tests; fresh reviewer validates tests/controls before freeze. Fresh implementer receives public contracts and production scope only; fresh final reviewer inspects stable implementation and evidence. Serial dependencies; no worker edits lifecycle artifacts.
Execution: authorized with scoped exception. On 2026-10-14 the user explicitly allowed instruction/write-scope isolation for this project despite shared filesystem access. Owner: user. Reason: host cannot enforce test read isolation. All other separate-author, independent-review, freeze and data safeguards remain mandatory. No host-enforced secrecy is claimed. Required independent test and final review remain pending.
Risk: medium due to persistence and potential data loss. No production/deployment/commit required.

## 5. Task Handoff
See [tasks.md](tasks.md). AC-01–AC-07 map to TASK-02–TASK-05; TASK-01 supports all criteria. PRD requirements self-check: READY. Plan/task consistency self-check: READY for coverage; execution protocol: READY under the recorded user exception.

## Public module contract
`src/tasks.ts` exports `Task {id:string,title:string,completed:boolean,createdAt:string}`, `STORAGE_KEY`, `seedTasks():Task[]`, `validateTitle(value:string):string` (trimmed title or thrown Error), `sortTasks(tasks:Task[]):Task[]` (new array, newest first then id ascending), `parseTasks(raw:string):Task[]` (throws for malformed JSON/schema, empty or duplicate IDs, invalid UTC ISO dates or invalid canonical titles), `loadTasks(storage:Pick<Storage,"getItem"|"setItem">):Task[]` (missing key seeds and saves; [] preserved), `saveTasks(storage:Pick<Storage,"setItem">,tasks:Task[]):void` (propagates write failure). App default export stays in src/App.tsx. These are public contracts agreed before test authorship, not private test expectations.

## Revision 2 — frozen harness correction, 2026-10-14
Complete document reviewed again: outcome, scope, business rules, failure expectations, architecture, roadmap, coverage and review gates unchanged. Revision reason: checkbox check/uncheck postcondition waits on an element intentionally removed by filtering, and generic success-message substring matches an error about previously stored invalid data. Replace harness interactions and success classification; do not change product behavior to satisfy erroneous checks. Source revision 1 and frozen suite preserved in test-suite-v1.tar.gz and test-freeze-v1.json. Acceptance evidence from failed browser run is invalid for delivery; revalidate/re-freeze suite and rerun all acceptance gates. Requirements and coverage consistency self-check READY for replacement authorship; implementation paused pending new freeze.
