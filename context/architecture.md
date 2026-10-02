# Architecture Context

## Stack

| Lớp | Công nghệ | Vai trò | Cài ở unit |
|---|---|---|---|
| Runtime | Node.js >= 20 (ESM, `"type": "module"`) | Chạy server | — |
| API | `@apollo/server` 5 + `graphql` 16 | Schema, resolver, HTTP | 01 |
| Mật khẩu | `bcryptjs` | Băm mật khẩu dữ liệu mẫu, so sánh khi đăng nhập | 02 |
| Xác thực | `jsonwebtoken` | Ký và kiểm tra JWT | 03 |
| Test | `node:test` + `node:assert/strict` | Kiểm thử qua `server.executeOperation` (không mở cổng) | 01 |
| Chất lượng | ESLint 10 + Prettier 3 | Thực thi `code-standards.md` | đã cài sẵn |

Nguyên tắc: chỉ cài package ở unit lần đầu cần tới nó.

## System Boundaries

- `src/index.js` — điểm vào: đọc `PORT`, mở server, tạo `context` từ JWT. Không có export.
- `src/createServer.js` — default export `createServer()`; tạo `ApolloServer` (tách khỏi việc mở cổng để test).
- `src/typeDefs.js` — default export chuỗi schema SDL.
- `src/resolvers.js` — default export object `{ Query, Mutation, User }`. Chỉ điều phối, logic phân quyền
  nằm ở `permissions.js`.
- `src/users.js` — default export mảng người dùng mẫu (bộ nhớ). Thay bằng database ở phần mở rộng.
- `src/auth.js` — named export: `signToken`, `getUserFromRequest`, `requireAuth`.
- `src/permissions.js` — named export: `canViewPrivate`, `privateField`.
- `test/` — test từng unit và `helpers.js` (`run`, `as`).

## Storage Model

- **Bộ nhớ (mảng `users`)**: toàn bộ người dùng. Mất khi tắt server — chấp nhận được ở phạm vi bài tập.
- Không có database, không có file lưu trữ.

## Auth and Access Model

- Đăng nhập bằng mutation `login(username, password)` → trả `{ token, user }`.
- JWT: thuật toán **HS256**, payload chỉ có `sub` (id người dùng) + `iat` + `exp`; hết hạn sau **1 giờ**.
  Không ghi role/email vào token.
- Mỗi request: `index.js` đọc `Authorization: Bearer <token>` → `getUserFromRequest` → `context.user`
  (hoặc `null` nếu thiếu/sai/hết hạn). **Role luôn đọc lại từ dữ liệu**, nên đổi quyền có hiệu lực ngay.
- Truy vấn `users`, `user`, `me` yêu cầu đăng nhập (`requireAuth`).
- Trường **công khai**: `id`, `username`, `fullName`. Trường **riêng tư**: `email`, `phone`, `role`.
- Phân quyền ở **cấp trường**: resolver của `User.email/phone/role` gọi `canViewPrivate(context, parent)`.
  Quy tắc: xem được nếu là `ADMIN` hoặc đang xem chính mình.
- Trường riêng tư là **nullable** trong schema (để lỗi `FORBIDDEN` chỉ làm trường đó thành `null`, không làm
  hỏng cả danh sách).

## Mã lỗi

| Mã | Khi nào |
|---|---|
| `UNAUTHENTICATED` | Chưa đăng nhập / token không hợp lệ / sai tài khoản hoặc mật khẩu |
| `FORBIDDEN` | Đã đăng nhập nhưng không có quyền xem trường đó |
| `BAD_USER_INPUT` | Đầu vào không hợp lệ (dành cho phần mở rộng) |

## Invariants

1. `password` **không bao giờ** xuất hiện trong schema (không ai truy vấn được, kể cả admin).
2. Mọi quyết định truy cập dựa trên `context.user`, không tin dữ liệu client gửi.
3. Chỉ chấp nhận JWT HS256 (`algorithms: ["HS256"]` khi verify).
4. `JWT_SECRET` đọc từ biến môi trường; `NODE_ENV=production` mà thiếu thì phải **ném lỗi khi khởi động**.
   Chỉ ở môi trường dev mới được dùng khóa mặc định.
5. Response lỗi **không** chứa stacktrace (`includeStacktraceInErrorResponses: false`).
6. Quy tắc riêng tư nằm ở resolver cấp trường, **không** lặp lại trong từng Query.
7. Mật khẩu lưu dạng băm bcrypt, không bao giờ lưu hay log dạng thô.
