import math
import random
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_
from sqlalchemy.orm import Session, joinedload

from ..auth import require_role
from ..database import get_db
from ..models import (
    Bus,
    BusRoute,
    BusSchedule,
    BusStation,
    Seat,
    SeatReservation,
    User,
    UserRole,
)
from ..schemas import Bus as BusSchema
from ..schemas import (
    BusArrival,
    BusCreate,
    BusRouteCreate,
    BusScheduleCreate,
    BusScheduleUpdate,
    BusStationCreate,
    BusUpdate,
    MapResponse,
    MapStation,
    SeatAvailability,
    SeatLayout,
)
from ..schemas import BusRoute as BusRouteSchema
from ..schemas import BusSchedule as BusScheduleSchema
from ..schemas import BusStation as BusStationSchema
from ..schemas import Seat as SeatSchema

router = APIRouter()


# Helper function to calculate distance
def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points in kilometers."""
    R = 6371  # Earth's radius in kilometers

    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)

    a = math.sin(dlat / 2) * math.sin(dlat / 2) + math.cos(
        math.radians(lat1)
    ) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) * math.sin(dlon / 2)

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c

    return distance


@router.get('/stations', response_model=list[BusStationSchema])
async def get_bus_stations(
    city: str | None = 'Addis Ababa',
    active_only: bool = True,
    db: Session = Depends(get_db),
):
    """Get all bus stations."""
    query = db.query(BusStation)

    if city:
        query = query.filter(BusStation.city == city)

    if active_only:
        query = query.filter(BusStation.is_active)

    stations = query.all()
    return stations


@router.get('/stations/{station_id}', response_model=BusStationSchema)
async def get_bus_station(station_id: int, db: Session = Depends(get_db)):
    """Get specific bus station."""
    station = db.query(BusStation).filter(BusStation.id == station_id).first()
    if not station:
        raise HTTPException(status_code=404, detail='Station not found')
    return station


@router.post('/stations', response_model=BusStationSchema)
async def create_bus_station(
    station_data: BusStationCreate,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    """Create a new bus station (Admin only)."""
    db_station = BusStation(**station_data.dict())
    db.add(db_station)
    db.commit()
    db.refresh(db_station)
    return db_station


@router.get('/routes', response_model=list[BusRouteSchema])
async def get_bus_routes(active_only: bool = True, db: Session = Depends(get_db)):
    """Get all bus routes."""
    query = db.query(BusRoute).options(
        joinedload(BusRoute.origin_station), joinedload(BusRoute.destination_station)
    )

    if active_only:
        query = query.filter(BusRoute.is_active)

    routes = query.all()
    return routes


@router.get('/routes/{route_id}', response_model=BusRouteSchema)
async def get_bus_route(route_id: int, db: Session = Depends(get_db)):
    """Get specific bus route."""
    route = (
        db.query(BusRoute)
        .options(
            joinedload(BusRoute.origin_station),
            joinedload(BusRoute.destination_station),
        )
        .filter(BusRoute.id == route_id)
        .first()
    )

    if not route:
        raise HTTPException(status_code=404, detail='Route not found')
    return route


@router.post('/routes', response_model=BusRouteSchema)
async def create_bus_route(
    route_data: BusRouteCreate,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    """Create a new bus route (Admin only)."""
    # Verify stations exist
    origin = (
        db.query(BusStation)
        .filter(BusStation.id == route_data.origin_station_id)
        .first()
    )
    destination = (
        db.query(BusStation)
        .filter(BusStation.id == route_data.destination_station_id)
        .first()
    )

    if not origin or not destination:
        raise HTTPException(status_code=400, detail='Invalid station IDs')

    db_route = BusRoute(**route_data.dict())
    db.add(db_route)
    db.commit()
    db.refresh(db_route)
    return db_route


@router.get('/', response_model=list[BusSchema])
async def get_buses(
    route_id: int | None = None, active_only: bool = True, db: Session = Depends(get_db)
):
    """Get all buses."""
    query = db.query(Bus).options(joinedload(Bus.route))

    if route_id:
        query = query.filter(Bus.route_id == route_id)

    if active_only:
        query = query.filter(Bus.status == 'active')

    buses = query.all()
    return buses


@router.get('/{bus_id}', response_model=BusSchema)
async def get_bus(bus_id: int, db: Session = Depends(get_db)):
    """Get specific bus."""
    bus = db.query(Bus).options(joinedload(Bus.route)).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail='Bus not found')
    return bus


@router.post('/', response_model=BusSchema)
async def create_bus(
    bus_data: BusCreate,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    """Create a new bus (Admin only)."""
    # Verify route exists
    route = db.query(BusRoute).filter(BusRoute.id == bus_data.route_id).first()
    if not route:
        raise HTTPException(status_code=400, detail='Invalid route ID')

    db_bus = Bus(**bus_data.dict())
    db.add(db_bus)
    db.commit()
    db.refresh(db_bus)
    return db_bus


@router.put('/{bus_id}', response_model=BusSchema)
async def update_bus(
    bus_id: int,
    bus_data: BusUpdate,
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.DRIVER])),
    db: Session = Depends(get_db),
):
    """Update bus information."""
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail='Bus not found')

    # Update fields
    for field, value in bus_data.dict(exclude_unset=True).items():
        setattr(bus, field, value)

    bus.last_updated = datetime.utcnow()
    db.commit()
    db.refresh(bus)
    return bus


@router.get('/schedules/upcoming', response_model=list[BusArrival])
async def get_upcoming_arrivals(
    station_id: int | None = None,
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db),
):
    """Get upcoming bus arrivals for a station."""
    now = datetime.now()

    # Get schedules for the next few hours - simple query first
    schedules = (
        db.query(BusSchedule)
        .filter(
            BusSchedule.departure_time >= now,
            BusSchedule.departure_time <= now + timedelta(hours=4),
            BusSchedule.is_cancelled == False,
        )
        .order_by(BusSchedule.departure_time)
        .limit(limit)
        .all()
    )

    # Now load relationships
    for schedule in schedules:
        db.refresh(schedule, ['bus'])
        if schedule.bus:
            db.refresh(schedule.bus, ['route'])

    arrivals = []
    for schedule in schedules:
        # Calculate minutes away
        time_diff = schedule.departure_time - now
        minutes_away = max(0, int(time_diff.total_seconds() / 60))

        # Determine occupancy level
        occupancy_ratio = (
            schedule.current_occupancy / schedule.bus.capacity
            if schedule.bus.capacity > 0
            else 0
        )
        if occupancy_ratio < 0.3:
            occupancy = 'low'
        elif occupancy_ratio < 0.7:
            occupancy = 'medium'
        else:
            occupancy = 'high'

        arrival = BusArrival(
            id=str(schedule.id),
            route_number=schedule.bus.route.route_number,
            destination=schedule.bus.route.destination_station.name,
            arrival_time=schedule.departure_time.strftime('%I:%M %p'),
            minutes_away=minutes_away,
            occupancy=occupancy,
            accessible=True,  # Assume all buses are accessible for now
            bus_id=schedule.bus.id,
            schedule_id=schedule.id,
        )
        arrivals.append(arrival)

    return arrivals


@router.get('/map/stations', response_model=MapResponse)
async def get_map_stations(
    user_lat: float | None = None,
    user_lng: float | None = None,
    radius_km: float = Query(10, le=50),
    db: Session = Depends(get_db),
):
    """Get bus stations for map display."""
    stations = db.query(BusStation).filter(BusStation.is_active).all()

    map_stations = []
    for station in stations:
        # Calculate distance if user location provided
        distance_km = 0
        if user_lat and user_lng:
            distance_km = calculate_distance(
                user_lat, user_lng, station.latitude, station.longitude
            )
            if distance_km > radius_km:
                continue

        # Count active buses near this station (mock data for now)
        active_buses = random.randint(1, 6)

        map_station = MapStation(
            id=str(station.id),
            name=station.name,
            distance=f'{distance_km:.1f} km' if distance_km > 0 else 'Unknown',
            lat=station.latitude,
            lng=station.longitude,
            active_buses=active_buses,
        )
        map_stations.append(map_station)

    return MapResponse(
        stations=map_stations,
        user_location={'lat': user_lat, 'lng': user_lng}
        if user_lat and user_lng
        else None,
    )


@router.post('/schedules', response_model=BusScheduleSchema)
async def create_bus_schedule(
    schedule_data: BusScheduleCreate,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    """Create a new bus schedule (Admin only)."""
    # Verify bus exists
    bus = db.query(Bus).filter(Bus.id == schedule_data.bus_id).first()
    if not bus:
        raise HTTPException(status_code=400, detail='Invalid bus ID')

    db_schedule = BusSchedule(**schedule_data.dict())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule


@router.put('/schedules/{schedule_id}', response_model=BusScheduleSchema)
async def update_bus_schedule(
    schedule_id: int,
    schedule_data: BusScheduleUpdate,
    current_user: User = Depends(require_role([UserRole.ADMIN, UserRole.DRIVER])),
    db: Session = Depends(get_db),
):
    """Update bus schedule."""
    schedule = db.query(BusSchedule).filter(BusSchedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail='Schedule not found')

    # Update fields
    for field, value in schedule_data.dict(exclude_unset=True).items():
        setattr(schedule, field, value)

    db.commit()
    db.refresh(schedule)
    return schedule


@router.get('/schedules/{schedule_id}', response_model=BusScheduleSchema)
async def get_bus_schedule(schedule_id: int, db: Session = Depends(get_db)):
    """Get specific bus schedule."""
    schedule = (
        db.query(BusSchedule)
        .options(joinedload(BusSchedule.bus).joinedload(Bus.route))
        .filter(BusSchedule.id == schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(status_code=404, detail='Schedule not found')
    return schedule


@router.get('/{bus_id}/seats', response_model=SeatLayout)
async def get_bus_seat_layout(
    bus_id: int, schedule_id: int | None = None, db: Session = Depends(get_db)
):
    """Get seat layout for a specific bus."""
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail='Bus not found')

    # Get all seats for this bus
    seats = db.query(Seat).filter(Seat.bus_id == bus_id).all()

    # If no seats exist, create default layout
    if not seats:
        seats = create_default_bus_seats(db, bus_id, bus.capacity)

    # Check seat availability for specific schedule
    seat_availability = []
    for seat in seats:
        status = 'available'

        if schedule_id:
            # Check if seat is reserved for this schedule
            reservation = (
                db.query(SeatReservation)
                .filter(
                    and_(
                        SeatReservation.seat_id == seat.id,
                        SeatReservation.schedule_id == schedule_id,
                        SeatReservation.status.in_(['reserved', 'confirmed']),
                    )
                )
                .first()
            )

            if reservation:
                status = 'occupied' if reservation.status == 'confirmed' else 'reserved'

        if not seat.is_available:
            status = 'occupied'

        seat_availability.append(
            SeatAvailability(
                seat_id=seat.id,
                seat_number=seat.seat_number,
                row_number=seat.row_number,
                seat_position=seat.seat_position,
                status=status,
            )
        )

    # Calculate layout info
    max_row = max(seat.row_number for seat in seats) if seats else 0
    seats_per_row = 4  # Standard bus layout: A, B, C, D

    return SeatLayout(
        bus_id=bus_id,
        total_seats=len(seats),
        rows=max_row,
        seats_per_row=seats_per_row,
        seats=seat_availability,
    )


@router.post('/{bus_id}/seats', response_model=list[SeatSchema])
async def create_bus_seats(
    bus_id: int,
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    """Create seats for a bus (Admin only)."""
    bus = db.query(Bus).filter(Bus.id == bus_id).first()
    if not bus:
        raise HTTPException(status_code=404, detail='Bus not found')

    # Check if seats already exist
    existing_seats = db.query(Seat).filter(Seat.bus_id == bus_id).first()
    if existing_seats:
        raise HTTPException(status_code=400, detail='Seats already exist for this bus')

    seats = create_default_bus_seats(db, bus_id, bus.capacity)
    return seats


def create_default_bus_seats(db: Session, bus_id: int, capacity: int) -> list[Seat]:
    """Create default seat layout for a bus."""
    seats = []
    rows = capacity // 4  # 4 seats per row (A, B, C, D)

    for row in range(1, rows + 1):
        for position in ['A', 'B', 'C', 'D']:
            seat_number = f'{row}{position}'
            seat = Seat(
                bus_id=bus_id,
                seat_number=seat_number,
                row_number=row,
                seat_position=position,
                is_available=True,
            )
            db.add(seat)
            seats.append(seat)

    db.commit()

    for seat in seats:
        db.refresh(seat)

    return seats
