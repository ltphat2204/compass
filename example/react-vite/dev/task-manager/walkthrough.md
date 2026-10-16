# Walkthrough

## Test workflow
Separate test-author, fresh independent reviewers, frozen suite and sanitized implementer context. Subagents may share filesystem/checkout/host permissions; implementer is instructed not to inspect tests. Coordinator owns test execution and evidence.

## TASK-01 — DONE
Official command: pnpm create vite <temporary target>/react-vite --template react-ts --no-interactive --no-immediate. create-vite interpreted the absolute target relative to cwd; copied its actual generated files without overwriting PRD/history, then removed only the temporary generated directory. Dependencies installed with pnpm; lockfile retained.
Files: package.json:1, pnpm-lock.yaml:1, src/: scaffold, Vite/TypeScript/Oxlint configs. Added typecheck script (tsc -b).
Verification: pnpm build, pnpm typecheck, pnpm lint all passed in example/react-vite. Review: coordinator self-review, prerequisite scaffold only; no product behavior claimed.

## Planning
PRD remains intent; plan/tasks cover AC-01–AC-07. Consistency self-check: READY; independent test review pending. Public module contract recorded before authoring. No product acceptance checks executed yet.

## comp-analyze — consistency
Read-only review of PRD, plan and tasks: AC-01–AC-07 each map to test/review/implementation/delivery; no uncovered criteria or out-of-scope task found. Planning coverage READY; execution may proceed once independent test validation/freeze pass. Not a runtime acceptance result.

## TASK-02/03 — pre-freeze attempt 1
Coordinator ran `pnpm test:controls`: 4/4 PASS; `pnpm test:browser --list`: 9 collected. `pnpm test` fails missing src/tasks.ts, expected before implementation, not acceptance evidence.
Independent reviewer test_review identified missing controls for schema/initialization/transitions and missing browser assertions for empty messages, labels, failure reporting and complete CRUD network. Test validation BLOCKED; author correcting candidate before freeze. No behavior implementation started; no frozen suite modified.

## TASK-02/03 — pre-freeze attempt 2
Test author revised four candidate files before freeze. Coordinator: `pnpm test:controls` 7/7 PASS; browser collection 12 tests. Controls now cover schema, initialization, transitions/filtering, title/order/storage rules. Public nonempty-ID rule explicitly clarified in PRD and contract before freeze, within user-authorized product decisions. Fresh reviewer test_review_v2 validating this stable candidate. Chromium installed for actual browser execution. No product implementation yet.

## TASK-02/03 — DONE
Fresh independent test reviewer `/root/test_review_v2` returned Test validation PASS for PRD/plan and all test resources; authored none. Its bidirectional criterion/source/assertion/control review covers AC-01–AC-07; visual/complete keyboard checks reserved for delivery. Coordinator execution: 7 controls PASS, 12 browser tests collected. Immutable snapshot inventoried in test-freeze.json including source specs, configs, package/lock and tests. Test gate FROZEN v1. Implementer receives a fresh sanitized context and instructions not to inspect test resources. Implementation receives public criteria/contracts only.

## Frozen v1 acceptance attempt — harness failure; implementation paused
Coordinator domain tests 8/8 PASS, browser 9/12 PASS. Three failures: one check/uncheck action awaited a removed checkbox although filtering behaved correctly; two generic success substring assertions matched an error about stored corrupt data. Frozen inventory hashes still PASS after run. No test was changed in place under v1. Complete PRD/plan revision 2 reviewed with unchanged product rules; retained v1 suite/source/config archive and manifest. TASK-02/03 reopened; implementation/delivery paused pending replacement independent validation/freeze. Source assets unused by production removed by coordinator (scaffold-only files).

## Replacement v2 freeze — TASK-02/03 DONE
Reviewer replacement_review independently read complete revision2 sources and candidate, compared preserved v1 and returned PASS. Changed harness retains disappearance/persistence assertions and distinguishes explicit success from saved-data failure descriptions. Coordinator controls 8/8 PASS, browser collection 12. Frozen inventory v2 in test-freeze.json includes all tests, source specs, dependencies and configs. Reconciled source/task coverage READY. No product changes required by harness failures.

## Manual browser evidence
Playwright-driven keyboard-only actions on dev server 5173: add via Enter, Tab/Space toggle, edit via keyboard and save, reload equality, delete cancellation then confirmed delete all PASS. No pageerror or fetch/XHR requests observed. Screenshots /tmp/compass-react-vite-360.png and -1280.png visually inspected: controls/text fit, no overlap/clipping, expected wrapping and focus styling. Build/typecheck PASS; lint exit0 with state-in-effect initialization warning, final review pending.

## Acceptance v2 — PASS
Coordinator `pnpm test`: 8/8 PASS; `pnpm test:browser`: 12/12 PASS in Chromium. Covers AC-01–AC-05 domain/storage/CRUD, AC-06 responsive/keyboard/literal HTML and AC-07 no business fetch/XHR across journeys. Frozen v2 full inventory verified before/after execution. Build/typecheck passed on current production source after removal of unused starter assets; lint exit0 with one guarded external-storage initialization warning. TASK-04 awaits independent data/public-contract/final review before DONE.

## Independent validation evidence — retained pre-freeze and delivery mapping
Test author: /root/test_author. Pre-freeze reviewer v1 candidate: /root/test_review_v2, PASS after correcting first candidate gaps. Replacement v2 reviewer: /root/replacement_review, PASS after complete PRD/plan revision and preserved v1. Both authored none of reviewed tests/implementation. Coordinator executed controls 7/7 for v1, 8/8 for v2 and collection 12 cases. Suite/source/config identities are the complete SHA256 inventories in test-freeze-v1.json and test-freeze.json; v1 resources retained in test-suite-v1.tar.gz.

| Criterion / agreed source + rationale | Actual assertion path / helper | Positive and defective control evidence | Delivery evidence / finding |
| --- | --- | --- | --- |
| AC-01, PRD storage: fixed three mixed samples, seed once, saved [] stays empty | tests/domain.test.ts + domain-cases.ts initializationCases; browser delete-all/reload | controls.test.ts accepts reference initialization; rejects two seeds, reseeding [] and repeated saves | 8 domain + 12 browser PASS; covered |
| AC-02, PRD flows/data: CRUD, cancel unchanged, stable ID/date | browser.spec.ts CRUD/cancel/toggle; domain-cases.ts editTransition/cancellationTransition | controls.test.ts accepts reference transitions, rejects identity drift, destructive cancellation and no-op toggle | Browser and keyboard flow PASS; covered |
| AC-03, PRD title rules: trim, preserve internal whitespace, 1–200 code points, duplicates | domain-cases.ts titleCases; domain.test.ts duplicate-title/schema; browser add/edit rejection | controls.test.ts accepts canonical validator, rejects UTF-16 counts and missing trim | Domain/browser PASS; covered |
| AC-04, PRD ordering/filter/empty: newest then ID, unchanged storage on filters, disappearing rows, distinct empty text | domain-cases.ts orderCases/filterTransition; browser.spec.ts order/filter/empty assertions | controls.test.ts accepts immutable ordering/filter references; rejects missing tie break, source mutation and reversed filter | Domain/browser PASS; covered |
| AC-05, PRD storage + public parser: invalid JSON/schema/canonical title/ID/date rejected without overwrite | domain-cases.ts schemaCases/storageCases; domain.test.ts rejection matrix; browser malformed JSON/schema/reset | controls.test.ts accepts valid reference records/propagated failures; rejects JSON-only parse, boolean coercion, title normalization, RAM fallback and destructive repair | Domain/browser PASS; covered |
| AC-05, PRD failure experience: block writes on read error; preserve list/form and report failure, retry, confirmed reset | browser.spec.ts read lock and failed add/edit/toggle/delete/reset; tests/success-message.ts failure classification | controls.test.ts accepts actual success and rejects stored-data failure descriptions; storage controls reject no-op save | Browser PASS; covered |
| AC-06, PRD experience: labels, visible focus, literal HTML, 360/1280 | browser.spec.ts accessible name/focus/literal text/overflow; coordinator screenshots + keyboard flow | Executable browser assertions and manual visible focus/appearance inspection (manual suitable for subjective visual appearance) | Browser and manual evidence PASS; covered |
| AC-07, PRD technical handoff: build/typecheck, no business API | package scripts; browser.spec.ts before/after fetch/XHR tracking across every journey | All domain controls execute with actual runner; network assertions observe app rather than mock decisions | Build/typecheck PASS, lint exit0; network none; covered |

## TASK-04 — DONE; independent final review
Reviewer /root/final_review authored none of reviewed changes. Risk medium; inspected all production files, public contracts, caller wiring, error/data behavior, accessibility and complete scope/evidence. Verdict implementation READY and delivery analysis READY, no code findings. Snapshot SHA256 6919e55df275c079e43457b39f9e6e0e1b415ac9e86b3bb306c04063f1c313aa; freeze v2 SHA256 28f67c5e9be305fae9dcd0d681b8a701c8161fe68b481c78761c95277fe011a5. Reviewed recorded hashes unchanged before/after. Reviewer independently ran domain/control 16/16 PASS and parser edge probes; browser/build evidence coordinator-owned.
Lint initialization warning accepted: post-mount synchronization with external localStorage, ref prevents repeated seed writes in StrictMode, writes disabled until ready. Do not move storage writes into render solely to suppress a warning.
Production changes: src/tasks.ts:1, src/App.tsx:1, src/App.css:1, src/index.css:1, index.html:1. Removed only unused generated logos/images/icons. No external business API or production systems modified.

## Local handoff
Actual checks: pnpm test (8), pnpm test:controls (8), pnpm test:browser (12), pnpm build, pnpm typecheck, pnpm lint; all successful (lint one reviewed warning). Frozen integrity verified at delivery. README documents commands, Node26 test runner, storage scope/recovery and limits. Dev server http://127.0.0.1:5173 available for preview. No remote CI/PR/merge/deployment in local example scope; not claimed passed. No archive before accepted handoff; active artifacts retained beside PRD as established example format.

## TASK-05 — DONE, local delivery
Independent final_review performed scoped documentation re-review after evidence mapping was recorded: READY, no findings. Project/example README, tracker, walkthrough and history accurately reflect runtime checks, preserved test failures and the reviewed lint warning. All five active tasks DONE. Source/test freeze untouched; no deployment or remote CI claimed. Artifacts retained for user review rather than archived before acceptance.

## User acceptance và cập nhật tài liệu — 2026-10-14
Người dùng xác nhận “ok rồi” và yêu cầu cập nhật mô tả thành quả cùng history prompt. Bàn giao local được chấp nhận; 5/5 task và kết quả kiểm chứng trước đó giữ nguyên. README tổng quan/project cập nhật thành quả; skill-history bổ sung prompt thực tế và xác nhận bàn giao. Chỉ trích các prompt còn trong hội thoại, không tái dựng prompt cũ thiếu nguồn. Không thay đổi source, test, PRD/plan hoặc cấu hình đã freeze. Giữ tài liệu ngay trong example để tiếp tục làm mẫu học Compass; yêu cầu hiện tại là cập nhật tài liệu, không di chuyển thư mục ứng dụng.

Verification tài liệu: liên kết file nội bộ của bốn tài liệu đã sửa, bảng lịch sử liên tục và ba bản ghi prompt PASS; hash snapshot PRD/plan/test/config freeze v2 giữ nguyên. Prompt gốc dùng code block để giữ nguyên văn đường dẫn mà không tạo liên kết tương đối sai. Không chạy lại test runtime vì chỉ sửa mô tả và lịch sử.

## Relocation spec — 2026-10-14
Theo yêu cầu người dùng, PRD/plan/tasks/walkthrough chuyển từ root project vào `dev/task-manager/`. Liên kết vào spec từ README/history được cập nhật; PRD chỉ đổi đường dẫn liên kết README tổng quan. Test/resources và quy tắc sản phẩm không đổi. Snapshot validated v2 nguyên bản bảo tồn trong `../../test-suite-v2.tar.gz`, cùng manifest `../../test-freeze-v2.json`; manifest hiện tại ở root cập nhật locator/hash của tài liệu và ghi lý do relocation, không coi đây là lượt review/test mới. Review snapshot chứa hash lịch sử, không phải checksum tài liệu sau các lần cập nhật.

Relocation verification: mọi liên kết file nội bộ ở README/history/spec tồn tại; inventory hiện tại và hash snapshot v2 trong archive PASS; bốn spec không còn ở root. Không chạy lại runtime tests vì chỉ đổi vị trí tài liệu và liên kết.

## Làm rõ lịch sử điều phối và vòng lặp
Người dùng hỏi số lần engineer vì nhật ký trông như one-shot. Đã bổ sung bảng thứ tự thực hiện trong ../../skill-history.md: một lần áp dụng comp-engineer xuyên suốt phiên, một lượt production implementation; candidate test đầu BLOCKED, candidate bổ sung freeze v1, acceptance9/12 dẫn tới revision và suitev2, acceptance12/12 rồi independent review/handoff. Không coi sửa harness là lượt sửa mã ứng dụng, không ghi thêm invocation hoặc thời điểm thiếu nguồn.
