# Example 2: Quản lý công việc full stack

[English](README.en.md) | [简体中文](README.zh-CN.md) | **Tiếng Việt**

Ứng dụng tiếng Việt độc lập dùng Next.js App Router, TypeScript, Route Handlers và SQLite. Có thêm/sửa/xóa/xác nhận, Hủy, đánh dấu hoàn thành và ba bộ lọc. Dữ liệu đi qua HTTP API cùng origin, được lưu ở server; không dùng localStorage để lưu công việc.

## Chạy local

Môi trường đã dùng: Node 26.9.0, pnpm 10.22.0, Next.js 16.4.1, React 19.3.0. SQLite dùng module `node:sqlite` tích hợp, không cần ORM hay dịch vụ database riêng.

```sh
cd example/nextjs-fullstack
pnpm install --frozen-lockfile
pnpm db:init
pnpm dev --hostname 127.0.0.1
```

Mở [ứng dụng local](http://localhost:3000). Database mặc định là `data/tasks.sqlite`, ban đầu rỗng; khởi tạo schema có thể chạy lại mà không xóa dữ liệu. API cũng tạo schema nếu chưa có. Không có seed tự động; dữ liệu còn sau khi dừng/chạy lại ứng dụng nếu giữ file database.

Để dùng đường dẫn khác, xuất biến trong cùng shell **trước cả khởi tạo và chạy app**:

```sh
export DATABASE_PATH="$PWD/data/custom.sqlite"
pnpm db:init
pnpm dev --hostname 127.0.0.1
```

Đường dẫn tương đối được tính từ thư mục project. [.env.example](.env.example) là tài liệu tham khảo biến; `db:init` chạy trực tiếp bằng Node và không tự đọc các file `.env` của Next.js. Dùng biến đã export cho cả hai lệnh để chúng mở cùng database. Không commit database hoặc file journal/WAL; các file này đã được ignore. Sao lưu file database khi ứng dụng đã dừng nếu muốn giữ bản sao.

Chạy production build tại local:

```sh
pnpm build
pnpm start --hostname 127.0.0.1
```

## Hành vi và API

Tiêu đề được trim, dài 1–200 Unicode code point; cho phép trùng và giữ khoảng trắng bên trong. ID/thời điểm tạo do server sinh, không đổi khi sửa. Danh sách mới nhất trước, dùng ID giảm dần làm thứ tự phụ. Nội dung tiêu đề luôn hiển thị như text.

| API | Thành công |
| --- | --- |
| `GET /api/tasks` | `200 { tasks: Task[] }` |
| `POST /api/tasks` với `{ title }` | `201 { task: Task }` |
| `PATCH /api/tasks/:id` với `title` và/hoặc `completed` | `200 { task: Task }` |
| `DELETE /api/tasks/:id` | `204` không body |

`Task` gồm `id`, `title`, `completed`, `createdAt` UTC. Server từ chối JSON/body/trường/kiểu sai bằng 400, content type không hỗ trợ bằng 415, ID không tồn tại bằng 404; lỗi lưu trữ trả 500 với thông báo chung. Lỗi có dạng `{ error: { code, message } }`.

UI chỉ cập nhật sau khi lưu thành công. Khi lỗi, giữ nội dung đang nhập và dữ liệu cũ; có nút tải lại danh sách. Không tự retry mutation: phản hồi bị mất có thể xảy ra sau khi server đã lưu. Hãy tải lại để xác định dữ liệu trước khi thử tiếp. Công việc rời bộ lọc khi trạng thái không còn phù hợp. Có thông báo riêng cho danh sách trống và bộ lọc trống, nhãn form, focus bàn phím và bố cục màn hình nhỏ.

Đây là ví dụ chạy local cho một cá nhân, không có đăng nhập/phân quyền hoặc triển khai production.

## Kiểm chứng

```sh
pnpm typecheck
pnpm lint
pnpm build
pnpm exec playwright install chromium
pnpm test
```

`pnpm test` chạy controls độc lập, HTTP/API, Chromium UI, lỗi SQLite thật và restart/khởi tạo schema lần hai. Runner dùng database tạm riêng, cổng 3102, tự dừng process và dọn database; không xóa dữ liệu trong `data/`. Build trước khi chạy test vì runner dùng production server. Nếu cổng bận: `TEST_PORT=3112 pnpm test`. Chỉ chạy controls: `pnpm test:controls`.

Kết quả local ngày 2026-10-15: install với lockfile, build, typecheck và lint PASS; HTTP/API 5/5, controls 31/31, Chromium 14/14 (11 luồng ứng dụng + 3 controls của harness). Kiểm tra lỗi SQLite thật, chạy schema lần hai và restart giữ dữ liệu PASS; integrity của frozen suite v2 PASS trước/sau chạy. Kiểm tra và xem ảnh trực tiếp ở 360px/1280px, bàn phím/focus và console cũng đạt. Người dùng đã duyệt bàn giao local ngày 2026-10-15. Review độc lập READY, 6/6 task DONE; [báo cáo cuối](dev/_archived/20261015/task-manager/final-review.md).

Runner có thể in cảnh báo Node về module type khi chạy script TypeScript và pnpm exit 143 khi cố ý dừng server giữa các lượt restart; lệnh `pnpm test` tổng thể kết thúc exit 0. Đây không phải lỗi ứng dụng. Chưa chạy Safari/Firefox, remote CI hoặc deploy production. Xem [walkthrough](dev/_archived/20261015/task-manager/walkthrough.md) để biết kết quả từng vòng; controls/harness regression được phân biệt với kiểm chứng ứng dụng.

## Compass và lịch sử

- [PRD/intent](dev/_archived/20261015/task-manager/PRD.md), [plan](dev/_archived/20261015/task-manager/plan.md), [tasks](dev/_archived/20261015/task-manager/tasks.md), [walkthrough](dev/_archived/20261015/task-manager/walkthrough.md).
- [Skill và lịch sử thực tế](skill-history.md); giữ cả lần review BLOCKED và vòng sửa harness.
- [Freeze hiện tại v2](test-freeze.json), [suite v2](test-suite-v2.tar.gz), [freeze v1 được bảo tồn](test-freeze-v1.json), [suite v1](test-suite-v1.tar.gz).

Scaffold bằng CLI chính thức `pnpm dlx create-next-app@16.4.1`, App Router/TypeScript/ESLint, CSS thuần, dependency riêng bằng pnpm. Đã merge main policy `93bfe64` vào branch `example` qua `37830cb`: cho phép filesystem chung, giữ context mới/test-read guidance, tác giả test riêng, review độc lập và freeze. Không cần ngoại lệ isolation.

PRD và plan là các revision nguồn đã freeze; trạng thái trước nghiệm thu trong đó được giữ làm lịch sử. Kết quả bàn giao hiện tại nằm trong README, tasks và walkthrough.

Spec đã hoàn tất được gom tại `dev/_archived/20261015/task-manager/`, bên trong example2: PRD (intent), plan, tasks, walkthrough và reports. Lịch sử/snapshot kiểm chứng giữ tại root project như example1; các bản freeze/archive gốc giữ nguyên và manifest hiện tại ghi relocation.
