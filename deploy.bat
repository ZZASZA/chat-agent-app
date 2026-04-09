@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   Chat Agent App - 一键部署到 GitHub + Render
echo ============================================================
echo.

set PATH=C:\Users\tx\git-portable\cmd;C:\Users\tx\.workbuddy\binaries\node\versions\22.12.0.installing.13072.__extract_temp__\node-v22.12.0-win-x64;%PATH%

:: Step 1: 输入 GitHub 信息
set /p GITHUB_USER="请输入你的 GitHub 用户名: "
set /p GITHUB_TOKEN="请输入你的 GitHub Personal Access Token: "

echo.
echo === Step 1/4: 创建 GitHub 仓库 ===

:: 创建 GitHub 仓库（通过 API）
curl -s -X POST https://api.github.com/user/repos ^
  -H "Authorization: token %GITHUB_TOKEN%" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"chat-agent-app\",\"private\":false}" > _github_response.json

:: 检查是否成功
findstr /C:"\"full_name\"" _github_response.json >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 创建仓库失败！请检查用户名和 Token 是否正确。
    type _github_response.json
    del _github_response.json
    pause
    exit /b 1
)
del _github_response.json

echo [OK] GitHub 仓库创建成功: https://github.com/%GITHUB_USER%/chat-agent-app
echo.

:: Step 2: 推送代码
echo === Step 2/4: 推送代码到 GitHub ===
git remote remove origin 2>nul
git remote add origin https://%GITHUB_TOKEN%@github.com/%GITHUB_USER%/chat-agent-app.git
git push -u origin master
if %errorlevel% neq 0 (
    echo [错误] 推送失败！
    pause
    exit /b 1
)
echo [OK] 代码推送成功！
echo.

:: Step 3: 部署到 Render
echo === Step 3/4: 部署到 Render ===
echo.
echo 请按以下步骤操作：
echo   1. 打开 https://dashboard.render.com/select-repo
echo   2. 用 GitHub 账号登录
echo   3. 选择 "chat-agent-app" 仓库
echo   4. Render 会自动检测到 render.yaml 配置
echo   5. 在环境变量中添加 CODEBUDDY_API_KEY
echo   6. 点击 "Apply" 开始部署
echo.
echo 或者直接访问:
echo   https://dashboard.render.com/select-repo
echo.

:: Step 4: 完成
echo === Step 4/4: 完成 ===
echo.
echo 🎉 代码已推送到: https://github.com/%GITHUB_USER%/chat-agent-app
echo 🚀 部署后访问地址会在 Render 控制台显示
echo.
echo 重要提醒：
echo   - 在 Render 环境变量中设置 CODEBUDDY_API_KEY
echo   - Render 免费套餐会在 15 分钟无活动后休眠
echo   - 首次唤醒大约需要 30-60 秒
echo.
pause
