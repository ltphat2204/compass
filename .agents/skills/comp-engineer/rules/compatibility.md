# Compatibility Rules

Prefer backward-compatible changes to public APIs, shared interfaces, persisted data, serialized formats, configuration, and command-line contracts.

- Identify affected callers, consumers, stored records, and integrations before selecting an approach.
- Preserve existing behavior and accepted inputs where practical. For additive changes, keep old callers working through compatible defaults or optional fields when appropriate.
- If a breaking change is required by the agreed intent, identify it explicitly in the plan. Include affected consumers and a proportionate migration, deprecation, versioning, or rollback approach; do not silently assume consumers can update together.
- Plan verification for both the new behavior and relevant compatibility expectations, including old callers or existing data where applicable.
- During review, verify the implementation and checks against the plan's backward-compatibility decision. Record any deviation and its impact.
