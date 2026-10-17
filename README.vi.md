# Compass

[English](README.md) | **Tiếng Việt** | [简体中文](README.zh-CN.md)

[![skills.sh](https://skills.sh/b/ltphat2204/compass)](https://skills.sh/ltphat2204/compass)

**Từ ý tưởng hoặc báo lỗi đến yêu cầu rõ ràng, code hoạt động và kết quả đã kiểm chứng.**

Compass gồm chín skill cho coding agent. Bắt đầu bằng `comp-engineer`; agent chọn bước tiếp theo, dùng quy ước của repository và điều chỉnh mức độ lập kế hoạch theo công việc.

## Cài đặt

Chọn một cách cài cho mỗi coding agent.

### Codex

Chạy trong terminal:

```sh
codex plugin marketplace add ltphat2204/compass
codex plugin add compass@compass
```

Mở session Codex mới rồi chọn `compass:comp-engineer`, hoặc gõ `$compass:comp-engineer` trong CLI. Cần phiên bản Codex có hỗ trợ `codex plugin`.

### Claude Code

Chạy bên trong Claude Code:

```text
/plugin marketplace add ltphat2204/compass
/plugin install compass@compass
```

Bắt đầu bằng `/compass:comp-engineer`.

### Cursor, GitHub Copilot, OpenCode và agent khác

Chạy từ project bạn muốn dùng Compass:

```sh
npx skills add ltphat2204/compass --skill '*' --copy
```

Chọn coding agent khi được hỏi. Lệnh cài đủ chín skill cùng resources vào project đó. Chọn `comp-engineer` trong agent để bắt đầu.

[Cập nhật, gỡ cài, native role và xử lý lỗi →](docs/installation.md)

## Bắt đầu làm việc

Với plugin Codex:

```text
$compass:comp-engineer Thêm xuất CSV cho danh sách task. Cho phép subagent
trong phạm vi và review độc lập. Triển khai, kiểm chứng rồi bàn giao local.
```

Với Claude Code, dùng `/compass:comp-engineer`. Với skill được copy, chọn `comp-engineer` hoặc dùng cú pháp skill của host.

Mô tả tính năng, lỗi hoặc ý tưởng chưa rõ. Compass đọc repository, làm rõ quyết định quan trọng rồi thực hiện công việc đã được cho phép qua các bước lập kế hoạch, triển khai và kiểm chứng. Yêu cầu chỉ lập kế hoạch hoặc review sẽ dừng ở bước tương ứng.

## Cách hoạt động

```text
Intent → Plan → Tasks → Implement → Ship → Done
```

Analyze và Review kiểm tra các bước bàn giao. Việc nhỏ dùng tài liệu ngắn hơn; thay đổi hành vi vẫn cần người viết test riêng, kiểm định độc lập và đóng băng test trước khi triển khai. Host thiếu subagent cần thiết vẫn có thể lập kế hoạch và review, nhưng chưa thể vượt qua cổng triển khai.

Yêu cầu, task và bằng chứng được lưu trong `dev/{feature}/`. Compass dùng stack và công cụ sẵn có. Deploy, merge và thao tác phá hủy tuân theo quyền được cấp và quy tắc của project.

| Skill | Dùng để |
|---|---|
| `comp-engineer` | Điều phối toàn bộ workflow hoặc tiếp tục công việc |
| `comp-intent` | Làm rõ vấn đề và tiêu chí thành công |
| `comp-plan` | Chọn phương án triển khai |
| `comp-tasks` | Theo dõi công việc và phụ thuộc |
| `comp-analyze` | Kiểm tra yêu cầu và tính nhất quán tài liệu |
| `comp-implement` | Triển khai task sẵn sàng và kiểm chứng kết quả |
| `comp-review` | Review thay đổi theo yêu cầu |
| `comp-ship` | Kiểm tra và bàn giao kết quả |
| `comp-done` | Lưu trữ công việc đã được chấp nhận |

## Tìm hiểu thêm

- [Workflow, cổng kiểm định test và ví dụ](docs/workflow.md)
- [Cài đặt và cập nhật](docs/installation.md)
- [Ứng dụng mẫu: React, Next.js và Next.js + NestJS](example/README.md)
- [Kết quả kiểm chứng và giới hạn của từng host](evals/results.md)
- [Kiểm tra dành cho maintainer và gửi duyệt plugin](docs/publishing.md)
