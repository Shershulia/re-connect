#!/bin/bash

echo "🐙 Starting Octopus Connect..."

# Проверяем, существует ли .env.local
if [ ! -f ".env.local" ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
    echo "✅ .env.local created"
fi

# Проверяем, установлены ли зависимости
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

if [ ! -d "backend/venv" ] && [ ! -f "backend/requirements.txt" ]; then
    echo "⚠️  Backend dependencies not found. Please run:"
    echo "   cd backend && pip install -r requirements.txt"
    exit 1
fi

# Функция для остановки всех процессов
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    # Убиваем все процессы Python и Node на нужных портах
    pkill -f "python.*app.py" 2>/dev/null
    pkill -f "next.*dev" 2>/dev/null
    echo "✅ Services stopped"
    exit 0
}

# Перехватываем Ctrl+C
trap cleanup SIGINT

# Запускаем бэкенд в фоне
echo "🚀 Starting backend..."
cd backend
python app.py &
BACKEND_PID=$!
cd ..

# Ждем немного, чтобы бэкенд запустился
echo "⏳ Waiting for backend to start..."
sleep 5

# Проверяем, что бэкенд запустился
if ! curl -s http://localhost:5000/api/health > /dev/null; then
    echo "❌ Backend failed to start. Please check the logs."
    cleanup
    exit 1
fi

echo "✅ Backend is running"

# Запускаем фронтенд
echo "🎨 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Both services started!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "🔍 Health check: http://localhost:5000/api/health"
echo ""
echo "Press Ctrl+C to stop both services"

# Ждем завершения
wait
