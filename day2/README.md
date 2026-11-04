# Day 2: Agent Tools & Interoperability 🛠️

Buổi học thứ 2 của khóa học **5-Day AI Agents: Intensive Vibe Coding Course With Google** trên Kaggle!

---

## 📌 Chủ đề buổi học
**Agent Tools & Interoperability** (Công cụ cho Agent & Khả năng tương tác liên hệ thống).

---

## 🎯 Mục tiêu bài học (Objectives)
- Tìm hiểu cơ chế **Tool Calling / Function Calling**: Cách mô hình ngôn ngữ nhận diện thời điểm và cách sử dụng công cụ bên ngoài.
- Tích hợp các công cụ tra cứu thông tin (Search Tools), tính toán (Calculator), hoặc gọi API bên ngoài (REST APIs).
- Đảm bảo tính tương thích và tương tác liền mạch giữa Agent và các hệ thống dữ liệu khác.
- Ứng dụng **Antigravity CLI** để xây dựng, vận hành và kiểm thử các giải pháp phần mềm hoàn chỉnh theo phương pháp Pair Programming / Vibe Coding.

---

## 📂 Danh sách bài tập thực hành

### [Bài tập 1: Ứng dụng Danh ngôn Bất hủ (Famous Quotes Web App)](./bai-tap-1/famous-quotes)
Ứng dụng web hiển thị và tra cứu danh ngôn bất hủ song ngữ Anh - Việt được xây dựng hoàn chỉnh bằng **Antigravity CLI**:
- **Công nghệ**: Python Flask (backend trên port 5001), Vanilla HTML5/CSS3/JavaScript (frontend không phụ thuộc framework).
- **Tính năng nổi bật**:
  - 100 câu danh ngôn bất hủ song ngữ chọn lọc từ hơn 60 tác giả, phân loại theo 10 chủ đề.
  - Hiển thị danh ngôn ngẫu nhiên với hiệu ứng chuyển đổi mượt mà.
  - Tìm kiếm thời gian thực (live search) theo tác giả, từ khóa tiếng Anh và tiếng Việt.
  - Lọc nhanh theo danh mục (categories dropdown & clickable pills).
  - Quản lý danh sách Yêu thích (Favorites) lưu trữ bền vững bằng `localStorage`.
  - Xuất danh sách yêu thích ra tệp CSV (chuẩn RFC 4180 kèm UTF-8 BOM hiển thị chuẩn tiếng Việt trên Excel).
  - Chế độ Sáng / Tối (Dark / Light mode) sử dụng biến CSS Root (`[data-theme="dark"]`).
  - Phát âm giọng đọc song ngữ (Web Speech API) cho cả câu tiếng Anh (`en-US`) và tiếng Việt (`vi-VN`).
  - Bộ phím tắt tiện lợi (`Space`, `F`, `C`, `S`, `/`, `Esc`).
- **Kiểm thử tự động**: 12/12 test cases tự động (`pytest`) đạt 100% Passed.

---

### [Bài tập 2: Khám Phá Google Developer Knowledge MCP Server Trong Google Antigravity](./bai-tap-2/README.md)
Tìm hiểu và tích hợp giao thức **Model Context Protocol (MCP)** để kết nối Google Antigravity với hệ sinh thái tài liệu chính thức của Google:
- **Công nghệ & Giao thức**: Model Context Protocol (MCP), Google Antigravity CLI, Google Developer Knowledge API.
- **Nội dung thực hành**:
  - Kích hoạt Developer Knowledge API trên Google Cloud và tạo Restricted API Key an toàn.
  - Cấu hình MCP server trong `~/.gemini/config/mcp_config.json` và kiểm tra bằng lệnh `/mcp`.
  - Khám phá bộ 3 công cụ: `search_documents`, `answer_query`, `get_documents`.
  - Thực nghiệm 3 câu lệnh kiểm thử (Test Prompts) thực tế để truy vấn tài liệu về Google Workspace MCP và Google Drive API.
  - Sinh mã nguồn hoàn chỉnh [`upload_to_drive.py`](./bai-tap-2/upload_to_drive.py) hỗ trợ tải tệp tin lên Google Drive tự động bằng OAuth 2.0.
  - Minh chứng hình ảnh cấu hình: [`mcp-proof.png`](./bai-tap-2/mcp-proof.png) và [`mcp-list.png`](./bai-tap-2/mcp-list.png).
  - Thiết lập `.gitignore` loại trừ hoàn toàn các tệp nhạy cảm (`credentials.json`, `token.json`, `.env*`).
- **Chi tiết xem tại**: [Bài tập 2 - README.md](./bai-tap-2/README.md).

---

## 💻 Hướng dẫn chạy Bài tập 1 trên Windows

```powershell
# 1. Di chuyển vào thư mục bài tập
cd day2/bai-tap-1/famous-quotes

# 2. Tạo và kích hoạt môi trường ảo Python
python -m venv .venv

# Trên PowerShell (nếu gặp lỗi policy: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass)
.\.venv\Scripts\Activate.ps1

# Hoặc trên Command Prompt (CMD)
# .\.venv\Scripts\activate.bat

# 3. Cài đặt các thư viện phụ thuộc
pip install -r requirements.txt

# 4. Chạy kiểm thử tự động
pytest -v

# 5. Khởi chạy ứng dụng Flask trên cổng 5001
python app.py
```

Sau khi server khởi động, truy cập trình duyệt tại: **http://localhost:5001** hoặc **http://127.0.0.1:5001**.

---
[⬅️ Quay lại trang chủ](../README.md)
