# Unit 04: Kiểm soát quyền truy cập

## Goal

Admin truy vấn được **toàn bộ** thông tin người dùng; user thường chỉ truy vấn được thông tin **công khai**
của người khác. Đáp ứng yêu cầu đề số 4.

## Design

Phân loại trường (không đổi schema, chỉ thêm quy tắc):

| Nhóm | Trường |
|---|---|
| Công khai | `id`, `username`, `fullName` |
| Riêng tư | `email`, `phone`, `role` |

Ma trận quyền (xem **Open Question 1** trong `progress-tracker.md`):

| Người gọi | Trường công khai | Trường riêng tư của người khác | Trường riêng tư của chính mình |
|---|---|---|---|
| Chưa đăng nhập | `UNAUTHENTICATED` | — | — |
| USER | được | `null` + lỗi `FORBIDDEN` | được |
| ADMIN | được | được | được |

**Hành vi lỗi từng phần (partial result):** trường bị chặn trả `null` kèm một mục trong `errors` có
`extensions.code = "FORBIDDEN"` và `path` chỉ rõ trường; các trường còn lại **vẫn trả bình thường**. Đây là
lý do trường riêng tư nullable: nếu non-null, lỗi sẽ lan lên làm null cả `User` (và cả danh sách `users`).

**Hành vi đã biết:** khi `login`, `context.user` còn `null` nên xin `email`/`phone`/`role` trong
`login { user { ... } }` sẽ bị `FORBIDDEN`. Đúng thiết kế: dùng `login` để lấy token, rồi dùng `me`.

## Implementation

### `src/permissions.js` (named export)
- `canViewPrivate(context, target)`: `false` nếu không có `context.user`; ngược lại `true` khi
  `context.user.role === "ADMIN"` **hoặc** `context.user.id === target.id`. Điều kiện dài viết mỗi điều kiện
  một dòng, toán tử `||` đứng đầu dòng.
- `privateField(fieldName)`: trả về resolver `(parent, args, context) => ...`; nếu `!canViewPrivate(context, parent)`
  thì ném `GraphQLError` `FORBIDDEN` (`http.status` 403) với thông báo nêu tên trường; ngược lại trả
  `parent[fieldName]`.

### `src/resolvers.js`
Thêm khối `User: { email: privateField("email"), phone: privateField("phone"), role: privateField("role") }`.
**Không** lặp lại logic riêng tư trong từng `Query`: gắn ở cấp trường thì đi từ `me`, `users` hay `user(id)`
đều bị kiểm tra như nhau.

### `test/unit04-rbac.test.js`
Dùng `run` và `as`. Các test nêu trong Verify.

## Dependencies

Không có.

## Verify when done

- [ ] ADMIN truy vấn `{ users { id username fullName email phone role } }`: đủ 3 người, đủ trường, **không** `errors`
- [ ] USER (`an`) truy vấn trường công khai của cả 3 người: đủ dữ liệu
- [ ] USER (`an`) truy vấn đủ trường: `email`/`phone`/`role` của `admin` và `binh` là `null`;
      có đúng **6** lỗi, tất cả `FORBIDDEN` (2 người × 3 trường)
- [ ] USER (`an`) vẫn xem được `email` và `role` của chính mình
- [ ] Quy tắc cũng áp dụng qua `user(id: "1")` khi `binh` gọi (email là `null`, lỗi `FORBIDDEN`)
- [ ] ADMIN qua `user(id: "3")` thấy đủ `username`, `email`, `phone`, `role` của `binh`
- [ ] `me` của `binh` trả đủ trường riêng tư của chính `binh`
- [ ] Không đăng nhập vẫn là `UNAUTHENTICATED` (không phải `FORBIDDEN`)
- [ ] ADMIN cũng **không** truy vấn được `password`
- [ ] Thử qua HTTP thật bằng token của `admin` và của `an`, kết quả khớp bảng trên
- [ ] Test của Unit 01–03 vẫn pass
- [ ] `npm run check` pass
