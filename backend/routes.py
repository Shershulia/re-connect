from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError
from db import get_db
from models import User

bp = Blueprint("api", __name__, url_prefix="/api")

@bp.get("/health")
def health():
    return {"status": "healthy", "message": "API is running"}

@bp.get("/users")
def list_users():
    db = next(get_db())
    users = db.query(User).order_by(User.created_at.desc()).all()
    return jsonify({
        "users": [{
            "id": u.id, 
            "nickname": u.nickname, 
            "created_at": u.created_at.isoformat()
        } for u in users]
    })

@bp.post("/users")
def create_user():
    data = request.get_json(force=True)
    nickname = data.get("nickname")
    if not nickname:
        return {"error": "Nickname is required"}, 400

    nickname = nickname.strip()
    if not nickname:
        return {"error": "Nickname cannot be empty"}, 400

    if len(nickname) > 50:
        return {"error": "Nickname too long (max 50 characters)"}, 400

    db = next(get_db())
    user = User(nickname=nickname)
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
        
        # Получаем всех пользователей для возврата
        users = db.query(User).order_by(User.created_at.desc()).all()
        return jsonify({
            "message": "User added successfully",
            "users": [{
                "id": u.id, 
                "nickname": u.nickname, 
                "created_at": u.created_at.isoformat()
            } for u in users]
        }), 201
    except IntegrityError:
        db.rollback()
        return {"error": "Your nickname is already in the database"}, 409
