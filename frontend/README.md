# SmartBus Ethiopia Frontend

React frontend for the SmartBus booking system.

## Prerequisites

- Node.js 18+
- npm

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional - defaults to localhost:7077):
```bash
echo "VITE_API_URL=http://localhost:7077" > .env
```

## Running

Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3000

## Building

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── lib/            # API utilities
│   ├── contexts/       # React contexts (Auth, Theme)
│   ├── components/     # React components
│   └── styles/        # CSS styles
├── package.json
├── vite.config.ts
└── index.html
```

## API Configuration

The frontend connects to the backend API. Configure the URL in `.env`:

```
VITE_API_URL=http://localhost:7077
```

## Dependencies

- React 18
- TanStack Query (data fetching)
- Tailwind CSS (styling)
- Radix UI (component library)
- Lucide React (icons)