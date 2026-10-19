# Intent: Task Title Utility (`task-title-v2`)

> **Target Folder**: `dev/task-title-v2/`
> **Intent Type**: Feature (`feat`)
> **Status**: Ready for Planning
> **Mode**: Light (bounded single-module utility)
> **Requirements gate**: READY (analyzed against TASK.md specifications)
> **Standards & Evidence**: Grounded in `TASK.md`, `package.json`, and existing `src/task-title.mjs`

---

## 1. Mục Tiêu & Bài Toán (Problem Statement & Goals)

Cung cấp một hàm tiện ích chuẩn hóa tiêu đề công việc (`normalizeTaskTitle`) trong dự án JavaScript dùng một lần (disposable JavaScript project). Hàm xử lý dữ liệu đầu vào chuỗi, chuẩn hóa khoảng trắng Unicode, bảo toàn chữ hoa/thường cùng dấu câu, và từ chối các giá trị không hợp lệ với các loại lỗi cụ thể theo hợp đồng công khai.

---

## 2. Người Dùng & Kịch Bản (Users & Scenarios)

- **Người dùng / Hệ thống gọi hàm**: Các module khác trong ứng dụng quản lý tác vụ cần chuẩn hóa tiêu đề công việc trước khi lưu trữ hoặc hiển thị.
- **Kịch bản hợp lệ**:
  - Chuỗi tiêu đề có khoảng trắng ở đầu hoặc cuối cần được cắt bỏ (trim).
  - Chuỗi có nhiều khoảng trắng liên tiếp (bao gồm Unicode whitespace như non-breaking space, tabs, newlines) ở giữa cần được gộp thành một khoảng trắng đơn chuẩn (`" "`).
  - Chuỗi có chữ hoa, chữ thường và dấu câu (ví dụ: `"Feature: Implement AC-01!"`) được giữ nguyên toàn vẹn.
- **Kịch bản ngoại lệ / Từ chối**:
  - Đầu vào không phải chuỗi (`null`, `undefined`, số, boolean, object, array, symbol) bị từ chối bằng ngoại lệ `TypeError`.
  - Đầu vào là chuỗi rỗng (`""`) hoặc chuỗi chỉ chứa toàn khoảng trắng (ví dụ: `"   "`, `"\t\n\u00A0"`) bị từ chối bằng ngoại lệ `Error`.

---

## 3. Phạm Vi & Tiêu Chí Chấp Nhận (Scope & Agreed Behavior)

### Trong phạm vi
- Xuất khẩu hàm `normalizeTaskTitle(value)` từ `src/task-title.mjs`.
- Xác thực kiểu dữ liệu đầu vào: ném `TypeError` nếu `typeof value !== "string"`.
- Cắt khoảng trắng đầu và cuối chuỗi (Unicode whitespace).
- Thay thế mỗi chuỗi khoảng trắng Unicode liên tiếp bên trong bằng một ký tự khoảng trắng đơn chuẩn `\u0020`.
- Giữ nguyên chữ hoa/chữ thường và các ký tự dấu câu.
- Ném `Error` nếu sau khi cắt khoảng trắng chuỗi trở thành rỗng (độ dài bằng 0).
- Hoàn toàn không có phụ thuộc runtime bên ngoài (dependency-free).
- Xác minh bằng runner tích hợp của Node (`node --test`).

### Ngoài phạm vi
- Không hỗ trợ các cấu hình chuẩn hóa tùy biến ngoài hợp đồng đã mô tả.
- Không thêm bất kỳ package/dependency nào vào `package.json`.

### Tiêu chí chấp nhận (Acceptance Criteria)
- **AC-01**: `src/task-title.mjs` xuất khẩu hàm có tên `normalizeTaskTitle`.
- **AC-02 (Type Validation)**: Ném `TypeError` đối với mọi đầu vào không phải chuỗi (`null`, `undefined`, số, boolean, object, array, symbol, function).
- **AC-03 (Trimming)**: Cắt bỏ toàn bộ khoảng trắng Unicode ở đầu và cuối chuỗi.
- **AC-04 (Internal Whitespace Normalization)**: Mọi chuỗi liên tiếp chứa khoảng trắng Unicode (spaces, tabs, newlines, non-breaking space `\u00A0`, v.v.) bên trong chuỗi được thay thế bằng đúng một dấu cách thông thường `\u0020`.
- **AC-05 (Preserve Case & Punctuation)**: Giữ nguyên vẹn kiểu chữ hoa/thường và tất cả các ký tự dấu câu, ký hiệu đặc biệt.
- **AC-06 (Empty Rejection)**: Ném `Error` (cụ thể `instanceof Error`, không phải `TypeError`) nếu chuỗi đầu vào rỗng hoặc chỉ chứa khoảng trắng sau khi trim.
- **AC-07 (Zero Dependencies)**: Giữ giải pháp không phụ thuộc vào thư viện ngoài, chỉ dùng JavaScript chuẩn chạy trên Node.js.

---

## 4. Bối Cảnh Codebase & Ranh Giới Ảnh Hưởng (Codebase Context & Blast Radius)

- **Entry point / Module**: `src/task-title.mjs` (hiện chứa stub ném `Error("Not implemented")`).
- **Test suite**: `tests/` (hiện chưa có test file, cấu hình test runner trong `package.json` là `node --test tests/*.test.mjs`).
- **Dependencies**: `package.json` (`"type": "module"`, không có dependencies).
- **Runtime**: Node.js v26.9.0.

---

## 5. Ràng Buộc & Quyết Định Kỹ Thuật (Constraints & Key Decisions)

- **Không thêm dependency**: Không cài đặt bất kỳ package npm nào.
- **Độc lập và phân lập vai trò (Strict Subagent Testing Gate)**:
  - Tác giả viết test (`comp-test-author`) nhận hợp đồng công khai và viết test độc lập trong `tests/task-title.test.mjs`.
  - Điều phối viên (Coordinator) chạy các bộ kiểm soát (stub control, positive reference control, plausible wrong-rule negative controls) trên bản sao tạm (temp copies), đảm bảo `src/task-title.mjs` không bị thay đổi.
  - Người đánh giá độc lập (`comp-reviewer`) kiểm tra độ phủ AC-to-assertion, runner và harness trước khi đóng băng (freeze).
  - Đóng băng snapshot (inventory và SHA-256 hashes).
  - Tác giả cài đặt (`comp-implementer`) nhận hợp đồng công khai đã được làm sạch và stub ban đầu, chỉ được cấp quyền ghi `src/task-title.mjs`, hoàn toàn không được tiếp cận file test, tên test hay kết quả chạy test.
  - Người đánh giá độc lập (`comp-reviewer`) kiểm tra việc cài đặt đối chiếu với tiêu chí và bằng chứng kiểm thử đã đóng băng.

---

## 6. Lộ Trình Triển Khai Đề Xuất (Suggested Roadmap)

- **Phase 1 (Planning & Tasks Breakdown)**: Tạo `plan.md` và `tasks.md`, thực hiện Consistency Gate bằng `comp-analyze`.
- **Phase 2 (Pre-implementation Test Authorship & Validation Gate)**:
  - Spawning `comp-test-author` subagent với quyền hạn tối thiểu.
  - Coordinator chạy stub, positive reference và plausible wrong-rule controls trên temp copies.
  - Spawning `comp-reviewer` subagent độc lập để validate AC coverage, harness và freeze inventory.
  - Đóng băng test suite và ghi nhận freeze manifest.
- **Phase 3 (Sanitized Implementation & Execution)**:
  - Spawning `comp-implementer` subagent với contract đã làm sạch và production stub.
  - Coordinator xác minh tính toàn vẹn của freeze hashes và chạy test runner.
  - Spawning `comp-reviewer` độc lập để review code và kết quả thực thi.
- **Phase 4 (Ship & Done)**: Pre-flight verification, local handoff, và lưu trữ vào `dev/_archived/YYYYMMDD/task-title-v2/`.

---

## 7. Đánh Giá Yêu Cầu (Requirements Quality Gate)

- **Gate Status**: READY
- **Đánh giá**:
  - Mục tiêu, phạm vi và ranh giới rõ ràng 100%.
  - 7 tiêu chí AC-01 đến AC-07 có thể quan sát, đo lường và kiểm tra tự động.
  - Định nghĩa rõ các loại ngoại lệ (`TypeError` cho sai kiểu, `Error` cho chuỗi rỗng sau trim).
  - Không có quyết định sản phẩm nào còn treo hoặc mập mờ.

---

## 8. Sản Phẩm Đầu Ra Kỳ Vọng (Expected Deliverables)

- `dev/task-title-v2/intent.md`
- `dev/task-title-v2/plan.md`
- `dev/task-title-v2/tasks.md`
- `dev/task-title-v2/walkthrough.md`
- `tests/task-title.test.mjs`
- `src/task-title.mjs`
