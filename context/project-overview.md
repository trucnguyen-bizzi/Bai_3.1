# GraphQL + JWT + Phân quyền

## Overview

Server GraphQL xây bằng Apollo Server, cung cấp API truy vấn thông tin người dùng. Xác thực bằng JWT.
Phân quyền: **admin** truy vấn toàn bộ thông tin người dùng, **user thường** chỉ truy vấn thông tin công khai.
Đây là bài thực hành học GraphQL; mỗi unit là một nhánh/commit chạy được và có test.

## Goals

1. Dựng được server GraphQL bằng Apollo Server và hiểu vai trò của schema, resolver, context.
2. Xác thực người dùng bằng JWT (đăng nhập, gửi token, giải mã vào context).
3. Cung cấp API truy vấn người dùng (`users`, `user`, `me`).
4. Kiểm soát quyền truy cập ở cấp trường theo vai trò (admin / user).

## Yêu cầu đề bài → Unit

| STT | Nội dung yêu cầu | Unit |
|---|---|---|
| 1 | Apollo Server | 01 |
| 3 | Xây dựng server GraphQL cung cấp API truy vấn thông tin người dùng | 02 |
| 2 | Sử dụng JWT để xác thực và ủy quyền | 03 |
| 4 | Kiểm soát quyền: chỉ admin truy vấn toàn bộ; user thường chỉ truy vấn thông tin công khai | 04 |

Thứ tự unit khác thứ tự bảng đề vì phải có API người dùng (unit 02) trước khi gắn JWT lên nó (unit 03)
("dependencies first, security before functionality").

## Core User Flow

1. Client gọi `login(username, password)` → nhận token.
2. Client gửi `Authorization: Bearer <token>` ở mọi request sau.
3. Client gọi `users` / `user(id)` / `me`.
4. Server trả dữ liệu theo vai trò: admin thấy tất cả; user thường thấy trường công khai của mọi người
   (và thông tin riêng tư của chính mình).

## Features

### Truy vấn người dùng
- `users`, `user(id)`, `me`
### Xác thực
- `login` cấp JWT; token sai/hết hạn bị coi như chưa đăng nhập
### Phân quyền
- Trường công khai: `id`, `username`, `fullName`
- Trường riêng tư: `email`, `phone`, `role`

## Scope

### In Scope
- 4 unit nêu trên, dữ liệu mẫu trong bộ nhớ, test tự động, lint/format theo coding standard.

### Out of Scope
- Database thật, đăng ký tài khoản, refresh token, đổi/quên mật khẩu, subscription, giao diện web, deploy.

## Success Criteria

1. `npm run check` (lint + format + test) xanh.
2. Không có token → `UNAUTHENTICATED`.
3. User thường: trường riêng tư của **người khác** → `null` kèm lỗi `FORBIDDEN`.
4. Admin: thấy đủ mọi trường của mọi người.
5. Không có cách nào truy vấn `password`.

## Dữ liệu mẫu (fixture)

| username | password | role |
|---|---|---|
| admin | admin123 | ADMIN |
| an | 123456 | USER |
| binh | 123456 | USER |
