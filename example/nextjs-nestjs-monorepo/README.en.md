# Task manager — Next.js and NestJS

[English](README.en.md) | [简体中文](README.zh-CN.md) | [Tiếng Việt](README.md)

Standalone app in a pnpm workspace: `apps/web` (Next.js App Router), `apps/api` (NestJS + Node built-in SQLite), and `packages/contracts` (shared TypeScript types). The browser calls the API directly; Next.js does not access the database.

## Run locally

Requires Node >=24.15 and pnpm 10.22.0. From this directory:

```sh
pnpm install --frozen-lockfile
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Open http://localhost:3000; API is at http://localhost:3001/api/tasks. Ctrl+C or SIGTERM stops both apps. The default database `apps/api/data/tasks.sqlite` is created empty and is not seeded or overwritten on restart.

## Configuration

- API `.env`: `PORT` defaults to 3001; `WEB_ORIGIN` must be the exact web origin; `DATABASE_PATH` is required and relative paths are based at `apps/api`. The API exits with a clear error if configuration is missing or the database cannot be opened. Process environment variables take precedence over the file.
- Web `.env.local`: `NEXT_PUBLIC_API_URL` must be the API's HTTP(S) origin, without `/api` or a trailing slash. It is public and embedded by Next.js at build time; changing it requires a rebuild (or a dev restart).
- Only the API knows the SQLite path. Never put secrets in `NEXT_PUBLIC_*` variables.

## Root commands

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

Build compiles contracts before the apps. Tests use the independent acceptance suite in `tests/v3`. Install Chromium once before testing:

```sh
pnpm --dir tests/v3 install --frozen-lockfile
pnpm --dir tests/v3 exec playwright install chromium
```

Run production locally after building, in two terminals:

```sh
pnpm --filter @example/api start
pnpm --filter @example/web start
```

For development, run `pnpm --filter @example/api dev` and `pnpm --filter @example/web dev` after `pnpm --filter @example/contracts build`. `PORT` customizes an individual app's port. Root `pnpm dev` accepts `API_PORT` and `WEB_PORT`; other configuration is inherited. Example without editing env files:

```sh
API_PORT=4101 WEB_PORT=4100 WEB_ORIGIN=http://localhost:4100 NEXT_PUBLIC_API_URL=http://localhost:4101 DATABASE_PATH=/tmp/tasks-demo.sqlite pnpm dev
```

## Behavior and API

The Vietnamese UI supports add, edit, cancel, completion, filtering, and confirmed deletion. Titles are trimmed, 1–200 Unicode code points, with inner spaces preserved. Content is rendered as text. IDs and creation times are immutable; results sort by `createdAt DESC, id DESC`. SQLite commits before a response; GET has no cache. Concurrent updates use last-write-wins.

| Request | Response |
| --- | --- |
| GET `/api/tasks` | 200 `{ tasks: Task[] }` |
| POST `/api/tasks` with `{ title }` | 201 `{ task: Task }` |
| PATCH `/api/tasks/:id` with `title` and/or `completed` | 200 `{ task: Task }` |
| DELETE `/api/tasks/:id` | 204, no body |

POST/PATCH require `Content-Type: application/json`. Invalid shapes/extra fields/malformed JSON return 400; missing IDs 404; wrong content type 415; storage errors 500. Errors use `{ error: { code, message } }` with internal details removed. CORS permits only the exact `WEB_ORIGIN`, including preflight; this is not authentication.

If loading fails, restart the API and choose **Retry**. If a write response is lost, keep the draft and use **Retry** to reload before the next mutation; do not resend automatically because the earlier write may have succeeded. Check the reloaded list before adding again to avoid duplicates.

Limitations: local single-user app; no authentication, deployment, ORM, or synchronization with other examples.

## Verification

Local results from 2026-10-15 are recorded in the [walkthrough](dev/task-manager/walkthrough.md): HTTP/API 9/9; Chromium 6/6; reference checks 9/9 and 15 incorrect variants detected; UI controls 15/15. Clean lockfile install, dependency-ordered build, typecheck, lint, and rejection of an invalid contract type passed. Missing configuration, CORS, real SQLite errors, persistence across restart, lost-response recovery, and UI at 360px/1280px with keyboard were checked. Terminal process-group Ctrl+C/SIGTERM stops both apps and releases ports. Independent review READY; 6/6 tasks DONE. Safari/Firefox, remote CI, and production deployment were not checked.

## Compass and history

- [PRD/intent](dev/task-manager/PRD.md), [plan](dev/task-manager/plan.md), [tasks](dev/task-manager/tasks.md), and [walkthrough](dev/task-manager/walkthrough.md).
- [Actual skill/prompt history](skill-history.md).
- [Freeze v3](dev/task-manager/freeze-v3.json) and [acceptance-suite guide](tests/v3/README.md). Root `pnpm test` selects v3; v1/v2 and their source revisions are preserved as history.

The PRD/plan are frozen source snapshots; handoff status is in tasks and walkthrough. Artifacts remain under `dev/task-manager/` pending confirmation before `comp-done` archives them.
