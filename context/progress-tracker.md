# Progress Tracker

Cập nhật file này sau mỗi thay đổi đáng kể.

## Current Phase

Complete

## Current Goal

Hoàn tất cả 4 unit

## Completed

- Khung dự án: context (6 file), spec 4 unit, cấu hình ESLint + Prettier, `AGENTS.md`.
- Unit 01: Apollo Server (query hello, helper test)
- Unit 02: API truy vấn người dùng (users, user(id)), chưa xác thực
- Unit 03: JWT (login, me, context, requireAuth)
- Unit 04: phân quyền cấp trường (admin xem tất cả; user thường chỉ xem công khai + chính mình)

## In Progress

- None yet.

## Next Up

- Các phần mở rộng không bắt buộc.

## Open Questions

1. **User thường có được xem thông tin riêng tư của chính mình không?**
   Hiện triển khai: có. Cần giáo viên xác nhận trước khi nộp.

## Architecture Decisions

- Thứ tự unit: 01 Apollo → 02 API người dùng → 03 JWT → 04 phân quyền (dependencies first; security trước
  các tính năng cần được bảo vệ).
- Token chỉ chứa `sub`; role đọc lại từ dữ liệu mỗi request để đổi quyền có hiệu lực ngay.
- Chỉ chấp nhận HS256 khi verify (chặn tấn công đổi thuật toán).
- Phân quyền ở resolver cấp trường để mọi đường truy vấn (`me`, `users`, `user`) đều bị kiểm tra như nhau.
- Trường riêng tư nullable để `FORBIDDEN` không làm null lan lên cả danh sách.
- Giữ `user`/`me` nullable vì Unit 02 yêu cầu `user(id)` không tìm thấy trả null không lỗi; mã lỗi
  `UNAUTHENTICATED` là hợp đồng với client, hình dạng `data` phụ thuộc kiểu trả về (null propagation).
- Test chạy bằng `server.executeOperation` (không mở cổng mạng). Kết quả GraphQL là object không có
  prototype nên helper phải chuẩn hóa qua `JSON.parse(JSON.stringify(...))` trước khi `deepEqual`.
- `node --test test/*.test.js` (chỉ định mẫu file) để `test/helpers.js` không bị chạy như một file test.
- Không dùng `pkill -f` theo tên lệnh trong script kiểm thử (tự giết shell); lưu PID rồi `kill`.

## Session Notes

- Node.js >= 20 (Apollo Server 5 yêu cầu Node 20 trở lên).
- Unit 02 cố ý để lộ email/phone/role cho mọi người; siết ở Unit 03 và 04.
- Unit 03: mọi user đã đăng nhập vẫn thấy email/phone/role của mọi người; siết ở Unit 04.
- Kỳ vọng số test tích lũy sau mỗi unit (tham khảo từ lần làm thử): 01 → 2, 02 → 7, 03 → 17, 04 → 26.
