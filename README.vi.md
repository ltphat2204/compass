# Compass

[English](README.md) | **Tiếng Việt** | [简体中文](README.zh-CN.md)

[![skills.sh](https://skills.sh/b/ltphat2204/compass)](https://skills.sh/ltphat2204/compass)

Được cấp phép theo [Apache License 2.0](LICENSE).

**Từ ý tưởng hoặc báo lỗi đến yêu cầu rõ ràng, code hoạt động và kết quả đã kiểm chứng.**

Compass gồm chín skill cho coding agent. Bắt đầu bằng `comp-engineer`; agent chọn bước tiếp theo, dùng quy ước của repository và điều chỉnh mức độ lập kế hoạch theo công việc.

## Vì sao có Compass

AI có thể tạo code nhanh hơn tốc độ người dùng hiểu điều vừa được xây dựng hoặc kiểm chứng nó có giải quyết đúng vấn đề không. Người mới có thể nhận được kết quả chạy được nhưng chưa hiểu hành vi và giới hạn. Experienced dev vẫn có thể phải tự phân tích, chia việc, nghĩ edge case và dẫn AI từng bước. Compass được tạo ra để thu hẹp cả hai khoảng trống.

Với người mới, Compass nối ý tưởng với hành vi cụ thể, giải thích các quyết định đáng hiểu và cho thấy kết quả được kiểm chứng ra sao. Với experienced dev, agent khảo sát codebase, phản biện giả định, so sánh phương án và thực hiện công việc đã được cho phép đến bước kiểm chứng. Người dùng sở hữu mục tiêu và các lựa chọn sản phẩm quan trọng; agent đảm nhận phân tích kỹ thuật và thực thi trong phạm vi đó.

Compass thích nghi với yêu cầu, từ một triệu chứng, ý tưởng chưa rõ đến milestone. Workflow giúp bước tiếp theo dễ hiểu và dùng bằng chứng để xác định công việc đã hoàn tất hay chưa.

## Triết lý

**Mục tiêu định hướng; bằng chứng quyết định bước tiếp theo.** Trách nhiệm và quality gate được giữ ổn định, còn cách thực hiện thích nghi theo quy mô, rủi ro và công cụ sẵn có.

1. **Làm rõ intent trước implementation.** Xác định vấn đề, phạm vi, ràng buộc và tiêu chí thành công quan sát được. Khảo sát repository trước; hỏi khi không thể suy ra quyết định quan trọng.
2. **Dựa vào bằng chứng trước khi áp đặt giải pháp.** Dùng kiến trúc, quy ước, toolchain và CI hiện có. Không áp đặt stack, tầng kiến trúc hay dependency không cần thiết.
3. **Thay đổi nhỏ nhất giải quyết đủ yêu cầu.** Tái sử dụng pattern hiện có; safeguards theo tác động đến hành vi và dữ liệu.
4. **Phân tán thực thi, giữ trách nhiệm rõ ràng.** Coordinator giao và tích hợp việc, quyết định DONE; implementer làm trong phạm vi; reviewer kiểm tra độc lập.
5. **Kiểm chứng phải chứng minh kết quả.** Mỗi tiêu chí có cách kiểm tra và bằng chứng thực tế. Báo cáo, thiếu công cụ hay bỏ qua kiểm tra không được tính là pass.
6. **Giữ khả năng truy vết khi thay đổi.** Bảo toàn liên kết intent → plan → task → evidence → delivery, ID ổn định, quyết định, ghi chú và lịch sử khi tiếp tục hoặc lập kế hoạch lại.
7. **Quyền tự chủ đi theo phạm vi được cho phép.** Tiếp tục công việc an toàn trong scope; merge, deploy, thay đổi dữ liệu phá hủy và hành động bên ngoài tuân theo quyền hạn và quy tắc của project.

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

## Công cụ khuyến nghị cho workflow

Là tác giả Compass, tôi khuyến nghị các công cụ tùy chọn sau:

| Công cụ | Dùng để |
|---|---|
| [CodeGraph](https://github.com/andysom25/codegraph) | Truy vết symbol, caller và phạm vi ảnh hưởng. |
| [Understand Anything (UA)](https://github.com/Egonex-AI/Understand-Anything) hoặc [Graphify](https://github.com/Graphify-Labs/graphify) | Khám phá kiến trúc và quan hệ domain để làm rõ intent với người dùng. |
| [Ponytail](https://github.com/DietrichGebert/ponytail) | Chọn giải pháp đơn giản, tái sử dụng code và giữ thay đổi nhỏ. |
| [RTK](https://github.com/rtk-ai/rtk) (CLI) | Giảm output shell và lượng token. |

Agent tự chọn công cụ có sẵn theo codebase, công việc và sở thích của bạn; tái sử dụng index/graph và chỉ đọc source liên quan khi đã đủ. Không bắt buộc cài thêm công cụ nào.

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

Plugin marketplace có bốn [lifecycle hook](docs/installation.md#lifecycle-hooks) tùy chọn: nhận goal, bảo vệ frozen test, phát hiện bằng chứng cũ và kiểm tra hoàn thành. Hook cần Python 3.9+ và được host bật/tin cậy. OpenCode 2 dùng adapter riêng ở project; bản chỉ sao chép skill và ZIP submission vẫn dùng gate thủ công nếu chưa đăng ký adapter.

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
