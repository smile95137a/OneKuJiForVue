@echo off
echo Starting the build and deploy process...

REM 设置变量
set BUCKET_NAME=onemorelottery.tw
set REGION=ap-northeast-1
set BUILD_DIR=dist

REM 构建Vue项目
echo Building the Vue project...
call npm run build

REM 检查构建是否成功
if %ERRORLEVEL% neq 0 (
    echo Build failed. Exiting...
    exit /b %ERRORLEVEL%
)

REM 同步文件到S3
echo Deploying to S3...
aws s3 sync %BUILD_DIR% s3://%BUCKET_NAME% --delete --region %REGION%

echo Deployment complete!