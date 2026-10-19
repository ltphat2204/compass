# Coordinator-run pre-freeze controls

Working directory: repository root. Runtime implementation is absent; the initial full suite fails due to missing hook files (expected RED, not semantic validation).

Independent spec-derived controls: `/tmp/compass-hook-controls/runner.py`, authored by `/root/hook_test_author`. These intentionally implement selected public rules only; they are not the production implementation or expected-value oracle for the full suite.

Positive command: `rtk proxy env COMPASS_HOOK_RUNNER='python3 /tmp/compass-hook-controls/runner.py' python3 -m unittest evals.test_hooks.HookTests.test_protection evals.test_hooks.HookTests.test_completion_rules evals.test_hooks.HookTests.test_freeze_required_for_behavior evals.test_hooks.HookTests.test_evidence_and_reports evals.test_hooks.HookTests.test_drift_is_stale_without_mutation -v` — exit 0, five tests PASS.

Defective controls use the same runner and selected assertion with `CONTROL_DEFECT`:

- `protection`: `test_protection` — exit 1, five deny assertions fail because frozen edits/aliases/parent operations are allowed.
- `invalidation`: `test_drift_is_stale_without_mutation` — exit 1, STALE assertion fails after frozen-file drift.
- `completion`: `test_completion_rules` — exit 1, missing-evidence completion assertion fails because completion is incorrectly allowed.

All negative results were ordinary unittest assertion failures at the contract boundary, not import/setup errors. The reference accepts valid evidence and rejects report/status/snapshot/hash mismatches through the positive command. Other criteria are reviewed from the candidate suite and later production execution/manual checks; no claim of complete native-host workflow validation.

## Replacement candidate controls

The author strengthened invalid-state assertions before freeze: a diagnostic must use a visible field and identify both a problem and corrective guidance. Candidate suite SHA256: `4457b92ca6a70315184ab7abdd2bfa92f3e5e42fb7f28bc6080894110a06ebc6`; updated independent control SHA256: `a54b584d30d6eda3caad526aa6f39a525c2245996e2660689ad39ba14febddff`.

Coordinator executed the same reference runner with ten selected tests: snapshot_configuration, snapshot_scope_and_inventory, patch_protection, invalid_state_and_boundary, post_tool_evidence_invalidation, protection, completion_rules, freeze_required_for_behavior, evidence_and_reports, drift_is_stale_without_mutation. Command uses `python3 -m unittest evals.test_hooks.HookTests.test_<name> ... -v` under the same COMPASS_HOOK_RUNNER override. Result: exit 0; all ten PASS.

Additional defective controls, each exit 1 at a meaningful assertion:

| CONTROL_DEFECT | Selected test | Observed rejection |
|---|---|---|
| configuration | snapshot_configuration | Changing scope incorrectly left the snapshot unchanged |
| inventory | snapshot_scope_and_inventory | Adding a scoped file incorrectly left the snapshot unchanged |
| unsafe | invalid_state_and_boundary | STALE-only output failed the visible invalid-state/actionable diagnostic assertion |
| patch | patch_protection | Protected patch deletion was incorrectly allowed |
| report | post_tool_evidence_invalidation | Changed verification report incorrectly emitted no STALE warning |

## Semantic intake manual control

This is static conditional guidance, not a runtime intent classifier. The coordinator inspected a spec-derived correct example: “For a new engineering goal or brainstorm, use comp-engineer to select the next useful skill; resume existing work; answer simple explanations/status directly; exploration alone does not authorize implementation; do not run all nine stages automatically.” It satisfies all five agreed conditions.

The coordinator rejected the plausible defective example: “Always invoke all nine skills and implement immediately for every prompt, including status questions.” It violates conditional routing, exclusions, authorization and adaptive stage choice. Word-presence assertions alone would not establish correctness. Final validation must inspect actual generated intake text against the same checklist; no subprocess test can prove a model follows the guidance.
