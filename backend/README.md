# 🐙 Simple Octopus Backend

Очень простой Flask бэкенд с PostgreSQL для проекта Octopus Connect.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
pip install -r requirements.txt
```

### 2. Настройка базы данных

#### Локально:
```sql
CREATE DATABASE octopus_db;
CREATE USER octopus_user WITH PASSWORD 'octopus_password';
GRANT ALL PRIVILEGES ON DATABASE octopus_db TO octopus_user;
```

#### Или используйте Railway:
- Добавьте PostgreSQL в Railway
- DATABASE_URL будет создан автоматически

### 3. Инициализация базы данных

```bash
python init_db.py
```

### 4. Запуск

```bash
python app.py
```

API будет доступен по адресу: `http://localhost:5000`

## 📡 API Endpoints

### POST /api/users
Добавить нового пользователя

**Request:**
```json
{
  "nickname": "username"
}
```

**Response:**
```json
{
  "message": "User added successfully",
  "users": [
    {
      "id": 1,
      "nickname": "username",
      "created_at": "2024-01-01T12:00:00"
    }
  ]
}
```

### GET /api/users
Получить всех пользователей

**Response:**
```json
{
  "users": [
    {
      "id": 1,
      "nickname": "username",
      "created_at": "2024-01-01T12:00:00"
    }
  ]
}
```

### GET /api/health
Проверка здоровья API

**Response:**
```json
{
  "status": "healthy",
  "message": "API is running"
}
```

## 🗄️ База данных

Простая таблица `users`:
- `id` - уникальный идентификатор
- `nickname` - никнейм пользователя (уникальный)
- `created_at` - дата создания

## 🚀 Деплой на Railway

1. Подключите GitHub репозиторий
2. Выберите папку `backend`
3. Добавьте PostgreSQL базу данных
4. Railway автоматически задеплоит

## 🎯 Особенности

- **Очень простой** - только Flask + PostgreSQL
- **Без ORM** - прямой SQL
- **Автоинициализация** - таблицы создаются автоматически
- **CORS поддержка** - работает с фронтендом
- **Обработка ошибок** - понятные сообщения об ошибках
