# Ví dụ thực hành Compass

Ba project dưới đây dùng chung bài toán **quản lý công việc**, với độ khó tăng dần để thử bộ skill Compass. Project 1–2 đã có ứng dụng và kiểm chứng local; project 3 hiện có PRD và lịch sử gọi skill, chưa khởi tạo mã nguồn ứng dụng.

| Mức độ | Project / PRD | Công nghệ | Mục tiêu |
| --- | --- | --- | --- |
| 1 — Cơ bản | [react-vite](react-vite/dev/task-manager/PRD.md) | React, Vite, TypeScript | Giao diện chạy độc lập, không gọi API. |
| 2 — Trung bình | [nextjs-fullstack](nextjs-fullstack/PRD.md) | Next.js, TypeScript | Ứng dụng full stack trong một project. |
| 3 — Nâng cao | [nextjs-nestjs-monorepo](nextjs-nestjs-monorepo/PRD.md) | pnpm workspace, Next.js, NestJS, TypeScript | Monorepo với frontend và backend riêng. |

## 1. React + Vite: giao diện không API

- Hiển thị danh sách công việc; thêm, sửa, xóa và đánh dấu hoàn thành.
- Lọc theo trạng thái, dùng dữ liệu mẫu và lưu thay đổi bằng `localStorage`.
- Giao diện thích ứng với màn hình nhỏ, có trạng thái danh sách trống và kiểm tra tiêu đề bắt buộc.
- Tiêu chí hoàn thành: các thao tác hoạt động trên trình duyệt, dữ liệu còn sau khi tải lại trang, không phát sinh yêu cầu đến API.

Mức này tập trung vào việc làm rõ yêu cầu UI, quản lý trạng thái và xác minh hành vi phía client.

**Thành quả đã xác nhận ngày 2026-10-14:** ứng dụng tiếng Việt đã hoàn tất 5/5 task, đáp ứng AC-01–AC-07. Scaffold bằng `pnpm create vite … --template react-ts --no-interactive --no-immediate`; có CRUD, ba bộ lọc, lưu trữ và phục hồi lỗi phía client. Domain 8/8, control 8/8, Chromium browser 12/12; build/typecheck thành công, lint exit 0 với một cảnh báo đã được review. Review độc lập READY; chưa deploy production hoặc kiểm tra Safari/Firefox.

Xem [cách chạy và tính năng](react-vite/README.md), [bằng chứng kiểm chứng](react-vite/dev/task-manager/walkthrough.md) và [lịch sử skill/prompt thực tế](react-vite/skill-history.md#lịch-sử-prompt-thực-tế). Lịch sử ghi các vòng sửa/review test và kết quả kiểm chứng.

## 2. Next.js: full stack

- Giữ các thao tác quản lý công việc của project 1; chuyển dữ liệu sang cơ sở dữ liệu SQLite.
- Dùng Next.js App Router và Route Handlers để đọc, tạo, cập nhật, xóa công việc.
- Kiểm tra dữ liệu tại server; giao diện thể hiện trạng thái đang tải và lỗi khi lưu thất bại.
- Tiêu chí hoàn thành: thao tác từ giao diện đi qua server, dữ liệu còn sau khi khởi động lại ứng dụng, dữ liệu không hợp lệ bị từ chối.

Mức này bổ sung luồng UI → server → cơ sở dữ liệu, xử lý lỗi và kiểm thử tích hợp. Chưa đưa đăng nhập hoặc phân quyền vào phạm vi thử nghiệm.

**Kết quả local ngày 2026-10-15:** ứng dụng tiếng Việt Next.js 16.4.1, App Router/Route Handlers, TypeScript và SQLite tích hợp Node đã qua kiểm chứng. API 5/5, controls 31/31, Chromium 14/14 (11 luồng ứng dụng + 3 controls của harness); kiểm tra lỗi lưu trữ thật, schema lặp lại và restart giữ dữ liệu PASS. Install với lockfile, build, typecheck và lint PASS; bộ test được review/freeze v2 sau khi giữ lại và sửa harness v1 qua revision đầy đủ. Review bàn giao độc lập READY, 6/6 task DONE; chưa deploy production hoặc kiểm tra Safari/Firefox.

Xem [cách chạy](nextjs-fullstack/README.md), [bằng chứng](nextjs-fullstack/dev/task-manager/walkthrough.md) và [skill/prompt history](nextjs-fullstack/skill-history.md).

## 3. pnpm workspace: Next.js + NestJS

- Tổ chức `apps/web` cho Next.js và `apps/api` cho NestJS trong một pnpm workspace.
- NestJS sở hữu API và cơ sở dữ liệu SQLite; Next.js sử dụng API để quản lý công việc.
- Dùng `packages/contracts` để chia sẻ kiểu dữ liệu request/response; backend vẫn kiểm tra dữ liệu đầu vào tại runtime.
- Cấu hình địa chỉ API, CORS và lệnh ở workspace root để chạy, build, kiểm thử từng ứng dụng.
- Tiêu chí hoàn thành: cài dependency từ root, chạy được hai ứng dụng, hoàn thành luồng CRUD qua API và build được cả workspace.

Mức này bổ sung ranh giới giữa các ứng dụng, hợp đồng API, dependency nội bộ và xác minh tích hợp nhiều dịch vụ.

## Sử dụng skill và ghi lịch sử

Khi triển khai từng project, dùng `comp-engineer` cho vòng đời SDD hoặc gọi từng skill theo giai đoạn: `comp-intent` → `comp-plan` → `comp-tasks` → `comp-analyze` → `comp-implement` → `comp-review` → `comp-ship`. Dùng `comp-done` khi đã xác nhận hoàn tất và cần lưu trữ artifacts. Áp dụng các gate của skill, gồm xác minh test, review/freeze và phân tách context trước khi triển khai thay đổi hành vi.

Mỗi project có một file `skill-history.md` riêng, ghi nối tiếp lịch sử gọi thực tế, kể cả lần thử thất bại hoặc bị chặn. Không ghi lời gọi dự kiến như thể đã thực hiện.

| Thời điểm (Asia/Ho_Chi_Minh) | Skill | Yêu cầu / đầu vào | Kết quả / artifacts | Kiểm chứng / blocker |
| --- | --- | --- | --- | --- |

Liên kết đến intent, plan, tasks và bằng chứng kiểm chứng trong từng bản ghi khi có. Đã dùng `comp-intent` để soạn PRD cho từng project; lịch sử thực tế nằm trong `skill-history.md` của từng thư mục. Project 1–2 đã chạy các stage từ plan đến implement/review; kết quả thực tế nằm trong [React/Vite walkthrough](react-vite/dev/task-manager/walkthrough.md) và [Next.js walkthrough](nextjs-fullstack/dev/task-manager/walkthrough.md). Project 3 chưa chạy các bước này.
