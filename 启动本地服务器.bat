@echo off
chcp 65001 >nul
echo 正在启动课堂助手本地服务器...
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
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python未安装，尝试使用Node.js...
    
    REM 检查Node.js是否安装
    node --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo 未找到Python或Node.js，使用默认浏览器直接打开文件...
        start "" "%PROJECT_DIR%index.html"
        echo.
        echo 注意：直接打开HTML文件可能无法正常加载某些功能。
        echo 建议安装Python或Node.js来启动本地服务器。
        echo.
        echo 按任意键关闭此窗口...
        pause >nul
        exit /b 0
    ) else (
        echo 使用Node.js启动服务器...
        echo 正在检查http-server是否安装...
        
        npx http-server --version >nul 2>&1
        if %errorlevel% neq 0 (
            echo 正在安装http-server...
            npm install -g http-server
        )
        
        echo 启动服务器在端口8080...
        echo 服务器地址：http://localhost:8080
        echo.
        echo 按Ctrl+C停止服务器
        echo.
        
        REM 延迟2秒后打开浏览器
        timeout /t 2 /nobreak >nul
        start "" "http://localhost:8080"
        
        REM 启动服务器
        npx http-server "%PROJECT_DIR%" -p 8080 -o
    )
) else (
    echo 使用Python启动服务器...
    echo 启动服务器在端口8000...
    echo 服务器地址：http://localhost:8000
    echo.
    echo 按Ctrl+C停止服务器
    echo.
    
    REM 延迟2秒后打开浏览器
    timeout /t 2 /nobreak >nul
    start "" "http://localhost:8000"
    
    REM 切换到项目目录并启动Python服务器
    cd /d "%PROJECT_DIR%"
    python -m http.server 8000
) 