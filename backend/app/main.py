from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, books, operations, ai

app = FastAPI(title="AI Library System", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"], # Frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(books.router)
app.include_router(operations.router)
app.include_router(ai.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI-Powered Library Management System"}
