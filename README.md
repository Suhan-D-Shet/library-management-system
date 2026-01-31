# AI-Powered Personalized Library Management System

## Overview
This is a full-stack, AI-powered Library Management System designed for an internship evaluation. It features Role-Based Access Control (Admin/Reader), a "Library Books Manager" dashboard for Admins with advanced analytics, Guest Borrowing capabilities, and an AI module for personalized recommendations.

## Tech Stack
### Backend
- **Framework**: Python (FastAPI)
- **Database**: SQLite (Local Dev) / PostgreSQL (Production)
- **AI/ML**: Scikit-Learn, Pandas
- **Authentication**: JWT (JSON Web Tokens)

### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS
- **Visualization**: Recharts
- **Icons**: Lucide React

## Prerequisites
- Python 3.9+
- pip

## Project Setup & Running

### 1. Setup Virtual Environment (Optional but Recommended)
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r backend/requirements.txt
```

### 3. Initialize Database
Navigate to the backend folder:
```bash
cd backend
python -m app.init_db
# (Optional) Seed the database with default users
python -m app.seed
```

### 4. Admin & User Credentials
If you ran the seed script, the following users are available:

| Role      | Username             | Email               | Password   |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin_user`         | `admin@library.com` | `admin123` |
| **Reader** | `reading_enthusiast` | `reader@library.com` | `reader123` |

### 5. Run the Backend Server
```bash
# Run from the backend directory
# (Ensure you are in /backend)
python -m uvicorn app.main:app --reload --port 8000
```
The API will be available at: [http://localhost:8000](http://localhost:8000)
Interactive Docs (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)

### 6. Run the Frontend
1. Open a new terminal.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at: [http://localhost:5173](http://localhost:5173)

## Testing the System
We have provided automated scripts to verify the core functionalities. Ensure the server is running before executing these.

### 1. Test Authentication
Registers a user and logs them in.
```bash
python backend/test_auth.py
```

### 2. Test Book Management (CRUD)
tests creating, listing, updating, and deleting books.
```bash
python backend/test_books.py
```

### 3. Test Operations (Borrow/Return/Rate)
Tests the full flow of a user borrowing a book, rating it, and returning it.
```bash
python backend/test_operations.py
```

## API Documentation & Testing
The system provides interactive API documentation via Swagger UI.
1. Start the backend server: `python -m uvicorn app.main:app --reload --port 8000`
2. Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.
3. Authenticate:
   - Click the "Authorize" button.
   - Enter `reading_enthusiast` / `reader123` (or admin credentials).
   - Click "Authorize" and then "Close".
4. You can now test any endpoint directly from the browser by expanding it and clicking "Try it out".

## AI & Advanced Features
The system includes:
- **Personalized Recommendations**: `/ai/recommendations` (Content-based filtering)
- **Advanced Admin Analytics**:
    - **Interactive Dashboard**: Visualizes "Most Borrowed Books", "Genre Popularity", and "Activity Trends".
    - **AI Insight Summary**: Generates text summaries of library performance.
- **Guest Management**: Admins can issue books to non-registered guests (capturing Name, Email, Phone).
- **Reader Clustering**: `/ai/analytics/behavior` (K-Means User Segmentation)
- **Demand Prediction**: `/ai/analytics/demand` (Linear Regression)

## Project Structure
```
/backend
    /app
        /core       # Security & Config
        /models     # Database Models
        /routers    # API Endpoints
        /schemas    # Pydantic Schemas
    /ai_models      # ML Logic
    requirements.txt
```
