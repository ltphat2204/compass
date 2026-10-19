# Pi lifecycle adapter verification

## Runtime

- Pi CLI 1.3.0; Node.js 26.9.0.
- The existing `antigravity/gemini-3.8-flash-tiered` model was retained.
- Compass skills were installed in the fixture project's `.pi/skills/`; the adapter was loaded with `pi --extension /absolute/path/to/compass/integrations/pi/compass.ts`.
- Each check ran in a separate non-session Pi invocation. Raw session output is kept outside the repository.

## Observed events

| Pi event | Compass check | Result |
|---|---|---|
| `before_agent_start` | `UserPromptSubmit` | Conditional Compass intake appeared in the model context. |
| `tool_call` | `PreToolUse` | A write to `tests/frozen.test.mjs` was blocked. SHA256 remained `33976666f362ff820b371f720f54e95386cc29a71d9d5371ccb8b240b194979f`. |
| `tool_result` | `PostToolUse` | An allowed write to `src/value.mjs` completed and the tool result received stale verification/review warnings. |
| `agent_before_settle` | `Stop` | Missing verification/review evidence caused one continuation; the second invalid attempt appended a visible unverified warning. Two agent starts were observed. |

This verifies native event wiring and shared-dispatcher behavior on one Pi CLI version. Pi extensions run with Pi's process permissions; the completion gate is a bounded continuation, not an atomic veto.
