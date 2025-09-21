import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from db import engine, Base
from routes import bp as api_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Настройка CORS для разрешения запросов с фронтенда
    CORS(app, 
         origins=['http://localhost:3000', 'http://127.0.0.1:3000'],
         methods=['GET', 'POST', 'OPTIONS'],
         allow_headers=['Content-Type', 'Authorization'],
         supports_credentials=True)
    
    app.register_blueprint(api_bp)

    # Инициализация таблиц сразу при старте
    with app.app_context():
        Base.metadata.create_all(bind=engine)

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
