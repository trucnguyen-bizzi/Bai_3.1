# AI Workflow Rules

## Approach

Dự án làm theo **Spec-driven Development**. Con người là **kiến trúc sư**: quyết định hệ thống làm gì, ranh giới
ở đâu, luật là gì. AI là **người thực thi**: viết code đúng theo spec, không tự suy diễn.

Các file trong `context/` định nghĩa *làm gì*, *làm thế nào* và *đang ở đâu*. Luôn code dựa trên chúng;
**không tự bịa hành vi**. Nếu AI đi chệch, sửa **spec hoặc progress tracker** rồi cho AI làm lại — không vá
code bằng tay làm lệch khỏi tài liệu.

## Thứ tự đọc trước khi làm

1. `context/project-overview.md` 2. `context/architecture.md` 3. `context/ui-context.md`
4. `context/code-standards.md` 5. `context/ai-workflow-rules.md` 6. `context/progress-tracker.md`
7. Spec của unit hiện tại trong `context/specs/`

## Scoping Rules

- Mỗi lần chỉ làm **một unit**, đúng phạm vi spec: không hơn, không kém.
- Ưu tiên bước nhỏ, kiểm chứng được. Không gộp việc của nhiều unit.
- Cài package **đúng lúc** (ở unit đầu tiên cần). Không cài trước, không cài thêm ngoài mục *Dependencies*.
- Không thêm tính năng "tiện tay" (đăng ký, refresh token, database...) khi spec chưa yêu cầu.

## When to Split Work

Tách nhỏ bước làm nếu nó trộn:

- Thay đổi schema **và** thay đổi cơ chế xác thực trong cùng một lượt.
- Nhiều resolver không liên quan.
- Hành vi chưa được mô tả trong `context/`.

Nếu một thay đổi không kiểm chứng được nhanh bằng `npm test`, phạm vi đang quá rộng — tách ra.

## Handling Missing Requirements

- Không tự bịa hành vi chưa có trong context.
- Yêu cầu mơ hồ → làm rõ trong file context liên quan **trước** khi code.
- Yêu cầu còn thiếu → ghi vào **Open Questions** của `progress-tracker.md` rồi dừng ở điểm đó, hỏi lại.

## Protected Files

Không sửa nếu không được yêu cầu rõ ràng:

- `context/` (trừ `progress-tracker.md` và khi cập nhật theo mục *Keeping Docs in Sync*)
- `eslint.config.js`, `.prettierrc.json` — không nới luật để "qua lint"; hãy sửa code.
- `package-lock.json` chỉ thay đổi do `npm install`, không sửa tay.
- Thư mục `node_modules/`, file `.env` (chứa bí mật, không commit).

## Keeping Docs in Sync

Cập nhật file context tương ứng khi implementation làm thay đổi: kiến trúc/ranh giới, mô hình lưu trữ,
quy ước code, phạm vi tính năng. Cập nhật `progress-tracker.md` sau **mỗi** unit.

## Quy trình mỗi unit (cho Codex)

**Prompt 1 — Thực thi**
```
Đọc AGENTS.md và các file context theo thứ tự.
Đọc context/specs/NN-ten-unit.md.
Cập nhật context/progress-tracker.md: đánh dấu unit này "In progress".
Tạo nhánh feat/NN-ten-unit.
Làm đúng theo spec, không vượt phạm vi unit này.
```

**Prompt 2 — Sửa lệch (nếu cần)**
```
[Phần cụ thể] không khớp spec.
Spec yêu cầu: [...]. Hiện tại: [...].
Chỉ sửa điểm này, không đổi gì khác.
```

**Prompt 3 — Đóng unit**
```
Mọi mục trong "Verify when done" đã đạt và npm run check xanh.
Đánh dấu unit NN hoàn thành trong context/progress-tracker.md.
Commit với message "feat(unit-NN): <mô tả ngắn>" rồi push nhánh feat/NN-ten-unit.
```

## Before Moving to the Next Unit

1. Unit chạy được end-to-end trong phạm vi spec; mọi ô trong **Verify when done** đã tích.
2. Không vi phạm Invariants trong `architecture.md`.
3. `progress-tracker.md` phản ánh đúng công việc đã xong.
4. `npm run check` pass (lint + format + test).
5. Người review (kiến trúc sư) đã xem **diff**, không chỉ xem kết quả chạy.
