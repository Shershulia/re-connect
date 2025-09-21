# 🚀 Деплой на Railway - Пошаговая инструкция

## 1. Подготовка

1. **Зарегистрируйтесь на [Railway.app](https://railway.app)**
2. **Подключите GitHub аккаунт**
3. **Создайте новый проект** в Railway

## 2. Деплой бэкенда

1. **В Railway Dashboard:**
   - Нажмите "New Project"
   - Выберите "Deploy from GitHub repo"
   - Выберите ваш репозиторий
   - Выберите папку `backend`

2. **Добавьте PostgreSQL:**
   - В проекте нажмите "+ New"
   - Выберите "Database" → "PostgreSQL"
   - Railway автоматически создаст `DATABASE_URL`

3. **Railway автоматически:**
   - Установит зависимости из `requirements.txt`
   - Запустит приложение через `Procfile`
   - Подключит базу данных

## 3. Инициализация базы данных

После деплоя выполните в Railway Console:
```bash
python init_db.py
```

Или через Railway CLI:
```bash
railway run python init_db.py
```

## 4. Проверка

1. **Получите URL вашего API** из Railway Dashboard
2. **Проверьте health check:** `https://your-app.railway.app/api/health`
3. **Протестируйте API:** `https://your-app.railway.app/api/users`

## 5. Переменные окружения

Railway автоматически создает:
- `DATABASE_URL` - подключение к PostgreSQL
- `PORT` - порт для приложения
- `RAILWAY_STATIC_URL` - статический URL

## 6. Обновление фронтенда

В вашем Next.js приложении обновите API URL:
```javascript
const API_URL = 'https://your-app.railway.app/api';
```

## 🎉 Готово!

Ваш бэкенд теперь работает на Railway с PostgreSQL базой данных!
