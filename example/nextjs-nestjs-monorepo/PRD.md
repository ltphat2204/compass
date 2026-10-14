# PRD: Project 3 — Monorepo Next.js + NestJS

- Độ khó: Nâng cao.
- Loại: Feature. Chế độ đặc tả: Standard.
- Trạng thái: đã mô tả yêu cầu, chưa triển khai hoặc kiểm chứng runtime.
- Cơ sở: [tổng quan example](../README.md) và yêu cầu tạo ba project của người dùng.
- Tài liệu này đóng vai trò đầu vào intent cho Compass, dùng tên `PRD.md` theo yêu cầu; không tạo bản intent trùng nội dung.

## Mục tiêu

Tạo cùng trải nghiệm quản lý công việc nhưng tách frontend và backend thành hai ứng dụng. Mục tiêu học tập là quản lý hợp đồng API, cấu hình kết nối, dependency nội bộ và xác minh toàn luồng trong pnpm workspace.

## Người dùng và luồng chính

Người dùng là một cá nhân muốn quản lý danh sách việc cần làm trên máy phát triển; người học dùng ứng dụng để thực hành Compass.

1. Mở trang danh sách, xem công việc mới nhất trước; nếu cùng thời điểm tạo, dùng ID làm thứ tự phụ cố định.
2. Nhập tiêu đề và bấm Thêm; thành công thì xóa nội dung ô nhập và hiển thị công việc chưa hoàn thành.
3. Chọn Sửa, thay tiêu đề, bấm Lưu hoặc Hủy; Hủy giữ nguyên dữ liệu cũ.
4. Đánh dấu hoàn thành hoặc chuyển lại chưa hoàn thành.
5. Lọc Tất cả / Chưa hoàn thành / Đã hoàn thành; đổi bộ lọc không thay đổi dữ liệu.
6. Chọn Xóa, xác nhận trước khi xóa vĩnh viễn; hủy xác nhận giữ nguyên công việc.

## Quy tắc nghiệp vụ và dữ liệu

- Một công việc có `id` duy nhất, `title`, `completed` dạng boolean và `createdAt` theo ISO 8601 UTC. ID và thời điểm tạo không thay đổi khi sửa.
- Tiêu đề được trim hai đầu trước khi kiểm tra và lưu, dài 1–200 ký tự theo số Unicode code point. Cho phép tiêu đề trùng; khoảng trắng bên trong được giữ nguyên.
- Ví dụ: `  Mua sữa  ` được lưu thành `Mua sữa`; chuỗi toàn khoảng trắng bị từ chối; 200 ký tự được chấp nhận, 201 ký tự bị từ chối.
- Công việc mới có `completed=false`. Không có mô tả, hạn chót, mức ưu tiên hoặc người được giao.
- Hiển thị tiêu đề như văn bản; nội dung chứa thẻ HTML không được thực thi.
- Danh sách trống và bộ lọc không có kết quả có thông báo riêng. Công việc vừa đổi trạng thái sẽ rời bộ lọc hiện tại nếu không còn phù hợp.

## Yêu cầu trải nghiệm

- Một trang chính có tiêu đề, form thêm, bộ lọc và danh sách; form sửa có thể nằm ngay trong dòng công việc.
- Dùng được ở chiều rộng 360px và 1280px, không cuộn ngang toàn trang.
- Ô nhập có nhãn; nút có tên rõ ràng; thao tác được bằng bàn phím với focus nhìn thấy. Lỗi gắn với trường nhập hoặc được thông báo ở vùng trạng thái.
- Giữ nội dung đang nhập khi lưu thất bại. Không hiển thị thành công khi dữ liệu chưa được lưu.

## Ngoài phạm vi

Đăng nhập, phân quyền, nhiều người dùng, cộng tác thời gian thực, kéo thả, tìm kiếm, phân trang, thông báo, file đính kèm, đồng bộ giữa ba project và triển khai production. Mỗi project là ứng dụng độc lập; không phụ thuộc mã nguồn của project khác.

## Kiến trúc và quyền sở hữu

```text
example/nextjs-nestjs-monorepo/
  apps/web/            # Next.js App Router, UI
  apps/api/            # NestJS, HTTP API, SQLite
  packages/contracts/  # Kiểu dữ liệu Task, request, response, lỗi
  pnpm-workspace.yaml
  package.json
  pnpm-lock.yaml
```

- Trình duyệt gọi trực tiếp NestJS bằng base URL cấu hình; Next.js không triển khai API CRUD thứ hai.
- `apps/api` sở hữu validation runtime, schema, truy cập database và mọi mutation. `apps/web` không đọc file SQLite hay import code NestJS.
- `packages/contracts` chỉ chia sẻ kiểu dữ liệu; không import framework, driver database hoặc secrets. Kiểu TypeScript không thay thế validation tại API.
- Hai ứng dụng phụ thuộc contracts qua workspace. Không phụ thuộc mã nguồn hai example trước; không thêm công cụ orchestration ngoài pnpm nếu chưa cần.

## Hợp đồng API

| Phương thức / đường dẫn | Đầu vào | Kết quả thành công |
| --- | --- | --- |
| `GET /api/tasks` | Không có body | `200 { tasks: Task[] }` theo thứ tự đã quy định |
| `POST /api/tasks` | `{ title: string }` | `201 { task: Task }` |
| `PATCH /api/tasks/:id` | `title` và/hoặc `completed` | `200 { task: Task }` |
| `DELETE /api/tasks/:id` | Không có body | `204`, không có body |

NestJS tạo ID và thời điểm tạo. POST chỉ nhận title; PATCH phải có ít nhất một trường được phép. JSON không hợp lệ, trường lạ, `null`, kiểu sai hoặc vi phạm nghiệp vụ trả 400; content type không hỗ trợ trả 415; ID không tồn tại khi sửa/xóa trả 404. Lỗi lưu trữ trả 500. Lỗi thống nhất `{ error: { code, message } }`, không lộ chi tiết nội bộ.

Database ban đầu rỗng, khởi tạo schema có thể chạy lại mà không xóa dữ liệu. Lưu thành công trước khi trả response; GET không dùng cache làm cũ dữ liệu. Chỉnh sửa đồng thời theo lần ghi cuối cùng; không hỗ trợ giải quyết xung đột. DELETE lặp lại trả 404.

## Cấu hình, vận hành local và lỗi kết nối

- Mặc định web dùng cổng 3000, API dùng 3001. Cấu hình được cổng API, base URL công khai của API, origin web được phép và đường dẫn SQLite.
- CORS cho phép đúng origin web cấu hình, gồm preflight cho JSON, PATCH và DELETE. Origin ngoài danh sách không nhận header cho phép truy cập; CORS không được xem là cơ chế xác thực API.
- Có `.env.example` cho từng ứng dụng, mô tả biến công khai và biến chỉ dùng server. Không đưa đường dẫn database hoặc secret vào client bundle.
- API thiếu cấu hình bắt buộc hoặc không mở được database phải dừng với lỗi dễ hiểu. Web thiếu base URL phải báo lỗi cấu hình rõ ràng, không tự gọi nhầm origin.
- UI có loading, empty, error và retry cho GET. Mutation khóa nút gửi khi chờ; chỉ cập nhật sau thành công, giữ form khi lỗi. Không tự retry mutation; phản hồi bị mất yêu cầu tải lại trước khi thử lại.
- API tắt rồi bật lại: UI báo mất kết nối, sau khi người dùng thử lại thì đọc được dữ liệu bền vững.
- Từ root có lệnh cài đặt, dev đồng thời hai ứng dụng, build, typecheck và test. Lệnh dev dừng cả hai tiến trình khi người dùng ngắt. Build theo dependency của contracts; không yêu cầu cài riêng trong từng app.

## Bàn giao và giới hạn

Bàn giao workspace, hai ứng dụng, package contracts, schema SQLite, ví dụ cấu hình, hướng dẫn chạy từ root và riêng từng app, test hợp đồng/API, kiểm chứng tích hợp trình duyệt và `skill-history.md`.

Dùng môi trường local không có authentication. Docker, CI/CD, deployment, gateway, microservices và package registry riêng nằm ngoài phạm vi. Phiên bản runtime/framework và driver SQLite được chọn ở bước plan rồi khóa trong manifest/lockfile.

## Tiêu chí nghiệm thu

| ID | Kết quả cần đạt | Cách kiểm chứng dự kiến |
| --- | --- | --- |
| AC-01 | Một lần cài từ workspace root đủ để chạy hai app và resolve contracts. | Kiểm tra cài sạch từ lockfile sau khi có mã nguồn. |
| AC-02 | CRUD từ web đi đến NestJS và SQLite; Next.js không sở hữu database. | Kiểm chứng trình duyệt, API và dữ liệu sau restart. |
| AC-03 | Validation runtime và hợp đồng response đúng, kể cả gọi API trực tiếp. | Test title biên/Unicode, trường lạ, kiểu sai, 400/404/415/500. |
| AC-04 | Contracts được hai app sử dụng; lỗi kiểu không tương thích được typecheck phát hiện. | Kiểm tra dependency và chạy typecheck của workspace. |
| AC-05 | Origin được phép hoạt động cả preflight; origin khác không nhận quyền CORS. | Kiểm tra OPTIONS và request thực với hai origin. |
| AC-06 | Thiếu cấu hình, API ngừng chạy hoặc database lỗi có kết quả phục hồi rõ ràng. | Mô phỏng lỗi cấu hình, ngắt/khởi động lại API và thử lại GET. |
| AC-07 | Build từ root đúng thứ tự dependency; dev dừng sạch hai tiến trình. | Chạy script root, kiểm tra cổng được giải phóng sau khi dừng. |
| AC-08 | CRUD, lọc, Hủy, xác nhận xóa, responsive và bàn phím hoạt động đầy đủ. | Kiểm tra hành trình người dùng ở 360px và 1280px. |
| AC-09 | Database tồn tại sau restart, không bị seed/khởi tạo ghi đè; lỗi không lộ nội bộ. | Integration test với database tạm và kiểm tra response lỗi. |

## Giả định, quyết định còn lại và readiness

- Stack và độ khó lấy từ yêu cầu; nghiệp vụ quản lý công việc và cách lưu dữ liệu kế thừa README. Các chi tiết như giới hạn tiêu đề, lỗi, thứ tự và hành vi phục hồi là mặc định do AI đề xuất trong PRD này, có thể chỉnh trước triển khai.
- Chưa có mã nguồn, manifest, test hoặc CI trong project tại thời điểm viết. Tác động hiện tại chỉ là tài liệu; không thay đổi runtime của repository Compass.
- Deferred: phiên bản package, thư viện test và cách tổ chức module được quyết định trong plan dựa trên môi trường thực tế; không làm thay đổi tiêu chí sản phẩm.
- Requirements gate: READY cho lập kế hoạch theo các giả định đã ghi. Tự rà soát phạm vi, quy tắc, lỗi và tiêu chí ở bước `comp-intent`; không có câu hỏi sản phẩm đang chặn. Đây không phải kết quả review độc lập hay kiểm chứng ứng dụng.

## Trình tự phát triển và lịch sử

1. Lập plan và tasks từ PRD, ánh xạ các AC vào kiểm chứng; xác minh công cụ và phiên bản thực tế.
2. Thực hiện gate test của Compass trước thay đổi hành vi: viết test riêng, review độc lập, freeze và xác minh isolation trước khi giao implementation.
3. Triển khai, kiểm chứng các AC, review và bàn giao local với README chạy ứng dụng. Chỉ đánh dấu hoàn thành khi có bằng chứng thực tế.

Ghi mỗi lần gọi skill vào [skill-history.md](skill-history.md), gồm đầu vào, kết quả, kiểm chứng và blocker. Không coi các bước dự kiến bên trên là lịch sử đã chạy.
