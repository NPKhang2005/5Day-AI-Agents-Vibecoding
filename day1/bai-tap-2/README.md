# Bài tập 2: Ứng dụng Snowflakes & Balloons

Ứng dụng web tương tác được xây dựng bằng **Google AI Studio** theo phong cách Vibe Coding và triển khai Serverless lên **Google Cloud Run**.

---

## 📌 Giới thiệu ứng dụng
- **Tên ứng dụng:** Snowflakes & Balloons
- **Học viên:** Nguyễn Phúc Khang
- **Trường:** Đại học An Giang - ĐHQG TP.HCM (AGU)
- **Khóa học:** 5-Day AI Agents: Intensive Vibe Coding Course With Google (Kaggle)
- **🌐 Trải nghiệm trực tiếp (Live Demo):** [https://khang-snowflakes-balloons.ai.studio](https://khang-snowflakes-balloons.ai.studio)

---

## 📸 Hình ảnh minh họa
![Snowflakes & Balloons Screenshot](./screenshot.png)

---

## 📖 Mô tả hoạt động
Ứng dụng cung cấp bảng điều khiển tương tác trực quan với các hiệu ứng sống động:
- **Nút Snowflakes:** Kích hoạt hiệu ứng các bông tuyết rơi nhẹ nhàng phủ đầy màn hình.
- **Nút Balloons:** Thả những chùm bóng bay đa sắc màu bay vút lên bầu trời liên tục trong vòng **5 giây**.
- Kết hợp âm thanh sống động thông qua Web Audio API khi kích hoạt các nút bấm.

---

## 🛠️ Các bước thực hiện
1. **Mô tả ứng dụng bằng Prompt:** Sử dụng tính năng **Build Mode** trong **Google AI Studio**, nhập prompt mô tả chi tiết giao diện, các nút điều khiển, hiệu ứng hạt Canvas (tuyết rơi, bóng bay trong 5s) và hiệu ứng âm thanh.
2. **Kiểm thử & Tinh chỉnh (Preview):** Xem trước và tương tác trực tiếp với ứng dụng trên bảng xem trước của AI Studio, căn chỉnh màu sắc, thời lượng hiệu ứng và hoạt ảnh.
3. **Triển khai (Publish to Cloud Run):** Nhấn nút **Publish** trong Google AI Studio để hệ thống tự động đóng gói và triển khai ứng dụng lên **Google Cloud Run** với đường link công khai: [https://khang-snowflakes-balloons.ai.studio](https://khang-snowflakes-balloons.ai.studio).

---

## 💻 Công nghệ sử dụng
- **Google AI Studio** (Build mode / Vibe Coding)
- **React** & **TypeScript**
- **Vite** (Build tool hiện đại, tối ưu tốc độ)
- **HTML5 Canvas** (Xử lý render đồ họa hạt mượt mà)
- **Web Audio API** (Tạo hiệu ứng âm thanh tương tác)
- **Google Cloud Run** (Nền tảng lưu trữ container serverless)

---

## 🚀 Hướng dẫn chạy trên máy cục bộ (Local Run)

1. **Di chuyển vào thư mục dự án:**
   ```bash
   cd day1/bai-tap-2
   ```

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy máy chủ phát triển:**
   ```bash
   npm run dev
   ```

4. Mở trình duyệt tại địa chỉ hiển thị trong terminal (thường là `http://localhost:5173`) để trải nghiệm ứng dụng.

---
[⬅️ Quay lại danh sách bài tập Day 1](../README.md)
