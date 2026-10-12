---
name: comp-done
description: Archive completed SDD feature folders into a dated archive after confirmed delivery or accepted task completion, preserving artifacts without overwriting existing work.
---

# Compass Done & Archive Skill (`comp-done`)

Use the current host's native skill invocation and exposed tools; bare `comp-*` names identify capabilities, not a fixed command syntax. Honor applicable host/repository instructions (including `AGENTS.md` or `CLAUDE.md`) and permissions; missing delegation never waives mandatory review.

This skill archives completed Spec-Driven Development working directories from `dev/{feature-slug}/` into a dated archive directory under `dev/_archived/YYYYMMDD/{feature-slug}/` to keep the active `dev/` workspace clean and uncluttered.

---

## Decisions, Modes & Existing Work

- Match the requested action: a standalone analysis, review, or readiness assessment is read-only. Report findings without entering implementation/shipping, repairing artifacts, or logging to walkthrough unless those writes were requested. Mandatory logging applies when actually executing an authorized stage, not when assessing it.
- Follow higher-priority platform instructions and explicit user authorization. Within the project, user-agreed outcomes define intent; mandatory repository/constitution rules constrain the solution; plans/tasks implement that intent; code is evidence of current behavior, not permission to change requirements. Resolve harmless stale details from evidence. For material intent/rule conflicts, identify the conflict and ask the authorized owner; record any approved exception, scope, owner, and rationale. Never silently weaken security/data safeguards or mandatory gates.
- Choose **standard** for substantial or risky work, **light** for small bounded work, and **spike** for an explicitly exploratory task. Record the choice; the user can override document size, but required safety and verification still apply. Light artifacts may combine sections and omit empty phases. A spike keeps `intent.md` plus `walkthrough.md`, with its learning plan/checklist embedded in intent; production implementation uses a new or revised standard/light plan after the learning result is accepted.
- On rerun, read existing artifacts and evidence first. Preserve user edits, criterion/task IDs, completed work, decisions, and walkthrough history. Update only affected sections; append IDs for new work. Changed behavior reopens affected tasks with a reason and invalidates their checks/review. Removed work is marked `SUPERSEDED` with a reason, not silently deleted or counted DONE. Recompute progress from active tasks; do not reset it to zero.

---

## Project Adaptation

Keep the Compass lifecycle and artifact handoffs; adapt implementation to repository evidence.

- Use the user's instructions, repository guidance, existing code, manifests, and CI to establish architecture, relevant paths, verification commands, and delivery conventions. Do not infer a stack from these templates.
- Use `dev/{feature-slug}/` by default; honor an established or user-selected artifact root and carry it consistently through all stages, including archiving.
- Prefer CodeGraph when an existing index and tool are available; otherwise use targeted search and source inspection. RTK and Ponytail are optional tools; evidence-first discovery and the smallest correct change remain required without them.
- Read existing specs where they live. Missing tools, specs, or checks are not reasons to invent scaffolding; record the fallback, limitation, or applicable alternative.

---

## Archive Directory Structure

```
dev/
├── _archived/
│   └── 20260913/                     # Format: YYYYMMDD (digits only)
│       └── example-feature/          # Moved completed feature folder
│           ├── intent.md
│           ├── plan.md
│           ├── tasks.md
│           └── walkthrough.md
└── <active-feature-folder>/          # Ongoing active features
```

---

## Workflow Steps

### Step 1: Identify Target Feature Directory

1. Detect the active feature directory under `dev/` (excluding `_archived`).
2. If arguments are provided (e.g. `/done example-feature` or `/done dev/example-feature`), target that specific folder.
3. If multiple active feature folders exist in `dev/` and none was specified:
   - List the active folders and ask the user which one to archive.

---

### Step 2: Confirm Completion & Compute Date Stamp (`YYYYMMDD`)

- Confirm merged delivery or accepted task/local completion with current applicable analysis, verification, and review gates satisfied. A completed spike requires its bounded learning result and accepted handoff, not production tests. Keep unfinished or blocked work active.
- Resolve the actual artifact root from the earlier stages; `dev/` below is the default.
- Use the user's timezone for the archive date when available.

1. Determine the current date formatted as continuous digits: `YYYYMMDD` (e.g., `20260913`).
2. Construct the destination path:
   ```
   dev/_archived/<YYYYMMDD>/<feature-slug>/
   ```

---

### Step 3: Execute Archive Move

1. Check that the source exists and the exact destination does not. If the destination already exists, stop and ask how to resolve the collision; never merge, nest, or overwrite artifacts silently.
2. Ensure the parent archive directory exists (examples below use the default root and RTK; substitute the resolved root and native commands when RTK is unavailable):
   ```bash
   rtk proxy mkdir -p dev/_archived/<YYYYMMDD>
   ```
3. Preserve artifact links when moving: update relative links to files outside the feature folder for the new location, or use an existing stable project-link convention. Do not change historical decisions or evidence.
4. Move the feature directory into the dated archive:
   ```bash
   rtk proxy mv dev/<feature-slug> dev/_archived/<YYYYMMDD>/<feature-slug>
   ```

---

### Step 4: Verification & Summary Report

1. Verify that the source is absent and every original artifact is preserved at the destination. Report only artifacts actually present, including any additional files; do not assume all four standard artifacts exist.
2. Output a clean summary report:
   - **Archived Directory**: `dev/_archived/<YYYYMMDD>/<feature-slug>/`
   - **Contained Artifacts**: [Actual preserved files]
   - **Status**: Completed & Archived.
