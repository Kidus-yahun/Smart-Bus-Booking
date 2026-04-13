import os
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()

# Database URL - SQLite only
db_path = os.getenv("DATABASE_URL", "")

if not db_path:
    raise ValueError(
        "DATABASE_URL environment variable is not set. Please set it in .env"
    )

# Handle both file path and directory path
db_path = Path(db_path)
if db_path.is_dir():
    db_path = db_path / "smartbus.db"
else:
    # Ensure parent directory exists
    db_dir = db_path.parent
    if not db_dir.exists():
        db_dir.mkdir(parents=True, exist_ok=True)

DATABASE_URL = f"sqlite:///{db_path}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
