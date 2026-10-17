# Installation and updates

[Back to the quick start](../README.md#install). Install once per coding agent: use the native plugin for Codex or Claude Code, or copy the skills for another host. Do not install both routes into the same host/project.

## Codex plugin

```sh
codex plugin marketplace add ltphat2204/compass
codex plugin add compass@compass
```

Open a new session and use `$compass:comp-engineer` or the skill picker. The plugin is enabled for your user and reads all nine skills/resources from its installed cache. It needs no clone, Python, MCP server, or hooks.

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

Use `/compass:comp-engineer`. This includes the nine skills and Claude's native test-author, implementer, and reviewer roles.

Update or uninstall through Claude Code's `/plugin` manager. For development only, load a checkout with `claude --plugin-dir /absolute/path/to/compass` and use `/reload-plugins` after edits.

## Copied skills

From your target project:

```sh
npx skills add ltphat2204/compass --skill '*' --copy
```

Choose the agent when prompted. To skip the agent prompt, append `--agent cursor`, `--agent github-copilot`, or `--agent opencode`. Keep all nine skills together because their references cross skill directories. This route installs skills/resources, not native agent roles.

For updates, run `npx skills update` from the target project. Use `npx skills remove` to select and remove a copied installation. Review local customizations before updating.

## Project installation with native roles

Use this route if you need project-owned files or native roles for Codex, Claude Code, or OpenCode. Requires Python 3.9+.

```sh
git clone https://github.com/ltphat2204/compass.git
cd compass
python3 scripts/install.py --agent codex --project /absolute/path/to/project
```

Replace `codex` with `claude`, `cursor`, `copilot`, or `opencode` as needed. The target project must already exist. The installer has no global mode and does not change host configuration.

| Host | Skills | Native roles |
|---|---|---|
| Codex | `.agents/skills/` | `.codex/agents/` |
| Claude Code | `.claude/skills/` | `.claude/agents/` |
| Cursor | `.cursor/skills/` | Shared packets |
| GitHub Copilot | `.github/skills/` | Shared packets |
| OpenCode | `.opencode/skills/` | `.opencode/agents/` |

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
- **Host support:** Codex, Claude Code, and OpenCode have recorded workflow checks. Cursor and Copilot project packages are supported, but their runtime workflows remain unverified. See [verification results](../evals/results.md).

For detailed host mappings, see [Host Integration](../.agents/skills/comp-engineer/references/hosts.md). Optional SkCC/skill-sync integrations are not required for installation; the example configuration remains in [integrations/](../integrations/skill-sync.conf.example).

References: [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins), [Claude plugins](https://code.claude.com/docs/en/plugins), [skills CLI](https://github.com/vercel-labs/skills).
