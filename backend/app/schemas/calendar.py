from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class CalendarDayItem(BaseModel):
    date: date
    status: str # work, booked, off, completed
    time_slot: str # all_day, day_osh, evening_party
    notes: Optional[str] = None

class CalendarMonthResponse(BaseModel):
    service_id: int
    month: str # YYYY-MM
    days: List[CalendarDayItem]

class CalendarToggleRequest(BaseModel):
    service_id: int
    date: date
    status: str # work, booked, off
    time_slot: str = "all_day"
    notes: Optional[str] = None
