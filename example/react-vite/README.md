# Quản lý công việc — React + Vite

Project 1 của ví dụ Compass. Stack: React, TypeScript, Vite; pnpm quản lý dependency riêng. Yêu cầu sản phẩm nằm trong [PRD.md](dev/task-manager/PRD.md). Người dùng đã xác nhận kết quả bàn giao local ngày 2026-10-14; 5/5 task hoàn tất.

## Thành quả example 1

Ứng dụng một trang bằng tiếng Việt, chạy độc lập trong trình duyệt:

- Thêm, sửa trực tiếp, hủy sửa, xóa có xác nhận; đánh dấu hoàn thành hoặc mở lại.
- Ba bộ lọc trạng thái, thứ tự mới nhất trước, thông báo riêng cho danh sách rỗng và bộ lọc không có kết quả.
- Ba công việc mẫu khi mở lần đầu; lưu `localStorage`, giữ thay đổi và danh sách rỗng sau reload.
- Kiểm tra tiêu đề theo Unicode, hiển thị HTML dưới dạng văn bản; xử lý storage hỏng hoặc bị chặn và giữ dữ liệu/form khi ghi thất bại.
- Giao diện 360px/1280px, nhãn nhập liệu, focus nhìn thấy và thao tác bằng bàn phím.

Đã đạt AC-01–AC-07 của PRD bằng kiểm chứng được ghi trong [walkthrough](dev/task-manager/walkthrough.md). [Lịch sử skill và prompt](skill-history.md#lịch-sử-prompt-thực-tế) giữ yêu cầu và các vòng sửa test/review. PRD và plan là snapshot đã freeze; trạng thái hoàn thành hiện tại được ghi ở README, tasks và walkthrough.

## Chạy local

```sh
cd example/react-vite
pnpm install
pnpm dev
```

Mở địa chỉ Vite in trong terminal. Node 20.19+ hoặc 22.12+ theo hướng dẫn Vite; phiên triển khai dùng Node 26.9.0 và pnpm 10.22.0.

```sh
pnpm build
pnpm typecheck
pnpm lint
pnpm preview
```

Scaffold từ lệnh chính thức `pnpm create vite <target> --template react-ts --no-interactive --no-immediate`: https://vite.dev/guide/ . Tạo vào thư mục tạm rồi sao chép để giữ PRD và lịch sử có sẵn.

## Compass

Spec của project nằm trong `dev/task-manager/`: PRD (intent), plan, tasks và walkthrough. Lịch sử prompt/skill và các snapshot kiểm chứng giữ ở root project.

[PRD](dev/task-manager/PRD.md) là intent; [plan](dev/task-manager/plan.md), [tasks](dev/task-manager/tasks.md), [walkthrough](dev/task-manager/walkthrough.md) và [skill-history](skill-history.md) ghi quyết định và bằng chứng thực tế. Gate test/review trước implementation vẫn bắt buộc. Quy tắc trên `main` tại commit `93bfe64` cho phép subagent dùng chung filesystem/checkout/quyền host: phân tách test bằng fresh context, sanitized packet, phạm vi tìm kiếm và hướng dẫn không đọc test. Host isolation không bắt buộc. Test-author riêng, review độc lập, freeze và coordinator chạy test vẫn được giữ.

## Kiểm thử

Test domain dùng Node native TypeScript. Dùng Node 26 như phiên kiểm chứng; phiên bản Node thấp hơn chưa được kiểm tra với runner này.

```sh
pnpm test
pnpm test:controls
pnpm exec playwright install chromium
pnpm test:browser
```

Playwright tự chạy dev server ở 127.0.0.1:4173; cổng phải trống. Bộ test do agent riêng soạn từ PRD, được review độc lập rồi freeze trong [test-freeze.json](test-freeze.json). Controls kiểm tra bộ assertion với các quy tắc đúng và sai có chủ đích.

## Sử dụng

Lần đầu có ba công việc mẫu. Nhập tiêu đề rồi bấm Thêm hoặc Enter. Sửa trực tiếp từng dòng bằng Lưu/Hủy; checkbox đổi trạng thái; bộ lọc chọn Tất cả/Chưa hoàn thành/Đã hoàn thành. Xóa và đặt lại dữ liệu mẫu cần xác nhận.

Tiêu đề được trim, dài 1–200 Unicode code point, cho phép trùng. Dữ liệu lưu bằng khóa `compass-example-react-vite.tasks.v1` của origin hiện tại; reload giữ thay đổi và danh sách rỗng. Origin/cổng khác có storage riêng. Nếu dữ liệu hỏng, ứng dụng giữ nguyên và cho phép xác nhận đặt lại. Nếu storage không đọc được, thao tác ghi bị khóa; nếu ghi thất bại, danh sách và form giữ nguyên để thử lại.

Không có API nghiệp vụ, backend hoặc secrets. Chỉ hỗ trợ một tab; không đồng bộ giữa thiết bị hay nhiều tab. Đặt lại sẽ thay danh sách bằng dữ liệu mẫu; chỉ dùng sau khi đồng ý xác nhận.

## Kết quả kiểm chứng

- Domain: 8/8; control: 8/8; Chromium browser: 12/12.
- Build và typecheck PASS; lint exit 0, một cảnh báo state-in-effect khi khởi tạo localStorage.
- Đã kiểm tra ảnh ở 360px/1280px, bàn phím cho CRUD, reload, console và không có fetch/XHR nghiệp vụ.
- Test v1 được giữ trong `test-suite-v1.tar.gz`; lỗi harness được sửa qua đầy đủ revision PRD/plan và review/freeze v2, không sửa hành vi sản phẩm theo test sai.

Review độc lập mã nguồn và delivery analysis: READY, không có blocker. Cảnh báo lint ở bước đồng bộ localStorage đã được reviewer đánh giá là phù hợp. Chưa deploy production hoặc kiểm tra Firefox/Safari. Xem walkthrough để biết trạng thái bàn giao mới nhất.
