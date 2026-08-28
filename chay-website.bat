@echo off
title KHOI DONG CONG THONG TIN THCS DONG TAN
echo =======================================================
echo 🚀 ĐANG KÍCH HOẠT CỔNG THÔNG TIN ĐIỆN TỬ THCS ĐỒNG TÂN
echo 🌐 Trình duyệt sẽ tự động mở tại: http://localhost:3001
echo =======================================================
cd /d "%~dp0"

:: Tự động kiểm tra và build nếu chưa có thư mục dist
if not exist "dist\index.html" (
    echo 📦 Đang đóng gói dữ liệu khởi động lần đầu...
    call npm run build
)

:: Mở trình duyệt web sau 2 giây
timeout /t 2 /nobreak >nul
start "" "http://localhost:3001"

:: Chạy Server Node Backend
node server/server.js
pause
