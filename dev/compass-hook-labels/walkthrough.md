# Walkthrough

- Snapshot: `feat/compass-hook-status-labels`, based on `origin/main` at `6c5e694`.
- Scope: `hooks/hooks.json`, `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, and this light delivery record.
- Labels: `Compass: Intake new goal`, `Compass: Protect frozen tests`, `Compass: Check evidence freshness`, and `Compass: Verify completion`.
- User acceptance: user reported that the labels work in Codex after reloading the plugin.
- Verification: `python3 -m unittest evals.test_hooks evals.test_opencode_hooks evals.test_plugin_package -v` — 20 tests PASS; `python3 scripts/check_portability.py` — PASS; both hook JSON files parse; `git diff --check` — PASS.
- Runtime scope: this change updates labels only. OpenCode and Pi adapters remain unchanged; no new native runtime claim is made for them.
- Delivery analysis: AC-01 is covered by the four named event handlers and user-confirmed Codex reload; AC-02 uses the shared supported hook field; AC-03 leaves adapter code untouched; AC-04 keeps plugin versions aligned.
- Independent final review: READY, low risk, no findings. Reviewer inspected base `6c5e694` plus the complete working diff and this feature's light artifacts before recording the result.
- Delivery: pending PR, CI, and merge.
