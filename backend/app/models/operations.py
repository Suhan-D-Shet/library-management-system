from sqlalchemy import Column, Integer, ForeignKey, Date, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from app.database import Base

class Borrow(Base):
    __tablename__ = "borrows"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # Nullable for guests
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    borrow_date = Column(DateTime, default=datetime.utcnow)
    due_date = Column(DateTime, default=lambda: datetime.utcnow() + timedelta(days=14))
    return_date = Column(DateTime, nullable=True)
    status = Column(String, default="borrowed") # borrowed, return_requested, returned
    
    # Guest Details
    guest_name = Column(String, nullable=True)
    guest_email = Column(String, nullable=True)
    guest_phone = Column(String, nullable=True)

    user = relationship("User")
    book = relationship("Book")

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    rating = Column(Integer, nullable=False) # 1-5
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
    book = relationship("Book")
