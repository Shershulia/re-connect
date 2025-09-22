from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os

DATABASE_URL = os.getenv("DATABASE_URL")

# Лучше явно указать pool_pre_ping, а ещё полезно увеличить pool_size при проде
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

# Генератор сессий (используешь как next(get_db()))
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
