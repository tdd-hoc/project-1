from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Date, Float
from sqlalchemy.orm import relationship
from app.db.base import Base 

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)
    room_number = Column(String(10), unique=True, index=True)
    category = Column(String(50))
    price_per_night = Column(Float)
    is_active = Column(Boolean, default=True)

    #relationship
    bookings = relationship("Booking", back_populates="room")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    room_id = Column(Integer, ForeignKey("rooms.id"))

    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    total_price = Column(Float)
    status = Column(String(20), default="CONFIRMED")

    # relationship
    room = relationship("Room", back_populates="bookings")
    #relationship to macth the user model
    owner = relationship("User", back_populates="bookings")
