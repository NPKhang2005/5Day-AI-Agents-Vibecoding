# Bài tập 2: Xây dựng ứng dụng Web trong AI Studio & Triển khai lên Google Cloud Run

Tài liệu hướng dẫn và mã nguồn thực hành cho **Bài tập 2 - Buổi 1 (Day 1)** thuộc khóa học **5-Day AI Agents: Intensive Vibe Coding Course With Google** trên Kaggle.

---

## 📌 Thông tin dự án
- **Tên ứng dụng:** AGU AI Study Assistant (Trợ lý học tập CNTT & Vibe Coding)
- **Học viên thực hiện:** Nguyễn Phúc Khang
- **Trường:** Đại học An Giang - ĐHQG TP.HCM (AGU)
- **Công nghệ sử dụng:**
  - **AI Model:** Google Gemini 2.5 Flash / Pro (Google AI Studio)
  - **Backend & UI:** Python, Streamlit, Google GenAI SDK (`google-genai`)
  - **Containerization:** Docker (`Dockerfile`)
  - **Cloud Hosting:** Google Cloud Run (Serverless Container Platform)

---

## 🎯 Mục tiêu bài học
1. Biết cách tạo và quản lý **Gemini API Key** trên **Google AI Studio** (`aistudio.google.com`).
2. Thiết kế System Instruction và cấu hình mô hình AI giải quyết bài toán thực tế.
3. Đóng gói ứng dụng web AI thành Docker Container chuẩn cổng `8080`.
4. Triển khai ứng dụng lên **Google Cloud Run** ở chế độ công khai (Public URL).

---

## 📂 Cấu trúc thư mục Bài tập 2

```text
bai-tap-2/
├── app.py             # Mã nguồn chính của ứng dụng Web Streamlit
├── requirements.txt   # Danh sách thư viện Python cần thiết
├── Dockerfile         # Cấu hình container cho Google Cloud Run
├── .dockerignore      # Loại bỏ các tệp không cần thiết khi build Docker
└── README.md          # Tài liệu hướng dẫn chi tiết từng bước
```

---

## 🚀 Hướng dẫn thực hiện chi tiết

### Bước 1: Lấy Gemini API Key từ Google AI Studio
1. Truy cập vào [Google AI Studio](https://aistudio.google.com/).
2. Đăng nhập bằng tài khoản Google.
3. Chọn mục **Get API key** ở thanh menu bên trái.
4. Bấm **Create API key** và lưu lại chuỗi khóa bí mật này.

---

### Bước 2: Chạy thử nghiệm trên máy cục bộ (Local)

Mở terminal và di chuyển vào thư mục bài tập 2:
```powershell
cd "C:\Users\ADMIN\.gemini\antigravity\scratch\5Day-AI-Agents-Vibecoding\day1\bai-tap-2"
```

1. **Cài đặt thư viện:**
   ```powershell
   pip install -r requirements.txt
   ```

2. **Khởi chạy ứng dụng:**
   ```powershell
   streamlit run app.py
   ```

3. Mở trình duyệt tại địa chỉ `http://localhost:8501`, dán API Key vào thanh cấu hình bên trái và bắt đầu trò chuyện với trợ lý AI!

---

### Bước 3: Triển khai lên Google Cloud Run

Có 2 cách để đưa ứng dụng lên Cloud Run:

#### Cách 1: Triển khai thông qua giao diện Google Cloud Console (Khuyên dùng)
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/run).
2. Chọn dự án của bạn (Project).
3. Bấm **Create Service** (Tạo dịch vụ).
4. Chọn **Continuously deploy from a repository** (Kết nối trực tiếp với GitHub repo `NPKhang2005/5Day-AI-Agents-Vibecoding`).
5. Chỉ định đường dẫn thư mục bài tập: `day1/bai-tap-2`.
6. Tại mục **Authentication**, chọn **Allow unauthenticated invocations** (Cho phép truy cập công khai).
7. Tại mục **Container, Environment Variables**, thêm biến môi trường:
   - Name: `GEMINI_API_KEY`
   - Value: *(Dán API Key từ AI Studio của bạn vào đây)*
8. Bấm **Create** và đợi 2-3 phút để Google Cloud tự build và cấp đường link URL dạng: `https://agu-ai-tutor-xxxxx.a.run.app`.

#### Cách 2: Triển khai bằng dòng lệnh Google Cloud CLI (`gcloud`)
Nếu máy bạn đã cài Google Cloud SDK:
```powershell
# Đăng nhập Google Cloud
gcloud auth login

# Triển khai trực tiếp mã nguồn lên Cloud Run
gcloud run deploy agu-ai-assistant `
  --source . `
  --region asia-southeast1 `
  --allow-unauthenticated `
  --set-env-vars GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

---

## 🌐 Kết quả nộp bài (Demo & Bằng chứng)

- **Đường link Cloud Run thực tế:** *(Cập nhật link https://... sau khi deploy)*
- **Hình ảnh minh họa:** *(Chèn ảnh chụp màn hình ứng dụng đang chạy)*

---
[⬅️ Quay lại danh sách bài tập Day 1](../README.md)
