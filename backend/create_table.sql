-- Создание таблицы users
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавляем тестовые данные если таблица пустая
INSERT INTO users (nickname) 
SELECT 'test_user_1' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE nickname = 'test_user_1');

INSERT INTO users (nickname) 
SELECT 'test_user_2' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE nickname = 'test_user_2');

INSERT INTO users (nickname) 
SELECT 'admin' 
WHERE NOT EXISTS (SELECT 1 FROM users WHERE nickname = 'admin');
