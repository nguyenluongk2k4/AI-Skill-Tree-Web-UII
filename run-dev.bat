@echo off
REM run-dev.bat - Kiểm tra Node, cài dependencies, chạy Vite dev server và mở trình duyệt

:: Chuyển tới thư mục chứa file .bat (gốc dự án)
cd /d "%~dp0"

echo =============================
echo AI Skill Tree Web UI - Run Dev
echo =============================

echo Kiểm tra Node.js...
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js không được tìm thấy trong PATH.
  echo Vui lòng cài đặt Node.js (https://nodejs.org/) và thử lại.
  pause
  exit /b 1
)

echo Node found: 
node -v
echo NPM found:
npm -v

echo.
echo Cài dependencies (npm install)...
npm install
if errorlevel 1 (
  echo "npm install" thất bại. Kiểm tra lỗi ở trên.
  pause
  exit /b 1
)

echo.
echo Khởi chạy Vite dev server trong cửa sổ mới...
start "Vite Dev" cmd /k "npm run dev"

echo Đợi 2 giây để server bắt đầu...
timeout /t 2 >nul

echo Mở trình duyệt tới http://localhost:5173 (mặc định Vite)...
start "" "http://localhost:5173"

echo Done. Nếu trình duyệt chưa tải được, hãy chờ vài giây và thử tải lại.
pause
