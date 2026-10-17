# Task manager — React + Vite

[English](README.en.md) | [简体中文](README.zh-CN.md) | [Tiếng Việt](README.md)

Compass example project 1. Stack: React, TypeScript, Vite; pnpm manages project dependencies. Product requirements are in [PRD.md](dev/task-manager/PRD.md). The user accepted the local handoff on 2026-10-14; all 5/5 tasks are complete.

## Features

A standalone Vietnamese-language, single-page browser app:

- Add, edit inline, cancel edits, confirm deletion, and complete or reopen tasks.
- Three status filters; newest first; distinct empty-list and no-matching-results messages.
- Three sample tasks on first launch; `localStorage` persists edits and an empty list across reloads.
- Unicode title validation, safe text rendering, and recovery for broken or blocked storage; failed writes preserve data and form input.
- 360px/1280px layouts, input labels, visible focus, and keyboard support.

AC-01–AC-07 were verified in the [walkthrough](dev/task-manager/walkthrough.md). [Skill and prompt history](skill-history.md#actual-prompt-history) records the requests and test/review iterations. PRD and plan are frozen snapshots; current completion status is in README, tasks, and walkthrough.

## Run locally

```sh
cd example/react-vite
pnpm install
pnpm dev
```

Open the Vite URL printed in the terminal. Requires Node 20.19+ or 22.12+ per Vite guidance; implementation used Node 26.9.0 and pnpm 10.22.0.

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm preview
```

Scaffolded with the official command `pnpm create vite <target> --template react-ts --no-interactive --no-immediate` ([Vite guide](https://vite.dev/guide/)).

## Testing

Tests use Node's native TypeScript support. Node 26 was used for verification; older Node versions have not been checked with this runner.

```sh
pnpm test
pnpm test:controls
pnpm exec playwright install chromium
pnpm test:browser
```

Playwright starts a dev server at 127.0.0.1:4173; the port must be free. The test suite was authored separately, independently reviewed, and frozen in [test-freeze.json](test-freeze.json).

## Usage and limits

The first launch includes three sample tasks. Enter a title and click Add or press Enter. Edit each row with Save/Cancel; use the checkbox to change completion; choose All/Active/Completed to filter. Deleting and restoring sample data require confirmation.

Titles are trimmed, 1–200 Unicode code points, and may repeat. Data is stored under origin-specific key `compass-example-react-vite.tasks.v1`; reload preserves edits and an empty list. Other origins/ports have separate storage. Corrupt data is preserved until reset is confirmed. If storage cannot be read, writes are disabled; failed writes retain the list and form for retry.

There is no business API, backend, or secret. Only one tab is supported; data is not synchronized across devices or tabs. Reset replaces the list with sample data and requires confirmation.

## Verification results

- Domain 8/8; controls 8/8; Chromium browser 12/12.
- Build and typecheck PASS; lint exit 0 with one reviewed warning about state initialization from localStorage.
- Checked screenshots at 360px/1280px, keyboard CRUD, reload, console, and absence of business fetch/XHR.
- The v1 suite is preserved; a harness issue was fixed through full PRD/plan revision and v2 review/freeze, without changing product behavior to match incorrect tests.

Independent code and delivery review: READY, no blockers. Not deployed; Firefox/Safari were not checked. See the walkthrough for current handoff status.
