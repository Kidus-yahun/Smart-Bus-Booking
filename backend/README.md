# SmartBus Ethiopia Backend

FastAPI backend for the Ethiopian SmartBus booking system.

## Prerequisites

- Python 3.14+
- uv (Python package manager)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies with uv:
```bash
uv sync
```

3. Copy the environment file:
```bash
cp .env.example .env
```

4. Create the database tables:
```bash
uv run python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
```

5. Seed initial data (optional - creates stations, routes, buses, demo users):
```bash
uv run python -m app.seed_data
```

## Running

Start the development server:
```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 7077
```

The API will be available at http://localhost:7077

API documentation: http://localhost:7077/api/docs

## Database

The database file is stored at `../db/smartbus.db` (relative to backend folder).

To change the location, update the `DATABASE_URL` in `.env`.

## Migrations

This project uses Alembic for database migrations.

Create a new migration:
```bash
uv run alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
uv run alembic upgrade head
```

## Testing Credentials

After running seed_data:

- Admin: admin@smartbus.et / admin123
- Demo: demo@smartbus.com / demo123

## Project Structure

```
backend/
├── app/
│   ├── main.py          # FastAPI application
│   ├── database.py     # Database configuration
│   ├── models.py       # SQLAlchemy models
│   ├── schemas.py      # Pydantic schemas
│   ├── auth.py        # Authentication
│   ├── seed_data.py   # Database seeding
│   └── routers/       # API endpoints
├── migrations/        # Alembic migrations
├── pyproject.toml    # uv project config
├── alembic.ini      # Alembic config
└── .env          # Environment variables
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login
- GET /api/auth/me - Get current user
- POST /api/auth/refresh - Refresh token

### Buses
- GET /api/buses/stations - List stations
- GET /api/buses/routes - List routes
- GET /api/buses/schedules/upcoming - Upcoming schedules

### Tickets
- POST /api/tickets/book - Book ticket
- GET /api/tickets/my-tickets - User tickets