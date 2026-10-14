# Walkthrough: Adaptive Compass workflow

## Authorized scope and decisions

User authorized adaptive routes/milestone decomposition, motivation/hotfix documentation, shipping, PR merge, closing upstream #2491 and requesting current-source indexing. Light instruction/documentation release; preserve existing strict behavior gates and unrelated `example/`. Plugin version: 0.3.0.

## Verification and independent review — 2026-10-14

- `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s evals -p 'test_*.py' -v`: 7/7 PASS.
- skill-creator validator: all 9 skill frontmatters PASS; local Markdown link inspection: 101 links resolve.
- `claude plugin validate --strict .` and `claude plugin validate --strict agents`: PASS. Marketplace-install advice is nonblocking.
- `git diff --check`: PASS. Base main/origin/main aligned at 4a2890fede922935d4ad81aa1a04c75e76f0d4a4.
- Prior independent five-scenario simulated evaluation recorded in `evals/results.md`.
- Fresh independent reviewer `release_review`: READY, no blocking findings; stable hashes of 19 reviewed files, aggregate SHA-256 `14e61aee8d92c4f79d026442d21aea5c1dacedee47f1f158e5df884813145a33`. AC-01/02/03 covered; AC-04 external actions still pending. Reviewer authored none of the reviewed changes.
- No repository CI workflows or base check runs found. Remote PR checks will be inspected; absence is not a passing CI result.

Limits: no real isolated feature/hotfix/milestone execution or production deployment. No self-service force-reindex procedure found in skills.sh FAQ or inspected public CLI telemetry source; an upstream issue will request refresh/audits without promising completion.

## Delivery

- [PR #2](https://github.com/ltphat2204/compass/pull/2) verified MERGED at `d320c4d8bbee6ddc2452c3559d243429544f0569`; merge timestamp 2026-10-14T14:00:51Z. PR mergeable/CLEAN and remote check rollup empty; no CI pass claimed.
- Fresh temporary Git project installed current main once using `npx --yes skills@latest add https://github.com/ltphat2204/compass/tree/main --skill '*' --agent codex --copy --yes`: PASS, all 13 skill/resource files match byte-for-byte. No telemetry opt-outs set for this install; acknowledgment unverified. Temporary project removed.
- Public catalog observation: comp-engineer HTTP 200, current-description marker absent, cache STALE/age 13639; comp-implement HTTP 200, current-description marker present, cache STALE/age 9576. These do not establish cache root cause or complete snapshot integrity.
- [Old issue #2491](https://github.com/vercel-labs/skills/issues/2491) verified CLOSED after explanatory comment and link to replacement request.
- [Refresh request #2494](https://github.com/vercel-labs/skills/issues/2494) verified OPEN, requesting current-source snapshots/resources and applicable audit reruns while preserving slugs/history. Reindex/audits remain external pending, not delivered guarantees.
- User-authorized shipping/request outcomes complete. Archived in `dev/_archived/20261014/adaptive-workflow/` using user's timezone; all four artifacts preserved. Unrelated `example/` untouched.
