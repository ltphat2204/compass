# Adaptive entry and outcome decomposition

Use this reference before choosing stages in `comp-engineer`, and when `comp-intent` receives an unclear or multi-outcome request. Routes select the next useful action; they are not new skills or weaker quality modes.

## Start from the request, not the document template

Determine from the request and focused repository evidence: requested action (explore, assess, plan, execute), outcome clarity, impact, and whether there is one independently verifiable outcome or several. State the inferred outcome and next action briefly. Do not make the user select a workflow, seniority level, architecture, or artifact format.

| Situation | First useful action | Continue / stop condition |
|---|---|---|
| “Start quickly”, clear bounded outcome | Propose the smallest useful end-to-end slice, reuse project defaults, and execute within authorization using light mode | Ask zero questions if criteria are already clear; escalate mode for actual risk, not task length |
| Tiny non-behavior correction (typo, broken documentation link) | Inspect references, edit, and run a focused check inline | No feature folder required unless repository rules require it; report outcome and evidence |
| “Fix this”, error or regression | Reproduce or inspect logs/callers; distinguish observed symptom, expected behavior, and root-cause hypothesis | Establish a regression criterion before the smallest shared fix; inability to reproduce is a limitation, not proof of cause |
| “I don't know what to build/change” | Reflect the pain or desired experience, inspect relevant existing flows, and offer a concrete example plus a recommended next step | Ask one question about the user's problem when needed; keep hypotheses in conversation until an outcome or bounded exploration is chosen |
| Uncertain feasibility or cause | Recommend a bounded spike with learning question, evidence, and stop criterion | Execute only when exploration is authorized; transition to production work only with accepted learning and revised scope |
| Milestone, epic, or multiple independent outcomes | Build a parent outcome map and dependency order, then prepare the first ready child | Use the decomposition rules below; do not turn a milestone into one giant implementation task list |
| Incident or urgent security/data failure | Inspect evidence and propose minimal containment, rollback, and recovery checks | Urgency does not authorize production mutations or bypass tests/review; separate containment from durable repair |
| Refactor, migration, performance, or dependency update | Establish preserved contracts and baseline; identify consumers, compatibility, and rollback needs | Measure the claimed improvement or equivalence; stage irreversible migration separately |
| Continue existing work, failed checks, or changed requirements | Read existing artifacts and current evidence; resume at the first invalid or missing gate | Preserve valid work; reopen only affected criteria/tasks/reviews, applying full source revision rules for frozen-test changes |
| Review, explanation, analysis, or planning only | Produce the requested assessment or plan | Do not advance into implementation, shipping, artifact repair, or experiments without authorization |

The direct correction route is restricted to low-risk work that changes no runtime behavior, public contract, business rule, security/data policy, or operational configuration. It performs intent, impact, verification, and handoff in the conversation; do not invoke downstream artifact-requiring skills with missing inputs. Every other execution route uses existing light/standard/spike artifacts and gates. A one-line security fix is not a direct correction.

“Quick” reduces ceremony, not safeguards: keep light intent/plan/tasks/walkthrough concise, use known decisions, and continue authorized stages without asking the user to invoke each skill. Behavior changes still require independent validated frozen tests and test-read guidance and sanitized contexts. Check required delegation capabilities before promising implementation; missing host isolation alone does not block work. If required delegation is unavailable, complete useful authorized diagnosis/specification/planning and explicitly report implementation BLOCKED, never DONE. Do not invent a new isolation runtime as part of the user's feature.

## Let AI do the thinking, keep the user oriented

Lead with a concrete before/after scenario, the recommended choice, and its main tradeoff. Ground recommendations in evidence; distinguish observed facts, proposed assumptions, and agreed decisions. Infer technical choices from the repository and challenge weak assumptions proactively. Ask the user for desired outcomes, material business choices, or unavailable facts, not for solutions AI can derive.

Default to a short explanation of what will change, why, and how success will be observed. For a newcomer, unpack unfamiliar concepts through the actual scenario and explain representative verification after implementation closes. For an experienced developer, stay concise while surfacing consequential alternatives, edge cases, and failure/recovery implications. Adapt to the conversation or stated preference; do not require a teaching mode or quizzes, and do not expose private frozen-test details to implementers. User understanding is supported by explanations, not an extra approval gate.

For ambiguity, offer a falsifiable hypothesis or concrete example instead of a blank requirements questionnaire. Do safe independent investigation while a material question is pending. Do not build a guessed product, create speculative feature folders, or equate silence with acceptance. A request to explore uncertainty authorizes bounded discovery; it does not authorize production integration.

## Milestones are parents of independently verifiable intents

Decompose when outcomes have separate acceptance/release decisions, materially different risks, or dependencies that benefit from separate delivery. Do not split merely by number of files or architectural layer. A cohesive feature spanning UI/API/database can remain one intent. Avoid recursive portfolio hierarchies: one parent and child intents normally suffice.

Use the established artifact root. By default keep parent coordination in `dev/{milestone-slug}/intent.md` and child folders as siblings, e.g. `dev/{milestone-slug}-invite-member/`. Parent intent contains:

- Milestone outcome, exclusions, shared constraints/contracts, and observable milestone criteria with stable IDs.
- A child table: stable child ID, outcome, criterion coverage, artifact path, dependencies, status, and delivery evidence.
- Cross-child integration/release checks with coordinator ownership, pending/pass/fail status and evidence; unresolved decisions; and the recommended next child.

Use ordinary Markdown; no new manifest or tooling is needed. Reuse existing parent documents when present. Parent rows start PROPOSED, become READY once child requirements are ready, then IN_PROGRESS, BLOCKED, DELIVERED, or SUPERSEDED with reasons. These are coordination states, not substitutes for child task statuses. Planning a child does not deliver it, and task percentages must not be presented as milestone outcome completion.

1. Derive child slices from user journeys/results, each with an observable acceptance boundary. Example: “team workspace milestone” might deliver create workspace, invite/join with access rules, and revoke member access. Split only if those outcomes are actually in scope. Record necessary technical enablers as dependencies with a consumer/check; do not invent standalone value for every database/API/UI layer.
2. Map every parent criterion to one or more children or an integration check. Give each child its own acceptance IDs and parent references. Assign shared contract ownership and check compatibility at integration boundaries.
3. Order the dependency graph; resolve cycles by regrouping coupled slices or settling their shared contract. Start with the smallest useful ready outcome or a bounded investigation of a dependency that blocks it. Parallelize only disjoint dependency-ready work when authorized and supported.
4. Detail only the next ready child with `comp-intent` → `comp-plan` → `comp-tasks`; keep later rows at outcome level until evidence justifies planning. Each executable child passes existing requirements, consistency, testing, review, and delivery gates. A ready parent does not make all children ready.
5. Match execution authority: for a planning-only request, stop at the map/plan. For an authorized milestone implementation, proceed through ready children without redundant permission requests. Decomposition does not authorize new scope, production actions, or changing a consequential business decision. When one child blocks, proceed with independent authorized children if useful.
6. After child delivery, update the parent with actual evidence/path and next step; feed findings back into remaining scope and dependencies. Preserve IDs, completed evidence, user edits, and supersession reasons. Reopen affected children/integration checks when requirements or shared contracts change; follow existing frozen-test revision rules.
7. Complete the parent only when every active in-scope child is delivered and milestone integration/release criteria have evidence. A scope reduction requires user agreement; superseding a child must not silently drop its parent criteria. Local delivery is not production rollout. Record pending external acceptance explicitly.
8. Archive each child in the same workflow once its own delivery/completion gates pass; update parent links to its verified archived path. A DELIVERED child with archive pending is not lifecycle-complete. Never archive an unfinished parent or move active children with a completed sibling. Archive the parent after milestone acceptance, preserving child and integration evidence links.

The delivery loop is evidence → next ready outcome → verification → feedback, not a mandatory restart of six stages. If feedback changes the desired outcome, revisit intent; if implementation is defective, fix implementation; if a frozen test must change, revise intent/plan and re-freeze under the existing policy.
