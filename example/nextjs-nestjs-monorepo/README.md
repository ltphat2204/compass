# Quản lý công việc — Next.js và NestJS

[English](README.en.md) | [简体中文](README.zh-CN.md) | **Tiếng Việt**

Ứng dụng độc lập trong pnpm workspace: `apps/web` (Next.js App Router), `apps/api` (NestJS + SQLite tích hợp Node), `packages/contracts` (kiểu TypeScript chung). Trình duyệt gọi trực tiếp API; Next.js không đọc database.

## Chạy local

Yêu cầu Node >=24.15 và pnpm 10.22.0. Từ thư mục này:

```sh
pnpm install --frozen-lockfile
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

Mở http://localhost:3000; API ở http://localhost:3001/api/tasks. Ctrl+C hoặc SIGTERM dừng cả hai app. Database mặc định `apps/api/data/tasks.sqlite` được tạo rỗng, không seed hay ghi đè khi khởi động lại.

## Cấu hình

- API `.env`: `PORT` mặc định 3001; `WEB_ORIGIN` bắt buộc là origin web chính xác; `DATABASE_PATH` bắt buộc, đường dẫn tương đối tính từ `apps/api`. API dừng rõ lỗi nếu thiếu cấu hình hoặc không mở được database. Biến môi trường process được ưu tiên hơn file.
- Web `.env.local`: `NEXT_PUBLIC_API_URL` bắt buộc là origin HTTP(S) của API, không có `/api` hay dấu `/` cuối. Đây là biến công khai, được Next.js chèn lúc build; đổi giá trị cần build lại (hoặc khởi động lại dev).
- Chỉ API biết đường dẫn SQLite. Không đưa secret vào biến `NEXT_PUBLIC_*`.

## Lệnh từ root

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm test
```

Build biên dịch declarations của contracts trước hai app. Test dùng bộ acceptance độc lập tại `tests/v3`. Chuẩn bị Chromium một lần trước khi chạy test:

```sh
pnpm --dir tests/v3 install --frozen-lockfile
pnpm --dir tests/v3 exec playwright install chromium
```
Chạy production local sau build trong hai terminal:

```sh
pnpm --filter @example/api start
pnpm --filter @example/web start
```

Có thể chạy riêng development bằng `pnpm --filter @example/api dev` và `pnpm --filter @example/web dev` sau `pnpm --filter @example/contracts build`. `PORT` tùy chỉnh cổng khi chạy riêng từng app. Root `pnpm dev` hỗ trợ `API_PORT` và `WEB_PORT` để truyền `PORT` riêng cho từng tiến trình; các biến cấu hình khác được kế thừa. Ví dụ không cần sửa file môi trường:

```sh
API_PORT=4101 WEB_PORT=4100 WEB_ORIGIN=http://localhost:4100 NEXT_PUBLIC_API_URL=http://localhost:4101 DATABASE_PATH=/tmp/tasks-demo.sqlite pnpm dev
```

## Hành vi và API

Thêm, sửa, hủy sửa, bật/tắt hoàn thành, lọc và xác nhận xóa bằng giao diện tiếng Việt. Tiêu đề trim hai đầu, 1–200 Unicode code point, giữ khoảng trắng bên trong. Nội dung được render như văn bản. ID và thời điểm tạo bất biến; danh sách theo `createdAt DESC, id DESC`. SQLite ghi thành công trước response, không có cache GET. Cập nhật đồng thời theo lần ghi cuối.

| Request | Response |
| --- | --- |
| GET `/api/tasks` | 200 `{ tasks: Task[] }` |
| POST `/api/tasks` với `{ title }` | 201 `{ task: Task }` |
| PATCH `/api/tasks/:id` với `title` và/hoặc `completed` | 200 `{ task: Task }` |
| DELETE `/api/tasks/:id` | 204, không body |

POST/PATCH cần `Content-Type: application/json`. Shape sai/trường lạ/JSON lỗi trả 400; không tồn tại trả 404; content type sai trả 415; lỗi lưu trữ trả 500. Mọi lỗi có `{ error: { code, message } }` đã loại chi tiết nội bộ. CORS chỉ cấp quyền cho đúng `WEB_ORIGIN`, gồm preflight; đây không phải xác thực.

Nếu tải lỗi, bật API lại rồi bấm **Thử lại**. Nếu mất phản hồi khi ghi, nội dung nhập được giữ và phải **Thử lại** để đọc lại dữ liệu trước mutation tiếp theo; không tự gửi lại mutation vì lần ghi trước có thể đã thành công. Kiểm tra danh sách đã tải lại trước khi thêm lại để tránh bản sao.

Giới hạn: ứng dụng local một người dùng, không authentication, deployment, ORM hoặc đồng bộ với example khác.

## Kết quả kiểm chứng

Kết quả local ngày 2026-10-15 được ghi trong [walkthrough](dev/task-manager/walkthrough.md):

- HTTP/API 9/9; Chromium 6/6. Controls: reference 9/9, phát hiện 15 biến thể sai; UI controls 15/15.
- Cài sạch từ lockfile, build theo dependency, typecheck và lint từ root PASS; kiểm tra consumer dùng sai kiểu contracts bị từ chối.
- Đã kiểm tra cấu hình thiếu, CORS, lỗi SQLite thật, restart giữ dữ liệu, phục hồi khi mất phản hồi và giao diện 360px/1280px với bàn phím.
- Ctrl+C/SIGTERM gửi đến process group của terminal dừng cả hai app và giải phóng cổng. Gửi SIGINT riêng đến PID pnpm ngoài cùng không phải cách dừng đã hỗ trợ.
- Review độc lập và kiểm tra nhất quán bàn giao READY; 6/6 task DONE. Chưa chạy Safari/Firefox, remote CI hoặc deploy production.

Đây là kết quả đã ghi nhận của phiên triển khai, không phải kiểm chứng lại ở mỗi lần cập nhật tài liệu.

## Compass và lịch sử

- [PRD/intent](dev/task-manager/PRD.md), [plan](dev/task-manager/plan.md), [tasks](dev/task-manager/tasks.md) và [walkthrough](dev/task-manager/walkthrough.md).
- [Lịch sử skill/prompt thực tế](skill-history.md), gồm các vòng sửa test và review.
- [Freeze hiện tại v3](dev/task-manager/freeze-v3.json) và [hướng dẫn bộ acceptance v3](tests/v3/README.md). Root `pnpm test` chọn v3; v1/v2 và các revision nguồn được giữ làm lịch sử.

PRD/plan là snapshot nguồn đã freeze; trạng thái bàn giao nằm trong tasks và walkthrough. Artifacts hiện ở `dev/task-manager/`, chờ xác nhận hoàn tất trước khi archive bằng `comp-done`.
