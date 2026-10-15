# PRD: Project 2 — Quản lý công việc full stack với Next.js

- Độ khó: Trung bình.
- Loại: Feature. Chế độ đặc tả: Standard.
- Revision: 2, 2026-10-15; revision 1 được giữ trong `test-suite-v1.tar.gz`.
- Trạng thái: đã có implementation; API/controls và static checks đạt ở vòng đầu, browser acceptance đang được kiểm chứng lại sau sửa harness. Chưa bàn giao hoàn tất.
- Cơ sở: [tổng quan example](../README.md) và yêu cầu tạo ba project của người dùng.
- Tài liệu này đóng vai trò đầu vào intent cho Compass, dùng tên `PRD.md` theo yêu cầu; không tạo bản intent trùng nội dung.

## Mục tiêu

Tạo ứng dụng có UI, HTTP API và lưu trữ bền vững trong cùng project. Người dùng có thể đóng và khởi động lại ứng dụng mà không mất công việc. Dùng Next.js App Router, Route Handlers, TypeScript và SQLite.

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

## API và lưu trữ

| Phương thức / đường dẫn | Đầu vào | Kết quả thành công |
| --- | --- | --- |
| `GET /api/tasks` | Không có body | `200 { tasks: Task[] }`, theo thứ tự đã quy định |
| `POST /api/tasks` | `{ title: string }` | `201 { task: Task }` |
| `PATCH /api/tasks/:id` | `title` và/hoặc `completed` | `200 { task: Task }` |
| `DELETE /api/tasks/:id` | Không có body | `204`, không có body |

- Server tạo ID và thời điểm tạo. SQLite là nguồn dữ liệu duy nhất; client không dùng localStorage để lưu công việc.
- PATCH phải có ít nhất một trường cho phép; từ chối trường lạ, sai kiểu, `null` và tiêu đề không hợp lệ. POST chỉ nhận `title`. Body của POST/PATCH phải là JSON object.
- JSON lỗi hoặc dữ liệu không hợp lệ trả `400`; content type không hỗ trợ trả `415`; sửa/xóa ID không tồn tại trả `404`; lỗi lưu trữ trả `500` với thông báo chung.
- Lỗi có dạng `{ error: { code, message } }`; không trả stack trace, SQL hoặc đường dẫn máy chủ.
- Database ban đầu rỗng. Có quy trình tạo schema có thể chạy lại mà không xóa dữ liệu; không tự seed mỗi lần khởi động. Không commit file database.
- Mỗi mutation phải lưu thành công trước khi API báo thành công. GET luôn phản ánh dữ liệu đã lưu, không trả bản cache cũ sau mutation.
- Không yêu cầu giải quyết chỉnh sửa đồng thời; thao tác được lưu sau cùng thắng. DELETE lặp lại trả 404.

## Luồng UI và lỗi mạng

UI đọc và ghi qua Route Handlers cùng origin. Khi tải danh sách, hiển thị đang tải; nếu lỗi, hiển thị nút thử lại. Khi mutation đang chạy, khóa nút gửi tương ứng để tránh gửi lặp. Chỉ cập nhật danh sách sau phản hồi thành công.

Lỗi 400 hiển thị thông báo phù hợp và giữ form; lỗi 404 yêu cầu tải lại danh sách; lỗi kết nối/500 giữ trạng thái trước thao tác. Không tự retry mutation vì phản hồi bị mất có thể xảy ra sau khi server đã lưu; người dùng tải lại danh sách để kiểm tra trước khi thử lại.

## Ranh giới kỹ thuật và bàn giao

Project ở `example/nextjs-fullstack/`, dependency riêng bằng pnpm; dùng Node runtime cho thao tác SQLite. Chọn driver và phiên bản tương thích khi lập kế hoạch. Chạy local; không cung cấp một hệ thống công khai có bảo vệ truy cập.

Bàn giao UI, Route Handlers, schema và hướng dẫn khởi tạo database, test nghiệp vụ/API, kiểm chứng luồng xuyên suốt, README cấu hình đường dẫn database và các lệnh dev/build/typecheck/test, cùng `skill-history.md`.

## Tiêu chí nghiệm thu

| ID | Kết quả cần đạt | Cách kiểm chứng dự kiến |
| --- | --- | --- |
| AC-01 | UI hoàn thành toàn bộ CRUD, xác nhận xóa, Hủy và lọc trạng thái. | Kiểm chứng UI → Route Handler → SQLite. |
| AC-02 | Server thực thi mọi quy tắc dữ liệu, kể cả khi gọi API trực tiếp. | Test biên tiêu đề, JSON sai, trường lạ, kiểu sai và PATCH rỗng. |
| AC-03 | API trả đúng status và cấu trúc response; ID không tồn tại trả 404. | Integration test với database tạm độc lập. |
| AC-04 | Dữ liệu còn sau khi restart; khởi tạo schema lần hai không xóa dữ liệu. | Tạo công việc, restart, đọc lại và chạy lại khởi tạo schema. |
| AC-05 | Lỗi mạng/lưu trữ không tạo thông báo thành công giả; có thể tải lại để phục hồi. | Mô phỏng GET lỗi, mutation lỗi và phản hồi bị mất. |
| AC-06 | Danh sách mới nhất xuất hiện sau mutation và reload; không phụ thuộc localStorage. | Kiểm tra UI và GET trực tiếp. |
| AC-07 | Đạt yêu cầu responsive, accessibility và hiển thị text an toàn. | Kiểm tra trình duyệt và tiêu đề chứa HTML. |
| AC-08 | Build, kiểm tra kiểu và test đạt trên môi trường local được ghi rõ. | Chạy các script sau cài dependency và khởi tạo database. |

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

## Revision 2 — Rà soát đầy đủ trước replacement freeze

Đã rà soát lại toàn bộ mục tiêu, người dùng/luồng, quy tắc dữ liệu, trải nghiệm, ngoài phạm vi, API/lưu trữ, lỗi mạng, ranh giới bàn giao, AC-01–AC-08, giả định/readiness và trình tự phát triển. Giữ nguyên mọi tiêu chí và chính sách sản phẩm; không giảm kiểm tra dữ liệu hay phục hồi lỗi.

Lý do revision: frozen suite v1 có giả định harness vượt yêu cầu. Khi đang lưu, nhãn nút có thể thay đổi để thông báo tiến độ; test phải theo dõi cùng control qua trạng thái đó. Checkbox được xác nhận qua kết quả sau phản hồi server, không ép cập nhật tức thời. Sau lỗi, có thể tiếp tục khóa mutation để yêu cầu tải lại theo quy tắc phục hồi đã có; hoàn tất request được quan sát qua thông báo lỗi/kết quả phục hồi, không buộc nút luôn bật ngay. Đây là làm rõ cách kiểm chứng các hành vi đã cho phép, không thêm tính năng.

Requirements gate revision 2: READY sau coordinator self-review tất cả các mục; không có thay đổi sản phẩm cần quyết định. Implementation/source hiện tại được giữ nguyên trong vòng sửa harness. Acceptance evidence bị ảnh hưởng không được dùng để đánh dấu DONE. Replacement tests phải do tác giả riêng sửa, được review độc lập và freeze mới; giữ nguyên suite/manifest/report v1.
