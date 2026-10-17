# Four lifecycle hooks

Mode: standard. Risk: medium (shared plugin integration and completion checks).

The user authorized implementation of Goal intake, Protect frozen tests, Invalidate stale evidence, and Completion gate. Deliver locally; no installation into user configuration, publication, deployment, or automatic archiving.

## Acceptance criteria

- AC-01: Both native plugin routes discover four command hooks using Python 3.9+ stdlib, with portable quoted plugin paths. Copied/project-installed skills remain usable without hooks; do not silently change host settings.
- AC-02: UserPromptSubmit supplies compact semantic routing guidance to comp-engineer for a new engineering goal or brainstorm, resumes existing work, excludes simple explanations/status questions, and preserves exploration versus implementation authorization. No keyword classifier or automatic nine-stage execution.
- AC-03: An explicitly active project `.compass/hooks.json` identifies one feature, narrow source scope, frozen file hashes, and evidence. PreToolUse denies structured edits/writes and apply_patch changes/deletions/moves touching frozen files, including parent directory targets and normalized aliases. Other edits remain allowed. Opaque shell/MCP writes are not claimed to be prevented; actual frozen drift is detected after tools and before completion.
- AC-04: PostToolUse compares content snapshots, including added/deleted files in scoped directories, intent/plan, frozen resources and scope/freeze configuration. A mismatched verification/review record is effectively STALE; report this without rewriting historical evidence or project files. Changes outside the scope do not invalidate evidence. Report changes/missing reports also invalidate their evidence.
- AC-05: Stop checks a coordinator's explicit `status: complete` attempt. Require matching frozen hashes (nonempty for behavior changes), current PASS verification and review records with existing hash-bound reports, and no unresolved blockers. Permit active/blocked tasks to pause for questions or blockers. Avoid endless continuation using stop_hook_active. Require the coordinator to attempt complete before claiming DONE; do not infer arbitrary-language completion from prose.
- AC-06: Without active state, guard/invalidation/completion are inert. Invalid state/path escapes/symlinks produce actionable visible diagnostics, not silent PASS. State discovery respects a repository boundary. Hooks execute no user-supplied commands, read no transcripts, and modify no user files.
- AC-07: Document activation, state/snapshot contract, coordinator ownership, full frozen-suite revision, supported hosts, runtime/trust requirements and enforcement limitations; link skill integration. Preserve the existing skills-only public submission ZIP, explicitly documenting that runtime hooks are available through repository marketplace plugins rather than claiming portal support.

Requirements: READY. Decisions above translate the agreed four hooks into deterministic checks; state is opt-in for execution safeguards, while enabled/trusted plugin intake is automatic. One active feature per project is the initial scope.
