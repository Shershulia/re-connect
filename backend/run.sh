#!/bin/bash

echo "🐙 Starting Octopus Backend..."

# Проверяем, установлены ли зависимости
if [ ! -d "venv" ] && [ ! -f "requirements.txt" ]; then
    echo "❌ Requirements not found"
    exit 1
fi

# Устанавливаем зависимости если нужно
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Инициализируем базу данных
echo "🗄️ Initializing database..."
python init_db.py

# Запускаем бэкенд
echo "🚀 Starting Flask backend..."
python app.py
