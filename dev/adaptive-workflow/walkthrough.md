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

PR/merge and upstream issue actions pending. Coordinator will append verified outcomes after each action.
