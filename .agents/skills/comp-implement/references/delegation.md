# Delegated Implementation

Read when coordinating subagent implementation or executing an assigned task packet. These rules apply only to authorized implementation; a readiness assessment stays read-only.

## Roles and selection

- **Coordinator** owns task selection, assignments, integration, `tasks.md`, `walkthrough.md`, progress, and completion decisions. Worker success is a report to inspect, not automatic DONE.
- **Test author** receives a fresh minimal spec/contract packet and owns tests before implementation. Coordinator reviews/freezes its returned suite; the author does not receive proposed implementation or change frozen tests. For behavior work, [strict testing](testing.md) overrides the ordinary shared-workspace, inline, and light-mode defaults below.
- **Implementer** owns only the packet's write scope and reports changes/checks/blockers. It does not rewrite Compass artifacts, spawn more agents, commit, push, merge, or deploy unless the coordinator explicitly assigns and is authorized for that action. Reading this skill as an implementer does not activate the entire lifecycle.
- **Reviewer** gets fresh context and a stable snapshot. It is read-only and reviews compliance plus change quality; it cannot approve its own implementation.
- For standard work, delegate bounded tasks or cohesive task groups when subagents are available and delegation is authorized. Light work usually stays with the coordinator; delegate only if a separate boundary is useful. Spikes may delegate distinct learning questions within the agreed resource bound. Do not create code boundaries just to permit parallelism.
- If delegation is unavailable, disallowed, or wasteful for tightly coupled work, execute inline/serially and record the reason. Required independent review still remains required. Obey actual concurrency limits, counting the coordinator; do not prescribe a fixed worker count.

## Before dispatch

Before freezing behavior tests, dispatch a fresh independent test reviewer with complete agreed intent/plan, public contracts, actual suite/resources, source/snapshot identities and coordinator-run controls. Require the [independent validation gate](testing.md#independent-test-validation--required-before-freeze); author reports and self-review cannot earn PASS. Native reviewer tools remain read-only; coordinator executes controls and supplies evidence. Dispatch implementers only after the exact PASS snapshot is frozen and sanitized context prepared.

1. Check that dependencies have current accepted implementation and required review. Decompose tightly coupled work serially or assign it to one implementer.
2. Inspect the complete expected write sets: implementation, tests, fixtures, config, exports, generated outputs, and shared resources touched by commands. Tasks are parallel-safe only if write sets/resources are disjoint and their contracts are settled. Separate files alone do not prove independence.
3. Record owner, write scope, dependencies, and serial/parallel eligibility in the existing tracker. One owner per file/resource at a time. The coordinator reserves Compass artifacts and unrelated user changes.
4. Build a minimal packet from evidence. Prefer fresh worker context with selected excerpts/paths rather than full conversation history. Include applicable instructions, constraints, and established interfaces; do not omit information needed for correctness.

```text
Role: implementer; return results to coordinator
Task IDs / criterion references / goal:
Workspace and baseline revision or relevant file hashes:
Dependencies and settled contracts:
Read context: agreed intent, sanitized plan, repository instructions, production contracts/callers; no tests/history/reports
Write scope: exact files/resources; explicitly excluded shared artifacts
Deliverable and relevant edge/failure behavior:
Agreed public examples/expected results (no private executable cases):
Test-read guidance: paths to avoid, scoped production searches, sanitized context; shared filesystems are allowed
Frozen-test gate: opaque version/status only, no test contents
Verification: permitted non-test checks and working directory; coordinator runs frozen suite privately
Required task review and stop/report conditions:
```

## During execution

For behavior work, dispatch a test author first with only criteria/domain examples, public interfaces/input contracts, applicable instructions, runner conventions and sanitized fixture patterns. Its packet includes private test write scope, criterion-to-test deliverables, pre-freeze validation, and stop conditions; no proposed implementation/source internals. After review/freeze, verify access restrictions before dispatching an implementer with the packet above in a fresh context. Shared checkouts and inherited histories are unsuitable for this strict boundary. Only coordinator/test reviewers see test evidence; return criterion-level feedback without hidden inputs or assertions. Any frozen-suite change invokes the complete intent/plan revision procedure in [strict testing](testing.md), not a worker repair loop.

- Shared workspaces expose edits immediately. Workers stay inside their write scope and do not revert others' changes. If another file/resource is needed, report the smallest scope expansion to the coordinator before editing it; the coordinator resolves ownership and updates the packet.
- Use existing isolated checkouts only when needed for overlapping work or conflicting commands. Do not create worktrees routinely. The coordinator integrates returned changes deliberately, preserving validation and error handling.
- Return task IDs, actual files/diff, decisions, checks actually run and observed results, limitations, and blockers. Failed/skipped checks are not passes. Worker reports are not approval to ship.
- When work stalls, obtain the worker's current changes and blocker; stop or reassign it before transferring ownership. Never run a second writer over an active first writer's files. Preserve completed work and history across retries.

## Integration, review, and completion

1. Wait for assigned work and inspect the actual diff against write scopes, current criteria, and repository constraints. For shared checkouts this is reconciliation, not blind cherry-picking; for isolated checkouts verify the merged result.
2. The coordinator runs the narrow meaningful integration/acceptance checks for the combined change. Do not substitute two isolated worker test reports for integrated verification.
3. For security/data/public-contract/prerequisite tasks, obtain required task review before unlocking dependents or marking DONE. Other tasks may be reviewed as a cohesive milestone. Reviewers inspect both dimensions on a stable snapshot; pause mutations of their reviewed files/dependencies. Disjoint work outside that scope may continue.
4. Give findings to the current owner for in-scope fixes, then run affected checks and scoped re-review. Changes invalidate affected earlier approvals. Stop unchanged fix loops without a new safe correction.
5. Only the coordinator logs attempts/results, updates statuses/progress, and marks DONE after checks and required review. Record agent ownership, reviewed snapshot, reviewer independence, integration results, and unresolved limitations in the existing walkthrough.
6. Before Ship, request a fresh independent final reviewer when available and authorized. A prior task reviewer can review the aggregate if it authored none of the reviewed changes; supply the current combined diff and criteria. Follow any stricter human/security review requirement.
