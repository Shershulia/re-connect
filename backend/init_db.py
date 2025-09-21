#!/usr/bin/env python3
"""
Простой скрипт для инициализации базы данных
"""

import psycopg2
import os

def init_database():
    """Создать таблицы и добавить тестовые данные"""
    try:
        # Подключение к базе данных
        DATABASE_URL = os.getenv('DATABASE_URL')
        if DATABASE_URL and DATABASE_URL.startswith('postgres://'):
            DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)
        
        if DATABASE_URL:
            conn = psycopg2.connect(DATABASE_URL)
        else:
            conn = psycopg2.connect(
                host='localhost',
                database='octopus_db',
                user='octopus_user',
                password='octopus_password'
            )
        
        cur = conn.cursor()
        
        # Создаем таблицу
        cur.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                nickname VARCHAR(50) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Проверяем, есть ли уже пользователи
        cur.execute('SELECT COUNT(*) FROM users')
        count = cur.fetchone()[0]
        
        if count == 0:
            # Добавляем тестовых пользователей
            test_users = ['test_user_1', 'test_user_2', 'admin']
            
            for nickname in test_users:
                cur.execute('INSERT INTO users (nickname) VALUES (%s)', (nickname,))
            
            print("✅ Test users added")
        else:
            print(f"ℹ️  Users already exist ({count} users)")
        
        conn.commit()
        
        # Показываем всех пользователей
        cur.execute('SELECT id, nickname, created_at FROM users ORDER BY created_at DESC')
        users = cur.fetchall()
        
        print(f"\n📊 All users ({len(users)}):")
        for user in users:
            print(f"  - ID: {user[0]}, Nickname: {user[1]}, Created: {user[2]}")
        
        cur.close()
        conn.close()
        print("\n✅ Database initialization completed")
        
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        print("💡 Make sure PostgreSQL is running and DATABASE_URL is correct")

if __name__ == "__main__":
    print("🚀 Initializing database...")
    print(f"📍 DATABASE_URL: {os.getenv('DATABASE_URL', 'Using local connection')}")
    init_database()