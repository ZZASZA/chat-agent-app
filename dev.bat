@echo off
set "PATH=C:\Users\tx\.workbuddy\binaries\node\versions\22.12.0.installing.13072.__extract_temp__\node-v22.12.0-win-x64;%PATH%"
cd /d "%~dp0"
echo Starting dev server...
call npx concurrently "call npx tsx watch server/index.ts" "call npx vite" --names server,client
