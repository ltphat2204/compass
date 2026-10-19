# Compass hook labels

Mode: light. Risk: low (hook progress metadata and aligned patch versions).

The user requested branded, feature-oriented names for Compass lifecycle hooks across Codex, Claude Code, OpenCode, and Pi. Codex and Claude Code share `hooks/hooks.json`; OpenCode and Pi use native adapters and do not expose equivalent per-hook review-list labels. Preserve those adapters and their existing Compass-branded runtime messages.

## Acceptance criteria

- AC-01: Codex's hook review list displays a distinct `Compass`-branded, responsibility-oriented label for each of the four lifecycle events, using the host-supported `statusMessage` field.
- AC-02: Claude Code continues to accept the shared hook configuration and gets distinct progress messages for the same four events.
- AC-03: OpenCode and Pi lifecycle behavior remains unchanged; their existing adapter and dispatcher messages remain Compass-branded.
- AC-04: Codex and Claude plugin versions remain aligned for the marketplace patch release.

User confirmed the labels appeared correctly in Codex after reloading the plugin.
