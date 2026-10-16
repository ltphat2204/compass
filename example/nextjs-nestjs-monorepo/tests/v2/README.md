# Private acceptance suite v2

Source of expected behavior: `dev/task-manager/PRD.md` v2 and `plan.md` v2. This is a test-only package. It neither imports application internals nor uses another example as an oracle. Do not expose it, its controls, execution output, or this mapping to the implementation worker. Coordinator owns review, freeze, hashes, and delivery evidence.

## Execution

Node >=24.15, pnpm 10.22.0, Chromium from Playwright 1.64.1 are required. From this directory:

```sh
rtk proxy pnpm install --frozen-lockfile
rtk proxy pnpm exec playwright install chromium
rtk proxy pnpm controls
rtk proxy pnpm controls:browser
rtk proxy pnpm test
```

The full runner builds the project from its root with `NEXT_PUBLIC_API_URL=http://127.0.0.1:43001`, then executes HTTP tests and production browser journeys. It forces reference mode off. Root `pnpm test` may delegate opaquely to `pnpm --dir tests/v2 install --frozen-lockfile && pnpm --dir tests/v2 test`. Private install is necessary because tests intentionally own a separate workspace/lock.

Focused commands: `rtk proxy pnpm test:http`, `rtk proxy pnpm test:browser`. HTTP uses available ephemeral ports. Browser uses 43000/43001, configurable using `BROWSER_WEB_PORT`/`BROWSER_API_PORT`; rebuild with the corresponding API origin before a focused browser run. Ports must be unused; harness refuses occupied ports, starts owned process groups, waits up to 120s for actual readiness, terminates descendants, and removes only its own temporary SQLite directory. Tests never read a user database. Expected invalid startup exits are bounded at 30s.

`ACCEPTANCE_REFERENCE=1 pnpm test:http` is a control-only invocation; never use it as production evidence. Reference SQLite table names are private fixture details and have no relation to production schema.

## Criterion and rule mapping

| Source | Executable evidence | Boundary / failure detection |
| --- | --- | --- |
| AC-02, AC-08 primary journey | `browser.spec.mjs`, both 360px and 1280px journeys | real browser → API CRUD; cancel edit and delete; checkbox state/filter movement; explicit confirmation; safe HTML-like text; persisted read after reload; keyboard Enter; page overflow |
| AC-03 title/domain rules | `http.test.mjs` validation groups | trim before bounds, preserved inner spaces, duplicate ID distinction, empty/whitespace, one-code-point lower boundary and 200/201 supplementary characters, combining sequences counted as code points |
| AC-03 runtime request contract | HTTP invalid-shape group | POST/PATCH unknown keys, empty PATCH, null, array, primitive, wrong field types, malformed JSON, unsupported POST/PATCH content type; rejected updates leave data unchanged |
| AC-02, AC-03 identity and ordering | HTTP CRUD group | new false flag, UUID-independent string identity, UTC ISO time, newest first, immutable id/time across updates, boolean toggle, sequential last write, delete empty body/404 repeat, missing PATCH 404 |
| AC-05 | HTTP CORS group | JSON POST/PATCH/DELETE preflight grants configured origin; real GET and OPTIONS deny unrelated and suffix-spoofed origins |
| AC-06, AC-09 | HTTP startup/storage groups | empty required settings, corrupt file, directory DB path; SQLite write lock produces sanitized 500 and no insertion; fail-fast diagnostics |
| AC-09 | HTTP persistence group; browser restart group | edit/deletion survive restart; initialization repeatable; concurrent creations unique; ID ties deterministic if encountered; live GET reflects mutations |
| AC-06 | browser GET failure/retry and API stop/restart | network error shows explicit retry, actual API restart reads durable task |
| AC-06, AC-08 mutation safety | browser failed create/edit/delete | pending submits disabled; failed write retains typed draft and stored title; lost response reconciles committed data by GET before next submission; failed deletion retains task; no client auto retry during observation window |
| AC-01, AC-04, AC-07 | coordinator delivery checks below | actual clean install, dependencies, type incompatibility, build order, dev shutdown cannot be replaced by fixture behavior |

Public response errors assert nonempty string `code`/`message`, documented statuses, no leaked DB path, SQLite diagnostic, stack trace, or node_modules path. No undisclosed code names, module filenames, tables, or exact translated messages are assumed. Browser controls use accessible roles, public Vietnamese actions and visible task titles, accepting button/radio/select filters and native/custom confirmation dialogs. Task row discovery walks ancestors of the visible title rather than requiring a particular component or CSS class.

## Safe controls and readiness

`reference.mjs` is a standalone Node HTTP/SQLite reference confined to this package. It derives behavior from the PRD and is never used as an application's expected-value oracle. `controls.mjs` first requires the correct reference to pass all seven HTTP groups, then changes one plausible rule per fresh isolated server and requires rejection by an actual assertion. Wrong rules: minimum length two instead of one; omit trim; UTF-16 length; ignore unknown keys; accept wrong boolean type; change creation time on edit; oldest first; wipe on restart; wildcard CORS; leak database path on failure. A spawn/import/startup error does not qualify: mutation failures must contain AssertionError/ERR_ASSERTION.

`controls:browser` uses isolated static DOM states, no generated application, to prove shared visibility, input preservation, pending-lock, loading, retry, cancellation, confirmation and safe literal-text assertions accept correct states and reject plausible wrong states. Shared pure assertions additionally accept a single write attempt and POST → GET → POST recovery, reject an automatic second attempt and POST → POST, and reject changed/deleted snapshots after cancellation. Shared browser assertions reject missing delete confirmation and actual execution of an injected onerror handler. These exact helpers are used by the production journey. It validates assertions rather than claiming the real UI passes. No full reference UI is implemented. Production browser behavior remains a coordinator-owned acceptance gate.

Before independent review, author ran correct HTTP 7/7 plus ten rejected mutants; Chromium control checks passed. Coordinator must repeat commands against the exact reviewed snapshot. Syntax/collection and controls alone do not establish application correctness. This suite is **not frozen by its author**.

## Coordinator delivery/manual procedures

These are mandatory evidence, not implied passes:

1. **AC-01:** copy project source into a clean temporary directory excluding node_modules/build/test output; run `pnpm install --frozen-lockfile` from root once, then root typecheck/build. Verify both app workspace dependencies resolve contracts. Clean only the owned copy.
2. **AC-04 / architecture:** inspect manifests/imports to verify both apps consume the shared types; contracts have no framework/driver/secrets; web has no SQLite/Nest imports or duplicate CRUD API. In an owned temporary copy add an intentionally incompatible assignment to an actual shared task type imported by an app. Root typecheck must fail at that assignment; remove the temporary copy. Check actual .env.example files and README explain public/server settings, root and individual app commands. No code from sibling examples may be imported.
3. **AC-07:** run root build after removing generated output in the owned temporary copy, verify contracts build before consumers. Run root lint/typecheck. Start root dev with explicit temporary DATABASE_PATH and unused API/web ports; wait for both HTTP surfaces; send SIGINT to the dev parent; verify both ports can be rebound and descendants have stopped. Repeat SIGTERM if the supervisor contract warrants it. Do not stop unrelated processes.
4. **AC-06 config:** in an owned clean build with `NEXT_PUBLIC_API_URL` missing/empty, start web and inspect the page or startup diagnostic. It must clearly report configuration failure, issue no same-origin CRUD request, and not silently use a default origin. Repeat with valid setting and verify direct requests target NestJS. Use browser Network/Sources inspection to check client payloads do not contain DATABASE_PATH/server secrets.
5. **AC-08 visual/accessibility:** at 360px and 1280px inspect empty-list message, create tasks, choose a filter with zero matching results and verify its message is distinct; no horizontal page scroll. Throttle the initial GET to observe loading before results/error. Keyboard-only traverse every input/filter/edit/save/cancel/complete/delete/confirm/retry action; focus must visibly track traversal and labels/errors must be associated with inputs or announced as status. Automation covers Enter submission and names, but does not certify all visual focus states.
6. **AC-06 lost response:** the automated browser scenario lets POST reach API, drops its response, verifies draft retention and no claimed success/auto retry, then reloads GET to observe the committed task before another successful submission. The suite also challenges any enabled submit before voluntary reload: another POST may occur only after an intervening GET. Inspect the recovery instructions visible to users.
7. **AC-09 tiebreak:** normal HTTP tests check lexical ID ordering for any naturally occurring same-timestamp group and repeat ordering after restart. If the clock never collides, coordinator should document that tie branch was not dynamically exercised; confirm explicit deterministic ID ordering in code review. PRD does not prescribe ascending vs descending ID direction.

Limitations: this author has not inspected or executed production; coordinator must execute revised acceptance; no claims about framework compilation, root dev supervision, visual focus or type coupling are made by reference/control passes. Browser no-retry checks observe 1.2 seconds; inspect the fetch policy as well. Manual outcomes must be recorded by coordinator before delivery.

## Complete revision v2: asynchronous completion

PRD/plan v2 re-reviewed the complete behavior contract without changing business rules. The previous suite remains preserved under tests/v1. This version replaces only Playwright's immediate-state check/uncheck interaction with a normal checkbox click followed by shared saved-outcome verification. Both completion directions must remove the task from its previous filter and be observed as the exact persisted boolean through a fresh public HTTP GET. All prior title, identity, filter, persistence, error, safety and control assertions are retained.

Six additional isolated control cases exercise that same helper in both directions: a controlled checkbox restores its previous state after click and resolves a delayed save, then the saved state and filter transition satisfy the assertion. The unpersisted control removes the item without saving and is rejected by the boolean assertion; the no-transition control saves but retains the item in its old filter and is rejected by the visibility/count assertion. Control storage is an independent browser fixture, never generated application state. Production evidence reads only real HTTP GET responses.

Commands from tests/v2 are unchanged: `rtk proxy pnpm controls`, `rtk proxy pnpm controls:browser`, and coordinator-only `rtk proxy pnpm test`. The v2 candidate still requires fresh independent review and a new coordinator freeze; v1 hashes/manifests must not be updated.

Author v2 verification: frozen-lockfile dependency install succeeded; HTTP reference 7/7 with all ten wrong-rule controls rejected; Chromium controls 15/15 including all six asynchronous completion controls; production browser collection six tests. No production files were read or executed.
