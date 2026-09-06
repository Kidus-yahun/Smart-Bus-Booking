# Walkthrough - SmartBus Flutter Mobile Application

We have implemented the full Flutter mobile application under `smartbus_mobile/`, replicating all features, styles, dynamic translations (Amharic & English), seat maps, ticket QR code rendering, and API communication with the FastAPI backend (`http://localhost:7077/api`).

## Changes Made

### 1. Flutter Project Architecture (`smartbus_mobile/`)
- **[pubspec.yaml](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/pubspec.yaml)**: Configured Flutter dependencies including `provider`, `http`, `qr_flutter`, `intl`, `shared_preferences`, `flutter_localizations`.
- **[main.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/main.dart)**: Initialized multi-provider architecture (`AuthProvider`, `LanguageProvider`, `ThemeProvider`), top header with quick language switcher (`🌐 አማርኛ` / `English`), and bottom navigation (`Book`, `Trips`, `Settings`).

### 2. Data Models & API Services
- **[api_service.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/data/services/api_service.dart)**: REST API service connecting to FastAPI backend endpoints (`/auth/login`, `/buses/upcoming-arrivals`, `/buses/stations`, `/buses/{id}/seats`, `/tickets/book`, `/tickets/my-tickets`) with automatic demo fallbacks.
- **Data Models**: Created clean Dart models for `UserModel`, `BusArrivalModel`, `StationModel`, `SeatModel`, and `TicketModel`.

### 3. UI Features & Amharic Localization
- **[translations.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/ui/core/translations.dart)**: Full Amharic translation dictionary (`አማርኛ`) matching all UI labels, station names (*መስቀል አደባባይ, ቦሌ ኤርፖርት, መርካቶ, ፒያሳ, አዲስ አበባ*), bus statuses, seat categories, and fare prices (`ETB` $\rightarrow$ `ብር`).
- **[home_screen.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/ui/features/home/home_screen.dart)**: Live bus arrivals list, greeting banner, and bus map status card.
- **[seat_selection_screen.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/ui/features/booking/seat_selection_screen.dart)**: Interactive 4-column seat map grid with real-time seat status toggling.
- **[ticket_confirmation_screen.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/ui/features/confirmation/ticket_confirmation_screen.dart)**: Digital ticket card featuring QR code rendering via `qr_flutter`.
- **[my_trips_screen.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/ui/features/trips/my_trips_screen.dart)**: Active & History trip tabs with QR codes.
- **[settings_screen.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/ui/features/settings/settings_screen.dart)** & **[profile_screen.dart](file:///c:/Users/Easy%20Tech/Downloads/Smart-Bus-Booking%20copy/smartbus_mobile/lib/ui/features/profile/profile_screen.dart)**: Settings, theme mode, and user profile views.

---

## How to Run the Flutter Mobile App

1. Ensure the FastAPI backend is running on port `7077`:
   ```powershell
   cd backend
   python -m uvicorn app.main:app --port 7077
   ```

2. Run the Flutter mobile app:
   ```powershell
   cd smartbus_mobile
   flutter pub get
   flutter run
   ```
