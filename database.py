import mysql.connector
import logging
from config import DB_CONFIG

class Database:
    def __init__(self):
        """初始化数据库连接"""
        self.connection = None
        self.connect()

    def connect(self):
        """建立数据库连接"""
        try:
            self.connection = mysql.connector.connect(**DB_CONFIG)
            logging.info("数据库连接成功")
        except Exception as e:
            logging.error(f"数据库连接失败: {e}")
            raise

    def get_user_info(self, user_id):
        """获取用户信息
        
        Args:
            user_id: 用户ID
            
        Returns:
            dict: 用户信息字典，包含id、username、startdatum、zieldatum、aktueldatum
        """
        try:
            cursor = self.connection.cursor(dictionary=True)
            query = "SELECT * FROM `总计划` WHERE id = %s"
            cursor.execute(query, (user_id,))
            result = cursor.fetchone()
            cursor.close()
            
            if result:
                user_data = {
                    'id': result['id'],
                    'username': result['username'],
                    'startdatum': result['startdatum'],
                    'zieldatum': result['zieldatum'],
                    'aktueldatum': result['aktueldatum']
                }
                logging.info(f"成功获取用户 {user_id} 的信息: {user_data}")
                return user_data
            logging.warning(f"未找到用户 {user_id}")
            return None
        except Exception as e:
            logging.error(f"获取用户 {user_id} 信息时出错: {e}")
            raise

    def get_all_users(self):
        """获取所有用户信息
        
        Returns:
            list: 用户信息列表
        """
        try:
            cursor = self.connection.cursor(dictionary=True)
            query = "SELECT * FROM `总计划`"
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            
            logging.info(f"成功获取所有用户信息，共 {len(results)} 条记录")
            return results
        except Exception as e:
            logging.error(f"获取所有用户信息时出错: {e}")
            raise

    def update_user_info(self, user_id, data):
        """更新用户信息
        
        Args:
            user_id: 用户ID
            data: 包含更新字段的字典
            
        Returns:
            bool: 更新是否成功
        """
        try:
            cursor = self.connection.cursor()
            query = """
                UPDATE `总计划` 
                SET username = %s, 
                    startdatum = %s, 
                    zieldatum = %s, 
                    aktueldatum = %s
                WHERE id = %s
            """
            values = (
                data.get('username'),
                data.get('startdatum'),
                data.get('zieldatum'),
                data.get('aktueldatum'),
                user_id
            )
            cursor.execute(query, values)
            self.connection.commit()
            cursor.close()
            
            logging.info(f"成功更新用户 {user_id} 的信息")
            return True
        except Exception as e:
            logging.error(f"更新用户 {user_id} 信息时出错: {e}")
            self.connection.rollback()
            raise

    def create_user(self, data):
        """创建新用户
        
        Args:
            data: 包含用户信息的字典
            
        Returns:
            int: 新创建用户的ID
        """
        try:
            cursor = self.connection.cursor()
            query = """
                INSERT INTO `总计划` (username, startdatum, zieldatum, aktueldatum)
                VALUES (%s, %s, %s, %s)
            """
            values = (
                data.get('username'),
                data.get('startdatum'),
                data.get('zieldatum'),
                data.get('aktueldatum')
            )
            cursor.execute(query, values)
            self.connection.commit()
            user_id = cursor.lastrowid
            cursor.close()
            
            logging.info(f"成功创建新用户，ID: {user_id}")
            return user_id
        except Exception as e:
            logging.error(f"创建新用户时出错: {e}")
            self.connection.rollback()
            raise

    def close(self):
        """关闭数据库连接"""
        if self.connection:
            self.connection.close()
            logging.info("数据库连接已关闭") 