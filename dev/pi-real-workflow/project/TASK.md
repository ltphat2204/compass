# Task

Add a small task-title utility to this disposable JavaScript project.

Public contract:

- Export `normalizeTaskTitle(value)` from `src/task-title.mjs`.
- Reject non-string input with `TypeError`.
- Trim leading and trailing whitespace and replace each internal run of Unicode whitespace with one ordinary space.
- Preserve letters' case and punctuation.
- Reject a title that is empty after trimming with `Error`.

Keep the implementation dependency-free and verify it with Node's built-in test runner.
