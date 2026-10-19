# Independent adapter test validation

Test validation: PASS for replacement candidate. Reviewer `/root/opencode_test_review` authored none of tests/harness/controls/implementation; read-only source/hash and bidirectional requirement/assertion review. Earlier BLOCKED findings closed before freeze; source contract unchanged.

| Criterion | Assertions / expected rationale | Coordinator execution evidence |
|---|---|---|
| OC-01 | ESM default identity, async setup/registrations, abort and dispose | Correct control all6 PASS |
| OC-02 | Original request and unrelated fields retained with shared intake guidance | Correct control PASS |
| OC-03 | Frozen write/edit/patch denial, allowed writes, exact public Bash mapping | Mapping and shell defects rejected |
| OC-03 | Original string/typed content, image, metadata and actual failures retained with STALE | Content defect rejected |
| OC-04 | Unknown/failed events quiet; prompt/before-only/after-only sessions scoped correctly | Scoping and prompt-only defects rejected |
| OC-04 | Bounded internal continuation, external reset, independent sessions | Guard defect rejected |
| OC-04 | Inert/current-success/active/blocked gates quiet | Correct control PASS |
| OC-05 | Process stderr, malformed JSON and array schema errors visible | Malformed defect rejected |
| OC-05 | Frozen fixture content preserved in every scenario | Correct control PASS |

Reviewed source identities: intent `81dfe84cdfc84962c1ac7fb421d1e8d77aae76cc787cd5c41efaaa4472164c62`, plan `b8c2f9aff4733bac796d8f5d952b6f161bb576f16a6b02caf8a229eaee235406`, Python suite `e0606d230a71c53d44d509135d6a3a56c2e3c70078233362bf1302d096e87f07`, Node harness `8c8b6b0bbd78061de4c33613a6ac58406305b4734439d2a7d032e10379bf1a9c`. Control identities match replacement section of `test-controls.md`.

No unsupported assertion/API expectation or unresolved material gap. Mock awaits Promise<Registration> and disposal; dispatcher tracing is a public protocol observation. Correct control exit0 all6 PASS in12.859s; all7 defects fail relevant ordinary assertions. Reviewer executed no checks. Native project loading, runtime-relative resolution and actual three-host model acceptance remain required; no atomic OpenCode Stop veto is claimed.
