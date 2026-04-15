# Backend

FastAPI backend for SmartBus.

## Setup

```bash
cd backend

# Install dependencies
uv sync

# Reset DB
rm -f ../db/smartbus.db

# Migrate
uv run alembic upgrade head

# Seed data
uv run python -c "from app.seed_data import create_ethiopian_bus_data; create_ethiopian_bus_data()"
```

## Run

```bash
uv run uvicorn app.main:app --port 7077
```

API docs: http://localhost:7077/api/docs

## Migration

```bash
uv run alembic revision --autogenerate -m "description"
uv run alembic upgrade head
```