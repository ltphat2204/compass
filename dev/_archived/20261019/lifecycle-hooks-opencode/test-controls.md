# Coordinator-run independent adapter controls

Fresh author `/root/opencode_adapter_tests` owns the candidate suite. No production adapter exists. Mock API fidelity corrected before freeze to async registration returning `{dispose(): Promise<void>}`, matching official V2 API; no invented callable unsubscribe contract remains.

Coordinator executed from repository root, using Python3.14 stdlib unittest and Node26.9.0:

`rtk proxy env COMPASS_OPENCODE_ADAPTER=/tmp/compass-opencode-controls/good.mjs python3 -m unittest evals.test_opencode_hooks -q` — exit0; six tests PASS in 8.946s. The control is an independent minimal spec-derived bridge, exercising the shared dispatcher as a public black box; no implementation internals were used to derive expected results.

Defects use `/tmp/compass-opencode-controls/<defect>.mjs` with the same environment override and `python3 -m unittest evals.test_opencode_hooks.OpenCodeHooksTests.<method> -q`:

| Defect | Selected method | Actual result |
|---|---|---|
| mapping | test_frozen_mappings_and_unrelated_tools | exit1: frozen write incorrectly allowed |
| content | test_after_preserves_content_metadata_and_failure | exit1: original output lost |
| scoping | test_completion_scoping_guard_and_external_reset | exit1: unknown session continued, counts [1,2,2,3] versus [0,1,1,2] |
| guard | test_completion_scoping_guard_and_external_reset | exit1: internal prompt reset guard, counts [0,1,2,3] versus [0,1,1,2] |

All defects failed at relevant ordinary assertions, not setup/import/process failures. Positive checks also prove prompt preservation, valid/inert/active/blocked gate silence, visible dispatcher process error, independent sessions and async cleanup. Public same-session continuation is post-success, not an atomic Stop veto; native CLI/service acceptance remains mandatory.

Candidate identities: intent `81dfe84cdfc84962c1ac7fb421d1e8d77aae76cc787cd5c41efaaa4472164c62`; plan `b8c2f9aff4733bac796d8f5d952b6f161bb576f16a6b02caf8a229eaee235406`; Python suite `d4292637c63c2725f29bf1fa2d08e4813a133a87526886d2e0b03feec2738d89`; Node harness `8d6008a78a438873d23a5d3a63bbb21c71d84a6b21cfae7625c28bc966f0ae11`. Controls: good `8e3d8a5651752e7ccc332eeba3b23e8d1281994827c0d85075fcfe578284f9b8`; mapping `e44c9f84c6f9117f423b65775c9ace2d0ba8413ce19654e7cfd7ed4d2476136f`; content `7eaf84167636bb504eebe972a10afe3067863b4977b2af2fbb29bb6627c3f36e`; scoping `716e8e470147b68b00b48af9e4949bd055dd7a4408e1c5542ed7849f9c1530a1`; guard `996f2e83eeb2d1f5242e15ef305bc631bcb05739d1b637018afc21fee1b93c32`.

## Replacement candidate after independent BLOCKED review

Reviewer found shell mapping, tool-only session observation and malformed dispatcher output were not discriminated. Author corrected these before freeze. Public protocol tracing now distinguishes Bash from an ignored tool name; both before-only and after-only sessions require their own same-session continuations; process failures, malformed JSON and invalid top-level schema are rejected visibly.

Coordinator reran the replacement correct control: six tests PASS, exit0 in 12.859s. Reran all seven defective controls, each exit1 at relevant assertions: mapping loses frozen denial; content drops original output; scoping incorrectly continues an unknown session; guard repeats continuation; shell emits Unknown instead of Bash; prompt-only omits before-only/after-only continuations; malformed silently accepts JSON/schema failures. No failure was a broken setup or import.

Current suite SHA256 `e0606d230a71c53d44d509135d6a3a56c2e3c70078233362bf1302d096e87f07`; harness `8c8b6b0bbd78061de4c33613a6ac58406305b4734439d2a7d032e10379bf1a9c`. Current controls: good `d570b24e4a280d32402f49675372d38523ebdc4748f887121689ac7a18730d52`, mapping `056097722347becbeee6819a4368868c0fc00f7965337a33928749567c785420`, content `3e4a2b83218ccf304d9c164cb972e19496c91d69cdc5d01abe8dd57083507de4`, scoping `dac39559761d01a92102bc18bc21d8cd70e050c3d5f5a8e424f4b7bb90ef3a8b`, guard `c66bd4539740ea27fbe742da39062512b775e2c6e471c666597bb2fd442a80e9`, shell `d86d68c821077afe55f2ddb3283b056a61f6ac1116fea7ed49fcdff0353731de`, prompt-only `3f1e516521f5533f861131692370e203b721274794a176f7c208ed4eb8a80701`, malformed `a90a5aa3f24c7acd31120bc2be31208994e061f1933d8b143f3e58a72558ef3d`. Intent and plan unchanged.
