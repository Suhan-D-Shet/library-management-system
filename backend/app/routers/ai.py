from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.book import Book
from app.models.operations import Borrow
from app.models.user import User
from app.core.dependencies import get_current_user
from ai_models.recommendation import get_recommendations

router = APIRouter(prefix="/ai", tags=["AI & Analytics"])

@router.get("/recommendations", response_model=list)
def recommend_books(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Get user's last borrowed book
    last_borrow = db.query(Borrow).filter(Borrow.user_id == current_user.id).order_by(Borrow.borrow_date.desc()).first()
    
    all_books = db.query(Book).all()
    
    if not last_borrow:
        # If no history, return top rated or random (for now, just first 5)
        return all_books[:5]

    # 2. Get recommendations based on last borrowed book
    recommendations = get_recommendations(last_borrow.book_id, all_books)
    
    # Filter out sensitive SQLAlchemy fields if any, or Pydantic will handle it if we used schema.
    # Since response_model is list (generic), we should be careful. 
    # Let's simple return the list of dicts from the AI model.
    return recommendations

from ai_models.analytics import analyze_reader_behavior, predict_demand
from app.models.operations import Borrow

@router.get("/analytics/behavior")
def get_reader_behavior(db: Session = Depends(get_db)):
    users = db.query(User).all()
    borrows = db.query(Borrow).all()
    return analyze_reader_behavior(users, borrows)

@router.get("/analytics/demand")
def get_demand_prediction():
    return predict_demand()

@router.get("/analytics/dashboard")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    # 1. Most Borrowed Books
    from sqlalchemy import func
    most_borrowed = db.query(Book.title, func.count(Borrow.id).label('count'))\
        .join(Borrow, Book.id == Borrow.book_id)\
        .group_by(Book.id)\
        .order_by(func.count(Borrow.id).desc())\
        .limit(5).all()
    
    # 2. Genre Popularity
    genre_popularity = db.query(Book.genre, func.count(Borrow.id).label('count'))\
        .join(Borrow, Book.id == Borrow.book_id)\
        .group_by(Book.genre)\
        .all()
        
    # 3. Monthly Activity (Mocked for simplicity if dates imply short range, else aggreg)
    # Group by date (YYYY-MM-DD)
    daily_activity = db.query(func.date(Borrow.borrow_date).label('date'), func.count(Borrow.id).label('count'))\
        .group_by(func.date(Borrow.borrow_date))\
        .order_by(func.date(Borrow.borrow_date))\
        .limit(30).all()
        
    return {
        "most_borrowed": [{"name": title, "value": count} for title, count in most_borrowed],
        "genre_popularity": [{"name": genre, "value": count} for genre, count in genre_popularity],
        "daily_activity": [{"date": str(date), "count": count} for date, count in daily_activity],
        "summary": _generate_ai_summary(most_borrowed, genre_popularity)
    }

def _generate_ai_summary(most_borrowed, genre_popularity):
    # Mock AI summary logic
    top_book = most_borrowed[0][0] if most_borrowed else "None"
    top_genre = max(genre_popularity, key=lambda x: x[1])[0] if genre_popularity else "None"
    return f"Based on current trends, '{top_book}' is the most popular title. '{top_genre}' remains the preferred genre among readers. Consider restocking popular titles in this category."
