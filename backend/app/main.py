from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, books, operations, ai

import os

app = FastAPI(title="AI Library System", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add production frontend URL
if os.getenv("FRONTEND_URL"):
    origins.append(os.getenv("FRONTEND_URL"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
