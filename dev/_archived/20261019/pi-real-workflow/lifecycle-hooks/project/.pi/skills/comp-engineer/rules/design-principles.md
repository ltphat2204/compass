# Design Principles

Use these as decision aids when choosing an approach. They are not mandatory patterns: follow repository and language conventions, and apply a principle only when it improves the solution to the actual task.

- **KISS (Keep It Simple):** choose the clearest approach that meets the requirements. Avoid cleverness and unnecessary moving parts without omitting required behavior or safeguards.
- **YAGNI (You Aren't Gonna Need It):** solve current requirements; avoid speculative features, configuration, extension points, and abstractions. Preserve required validation, security, and error handling.
- **DRY (Don't Repeat Yourself):** maintain one authoritative representation of knowledge that must stay in sync. Similar-looking code is not necessarily the same knowledge or behavior.
- **AHA (Avoid Hasty Abstractions):** tolerate local duplication when it keeps behavior clear; extract a shared abstraction when real repetition or a common rule is established and the abstraction makes future changes safer.
- **Single Responsibility / Separation of Concerns:** keep components cohesive around a focused responsibility and separate concerns when that clarifies ownership or change boundaries.
- **SOLID (when relevant):** use object-oriented design principles to reason about responsibility, substitution, interfaces, and dependencies where those concerns exist. Do not add interfaces or layers just to satisfy the acronym.
- **Least Surprise:** prefer behavior, names, and interfaces that are predictable to callers and consistent with project conventions.

In `plan.md`, record only the principles that materially informed an approach decision, with a brief rationale and relevant trade-off. Do not include a boilerplate list of principles that did not affect the plan.
