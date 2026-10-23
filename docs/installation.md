# Installation and updates

[Back to the quick start](../README.md#install). Install once per coding agent: use the native plugin for Codex or Claude Code, or copy the skills for another host. Do not install both routes into the same host/project.

## Codex plugin

```sh
codex plugin marketplace add ltphat2204/compass
codex plugin add compass@compass
```

Open a new session and use `$compass:comp-engineer` or the skill picker. The plugin is enabled for your user and reads all nine skills/resources from its installed cache. The repository marketplace plugin also bundles four optional lifecycle hooks, requiring Python 3.9+ and a host with native hook support. Review and trust them through Codex's `/hooks` before relying on them. Skills remain usable without hooks, a clone, Python, or an MCP server.

Update:

```sh
codex plugin marketplace upgrade compass
codex plugin add compass@compass
```

Check or remove:

```sh
codex plugin list --marketplace compass
codex plugin remove compass@compass
```

Optionally remove the source after uninstalling with `codex plugin marketplace remove compass`.

## Claude Code plugin

Run inside Claude Code:

```text
/plugin marketplace add ltphat2204/compass
/plugin install compass@compass
```

Use `/compass:comp-engineer`. This includes the nine skills, Claude's native test-author, implementer, and reviewer roles, and four lifecycle hooks. Hook commands require Python 3.9+; inspect or manage them using `/hooks`.

Update or uninstall through Claude Code's `/plugin` manager. For development only, load a checkout with `claude --plugin-dir /absolute/path/to/compass` and use `/reload-plugins` after edits.

## Lifecycle hooks

The repository marketplace plugins discover `hooks/hooks.json` automatically. The four hooks provide request routing, frozen-test protection, stale-evidence detection, and a completion gate. Request routing supplies conditional guidance to `comp-engineer`; it does not classify prompts with keywords, run all nine skills, create a Codex Goal, or grant implementation authorization.

The execution safeguards use coordinator-owned `.compass/hooks.json` in the target project. Without that state, only intake adds context. See [the state, snapshot, and completion contract](../.agents/skills/comp-engineer/references/hooks.md) for activation and limitations. Hooks never install themselves into host settings or execute the project's test commands.

Copied skills and the project installer do not install runtime hooks. The public submission ZIP also remains skills-only. On those routes, follow the same workflow gates manually unless you separately register a supported adapter. Native hook availability and trust depend on the current host.

### OpenCode 2

Keep a checkout of Compass, install its skills using one of the routes below, and add its adapter directory to the target project's `opencode.json` or `opencode.jsonc`, preserving existing configuration:

```json
{
  "plugins": ["/absolute/path/to/compass/integrations/opencode"]
}
```

Use the directory, which contains `index.js`. OpenCode 2.0.32 skips a configured file path such as `compass.js`. Keep the checkout in place: the adapter resolves the shared Python runtime from it. No additional npm package or global settings change is required. This adapter targets OpenCode 2, not the earlier OpenCode 1 role integration.

OpenCode maps prompt/tool events to the same four checks. Its completion check runs after `session.execution.succeeded` and can queue one same-session continuation per external prompt; it is not a synchronous Stop veto. A repeated invalid attempt stays unverified without another automatic prompt. The model may report a blocker without changing the state marker, so `status: complete` alone never means verification passed.

Native checks on this machine passed all four hooks on Codex CLI 0.162.1, Claude Code 2.1.302, and OpenCode 2.0.32. Pi's separate extension adapter was exercised on Pi CLI 1.3.0 alongside a full Compass skills workflow. See [runtime observations and limits](../evals/results.md); these bounded checks do not guarantee other versions, models, or desktop surfaces.

### Pi extension

See the [Pi Agent setup guide](pi-agent.md) for required capabilities and a Pi preflight checklist.

Keep a Compass checkout and load its Pi extension explicitly for each session:

```sh
pi --extension /absolute/path/to/compass/integrations/pi/compass.ts
```

Install the skills separately with `python3 scripts/install.py --agent pi --project /absolute/path/to/project`. The extension uses Pi's `before_agent_start`, `tool_call`, `tool_result` and `agent_before_settle` events to run the shared Compass checks. Its completion gate can request one final continuation and then leaves an explicit unverified warning; it is not an atomic stop veto. The checkout must remain available, and Pi must trust and load the extension. Pi extensions run with the operating-system permissions of the Pi process.

## Copied skills

From your target project:

```sh
npx skills add ltphat2204/compass --skill '*' --copy
```

Choose the agent when prompted. To skip the agent prompt, append `--agent cursor`, `--agent github-copilot`, or `--agent opencode`. Keep all nine skills together because their references cross skill directories. This route installs skills/resources, not native agent roles or runtime hooks.

For updates, run `npx skills update` from the target project. Use `npx skills remove` to select and remove a copied installation. Review local customizations before updating.

## Project installation with native roles

Use this route if you need project-owned files or native roles for Codex, Claude Code, or OpenCode. Requires Python 3.9+.

```sh
git clone https://github.com/ltphat2204/compass.git
cd compass
python3 scripts/install.py --agent codex --project /absolute/path/to/project
```

Replace `codex` with `claude`, `cursor`, `copilot`, `opencode`, or `pi` as needed. The target project must already exist. The installer has no global mode and does not change host configuration. Pi receives skills in its native `.pi/skills/` project directory; its lifecycle extension is loaded separately as described above.

| Host | Skills | Native roles |
|---|---|---|
| Codex | `.agents/skills/` | `.codex/agents/` |
| Claude Code | `.claude/skills/` | `.claude/agents/` |
| Cursor | `.cursor/skills/` | Shared packets |
| GitHub Copilot | `.github/skills/` | Shared packets |
| OpenCode | `.opencode/skills/` | `.opencode/agents/` |
| Pi | `.pi/skills/` | Shared role packets |

Use the same `--agent` and `--project` with one operation:

| Option | Action |
|---|---|
| `--dry-run` | Preview an installation without writing |
| `--check` | Check the installed payload |
| `--update` | Update managed files |
| `--uninstall` | Remove managed files |

Append `--dry-run` to update or uninstall to preview it. Ownership records live in `.compass/install-<host>.json`; changes to tracked files, unowned collisions, and unsafe paths block the operation. Back up or reconcile customizations before retrying. Legacy copies without ownership metadata are not adopted automatically.

## Troubleshooting

- **`codex plugin` is unknown:** update Codex, or use copied skills/project installation.
- **Skills do not appear:** open a new session; restart the desktop app if needed. In Codex, check `codex plugin list --marketplace compass`.
- **Duplicate skills:** keep either the plugin or copied/project installation for that host. Remove the extra route using the tool that installed it; preserve customizations first.
- **Implementation is blocked:** behavior changes require fresh test-author, test-review, and implementation subagents. Installation alone does not provide these host capabilities. Planning and review remain available.
- **Host support:** Codex, Claude Code, OpenCode, and Pi have recorded workflow and hook checks. Cursor and Copilot project packages are supported, but their runtime workflows remain unverified. See [verification results](../evals/results.md).

For detailed host mappings, see [Host Integration](../.agents/skills/comp-engineer/references/hosts.md). Optional SkCC/skill-sync integrations are not required for installation; the example configuration remains in [integrations/](../integrations/skill-sync.conf.example).

References: [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins), [Claude plugins](https://code.claude.com/docs/en/plugins), [skills CLI](https://github.com/vercel-labs/skills).
