# GraphQL + JWT + Phân quyền (Apollo Server 5)

Bài thực hành: server GraphQL cung cấp API truy vấn người dùng, xác thực bằng JWT; **admin** xem toàn bộ
thông tin, **user thường** chỉ xem thông tin công khai.

Repo này là **nền tảng để AI (Codex) triển khai theo spec** — hiện **chưa có code**. Cách làm là
Spec-driven Development: bạn là kiến trúc sư, Codex là người thực thi.

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

| Unit | Yêu cầu đề | Nội dung |
|---|---|---|
| 01 | Apollo Server | Server chạy, query `hello`, helper test |
| 02 | API truy vấn người dùng | `users`, `user(id)` (chưa xác thực) |
| 03 | JWT | `login`, `me`, context từ token, bắt buộc đăng nhập |
| 04 | Kiểm soát quyền | Phân quyền cấp trường admin / user thường |

## Cách chạy với Codex

```bash
npm install              # chỉ cài công cụ lint/format; package chạy server sẽ do từng unit cài
```

Mở Codex tại thư mục này, rồi với **mỗi unit** (bắt đầu từ 01) dùng 3 prompt trong
`context/ai-workflow-rules.md`:

1. **Thực thi** — "Đọc AGENTS.md... Đọc context/specs/01-apollo-server.md... Làm đúng theo spec."
2. **Sửa lệch** (nếu cần) — nêu *Spec yêu cầu / Hiện tại*, chỉ sửa điểm đó.
3. **Đóng unit** — cập nhật tracker, commit, push nhánh `feat/01-apollo-server`.

Sau mỗi unit, **tự xem diff** và chạy `npm run check` trước khi sang unit tiếp theo. Nếu Codex đi chệch,
sửa spec/tracker rồi cho làm lại, đừng vá code tay.

## Hai điều cần xác nhận trước khi nộp

Ghi trong `context/progress-tracker.md` → *Open Questions*:

1. User thường có được xem thông tin riêng tư của **chính mình** không (mặc định: có).
2. Ngoại lệ D1: import nội bộ phải viết đuôi `.js` vì Node ESM bắt buộc.

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
