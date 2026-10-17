# OpenCode native adapter and release acceptance

Mode: light; risk: medium. User expanded the four-hook request to require real installed-host verification on Codex, Claude Code and OpenCode, then documentation, PR, release and merge to main only after all hosts pass. This supersedes the original local-only delivery constraint; preserve the original frozen core contract unchanged.

OpenCode on this machine is 2.0.32, using V2 plugins. Its documented API has prompt/tool hooks but no atomic Stop veto. A completion adapter must explicitly use bounded post-success continuation and prove it with actual native execution; an observed host limitation remains BLOCKED and prevents release under the user's condition.

## Acceptance criteria

- OC-01: A dependency-free ESM V2 plugin at `integrations/opencode/compass.js` (default `{id, setup}`) loads using a project `plugins` entry referencing the checked-out module. Use the same Python runtime at `../../hooks/compass.py` relative to that module. No global settings edits, V1 compatibility shim, installer rewrite or new package dependency.
- OC-02: Prompt admission adds the existing semantic goal guidance without dropping the user's prompt. Preserve session identity and active-feature behavior; no keyword classifier, automatic implementation or unconditional nine-skill run.
- OC-03: Map V2 `write/edit` path inputs to native Write/Edit, `patch.patchText` to apply_patch, and shell to Bash. Before-tool denial prevents actual structured frozen edits. After-tool stale context preserves result content/metadata and is visible to the model; errors are not replaced by fabricated success.
- OC-04: Observe native `session.execution.succeeded`, `event.data.sessionID`. Only sessions observed by this plugin's prompt/tool hooks may receive completion feedback. Evaluate shared Stop gate; on block enqueue one same-session continuation using its reason, retaining a per-session loop guard across that internal prompt. A new external user prompt resets the guard. Inert/successful/active/blocked gates do not enqueue work. Cleanup aborts the event subscription and disposes registrations. Report post-success semantics honestly; never claim a synchronous veto.
- OC-05: Dispatcher/schema/process errors are visible and do not fabricate passing evidence. Use argument-based child process invocation (no shell interpolation); preserve original source/fixture data. Native smoke must prove actual prompt/before/after/completion events and outcomes across all three installed hosts before publication.

Requirements: READY. Distribution for OpenCode is an explicit project-local plugin entry pointing to the checkout; copied skills/project installers remain unchanged. Four hooks remain the only product behavior. Release version will follow inspected repository tags and the actual verified change.
