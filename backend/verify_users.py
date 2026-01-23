from app.database import SessionLocal
from app.models.user import User

try:
    db = SessionLocal()
    users = db.query(User).all()
    print("USERS FOUND:")
    for u in users:
        print(f"ID: {u.id} | User: {u.username} | Email: {u.email} | Role: {u.role}")
except Exception as e:
    print(f"ERROR: {e}")
