import time

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter()


class BusLocationUpdate(BaseModel):
    bus_id: str = Field(..., description='Identifier for the moving bus in the demo')
    lat: float
    lng: float
    timestamp: int | None = None


class BusLocationResponse(BaseModel):
    bus_id: str
    lat: float
    lng: float
    timestamp: int


_bus_locations: dict[str, dict[str, object]] = {}


@router.post('/realtime/demo/bus-location', response_model=BusLocationResponse)
async def update_demo_bus_location(payload: BusLocationUpdate):
    ts = payload.timestamp if payload.timestamp is not None else int(time.time() * 1000)
    _bus_locations[payload.bus_id] = {
        'bus_id': payload.bus_id,
        'lat': payload.lat,
        'lng': payload.lng,
        'timestamp': ts,
    }
    return BusLocationResponse(**_bus_locations[payload.bus_id])


@router.get('/realtime/demo/bus-location', response_model=BusLocationResponse)
async def get_demo_bus_location(bus_id: str):
    pos = _bus_locations.get(bus_id)
    if not pos:
        raise HTTPException(
            status_code=404, detail='No demo bus location received yet for that bus_id'
        )
    return BusLocationResponse(**pos)
