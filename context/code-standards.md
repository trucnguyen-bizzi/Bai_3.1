# Code Standards

Nguồn: `coding_standard_bizzi` (23 mục, số trong ngoặc là số mục gốc).
Phần định dạng do **Prettier** tự xử lý (`npm run format`), phần ngữ nghĩa do **ESLint** kiểm tra
(`npm run lint`). Các luật ESLint không bắt được (đánh dấu **[xem tay]**) phải tự tuân thủ khi code
và khi review diff.

## 1. Biến và tham chiếu (1, 2, 13)

- Dùng `const` cho mọi tham chiếu; chỉ dùng `let` khi bắt buộc gán lại; cấm `var` (2.1, 2.2).
- Mỗi biến một câu lệnh `const`/`let`; gom nhóm `const` rồi tới `let` (13.2, 13.3).
- Không gán chuỗi (`a = b = c`); không dùng `++` / `--` (dùng `+= 1`) (13.5, 13.6).
- Không để biến không dùng (13.8). Không tạo biến toàn cục ngầm (13.1).

## 2. Object, Array, Destructuring (3, 4, 5)

- Dùng literal `{}` / `[]`; không `new Object()` / `new Array()` (3.1, 4.1).
- Dùng shorthand cho method và giá trị; đặt các thuộc tính shorthand lên đầu object (3.3–3.5).
- Chỉ đặt nháy cho key không hợp lệ làm identifier (3.6).
- Không gọi trực tiếp `object.hasOwnProperty(...)` (3.7).
- Copy bằng spread: `{ ...original, extra }`, `[...items]`; không dùng `Object.assign` để copy (3.8, 4.3).
- Thêm phần tử mảng bằng `push` (4.2). Callback của `map/filter/find...` phải có `return` (4.7).
- Mảng nhiều dòng: xuống dòng sau `[` và trước `]` (4.8).
- Dùng destructuring khi truy cập nhiều thuộc tính; nhiều giá trị trả về thì destructure **object**, không
  destructure mảng (5.1–5.3).

## 3. Chuỗi (6)

- Dùng **nháy kép** `"..."` (6.1). Ghép chuỗi động bằng **template string** (6.3).
- Không nối chuỗi để chia dòng dài (6.2). Không `eval()` (6.4). Không escape thừa (6.5).
- Chuỗi chứa nháy kép thì dùng template literal (ví dụ query GraphQL trong test).

## 4. Hàm và arrow function (7, 8)

- Không khai báo hàm trong khối `if/while` (7.2). Không đặt tên tham số là `arguments`; dùng rest
  `...args` (7.4, 7.5).
- Tham số mặc định đặt **cuối**, không có side effect (7.6–7.8). Không dùng `new Function` (7.9).
- **Không sửa và không gán lại tham số** (7.11, 7.12). Cần giá trị khác thì tạo biến mới.
- Chữ ký/lời gọi nhiều dòng: mỗi mục một dòng, có dấu phẩy cuối (7.14).
- Callback ẩn danh dùng arrow function (8.1). Thân chỉ là một biểu thức không side effect thì bỏ `{}` và
  `return` (8.2); biểu thức nhiều dòng thì bọc trong `()` (8.3).
- Luôn có `()` quanh tham số arrow, kể cả một tham số: `(user) => ...` (8.4).

## 5. Class và Module (9, 10, 11)

- Luôn dùng `class` + `extends`, không thao tác prototype (9.1, 9.2). Không constructor rỗng (9.5).
  Method không dùng `this` thì chuyển thành `static` (9.7).
- Luôn dùng `import/export` (10.1). **[xem tay]** Không `import * as ...` (10.2), không export trực tiếp từ
  import (10.3), một đường dẫn chỉ import một lần (10.4).
- Không export biến có thể gán lại (10.5). Mọi `import` đặt trên mọi câu lệnh khác (10.7).
- **[xem tay]** Module chỉ có **một** export → dùng `export default` (10.6). Module có nhiều export → dùng
  named export.
- Không dùng `for...in` / `for...of`; dùng `map/filter/forEach/every/some/find` (11.1). Không dùng generator
  (11.2).

## 6. Điều kiện và khối lệnh (15, 16, 17)

- Luôn `===` / `!==` (15.1). Boolean dùng dạng rút gọn; chuỗi và số thì so sánh tường minh (15.3).
- `case`/`default` có khai báo `let/const` thì bọc `{}` (15.5). Không lồng ternary, không ternary thừa
  (15.6, 15.7). Trộn toán tử thì bọc `()` (15.8).
- Khối nhiều dòng luôn có `{}`; `else` nằm cùng dòng với `}` đóng của `if` (16.1, 16.2).
- `if` đã `return` thì không cần `else` (16.3). Điều kiện dài: mỗi điều kiện một dòng, toán tử logic đứng
  **đầu dòng** (17.1).

## 7. Chú thích (18)

- Nhiều dòng dùng `/** ... */`; một dòng dùng `//` đặt trên dòng riêng phía trên đối tượng được chú thích,
  có dòng trống phía trước (trừ khi đầu khối) (18.1, 18.2). Luôn có khoảng trắng sau `//` (18.3).
- `// FIXME:` đánh dấu vấn đề; `// TODO:` đánh dấu giải pháp cần làm (18.5, 18.6).
- Chú thích giải thích **vì sao**, không nhắc lại **cái gì**.

## 8. Định dạng (19, 20, 21) — do Prettier thực thi

2 dấu cách; tối đa **100 ký tự/dòng**; dấu chấm phẩy bắt buộc; dấu phẩy cuối bắt buộc khi nhiều dòng;
không dấu phẩy đầu dòng; `{ a }` có khoảng trắng trong ngoặc nhọn, `[a]`/`(a)` không có; mỗi file kết thúc
bằng đúng một dòng trống; chuỗi method dài thì thụt dòng và đặt dấu `.` đầu dòng.

## 9. Ép kiểu (22) và Đặt tên (23)

- Ép kiểu ở đầu câu lệnh (22.1). Dùng `String(x)`, `Number(x)`; `parseInt` **luôn có radix** (22.2, 22.3).
- **Không đặt tên một chữ cái** (`u`, `p`, `e`...): viết `user`, `password`, `error` (23.1).
- `camelCase` cho biến, hàm, instance (23.2). `PascalCase` chỉ cho class/constructor (23.3).
- **Không dùng `_` ở đầu/cuối tên** (23.4). Tham số resolver không dùng vẫn đặt tên đầy đủ:
  `parent`, `args`, `context` (ESLint `no-unused-vars` chỉ báo các tham số *sau* tham số cuối được dùng).
- Không lưu `this` vào biến (`self`, `that`) — dùng arrow function (23.5).
- **Tên file = tên default export** (23.6): hàm default → `camelCase.js` (23.7); class/object → `PascalCase.js`
  (23.8).
- Từ viết tắt viết hoa toàn bộ hoặc thường toàn bộ: `JWT`, `jwt`, `userID`... không `Jwt` lẫn lộn (23.9).
- `UPPER_SNAKE_CASE` chỉ cho hằng số **được export**, là `const`, và nội dung chắc chắn không đổi (23.10).

## Quyết định riêng của dự án (ngoại lệ có chủ đích)

| # | Quy ước gốc | Quyết định | Lý do |
|---|---|---|---|
| D1 | 10.10: không viết đuôi `.js` khi import | **Bắt buộc viết `.js`** cho import file nội bộ (`./users.js`) | Node.js ESM thuần (`"type": "module"`) không phân giải đường dẫn thiếu đuôi. Đây là ràng buộc kỹ thuật, không phải sở thích. Import package (`"graphql"`) không cần đuôi. |
| D2 | 23.6/23.7: tên file = tên default export | `auth.js`, `permissions.js`, `test/helpers.js` có **nhiều named export** nên tên file theo chủ đề | 10.6 chỉ áp dụng default export khi module có một export. |
| D3 | 17.1: toán tử logic đứng đầu dòng | Khi Prettier tự chia dòng thì chấp nhận `\|\|` ở cuối dòng. Ưu tiên viết điều kiện ngắn trên một dòng. Không dùng `prettier-ignore`. | Prettier không cấu hình được vị trí toán tử logic; lách bằng `prettier-ignore` làm tiền lệ xấu. |

Muốn đổi D1 (ví dụ chuyển sang TypeScript + trình chạy `tsx`) phải sửa file này, `architecture.md` và ghi
vào `progress-tracker.md` **trước** khi code.

## Quy tắc đặc thù GraphQL / bảo mật

- Schema viết trong template literal có chú thích `#graphql` ở dòng đầu.
- Lỗi nghiệp vụ ném bằng `GraphQLError` và **luôn có `extensions.code`** (`UNAUTHENTICATED`, `FORBIDDEN`,
  `BAD_USER_INPUT`). Không ném `Error` thường ra ngoài resolver.
- Không `console.log` token, mật khẩu, hoặc `JWT_SECRET`.
- Kiểm tra quyền dựa **hoàn toàn** vào `context.user`; không bao giờ tin `role`/`id` do client gửi lên.
- Thông báo lỗi đăng nhập dùng chung một câu, không phân biệt sai username hay sai mật khẩu.

## Tổ chức file

- `src/` — mã nguồn (xem sơ đồ trong `architecture.md`).
- `test/` — `*.test.js` theo từng unit + `helpers.js`. Test dùng `node:test` và `node:assert/strict`.
- `context/` — tài liệu ngữ cảnh và spec. Không chứa code chạy.
