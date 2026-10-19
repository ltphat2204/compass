# Evidence

- Expanded delivery authorization received directly from user; release remains conditional on all three native hosts passing.
- Source branch: feat/lifecycle-hooks; target main verified from GitHub. Latest release v0.3.2; GitHub authentication available.
- Installed CLIs: Codex0.162.1, Claude Code2.1.302, OpenCode2.0.32.
- Core runtime passes thirteen frozen subprocess tests; core freeze unchanged. Native Claude manifest validation PASS.
- OpenCode official V2 plugin/types examined. No atomic stop hook; post-success continuation needs native proof. Separate adapter scope preserves original core test gate and role separation.

## OC-TASK-01 — DONE

- Fresh author `/root/opencode_adapter_tests` wrote public subprocess contract tests and an async V2 API harness without production internals. Coordinator corrected pre-freeze mock fidelity to documented Promise<Registration>/dispose.
- Independent reviewer initially BLOCKED missing shell mapping/tool-only session/schema discrimination. Author closed these before freeze; coordinator reran correct control (six PASS in12.859s) and all seven defects (rejected at ordinary semantic assertions).
- Replacement independent validation PASS by `/root/opencode_test_review`; exact source/suite/control/runtime inventory frozen in `test-freeze.json`, mapping/evidence in `test-validation.md` and `test-controls.md`.
- No production adapter written before freeze. Fresh implementation context will exclude all private tests/controls/evidence; coordinator alone runs suite. Native tester prepared a private service fixture and is waiting for source availability.

## OC-TASK-02 — verification complete

- Fresh `/root/opencode_adapter_impl` delivered only `integrations/opencode/compass.js` after freeze, then the one-line native directory entry `index.js`. It ran syntax checks only and did not inspect or run private tests. Coordinator's first acceptance found discarded subprocess stderr; implementer corrected that public diagnostic mismatch. Six frozen adapter tests now PASS; both frozen inventories unchanged.
- All repository unittests: 69 PASS in29.870s. Core portability and Claude plugin/marketplace strict validation PASS. Independent `/root/final_hooks_review` found no actionable code findings on the stable runtime/adapter, with native OpenCode and final documentation still pending at that review snapshot.
- Actual OpenCode2.0.32 first skipped configured file path and allowed a synthetic frozen write because no plugin was loaded. This failed attempt is excluded from accepted evidence. Pinned v2.0.32 loader source and native probes established configured paths must be directories. A production `index.js` forwarder fixed distribution; final plugin.list identified that actual source active. No package dependency or global settings change.
- Final native four-hook PASS: implicit brainstorm invoked comp-engineer; frozen structured write denied with sentinel preserved; allowed source before→after gave both prior valid evidence records STALE. Final no-reload completion session observed first execution success → shared Stop(false) block → one same-session automatic user continuation → actual second model execution success → Stop(true) unverified context only. Exactly two user messages/two successful drains; no third continuation after the quiet interval.
- Completion is post-success feedback, not an atomic veto. The model refused to fabricate evidence; final synthetic state marker remained complete but UNVERIFIED. This is not a completed feature or actual project review. Earlier reloads could reset tracking; final guard proof used a stable instance and the production directory entry.
- Accepted hashes: Python `4dc03953038da849bad1c77b630acd8cac119b9f27dd8ae2109dabed54f6ca94`; adapter `14b3f6245a98e33eb7c5a4230a236a3a5754965e96995714dc2e70837d5ad5e4`. Private summary/trace/context and event evidence inspected by coordinator. Raw server logs contain temporary credentials and stay outside the repository. Six own test sessions removed; private server stopped. Existing model/auth/settings unchanged.
- Codex0.162.1 and Claude Code2.1.302 all four native hooks already PASS on the identical Python/registration snapshot (see sibling core walkthrough). All three host acceptance conditions are satisfied; documentation/version finalized to0.4.0 only after these results. Final scoped review, PR/checks and publication remain pending.

## Release handoff

- Independent final scoped review READY, no actionable findings; see `final-review.md`. Both manifests0.4.0; final package/portability-lint9 PASS, portability checker and native strict manifest checks PASS. Test freezes unchanged; no new code after native acceptance except the verified one-line directory forwarder.
- User explicitly authorized PR, release and main merge after allthree host checks. Proceed with a reviewable PR and draft release; publish only after confirmed main merge, binding tag to merged commit. This source snapshot intentionally precedes those external outcomes; do not fabricate a published/merged claim in advance.

## OC-TASK-03 — DONE

- [PR #11](https://github.com/ltphat2204/compass/pull/11) created and attached to the chat, then GitHub confirmed MERGED into main at commit `4d9ec698ecdbef7ba533164e0f44ecdec71f728e`. Head identity matched the reviewed branch; merge state was CLEAN/MERGEABLE. No CI checks were reported/configured, which is absence of CI rather than a CI pass.
- Draft release was created before merge; after confirmed merge its target was updated to that full merged SHA and [v0.4.0](https://github.com/ltphat2204/compass/releases/tag/v0.4.0) published. GitHub confirmed not draft/not prerelease, publication `2026-10-18T02:01:21Z`; remote tag SHA exactly matches the merged commit. An initial short-SHA draft target was rejected by GitHub422 before creation; retry with the full SHA succeeded.
- Allthree native hosts passed before publication. Final69-test run and scoped package/portability/native validation are recorded above. This closeout changes task/evidence metadata only; runtime, adapter, registration, frozen suites and release-tag source remain unchanged. Original local handoff and extended release tasks are all complete.

## Archive closeout — 2026-10-19

- User authorized mandatory spec archival after completion, superseding the earlier archive exclusion for this closeout. Original decisions and delivery history remain preserved above.
- Delivery: PR #11 merged at `4d9ec698ecdbef7ba533164e0f44ecdec71f728e`; v0.4.0 published, as recorded in the existing delivery evidence. No new remote verification or release operation performed.
- Source: `dev/lifecycle-hooks-opencode/`; destination: `dev/_archived/20261019/lifecycle-hooks-opencode/`.
- No active hook selector exists. Sibling relative references retain their relationship because both completed folders move to the same dated archive. Historical project-relative paths and frozen inventories remain unchanged.
- Pre-move SHA256 inventory (walkthrough excluded to avoid self-reference; its final bytes are checked separately during move verification):

```json
{
  "final-review.md": "656b40e2b1ad864b0117516fea4b9443e0775a435512d129bf74d11f9ea81163",
  "intent.md": "81dfe84cdfc84962c1ac7fb421d1e8d77aae76cc787cd5c41efaaa4472164c62",
  "plan.md": "b8c2f9aff4733bac796d8f5d952b6f161bb576f16a6b02caf8a229eaee235406",
  "tasks.md": "8d06b6ac578d6d4f4ee44d5d6c918aefa083a3f6baee4e2fc2dca1e4835bef44",
  "test-controls.md": "e41ac89b05a2e53aaecb66a7e04a6a18cf69651686b7dacec52fff9b2620e61f",
  "test-freeze.json": "6609d88641e675578ba08097a8deb474aec5b6b6b2f491366ab0ed359a0ae9e9",
  "test-validation.md": "02929a4c3eb5f41ce545fc2799e0411d7cac6dd22182f1fbf23a6b1a66fb0dd3"
}
```
