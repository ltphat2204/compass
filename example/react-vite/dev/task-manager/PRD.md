# PRD: Project 1 — Quản lý công việc với React + Vite

- Độ khó: Cơ bản.
- Loại: Feature. Chế độ đặc tả: Standard.
- Trạng thái: đã mô tả yêu cầu, chưa triển khai hoặc kiểm chứng runtime.
- Cơ sở: [tổng quan example](../../../README.md) và yêu cầu tạo ba project của người dùng.
- Tài liệu này đóng vai trò đầu vào intent cho Compass, dùng tên `PRD.md` theo yêu cầu; không tạo bản intent trùng nội dung.

## Mục tiêu

Tạo ứng dụng frontend không API để luyện chuyển yêu cầu UI thành hành vi có thể kiểm chứng. React + Vite + TypeScript là stack đã được yêu cầu; dữ liệu lưu trong trình duyệt.

## Người dùng và luồng chính

Người dùng là một cá nhân muốn quản lý danh sách việc cần làm trên máy phát triển; người học dùng ứng dụng để thực hành Compass.

1. Mở trang danh sách, xem công việc mới nhất trước; nếu cùng thời điểm tạo, dùng ID làm thứ tự phụ cố định.
2. Nhập tiêu đề và bấm Thêm; thành công thì xóa nội dung ô nhập và hiển thị công việc chưa hoàn thành.
3. Chọn Sửa, thay tiêu đề, bấm Lưu hoặc Hủy; Hủy giữ nguyên dữ liệu cũ.
4. Đánh dấu hoàn thành hoặc chuyển lại chưa hoàn thành.
5. Lọc Tất cả / Chưa hoàn thành / Đã hoàn thành; đổi bộ lọc không thay đổi dữ liệu.
6. Chọn Xóa, xác nhận trước khi xóa vĩnh viễn; hủy xác nhận giữ nguyên công việc.

## Quy tắc nghiệp vụ và dữ liệu

- Một công việc có `id` là chuỗi không rỗng và duy nhất, `title`, `completed` dạng boolean và `createdAt` theo ISO 8601 UTC. ID và thời điểm tạo không thay đổi khi sửa.
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

## Lưu trữ và xử lý lỗi

- Dùng khóa `compass-example-react-vite.tasks.v1` trong `localStorage`; không chứa thông tin nhạy cảm.
- Khi khóa chưa tồn tại, tạo đúng ba công việc mẫu cố định có cả hai trạng thái và lưu một lần. Danh sách đã lưu là `[]` phải giữ trống sau reload.
- Kiểm tra cấu trúc dữ liệu đã lưu trước khi sử dụng. JSON lỗi hoặc bản ghi sai cấu trúc: hiển thị lỗi, không tự ghi đè; cho phép người dùng xác nhận đặt lại dữ liệu mẫu.
- Nếu không đọc được storage, báo lỗi và khóa thao tác ghi. Nếu ghi thất bại (ví dụ hết quota), giữ danh sách trước thao tác, giữ form và cho phép thử lại; không âm thầm chuyển sang chế độ chỉ lưu trong RAM.
- ID được tạo tại client. Chỉ xét một tab đang thao tác; đồng bộ và xử lý xung đột nhiều tab nằm ngoài phạm vi.
- Tất cả thao tác nghiệp vụ chạy ở client. Tải asset và kết nối dev server không được tính là API nghiệp vụ.

## Ranh giới kỹ thuật và bàn giao

Project ở `example/react-vite/`, quản lý dependency riêng bằng pnpm. Cần có lệnh dev, build, kiểm tra kiểu và test được ghi trong README khi triển khai. Chưa chốt phiên bản package hoặc thư viện test; xác minh tính tương thích ở bước lập kế hoạch.

Bàn giao mã nguồn UI, lưu trữ local, dữ liệu mẫu, kiểm chứng hành vi, README hướng dẫn chạy và `skill-history.md`. Không cần backend, database server hoặc biến môi trường bí mật.

## Tiêu chí nghiệm thu

| ID | Kết quả cần đạt | Cách kiểm chứng dự kiến |
| --- | --- | --- |
| AC-01 | Lần mở đầu có ba mẫu; xóa hết rồi reload vẫn rỗng. | Kiểm tra storage mới và storage chứa mảng rỗng. |
| AC-02 | Thêm/sửa/hoàn thành/mở lại/xóa có xác nhận hoạt động; Hủy không đổi dữ liệu. | Test hành vi và luồng trình duyệt. |
| AC-03 | Quy tắc trim, độ dài và tiêu đề trùng đúng như mô tả. | Test biên 0/1/200/201 ký tự, gồm Unicode. |
| AC-04 | Ba bộ lọc và thứ tự danh sách đúng, không làm mất bản ghi. | Test với dữ liệu hỗn hợp trạng thái. |
| AC-05 | Reload giữ dữ liệu; storage hỏng hoặc bị chặn không gây ghi đè hay báo lưu thành công. | Mô phỏng lỗi đọc/ghi và thử lại. |
| AC-06 | Đáp ứng yêu cầu responsive, bàn phím và hiển thị HTML dưới dạng text. | Kiểm tra trình duyệt ở hai kích thước và bằng bàn phím. |
| AC-07 | Build và kiểm tra kiểu thành công; không có API nghiệp vụ. | Chạy script thực tế và kiểm tra Network trong luồng CRUD. |

## Giả định, quyết định còn lại và readiness

- Stack và độ khó lấy từ yêu cầu; nghiệp vụ quản lý công việc và cách lưu dữ liệu kế thừa README. Các chi tiết như giới hạn tiêu đề, lỗi, thứ tự và hành vi phục hồi là mặc định do AI đề xuất trong PRD này, có thể chỉnh trước triển khai.
- Chưa có mã nguồn, manifest, test hoặc CI trong project tại thời điểm viết. Tác động hiện tại chỉ là tài liệu; không thay đổi runtime của repository Compass.
- Deferred: phiên bản package, thư viện test và cách tổ chức module được quyết định trong plan dựa trên môi trường thực tế; không làm thay đổi tiêu chí sản phẩm.
- Requirements gate: READY cho lập kế hoạch theo các giả định đã ghi. Tự rà soát phạm vi, quy tắc, lỗi và tiêu chí ở bước `comp-intent`; không có câu hỏi sản phẩm đang chặn. Đây không phải kết quả review độc lập hay kiểm chứng ứng dụng.

## Trình tự phát triển và lịch sử

1. Lập plan và tasks từ PRD, ánh xạ các AC vào kiểm chứng; xác minh công cụ và phiên bản thực tế.
2. Thực hiện gate test của Compass trước thay đổi hành vi: viết test riêng, review độc lập, freeze và xác minh isolation trước khi giao implementation.
3. Triển khai, kiểm chứng các AC, review và bàn giao local với README chạy ứng dụng. Chỉ đánh dấu hoàn thành khi có bằng chứng thực tế.

Ghi mỗi lần gọi skill vào [skill-history.md](../../skill-history.md), gồm đầu vào, kết quả, kiểm chứng và blocker. Không coi các bước dự kiến bên trên là lịch sử đã chạy.

- Làm rõ trước freeze (2026-10-14): ID phải là chuỗi không rỗng; đây là quyết định sản phẩm do AI chọn trong phạm vi người dùng đã ủy quyền, không thay đổi dữ liệu đã triển khai vì chưa có ứng dụng.

## Revision 2 — frozen harness correction, 2026-10-14
Complete document reviewed again: outcome, scope, business rules, failure expectations, architecture, roadmap, coverage and review gates unchanged. Revision reason: checkbox check/uncheck postcondition waits on an element intentionally removed by filtering, and generic success-message substring matches an error about previously stored invalid data. Replace harness interactions and success classification; do not change product behavior to satisfy erroneous checks. Source revision 1 and frozen suite preserved in test-suite-v1.tar.gz and test-freeze-v1.json. Acceptance evidence from failed browser run is invalid for delivery; revalidate/re-freeze suite and rerun all acceptance gates. Requirements and coverage consistency self-check READY for replacement authorship; implementation paused pending new freeze.
