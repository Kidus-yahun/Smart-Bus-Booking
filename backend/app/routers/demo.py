from typing import Dict, Optional
import time

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()


class BusLocationUpdate(BaseModel):
    busId: str = Field(..., description="Identifier for the moving bus in the demo")
    lat: float
    lng: float
    # Milliseconds since epoch. If omitted, server uses current time.
    timestamp: Optional[int] = None


class BusLocationResponse(BaseModel):
    busId: str
    lat: float
    lng: float
    timestamp: int


# Demo-only in-memory store (resets when backend restarts).
_bus_locations: Dict[str, Dict[str, object]] = {}


@router.post("/realtime/demo/bus-location", response_model=BusLocationResponse)
async def update_demo_bus_location(payload: BusLocationUpdate):
    ts = payload.timestamp if payload.timestamp is not None else int(time.time() * 1000)
    _bus_locations[payload.busId] = {
        "busId": payload.busId,
        "lat": payload.lat,
        "lng": payload.lng,
        "timestamp": ts,
    }
    return BusLocationResponse(**_bus_locations[payload.busId])  # type: ignore[arg-type]


@router.get("/realtime/demo/bus-location", response_model=BusLocationResponse)
async def get_demo_bus_location(busId: str):
    pos = _bus_locations.get(busId)
    if not pos:
        raise HTTPException(status_code=404, detail="No demo bus location received yet for that busId")
    return BusLocationResponse(**pos)  # type: ignore[arg-type]

