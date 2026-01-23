import sys
import os
# Add the parent directory (backend) to sys.path to allow imports from 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import engine, Base
from app.models import user, book, operations

# Create tables
Base.metadata.create_all(bind=engine)
print("Database initialized successfully.")
