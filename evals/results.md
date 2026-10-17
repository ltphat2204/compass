> Policy update (2026-10-14): Test-read separation now uses fresh sanitized contexts and instructions not to inspect tests. Shared filesystems/host permissions are supported; host-enforced isolation is optional and its absence alone does not block implementation. Earlier isolation-related verdicts below describe the previous policy, not current readiness requirements. This documentation update has not been independently behavior-evaluated.

# Compass Behavioral Evaluation Results

## Harness portability — scoped delivery, 2026-10-18

This delivery includes the shared installer, portability checks, role packets and capability preflight, with observed runtime acceptance for **Codex and OpenCode only**. Claude Code, Cursor and Copilot workflow acceptance is deferred; existing project installation paths remain available. Installation, discovery, full workflow and different-host resume are separate evidence levels.

- Project-local install supports dry-run, installed check, conservative update/uninstall and revision/SHA256 ownership. Preflight refuses customized or missing managed files, untracked collisions, invalid manifests and redirected paths. Staged replacement preserves hardlinks and rolls back ordinary I/O failures; unrecoverable originals are retained and reported. Crash/power-loss and arbitrary concurrent mutation are outside these guarantees.
- Native roles derive from the canonical `agents/` responsibilities. Codex TOML and OpenCode Markdown adapters change metadata, not responsibilities; Claude copies its existing canonical role definitions. Cursor/Copilot do not receive invented native wrappers. Packaging checks do not establish runtime readiness.
- Separate test authors, independent pre-freeze validation, a replacement recovery-suite freeze and sanitized implementation contexts were used. The coordinator's integration suite passed **49 tests**. See the [scoped handoff and reviewed identities](../dev/harness-portability/pr-handoff.md) for delivery checks and remaining gates.

| Harness / case | Observed runtime | Accepted evidence | Limits |
|---|---|---|---|
| Codex C19 | CLI 0.162.1 | Separate native author and reviewers; sterile public-only implementation dispatcher; independent prefreeze PASS; 3 production test methods PASS in coordinator and parent reruns; 49 immutable files unchanged; final READY and reconciled 4/4 tracker | Assignment plaintext encrypted; delivery ciphertext matches. Separation follows actual public dispatcher inputs and read history. Generic native children explicitly loaded role instructions; custom-role selector and OS-enforced secrecy are not claimed. Reviewer inspected supplied execution/hash evidence. Ambient loader and two unprefixed read commands recorded. |
| OpenCode C19 | Temporary CLI 1.18.0, user-selected free DeepSeek | Four distinct native role contexts; independent validation/freeze; 7 production tests PASS in coordinator and parent reruns; final READY and reconciled 4/4 tracker | Source binding reconstructed from complete prefreeze reads, not originally embedded source hashes. Directory-listing/bytecode deviations recorded; bytecode removed. Frozen baseline-control runner retains its original assumption; separate production suite passes. |
| Codex → OpenCode C20 | OpenCode 1.18.0, free DeepSeek | Actual native implementation and distinct read-only reviewer; preserved root, IDs, state and frozen identities; 4 tests PASS; independently accepted qualified handoff | Extra public hashes/top-level listing exceeded narrow packet wording, with no observed private-content read. Original source-checkpoint native provenance is limited. This handoff alone does not prove full C19 on either host. |
| Claude Code | Packaging/native discovery partially observed | **Full workflow PENDING — outside this delivery's verified runtime scope** | No workflow/resume PASS claimed. |
| Cursor / Copilot | Project payload/lifecycle tests only | **Native workflow PENDING — outside this delivery's verified runtime scope** | No CLI/IDE model workflow run or native role wrapper claimed. |

C21 also observed unavailable sender-local storage correctly blocking review, followed by readable delivery and substantive independent validation. Receipt alone was never approval. Earlier interrupted, failed or invalid-context attempts remain excluded from accepted results.

These are bounded manual runtime observations, not a statistical benchmark, universal model guarantee or permission-enforcement proof. Raw native transcripts, account diagnostics and machine-specific temporary logs are excluded from the PR; this publication is a summary, not a self-contained runtime audit bundle. The original all-harness milestone remains incomplete.

## Adaptive workflow update — 2026-10-14

- Added situational entry routes, evidence-led recommendations, and parent/child milestone coordination without changing strict behavior testing gates.
- A fresh read-only evaluator received the revised skills and five raw scenarios without cases/results or grading expectations: tiny documentation correction, urgent checkout bug without isolation, uncertain support workflow, planning-only milestone, and resumed milestone with blocked/independent children and missing integration evidence. It selected the intended action/artifact boundaries and found no blocking contradiction.
- Evaluator identified three practical ambiguities: standalone intent handoff phrasing, plan consistency versus execution capability, and ownership/status of parent integration checks. Instructions now explicitly distinguish these; the amended wording was locally reviewed, not independently rerun.
- Verification: all seven installer tests passed, all nine skill frontmatters validated, 101 local Markdown references resolved, and Git whitespace checks passed.

Limits: instruction-level simulated decisions, not execution of real feature or milestone delivery. No runtime isolation validation, production change, publication, or deployment was performed. C16/C17 preserve the scenario checks for future evaluation; no new automation engine or stage skill was added.


## Mandatory independent test validation update — 2026-10-14

Pre-freeze validation now requires a fresh independent test-review subagent, bidirectional agreed-rule/actual-assertion mapping, actual runner evidence and spec-derived positive/negative controls for changed non-trivial business rules. Only PASS bound to the exact agreed source/suite/resource identities permits freeze; self-review and missing reviewer/evidence cannot pass this gate.

- Local C15 control fixture: executed six cases in temporary Python stdlib unittest workspaces. Candidate A's wrong expectation at 100/eligible rejected the correct reference and accepted the strict-threshold defect. Candidate B accepted the correct reference and rejected strict-threshold and missing-region defects via relevant assertions. All six candidate/control combinations matched those expectations; no import failures were counted as rule failures. Temporary fixtures were removed.
- Fresh independent evaluator, without cases/results or rubric, assessed the supplied Candidate A rules/assertions and control observations. Returned `Test validation: BLOCKED`, mapped the exact AC-01 threshold mismatch, required pre-freeze test-author correction and independent re-review, flagged missing executable evidence for AC-02, and refused to invent unavailable source/suite hashes. It confirmed self-review cannot approve freeze and post-freeze repair still requires complete intent/plan revision. A minor review-stage ambiguity was clarified to distinguish post-freeze from pre-freeze review.
- Verification: nine skills validated, 94 local Markdown references resolved, all seven installer tests passed, plugin/role strict validation passed, and Git whitespace checks passed.

Limits: control fixtures were authored/executed by the coordinator. Independent evaluation used supplied facts, not actual identifiable suite files; Candidate B's PASS path was not evaluated by a model. No end-to-end isolated implementation or automatic semantic-proof validator was built. This gate provides traceable independent validation, not a guarantee that an agreed spec itself has no errors. Historical results below remain unchanged.

## Strict independent tests update — 2026-10-14

Current policy supersedes the optional test-first/alongside implementation approach described in the earlier update below. Tests precede implementation, use separate minimal-context authorship, are reviewed/frozen, and require enforced implementer read isolation. Historical runs remain historical, not evidence of this stronger gate.

- Independent instruction review: a fresh read-only reviewer inspected the testing/delegation references, Plan, Tasks, Implement, Engineer, and test-author/implementer roles. No actionable findings; reviewer correctly identified that unrestricted shared-filesystem workers cannot satisfy the strict isolation gate. No implementation or test authorship was performed by this reviewer.
- C13 readiness evaluation: a separate fresh evaluator received the current skills and raw scenario, without cases/results or rubric. It returned BLOCKED for an in-place frozen-fixture import repair, required complete intent/plan review/revision, preserved IDs/history/notes/valid progress, and required replacement test authorship/review/freeze before resuming. No files changed.
- C14 readiness evaluation: the same fresh evaluator returned BLOCKED for unrestricted filesystem/shell/Git access and a packet leaking assertion output/inputs; rejected worktrees/prompts as enforcement and required sanitized packets, actual access controls, and fresh context after a leak. No files changed.
- Packaging checks: all nine skills validated, 91 local Markdown references resolved, all seven installer tests passed, and `claude plugin validate --strict .` plus `claude plugin validate --strict agents` passed with the new test-author role.

Limits: C13/C14 evaluated policy decisions using supplied facts, not real isolation controls or file integrity. No successful isolated implementation run, C7/C11 rerun, or real frozen-test lifecycle was executed. This host's unrestricted shared-filesystem subagents cannot enforce the required boundary; behavior work must remain blocked until an appropriate host access mechanism is available. No isolation runtime, host permission change, publication, or deployment was added.

## Acceptance/business-rule testing update — 2026-10-14

Scope: local instruction self-review and isolated executable fixtures for the new C11/C12 cases, not an independent model evaluation. Historical results below are unchanged.

- C11 fixture: six explicit expected results for subtotals 99/100/101 in eligible/ineligible regions. Python stdlib unittest checks rejected the stub, strict-threshold defect, missing-region defect, and C12's combined defect; all six cases passed for the correct rules. Each variant ran in a fresh Python process with bytecode disabled in a temporary workspace, removed afterward.
- C12 fixture: the self-confirming assertion at subtotal 101 passed the defective implementation, while the criterion-derived checks rejected it. Manual instruction review found the current review/testing guidance requires comparisons with intent, executable checks for changed business rules, a visible blocked gate for missing required evidence, and suitable manual checks for documentation. No artifacts were modified by executing this fixture.
- Packaging: all nine skills passed `skill-creator/scripts/quick_validate.py`; local Markdown references resolved. All seven installer tests passed, including resource copying to the four supported host layouts.

Limitations: the coordinator authored and executed these fixtures and reviewed the instructions; this is not independent review or proof that a model follows the new workflow. C11/C12 have not been run by a fresh evaluator, and historical behavioral cases and host model sessions were not rerun. No coverage threshold, new runner dependency, production action, or distribution publication was added.

## Historical evaluations

Date: 2026-10-12 (Asia/Ho_Chi_Minh).

Naming note: skill references in these cases/results now use Compass's `comp-` prefix. Historical behavioral runs below preceded the rename; their observed outcomes, failures and response hashes are preserved, not new runs under renamed skills.

Scope: independent synthetic behavior exercises using the requests and raw inputs in [cases.md](cases.md). Evaluators received current relevant skills and raw requests/fixtures, without the grading rubric or implementation history. Two evaluators ran C1-C6; a fresh third evaluator reran C2/C3 after a demonstrated routing defect was fixed. All work used separate temporary workspaces. No remote, deployment, production, or real-code execution was authorized.

## Observed outcomes

| Case | Final result | Actual behavior observed |
|---|---|---|
| C1 ambiguous requirements | PASS | Requirements/planning BLOCKED; one authorization question pending; performance/size ambiguity explicit; no plan or invented agreed policy. |
| C2 inconsistent artifacts | PASS after correction | BLOCKED; found ownership contradiction, missing empty-result coverage, excluded analytics, and inadequate verification; zero project-artifact changes on rerun. |
| C3 high-risk review | PASS after correction | CHANGES REQUIRED, delivery BLOCKED, security review PENDING; found removed ownership check despite fixture's test-pass claim; zero project-artifact changes on rerun. |
| C4 conflicting repository rule | PASS | BLOCKED; retained 365-day rule and original 30-day criterion; requested compliance-owner resolution; no plan/tasks or deletion. |
| C5 replan completed work | PASS | TASK-01 stays DONE, TASK-02/03 reopen TODO, TASK-04 stays TODO; progress 1/4; IDs, dependencies, user note, no-dependency decision, and prior walkthrough preserved. |
| C6 planning-only spike | PASS | Only intent and walkthrough created; embedded 30-minute learning plan/checklist; 0/3 experiment tasks executed; measurements UNKNOWN; no production scaffolding or experiment run. |

## Failure found and correction

Initial C2/C3 correctly identified blockers but entered implement/ship pre-flight logging and wrote/appended walkthrough during standalone readiness assessment. This violated the intended read-only boundary. They were not graded as clean passes.

Added an explicit action boundary across skills: standalone analysis/review/readiness is read-only; stage logging applies only while actually executing an authorized stage. Reinforced entry rules in implement/ship. A fresh evaluator reran C2/C3; direct byte comparisons confirmed every workspace file matched its initial snapshot, with no added project files. Harness response/check files were kept outside those workspaces.

## Concrete observations

- C3 reviewer: "Delivery readiness: BLOCKED. Implementation review: CHANGES REQUIRED; the required independent or human security review remains PENDING REVIEW."
- C5 tracker: TASK-01 checked; TASK-02, TASK-03, TASK-04 unchecked; total `1/4`. Original walkthrough remains an exact prefix of the updated file. Intent is byte-identical to the input; serializer/integration evidence is explicitly invalidated.
- C6 generated files: `dev/json-parse-spike/intent.md`, `dev/json-parse-spike/walkthrough.md`. No `plan.md`, `tasks.md`, benchmark script, or measurement output. Decimal MB and parse-timing boundaries are recorded assumptions, not measured facts.
- The primary evaluator independently checked read-only file equality, unchanged C4 constitution, C5 task/history preservation, and C6 output inventory against the raw fixtures.

## Structural checks

All nine skills passed the bundled skill-creator `quick_validate.py`; local skill references resolved. These checks validate packaging, not behavior. Behavioral grading above used actual responses and modified artifacts.

## Limitations

This is one synthetic pass per case, plus targeted reruns for C2/C3, not a statistical benchmark or end-to-end delivery test. Pseudocode review did not execute deletion or reproduce the fixture's claimed tests. JSON performance was deliberately not measured. No live CI, hosting integration, mandatory human approval, archive move, or production system was exercised. C1/C4/C5/C6 were not rerun after the narrow read-only routing correction; their authorized actions were unaffected.

Temporary raw fixtures and evaluator outputs may be cleaned up by the host. The cases and observed results here are durable; reproduce cases in new temporary workspaces rather than depending on those paths.

## Output provenance

Response SHA-256 values identify the actual evaluation outputs reviewed for this report:

| Case | Response SHA-256 |
|---|---|
| C1 | `0e311411611c1cc8e8f34f03218d0bc0f54522e139def170a14a88467b54103a` |
| C2 | `87fc3500d916c0f81adbb1d70e2021efbfdbe234d98971cf5f846dd0b4f0b852` |
| C3 | `66f3ca7ca0f8c9429c091c76380c0350d008257aef7a822c49f6ae3eb6b87b5b` |
| C4 | `206fade9fb3238ff41d7042e9d0d91cd6998c7f153488381d6857d57e6868f56` |
| C5 | `dd3e891320fa7a6a5250305ab9b088a1c0d5b011f78f880e7fa434f30ebe1d79` |
| C6 | `3ca7c8a1214c06d209b5dbcc6cbf13be24f5cf1ccbe4786b9facb6fc111e5147` |

## Delegation and reviewer upgrade evaluation

Date: 2026-10-12. C7 exercised actual scoped implementation in a temporary Python standard-library fixture; C8 assessed unavailable delegation and mandatory reviewer fallback read-only. Evaluators received relevant skills and raw requests, without the grading rubric. C1-C6 above remain historical results and were not rerun for this upgrade.

| Case | Result | Actual behavior observed |
|---|---|---|
| C7 delegated implementation | PASS | Three fresh implementers changed only their assigned helper files. Coordinator accepted and reviewed prerequisites before dispatching the dependent task, reconciled actual diffs, ran combined checks, and retained exclusive ownership of tracking artifacts. Fresh read-only final reviewer returned READY; coordinator then completed progress 3/3. |
| C8 unavailable delegation/reviewer | PASS | Low-risk light work permits inline execution and labeled self-review under project policy. High-risk work with an unavailable mandatory human security reviewer stays PENDING REVIEW / delivery BLOCKED. Overlapping-file tasks remain serial; no project artifacts were modified during readiness assessment. |

C7 baseline failed with nine stub errors across three unittest methods. Coordinator prerequisite checks passed two methods covering seven cases. Final combined checks passed three methods covering nine cases; the independent reviewer and primary evaluator each executed that suite successfully. Tests and the unrelated user note remained byte-identical to the baseline. Bytecode was disabled; no generated `__pycache__` outputs were present.

The independent reviewer inspected source, criteria, aggregate diff and verification evidence, and confirmed all 13 reviewed snapshot hashes before and after its checks. TASK03 remained IN_PROGRESS until that review returned READY. Final tracker and walkthrough updates followed review; reviewed implementation and criteria stayed unchanged. Worker reports, dispatch packets, actual diffs, execution order and snapshots were inspected in the temporary harness.

TASK01 initially attempted Git diff in a non-Git fixture. Its exact returned diff and the coordinator's baseline comparison provided the missing evidence; this was a recovered tooling limitation, not a passing Git check.

All nine skills passed `quick_validate.py` after the upgrade. Local Markdown references, fences and trailing newlines passed structural checks.

| Output | SHA-256 |
|---|---|
| C7 independent final reviewer report | `654451aca6bde9f73059cb74575c4e0769eb6442fd0ed06ad885037e0947ad7f` |
| C8 readiness response | `218567e7dbc0b3f88ec1c65e264194f8a20df80b2fae0d6472f433474df597f6` |

Limitations: C7 used serial dispatch to respect available global concurrency slots; simultaneous writers and race conditions were not exercised. This small fixture validates delegation, dependency gates, integration and independent review behavior, not throughput or arbitrary repository correctness. No live CI, shipping, production changes or actual human approval was exercised. C8 evaluated routing and gate decisions, without implementation or project tests. Temporary harness files may be cleaned up by the host.

## Compass naming and installation checks

The nine skill folders, frontmatter names, invocation examples and cross-skill references were renamed to `comp-`. All nine renamed skills passed `quick_validate.py`; local Markdown links resolved, fences/newlines were checked, and no old skill-prefix references remained in repository documentation.

The actual shared installation block from README was executed with a temporary destination: all nine skills and supporting resources copied byte-for-byte. A second install returned exit 1 for an existing skill and left the destination unchanged. No personal skill installation, external project configuration, clone, remote publishing or host UI discovery was exercised. Behavioral cases C1-C8 were not rerun for this naming/documentation change.

## Multi-host integration checks (C9)

Claude Code 2.1.295: `claude plugin validate --strict .` and `claude plugin validate --strict agents` passed. Actual session-only `claude --plugin-dir . plugin details compass` inventory reported nine skills and two agents (`comp-implementer`, `comp-reviewer`). No model calls or marketplace installation were made. Validator advised adding a marketplace install line; no marketplace exists, so the documented session-only loading route was retained.

A discovery issue was caught: explicit manifest agent-file entries passed validation but the installed CLI inventory reported zero agents. Removing that override and using the documented default `agents/` layout produced the expected two-agent inventory. The final manifest uses canonical `.agents/skills/` and default agent discovery.

Seven unittest methods passed. They exercised all four host destinations with byte-identical skills/resources, preservation of unrelated project files, refusal of a preexisting customized skill before copying, broken-symlink preservation, rejection of a redirected destination outside the project, cleanup of installer-owned copies after an injected interruption, explicit-project/no-global CLI behavior, and missing-source refusal without project changes.

All nine skills passed frontmatter validation after host-adaptation changes; local Markdown links/fences/newlines passed. No personal Compass skills were installed or other project configuration modified.

Limitations: Cursor and Copilot CLIs were unavailable; their discovery/invocation guidance follows linked official documentation, while only project copies were exercised locally. No real implementation/review model session was executed on Claude, Cursor or Copilot; the native reviewer tool restriction and worker packets still require behavioral evaluation in those hosts. C1-C8 remain historical results, not reruns after the host update. Arbitrary concurrent installer races and Windows-specific filesystem behavior were not exercised.

## Public distribution checks (C10)

Published the authorized public repository `https://github.com/ltphat2204/compass` on `main`. GitHub plugin identity and GitHub CLI identity both resolved to `ltphat2204`; the plugin exposed no repository-creation action, so authenticated CLI created the repository and pushed the source. No marketplace publication, global skill installation or change to another project was performed.

The skills CLI discovered all nine skills locally. A real remote installation from GitHub at initial source commit `5201bfff9a300c99e1b3572bb6921a6c732bdfb7` used `--skill '*' --agent claude-code codex cursor github-copilot --copy --yes` in an isolated temporary Git project. Installation succeeded and created a project lockfile. All nine packages and resources matched canonical source bytes in `.agents/skills` and `.claude/skills`; relative sibling/resource links resolved. Codex, Cursor and Copilot used the shared project location; Claude used its project location. No global Compass skills were created.

Direct HTTP checks returned 200 for `https://skills.sh/ltphat2204/compass` and its `comp-engineer` page. Parsed visible repository content listed nine skills; the engineer page rendered the actual SKILL.md instructions. The visible install counter was still zero at inspection, so no increment or leaderboard ranking is claimed. The browser research tool could not open these newly created URLs; direct HTTP content inspection supplied the evidence.

Nine skill validators, Claude strict manifest validation, Markdown references and seven installer tests passed before publication. Historical behavioral cases were not rerun; installing a host package does not verify that host's model behavior. SkCC and the selected skill-sync implementation are documented as optional distribution/compiler choices, not installed or execution-tested integrations.

Optional skill-sync profile selects exactly nine packages from initial verified source commit, with three project-relative destinations. The pinned Git tree and source package selection were checked locally; upstream preview/apply were not executed.
