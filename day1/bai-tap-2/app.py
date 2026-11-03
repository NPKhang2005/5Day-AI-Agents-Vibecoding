import os
import streamlit as st
from google import genai
from google.genai import types

# Cấu hình trang Streamlit
st.set_page_config(
    page_title="AGU AI Tutor - Trợ lý học tập CNTT",
    page_icon="🤖",
    layout="centered"
)

# Tùy biến giao diện CSS phong cách hiện đại màu xanh
st.markdown("""
<style>
    .main-header {
        text-align: center;
        padding: 1rem 0 1.5rem 0;
    }
    .main-title {
        color: #1e3a8a;
        font-weight: 800;
        font-size: 2.2rem;
        margin-bottom: 0.3rem;
    }
    .sub-title {
        color: #475569;
        font-size: 1rem;
    }
    .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background-color: #dbeafe;
        color: #1d4ed8;
        border-radius: 9999px;
        font-size: 0.85rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

# Phần Header
st.markdown("""
<div class="main-header">
    <span class="badge">Google AI Studio & Cloud Run Demo</span>
    <h1 class="main-title">🤖 AGU AI Study Assistant</h1>
    <p class="sub-title">Trợ lý hỗ trợ học tập CNTT & Vibe Coding cho sinh viên Đại học An Giang</p>
</div>
""", unsafe_allow_html=True)

# Cấu hình Sidebar
with st.sidebar:
    st.header("⚙️ Cấu hình hệ thống")
    
    # Ưu tiên lấy API key từ biến môi trường (khi deploy lên Cloud Run)
    env_api_key = os.getenv("GEMINI_API_KEY", "")
    api_key_input = st.text_input(
        "Gemini API Key:",
        value=env_api_key,
        type="password",
        help="Lấy API Key miễn phí tại: https://aistudio.google.com/apikey"
    )

    selected_model = st.selectbox(
        "Mô hình Gemini:",
        options=["gemini-2.5-flash", "gemini-2.5-pro", "gemini-1.5-flash"],
        index=0
    )

    system_role = st.text_area(
        "System Instruction (Vai trò của AI):",
        value="Bạn là một trợ lý thông minh, thân thiện dành riêng cho sinh viên ngành Công nghệ Thông tin tại Đại học An Giang. Bạn giỏi giải thích kiến thức lập trình (C++, Web, Python, Database), hỗ trợ sửa lỗi code và chia sẻ phong cách lập trình Vibe Coding trực quan.",
        height=130
    )

    if st.button("🗑️ Xóa lịch sử chat"):
        st.session_state.messages = []
        st.rerun()

    st.markdown("---")
    st.caption("👨‍💻 **Tác giả:** Nguyễn Phúc Khang")
    st.caption("🏫 **Trường:** Đại học An Giang (AGU)")
    st.caption("📚 **Khóa học:** 5-Day AI Agents With Google (Kaggle)")

# Khởi tạo lịch sử tin nhắn
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "assistant", "content": "Xin chào Phúc Khang và các bạn sinh viên AGU! Mình là trợ lý học tập AI. Bạn cần hỗ trợ gì về môn học, bài tập code hay ý tưởng đồ án hôm nay?"}
    ]

# Hiển thị các tin nhắn cũ
for msg in st.session_state.messages:
    with st.chat_message(msg["role"]):
        st.markdown(msg["content"])

# Xử lý khi người dùng gửi câu hỏi
user_prompt = st.chat_input("Nhập câu hỏi hoặc đoạn code cần giải đáp...")

if user_prompt:
    active_api_key = api_key_input.strip()

    if not active_api_key:
        st.error("⚠️ Vui lòng nhập Gemini API Key ở thanh bên trái hoặc cấu hình biến môi trường GEMINI_API_KEY để tiếp tục!")
    else:
        # Lưu câu hỏi người dùng
        st.session_state.messages.append({"role": "user", "content": user_prompt})
        with st.chat_message("user"):
            st.markdown(user_prompt)

        # Gọi Gemini API
        with st.chat_message("assistant"):
            try:
                client = genai.Client(api_key=active_api_key)
                
                with st.spinner("Gemini đang suy nghĩ..."):
                    response = client.models.generate_content(
                        model=selected_model,
                        contents=user_prompt,
                        config=types.GenerateContentConfig(
                            system_instruction=system_role,
                            temperature=0.7
                        )
                    )
                    
                    answer = response.text
                    st.markdown(answer)
                    st.session_state.messages.append({"role": "assistant", "content": answer})
                    
            except Exception as e:
                error_msg = f"❌ Đã xảy ra lỗi khi gọi Gemini API: {str(e)}"
                st.error(error_msg)
