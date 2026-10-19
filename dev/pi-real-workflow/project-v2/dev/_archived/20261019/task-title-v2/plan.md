# Technical Plan: Task Title Utility (`task-title-v2`)

> **Target Folder**: `dev/task-title-v2/`
> **Source Intent**: `dev/task-title-v2/intent.md`
> **Mode**: Light (bounded single utility module)
> **Risk**: Medium (public contract interface & behavior addition)
> **Required Review**: Independent review via fresh `comp-reviewer` subagents (pre-freeze test gate & post-implementation delivery gate)
> **Status**: Ready for Tasks Breakdown

---

## 1. Strategy & Principles (Chiến lược & Nguyên lý)

- **Ponytail Simplicity**:
  - Triển khai hàm `normalizeTaskTitle(value)` bằng JavaScript thuần túy, không dùng thư viện ngoài.
  - Sử dụng các phương thức có sẵn của JavaScript: kiểm tra `typeof value !== "string"`, regex `\s+` hoặc Unicode whitespace properties, phương thức `.trim()`.
  - Giữ thay đổi ở mức tối thiểu, rõ ràng, dễ bảo trì.
- **Strict Role Separation & Test Freeze Protocol**:
  - Test authoring: Sử dụng fresh subagent với role `comp-test-author` (`<COMPASS_ROOT>/agents/comp-test-author.md`), chỉ cấp quyền `write` và thông tin hợp đồng công khai (public contract + runner conventions).
  - Coordinator Control Harness: Coordinator chạy kiểm thử kiểm soát trên thư mục tạm thời (`temp copies`), gồm:
    1. Stub control (kiểm tra stub hiện tại `src/task-title.mjs` thất bại một cách có ý nghĩa).
    2. Positive reference control (kiểm tra một triển khai tham chiếu chuẩn đạt tất cả các test).
    3. Plausible wrong-rule controls (kiểm tra các biến thể sai quy tắc: không trim, không chuẩn hóa khoảng trắng bên trong, đổi chữ hoa/thường, không ném đúng loại lỗi, v.v. đều bị bắt bởi các assertion liên quan).
    - Lưu ý: Coordinator controls tuyệt đối không làm thay đổi file gốc `src/task-title.mjs` (giữ nguyên byte-for-byte).
  - Independent Test Validation: Spawning distinct fresh read-only reviewer (`comp-reviewer`, tools: `read`, `grep`, `find`, `ls`) kiểm tra độ phủ AC-to-assertion, control harness, và toàn bộ tài nguyên đóng băng. Trả về `Test validation: PASS/BLOCKED`.
  - Test Freeze: Coordinator tính toán SHA-256 hash của `TASK.md`, `package.json`, toàn bộ test suite (`tests/task-title.test.mjs`), và coordinator control harness script. Ghi nhận phiên bản Node (v26.9.0) và lệnh runner (`node --test tests/*.test.mjs`).
  - Isolated Implementation: Spawning fresh implementer (`comp-implementer`, tools: `write` only), cung cấp hợp đồng công khai đã làm sạch và production stub. Tuyệt đối không cung cấp đường dẫn test, tên test, assertions, hay output kết quả kiểm thử.
  - Coordinator Verification: Xác minh tất cả hashes của test suite đã đóng băng không bị thay đổi, sau đó thực thi bộ test bằng lệnh runner.
  - Independent Implementation Review: Spawning distinct fresh read-only reviewer (`comp-reviewer`, tools: `read`, `grep`, `find`, `ls`) đánh giá mã nguồn `src/task-title.mjs` đối chiếu với AC, freeze inventory và kết quả test execution.

---

## 2. Deliverables & Architecture (Sản phẩm & Kiến trúc)

- **Source File**: `src/task-title.mjs`
  - Export: `normalizeTaskTitle(value)`
  - Input: `value` (bất kỳ)
  - Validation:
    - Nếu `typeof value !== "string"` $\to$ ném `new TypeError("...")`.
    - Chuỗi sau khi trim bằng `.trim()`: nếu độ dài là 0 $\to$ ném `new Error("...")`.
  - Normalization:
    - Thay thế mọi chuỗi khoảng trắng Unicode liên tiếp bên trong (`/\s+/g` hoặc regex Unicode whitespace tương ứng) bằng đúng một dấu cách thông thường `" "` (`\u0020`).
    - Trả về chuỗi kết quả.
- **Test File**: `tests/task-title.test.mjs`
  - Sử dụng runner tích hợp `node:test` và module khẳng định `node:assert/strict`.
- **Coordinator Harness**: `dev/task-title-v2/coordinator-controls.mjs` (chạy trên temp copies).

---

## 3. Ordered Roadmap & Verification Matrix

### Roadmap

1. **Phase 1: Task Breakdown & Consistency Gate** (`comp-tasks`, `comp-analyze`).
2. **Phase 2: Pre-Implementation Test Authorship** (Spawning `comp-test-author`).
3. **Phase 3: Coordinator Control Harness & Independent Test Validation Gate**:
   - Chạy controls trên temp copies (stub, positive reference, plausible wrong-rule controls).
   - Spawning independent `comp-reviewer` để kiểm tra AC-to-assertion và control evidence.
   - Tính toán và lập Freeze Inventory (hashes của TASK.md, package.json, tests, harness script, Node version, runner command).
4. **Phase 4: Isolated Implementation** (Spawning `comp-implementer` với write-only tool và sanitized contract).
5. **Phase 5: Coordinator Verification & Test Suite Execution**:
   - Verify freeze hashes.
   - Run `node --test tests/*.test.mjs`.
6. **Phase 6: Independent Implementation Review** (Spawning distinct `comp-reviewer`).
7. **Phase 7: Shipping & Archiving** (`comp-ship`, `comp-done`).

### Verification Matrix

| Criterion | Mô tả kiểm thử & Hành vi kỳ vọng | Test path / Harness check | Command / Context | Cổng kiểm soát |
|---|---|---|---|---|
| **AC-01** | Export `normalizeTaskTitle` từ `src/task-title.mjs` | `tests/task-title.test.mjs` | `node --test` | Test Validation, Implementation Review |
| **AC-02** | Ném `TypeError` cho các đầu vào non-string (`null`, `undefined`, số, boolean, object, symbol) | `tests/task-title.test.mjs` | `node --test` | Test Validation, Implementation Review |
| **AC-03** | Cắt bỏ khoảng trắng Unicode ở đầu và cuối chuỗi | `tests/task-title.test.mjs` | `node --test` | Test Validation, Implementation Review |
| **AC-04** | Thay thế internal runs của Unicode whitespace bằng `" "` (`\u0020`) | `tests/task-title.test.mjs` | `node --test` | Test Validation, Implementation Review |
| **AC-05** | Giữ nguyên chữ hoa/thường và dấu câu | `tests/task-title.test.mjs` | `node --test` | Test Validation, Implementation Review |
| **AC-06** | Ném `Error` (và không phải TypeError) khi chuỗi rỗng sau khi trim | `tests/task-title.test.mjs` | `node --test` | Test Validation, Implementation Review |
| **AC-07** | Dependency-free, verify bằng Node runner | `package.json` inspection & execution | `node --test tests/*.test.mjs` | Pre-flight verification |

---

## 4. Agent Protocol & Subagent Allocation

| Role | Canonical Role Path | Granted Tools | Assigned Scope | Fresh Context |
|---|---|---|---|---|
| **Test Author** | `<COMPASS_ROOT>/agents/comp-test-author.md` | `write` | Viết `tests/task-title.test.mjs` từ public contract | Yes |
| **Test Reviewer** | `<COMPASS_ROOT>/agents/comp-reviewer.md` | `read`, `grep`, `find`, `ls` | Validate criteria-to-assertion, controls, freeze inventory | Yes (independent) |
| **Implementer** | `<COMPASS_ROOT>/agents/comp-implementer.md` | `write` | Viết `src/task-title.mjs` từ sanitized contract | Yes |
| **Implementation Reviewer** | `<COMPASS_ROOT>/agents/comp-reviewer.md` | `read`, `grep`, `find`, `ls` | Review implementation vs criteria, suite freeze & execution evidence | Yes (distinct independent) |

---

## 5. Task Handoff & Definition of Done

- Chuyển giao sang `dev/task-title-v2/tasks.md`.
- Definition of Done:
  1. Toàn bộ các tiêu chí AC-01 đến AC-07 được kiểm thử và bao phủ.
  2. Bằng chứng kiểm thử kiểm soát của Coordinator (stub, positive, wrong rules) đạt chuẩn.
  3. Đánh giá kiểm thử độc lập (Test validation) đạt PASS trước khi freeze.
  4. Test suite và các thành phần kiểm thử được đóng băng với đầy đủ inventory và hashes SHA-256.
  5. Triển khai hoàn thành trong môi trường cô lập, file `src/task-title.mjs` sạch sẽ, không có mã gỡ lỗi.
  6. Coordinator xác minh tính nguyên vẹn của hashes và chạy toàn bộ test suite thành công 100%.
  7. Đánh giá triển khai độc lập (Implementation review) đạt PASS.
  8. Lưu trữ toàn bộ folder vào `dev/_archived/YYYYMMDD/task-title-v2/`.
