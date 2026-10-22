# Plan: duyệt trước implementation

Mode: light. Source: [intent.md](intent.md). Status: APPROVED.

## Thay đổi dự kiến

1. Thêm quy tắc duyệt chung intent và plan ở comp-engineer và adaptive workflow; ghi nhận duyệt hoặc ngoại lệ goal trong artifact hiện có, không tạo framework/state schema mới.
2. Đồng bộ handoff ở comp-plan, preflight ở comp-implement và các hướng dẫn liên quan có mâu thuẫn. Intake hook chỉ nhắc quy tắc; không suy đoán goal qua keyword hoặc tuyên bố runtime hook có thể xác minh sự duyệt.
3. Kiểm tra các entry point, tài liệu và eval/check hiện có; cập nhật kiểm tra liên quan nếu cần, rồi chạy kiểm tra hẹp phù hợp.

## Verification và review

| Criteria | Kiểm tra |
|---|---|
| AC-01, AC-02 | Đọc chéo routing/handoff/preflight: bình thường phải dừng, resume giữ duyệt hợp lệ, thay đổi material phải duyệt lại. |
| AC-03, AC-05 | Xác nhận ngoại lệ yêu cầu active automation goal bao phủ scope; không xác nhận được thì chờ duyệt, các gate khác vẫn còn. |
| AC-04 | Tìm tất cả hướng dẫn tự tiếp tục và kiểm tra entry point không mâu thuẫn; chạy checker hiện có sau khi xác nhận cách dùng. |

Risk: thấp, thay đổi policy/hướng dẫn; không thêm engine thực thi hay thay đổi dữ liệu. Review: coordinator self-review trên diff cuối; nếu cần sửa logic runtime thay vì chỉ intake text, đánh giá lại testing gate trước khi thực hiện.

## Handoff

User approved intent and plan with “ok cập nhật workflow đi”. Tracker: [tasks.md](tasks.md). Consistency: READY cho phạm vi đề xuất theo kiểm tra trực tiếp; execution: authorized for this approved scope.
