from flask import Flask, jsonify, request
from database import Database

app = Flask(__name__)
db = Database()  # 创建数据库连接实例

@app.route('/api/users', methods=['GET'])
def get_all_users():
    try:
        users = db.get_all_users()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/<user_id>', methods=['GET'])
def get_user(user_id):
    try:
        user_data = db.get_user_info(user_id)
        if user_data:
            return jsonify(user_data), 200
        else:
            return jsonify({"error": "用户不存在"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user/<user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        data = request.get_json()
        if db.update_user_info(user_id, data):
            return jsonify({"message": "更新成功"}), 200
        return jsonify({"error": "更新失败"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        user_id = db.create_user(data)
        return jsonify({"message": "创建成功", "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True) 