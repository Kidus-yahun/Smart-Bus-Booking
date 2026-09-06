import enum

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .database import Base


class UserRole(str, enum.Enum):
    PASSENGER = 'passenger'
    DRIVER = 'driver'
    ADMIN = 'admin'


class BusStatus(str, enum.Enum):
    ACTIVE = 'active'
    INACTIVE = 'inactive'
    MAINTENANCE = 'maintenance'


class TicketStatus(str, enum.Enum):
    PENDING = 'pending'
    CONFIRMED = 'confirmed'
    CANCELLED = 'cancelled'
    USED = 'used'


class PaymentStatus(str, enum.Enum):
    PENDING = 'pending'
    COMPLETED = 'completed'
    FAILED = 'failed'
    REFUNDED = 'refunded'


class FareType(str, enum.Enum):
    ADULT = 'adult'
    SENIOR = 'senior'
    STUDENT = 'student'
    CHILD = 'child'
    STANDING = 'standing'


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String)
    password_hash = Column(String)
    phone = Column(String, nullable=True)
    role = Column(Enum(UserRole), default=UserRole.PASSENGER)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    tickets = relationship('Ticket', back_populates='user')


class BusRoute(Base):
    __tablename__ = 'bus_routes'

    id = Column(Integer, primary_key=True, index=True)
    route_number = Column(String, unique=True, index=True)  # e.g., "AA-01"
    route_name = Column(String)  # e.g., "Meskel Square to Bole Airport"
    origin_station_id = Column(Integer, ForeignKey('bus_stations.id'))
    destination_station_id = Column(Integer, ForeignKey('bus_stations.id'))
    distance_km = Column(Float)
    estimated_duration_minutes = Column(Integer)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    origin_station = relationship(
        'BusStation', foreign_keys=[origin_station_id], back_populates='outgoing_routes'
    )
    destination_station = relationship(
        'BusStation',
        foreign_keys=[destination_station_id],
        back_populates='incoming_routes',
    )
    buses = relationship('Bus', back_populates='route')
    route_stops = relationship('RouteStop', back_populates='route')


class BusStation(Base):
    __tablename__ = 'bus_stations'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    address = Column(Text)
    latitude = Column(Float)
    longitude = Column(Float)
    city = Column(String, default='Addis Ababa')
    region = Column(String, default='Addis Ababa')
    is_active = Column(Boolean, default=True)
    facilities = Column(Text, nullable=True)  # JSON string of facilities
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    outgoing_routes = relationship(
        'BusRoute',
        foreign_keys='BusRoute.origin_station_id',
        back_populates='origin_station',
    )
    incoming_routes = relationship(
        'BusRoute',
        foreign_keys='BusRoute.destination_station_id',
        back_populates='destination_station',
    )
    route_stops = relationship('RouteStop', back_populates='station')


class RouteStop(Base):
    __tablename__ = 'route_stops'

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey('bus_routes.id'))
    station_id = Column(Integer, ForeignKey('bus_stations.id'))
    stop_order = Column(Integer)  # Order of this stop in the route
    estimated_arrival_minutes = Column(Integer)  # Minutes from route start
    fare_from_origin_etb = Column(Float)  # Fare in Ethiopian Birr from origin

    # Relationships
    route = relationship('BusRoute', back_populates='route_stops')
    station = relationship('BusStation', back_populates='route_stops')


class Bus(Base):
    __tablename__ = 'buses'

    id = Column(Integer, primary_key=True, index=True)
    bus_number = Column(String, unique=True, index=True)
    license_plate = Column(String, unique=True)
    route_id = Column(Integer, ForeignKey('bus_routes.id'))
    capacity = Column(Integer)
    current_latitude = Column(Float, nullable=True)
    current_longitude = Column(Float, nullable=True)
    status = Column(Enum(BusStatus), default=BusStatus.ACTIVE)
    driver_name = Column(String, nullable=True)
    driver_phone = Column(String, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    route = relationship('BusRoute', back_populates='buses')
    schedules = relationship('BusSchedule', back_populates='bus')
    seats = relationship('Seat', back_populates='bus')


class BusSchedule(Base):
    __tablename__ = 'bus_schedules'

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey('buses.id'))
    departure_time = Column(DateTime(timezone=True))
    estimated_arrival_time = Column(DateTime(timezone=True))
    actual_departure_time = Column(DateTime(timezone=True), nullable=True)
    actual_arrival_time = Column(DateTime(timezone=True), nullable=True)
    current_occupancy = Column(Integer, default=0)
    is_cancelled = Column(Boolean, default=False)
    delay_minutes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bus = relationship('Bus', back_populates='schedules')
    tickets = relationship('Ticket', back_populates='schedule')


class FarePrice(Base):
    __tablename__ = 'fare_prices'

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey('bus_routes.id'))
    fare_type = Column(Enum(FareType))
    price_etb = Column(Float)  # Price in Ethiopian Birr
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Seat(Base):
    __tablename__ = 'seats'

    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(Integer, ForeignKey('buses.id'))
    seat_number = Column(String)  # e.g., "1A", "1B", "2C", "2D"
    row_number = Column(Integer)
    seat_position = Column(String)  # "A", "B", "C", "D" (A,B = left, C,D = right)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    bus = relationship('Bus', back_populates='seats')
    seat_reservations = relationship('SeatReservation', back_populates='seat')


class SeatReservation(Base):
    __tablename__ = 'seat_reservations'

    id = Column(Integer, primary_key=True, index=True)
    seat_id = Column(Integer, ForeignKey('seats.id'))
    ticket_id = Column(Integer, ForeignKey('tickets.id'))
    schedule_id = Column(Integer, ForeignKey('bus_schedules.id'))
    status = Column(String, default='reserved')  # "reserved", "confirmed", "cancelled"
    reserved_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))  # Temporary reservations expire

    # Relationships
    seat = relationship('Seat', back_populates='seat_reservations')
    ticket = relationship('Ticket', back_populates='seat_reservations')
    schedule = relationship('BusSchedule')


class Ticket(Base):
    __tablename__ = 'tickets'

    id = Column(Integer, primary_key=True, index=True)
    ticket_number = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    schedule_id = Column(Integer, ForeignKey('bus_schedules.id'))
    fare_type = Column(Enum(FareType))
    quantity = Column(Integer, default=1)
    total_price_etb = Column(Float)
    booking_time = Column(DateTime(timezone=True), server_default=func.now())
    travel_date = Column(DateTime(timezone=True))
    status = Column(Enum(TicketStatus), default=TicketStatus.PENDING)
    qr_code = Column(String, nullable=True)
    boarding_station_id = Column(Integer, ForeignKey('bus_stations.id'))
    destination_station_id = Column(Integer, ForeignKey('bus_stations.id'))

    # Relationships
    user = relationship('User', back_populates='tickets')
    schedule = relationship('BusSchedule', back_populates='tickets')
    payment = relationship('Payment', back_populates='ticket', uselist=False)
    seat_reservations = relationship('SeatReservation', back_populates='ticket')


class Payment(Base):
    __tablename__ = 'payments'

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey('tickets.id'))
    amount_etb = Column(Float)
    payment_method = Column(String)  # "mobile_money", "credit_card", "cbe_birr"
    payment_reference = Column(String, unique=True)
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    ticket = relationship('Ticket', back_populates='payment')
