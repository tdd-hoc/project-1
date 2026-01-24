from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.session import get_db
from app.models.hotel import Room
from app.schemas.room import RoomCreate, RoomRead

router = APIRouter()

@router.post("/", response_model=RoomRead)
async def create_room(room: RoomCreate, db: AsyncSession = Depends(get_db)):
    # check if room number already exists
    result = await db.execute(select(Room).where(Room.room_number == room.room_number))
    existting_room = result.scalar_one_or_none()

    if existting_room:
        raise HTTPException(status_code=400, detail="Room number already exists")
    
    # Create new room
    new_room = Room(
        room_number=room.room_number,
        category=room.category,
        price_per_night=room.price_per_night
    )

    db.add(new_room)
    await db.commit()
    await db.refresh(new_room)
    return new_room


@router.get("/", response_model=List[RoomRead])
async def read_rooms(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Room).offset(skip).limit(limit))
    rooms = result.scalars().all()
    return rooms