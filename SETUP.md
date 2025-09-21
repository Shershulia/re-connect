# 🛠 Настройка проекта

## Что нужно сделать перед запуском:

### 1. Создать файл `.env.local`

В корне проекта создайте файл `.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2. Установить зависимости

```bash
# Фронтенд
npm install

# Бэкенд
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Настроить базу данных

#### Вариант A: Локальная PostgreSQL
```sql
CREATE DATABASE octopus_db;
CREATE USER octopus_user WITH PASSWORD 'octopus_password';
GRANT ALL PRIVILEGES ON DATABASE octopus_db TO octopus_user;
```

#### Вариант B: Railway (рекомендуется)
1. Задеплойте бэкенд на Railway
2. Добавьте PostgreSQL базу данных
3. Обновите `NEXT_PUBLIC_API_URL` в `.env.local`

### 4. Запуск

#### Быстрый запуск:
```bash
./start.sh
```

#### Или вручную:
```bash
# Терминал 1 - Бэкенд
cd backend
python app.py

# Терминал 2 - Фронтенд
npm run dev
```

## 🎯 Что должно работать:

- ✅ Загрузка пользователей при старте
- ✅ Добавление новых никнеймов
- ✅ Проверка дубликатов в реальном времени
- ✅ Уведомления об ошибках
- ✅ Анимированный осьминог с щупальцами
- ✅ Адаптивный дизайн

## 🚨 Возможные проблемы:

### 1. "Failed to load users"
- Проверьте, что бэкенд запущен на порту 5000
- Проверьте `NEXT_PUBLIC_API_URL` в `.env.local`

### 2. "Database connection failed"
- Убедитесь, что PostgreSQL запущен
- Проверьте `DATABASE_URL` в бэкенде

### 3. "CORS error"
- Бэкенд настроен на CORS, но проверьте настройки

## 📱 Тестирование:

1. Откройте http://localhost:3000
2. Добавьте никнейм в форму
3. Проверьте, что появилось щупальце
4. Попробуйте добавить тот же никнейм (должна появиться ошибка)
5. Обновите страницу (пользователи должны загрузиться)

## 🎉 Готово!

Если все работает, ваш проект готов к использованию!
