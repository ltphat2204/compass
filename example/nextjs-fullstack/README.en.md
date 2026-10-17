# Example 2: Full-stack task manager

[English](README.en.md) | [简体中文](README.zh-CN.md) | [Tiếng Việt](README.md)

Standalone Vietnamese-language app using Next.js App Router, TypeScript, Route Handlers, and SQLite. Supports add/edit/delete/confirm/cancel, completion, and three filters. Data goes through a same-origin HTTP API and is stored on the server; tasks are not stored in localStorage.

## Run locally

Verified environment: Node 26.9.0, pnpm 10.22.0, Next.js 16.4.1, React 19.3.0. SQLite uses built-in `node:sqlite`; no ORM or separate database service is required.

```sh
cd example/nextjs-fullstack
pnpm install --frozen-lockfile
pnpm db:init
pnpm dev --hostname 127.0.0.1
```

Open [the local app](http://localhost:3000). The default database is `data/tasks.sqlite`, initially empty. Schema initialization is repeatable and does not erase data. The API also creates the schema when missing. There is no automatic seed; data survives restarts while the database file is retained.

To use another database path, export the variable in the same shell **before both initialization and app startup**:

```sh
export DATABASE_PATH="$PWD/data/custom.sqlite"
pnpm db:init
pnpm dev --hostname 127.0.0.1
```

Relative paths are resolved from the project directory. [.env.example](.env.example) documents the variable; `db:init` runs directly with Node and does not read Next.js `.env` files. Export the same value for both commands. Do not commit the database or journal/WAL files; they are ignored. Back up the database after stopping the app.

Production build locally:

```sh
pnpm build
pnpm start --hostname 127.0.0.1
```

## Behavior and API

Titles are trimmed, 1–200 Unicode code points, duplicates are allowed, and inner spaces are preserved. The server creates IDs/timestamps, which do not change on edits. Results are newest first, with descending ID as a tie-breaker. Titles are rendered as text.

| API | Success |
| --- | --- |
| `GET /api/tasks` | `200 { tasks: Task[] }` |
| `POST /api/tasks` with `{ title }` | `201 { task: Task }` |
| `PATCH /api/tasks/:id` with `title` and/or `completed` | `200 { task: Task }` |
| `DELETE /api/tasks/:id` | `204`, no body |

Malformed JSON/body/fields/types return 400, unsupported content type 415, missing ID 404, and storage failures a generic 500. Errors use `{ error: { code, message } }`.

The UI updates only after a successful save. On failure it keeps the draft and existing data and offers a list reload. Mutations are not retried automatically because a lost response can follow a successful server write. Reload to reconcile before trying again. Tasks leave a filter when their status no longer matches. Empty list and empty filter results have distinct messages; forms have labels, keyboard focus support, and a small-screen layout.

This is a local single-user example without authentication, authorization, or production deployment.

## Verification

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test
```

`pnpm test` runs independent controls, HTTP/API checks, Chromium UI, real SQLite failure, and restart/schema reinitialization checks. The runner uses its own temporary database and port 3102, stops its processes, and does not delete `data/`. Build before testing because the runner uses a production server. If the port is busy: `TEST_PORT=3112 pnpm test`. Controls only: `pnpm test:controls`.

Local result 2026-10-15: lockfile install, build, typecheck, lint PASS; HTTP/API 5/5, controls 31/31, Chromium 14/14. Real SQLite failure, repeat schema initialization, and persistence across restart passed. The user accepted the local handoff. Independent review READY; 6/6 tasks DONE. No Safari/Firefox, remote CI, or production deployment. See [final review](dev/_archived/20261015/task-manager/final-review.md) and [walkthrough](dev/_archived/20261015/task-manager/walkthrough.md).

## Compass and history

- [PRD/intent](dev/_archived/20261015/task-manager/PRD.md), [plan](dev/_archived/20261015/task-manager/plan.md), [tasks](dev/_archived/20261015/task-manager/tasks.md), [walkthrough](dev/_archived/20261015/task-manager/walkthrough.md).
- [Actual skill/prompt history](skill-history.md), including test fixes and review iterations.
- Current freeze v2 and preserved v1 artifacts are linked from the Vietnamese README. The archived specifications remain historical snapshots.
