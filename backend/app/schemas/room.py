from pydantic import BaseModel

class RoomBase(BaseModel):
    room_number: str
    category: str
    price_per_night: float

class RoomCreate(RoomBase):
    pass

class RoomRead(RoomBase):
    id: int
    is_active: bool

    class Config:
        # this tells pydantic to read data from The orm model
        from_attributes = True


