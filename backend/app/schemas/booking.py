from pydantic import BaseModel, FutureDate, validator
from datetime import date

class BookingCreate(BaseModel):
    room_id: int
    user_id: int 
    check_in: FutureDate
    check_out: FutureDate

    @validator('check_out')
    def check_out_after_check_in(cls, v, values):
        if 'check_in' in values and v <= values['check_in']:
            raise ValueError('check_out must be after check_in')
        return v
    
class BookingRead(BookingCreate):
    id: int
    total_price: float
    status: str

    class Config:
        from_attributes = True