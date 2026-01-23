from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models.user import User
from app.core.security import get_password_hash

def seed_users():
    db = SessionLocal()
    
    # 1. Create Admin
    admin_email = "admin@library.com"
    admin = db.query(User).filter(User.email == admin_email).first()
    if not admin:
        print(f"Creating Admin: {admin_email}")
        admin = User(
            email=admin_email,
            username="admin_user",
            hashed_password=get_password_hash("admin123"),
            role="admin",
            is_active=True
        )
        db.add(admin)
    else:
        print(f"Admin already exists: {admin_email}")

    # 2. Create Reader
    reader_email = "reader@library.com"
    reader = db.query(User).filter(User.email == reader_email).first()
    if not reader:
        print(f"Creating Reader: {reader_email}")
        reader = User(
            email=reader_email,
            username="reading_enthusiast",
            hashed_password=get_password_hash("reader123"),
            role="reader",
            is_active=True
        )
        db.add(reader)
    else:
        print(f"Reader already exists: {reader_email}")

    db.commit()

    # 3. Create Books
    from app.models.book import Book
    books = [
        {
            "title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "genre": "Classic", "quantity": 5,
            "cover_image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
            "description": "A novel set in the Jazz Age that tells the story of Jay Gatsby's unrequited love for Daisy Buchanan.",
            "published_date": "1925-04-10"
        },
        {
            "title": "1984", "author": "George Orwell", "genre": "Dystopian", "quantity": 3,
            "cover_image": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&q=80&w=400",
            "description": "A dystopian social science fiction novel that examines the dangers of totalitarianism.",
            "published_date": "1949-06-08"
        },
        {
            "title": "Python Crash Course", "author": "Eric Matthes", "genre": "Technology", "quantity": 10,
            "cover_image": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400",
            "description": "A hands-on, project-based introduction to programming with Python.",
            "published_date": "2015-11-01"
        },
        {
            "title": "Clean Code", "author": "Robert C. Martin", "genre": "Technology", "quantity": 4,
            "cover_image": "https://images.unsplash.com/photo-1532615389554-0f5cf355523b?auto=format&fit=crop&q=80&w=400",
            "description": "A handbook of agile software craftsmanship.",
            "published_date": "2008-08-01"
        },
        {
            "title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "quantity": 7,
            "cover_image": "https://images.unsplash.com/photo-1629992555651-99784e667b34?auto=format&fit=crop&q=80&w=400",
            "description": "A fantasy novel about the quest of home-loving hobbit Bilbo Baggins.",
            "published_date": "1937-09-21"
        },
        {
            "title": "Dune", "author": "Frank Herbert", "genre": "Sci-Fi", "quantity": 6,
            "cover_image": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=400",
            "description": "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.",
            "published_date": "1965-08-01"
        },
        {
            "title": "Introduction to Algorithms", "author": "Thomas H. Cormen", "genre": "Technology", "quantity": 2,
            "cover_image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=400",
            "description": "A comprehensive textbook that covers a broad range of algorithms in depth.",
            "published_date": "1990-01-01"
        },
        {
            "title": "Pride and Prejudice", "author": "Jane Austen", "genre": "Classic", "quantity": 4,
            "cover_image": "https://images.unsplash.com/photo-1592496431122-2349e0fbc666?auto=format&fit=crop&q=80&w=400",
            "description": "A romantic novel of manners written by Jane Austen.",
            "published_date": "1813-01-28"
        },
        {
            "title": "The Catcher in the Rye", "author": "J.D. Salinger", "genre": "Classic", "quantity": 5,
            "cover_image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=400",
            "description": "A story about a few days in the life of sixteen-year-old Holden Caulfield.",
            "published_date": "1951-07-16"
        },
        {
            "title": "The Pragmatic Programmer", "author": "Andrew Hunt", "genre": "Technology", "quantity": 6,
            "cover_image": "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400",
            "description": "Journeyman to master: logical and practical advice for software development.",
            "published_date": "1999-10-20"
        },
    ]

    for book_data in books:
        existing_book = db.query(Book).filter(Book.title == book_data["title"]).first()
        if not existing_book:
            print(f"Adding Book: {book_data['title']}")
            new_book = Book(**book_data)
            db.add(new_book)
        else:
             print(f"Book already exists: {book_data['title']}")

    db.commit()
    db.close()

if __name__ == "__main__":
    seed_users()
