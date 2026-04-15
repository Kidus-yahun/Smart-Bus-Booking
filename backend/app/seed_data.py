import random
from datetime import UTC, datetime, timedelta

from .auth import get_password_hash
from .database import SessionLocal, engine
from .models import (
    Base,
    Bus,
    BusRoute,
    BusSchedule,
    BusStation,
    FarePrice,
    Seat,
    User,
    UserRole,
)


def create_ethiopian_bus_data():
    """Create seed data for Ethiopian bus system."""
    db = SessionLocal()

    try:
        # Create Ethiopian bus stations in Addis Ababa
        stations_data = [
            {
                'name': 'Meskel Square Station',
                'address': 'Meskel Square, Kirkos Sub City, Addis Ababa',
                'latitude': 9.0084,
                'longitude': 38.7635,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms", "ticket_office", "parking"]',
            },
            {
                'name': 'Piazza Station',
                'address': 'Piazza, Addis Ketema Sub City, Addis Ababa',
                'latitude': 9.0370,
                'longitude': 38.7578,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms", "shops", "atm"]',
            },
            {
                'name': 'Bole Airport Terminal',
                'address': 'Bole International Airport, Bole Sub City, Addis Ababa',
                'latitude': 8.9781,
                'longitude': 38.7991,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms", "shops", "restaurants", "wifi", "charging_stations"]',
            },
            {
                'name': 'Merkato Bus Station',
                'address': 'Merkato, Addis Ketema Sub City, Addis Ababa',
                'latitude': 9.0142,
                'longitude': 38.7225,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms", "ticket_office", "shops", "food_court"]',
            },
            {
                'name': 'CMC Station (Cherkos)',
                'address': 'CMC Area, Yeka Sub City, Addis Ababa',
                'latitude': 9.0267,
                'longitude': 38.8047,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms", "parking"]',
            },
            {
                'name': 'Kazanchis Station',
                'address': 'Kazanchis, Kirkos Sub City, Addis Ababa',
                'latitude': 9.0201,
                'longitude': 38.7596,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms", "ticket_office"]',
            },
            {
                'name': 'Arat Kilo Station',
                'address': 'Arat Kilo, Kirkos Sub City, Addis Ababa',
                'latitude': 9.0334,
                'longitude': 38.7515,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms"]',
            },
            {
                'name': 'Stadium Station',
                'address': 'Stadium Area, Kirkos Sub City, Addis Ababa',
                'latitude': 9.0156,
                'longitude': 38.7467,
                'city': 'Addis Ababa',
                'region': 'Addis Ababa',
                'facilities': '["waiting_area", "restrooms", "parking"]',
            },
        ]

        # Create stations
        stations = []
        for station_data in stations_data:
            station = BusStation(**station_data)
            db.add(station)
            stations.append(station)

        db.commit()

        # Create bus routes
        routes_data = [
            {
                'route_number': 'AA-01',
                'route_name': 'Meskel Square to Bole Airport',
                'origin_station_id': 1,  # Meskel Square
                'destination_station_id': 3,  # Bole Airport
                'distance_km': 8.5,
                'estimated_duration_minutes': 35,
            },
            {
                'route_number': 'AA-02',
                'route_name': 'Piazza to Merkato',
                'origin_station_id': 2,  # Piazza
                'destination_station_id': 4,  # Merkato
                'distance_km': 3.2,
                'estimated_duration_minutes': 15,
            },
            {
                'route_number': 'AA-03',
                'route_name': 'CMC to Meskel Square',
                'origin_station_id': 5,  # CMC
                'destination_station_id': 1,  # Meskel Square
                'distance_km': 4.8,
                'estimated_duration_minutes': 25,
            },
            {
                'route_number': 'AA-04',
                'route_name': 'Kazanchis to Bole Airport',
                'origin_station_id': 6,  # Kazanchis
                'destination_station_id': 3,  # Bole Airport
                'distance_km': 6.2,
                'estimated_duration_minutes': 30,
            },
            {
                'route_number': 'AA-05',
                'route_name': 'Arat Kilo to Stadium',
                'origin_station_id': 7,  # Arat Kilo
                'destination_station_id': 8,  # Stadium
                'distance_km': 2.1,
                'estimated_duration_minutes': 12,
            },
        ]

        routes = []
        for route_data in routes_data:
            route = BusRoute(**route_data)
            db.add(route)
            routes.append(route)

        db.commit()

        # Create fare prices
        fare_prices_data = [
            # Route AA-01 (Meskel Square to Bole Airport)
            {'route_id': 1, 'fare_type': 'adult', 'price_etb': 15.0},
            {'route_id': 1, 'fare_type': 'senior', 'price_etb': 8.0},
            {'route_id': 1, 'fare_type': 'student', 'price_etb': 10.0},
            {'route_id': 1, 'fare_type': 'child', 'price_etb': 5.0},
            # Route AA-02 (Piazza to Merkato)
            {'route_id': 2, 'fare_type': 'adult', 'price_etb': 8.0},
            {'route_id': 2, 'fare_type': 'senior', 'price_etb': 4.0},
            {'route_id': 2, 'fare_type': 'student', 'price_etb': 6.0},
            {'route_id': 2, 'fare_type': 'child', 'price_etb': 3.0},
            # Route AA-03 (CMC to Meskel Square)
            {'route_id': 3, 'fare_type': 'adult', 'price_etb': 12.0},
            {'route_id': 3, 'fare_type': 'senior', 'price_etb': 6.0},
            {'route_id': 3, 'fare_type': 'student', 'price_etb': 8.0},
            {'route_id': 3, 'fare_type': 'child', 'price_etb': 4.0},
            # Route AA-04 (Kazanchis to Bole Airport)
            {'route_id': 4, 'fare_type': 'adult', 'price_etb': 13.0},
            {'route_id': 4, 'fare_type': 'senior', 'price_etb': 7.0},
            {'route_id': 4, 'fare_type': 'student', 'price_etb': 9.0},
            {'route_id': 4, 'fare_type': 'child', 'price_etb': 4.0},
            # Route AA-05 (Arat Kilo to Stadium)
            {'route_id': 5, 'fare_type': 'adult', 'price_etb': 6.0},
            {'route_id': 5, 'fare_type': 'senior', 'price_etb': 3.0},
            {'route_id': 5, 'fare_type': 'student', 'price_etb': 4.0},
            {'route_id': 5, 'fare_type': 'child', 'price_etb': 2.0},
        ]

        for fare_data in fare_prices_data:
            fare_price = FarePrice(**fare_data)
            db.add(fare_price)

        db.commit()

        # Create buses
        buses_data = [
            {
                'bus_number': 'AA-001',
                'license_plate': '3-12345-ET',
                'route_id': 1,
                'capacity': 45,
                'driver_name': 'Alemayehu Tadesse',
                'driver_phone': '+251911123456',
                'current_latitude': 9.0120,
                'current_longitude': 38.7580,
            },
            {
                'bus_number': 'AA-002',
                'license_plate': '3-12346-ET',
                'route_id': 1,
                'capacity': 45,
                'driver_name': 'Birtukan Mekonnen',
                'driver_phone': '+251911123457',
                'current_latitude': 9.0280,
                'current_longitude': 38.7720,
            },
            {
                'bus_number': 'AA-003',
                'license_plate': '3-12347-ET',
                'route_id': 2,
                'capacity': 35,
                'driver_name': 'Dawit Haile',
                'driver_phone': '+251911123458',
                'current_latitude': 9.0050,
                'current_longitude': 38.7450,
            },
            {
                'bus_number': 'AA-004',
                'license_plate': '3-12348-ET',
                'route_id': 2,
                'capacity': 35,
                'driver_name': 'Hana Bekele',
                'driver_phone': '+251911123459',
                'current_latitude': 9.0180,
                'current_longitude': 38.7350,
            },
            {
                'bus_number': 'AA-005',
                'license_plate': '3-12349-ET',
                'route_id': 3,
                'capacity': 40,
                'driver_name': 'Getachew Alemu',
                'driver_phone': '+251911123460',
                'current_latitude': 9.0370,
                'current_longitude': 38.7578,
            },
            {
                'bus_number': 'AA-006',
                'license_plate': '3-12350-ET',
                'route_id': 4,
                'capacity': 40,
                'driver_name': 'Meron Tesfaye',
                'driver_phone': '+251911123461',
                'current_latitude': 8.9781,
                'current_longitude': 38.7991,
            },
            {
                'bus_number': 'AA-007',
                'license_plate': '3-12351-ET',
                'route_id': 5,
                'capacity': 30,
                'driver_name': 'Yohannes Desta',
                'driver_phone': '+251911123462',
                'current_latitude': 9.0142,
                'current_longitude': 38.7225,
            },
        ]

        buses = []
        for bus_data in buses_data:
            bus = Bus(**bus_data)
            db.add(bus)
            buses.append(bus)

        db.commit()

        # Create 5 active schedules starting from current time, 30 min apart
        now = datetime.now(UTC)
        current_time = now.replace(second=0, microsecond=0)
        # Round up to next 30-minute interval
        if current_time.minute % 30 != 0:
            minutes_to_next = 30 - (current_time.minute % 30)
            current_time = current_time + timedelta(minutes=minutes_to_next)

        for i in range(5):
            departure = current_time + timedelta(minutes=30 * i)
            arrival = departure + timedelta(hours=2)  # 2 hour trip

            # Distribute across first 5 buses
            bus = buses[i % len(buses[:5])]

            schedule = BusSchedule(
                bus_id=bus.id,
                departure_time=departure,
                estimated_arrival_time=arrival,
                current_occupancy=random.randint(0, bus.capacity // 3),
            )
            db.add(schedule)

        print(f'Created 5 active schedules starting from {current_time.time()}')

        # Create bus schedules for the next few days
        base_time = datetime.now(UTC).replace(hour=6, minute=0, second=0, microsecond=0)

        for day in range(7):  # Create schedules for next 7 days
            day_start = base_time + timedelta(days=day)

            for bus in buses:
                # Create multiple schedules per day for each bus
                for hour_offset in [
                    0,
                    2,
                    4,
                    6,
                    8,
                    10,
                    12,
                    14,
                ]:  # Every 2 hours from 6 AM
                    departure_time = day_start + timedelta(hours=hour_offset)
                    route = next(r for r in routes if r.id == bus.route_id)
                    arrival_time = departure_time + timedelta(
                        minutes=route.estimated_duration_minutes
                    )

                    schedule = BusSchedule(
                        bus_id=bus.id,
                        departure_time=departure_time,
                        estimated_arrival_time=arrival_time,
                        current_occupancy=random.randint(
                            0, bus.capacity // 2
                        ),  # Random occupancy
                    )
                    db.add(schedule)

        db.commit()

        # Create seats for all buses
        for bus in buses:
            rows = bus.capacity // 4  # 4 seats per row (A, B, C, D)

            for row in range(1, rows + 1):
                for position in ['A', 'B', 'C', 'D']:
                    seat_number = f'{row}{position}'
                    seat = Seat(
                        bus_id=bus.id,
                        seat_number=seat_number,
                        row_number=row,
                        seat_position=position,
                        is_available=True,
                    )
                    db.add(seat)

        db.commit()

        # Create admin user
        admin_user = User(
            email='admin@smartbus.et',
            name='SmartBus Admin',
            password_hash=get_password_hash('admin123'),
            role=UserRole.ADMIN,
            phone='+251911000000',
        )
        db.add(admin_user)

        # Create demo user
        demo_user = User(
            email='demo@smartbus.com',
            name='Demo User',
            password_hash=get_password_hash('demo123'),
            role=UserRole.PASSENGER,
            phone='+251911000001',
        )
        db.add(demo_user)

        db.commit()

        print('✅ Ethiopian bus data seeded successfully!')
        print('📍 Created 8 bus stations in Addis Ababa')
        print('🚌 Created 5 bus routes')
        print('🎫 Created fare pricing for all routes')
        print('🚍 Created 7 buses with Ethiopian license plates')
        print('🪑 Created seat layouts for all buses')
        print('📅 Created schedules for the next 7 days')
        print('👤 Created admin user: admin@smartbus.et / admin123')
        print('👤 Created demo user: demo@smartbus.com / demo123')

    except Exception as e:
        print(f'❌ Error seeding data: {e}')
        db.rollback()
    finally:
        db.close()


if __name__ == '__main__':
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed data
    create_ethiopian_bus_data()
