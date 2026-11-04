"""
Upload to Google Drive Script
Tạo và tối ưu dựa trên tài liệu chính thức từ Google Developer Knowledge MCP server.
Sử dụng Google Drive API v3 với xác thực OAuth 2.0.
"""

import os
import sys
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

# Phạm vi truy cập: 'drive.file' cho phép tạo và quản lý các file do chính ứng dụng này tải lên
SCOPES = ['https://www.googleapis.com/auth/drive.file']

CREDENTIALS_FILE = 'credentials.json'
TOKEN_FILE = 'token.json'


def authenticate_google_drive():
    """Xác thực người dùng qua OAuth 2.0 và lưu token phiên làm việc."""
    creds = None

    # Tệp token.json lưu trữ access token và refresh token sau lần đăng nhập đầu tiên
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)

    # Nếu chưa có token hoặc token hết hạn, yêu cầu người dùng xác thực
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CREDENTIALS_FILE):
                print(f"[!] Lỗi: Không tìm thấy tệp '{CREDENTIALS_FILE}'.")
                print("Vui lòng tải credentials.json từ Google Cloud Console (OAuth Client ID) và đặt vào cùng thư mục.")
                return None

            flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)

        # Lưu credentials cho các lần chạy tiếp theo
        with open(TOKEN_FILE, 'w', encoding='utf-8') as token:
            token.write(creds.to_json())

    return creds


def upload_file_to_drive(file_path: str, folder_id: str = None) -> str:
    """
    Tải một tệp tin lên Google Drive.
    
    :param file_path: Đường dẫn tệp cần upload trên máy cục bộ.
    :param folder_id: (Tùy chọn) ID thư mục trên Google Drive muốn lưu file vào.
    :return: File ID trên Google Drive nếu upload thành công, None nếu thất bại.
    """
    if not os.path.exists(file_path):
        print(f"[!] Lỗi: Tệp tin '{file_path}' không tồn tại trên máy.")
        return None

    creds = authenticate_google_drive()
    if not creds:
        return None

    try:
        service = build('drive', 'v3', credentials=creds)

        file_metadata = {
            'name': os.path.basename(file_path)
        }

        if folder_id:
            file_metadata['parents'] = [folder_id]

        # Chuẩn bị media upload với resumable=True để hỗ trợ tệp dung lượng lớn
        media = MediaFileUpload(file_path, resumable=True)

        print(f"[*] Đang tải tệp '{file_path}' lên Google Drive...")
        uploaded_file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id, name, webViewLink'
        ).execute()

        file_id = uploaded_file.get('id')
        link = uploaded_file.get('webViewLink')

        print(f"[✓] Tải lên thành công!")
        print(f"    - File ID: {file_id}")
        if link:
            print(f"    - Xem trên Drive: {link}")

        return file_id

    except HttpError as error:
        print(f"[!] Lỗi khi gọi Google Drive API: {error}")
        return None


if __name__ == '__main__':
    # Ví dụ sử dụng:
    # python upload_to_drive.py <duong_dan_file> [folder_id]
    if len(sys.argv) > 1:
        target_path = sys.argv[1]
        target_folder = sys.argv[2] if len(sys.argv) > 2 else None
        upload_file_to_drive(target_path, target_folder)
    else:
        print("Cách sử dụng: python upload_to_drive.py <tệp_cần_upload> [ID_thư_mục_Drive_tùy_chọn]")
        print("Ví dụ: python upload_to_drive.py sample.txt")
