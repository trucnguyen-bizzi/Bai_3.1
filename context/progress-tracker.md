# Progress Tracker

Cập nhật file này sau mỗi thay đổi đáng kể.

## Current Phase

In progress

## Current Goal

Unit 03

## Completed

- Khung dự án: context (6 file), spec 4 unit, cấu hình ESLint + Prettier, `AGENTS.md`.
- Unit 01: Apollo Server (query hello, helper test)
- Unit 02: API truy vấn người dùng (users, user(id)), chưa xác thực

## In Progress

- None yet.

## Next Up

1. Unit 03 — Xác thực JWT (`03-jwt-authentication.md`)
2. Unit 04 — Kiểm soát quyền truy cập (`04-access-control.md`)

## Open Questions

1. **User thường có được xem thông tin riêng tư của chính mình không?**
   Đề ghi "user bình thường chỉ được truy vấn thông tin công khai". Mặc định hiện tại: **được xem của chính
   mình** (qua `me` và khi `id` trùng). Nếu giáo viên hiểu nghiêm ngặt, bỏ vế "chính mình" trong
   `canViewPrivate` và sửa test tương ứng ở Unit 04. Cần xác nhận trước khi nộp.
2. **Ngoại lệ D1** (bắt buộc đuôi `.js` trong import vì Node ESM) — xác nhận chấp nhận, hoặc chuyển sang
   TypeScript + `tsx`. Xem `code-standards.md`.

## Architecture Decisions

- Thứ tự unit: 01 Apollo → 02 API người dùng → 03 JWT → 04 phân quyền (dependencies first; security trước
  các tính năng cần được bảo vệ).
- Token chỉ chứa `sub`; role đọc lại từ dữ liệu mỗi request để đổi quyền có hiệu lực ngay.
- Chỉ chấp nhận HS256 khi verify (chặn tấn công đổi thuật toán).
- Phân quyền ở resolver cấp trường để mọi đường truy vấn (`me`, `users`, `user`) đều bị kiểm tra như nhau.
- Trường riêng tư nullable để `FORBIDDEN` không làm null lan lên cả danh sách.
- Test chạy bằng `server.executeOperation` (không mở cổng mạng). Kết quả GraphQL là object không có
  prototype nên helper phải chuẩn hóa qua `JSON.parse(JSON.stringify(...))` trước khi `deepEqual`.
- `node --test test/*.test.js` (chỉ định mẫu file) để `test/helpers.js` không bị chạy như một file test.
- Không dùng `pkill -f` theo tên lệnh trong script kiểm thử (tự giết shell); lưu PID rồi `kill`.

## Session Notes

- Node.js >= 20 (Apollo Server 5 yêu cầu Node 20 trở lên).
- Unit 02 cố ý để lộ email/phone/role cho mọi người; siết ở Unit 03 và 04.
- Kỳ vọng số test tích lũy sau mỗi unit (tham khảo từ lần làm thử): 01 → 2, 02 → 7, 03 → 17, 04 → 26.
