# Intent: Adaptive Compass workflow

Mode: light. Scope: skill instructions, release metadata, multilingual documentation and evaluation evidence; no application runtime or installer logic changes.
Requirements gate: READY from explicit user requests and repository evidence.

- AC-01: Route quick starts, fixes, uncertain ideas, resumed work and planning-only requests to the next useful authorized action; preserve strict behavior testing gates.
- AC-02: Decompose milestones into independently verifiable child intents, preserve dependency/history links and require parent integration evidence before completion.
- AC-03: Explain the motivation: newcomers understand what they build; experienced developers delegate investigation, recommendations and execution to AI. Explicitly require tests for behavior-changing hotfixes.
- AC-04: Ship via PR, merge after checks, close upstream issue #2491 as superseded and request fresh skills.sh indexing for the merged source. User explicitly authorized these external actions.

Repository context: canonical skills in `.agents/skills/`; Python stdlib installer checks in `evals/test_install.py`; Claude plugin metadata in `.claude-plugin/plugin.json`; GitHub default branch `main`. Preserve unrelated untracked `example/`.
Constraints: no production deployment, new runner/dependency, isolation bypass, or claim that upstream indexing/audits have completed without evidence.
