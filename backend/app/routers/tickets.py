import base64
import io
import random
import string
import uuid
from datetime import datetime, timedelta

import qrcode
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_
from sqlalchemy.orm import Session, joinedload

from ..auth import get_current_user, require_role
from ..database import get_db
from ..models import (
    Bus,
    BusSchedule,
    FarePrice,
    FareType,
    Payment,
    PaymentStatus,
    Seat,
    SeatReservation,
    Ticket,
    TicketStatus,
    User,
    UserRole,
)
from ..schemas import (
    FarePrice as FarePriceSchema,
)
from ..schemas import (
    Payment as PaymentSchema,
)
from ..schemas import (
    Ticket as TicketSchema,
)
from ..schemas import (
    TicketCreateWithSeats,
    TicketDetail,
)

router = APIRouter()


def generate_ticket_number() -> str:
    """Generate unique ticket number."""
    prefix = "TKT"
    timestamp = datetime.now().strftime("%Y%m%d")
    random_suffix = "".join(random.choices(string.digits, k=4))
    return f"{prefix}-{timestamp}-{random_suffix}"


def generate_payment_reference() -> str:
    """Generate unique payment reference."""
    return f"PAY-{uuid.uuid4().hex[:12].upper()}"


def generate_qr_code(ticket_number: str) -> str:
    """Generate QR code for ticket."""
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(ticket_number)
    qr.make(fit=True)

    # Create QR code image
    img = qr.make_image(fill_color="black", back_color="white")

    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    img_str = base64.b64encode(buffer.getvalue()).decode()

    return f"data:image/png;base64,{img_str}"


def calculate_fare(fare_type: FareType, base_price: float) -> float:
    """Calculate fare based on type."""
    fare_multipliers = {
        FareType.ADULT: 1.0,
        FareType.SENIOR: 0.5,  # 50% discount
        FareType.STUDENT: 0.7,  # 30% discount
        FareType.CHILD: 0.33,  # ~67% discount
    }
    return base_price * fare_multipliers.get(fare_type, 1.0)


@router.post("/book", response_model=TicketDetail)
async def book_ticket(
    ticket_data: TicketCreateWithSeats,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Book a bus ticket."""
    # Get schedule with related data
    schedule = (
        db.query(BusSchedule)
        .options(joinedload(BusSchedule.bus).joinedload(Bus.route))
        .filter(BusSchedule.id == ticket_data.schedule_id)
        .first()
    )

    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")

    if schedule.is_cancelled:
        raise HTTPException(status_code=400, detail="This schedule has been cancelled")

    # Validate selected seats
    if len(ticket_data.selected_seat_ids) != ticket_data.quantity:
        raise HTTPException(
            status_code=400, detail=f"Must select exactly {ticket_data.quantity} seats"
        )

    # Check if selected seats are available
    for seat_id in ticket_data.selected_seat_ids:
        seat = db.query(Seat).filter(Seat.id == seat_id).first()
        if not seat:
            raise HTTPException(status_code=400, detail=f"Seat {seat_id} not found")

        if not seat.is_available:
            raise HTTPException(
                status_code=400, detail=f"Seat {seat.seat_number} is not available"
            )

        # Check if seat is already reserved for this schedule
        existing_reservation = (
            db.query(SeatReservation)
            .filter(
                and_(
                    SeatReservation.seat_id == seat_id,
                    SeatReservation.schedule_id == ticket_data.schedule_id,
                    SeatReservation.status.in_(["reserved", "confirmed"]),
                )
            )
            .first()
        )

        if existing_reservation:
            raise HTTPException(
                status_code=400, detail=f"Seat {seat.seat_number} is already reserved"
            )

    # Get or create fare price for this route and fare type
    base_price = 15.0  # Default base price in ETB
    fare_price = (
        db.query(FarePrice)
        .filter(
            and_(
                FarePrice.route_id == schedule.bus.route_id,
                FarePrice.fare_type == ticket_data.fare_type,
                FarePrice.is_active,
            )
        )
        .first()
    )

    if fare_price:
        base_price = fare_price.price_etb

    # Calculate total price
    unit_price = calculate_fare(ticket_data.fare_type, base_price)
    total_price = unit_price * ticket_data.quantity

    # Create ticket
    ticket_number = generate_ticket_number()
    qr_code = generate_qr_code(ticket_number)

    db_ticket = Ticket(
        ticket_number=ticket_number,
        user_id=current_user.id,
        schedule_id=ticket_data.schedule_id,
        fare_type=ticket_data.fare_type,
        quantity=ticket_data.quantity,
        total_price_etb=total_price,
        travel_date=schedule.departure_time,
        qr_code=qr_code,
        boarding_station_id=ticket_data.boarding_station_id,
        destination_station_id=ticket_data.destination_station_id,
        status=TicketStatus.PENDING,
    )

    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)

    # Create pending payment
    payment_reference = generate_payment_reference()
    db_payment = Payment(
        ticket_id=db_ticket.id,
        amount_etb=total_price,
        payment_method="pending",
        payment_reference=payment_reference,
        status=PaymentStatus.PENDING,
    )

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    # Create seat reservations
    reservation_expires = datetime.utcnow() + timedelta(
        minutes=15
    )  # 15 min to complete payment

    for seat_id in ticket_data.selected_seat_ids:
        seat_reservation = SeatReservation(
            seat_id=seat_id,
            ticket_id=db_ticket.id,
            schedule_id=ticket_data.schedule_id,
            status="reserved",
            expires_at=reservation_expires,
        )
        db.add(seat_reservation)

    db.commit()

    # Load relationships for response
    db.refresh(db_ticket)
    db_ticket.user = current_user
    db_ticket.schedule = schedule
    db_ticket.payment = db_payment

    return db_ticket


@router.post("/payment/{ticket_id}", response_model=PaymentSchema)
async def process_payment(
    ticket_id: int,
    payment_data: dict,  # Contains payment_method, mobile_number, etc.
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Process payment for a ticket."""
    # Get ticket
    ticket = (
        db.query(Ticket)
        .filter(and_(Ticket.id == ticket_id, Ticket.user_id == current_user.id))
        .first()
    )

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.status != TicketStatus.PENDING:
        raise HTTPException(status_code=400, detail="Ticket payment already processed")

    # Get pending payment
    payment = db.query(Payment).filter(Payment.ticket_id == ticket_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record not found")

    # Process payment (mock implementation)
    payment_method = payment_data.get("payment_method", "mobile_money")

    # Simulate payment processing
    success = True  # In real implementation, call payment gateway

    if success:
        # Update payment status
        payment.status = PaymentStatus.COMPLETED
        payment.payment_method = payment_method
        payment.processed_at = datetime.utcnow()

        # Update ticket status
        ticket.status = TicketStatus.CONFIRMED

        # Confirm seat reservations
        seat_reservations = (
            db.query(SeatReservation)
            .filter(SeatReservation.ticket_id == ticket_id)
            .all()
        )

        for reservation in seat_reservations:
            reservation.status = "confirmed"
            reservation.expires_at = None  # Remove expiration

        # Update bus schedule occupancy
        schedule = (
            db.query(BusSchedule).filter(BusSchedule.id == ticket.schedule_id).first()
        )
        if schedule:
            schedule.current_occupancy += ticket.quantity

        db.commit()
        db.refresh(payment)

        return payment
    else:
        payment.status = PaymentStatus.FAILED
        db.commit()
        raise HTTPException(status_code=400, detail="Payment processing failed")


@router.get("/my-tickets", response_model=list[TicketDetail])
async def get_my_tickets(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user's tickets."""
    tickets = (
        db.query(Ticket)
        .options(
            joinedload(Ticket.schedule)
            .joinedload(BusSchedule.bus)
            .joinedload(Bus.route),
            joinedload(Ticket.payment),
        )
        .filter(Ticket.user_id == current_user.id)
        .order_by(Ticket.booking_time.desc())
        .all()
    )

    return tickets


@router.get("/{ticket_id}", response_model=TicketDetail)
async def get_ticket(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get specific ticket details."""
    ticket = (
        db.query(Ticket)
        .options(
            joinedload(Ticket.schedule)
            .joinedload(BusSchedule.bus)
            .joinedload(Bus.route),
            joinedload(Ticket.payment),
            joinedload(Ticket.user),
        )
        .filter(and_(Ticket.id == ticket_id, Ticket.user_id == current_user.id))
        .first()
    )

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    return ticket


@router.put("/{ticket_id}/cancel", response_model=TicketSchema)
async def cancel_ticket(
    ticket_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel a ticket."""
    ticket = (
        db.query(Ticket)
        .filter(and_(Ticket.id == ticket_id, Ticket.user_id == current_user.id))
        .first()
    )

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.status == TicketStatus.CANCELLED:
        raise HTTPException(status_code=400, detail="Ticket already cancelled")

    if ticket.status == TicketStatus.USED:
        raise HTTPException(status_code=400, detail="Cannot cancel used ticket")

    # Check if cancellation is allowed (e.g., at least 1 hour before departure)
    if ticket.travel_date - datetime.utcnow() < timedelta(hours=1):
        raise HTTPException(
            status_code=400,
            detail="Cannot cancel ticket less than 1 hour before departure",
        )

    # Update ticket status
    ticket.status = TicketStatus.CANCELLED

    # Cancel seat reservations
    seat_reservations = (
        db.query(SeatReservation).filter(SeatReservation.ticket_id == ticket_id).all()
    )

    for reservation in seat_reservations:
        reservation.status = "cancelled"

    # Update bus schedule occupancy
    schedule = (
        db.query(BusSchedule).filter(BusSchedule.id == ticket.schedule_id).first()
    )
    if schedule:
        schedule.current_occupancy = max(
            0, schedule.current_occupancy - ticket.quantity
        )

    # Process refund (mock implementation)
    payment = db.query(Payment).filter(Payment.ticket_id == ticket_id).first()
    if payment and payment.status == PaymentStatus.COMPLETED:
        payment.status = PaymentStatus.REFUNDED

    db.commit()
    db.refresh(ticket)

    return ticket


@router.get("/fares/routes/{route_id}", response_model=list[FarePriceSchema])
async def get_route_fares(route_id: int, db: Session = Depends(get_db)):
    """Get fare prices for a specific route."""
    fares = (
        db.query(FarePrice)
        .filter(and_(FarePrice.route_id == route_id, FarePrice.is_active))
        .all()
    )

    return fares


@router.post("/validate/{ticket_number}")
async def validate_ticket(
    ticket_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Validate a ticket (for drivers/conductors)."""
    ticket = db.query(Ticket).filter(Ticket.ticket_number == ticket_number).first()

    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if ticket.status != TicketStatus.CONFIRMED:
        raise HTTPException(status_code=400, detail="Ticket is not valid for travel")

    # Check if ticket is for today (or allow some flexibility)
    travel_date = ticket.travel_date.date()
    today = datetime.utcnow().date()

    if travel_date != today:
        raise HTTPException(status_code=400, detail="Ticket is not valid for today")

    # Mark ticket as used
    ticket.status = TicketStatus.USED
    db.commit()

    return {
        "valid": True,
        "ticket_number": ticket_number,
        "passenger_name": ticket.user.name,
        "route": f"{ticket.schedule.bus.route.route_number}",
        "quantity": ticket.quantity,
        "fare_type": ticket.fare_type,
    }


@router.post("/reserve-seats")
async def reserve_seats_temporarily(
    seat_ids: list[int],
    schedule_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Temporarily reserve seats for 15 minutes while user completes booking."""
    # Check if seats are available
    for seat_id in seat_ids:
        existing_reservation = (
            db.query(SeatReservation)
            .filter(
                and_(
                    SeatReservation.seat_id == seat_id,
                    SeatReservation.schedule_id == schedule_id,
                    SeatReservation.status == "reserved",
                    SeatReservation.expires_at > datetime.utcnow(),
                )
            )
            .first()
        )

        if existing_reservation:
            seat = db.query(Seat).filter(Seat.id == seat_id).first()
            raise HTTPException(
                status_code=400,
                detail=f"Seat {seat.seat_number if seat else seat_id} is temporarily reserved",
            )

    # Create temporary reservations
    reservation_expires = datetime.utcnow() + timedelta(minutes=15)
    reservations = []

    for seat_id in seat_ids:
        reservation = SeatReservation(
            seat_id=seat_id,
            schedule_id=schedule_id,
            status="reserved",
            expires_at=reservation_expires,
        )
        db.add(reservation)
        reservations.append(reservation)

    db.commit()

    return {
        "message": f"Reserved {len(seat_ids)} seats temporarily",
        "expires_at": reservation_expires,
        "reservation_ids": [r.id for r in reservations],
    }


@router.delete("/cleanup-expired-reservations")
async def cleanup_expired_reservations(
    current_user: User = Depends(require_role([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    """Clean up expired seat reservations (Admin only)."""
    expired_reservations = (
        db.query(SeatReservation)
        .filter(
            and_(
                SeatReservation.status == "reserved",
                SeatReservation.expires_at < datetime.utcnow(),
            )
        )
        .all()
    )

    for reservation in expired_reservations:
        db.delete(reservation)

    db.commit()

    return {"message": f"Cleaned up {len(expired_reservations)} expired reservations"}


@router.get("/statistics/daily")
async def get_daily_statistics(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get daily ticket statistics."""
    today = datetime.utcnow().date()

    # Daily tickets count
    daily_tickets = (
        db.query(Ticket)
        .filter(
            Ticket.booking_time >= today,
            Ticket.booking_time < today + timedelta(days=1),
        )
        .count()
    )

    # Daily revenue
    daily_revenue = (
        db.query(Payment)
        .join(Ticket)
        .filter(
            Payment.status == PaymentStatus.COMPLETED,
            Ticket.booking_time >= today,
            Ticket.booking_time < today + timedelta(days=1),
        )
        .with_entities(Payment.amount_etb)
        .all()
    )

    total_revenue = sum(payment.amount_etb for payment in daily_revenue)

    return {
        "date": today.isoformat(),
        "tickets_sold": daily_tickets,
        "revenue_etb": total_revenue,
        "currency": "ETB",
    }
