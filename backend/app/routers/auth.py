from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..auth import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)
from ..database import get_db
from ..models import User
from ..schemas import Token, UserCreate, UserLogin, UserProfile
from ..schemas import User as UserSchema

router = APIRouter()


@router.post('/register', response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    # Check if user already exists
    db_user = db.query(User).filter(User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail='Email already registered'
        )

    # Create new user
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        email=user_data.email,
        name=user_data.name,
        phone=user_data.phone,
        password_hash=hashed_password,
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': db_user.email}, expires_delta=access_token_expires
    )

    return {'access_token': access_token, 'token_type': 'bearer', 'user': db_user}


@router.post('/login', response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
    user = authenticate_user(db, user_credentials.email, user_credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail='Incorrect email or password',
            headers={'WWW-Authenticate': 'Bearer'},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': user.email}, expires_delta=access_token_expires
    )

    return {'access_token': access_token, 'token_type': 'bearer', 'user': user}


@router.get('/me', response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get current user profile with statistics."""
    # Get user statistics
    total_trips = (
        db.query(User).join(User.tickets).filter(User.id == current_user.id).count()
    )

    # Get last trip date
    last_ticket = (
        db.query(User)
        .join(User.tickets)
        .filter(User.id == current_user.id)
        .order_by(User.tickets.any().desc())
        .first()
    )
    last_trip_date = (
        last_ticket.tickets[-1].travel_date
        if last_ticket and last_ticket.tickets
        else None
    )

    return UserProfile(
        **current_user.__dict__, total_trips=total_trips, last_trip_date=last_trip_date
    )


@router.put('/me', response_model=UserSchema)
async def update_user_profile(
    user_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user profile."""
    # Update allowed fields
    allowed_fields = ['name', 'phone']
    for field, value in user_data.items():
        if field in allowed_fields and hasattr(current_user, field):
            setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    return current_user


@router.post('/refresh', response_model=Token)
async def refresh_token(current_user: User = Depends(get_current_user)):
    """Refresh access token."""
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={'sub': current_user.email}, expires_delta=access_token_expires
    )

    return {'access_token': access_token, 'token_type': 'bearer', 'user': current_user}
