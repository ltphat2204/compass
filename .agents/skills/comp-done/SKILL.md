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
- Choose available discovery tools by codebase, task scope, and user preference: CodeGraph for symbol/caller tracing; Understand Anything (UA) or Graphify for broader architecture/domain exploration and intent clarification. Reuse existing indexes/graphs, verify relevant findings against current source, and use targeted search when sufficient. RTK can reduce shell output; Ponytail reinforces simplicity. All these tools are optional; evidence-first discovery and minimal correct changes remain required.
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

For a milestone parent or child, apply [milestone completion and archive rules](../comp-engineer/references/adaptive-workflow.md). Verify child delivery plus parent integration/acceptance before archiving a parent. After a child move, update the parent link and preserve pending siblings; a completed child never implies a completed milestone.

## Workflow Steps

### Step 1: Identify Target Feature Directory

1. Use the exact feature directory and artifact root carried from the current workflow or explicit arguments (e.g. `/done example-feature` or `/done dev/example-feature`). Do not rediscover a different feature when ship already identifies the target.
2. For standalone invocation without a known target, inspect active feature directories under the resolved artifact root (excluding `_archived`). If multiple plausible targets remain, ask which to archive; never sweep unrelated folders based on checked task counts alone.
3. On resume, inspect any recorded archive destination first. If the source is absent and the destination matches the recorded feature, delivery evidence, and preserved artifact inventory, verify it and finish closeout without moving again. Missing or ambiguous artifacts are BLOCKED, not an assumed successful archive.

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

If [native hook state](../comp-engineer/references/hooks.md) selects this feature, first preserve its current `.compass/hooks.json` as a uniquely named artifact inside the feature folder without overwriting anything. After the archive move is verified, remove only that still-matching active state file; retain the archived copy as historical evidence. Do not deactivate another feature or leave a completed selector pointing to a directory that has moved.

1. Check that the source exists and the exact destination does not. If the destination already exists, stop and ask how to resolve the collision; never merge, nest, or overwrite artifacts silently.
2. Ensure the parent archive directory exists (examples below use the default root and RTK; substitute the resolved root and native commands when RTK is unavailable):
   ```bash
   rtk proxy mkdir -p dev/_archived/<YYYYMMDD>
   ```
3. Preserve artifact links when moving: update relative links to files outside the feature folder for the new location, or use an existing stable project-link convention. Do not change historical decisions or evidence. Before moving, record the source, exact destination, delivery evidence, and file inventory with content hashes in the feature's walkthrough (create a concise walkthrough if absent). Hash the other files after required link/state adjustments; verify the walkthrough's final bytes separately so it does not hash itself. This record supports recovery if the workflow stops after the move.
4. Move the feature directory into the dated archive:
   ```bash
   rtk proxy mv dev/<feature-slug> dev/_archived/<YYYYMMDD>/<feature-slug>
   ```

---

### Step 4: Verification & Summary Report

1. Verify that the source is absent and every original artifact is preserved at the destination against the recorded inventory/hashes, including additional files and the walkthrough's final bytes. Verify adjusted external and parent links and any matching hook-selector cleanup. Do not assume all four standard artifacts exist.
2. Record the verified archive path in the final report and any active parent/handoff references. Full lifecycle completion requires confirmed delivery plus verified archive for every completed spec folder in scope. A user-deferred or failed archive remains PENDING/BLOCKED; task DONE alone does not satisfy this gate.
3. Output a clean summary report:
   - **Archived Directory**: `dev/_archived/<YYYYMMDD>/<feature-slug>/`
   - **Contained Artifacts**: [Actual preserved files]
   - **Status**: Completed & Archived.
