from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database import get_db
from app.models.operations import Borrow, Rating
from app.models.book import Book
from app.models.user import User
from app.schemas.operations import BorrowCreate, BorrowResponse, RatingCreate, RatingResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/operations", tags=["Operations"])

@router.post("/borrow", response_model=BorrowResponse)
def borrow_book(borrow: BorrowCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if book exists and available
    book = db.query(Book).filter(Book.id == borrow.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    if book.quantity < 1:
        raise HTTPException(status_code=400, detail="Book is out of stock")
    
    user_id = current_user.id
    
    # Guest Borrowing Logic (Admin Only)
    if borrow.guest_name or borrow.guest_email:
        if current_user.role != "admin":
             raise HTTPException(status_code=403, detail="Only Admins can issue books to guests")
        user_id = None # Set user_id to None for guests
    else:
        # Regular User Borrowing
        # Check if user already borrowed this book and not returned
        active_borrow = db.query(Borrow).filter(
            Borrow.user_id == current_user.id,
            Borrow.book_id == borrow.book_id,
            Borrow.status == "borrowed"
        ).first()
        if active_borrow:
            raise HTTPException(status_code=400, detail="You have already borrowed this book")

    # Create borrow record
    new_borrow = Borrow(
        user_id=user_id, 
        book_id=borrow.book_id,
        guest_name=borrow.guest_name,
        guest_email=borrow.guest_email,
        guest_phone=borrow.guest_phone
    )
    book.quantity -= 1 # Decrease stock
    
    db.add(new_borrow)
    db.commit()
    db.refresh(new_borrow)
    return new_borrow

@router.post("/return/{borrow_id}", response_model=BorrowResponse)
@router.post("/return/{borrow_id}", response_model=BorrowResponse)
def return_book(borrow_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Borrow).filter(Borrow.id == borrow_id)
    if current_user.role != "admin":
        query = query.filter(Borrow.user_id == current_user.id)
        
    borrow_record = query.first()
    if not borrow_record:
        raise HTTPException(status_code=404, detail="Borrow record not found")
    
    if borrow_record.status == "returned":
        raise HTTPException(status_code=400, detail="Book already returned")
    
    borrow_record.return_date = datetime.utcnow()
    borrow_record.status = "returned"
    
    # Increase stock
    book = db.query(Book).filter(Book.id == borrow_record.book_id).first()
    book.quantity += 1
    
    db.commit()
    db.refresh(borrow_record)
    return borrow_record

@router.post("/rate", response_model=RatingResponse)
def rate_book(rating: RatingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # User can rate only if they have borrowed the book (optional rule, but good for logic)
    # For now, let's just allow it if book exists
    book = db.query(Book).filter(Book.id == rating.book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    
    new_rating = Rating(user_id=current_user.id, **rating.dict())
    db.add(new_rating)
    db.commit()
    db.refresh(new_rating)
    return new_rating

@router.get("/history", response_model=List[BorrowResponse])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    history = db.query(Borrow).filter(Borrow.user_id == current_user.id).all()
    return history

@router.get("/all", response_model=List[BorrowResponse])
def get_all_borrows(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Return all borrows, ideally ordered by status or date
    # Prioritize return_requested
    all_borrows = db.query(Borrow).order_by(Borrow.status.desc(), Borrow.borrow_date.desc()).all()
    return all_borrows
