"""
FastAPI Backend
Main application entry point
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="App Scaffold API",
    description="Production-ready FastAPI backend for mobile apps",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "http://localhost:8081,http://localhost:19006").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {"message": "App Scaffold API", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "app-scaffold-api",
        "version": "1.0.0",
    }

# Example API endpoints
@app.get("/api/v1/test")
async def test_endpoint():
    return {"message": "API is working!"}

# Include routers when you create them
# from app.api import users, auth
# app.include_router(users.router, prefix="/api/v1", tags=["users"])
# app.include_router(auth.router, prefix="/api/v1", tags=["auth"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
