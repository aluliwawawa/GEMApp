#!/bin/bash

# 设置工作目录
cd /gemapp

# 设置环境变量
export DB_HOST=localhost
export DB_USER=root
export DB_PASSWORD=123456  # 请替换为你的实际数据库密码
export DB_NAME=ClientDoc
export DB_PORT=3306
export API_HOST=0.0.0.0
export API_PORT=5000
export API_DEBUG=1

# 启动Flask应用
python3 app.py > flask.log 2>&1 &
echo $! > flask.pid

echo "Flask application started. Check flask.log for details." 