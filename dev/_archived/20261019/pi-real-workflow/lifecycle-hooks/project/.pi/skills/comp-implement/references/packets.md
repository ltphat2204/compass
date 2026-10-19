# Portable role packets and handoffs

Read when dispatching a worker, validating tests, reviewing a snapshot or resuming on another host. Roles are responsibilities, not fixed tool names. Use the current host's exposed tools and [capability preflight](../../comp-engineer/references/hosts.md#stage-capability-preflight); native role metadata does not grant execution authorization.

## Common envelope

Every assignment supplies role, task/criterion IDs, concrete outcome, working directory, source revision or relevant hashes, dependencies/contracts, applicable instructions, allowed read context, exact write scope and exclusions, expected deliverable, permitted checks, current gate identities and stop conditions. Use actual installed paths. State the host concurrency limit observed for this session; do not copy another host's limit.

Deliver actual content inline or through a location the recipient can demonstrably read. Sender-local stores, handles and in-memory state are not cross-agent transport unless recipient access is verified. For a reviewer without file tools, courier readable plaintext of the complete relevant snapshot and execution evidence; omit unrelated workflow references, and confirm receipt before accepting a gate. A path, hash or compressed payload without usable decoding/access is not the snapshot.

The coordinator owns intent/plan/tasks/walkthrough, shared integration, dispatch and DONE. Workers return files/diff, decisions, commands with working directories and observed results, limitations and blockers. They do not spawn more agents, modify shared artifacts, commit/push/merge/deploy or expand scope unless separately authorized in the assignment. A worker report is evidence to inspect, not approval.

## Role-specific inputs and outputs

| Role | Input / permitted context | Write scope / output | Stop conditions |
|---|---|---|---|
| Test author | Fresh minimal agreed criteria, public contracts/examples, applicable instructions and runner conventions; no implementation internals/proposal or conversation fork | Assigned private suite/resources before freeze; criterion-to-assertion mapping, inventory and actual harness/control results | Ambiguous expected behavior, missing contract/ownership; frozen-suite changes require full source revision |
| Implementer | Fresh public criteria, sanitized plan, production source/callers, opaque validated-freeze identity and explicit test-read guidance | Assigned production files only; diff, permitted non-test checks and blockers | Missing freeze/context/dependency evidence, scope expansion, or private-test leak; never inspect/edit/run the frozen suite |
| Test reviewer | Fresh complete agreed intent/plan with identities, actual suite/resources/contracts and coordinator-run spec-derived correct/defective controls | Read-only source-to-assertion and assertion-to-source mapping; PASS/BLOCKED tied to exact identities | Author conflict, unsupported expectations, missing rule coverage, meaningful runner/control evidence or unstable inputs |
| Final reviewer | Fresh stable code/artifact snapshot, criteria, affected callers/tests and coordinator evidence | Read-only compliance and quality findings, reviewed identities, READY/CHANGES REQUIRED/PENDING REVIEW | Author conflict, missing required evidence/review, changed snapshot or gate violation |

The [strict testing contract](testing.md) defines the mandatory validation/freeze and full revision rules. Neither a role prompt nor separate directories enforce secrecy. Shared filesystems are supported; host-enforced restrictions are additional protection, not a prerequisite. Use new minimal contexts; inheriting the coordinator's full conversation does not satisfy the implementer boundary.

## Cross-host resume

The coordinator reads existing artifacts and reconciles their actual files before preparing the next packet. Preserve artifact root, task/criterion IDs, completed work, decisions, pending gates, source/suite identities and evidence links. Do not restart or renumber because invocation syntax or host changed. A new host must pass the relevant stage preflight; old host capability observations do not transfer.

```text
Role / task and criterion IDs / outcome:
Workspace / artifact root / baseline identities:
Accepted dependencies and public contracts:
Allowed production context and applicable instructions:
Write scope / excluded files and resources:
Validated freeze: opaque version/status/identity only:
Test-read guidance: excluded private paths, source-scoped searches:
Permitted non-test checks / working directory:
Required review and stop conditions:
Return: actual files/diff, commands/results, decisions, limits and blockers:
```

This is the implementer-facing handoff. Keep full tasks/walkthrough, suite inventories containing private case details, assertions, fixtures, test-author/reviewer messages, logs and test history in coordinator/reviewer context. Return sanitized criterion-level feedback only. If private details leak, stop the worker, correct the packet and use a fresh context; a later instruction cannot erase leaked context.

For reviewers, supply the full relevant evidence separately against a stable snapshot. On resume, revalidate file/suite identities and changed inputs before reusing an approval. Pending integration or mandatory independent/human review remains pending across hosts; never convert an unavailable check into a pass.
