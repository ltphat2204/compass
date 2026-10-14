# Plan: Adaptive Compass workflow

1. Update routing and milestone handoffs → verify source consistency and independent instruction-level scenarios (AC-01/02).
2. Explain motivation and hotfix tests in all three READMEs; bump plugin to 0.3.0 → review language parity and validate packaging (AC-03).
3. Review a stable snapshot and ship PR → verify installer tests, frontmatter/local links, Claude manifest/roles and Git whitespace; inspect remote checks before authorized merge (AC-01/02/03/04).
4. Close old reindex request as superseded, submit one current-source refresh request → verify issue state and request URL; catalog refresh remains externally pending (AC-04).

Risk: documentation/instruction changes, no runtime implementation. Fresh independent final reviewer required by shipping workflow when available. Historical evaluations are evidence of simulated decisions, not proof of real milestone delivery. No application behavior test freeze/isolation claimed for this instruction release.

Consistency and execution availability are reported separately. Delivery target: origin/main via PR; merge expressly authorized. Use GitHub issues for publisher refresh requests if no supported self-service action is documented. Archive only after confirmed merge, preserving evidence.
