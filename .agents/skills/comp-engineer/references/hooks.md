# Native lifecycle hooks

The JSON-native registrations for Codex and Claude discover the default
`hooks/hooks.json` and run `python3 "${CLAUDE_PLUGIN_ROOT}/hooks/compass.py"`.
Python 3.9+ and an enabled, trusted plugin are required. Codex supplies the
compatibility root variable to the hook runtime; it is not promised in Bash tools
or interactive shells. Hooks never install or modify native global settings.
OpenCode 2 and Pi use the adapters below; other hosts need their own adapters.
The public submission ZIP contains skills only: copied skills work without hooks,
but copying a skill does not install the runtime or enable native enforcement.

Locate the installed plugin root from the installed skill location, rather than
assuming the project is the plugin checkout. Confirm that root contains
`hooks/compass.py` and `hooks/hooks.json`. If they are absent, use the normal
coordinator workflow without claiming hook enforcement, or install the repository
marketplace plugin. This reference is portable and does not require a runtime link.

UserPromptSubmit provides compact semantic guidance: route a new engineering goal
or brainstorm through comp-engineer, resume ongoing work, and leave simple
explanation/status requests alone. Exploration does not authorize implementation.
It neither classifies keywords nor starts an automatic nine-stage pipeline. Intake guidance reminds the coordinator to stop for approval of current intent/plan before implementation, except under a confirmed active automation goal covering the work. This is a coordinator gate under the [approval rules](adaptive-workflow.md#approval-before-implementation); the runtime does not verify user approval or active goal status.

## OpenCode 2 adapter

Keep a Compass checkout and register its adapter directory in the project's
`opencode.json` or `opencode.jsonc`, preserving existing entries:

```json
{
  "plugins": ["/absolute/path/to/compass/integrations/opencode"]
}
```

The directory's `index.js` forwards to the shared adapter. OpenCode 2.0.32 skips
configured file paths, so do not point this entry at `compass.js`. Its runtime
resolves `hooks/compass.py` relative to the checked-out module. Install the nine
skills separately; the project installer and skills copying do not register hooks.

Prompt admission adds the same conditional intake guidance. Before/after tool
callbacks apply the shared protection and evidence checks. Completion is checked
after `session.execution.succeeded`: an invalid explicit attempt queues one
same-session continuation per external user prompt, with an internal guard to
avoid requeueing forever. This is post-success feedback, not an atomic Stop veto.
A response may remain unverified even if the state marker still says `complete`;
only current evidence establishes completion. Reloading the plugin resets its
in-memory session/continuation tracking.

## Pi adapter

Keep a Compass checkout and load `integrations/pi/compass.ts` explicitly:

```sh
pi --extension /absolute/path/to/compass/integrations/pi/compass.ts
```

It maps `before_agent_start` to intake, `tool_call` to frozen-resource checks,
`tool_result` to stale-evidence feedback, and `agent_before_settle` to the
completion gate. Pi can continue once with the gate's diagnostic; a second
invalid attempt leaves a visible warning rather than looping. This is not an
atomic stop veto. The adapter calls the shared `hooks/compass.py` dispatcher,
so Python 3.9+ and an active `.compass/hooks.json` are required for execution
safeguards. Pi must load and trust the extension, which runs with the Pi
process's operating-system permissions.

Native hooks were observed on Codex CLI 0.162.1, Claude Code 2.1.302 and OpenCode
2.0.32. Pi's extension hooks were observed on Pi CLI 1.3.0; these bounded checks
do not establish other versions, models, or desktop surfaces.

## Activate execution safeguards

The coordinator owns one active feature per project. Create project-relative
`.compass/hooks.json` explicitly; without it execution hooks are inert. Discovery
walks from the event cwd to its ancestors and stops at the nearest `.git` boundary.
For example, with existing `dev/my-feature`, `dev/my-feature/intent.md`, and
`dev/my-feature/plan.md`, this is a valid initial state:

```json
{
  "version": 1,
  "feature": "dev/my-feature",
  "status": "active",
  "behavior_change": true,
  "scope": ["src"],
  "frozen": {},
  "blockers": []
}
```

Choose narrow source files/directories. All state paths are project-relative,
inside the project, and contain no symlinks. Scope must exclude the state file
and every ancestor containing it. Missing declared source files participate in
the snapshot; directories include new and deleted files. Put evidence reports
outside scoped directories to avoid a report hashing itself.

Before implementation of behavior changes, populate `frozen` with every file in
the agreed full frozen suite revision, mapping each relative path to its lowercase
SHA256 digest. Do not freeze a convenient subset or silently replace the revision.
An empty map is valid during intake, but cannot pass behavior-change completion.
Any frozen-suite/resource change requires the complete intent/plan revision and
independent replacement validation/freeze in [strict testing](../../comp-implement/references/testing.md),
preserving prior versions and obtaining fresh evidence; a hook warning is not a waiver.

Preserve the previous feature's state alongside its walkthrough before selecting
another feature. Never reset another ongoing feature to make a gate pass. On
accepted archival, preserve a unique, non-overwriting state artifact inside the
selected feature; after verified archival remove only the still-matching active
selector. The runtime itself never archives or writes files.

## Evidence and completion

From the project or one of its subdirectories run the installed runtime using
its actual plugin-root path:

```sh
python3 "/absolute/path/to/compass/hooks/compass.py" snapshot
```

Replace the example path with the confirmed installed plugin root. This command only prints a lowercase SHA256
snapshot; it does not run checks or assert PASS. Snapshots bind scoped content,
intent/plan, frozen resources, scope/frozen configuration, and behavior_change.
Status, blockers, and evidence record updates do not change the source snapshot.

After independently running verification and review, record each under its name:

```json
{
  "status": "PASS",
  "snapshot": "<current snapshot digest>",
  "report": "dev/my-feature/verification.md",
  "report_sha256": "<SHA256 of the existing report>"
}
```

Both `verification` and `review` require their own current PASS record and
existing hash-bound report, and completion requires the feature's intent.md and
plan.md to exist. The placeholders above must be replaced with actual
digests. Source/config drift, report changes, and missing reports make evidence
effectively STALE. PostToolUse reports this without rewriting historical records.
Rerun affected checks/review and update their metadata instead of relabeling old
reports. No unresolved blockers may remain at completion.

Before claiming DONE, the coordinator must explicitly set `status` to `complete`.
Stop then checks frozen hashes and both evidence records. `active` and `blocked`
allow questions, blockers, and ordinary pauses. A failing completion attempt is
blocked once; when `stop_hook_active` is already true, a visible warning avoids
endless continuation and still forbids claiming verified completion.

## Enforcement limits

PreToolUse denies identifiable structured Edit/Write/MultiEdit, apply_patch
deletions/moves, and MCP path writes that intersect frozen resources. Relative
tool paths use the actual event cwd; parent directory targets and normalized
aliases also intersect protected children. Other edits remain allowed.

Opaque shell and MCP writes cannot reliably be predicted. Hooks do not parse shell
programs or claim to prevent these writes: actual frozen/source drift is detected
after tools and before completion. Checks execute no user-supplied commands, read
no transcripts, and modify no project files. Invalid state produces actionable
diagnostics and never establishes valid evidence. State and coordinator ownership
are a trusted workflow agreement, not a security boundary against an agent or user
who can rewrite the state or disable the plugin. Native real-model routing still
depends on the enabled host following the supplied guidance.
