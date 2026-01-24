from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_

from app.db.session import get_db
from app.models.hotel import Booking, Room
from app.schemas.booking import BookingCreate, BookingRead
from app.api.deps import get_current_user
from app.models.user import User



router = APIRouter()

@router.post("/", response_model=BookingRead)
async def create_booking(booking_data: BookingCreate, db: AsyncSession = Depends(get_db),
                         current_user: User = Depends(get_current_user)
                         ):
    # check if room exists
    result = await db.execute(select(Room).where(Room.id == booking_data.room_id))
    room = result.scalar_one_or_none()
    if not room:
        raise HTTPException(status_code=404, detail="room not found")

    # the critical check: look for overlapping bookings
    # we select any booking for this room where the dates overlap
    query = select(Booking).where(
        and_(
            Booking.room_id == booking_data.room_id,
            Booking.status == "CONFIRMED",
            or_(
                and_(Booking.check_in <= booking_data.check_in, Booking.check_out > booking_data.check_in),
                and_(Booking.check_in < booking_data.check_out, Booking.check_out >= booking_data.check_out),
                and_(Booking.check_in >= booking_data.check_in, Booking.check_out <= booking_data.check_out)
            )

        )
    )
    existing_booking = await db.execute(query)
    if existing_booking.scalar():
        raise HTTPException(status_code=400, detail="Room is already booked for these dates")
    
    new_booking = Booking(
        user_id=current_user.id, # get this from jwt in real 
        room_id=booking_data.room_id,
        check_in=booking_data.check_in,
        check_out=booking_data.check_out,
        total_price=room.price_per_night * (booking_data.check_out - booking_data.check_in).days

    )
    db.add(new_booking)
    await db.commit()
    await db.refresh(new_booking)
    
    return new_booking


