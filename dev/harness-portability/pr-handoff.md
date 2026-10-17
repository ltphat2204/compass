# Scoped harness-portability PR handoff

Date: 2026-10-18. Delivery scope explicitly authorized by the user: publish completed optimizations while deferring Claude Code, Cursor and Copilot runtime acceptance. The original all-harness objective stays open; this PR does not mark MP-04 or the parent milestone complete.

## Included behavior

- Project-only install lifecycle with exact dry-run paths, installed checks, SHA256 ownership, conservative update/uninstall, collision/symlink checks and ordinary-error recovery. Existing install API and host destinations remain compatible.
- Portability lint for the nine canonical skill packages, frontmatter, resource links, personal paths and host-only substitutions.
- A single canonical role-responsibility source with thin native metadata, portable input/output packets, stage capability checks and evidence-qualified handoffs.
- Observed Codex/OpenCode workflows and qualified Codex-to-OpenCode resume. Claude/Cursor/Copilot packaging compatibility remains available, but full model workflow acceptance is excluded from this PR.

## Verification and independent gates

Separate fresh test authors and independent validation preceded implementation. A recovery defect found during review required preserved v1 history, full source-plan revision and new prefreeze validation before replacement freeze v2. Frozen tests were not patched to match production. Coordinator integration and independent implementation reviews accepted the resulting code.

Current reviewed source/suite identities (SHA256):

| File | SHA256 |
|---|---|
| `scripts/install.py` | `5cb88bcbf386cab48f7fadf4b637eb4eb36ed61b45371ee97b786aaeb1b28f6b` |
| `scripts/check_portability.py` | `e57a25a475ccd8b6d5cef99821597132f9af0381ff46de635ec2efc5eeec4699` |
| `scripts/host_agents.py` | `d86da848ee39a0fdf92b1cec5334c7543de40715e9dcf9006cfa5db2138d2865` |
| `evals/test_install.py` | `e6e86738e5d5043730dd119a183f91da2f3308694eb5479ee11ac6780c5297ea` |
| `evals/test_portability_install.py` | `1c9e3732228ae45d99a9aa19f34197a8a3194eb251a8cf951b3c250ff711ac6b` |
| `evals/test_portability_lint.py` | `1c8bb2d0c6aeb9b8ba9a49e360581c6b2a677ba8d3351d1aa4907cfb5080ce92` |
| `evals/test_install_recovery.py` | `137fc609fbab75a2949c42ca6d695f507ca33a5334a0591979464dc15c7294fe` |
| `evals/test_host_agents.py` | `ef80caf32712f3761279036edc70cc309c53bacaf7d76952fe852fa58a65d596` |

Runtime evidence and material limits are summarized in [evaluation results](../../evals/results.md#harness-portability--scoped-delivery-2026-10-18). Raw sessions, machine-specific logs and incomplete-harness experiments remain local and are not published. The runtime summary is not a standalone replay/audit bundle.

## Delivery checks

The exact staged export passed `python3 -m unittest discover -s evals -p 'test_*.py'` (49 tests), `python3 scripts/check_portability.py`, 138 local Markdown links and all five frozen-suite SHA256 checks. Staged whitespace and private-data checks passed. Fresh independent reviewer `pr_portability_review` returned READY with no blocking findings for the staged source, tests, documentation and delivery scope. This paragraph records those completed checks; source and frozen tests remain unchanged. No merge or deployment is authorized.

## Remaining work outside this PR

MP-04: complete and independently accept Claude Code, Cursor and Copilot full workflows. Preserve their pending gates and original milestones. No unavailable host, schema check or installation result counts as runtime PASS.
