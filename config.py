import os
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('flask.log'),
        logging.StreamHandler()
    ]
)

# 数据库配置
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'user': os.getenv('DB_USER', 'root'),
    'password': os.getenv('DB_PASSWORD', ''),  # 请确保这里设置了正确的密码
    'database': os.getenv('DB_NAME', 'ClientDoc'),
    'port': int(os.getenv('DB_PORT', 3306)),
    'charset': 'utf8mb4',  # 添加字符集配置
    'collation': 'utf8mb4_unicode_ci'  # 添加排序规则
}

# 打印数据库配置（不打印密码）
logging.info(f"Database configuration: {DB_CONFIG['host']}:{DB_CONFIG['port']}")

# API配置
API_CONFIG = {
    'host': os.getenv('API_HOST', '0.0.0.0'),
    'port': int(os.getenv('API_PORT', 5000)),
    'debug': bool(int(os.getenv('API_DEBUG', 0)))
} 