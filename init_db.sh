#!/bin/bash

# 设置MySQL连接信息
DB_USER="root"
DB_PASSWORD="your_password_here"  # 请替换为你的实际密码
DB_HOST="localhost"

# 执行SQL文件
mysql -u$DB_USER -p$DB_PASSWORD -h$DB_HOST < init.sql

echo "数据库初始化完成" 