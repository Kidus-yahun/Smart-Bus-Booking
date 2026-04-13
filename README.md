# SmartBus Ethiopia

A full-stack bus booking application for Addis Ababa, Ethiopia.

## Overview

SmartBus Ethiopia is a application that allows passengers to:
- View real-time bus stations and routes
- Book bus tickets with seats & standing options
- Display full Amharic translations (`አማርኛ`)
- View booking history & digital QR tickets
- Native Flutter mobile application included under `smartbus_mobile/`

## Tech Stack

### Backend
- Python 3.14
- FastAPI
- SQLAlchemy & SQLite
- Alembic (migrations)
- JWT Authentication

### Frontend
- React 18 & TypeScript
- TanStack Query
- Tailwind CSS & Framer Motion
- Amharic i18n Localization

### Mobile
- Flutter (Dart)
- Mobile QR Generation & Map View

## Project Structure

```
Smart-Bus-Booking/
├── backend/          # FastAPI backend
├── frontend/         # React web app
├── smartbus_mobile/  # Flutter cross-platform mobile app
└── db/               # SQLite database
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
python -m uvicorn app.main:app --port 7077
```

API runs at http://localhost:7077/api/docs

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Web app runs at http://localhost:3000

### 3. Mobile Setup

```bash
cd smartbus_mobile
flutter pub get
flutter run
```

## Testing Credentials

- Admin: admin@smartbus.et / admin123
- Demo User: demo@smartbus.com / demo123

## License

MIT
