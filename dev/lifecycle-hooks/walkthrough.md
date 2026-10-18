# Execution evidence

## Entry

- User authorized four hooks; repository initially clean.
- No CodeGraph index found at repository/known ancestors; targeted inspection used.
- Current native docs confirm UserPromptSubmit, PreToolUse, PostToolUse and Stop with shared command JSON conventions and default `hooks/hooks.json` plugin discovery. Codex provides CLAUDE_PLUGIN_ROOT compatibility. Hooks require host support/trust; specialized tools and opaque shell execution are not a complete enforcement boundary.
- Required fresh-context test author/reviewer/implementer tools are available. Shared filesystem is workflow separation, not security isolation.
- Public portal ZIP currently promises skills-only; retain that existing contract. Runtime hook discovery applies to repository plugin installation.
- No production behavior written; test gate pending.

## Candidate test validation

- Fresh test author `/root/hook_test_author` authored subprocess contracts and independent spec-derived controls; coordinator ran the initial RED suite and five positive controls (PASS), plus protection/invalidation/completion defects (all rejected at assertions). See `test-controls.md`.
- Independent reviewer `/root/hook_test_review` returned BLOCKED before freeze: add configuration/inventory controls, strengthen invalid-state diagnostics, and inspect conditional intake meaning rather than trusting keyword presence. No production behavior implemented. Author is correcting the unfrozen suite/control resources; a fresh validation of the replacement snapshot will follow.
- Coordinator made non-runtime skill/install documentation integration only; runtime/reference implementation remains reserved for the fresh implementer after freeze.

## TASK-01 — DONE

- Coordinator ran ten spec-derived correct control selections (PASS), and configuration/inventory/unsafe-path/patch/report defective controls (all rejected at semantic assertions), in addition to the initial controls. Diagnostics strengthened before freeze.
- Independent replacement validation: PASS by `/root/hook_test_review`, bound to exact source/suite/control identities. See `test-validation.md`; manifest `test-freeze.json` retains full inventory and runtime identity.
- Suite is now FROZEN. Fresh implementer receives agreed public contract and opaque PASS/freeze status only; private tests/control/evidence paths are excluded. Shared filesystem does not enforce secrecy. Coordinator alone runs tests; no runtime implementation has started.

## Runtime and native verification

- Fresh `/root/hook_implementer` delivered shared Python runtime, four default native registrations and portable coordinator reference; only syntax/JSON checks were run by the implementer. Coordinator ran thirteen frozen hook tests: PASS. Focused combined hook/package/portability-lint run: 22 tests PASS; portability checker PASS. Frozen source/suite/control inventory unchanged.
- Runtime hash `4dc03953038da849bad1c77b630acd8cac119b9f27dd8ae2109dabed54f6ca94`; registration hash `40fb30408021ea328b27ef0efde1f542756671ddb0818c4b1df604f8d390db88`.
- Codex CLI0.162.1: all four native hooks PASS in isolated installed plugin/project, two actual model runs exit0. Native events: 2 UserPromptSubmit,9 PreToolUse,8 PostToolUse,3 Stop. Implicit brainstorm loaded installed comp-engineer, protected patch denied/sentinel preserved, allowed source edit produced both STALE records, explicit complete caused Stop continuation and final blocked state. Coordinator read report and retained private logs; no global config/model/credential changes.
- Claude Code2.1.302: all four native hooks PASS through session-local plugin copy, two actual model runs exit0. Coordinator inspected actual trace: 2 UserPromptSubmit,12 PreToolUse (one deny),10 PostToolUse (five stale warnings),3 Stop (one block). Implicit brainstorm invoked Skill compass:comp-engineer; protected Write denied, source changed, complete rejected then blocked-state finish. Identical runtime/registration hashes. Existing global customizations loaded; empty strict MCP config isolated MCP.
- Native tests cover one configured model/version/surface per host; their synthetic fixture records are not actual project review evidence. Full native traces stay in temporary private evaluation directories, not the public package.
- User then authorized three-host validation and conditional PR/release/main delivery. Additional OpenCode V2 adapter and release acceptance are tracked in sibling `../lifecycle-hooks-opencode/`; original core test source contract is unchanged. Release remains blocked until all three hosts pass.

- OpenCode2.0.32 subsequently passed all four native adapter checks on the production directory entry, including a bounded real same-session completion continuation; see sibling walkthrough for its post-success limitation and initially rejected configured-file installation. All69 repository tests PASS. Final review and publication are tracked in the sibling release task; no frozen source/suite/resource identity changed.

- Extended delivery completed: PR #11 merged into main, release v0.4.0 published, and its remote tag resolves to the merged commit `4d9ec698ecdbef7ba533164e0f44ecdec71f728e`. Sibling release walkthrough records authoritative GitHub state and completion. No runtime or frozen resource changed during closeout.
