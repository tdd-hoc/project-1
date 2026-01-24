from fastapi import APIRouter
from app.api import rooms, users, bookings, auth

api_router = APIRouter()

api_router.include_router(rooms.router, prefix="/rooms", tags=["Rooms"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(bookings.router, prefix="/bookings", tags=["Bookings"])
api_router.include_router(auth.router, tags=["Auth"])
