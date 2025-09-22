import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from db import engine, Base
from routes import bp as api_bp
import models  # важно: чтобы модели зарегистрировались

load_dotenv()

def create_app():
    app = Flask(__name__)

    # CORS: добавь домен фронта; на время можно '*' (лучше конкретный домен)
    CORS(
        app,
        origins=[
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://www.re-connect.xyz',
        ],
        methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allow_headers=['Content-Type', 'Authorization'],
        supports_credentials=True,
    )

    app.register_blueprint(api_bp)

    # Создаём таблицы при старте
    with app.app_context():
        Base.metadata.create_all(bind=engine)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
