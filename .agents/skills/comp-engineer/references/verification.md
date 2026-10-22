# Verification and review policy

This policy governs verification reuse, review cadence and frozen-suite revisions across Compass stages. Mandatory security, data, human approval and strict test independence gates remain required.

## Default flow

Agree criteria, affected callers/contracts/resources and risk → implement with appropriate tests → run required checks on stable inputs → one combined review of requirements, code and test quality → ship using current evidence.

For behavior changes, independent test authorship, independent pre-freeze validation, immutable versioned suites, sanitized implementation context and coordinator-run pre-freeze harness/validation controls still precede implementation. Coordinator-run acceptance tests against the implementation follow implementation. The combined final review does not replace pre-freeze validation. Preserve early review of security/data/public-contract/prerequisite work when needed to unblock dependent tasks.

## Evidence reuse

Record command, working directory, result, reviewed scope, reviewer independence, source/test/config/dependency identities and relevant environment in the existing walkthrough; no new artifact system is required. A stage transition alone never invalidates evidence. Ship consumes current analysis, checks and combined review instead of commissioning duplicates. Required CI and human gates still run where mandated.

Reuse only when all relevant inputs remain unchanged. After edits, identify affected criteria, callers, contracts, tests and execution resources; rerun their checks and review the changed portion plus its impact. Retain evidence for unaffected scope. If impact or environment equivalence is uncertain, expand verification. When hooks require the current whole-scope digest, explicitly reconcile retained evidence against input identities and record the new snapshot binding; never copy an old PASS blindly or bypass stale-evidence rejection.

## Review and stopping

Use one final reviewer to cover spec compliance, actual code, meaningful assertions and required evidence together. Supply actual diff, affected callers and tests to an authorized independent reviewer; implementers still cannot inspect frozen tests. Existing risk-based reviewer requirements apply. A current combined review satisfies implement/review/ship final-review requirements without another reviewer dispatch.

Block on concrete correctness, security, data, contract, missing behavior or required-evidence failures. Label optional polish non-blocking. Findings identify the triggering condition, consequence and supporting evidence. After fixes, rerun affected checks and scoped review. Do not repeat an unchanged review/fix loop: produce a minimal reproduction, resolve the specific ambiguity or report the blocker. No round limit permits shipping unresolved blockers.

## Frozen-suite repairs

Never edit a frozen version in place. Classify the repair before changing anything:

- Changed expected behavior or business rules: revise affected intent/plan criteria, obtain approval for material changes, reconcile tasks and invalidate affected evidence.
- Harness/import/path/setup or test-author error with unchanged agreed behavior: record the reason and demonstrate unchanged criteria; preserve valid intent/plan sections and approval. Review the affected test mapping and execution controls rather than restarting all requirements analysis.

Both paths require an independent test author to prepare a replacement suite version, independent validation of the changed suite/resources, a new complete inventory/freeze, preserved prior versions and affected checks/review. No weakening assertions to obtain green results, no silent resource/config updates and no bypass of required controls. Resume implementation only with a fresh sanitized packet against the replacement freeze.
