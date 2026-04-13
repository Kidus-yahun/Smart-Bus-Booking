# Smart Bus Booking App

A modern, mobile-first bus booking application with real-time arrivals, interactive maps, and seamless ticket purchasing.

## Features

- 🗺️ **Interactive Map View** - Toggle between mock map and real OpenStreetMap integration
- 🚌 **Real-time Bus Arrivals** - Live updates with occupancy indicators and accessibility info
- 🎫 **Ticket Booking** - Complete booking flow with multiple fare types
- 🌙 **Dark/Light Mode** - User preference toggle
- 📱 **Mobile-Optimized** - Responsive design for all screen sizes
- ♿ **Accessible** - Designed for users of all ages and abilities
- 🔐 **Authentication** - Secure login and user management

## OpenStreetMap Integration

This app uses **OpenStreetMap** - a free, open-source mapping solution with no API keys required!

### Features

- **100% Free** - No API keys or billing required
- **Open Source** - Community-driven mapping data
- **Real map data** with detailed street information
- **Custom markers** for bus stations and user location
- **Interactive popups** with station information
- **Responsive design** optimized for mobile devices
- **Dark mode support** with automatic theme adjustment

### Map Features

- **Real street/satellite view** with detailed mapping
- **User location detection** with custom blue marker
- **Interactive bus station markers** with popup information
- **Zoom controls** and map navigation
- **Real-time positioning** and accurate distances
- **Custom styling** that matches your app theme

### No Setup Required

Unlike Google Maps, OpenStreetMap requires no configuration:
- No API keys needed
- No billing or usage limits
- Works immediately out of the box
- Privacy-friendly (no tracking)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

If you are in the **parent folder** (project root) instead of `src`, use `npm run setup` then `npm run dev`, or see the root `README.md`.

The app will open at `http://localhost:3000` with full mapping functionality ready to use!

## Technology Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS v4** - Utility-first styling
- **Shadcn/UI** - Accessible component library
- **Lucide React** - Beautiful icons
- **React Leaflet** - OpenStreetMap integration
- **Leaflet** - Interactive mapping library

## Mock Data

The app uses realistic mock data for:
- Bus arrival times and routes
- Station locations (San Francisco area coordinates)
- Bus occupancy levels
- Ticket booking flow

## Browser Support

- Modern browsers with JavaScript enabled
- Geolocation API support for user positioning
- LocalStorage for theme preferences

## Backend Integration

The app includes a complete Python backend with FastAPI:
- **User Authentication** - JWT-based secure login
- **Real-time Bus Tracking** - Live location updates
- **Ticket Booking** - Complete booking and payment flow
- **PostgreSQL Database** - Robust data persistence
- **Docker Support** - Easy deployment

See the `/backend` directory for setup instructions.

## Security & Privacy

- **No external API keys** required for mapping
- **Privacy-friendly** - OpenStreetMap doesn't track users
- **Secure authentication** with JWT tokens
- **Data encryption** for sensitive information
- **HTTPS recommended** for production deployments