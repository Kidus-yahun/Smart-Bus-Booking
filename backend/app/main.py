from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
from .database import engine, get_db
from .models import Base
from .routers import auth, buses, tickets, demo
from .auth import get_current_user
import os
from dotenv import load_dotenv

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartBus Ethiopia API",
    description="Ethiopian Bus Booking System API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(buses.router, prefix="/api/buses", tags=["Buses"])
app.include_router(tickets.router, prefix="/api/tickets", tags=["Tickets"])
app.include_router(demo.router, prefix="/api", tags=["Realtime Demo"])


@app.get("/")
async def root():
    return {
        "message": "Welcome to SmartBus Ethiopia API",
        "version": "1.0.0",
        "country": "Ethiopia",
        "city": "Addis Ababa",
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "SmartBus Ethiopia"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app", host="0.0.0.0", port=int(os.getenv("PORT", 7077)), reload=True
    )
