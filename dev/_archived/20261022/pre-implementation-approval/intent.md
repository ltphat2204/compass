# Intent: duyệt trước implementation

Mode: light. Status: APPROVED.

## Mục tiêu và phạm vi

Workflow Compass phải dừng trước implementation để người dùng duyệt intent và plan hiện tại. Một lần duyệt chung cả hai tài liệu là đủ. Ngoại lệ: công việc thuộc một goal automation đang hoạt động được tiếp tục tự động trong phạm vi goal.

Không thêm điểm dừng riêng giữa intent và plan. Không thay đổi các gate kiểm thử, review, shipping hoặc quyền thao tác production.

## Tiêu chí chấp nhận

- AC-01: Luồng thông thường chuẩn bị intent và plan, trình đường dẫn và tóm tắt cho người dùng, rồi kết thúc lượt để chờ duyệt trước implementation.
- AC-02: Yêu cầu ban đầu như “implement”, “fix”, “continue” không tự tính là duyệt các tài liệu chưa được trình; im lặng không phải đồng ý. Duyệt đã có cho phiên bản hiện tại được giữ khi resume; thay đổi material về scope/acceptance/approach phải được duyệt lại.
- AC-03: Chỉ goal automation được xác nhận đang hoạt động và bao phủ công việc mới miễn điểm dừng này; từ “goal” trong hội thoại hoặc milestone không đủ. Khi host không xác nhận được goal, dùng luồng duyệt thông thường.
- AC-04: Các entry point comp-engineer, comp-plan và comp-implement áp dụng cùng quy tắc; hướng dẫn hook và adaptive routing không chỉ dẫn bỏ qua gate.
- AC-05: Miễn duyệt cho goal không miễn các gate an toàn, tests, review hay quyền production.

## Repository context và readiness

Nguồn workflow: `.agents/skills/comp-engineer/SKILL.md`, `references/adaptive-workflow.md`, `references/hooks.md`, các stage skill và intake guidance trong `hooks/compass.py`. Hiện adaptive workflow khuyến khích tự tiếp tục và nói giải thích không phải approval gate, cần chỉnh cho nhất quán.

Requirements: READY theo kiểm tra trực tiếp mục tiêu, phạm vi, ngoại lệ và acceptance criteria. User approval: APPROVED by “ok cập nhật workflow đi”.
