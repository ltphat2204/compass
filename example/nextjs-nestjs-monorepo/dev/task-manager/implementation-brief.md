# Sanitized implementation brief

Role: implementation worker; coordinator owns lifecycle and verification. Read this brief and PRD only, not sibling artifacts/history or tests.

## Outcome and scope

Implement PRD AC-01–09 as an independent Vietnamese task manager in this project. Production-only scope: root manifests/lock/ignore/scripts/README, `apps/web/**`, `apps/api/**`, `packages/contracts/**`, app `.env.example`. No sibling example imports. Do not write or inspect `tests/**`, other examples' tests, dev plan/tasks/walkthrough/reports/manifests or skill-history. Scoped production searches only. Do not run `pnpm test` or any test command; coordinator runs those separately. No delegation, commit, push, merge, deploy.

## Architecture and selected versions

Node >=24.15 (observed26.9.0), pnpm10.22.0. Next16.4.1, React latest registry19.3.1, Nest12.1.3, CLI12.0.8, TS5.9.3. Verify installed APIs/types. Generate web with `pnpm dlx create-next-app@16.4.1 apps/web` with explicit TypeScript/App Router/src/plain CSS/ESLint/pnpm/skip-install/disable-git options and Nest via `pnpm dlx @nestjs/cli@12.0.8 new api --directory apps/api --skip-git --skip-install --skip-tests --package-manager pnpm --no-observe`; inspect CLI help before actual generation. Remove sample assets/tests not needed, preserve normal framework config conventions. Pin actual dependency versions and lock. If generator creates AGENTS.md, obey it or omit via documented generator flag. Return exact commands and deletions/reasons.

Use Next App Router, accessible forms, named Vietnamese actions, labeled checkbox completion, plain CSS with visible keyboard focus, 360/1280px responsiveness. No remote font build dependency. Browser fetches directly to API origin; no duplicate Next CRUD handlers or database imports. Both apps consume framework-free exported type contracts via workspace:* and contracts declarations compile first. Nest owns runtime validation and built-in Node SQLite (no ORM/native driver).

## Public operation contract

- Workspace package names: `@example/web`, `@example/api`, `@example/contracts`.
- Root commands: pnpm dev (supervise both; SIGINT/SIGTERM stops both descendants), build (contracts before consumers), typecheck, lint, test.
- Root test command is operational only: `pnpm --dir tests/v1 install --frozen-lockfile && pnpm --dir tests/v1 test`. Do not inspect or execute that path.
- Filter app start commands used by consumers: `pnpm --filter @example/api start`, `pnpm --filter @example/web start`; accept PORT from env. No mandatory build inside API start, root build creates artifacts.
- API env: PORT default3001, WEB_ORIGIN and DATABASE_PATH required. Web NEXT_PUBLIC_API_URL required: HTTP(S) API origin, no /api suffix. Web default3000. App .env.example must make local copy/run straightforward; API loads .env via standard Node/config mechanism, web loads .env.local. Explicit process env must win.
- API fail fast and clearly on missing config/unusable database. Web missing base URL visibly reports configuration error without same-origin fallback. API startup defaults no seed; never overwrite existing DB.

## Public behavior emphasis

All rules are in PRD. Trim/count Unicode code points before save, preserve internal spaces, 1–200 inclusive; strict runtime shapes and allowed fields. Mutable title/completed only, immutable id/time, sorted newest + fixed ID tie direction. Exact statuses and consistent sanitized error envelope, malformed JSON400, unsupported content type415, missing mutation404, real storage failure500. Exact configured CORS origin including preflights.

UI shows loading, distinct empty list/filter messages, GET error/retry, disables pending mutation, retains drafts on error, updates success only after response. Lost mutation response may mean write committed: require explicit GET reload/reconciliation before allowing another write; never automatic mutation retries. Keyboard, safe literal title rendering, cancel edit and confirm deletion required. Check all public callers/contracts/config paths.

## Verification and return

Allowed non-test checks: root install, build, typecheck, lint, scoped source inspection. Coordinator owns independent acceptance and will send only criterion-level observed-vs-required behavior on failure. Return files, key decisions, generator commands, checks actually run/results, needed scope expansions and limitations. Stop/report before reading prohibited resources. Frozen-test gate status is supplied opaquely in dispatch; never alter test resources or bypass checks.
