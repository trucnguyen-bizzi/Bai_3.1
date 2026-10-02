# Unit 02: API truy vấn thông tin người dùng

## Goal

Thêm API đọc thông tin người dùng (`users`, `user(id)`) trên dữ liệu mẫu trong bộ nhớ. Ở unit này **chưa có
xác thực**: ai cũng truy vấn được, cố ý để làm nền cho Unit 03 và 04. Đáp ứng yêu cầu đề số 3.

## Design

Bổ sung vào schema (giữ nguyên `hello`):

```graphql
enum Role {
  ADMIN
  USER
}

type User {
  # --- Thông tin công khai ---
  id: ID!
  username: String!
  fullName: String!

  # --- Thông tin riêng tư ---
  email: String
  phone: String
  role: Role
}

type Query {
  hello: String!
  users: [User!]!
  user(id: ID!): User
}
```

- `password` **không** có trong schema.
- Trường riêng tư để **nullable** (lý do ở Unit 04).
- `user(id)` không tìm thấy → trả `null`, **không** báo lỗi.

## Implementation

### `src/users.js`
Default export mảng 3 người dùng, mỗi người có: `id`, `username`, `password`, `fullName`, `email`, `phone`,
`role`. `password` là chuỗi **băm** từ `bcrypt.hashSync(<mật khẩu>, 10)`.

| id | username | mật khẩu gốc | fullName | email | phone | role |
|---|---|---|---|---|---|---|
| "1" | admin | admin123 | Quản Trị Viên | admin@example.com | 0900000001 | ADMIN |
| "2" | an | 123456 | Nguyễn Văn An | an@example.com | 0900000002 | USER |
| "3" | binh | 123456 | Trần Thị Bình | binh@example.com | 0900000003 | USER |

### `src/typeDefs.js`, `src/resolvers.js`
Cập nhật theo Design. `users` trả cả mảng. `user` tìm theo `id` bằng `find`, không thấy thì `null`.
Đặt tên tham số đầy đủ (`parent`, `args`) và tên biến mô tả (`user`, không phải `u`).

### `test/unit02-users.test.js`
Dùng `run` từ `helpers.js`.

## Dependencies

- `bcryptjs` (băm mật khẩu dữ liệu mẫu)

Cài: `npm install bcryptjs`

## Verify when done

- [ ] Test: `users` trả 3 người, người thứ hai có `{ id: "2", username: "an", fullName: "Nguyễn Văn An" }`
- [ ] Test: `user(id: "3")` trả `binh`
- [ ] Test: `user(id: "99")` trả `null` và **không** có `errors`
- [ ] Test: chỉ xin `fullName` thì kết quả chỉ có đúng `fullName`
- [ ] Test: truy vấn `{ users { password } }` bị từ chối
- [ ] Test của Unit 01 vẫn pass
- [ ] Mật khẩu trong `users.js` là chuỗi băm, không phải chữ thô
- [ ] `npm run check` pass
