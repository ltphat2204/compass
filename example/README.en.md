# Compass hands-on examples

[English](README.en.md) | [简体中文](README.zh-CN.md) | [Tiếng Việt](README.md)

These three projects use the same **task management** problem, with increasing complexity for exercising Compass skills. All applications have been implemented and checked locally; evidence and skill-call history are kept in each project.

| Level | Project / guide | PRD | Stack | Goal |
| --- | --- | --- | --- | --- |
| 1 — Basic | [react-vite](react-vite/README.md) | [Requirements](react-vite/dev/task-manager/PRD.md) | React, Vite, TypeScript | Standalone UI without an API. |
| 2 — Intermediate | [nextjs-fullstack](nextjs-fullstack/README.md) | [Requirements](nextjs-fullstack/dev/_archived/20261015/task-manager/PRD.md) | Next.js, TypeScript | Full-stack app in one project. |
| 3 — Advanced | [nextjs-nestjs-monorepo](nextjs-nestjs-monorepo/README.md) | [Requirements](nextjs-nestjs-monorepo/dev/task-manager/PRD.md) | pnpm workspace, Next.js, NestJS, TypeScript | Separate frontend and backend in a monorepo. |

Install dependencies from each project directory; the Compass repository has no shared run command for all three. See each project README for prerequisites, configuration, and test commands. README, tasks, and walkthroughs record delivery status; frozen PRD/plan documents remain historical snapshots.

## 1. React + Vite: UI without an API

- List, add, edit, delete, and complete tasks.
- Filter by status; use sample data and persist changes in `localStorage`.
- Responsive layout, empty-list state, and required-title validation.
- Acceptance: browser actions work, data survives reload, and no API requests are made.

This level focuses on clarifying UI requirements, managing state, and verifying client behavior.

**Confirmed 2026-10-14:** the Vietnamese-language app completed all 5/5 tasks and met AC-01–AC-07. It was scaffolded with the official Vite command; CRUD, three filters, persistence, and client-side storage recovery were verified. Domain 8/8, controls 8/8, Chromium 12/12; build and typecheck passed, lint exited 0 with one reviewed warning. Independent review was READY. No production deployment or Safari/Firefox check was performed.

See the [run guide](react-vite/README.md), [verification evidence](react-vite/dev/task-manager/walkthrough.md), and [actual skill/prompt history](react-vite/skill-history.md#actual-prompt-history).

## 2. Next.js: full stack

- Keep project 1's task actions and move data to SQLite.
- Use Next.js App Router and Route Handlers for CRUD.
- Validate data on the server; show loading and save-error states in the UI.
- Acceptance: UI requests pass through the server, data survives restart, and invalid data is rejected.

This level adds the UI → server → database flow, error handling, and integration testing. Authentication and authorization are out of scope.

**Local result 2026-10-15:** verified with Next.js 16.4.1, App Router/Route Handlers, TypeScript, and Node's integrated SQLite. API 5/5, controls 31/31, Chromium 14/14 (11 app flows plus 3 harness controls); real storage failure, repeatable schema initialization, and persistence across restart passed. Lockfile install, build, typecheck, and lint passed. Independent handoff review was READY; 6/6 tasks DONE. No production deployment or Safari/Firefox check was performed.

See [run instructions](nextjs-fullstack/README.md), [evidence](nextjs-fullstack/dev/_archived/20261015/task-manager/walkthrough.md), and [skill/prompt history](nextjs-fullstack/skill-history.md).

## 3. pnpm workspace: Next.js + NestJS

- Organize Next.js in `apps/web` and NestJS in `apps/api` within a pnpm workspace.
- NestJS owns the API and SQLite database; Next.js uses the API for task management.
- Share request/response types through `packages/contracts`, with runtime validation on the backend.
- Configure the API address, CORS, and commands at the workspace root.
- Acceptance: install from root, run both apps, complete CRUD through the API, and build the workspace.

This level adds application boundaries, API contracts, internal dependencies, and multi-service integration checks.

**Local result 2026-10-15:** verified with Next.js 16.4.1, NestJS 12.1.3, and Node's integrated SQLite. API 9/9, Chromium 6/6; reference tests 9/9 and all 15 incorrect variants detected; UI controls 15/15. Clean lockfile install, dependency-ordered build, typecheck, lint, and rejection of an invalid contract type passed. Both apps stop on terminal process-group SIGINT/SIGTERM and release ports. UI checked at 360px/1280px, with keyboard navigation and missing configuration. No production deployment or Safari/Firefox check was performed.

See [run instructions](nextjs-nestjs-monorepo/README.md), [verification evidence](nextjs-nestjs-monorepo/dev/task-manager/walkthrough.md), and [skill/prompt history](nextjs-nestjs-monorepo/skill-history.md).

## Skill use and history

Use `comp-engineer` for the SDD lifecycle or call stages individually: `comp-intent` → `comp-plan` → `comp-tasks` → `comp-analyze` → `comp-implement` → `comp-review` → `comp-ship`. Use `comp-done` after confirmed completion when artifacts should be archived. Follow each skill's gates, including test validation, review/freeze, and context separation before behavioral implementation.

Each project has its own `skill-history.md`, an append-only record of actual skill calls, including failed or blocked attempts. Do not record planned calls as completed. Link to intent, plan, tasks, and verification evidence where available. All three projects completed planning, test authoring/review/freeze, and implementation; see the project walkthroughs for observed results.
