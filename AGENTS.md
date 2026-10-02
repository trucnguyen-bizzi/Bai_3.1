## Application Building Context

Đọc theo thứ tự trước khi triển khai hoặc đưa ra bất kỳ quyết định kiến trúc nào:

1. `context/project-overview.md` — định nghĩa sản phẩm, mục tiêu, phạm vi
2. `context/architecture.md` — cấu trúc hệ thống, ranh giới, mô hình xác thực, invariants
3. `context/ui-context.md` — giao diện (dự án này: không áp dụng)
4. `context/code-standards.md` — quy ước code (bắt buộc), kèm các ngoại lệ D1, D2
5. `context/ai-workflow-rules.md` — quy trình làm việc, phạm vi, cách bàn giao
6. `context/progress-tracker.md` — giai đoạn hiện tại, việc đã xong, câu hỏi mở, bước tiếp theo

Sau đó đọc spec của unit đang làm trong `context/specs/` (`01` → `04`, làm tuần tự, mỗi lần một unit).

## Quy tắc ngắn gọn

- Làm đúng spec, không vượt phạm vi. Thiếu/mơ hồ → ghi vào *Open Questions* của `progress-tracker.md` rồi hỏi lại.
- Mã phải theo `context/code-standards.md`. Trước khi báo xong chạy `npm run check` (lint + format + test).
- Không nới `eslint.config.js` / `.prettierrc.json` để qua kiểm tra; sửa code.
- Chỉ cài package nêu trong mục *Dependencies* của spec hiện tại.
- Cập nhật `context/progress-tracker.md` sau mỗi unit. Nếu việc triển khai làm đổi kiến trúc, phạm vi hoặc
  quy ước, cập nhật file context liên quan **trước khi** làm tiếp.
- Nhánh `feat/NN-ten-unit`, commit `feat(unit-NN): <mô tả ngắn>`. Không commit `.env`.
