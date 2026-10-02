# Unit 03: Xác thực bằng JWT

## Goal

Người dùng đăng nhập để nhận JWT; server đọc token ở mỗi request, đưa người dùng vào `context`, và các
truy vấn người dùng yêu cầu phải đăng nhập. Đáp ứng yêu cầu đề số 2.

## Design

Bổ sung schema:

```graphql
type AuthPayload {
  token: String!
  user: User!
}

type Query {
  hello: String!
  me: User
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  login(username: String!, password: String!): AuthPayload!
}
```

**Hợp đồng token**
- Thuật toán HS256; payload chỉ gồm `sub` (id người dùng), `iat`, `exp`.
- Hết hạn mặc định **1 giờ**.
- Client gửi `Authorization: Bearer <token>`.

**Hành vi**

| Tình huống | Kết quả |
|---|---|
| `hello` không token | Hoạt động bình thường (công khai) |
| `users` / `user` / `me` không token, token sai, hết hạn, ký bằng khóa khác | Lỗi `UNAUTHENTICATED`. `data` là `null` với `users` (kiểu `[User!]!` non-null nên null lan lên); `data` là `{ me: null }` với `me` và `{ user: null }` với `user` (kiểu nullable). |
| `login` đúng | `{ token, user }` |
| `login` sai mật khẩu **hoặc** sai username | Lỗi `UNAUTHENTICATED`, **cùng một thông báo** |
| `me` khi đã đăng nhập | Trả về chính người đăng nhập |

## Implementation

### `src/auth.js` (named export)
- Nạp `JWT_SECRET` từ `process.env` khi load module. Thiếu và `NODE_ENV === "production"` → **ném lỗi**.
  Thiếu ở môi trường khác → dùng khóa dev mặc định.
- `signToken(user, expiresIn = "1h")`: ký `{ sub: user.id }` bằng HS256. (Tham số `expiresIn` cho phép test
  tạo token hết hạn bằng `"-10s"`.)
- `getUserFromRequest(req)`: đọc `req.headers.authorization`; không bắt đầu bằng `Bearer ` → `null`;
  `jwt.verify(token, secret, { algorithms: ["HS256"] })`; thành công thì tìm người dùng theo `sub` trong
  `users`; **bất kỳ lỗi nào** → `null`.
- `requireAuth(context)`: không có `context.user` → ném `GraphQLError` với
  `extensions: { code: "UNAUTHENTICATED", http: { status: 401 } }`; ngược lại trả `context.user`.

### `src/resolvers.js`
- `Query.me`: `requireAuth(context)`.
- `Query.users`, `Query.user`: gọi `requireAuth(context)` rồi xử lý như Unit 02.
- `Mutation.login`: tìm theo `username`, so sánh bằng `bcrypt.compareSync`; sai thì ném `GraphQLError`
  `UNAUTHENTICATED` với **một** thông báo chung ("Sai tên đăng nhập hoặc mật khẩu"); đúng thì trả
  `{ token: signToken(user), user }`.

### `src/index.js`
Thêm `context: async ({ req }) => ({ user: getUserFromRequest(req) })` vào `startStandaloneServer`.

### `test/helpers.js`
Thêm named export `as(username)` trả `{ user: <người dùng tương ứng> }` (hoặc `{ user: null }` nếu không có),
để giả lập đăng nhập khi test.

### `test/unit02-users.test.js`
Cập nhật: vì `users`/`user` giờ cần đăng nhập, các test này truyền `contextValue: as("admin")`.

### `test/unit03-jwt.test.js`
Test các tình huống trong bảng Hành vi và danh sách Verify bên dưới. Test token gọi trực tiếp
`signToken` / `getUserFromRequest` với request giả `{ headers: { authorization: "Bearer ..." } }`.

## Dependencies

- `jsonwebtoken`

Cài: `npm install jsonwebtoken`

## Verify when done

- [ ] `login` đúng trả token có 3 phần (chia bởi `.`) và đúng `user`
- [ ] `login` sai mật khẩu và `login` sai username cho **cùng** thông báo, đều `UNAUTHENTICATED`
- [ ] Token hợp lệ → `getUserFromRequest` ra đúng người dùng
- [ ] Token hết hạn (`signToken(user, "-10s")`) → `null`
- [ ] Token ký bằng khóa khác → `null`
- [ ] Thiếu header hoặc sai định dạng (`Token abc`) → `null`
- [ ] Payload token chỉ có các khóa `exp`, `iat`, `sub` (không có role/email)
- [ ] `users` không đăng nhập: `errors[0].extensions.code` là `UNAUTHENTICATED` và `data` là `null`
- [ ] `me` không đăng nhập: `errors[0].extensions.code` là `UNAUTHENTICATED` và `data.me` là `null`
- [ ] `user(id)` không đăng nhập: `errors[0].extensions.code` là `UNAUTHENTICATED` và `data.user` là `null`
- [ ] `me` trả đúng người đang đăng nhập
- [ ] `hello` vẫn truy cập được khi không đăng nhập
- [ ] Thử qua HTTP thật: không token bị chặn; có token qua được (không để lộ stacktrace trong response)
- [ ] Test của Unit 01, 02 vẫn pass
- [ ] `npm run check` pass
