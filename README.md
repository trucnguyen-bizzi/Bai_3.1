# GraphQL + JWT + Phân quyền (Apollo Server 5)

Bài thực hành: server GraphQL cung cấp API truy vấn người dùng và xác thực bằng JWT. **Admin** xem toàn bộ
thông tin; **user thường** xem thông tin công khai của mọi người và thông tin riêng tư của chính mình.

## Có gì trong repo

```
AGENTS.md                  điểm vào cho Codex: thứ tự đọc + quy tắc ngắn gọn
context/
  project-overview.md      mục tiêu, phạm vi, tiêu chí hoàn thành
  architecture.md          stack, ranh giới, mô hình auth, invariants
  ui-context.md            không áp dụng (chỉ có API)
  code-standards.md        coding standard (23 mục) + ngoại lệ của dự án
  ai-workflow-rules.md     quy trình, phạm vi, 3 prompt cho mỗi unit
  progress-tracker.md      trạng thái, câu hỏi mở, quyết định kiến trúc
  specs/01..04-*.md        spec từng unit (Goal / Design / Implementation / Dependencies / Verify)
eslint.config.js           luật ngữ nghĩa từ coding standard
.prettierrc.json           định dạng: nháy kép, chấm phẩy, 100 cột, dấu phẩy cuối
package.json               script: dev, start, test, lint, format, check
```

## Các unit

| Unit | Yêu cầu đề | Nội dung | Trạng thái |
|---|---|---|---|
| 01 | Apollo Server | Server chạy, query `hello`, helper test | Hoàn thành |
| 02 | API truy vấn người dùng | `users`, `user(id)` (chưa xác thực) | Hoàn thành |
| 03 | JWT | `login`, `me`, context từ token, bắt buộc đăng nhập | Hoàn thành |
| 04 | Kiểm soát quyền | Phân quyền cấp trường admin / user thường | Hoàn thành |

## Cách chạy

```bash
npm install
cp .env.example .env
npm run dev
npm run check
```

## Thử nhanh

Tài khoản mẫu:

| Username | Password |
|---|---|
| `admin` | `admin123` |
| `an` | `123456` |
| `binh` | `123456` |

Đăng nhập để nhận token:

```graphql
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    token
    user {
      id
      username
      fullName
    }
  }
}
```

Ví dụ variables:

```json
{
  "username": "an",
  "password": "123456"
}
```

Gửi token trong header cho các truy vấn cần đăng nhập:

```http
Authorization: Bearer <token>
```

Truy vấn danh sách người dùng:

```graphql
{
  users {
    id
    username
    fullName
    email
    phone
    role
  }
}
```

| Trạng thái đăng nhập | Kết quả |
|---|---|
| Không có token | Query `users` bị từ chối với `UNAUTHENTICATED`. |
| User thường (`an`, `binh`) | Xem trường công khai của mọi người; xem `email`, `phone`, `role` của chính mình. Trường riêng tư của người khác là `null` kèm lỗi `FORBIDDEN`. |
| Admin | Xem tất cả trường của mọi người. |

User thường được xem thông tin riêng tư của chính mình theo triển khai hiện tại; cần giáo viên xác nhận
quy tắc này trước khi nộp.

## Đẩy lên GitHub

```bash
# tạo repo rỗng trên github.com (không tick "Add README"), rồi:
git remote add origin https://github.com/<ten-ban>/graphql-jwt-rbac.git
git push -u origin main
# mỗi unit: nhánh feat/NN-ten-unit → push → tạo Pull Request → merge vào main
```

## Biến môi trường

Sao chép `.env.example` thành `.env`. Nạp bằng `node --env-file=.env src/index.js`
hoặc `JWT_SECRET=... npm run dev`. `JWT_SECRET` bắt buộc khi `NODE_ENV=production`.
