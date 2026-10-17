# Maintainer checks and plugin submission

Compass is already distributed from this GitHub repository. Installing through its marketplace does not require acceptance into OpenAI's public Plugin Directory.

## Check a change

Run from the repository root:

```sh
python3 scripts/check_portability.py
python3 -m unittest discover -s evals -p 'test_plugin_package.py' -v
claude plugin validate --strict .claude-plugin/plugin.json
claude plugin validate --strict .claude-plugin/marketplace.json
```

For changes to installers or host adapters, also run the relevant tests in `evals/`. Package/discovery checks do not replace model workflow verification; record the checks actually performed in the pull request. Existing behavioral evidence and its limits are in [evaluation results](../evals/results.md).

## Release a GitHub marketplace update

1. Keep the version in `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json` aligned.
2. Check the package, then merge the release into `main`.
3. Verify a fresh install from `ltphat2204/compass`, including all nine skills and their resources.

The Codex catalog is `.agents/plugins/marketplace.json`; Claude uses `.claude-plugin/marketplace.json`. Both point at the repository root and use the canonical `.agents/skills/` instructions. Neither needs a separate hosted server.

## Submit to OpenAI's public directory

Build the submission ZIP:

```sh
python3 scripts/package_plugin.py
```

The output is `dist/compass-<version>.zip`. The script includes only the Codex manifest, all nine skills/resources, and the listing assets. It maps the canonical skills to root `skills/`, as required by the submission portal. It excludes repository history, project data, examples, and development evidence. An existing output is preserved; use `--output /path/to/new-file.zip` to choose a new filename.

Then use the [OpenAI Plugins portal](https://platform.openai.com/plugins):

1. Select the organization and verified developer identity that should own Compass. If identity verification asks for a default payment method, the account owner must complete that step in Platform.
2. Upload the ZIP as a skills-only plugin.
3. Resolve required metadata and skill scan findings. The bundled icon and listing text are in `.codex-plugin/plugin.json` and `assets/`.
4. Submit the draft for review and complete the required policy attestations.
5. After approval, publish the approved version from the portal.

Do not describe the directory listing as submitted, approved, or published until the portal confirms that state. Later skill/metadata updates require a new ZIP and the applicable review steps.

References: [submission requirements](https://developers.openai.com/plugins/deploy/submission), [package layout](https://developers.openai.com/plugins/build/plugins), [submission errors](https://developers.openai.com/plugins/deploy/submission-errors).
