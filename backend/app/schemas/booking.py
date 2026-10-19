from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

class BookingCreateRequest(BaseModel):
    service_id: int
    event_date: date
    time_slot: str = "all_day"
    guest_count: Optional[int] = None
    package_id: Optional[int] = None
    customer_notes: Optional[str] = None

class BookingActionRequest(BaseModel):
    action: str # accept, reject, cancel
    vendor_notes: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    booking_code: str
    service_id: int
    service_title: str
    event_date: date
    time_slot: str
    total_price: float
    deposit_amount: float
    status: str
    escrow_status: str
    created_at: datetime

    class Config:
        from_attributes = True
