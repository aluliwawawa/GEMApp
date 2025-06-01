-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS ClientDoc;

-- 使用数据库
USE ClientDoc;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    startdatum DATE,
    zieldatum DATE,
    aktueldatum DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入测试数据
INSERT INTO users (username, startdatum, zieldatum, aktueldatum) VALUES
('阿瓜', '2024-01-01', '2024-12-31', '2024-03-15'),
('测试用户', '2024-02-01', '2024-12-31', '2024-03-15'); 