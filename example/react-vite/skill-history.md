# Lịch sử gọi skill

Nhật ký nối tiếp; thời gian theo Asia/Ho_Chi_Minh. Chỉ ghi hoạt động đã thực hiện; các bước triển khai chưa chạy không được ghi là thành công.

| Thời điểm | Skill | Yêu cầu / đầu vào | Kết quả / artifacts | Kiểm chứng / blocker |
| --- | --- | --- | --- | --- |
| 2026-10-14 21:06 | `comp-intent` | Yêu cầu viết PRD chi tiết; `../README.md`; skill và adaptive-workflow reference | Tạo [PRD.md](dev/task-manager/PRD.md) theo định dạng người dùng yêu cầu; đặc tả Standard | Tự rà soát requirements: READY cho plan theo giả định ghi trong PRD; chưa triển khai hoặc kiểm chứng runtime. |
| 2026-10-14 | `comp-engineer` | User requested full implementation from example README; existing PRD | Official React TS scaffold; [walkthrough.md](dev/task-manager/walkthrough.md) | Baseline build/typecheck/lint PASS; separate test-author và review trước implementation. |
| 2026-10-14 | `comp-plan` | PRD AC-01–AC-07 and observed scaffold | [plan.md](dev/task-manager/plan.md) with public contracts, checks and roles | Coverage self-check READY; test review pending. |
| 2026-10-14 | `comp-tasks` | PRD and plan | [tasks.md](dev/task-manager/tasks.md), 1/5 DONE | Scaffold checks passed; behavior gates pending. |
| 2026-10-14 | `comp-implement` | Plan/tasks và phân tách context giữa test-author/implementer | Start separate test-author workflow | Independent review/freeze pending; behavior not implemented. |
| 2026-10-14 | `comp-analyze` | PRD/plan/tasks consistency | Coverage recorded in [walkthrough.md](dev/task-manager/walkthrough.md) | Planning consistency READY; runtime and test freeze pending. |
| 2026-10-14 | `comp-review` | Independent pre-freeze test validation, PRD/plan/candidate tests/control evidence | Reviewer test_review; [walkthrough.md](dev/task-manager/walkthrough.md) | BLOCKED: missing controls and UI assertions; returned to test author before freeze. |
| 2026-10-14 | `comp-review` | Fresh independent validation of corrected candidate v2 | test_review_v2 PASS; [test-freeze-v1.json](test-freeze-v1.json) | 7 control tests PASS, 12 browser tests collected; FROZEN v1. |
| 2026-10-14 | `comp-review` | Full PRD/plan revision2 and replacement test suite; retained v1 | replacement_review PASS; FROZEN v2 [test-freeze.json](test-freeze.json) | Controls 8/8 PASS; browser 12 collected; runtime pending. |
| 2026-10-14 | `comp-review` | Final stable source/spec/tests/evidence snapshot | final_review READY; [walkthrough.md](dev/task-manager/walkthrough.md) mapping | No code blockers; reviewer domain/control16/16; coordinator browser12/12/build/typecheck/lint PASS with reviewed warning. |
| 2026-10-14 | `comp-analyze` | Delivery AC/task/check/source coverage via independent final reviewer | Delivery READY, evidence mapping recorded | Frozen integrity PASS; all AC covered. |
| 2026-10-14 | `comp-ship` | Local example delivery, README and acceptance evidence | Local handoff; no remote operations | Domain8/control8/browser12 PASS; build/typecheck/lint exit0; final docs review pending. |
| 2026-10-14 | `comp-review` | Scoped final documentation/evidence handoff | final_review READY, no findings | TASK-05 DONE; 5/5 active tasks complete, local delivery. |

## Cách đếm engineer và các vòng thực hiện

`comp-engineer` được áp dụng **1 lần** làm workflow điều phối cho prompt `/goal`, rồi tiếp tục các stage trong cùng phiên. Đây là việc đọc và áp dụng SKILL.md bằng công cụ của host, không phải đã chạy một CLI tên `comp-engineer` nhiều lần. Các dòng `comp-plan`, `comp-implement`, `comp-review`… ghi hoạt động theo stage; không phải những lần gọi lại engineer.

Mã ứng dụng được implementer viết trong **1 lượt**. Bộ test đi qua **3 trạng thái chính**: candidate đầu bị BLOCKED → candidate bổ sung được freeze v1 → sửa harness sau lần chạy thất bại và freeze v2. Vì vậy có một lần điều phối engineer, nhưng không phải một lượt tạo mọi thứ rồi đánh dấu DONE ngay.

| Vòng / thứ tự | Người thực hiện | Hoạt động và kết quả thực tế | Chuyển tiếp |
| --- | --- | --- | --- |
| 1. Chuẩn bị | Coordinator | Đọc PRD và comp-engineer; scaffold có lỗi đường dẫn target, xác định vị trí thực rồi sao chép; baseline build/typecheck/lint PASS | Lập plan/tasks |
| 2. Candidate test đầu | test_author → test_review | Control 4/4; 9 browser case được collect; reviewer BLOCKED vì thiếu controls và assertion | Chưa freeze, chưa triển khai; trả lại test author |
| 3. Bổ sung trước freeze | test_author → test_review_v2 | Control 7/7; 12 browser case collect; làm rõ ID không rỗng; reviewer PASS | Freeze suite v1, mở gate implementation |
| 4. Implementation | implementer | Viết UI và domain/storage trong một lượt; build/typecheck PASS, lint exit 0 có warning | Coordinator chạy acceptance |
| 5. Acceptance lần đầu | Coordinator | Domain 8/8 PASS, browser 9/12 PASS; 3 lỗi từ harness (checkbox biến mất, nhận nhầm lỗi storage là thông báo thành công) | Dừng delivery, reopen TASK-02/03; chưa DONE |
| 6. Thay suite đã freeze | test_author → replacement_review | Revision đầy đủ PRD/plan, giữ v1; sửa harness; control 8/8, 12 case collect; review PASS | Freeze suite v2, chạy lại acceptance |
| 7. Acceptance và review cuối | Coordinator → final_review | Domain 8/8, browser 12/12, build/typecheck PASS; kiểm tra bàn phím/ảnh/Network; review source + delivery READY | TASK-04 DONE; hoàn thiện evidence/handoff |
| 8. Review tài liệu và chấp nhận | final_review → coordinator → người dùng | Scoped docs review READY; TASK-05 DONE, 5/5; sau đó người dùng xác nhận “ok rồi” | Bàn giao local được chấp nhận |

Các vòng trên là tóm tắt từ bằng chứng trong [walkthrough](dev/task-manager/walkthrough.md), không thêm invocation hoặc timestamp không có nguồn. Candidate bổ sung trước freeze được reviewer đặt tên `test_review_v2`; đó không phải frozen suite v2. Frozen v2 chỉ xuất hiện sau vòng sửa harness số 6.

## Lịch sử prompt thực tế

Chỉ trích nguyên văn các prompt còn trong hội thoại này. Các đầu vào kỹ thuật ở bảng skill phía trên là tóm tắt hoạt động đã thực hiện, không phải câu lệnh người dùng đã gõ. Prompt gốc của lần `comp-intent` lúc 21:06 không còn trong ngữ cảnh hiện tại, nên giữ bản ghi có sẵn và không tái dựng.

### 1. Yêu cầu triển khai tự động

Người dùng, 2026-10-14:

```text
/goal hoàn thiện project 1 [react-vite](example/react-vite/)  trong [example](example/) với mô tả cách làm sử dụng comp skill từ [README.md](example/README.md) hãy bắt đầu scaffold project với command từ chính chủ. bạn hãy thực hiện tự động theo các quyết định của bạn về nội dung và tính năng
```

Kết quả: scaffold chính thức React + TypeScript, dùng PRD có sẵn làm intent, lập plan/tasks, test riêng, review/freeze, triển khai và bàn giao local. Xem [plan](dev/task-manager/plan.md), [tasks](dev/task-manager/tasks.md) và [walkthrough](dev/task-manager/walkthrough.md).

### 2. Xác nhận thành quả và yêu cầu cập nhật tài liệu

Người dùng, 2026-10-14:

> ok rồi, hãy cập nhật các doc mô tả thành quả của example 1 kèm history prompt như được chỉ dẫn

Kết quả: xác nhận bàn giao local; cập nhật README tổng quan, README project, walkthrough và nhật ký này. Không thay đổi mã ứng dụng hay snapshot PRD/plan/test đã freeze.

## Tổng kết kết quả đã xác nhận

- 5/5 task DONE; AC-01–AC-07 có bằng chứng và review độc lập READY.
- Domain 8/8, control 8/8, Chromium browser 12/12; build/typecheck PASS, lint exit 0 với một cảnh báo khởi tạo localStorage đã được reviewer chấp nhận.
- Có kiểm chứng responsive, bàn phím, reload, console và không có API nghiệp vụ.
- Giữ lịch sử lần review bị BLOCKED, lỗi scaffold đường dẫn và lỗi harness v1. Suite v1 được bảo tồn; sửa harness qua revision PRD/plan và review/freeze v2.
- Chưa deploy production, chạy remote CI hoặc kiểm tra Safari/Firefox. Người dùng đã chấp nhận kết quả local ngày 2026-10-14.

### 3. Tổ chức spec trong project

Người dùng, 2026-10-14:

> hãy chuyển spec của project này vào trong thư mục của project

Kết quả: chuyển PRD, plan, tasks và walkthrough vào `dev/task-manager/` bên trong project; cập nhật liên kết từ README và history. Snapshot v2 gốc được giữ trong `test-suite-v2.tar.gz` và `test-freeze-v2.json`; manifest hiện tại ánh xạ đường dẫn mới. Nội dung yêu cầu và tests không đổi; PRD chỉ đổi liên kết tương đối tới README tổng quan.

### 4. Làm rõ số lần engineer và lịch sử vòng lặp

Người dùng:

> bạn engineer mấy lần? lịch sử sao thấy chỉ one shot là done vậy

Kết quả: bổ sung cách đếm và bảng tám bước thực tế. Có một lần áp dụng workflow engineer và một lượt implement mã ứng dụng, kèm các vòng test/review thất bại và sửa harness trước DONE. Không thêm lần gọi skill không xảy ra.
