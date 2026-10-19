# Code Quality Rules

Apply these rules to code changed for the assigned task and its affected callers. Follow repository and language conventions when they are more specific.

## Rules

- Do not use emoji in source code, comments, documentation, commit messages, logs, terminal output, or user-facing text.
- Use names that make intent clear. Keep functions and modules focused, and split them when it improves clarity or reduces complexity.
- Prefer straightforward control flow; use guard clauses where they make the main path easier to follow. Name meaningful thresholds and limits.
- Prefer pure functions and immutable updates where they fit the language and codebase. Keep necessary mutation and side effects explicit and localized.
- Make shared and public interfaces clear using the project's type conventions. Validate untrusted data at system boundaries and reuse existing schemas or helpers.
- Handle failures explicitly, preserve useful error context, and avoid silently swallowing errors.
- Use comments to explain why a non-obvious choice is necessary, not to restate what the code does.
- In review, flag concrete correctness, safety, compatibility, or maintainability impact; do not require stylistic changes based only on personal preference.

Treat long functions, deep nesting, duplicated logic, and unexplained literals as review signals, not fixed numeric limits. Refactor only when it improves the changed code without expanding scope unnecessarily.
