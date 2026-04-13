from pydantic import BaseModel, EmailStr, validator
from datetime import datetime
from typing import Optional, List
from .models import UserRole, BusStatus, TicketStatus, PaymentStatus, FareType

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: str
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class UserProfile(User):
    total_trips: Optional[int] = 0
    last_trip_date: Optional[datetime] = None

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

# Bus Station schemas
class BusStationBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    city: str = "Addis Ababa"
    region: str = "Addis Ababa"
    facilities: Optional[str] = None

class BusStationCreate(BusStationBase):
    pass

class BusStation(BusStationBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Bus Route schemas
class BusRouteBase(BaseModel):
    route_number: str
    route_name: str
    origin_station_id: int
    destination_station_id: int
    distance_km: float
    estimated_duration_minutes: int

class BusRouteCreate(BusRouteBase):
    pass

class BusRoute(BusRouteBase):
    id: int
    is_active: bool
    created_at: datetime
    origin_station: Optional[BusStation] = None
    destination_station: Optional[BusStation] = None

    class Config:
        from_attributes = True

# Bus schemas
class BusBase(BaseModel):
    bus_number: str
    license_plate: str
    route_id: int
    capacity: int
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None

class BusCreate(BusBase):
    pass

class BusUpdate(BaseModel):
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    status: Optional[BusStatus] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None

class Bus(BusBase):
    id: int
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    status: BusStatus
    last_updated: datetime
    created_at: datetime
    route: Optional[BusRoute] = None

    class Config:
        from_attributes = True

# Bus Schedule schemas
class BusScheduleBase(BaseModel):
    bus_id: int
    departure_time: datetime
    estimated_arrival_time: datetime

class BusScheduleCreate(BusScheduleBase):
    pass

class BusScheduleUpdate(BaseModel):
    actual_departure_time: Optional[datetime] = None
    actual_arrival_time: Optional[datetime] = None
    current_occupancy: Optional[int] = None
    delay_minutes: Optional[int] = None
    is_cancelled: Optional[bool] = None

class BusSchedule(BusScheduleBase):
    id: int
    actual_departure_time: Optional[datetime] = None
    actual_arrival_time: Optional[datetime] = None
    current_occupancy: int
    is_cancelled: bool
    delay_minutes: int
    created_at: datetime
    bus: Optional[Bus] = None

    class Config:
        from_attributes = True

# Arrival information for frontend
class BusArrival(BaseModel):
    id: str
    route_number: str
    destination: str
    arrival_time: str
    minutes_away: int
    occupancy: str  # "low", "medium", "high"
    accessible: bool
    bus_id: int
    schedule_id: int

# Ticket schemas
class TicketBase(BaseModel):
    schedule_id: int
    fare_type: FareType
    quantity: int = 1
    boarding_station_id: int
    destination_station_id: int

class TicketCreate(TicketBase):
    pass

class Ticket(TicketBase):
    id: int
    ticket_number: str
    user_id: int
    total_price_etb: float
    booking_time: datetime
    travel_date: datetime
    status: TicketStatus
    qr_code: Optional[str] = None

    class Config:
        from_attributes = True

class TicketDetail(Ticket):
    user: Optional[User] = None
    schedule: Optional[BusSchedule] = None
    payment: Optional['Payment'] = None

# Payment schemas
class PaymentBase(BaseModel):
    payment_method: str
    amount_etb: float

class PaymentCreate(PaymentBase):
    ticket_id: int

class Payment(PaymentBase):
    id: int
    ticket_id: int
    payment_reference: str
    status: PaymentStatus
    processed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Map data schemas
class MapStation(BaseModel):
    id: str
    name: str
    distance: str
    lat: float
    lng: float
    active_buses: int

class MapResponse(BaseModel):
    stations: List[MapStation]
    user_location: Optional[dict] = None

# Fare pricing
class FarePriceBase(BaseModel):
    route_id: int
    fare_type: FareType
    price_etb: float

class FarePriceCreate(FarePriceBase):
    pass

class FarePrice(FarePriceBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Route stop schemas
class RouteStopBase(BaseModel):
    route_id: int
    station_id: int
    stop_order: int
    estimated_arrival_minutes: int
    fare_from_origin_etb: float

class RouteStopCreate(RouteStopBase):
    pass

class RouteStop(RouteStopBase):
    id: int
    station: Optional[BusStation] = None

    class Config:
        from_attributes = True

# Statistics and analytics
class DashboardStats(BaseModel):
    total_users: int
    active_buses: int
    total_routes: int
    daily_tickets: int
    daily_revenue_etb: float
    popular_routes: List[dict]

# Seat schemas
class SeatBase(BaseModel):
    seat_number: str
    row_number: int
    seat_position: str
    is_available: bool = True

class SeatCreate(SeatBase):
    bus_id: int

class Seat(SeatBase):
    id: int
    bus_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SeatAvailability(BaseModel):
    seat_id: int
    seat_number: str
    row_number: int
    seat_position: str
    status: str  # "available", "occupied", "reserved", "selected"

class SeatLayout(BaseModel):
    bus_id: int
    total_seats: int
    rows: int
    seats_per_row: int
    seats: List[SeatAvailability]

# Seat reservation schemas
class SeatReservationBase(BaseModel):
    seat_id: int
    schedule_id: int

class SeatReservationCreate(SeatReservationBase):
    pass

class SeatReservation(SeatReservationBase):
    id: int
    ticket_id: Optional[int] = None
    status: str
    reserved_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Updated ticket schemas to include seats
class TicketCreateWithSeats(TicketBase):
    selected_seat_ids: List[int]

# Error response
class ErrorResponse(BaseModel):
    detail: str
    error_code: Optional[str] = None