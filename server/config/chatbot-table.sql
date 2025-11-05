-- SQL table for chatbot conversations
-- Run this SQL in your database

CREATE TABLE IF NOT EXISTS chatbot_conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) DEFAULT NULL,
    user_email VARCHAR(255) DEFAULT NULL,
    user_phone VARCHAR(50) DEFAULT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    message_type ENUM('user', 'bot') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session (session_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
