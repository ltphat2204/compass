# Lịch sử gọi skill

Nhật ký nối tiếp; thời gian theo Asia/Ho_Chi_Minh. Chỉ ghi hoạt động đã thực hiện; các bước triển khai chưa chạy không được ghi là thành công.

| Thời điểm | Skill | Yêu cầu / đầu vào | Kết quả / artifacts | Kiểm chứng / blocker |
| --- | --- | --- | --- | --- |
| 2026-10-14 21:06 | `comp-intent` | Yêu cầu viết PRD chi tiết; `../README.md`; skill và adaptive-workflow reference | Tạo [PRD.md](PRD.md) theo định dạng người dùng yêu cầu; đặc tả Standard | Tự rà soát requirements: READY cho plan theo giả định ghi trong PRD; chưa triển khai hoặc kiểm chứng runtime. |
| 2026-10-15 | `comp-engineer` | `/goal hoàn thành example 2 theo đúng convention`; PRD có sẵn, convention example 1 | Xác định phạm vi example 2; [walkthrough](dev/task-manager/walkthrough.md) | Node/pnpm và SQLite probe thành công; behavior BLOCKED vì chưa có read isolation hoặc ngoại lệ riêng cho example 2. |
| 2026-10-15 | `comp-analyze` | Tự rà soát requirements PRD AC-01–AC-08 trước plan | Requirements READY cho planning; giữ nguyên PRD | Không có quyết định sản phẩm đang chặn; chưa kiểm chứng ứng dụng. |
| 2026-10-15 | `comp-plan` | PRD, môi trường thực tế và strict-testing reference | [plan revision 1](dev/task-manager/plan.md) | Standard, medium risk; giữ test độc lập/review/freeze/isolation trước implementation. |
| 2026-10-15 | `comp-tasks` | PRD và plan revision 1 | [tasks](dev/task-manager/tasks.md), 0/6 DONE | Gate validation/freeze/access còn chờ; chưa bắt đầu implementation. |
| 2026-10-15 | `comp-analyze` | Tự rà soát consistency PRD/plan/tasks | Coverage AC-01–AC-08 và dependency order READY cho preparation | Execution chưa READY; không coi planned commands là kết quả chạy. |
| 2026-10-15 | `vercel:nextjs` | App Router scaffold convention, CLI help chính thức | Scaffold create-next-app 16.4.1; README ghi trạng thái thực tế | Install/build/lint/typecheck exit 0; TASK-01 DONE, 1/6. Chưa có CRUD/API/database. |
| 2026-10-15 | `comp-engineer` | Điều phối bước test độc lập theo strict-testing reference | Fresh subagent `example2_test_author`, chỉ PRD/public contracts và scope tests | Candidate đang chuẩn bị; chưa review/freeze; ngoại lệ isolation đã hỏi người dùng, chưa có câu trả lời. |
| 2026-10-15 | `comp-engineer` | Người dùng: “tôi đã sửa rồi mà, có merge main qua branch này chưa” | Fetch/merge origin/main `93bfe64` qua merge `37830cb`; đọc policy mới; plan revision 2 | `origin/main` là ancestor của HEAD; bỏ blocker host isolation theo rule mới, giữ context riêng/review/freeze. Không cần ngoại lệ. |
| 2026-10-15 | `comp-implement` | Test-author riêng từ PRD/public contracts, chưa implementation | Candidate tests, controls 17/17, Chromium collect 9 | Chưa acceptance; schema/source chưa có. |
| 2026-10-15 | `comp-review` | Fresh `example2_test_review`: PRD/plan/candidate snapshot và coordinator-run evidence | [Candidate 1 validation](dev/task-manager/test-validation-candidate1.md): BLOCKED | Thiếu guards/control/luồng lỗi; tác giả sửa trước freeze. Không giảm gate hoặc viết behavior. |
| 2026-10-15 | `comp-review` | Fresh `example2_test_review2`, corrected candidate, source identities và coordinator-run controls | [Validation v1](dev/task-manager/test-validation-v1.md): PASS | Controls 31/31; Chromium collect 11; exact 13-input snapshot unchanged. App acceptance còn chờ. |
| 2026-10-15 | `comp-implement` | Independent PASS và sanitized implementation packet | FROZEN v1 [manifest](test-freeze.json), [archive](test-suite-v1.tar.gz); TASK-02/03 DONE, 3/6 | Fresh context/test-read guidance theo main; không tuyên bố host-enforced secrecy. |
| 2026-10-15 | `comp-implement` | Fresh `example2_implementer`, PRD và sanitized packet sau freeze v1 | Production source bàn giao; không đọc/chạy test | Build/scoped lint PASS; coordinator API5/5, controls31/31, browser2/11; typecheck/lint PASS. Chưa DONE. |
| 2026-10-15 | `comp-plan`, `comp-analyze`, `comp-tasks` | Frozen-v1 harness failures; full PRD/plan re-review, giữ v1 | PRD revision2, plan revision3; reopen TASK-02/03, progress1/6 | Requirements/consistency READY cho replacement tests; product/AC không đổi, chưa replacement freeze. |
| 2026-10-15 | `comp-review` | Fresh `example2_final_review`, production snapshot/PRD/plan; test authorship không tham gia | [Source review](dev/task-manager/source-review.md): không có material findings | 18 hashes unchanged; xác nhận secondary ID order. Final aggregate còn chờ replacement acceptance/docs. |
| 2026-10-15 | `comp-implement` | Full source revision, tác giả test sửa harness độc lập | Replacement candidate, controls31/31, browser harness regression1/1, collect12 | Chỉ tests/ui.spec.mjs thay đổi; production không đổi; chờ review/freeze v2. |
| 2026-10-15 | `comp-review` | Fresh replacement reviewer, PRD r2/plan r3/13-input candidate snapshot | [Replacement candidate report](dev/task-manager/test-validation-replacement-candidate.md): BLOCKED | Error helper nhận nhầm success/progress; trả test-author sửa trước freeze v2, product/source không đổi. |
| 2026-10-15 | `comp-review` | Scoped independent re-review corrected replacement, exact PRD r2/plan r3/resource hashes | [Validation v2](dev/task-manager/test-validation-v2.md): PASS | Controls31/31; harness3/3; collect14; no product/source weakening. |
| 2026-10-15 | `comp-implement` | Exact replacement PASS snapshot | FROZEN v2 [manifest](test-freeze-v2.json)/[archive](test-suite-v2.tar.gz), TASK-02/03 DONE,3/6 | V1 preserved; source business behavior unchanged; resume coordinator acceptance. |
| 2026-10-15 | `comp-implement` | Coordinator acceptance trên final production source và FROZEN v2 | API5/5, controls31/31, Chromium14/14; SQLite lock/restart/reinit PASS | Install frozen/build/typecheck/lint PASS; suite integrity trước/sau PASS; browser14 gồm11 app +3 harness controls. |
| 2026-10-15 | `comp-analyze` | Delivery coverage PRD r2/plan r3/tasks/evidence | Mọi AC có evidence; final independent review còn chờ | Không dùng collection/controls thay app acceptance; giữ cảnh báo module/intentional cleanup và giới hạn browser/platform. |

| 2026-10-15 | `comp-review` | Fresh aggregate source/spec/tests/evidence/docs snapshot42 files | [Final review](dev/task-manager/final-review.md): READY; không có material findings | AC-01–AC-08/all6 task covered; frozen13 inputs/seven tests/v1-v2 archive integrity PASS. |
| 2026-10-15 | `comp-ship` | Local delivery, actual verification matrix và independent READY | TASK-04/05/06 DONE, 6/6; README/overview/history/evidence đầy đủ | Local Conventional Commit; không push/PR/remote CI/deploy. Giữ artifacts chờ user acceptance. |

## Cách đếm workflow và lịch sử thực tế

`comp-engineer` được áp dụng một lần để điều phối yêu cầu goal và tiếp tục cùng workflow khi người dùng điều chỉnh về main. Các dòng stage trong bảng là hoạt động đã thực hiện, không phải nhiều lượt gọi engineer hoặc CLI giả định. Mã nghiệp vụ được viết trong một lượt implementer riêng; các lượt sửa sau đó chỉ thay harness kiểm chứng và bỏ asset scaffold không dùng.

| Vòng | Kết quả thực tế |
| --- | --- |
| 1. Chuẩn bị | Đọc PRD, lập plan/tasks; scaffold chính thức và baseline PASS. Ban đầu đọc policy cũ trên branch example. |
| 2. Đồng bộ convention | Người dùng nhắc main đã sửa; fetch/merge main93bfe64 qua37830cb, bỏ blocker isolation theo policy mới, không cần ngoại lệ. |
| 3. Candidate đầu | Controls17/17/collect9; reviewer BLOCKED vì thiếu guard/control/luồng lỗi. Sửa trước freeze. |
| 4. Freeze v1 | Candidate có controls31/31/collect11; reviewer mới PASS, freeze exact snapshot. |
| 5. Implementation và chạy đầu | Một implementer context mới viết app; API5/5 và static checks PASS; browser2/11 vì harness giả định sai về label/checkbox/reload lock. Giữ v1, dừng delivery. |
| 6. Replacement suite | Full PRD r2/plan r3 revision, sửa harness; replacement review BLOCKED vì nhận nhầm success/progress là lỗi; sửa trước freeze v2, browser controls3/3. |
| 7. Freeze v2 và acceptance | Independent re-review PASS; freeze v2; API5/5, controls31/31, browser14/14, SQLite lock/restart/reinit và integrity PASS. |
| 8. Review và bàn giao | Independent aggregate review READY, all6 task/AC có evidence; bàn giao local6/6, giữ các vòng BLOCKED và giới hạn trong walkthrough. |

## Lịch sử prompt thực tế

Chỉ trích các prompt hiện có trong hội thoại; không tái dựng prompt gốc của `comp-intent` ngày2026-10-14.

Người dùng, 2026-10-15:

```text
/goal hoàn thành example 2 theo đúng convention
```

Sau câu hỏi về isolation dựa trên policy cũ, người dùng trả lời:

```text
tôi đã sửa rồi mà, có merge main qua branch này chưa
```

Kết quả: xác minh main đã có fix policy và merge vào branch example trước triển khai. Không coi câu trả lời này là phê duyệt ngoại lệ; sử dụng chính rule mới của repository. Không thêm prompt hoặc invocation chưa xảy ra.
