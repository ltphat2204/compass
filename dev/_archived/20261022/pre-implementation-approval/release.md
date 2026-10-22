# Release 0.4.3

Authorization: user requested shipping and a new release. Both plugin manifests bumped from 0.4.2 to 0.4.3.

Delivery analysis: READY. AC-01–05 map to TASK-01 entry/routing updates and TASK-02 verification; approved intent/plan unchanged.

Independent final review: release_review, authored none of the reviewed files, READY with no blockers. Reviewed current workflow, hook and test diff, plus intent/plan. Runtime remains guidance only.

Checks:
- `python3 -m unittest evals.test_hooks evals.test_opencode_hooks evals.test_plugin_package`: 20 tests PASS.
- `python3 scripts/check_portability.py`: PASS.
- Both `claude plugin validate --strict` manifest checks: PASS. Plugin validator emitted directory warnings about missing raster icon and a local untracked .DS_Store; .DS_Store is not tracked or shipped. No public-directory submission claimed.
- Fresh temporary Codex and Claude project installs: all nine skill entries and every resource match canonical bytes.
- `git diff --check`: PASS.

Limits: no live model/host simulation; guidance assertion tests are not proof of model compliance. GitHub marketplace release only; no OpenAI public-directory publication.

Archived original feature inventory remains unchanged; this file is additional shipping evidence.
