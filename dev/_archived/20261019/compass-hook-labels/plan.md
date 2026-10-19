# Plan

1. Add one distinct `statusMessage` to each handler in `hooks/hooks.json`; retain the shared dispatcher and event behavior.
2. Keep OpenCode and Pi adapters unchanged because their plugin/extension APIs do not provide equivalent per-hook labels.
3. Bump the Codex and Claude plugin manifests together to `0.4.1`.
4. Run hook, OpenCode adapter, package, and portability checks; review the diff and deliver through a PR.
