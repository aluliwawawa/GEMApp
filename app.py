from flask import Flask, jsonify, request
from database import Database
import logging
from config import API_CONFIG
import sys

# 配置日志
logger = logging.getLogger(__name__)

# 创建Flask应用
app = Flask(__name__)

# 创建数据库连接实例
try:
    db = Database()
    logger.info("Database connection initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize database connection: {e}")
    sys.exit(1)

@app.route('/api/users', methods=['GET'])
def get_all_users():
    """获取所有用户信息"""
    try:
        logger.info("Fetching all users")
        users = db.get_all_users()
        logger.info(f"Successfully retrieved {len(users)} users")
        return jsonify({
            "status": "success",
            "data": users
        }), 200
    except Exception as e:
        logger.error(f"Error fetching all users: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    """获取指定用户信息"""
    try:
        logger.info(f"Fetching user info for ID: {user_id}")
        user_data = db.get_user_info(user_id)
        
        if user_data:
            logger.info(f"Successfully retrieved user data: {user_data}")
            return jsonify({
                "status": "success",
                "data": user_data
            }), 200
        else:
            logger.warning(f"User not found with ID: {user_id}")
            return jsonify({
                "status": "error",
                "message": "用户不存在"
            }), 404
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    """更新用户信息"""
    try:
        data = request.get_json()
        if not data:
            logger.warning("No data provided for update")
            return jsonify({
                "status": "error",
                "message": "未提供更新数据"
            }), 400

        logger.info(f"Updating user {user_id} with data: {data}")
        if db.update_user_info(user_id, data):
            logger.info(f"Successfully updated user {user_id}")
            return jsonify({
                "status": "success",
                "message": "更新成功"
            }), 200
        else:
            logger.warning(f"Failed to update user {user_id}")
            return jsonify({
                "status": "error",
                "message": "更新失败"
            }), 400
    except Exception as e:
        logger.error(f"Error updating user {user_id}: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/api/user', methods=['POST'])
def create_user():
    """创建新用户"""
    try:
        data = request.get_json()
        if not data:
            logger.warning("No data provided for user creation")
            return jsonify({
                "status": "error",
                "message": "未提供用户数据"
            }), 400

        logger.info(f"Creating new user with data: {data}")
        user_id = db.create_user(data)
        logger.info(f"Successfully created user with ID: {user_id}")
        return jsonify({
            "status": "success",
            "message": "创建成功",
            "data": {"user_id": user_id}
        }), 201
    except Exception as e:
        logger.error(f"Error creating user: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.errorhandler(404)
def not_found(error):
    """处理404错误"""
    return jsonify({
        "status": "error",
        "message": "请求的资源不存在"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """处理500错误"""
    return jsonify({
        "status": "error",
        "message": "服务器内部错误"
    }), 500

if __name__ == '__main__':
    try:
        logger.info(f"Starting Flask application on {API_CONFIG['host']}:{API_CONFIG['port']}")
        app.run(
            host=API_CONFIG['host'],
            port=API_CONFIG['port'],
            debug=API_CONFIG['debug']
        )
    except Exception as e:
        logger.error(f"Failed to start Flask application: {e}")
        sys.exit(1) 