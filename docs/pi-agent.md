# Pi Agent

This guide covers the Pi setup needed to use Compass's full workflow. Compass skills, subagents, and lifecycle checks are separate capabilities; installing one does not install the others.

## Required for the full workflow

1. **Install all nine Compass skills in the project.** From the Compass checkout, run:

   ```sh
   python3 scripts/install.py --agent pi --project /absolute/path/to/project
   ```

   The project should contain `.pi/skills/`. Start with `/skill:comp-engineer`.

2. **Load the Compass lifecycle adapter** when you want automated intake, frozen-resource checks, stale-evidence feedback, and completion checks:

   ```sh
   pi --extension /absolute/path/to/compass/integrations/pi/compass.ts
   ```

   Keep the Compass checkout available. The target project also needs an active, valid `.compass/hooks.json` for execution safeguards. The adapter requires Python 3.9+ and Pi's native extension support. Its completion event allows one continuation, then reports the work as unverified; it is not an atomic stop veto. If the adapter is not loaded, follow the same gates manually.

3. **Load a working Pi Subagents v3 runtime** to pass Compass's strict behavior-change gate. In the active Pi session, confirm the main agent exposes `subagent_spawn`, `subagent_wait`, and `subagent_send`; an entry in `pi list` alone does not prove that the tools loaded. Compass uses separate jobs for test authoring, independent test review, implementation, and final review. Without delegation, Pi can still perform intake, planning, analysis, and permitted review, but behavior implementation stays blocked by the strict gate.

   Pi Subagents v3 is not the legacy npm runtime. Its current upstream install instructions build the package before installing it:

   ```sh
   git clone https://github.com/narumiruna/pi-extensions.git
   cd pi-extensions
   npm install
   npm --workspace @narumitw/pi-subagents run build
   pi install ./packages/pi-subagents
   ```

   See the [Pi Subagents installation and tool reference](https://github.com/narumiruna/pi-extensions/tree/main/packages/pi-subagents).

## What Pi users need for Compass

| Capability or extension | Requirement | Purpose |
|---|---|---|
| Compass skills in the project | Required | Provides all nine Compass skills. Install them to `.pi/skills/` with the command above. |
| Pi Subagents v3 | Required for strict behavior-change implementation | Provides separate test-author, test-reviewer, implementer, and final-reviewer jobs. Confirm `subagent_spawn`, `subagent_wait`, and `subagent_send` are available in the active session. |
| Compass lifecycle adapter at `integrations/pi/compass.ts` | Required for automated lifecycle checks | Connects Pi's native events to Compass intake, frozen-resource, stale-evidence, and completion checks. It is included in the Compass checkout; it is not a third-party package. |
| CodeGraph extension | Optional | Helps trace code symbols and callers. Targeted source search is an alternative. |
| Other Pi extensions | Optional | Memory, general guardrails, generic hook managers, and coding guidance can be useful, but Compass does not depend on them. |

Pi Subagents v3 is not the legacy npm runtime. Use the build-and-install instructions above, then check the tools in the active session; package installation alone does not prove runtime loading.

Pi extensions and child tools run with the operating-system permissions of the Pi process. Review extension sources and keep delegated tool access scoped to each job; subagent separation does not provide OS-level isolation.

## Pi preflight for Compass

Before behavior implementation, Pi should report whether the current session has:

- all nine Compass skills discoverable from the project;
- the Compass adapter loaded and active `.compass/hooks.json` present, if automated lifecycle checks are expected;
- the Pi Subagents v3 tools `subagent_spawn`, `subagent_wait`, and `subagent_send` available for the strict test and review workflow;
- the actual model, tools, context boundaries, and permissions needed by the next stage.

If a capability is missing, name the affected gate and continue only with independent stages that remain valid. Do not infer readiness from Pi version, package installation, or another session's report. See [Compass host capability preflight](../.agents/skills/comp-engineer/references/hosts.md#stage-capability-preflight) for the full stage rules.
