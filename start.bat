@echo off
chcp 65001 >nul
echo ══════════════════════════════════════
echo   生产环境启动脚本
echo ══════════════════════════════════════
echo.

:: 设置 Node.js 路径
set "PATH=C:\Users\tx\.workbuddy\binaries\node\versions\22.12.0.installing.13072.__extract_temp__\node-v22.12.0-win-x64;%PATH%"
cd /d "%~dp0"

:: 检查是否已构建
if not exist "dist\index.html" (
    echo [!] 未找到构建产物，正在构建前端...
    call npm install
    call npx vite build
    if errorlevel 1 (
        echo [✗] 构建失败！
        pause
        exit /b 1
    )
    echo [✓] 构建完成
)

:: 启动生产服务器
echo [~] 启动生产服务器 (端口: 3000)...
set NODE_ENV=production
call npx tsx server/index.ts

pause
