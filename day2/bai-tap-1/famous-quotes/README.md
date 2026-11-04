# Ứng Dụng Danh Ngôn Bất Hủ (Bilingual Famous Quotes) 🌟

Ứng dụng web hiển thị và tra cứu 100 câu danh ngôn bất hủ trên thế giới dưới dạng **song ngữ Anh - Việt**, được xây dựng bằng **Vanilla HTML/CSS/JavaScript** ở frontend và **Python Flask** ở backend, phục vụ trên cổng **5001**.

---

## 🚀 Các Tính Năng Chính

- **100 Danh ngôn chọn lọc**: Kho dữ liệu gồm 100 câu danh ngôn bất hủ từ hơn 60 tác giả vĩ đại (Albert Einstein, Steve Jobs, Mahatma Gandhi, Confucius, Socrates,...).
- **Hiển thị song ngữ**: Mỗi danh ngôn gồm câu tiếng Anh gốc kèm bản dịch tiếng Việt mượt mà, chuẩn nghĩa bên dưới.
- **Danh ngôn ngẫu nhiên**: Nút "Câu ngẫu nhiên" / "Câu tiếp theo" đổi câu trích dẫn mượt mà kèm hiệu ứng chuyển cảnh.
- **Tìm kiếm đa năng**: Tìm kiếm tức thì (live search) theo tên tác giả hoặc từ khóa (hỗ trợ cả tiếng Anh lẫn tiếng Việt).
- **Lọc theo chủ đề (Category)**: 10 chủ đề phong phú: *Inspiration, Life, Success, Wisdom, Courage, Knowledge, Leadership, Friendship, Perseverance, Philosophy*.
- **Danh sách Yêu thích (Favorites) với localStorage**:
  - Nhấp vào biểu tượng trái tim ❤️ trên bất kỳ câu nào để lưu vào danh sách yêu thích.
  - Dữ liệu yêu thích được lưu bền vững trên trình duyệt bằng `localStorage` (không bị mất khi F5 hoặc tắt trình duyệt).
  - Hộp thoại xem danh sách yêu thích, hỗ trợ xóa từng câu hoặc xóa toàn bộ.
- **Xuất CSV (Export Favorites to CSV)**: Nút "Xuất CSV" trong danh sách yêu thích hỗ trợ tải về toàn bộ danh ngôn đã lưu thành tệp `.csv` chuẩn RFC 4180 (kèm mã hóa UTF-8 BOM hiển thị chuẩn tiếng Việt trên Microsoft Excel).
- **Phát âm danh ngôn song ngữ (Text-to-Speech Audio)**: Tích hợp Web Speech API cho phép nghe phát âm chuẩn câu tiếng Anh (`en-US`) và đọc diễn cảm câu tiếng Việt (`vi-VN`) trực tiếp trên trình duyệt chỉ với 1 cú click vào nút loa 🔊.
- **Phím tắt điều hướng nhanh (Keyboard Shortcuts)**:
  - `Space` hoặc `→`: Chuyển sang câu ngẫu nhiên tiếp theo.
  - `F`: Thêm / Xóa khỏi danh sách yêu thích.
  - `C`: Sao chép nhanh danh ngôn.
  - `S`: Phát âm câu tiếng Anh.
  - `/`: Nhảy nhanh đến ô tìm kiếm.
  - `Esc`: Đóng hộp thoại yêu thích.
- **Chế độ Sáng / Tối (Dark / Light Mode)**: Nút chuyển đổi giao diện 🌙 / ☀️ sử dụng biến CSS Root (`:root` và `[data-theme="dark"]`), tự động ghi nhớ sở thích của người dùng trên trình duyệt.
- **Sao chép nhanh**: Nút sao chép (copy) danh ngôn vào clipboard chỉ với 1 cú click kèm thông báo Toast.

---

## 📁 Cấu Trúc Dự Án

```text
famous-quotes/
├── .gitignore               # Loại bỏ .venv, __pycache__, cache file
├── requirements.txt         # Danh sách thư viện (Flask, pytest)
├── app.py                   # Server Flask REST API (chạy port 5001)
├── quotes.json              # Dữ liệu 100 câu danh ngôn song ngữ
├── README.md                # Tài liệu hướng dẫn sử dụng tiếng Việt
├── static/
│   ├── css/
│   │   └── style.css        # Giao diện hiện đại, responsive
│   └── js/
│       └── app.js           # Xử lý logic thuần Vanilla JS & localStorage
├── templates/
│   └── index.html           # Giao diện chính Single Page Application
└── tests/
    ├── __init__.py
    └── test_app.py          # Bộ kiểm thử tự động (12 test cases)
```

---

## 💻 Hướng Dẫn Cài Đặt & Chạy Trên Windows

Dự án đã được kiểm thử và tương thích hoàn toàn với hệ điều hành Windows (Windows 10, Windows 11).

### Bước 1: Mở Terminal tại thư mục dự án

Mở **PowerShell** hoặc **Command Prompt (CMD)**, di chuyển vào thư mục `famous-quotes`:

```powershell
cd famous-quotes
```

### Bước 2: Tạo môi trường ảo Python (`.venv`)

Nếu bạn chưa tạo môi trường ảo, hãy chạy lệnh sau:

```powershell
python -m venv .venv
```

### Bước 3: Kích hoạt môi trường ảo (`.venv`)

#### Cách 1: Sử dụng PowerShell (Khuyên dùng)
```powershell
.\.venv\Scripts\Activate.ps1
```

> **Mẹo xử lý lỗi nếu PowerShell chặn script (`Execution_Policies`):**  
> Nếu bạn gặp thông báo lỗi: `cannot be loaded because running scripts is disabled on this system`, hãy chạy lệnh sau một lần trong phiên PowerShell hiện tại:
> ```powershell
> Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
> .\.venv\Scripts\Activate.ps1
> ```

#### Cách 2: Sử dụng Command Prompt (CMD)
```cmd
.\.venv\Scripts\activate.bat
```

Khi kích hoạt thành công, bạn sẽ thấy tiền tố `(.venv)` xuất hiện ở đầu dòng lệnh.

### Bước 4: Cài đặt thư viện phụ thuộc

```powershell
pip install -r requirements.txt
```

### Bước 5: Khởi chạy ứng dụng Flask

```powershell
python app.py
```

Ứng dụng sẽ khởi động trên cổng **5001**:
```text
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5001
 * Running on http://localhost:5001
```

### Bước 6: Mở trên trình duyệt

Mở trình duyệt web của bạn (Chrome, Edge, Firefox, Brave) và truy cập vào đường dẫn:
👉 **[http://localhost:5001](http://localhost:5001)** hoặc **[http://127.0.0.1:5001](http://127.0.0.1:5001)**

---

## 🧪 Chạy Kiểm Thử Tự Động (Automated Tests)

Bộ kiểm thử được viết bằng `pytest` kiểm tra toàn diện cấu trúc 100 câu danh ngôn, tính hợp lệ của API, chức năng lọc, tìm kiếm và mã phản hồi HTTP.

Chạy lệnh kiểm thử với môi trường ảo đã kích hoạt:

```powershell
pytest -v
```

Hoặc sử dụng mô-đun unittest mặc định của Python:

```powershell
python -m unittest discover tests
```

**Kết quả mong đợi:** Tất cả 12 kiểm thử đều vượt qua (100% Passed).

---

## 🔌 Danh Sách REST API Endpoints

| Phương thức | Đường dẫn | Tham số truy vấn (Query Params) | Mô tả |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Không | Trả về giao diện người dùng chính (`index.html`) |
| `GET` | `/api/quotes/random` | `?category=...`, `?author=...` | Trả về một câu danh ngôn ngẫu nhiên (có thể lọc theo chủ đề/tác giả) |
| `GET` | `/api/quotes` | `?search=...`, `?author=...`, `?category=...` | Tìm kiếm và lọc danh sách danh ngôn |
| `GET` | `/api/quotes/<id>` | Không | Lấy thông tin chi tiết của 1 câu danh ngôn theo mã số ID |
| `GET` | `/api/categories` | Không | Danh sách các chủ đề kèm số lượng câu trong từng chủ đề |
| `GET` | `/api/authors` | Không | Danh sách toàn bộ các tác giả được sắp xếp theo bảng chữ cái |

---

## 💾 Cơ Chế Lưu Trữ Favorites (localStorage)

- Ứng dụng không yêu cầu đăng nhập tài khoản.
- Khi người dùng bấm nút yêu thích ❤️, danh ngôn được lưu trực tiếp vào `localStorage` của trình duyệt dưới key `famous_quotes_favorites_v1`.
- Dữ liệu được duy trì vĩnh viễn trên trình duyệt của máy người dùng cho đến khi chọn **"Xóa tất cả"** hoặc xóa dữ liệu duyệt web.
