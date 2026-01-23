from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    author = Column(String, index=True, nullable=False)
    isbn = Column(String, unique=True, index=True)
    genre = Column(String, index=True)
    quantity = Column(Integer, default=1)
    cover_image = Column(String, nullable=True)
    description = Column(String, nullable=True)
    published_date = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
