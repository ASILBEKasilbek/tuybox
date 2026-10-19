from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class RSVPCreateRequest(BaseModel):
    guest_name: str
    phone: Optional[str] = None
    attendance_status: str # attending, declined, tentative
    guests_count: int = 1
    congratulation_message: Optional[str] = None

class RSVPSummarySchema(BaseModel):
    total_attending: int
    total_declined: int
    total_guests_count: int
    recent_rsvps: List[RSVPCreateRequest] = []

class InvitationCreateRequest(BaseModel):
    title: str
    groom_name: str
    bride_name: str
    event_date: datetime
    venue_name: str
    venue_address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    love_story_text: Optional[str] = None
    template_id: str = "luxury_gold_1"

class InvitationResponse(BaseModel):
    id: int
    slug: str
    title: str
    groom_name: str
    bride_name: str
    event_date: datetime
    venue_name: str
    venue_address: Optional[str] = None
    love_story_text: Optional[str] = None
    rsvp_summary: Optional[RSVPSummarySchema] = None

    class Config:
        from_attributes = True
