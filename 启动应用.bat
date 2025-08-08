@echo off
chcp 65001
echo ========================================
echo    桌面待办时间程序 - 启动器
echo ========================================
echo.
echo 正在启动开发服务器...
echo.
echo 请等待浏览器自动打开...
echo 如果没有自动打开，请手动访问: http://localhost:3000
echo.
echo 按 Ctrl+C 停止服务器
echo.
npm run dev
pause 