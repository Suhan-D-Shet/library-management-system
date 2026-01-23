from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BorrowBase(BaseModel):
    book_id: int

class BorrowCreate(BorrowBase):
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None

class BorrowResponse(BorrowBase):
    id: int
    user_id: int
    borrow_date: datetime
    due_date: datetime
    return_date: Optional[datetime] = None
    status: str
    guest_name: Optional[str] = None
    guest_email: Optional[str] = None
    guest_phone: Optional[str] = None

    class Config:
        from_attributes = True

class RatingBase(BaseModel):
    book_id: int
    rating: int
    comment: Optional[str] = None

class RatingCreate(RatingBase):
    pass

class RatingResponse(RatingBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
