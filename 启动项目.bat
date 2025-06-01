@echo off
echo 正在启动课堂助手项目...
echo.

REM 获取当前目录
set "PROJECT_DIR=%~dp0"

REM 检查index.html是否存在
if not exist "%PROJECT_DIR%index.html" (
    echo 错误：找不到index.html文件！
    echo 请确保此bat文件位于项目根目录中。
    pause
    exit /b 1
)

echo 项目目录：%PROJECT_DIR%
echo 正在使用默认浏览器打开项目...
echo.

REM 使用默认浏览器打开index.html
start "" "%PROJECT_DIR%index.html"

echo 项目已启动！
echo 如果浏览器没有自动打开，请手动打开以下文件：
echo %PROJECT_DIR%index.html
echo.
echo 按任意键关闭此窗口...
pause >nul 