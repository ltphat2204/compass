# Acceptance Criteria & Business Logic Tests

Apply the [shared verification policy](../../comp-engineer/references/verification.md) for scoped replacement-suite revisions. Strict role separation and immutable freezes remain mandatory.


Read when planning, coordinating tests, or reviewing behavior changes. After Intent, Plan, and Tasks are ready, a separate test-author subagent writes the required tests before implementation. A fresh independent test-review subagent validates them against the agreed artifacts; only its current PASS permits the coordinator to freeze them and dispatch a fresh implementation subagent instructed not to inspect tests. This separation applies to standard and light behavior work. No new percentage coverage target is imposed; existing repository gates still apply.

## Strict Context & Access Boundaries

- **Test author** receives only agreed criteria/domain examples, public interfaces/input contracts, relevant repository instructions, runtime/runner conventions, and sanitized fixture patterns. It receives no proposed solution, implementation internals, code-generation history, or implementer conclusions. Supply selected excerpts in a fresh context, not a conversation fork. Own tests in a separate workspace/resource scope.
- **Implementer** receives agreed intent, a sanitized implementation plan, public contracts, relevant production source/callers, and instructions. It must not read any test source, assertions, case lists, fixtures, snapshots, test diffs/history, test-author messages, or reports exposing test contents. Public examples explicitly agreed in intent remain allowed; private executable cases do not. Do not pass full tasks/walkthrough if they expose tests. The implementer cannot author, modify, run, or probe the frozen suite.
- Test read separation is a workflow instruction, not a host-enforced security boundary. Subagents may share a filesystem, checkout, and host permissions; users do not need separate machines, containers, accounts, or filesystem access controls. Give implementers fresh sanitized contexts, identify test/resource paths they should not inspect, and scope source searches to production files. Optional sandboxing can strengthen separation when already available, but missing host isolation alone never blocks implementation. Do not claim prompt instructions or worktrees guarantee secrecy. Missing required subagents still blocks behavior implementation.
- Only the coordinator and authorized test reviewer inspect/run the frozen suite. Return criterion-level mismatches with the observed public behavior and required behavior, never test names, inputs unique to private cases, assertion output, fixtures, or suite code. Do not offer an interactive hidden-test oracle. Repeated unchanged failures block further blind retries. If test contents leak, stop the implementer, record the breach, correct the packet/read guidance, and dispatch a fresh context; leaked context cannot be erased by an instruction.

## Freeze & Change Control

- Before implementation, require the independent validation gate below. Test-author mistakes may be corrected before freeze, followed by fresh validation of the changed snapshot. A failing stub is evidence of a missing behavior, not a reason to weaken the test; distinguish harness errors from expected failures.
- Record `Test gate: FROZEN`, the complete suite file inventory and content hashes, fixtures/snapshots/harness/config that affect expectations, author/reviewer, and source intent/plan revision identities in coordinator-owned artifacts. Freeze the dependency versions/config used to execute the checks. Preserve the suite as an immutable version; verify inventory and hashes before and after every run and at delivery. No worker may edit, delete, skip, weaken, regenerate, or alter the environment to bypass a frozen test.
- **Any frozen-test/resource change requires a replacement suite version, never an in-place edit.** Stop affected implementation/delivery and classify the change. If agreed behavior changes, revise affected intent/plan criteria and obtain approval for material changes. For harness or test-author errors with unchanged behavior, document the reason and unchanged criteria; retain valid intent/plan sections and approval. Reconcile affected tasks/evidence. The independent test author prepares a new suite; independent validation checks changed assertions/resources, criterion coverage and required execution controls before a complete replacement inventory/freeze. Preserve old suite/manifests and resume with fresh sanitized packets. Never weaken assertions or skip required validation. See [verification policy](../../comp-engineer/references/verification.md).

## Independent Test Validation — Required Before Freeze

Use a fresh test-review subagent, such as `comp-reviewer` with a test-validation assignment. It must have authored none of the tests, fixtures, harness, or proposed implementation. Supply the complete agreed intent and plan with revision/content identities, public contracts, applicable instructions, actual suite/resources, and coordinator execution evidence. Do not supply the test author's preferred verdict or implementation solution. This gate overrides low-risk self-review fallback; missing reviewer or required evidence means `Test validation: BLOCKED`, never FROZEN.

The reviewer must derive the expected behavior from agreed artifacts before assessing assertions. Require a compact evidence table in the existing private walkthrough:

| Criterion / rule | Agreed source section + expected-result rationale | Test path/case/assertion | Execution/control evidence | Finding |
|---|---|---|---|---|
| Stable AC reference | Exact agreed rule, including boundary semantics | Actual assertion, not just test title | Observed result or missing | Covered / gap / mismatch |

Validate both directions: every applicable criterion/rule has meaningful evidence, and every test expectation is justified by an agreed rule or mandatory repository constraint. A derived boundary case is valid when its expected result follows from that rule; a new business policy is not. Check normal, relevant boundary/rejection/invariant cases, required integration checks, and suitable manual checks. Flag missing coverage, wrong expected values, overprescribed implementation details, tautologies, no-op assertions, and mocks that bypass the behavior. Passing syntax/collection, hash checks, or a green run alone cannot earn PASS.

Coordinator runs the actual runner against the candidate suite in its private workspace and supplies commands, working directories, snapshot identities and results. For each changed non-trivial business rule, require safe isolated controls: a spec-derived correct example/reference must be accepted, and a plausible wrong rule must be rejected by a relevant assertion. Keep controls separate from production; do not use the generated implementation as the expected-value oracle. A generic failing stub or import error alone is insufficient. Reuse a control that covers several rules when adequate; no mutation framework or percentage target is required. Missing executable control evidence blocks validation for these rules. The reviewer checks that the controls themselves follow the agreed spec and failures came from relevant assertions, not broken wiring. Native read-only reviewers request execution from the coordinator rather than claiming to run it.

Return `Test validation: PASS/BLOCKED`, reviewer identity/independence, reviewed intent/plan/suite/resource identities, the table, findings, control results, and limitations. PASS requires no unresolved material mismatch, unsupported expectation, missing core coverage, or required check. An ambiguity in the agreed artifacts goes back to Intent/Plan; before freeze, test-only mistakes go back to the test author for correction and re-review. Any relevant input change invalidates PASS. Coordinator freezes exactly the validated inventory/hashes and records the report reference in the freeze manifest; otherwise the gate remains BLOCKED. After freeze, the scoped replacement-freeze rule above applies even to reviewer-discovered test errors.

## Decide What Must Be Proven

- Derive expected results from agreed intent, domain rules, and concrete examples, not from the generated implementation. Use stable criterion IDs and plain Given/When/Then or input/action/expected-result wording; no Gherkin tooling is required.
- For each criterion, identify an existing sufficient test, a test to create/extend, or a justified manual check. One test can prove several criteria; one criterion can need several cases. Do not duplicate adequate tests merely to create new files.
- For changed business rules, test the normal outcome and relevant boundaries, rejection/failure paths, and invariants: thresholds, permissions, calculations, transitions, or recovery behavior as applicable. Select cases by plausible failure and impact, not every branch or function. Keep security, data integrity, compatibility, accessibility, and required non-functional checks even when they fall outside functional criteria.
- AI may propose missing cases and challenge assumptions; it must not invent business policy. Resolve material uncertainty through the intent stage before treating an expected result as agreed.

## Choose the Smallest Useful Test

- Test business logic at the lowest practical layer that proves the rule. Exercise observable results through stable interfaces, not private methods, internal call counts, or snapshots of generated code.
- Add integration/contract checks when changed wiring, persistence, or external boundaries could fail despite passing logic tests. Use E2E for critical user journeys or outcomes that lower layers cannot demonstrate; no fixed pyramid ratio is required.
- Reuse the repository's runner, fixtures, and conventions. If no runner exists, prefer a small executable check using the existing runtime; add tooling only when the required behavior cannot be verified adequately without it. Do not refactor architecture just to introduce a test layer.
- Manual checks suit visual/subjective outcomes and documentation. Record why automation is unsuitable, reproducible steps, and the observed result. Missing tools do not turn changed business logic into a manual-only exception: implement a runnable check, or keep required verification BLOCKED with the limitation explicit. Authorized scoped deferrals follow the existing gates; they cannot waive security/data safeguards.
- Light work keeps the mapping in its existing compact plan/task but retains strict separation and freeze. Spikes test the learning question rather than promise production coverage; a spike must not bypass the gate to deliver production behavior. Do not create a separate test-plan artifact by default.

## Generate, Run & Challenge

1. Coordinator settles public contracts and allocates separate test/implementation ownership. Inspect existing tests privately; retain sufficient regression/characterization checks in the frozen suite. Dispatch the test author with the minimal packet above.
2. Obtain independent `Test validation: PASS` with source-to-assertion mapping and required positive/negative controls, then freeze exactly the reviewed suite/resources with the validation report reference. Do not start production behavior edits before the test gate is FROZEN and the sanitized packet and test-read guidance are ready. A passing lint/typecheck/build alone does not prove behavior.
3. Dispatch the fresh implementer with permitted source/spec context only. It implements the contract and runs only permitted non-test checks; coordinator integrates the returned code into the private verification workspace.
4. Coordinator verifies the frozen inventory/hashes, runs focused tests plus affected integration/repository-required gates, and checks the manifest again. Failures require code fixes through sanitized criterion-level feedback or the full intent/plan restart above if tests need changing. Test pass output is retained privately until implementer work is closed.
5. Review code and test evidence against intent on a stable snapshot. Missing freeze, required context separation, required evidence, or an unexplained hash/inventory change blocks DONE/delivery. Preserve risk/reviewer requirements; green runs alone are not approval.

## Explain the Evidence

Keep criterion -> example/rule -> test name/path (or manual procedure) -> command and working directory -> observed result in coordinator-owned plan/tasks/walkthrough, outside implementer access. Record uncovered cases and limitations honestly. After implementation is closed, explain representative test evidence to the user in walkthrough/handoff: the rule proved, why the assertion detects a defect, and what remains unproven. Use concrete inputs/outputs for newcomers and domain assumptions/risks for experienced developers. Do not expose this walkthrough to a resumed implementer.

Example: AC-01 grants free shipping at a subtotal of at least 100; AC-02 permits it only in eligible regions. Check 99, 100, and 101 in both eligible and ineligible regions with explicit expected booleans. These cases catch `> 100` instead of `>= 100` and a missing region guard. Add an API check only if changed request wiring also needs proof. The numbers and region rule come from intent, not an AI guess.

## Sources & Adaptation

These philosophies inform Compass's approach; they do not require installing their tools:

- [Agile Alliance: ATDD and acceptance testing](https://agilealliance.org/agile101/agile-glossary/): shared acceptance examples guide implementation. Compass additionally requires independent executable tests before implementation.
- [Cucumber: Example Mapping](https://cucumber.io/docs/bdd/example-mapping/): connect rules, examples, and unresolved questions. Compass captures them in existing artifacts.
- [The Practical Test Pyramid](https://www.martinfowler.com/articles/practical-test-pyramid.html): acceptance describes purpose, not a mandatory E2E layer; lower-level tests can prove acceptance rules.
- [Google Testing Blog: How Much Testing is Enough?](https://testing.googleblog.com/2021/06/how-much-testing-is-enough.html): combine logic, integration, and critical-journey checks; code coverage alone does not prove correctness.

Compass's strict subagent separation, access restrictions, and frozen-suite change control are project policy, not claims that these sources prescribe hidden tests.
