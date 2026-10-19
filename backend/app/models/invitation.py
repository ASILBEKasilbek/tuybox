from sqlalchemy import Column, BigInteger, String, Text, DateTime, Float, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class DigitalInvitation(Base):
    __tablename__ = "digital_invitations"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False) # asilbek-madina-2026
    title = Column(String(200), nullable=False)
    template_id = Column(String(50), default="luxury_gold_1")
    groom_name = Column(String(100), nullable=False)
    bride_name = Column(String(100), nullable=False)
    event_date = Column(DateTime, nullable=False)
    venue_name = Column(String(200), nullable=False)
    venue_address = Column(String(300), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    love_story_text = Column(Text, nullable=True)
    music_url = Column(String(500), nullable=True)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="invitations")
    rsvps = relationship("RSVP", back_populates="invitation", cascade="all, delete-orphan")


class RSVP(Base):
    __tablename__ = "rsvps"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    invitation_id = Column(Integer, ForeignKey("digital_invitations.id", ondelete="CASCADE"), nullable=False, index=True)
    guest_name = Column(String(150), nullable=False)
    phone = Column(String(30), nullable=True)
    attendance_status = Column(String(20), nullable=False) # attending, declined, tentative
    guests_count = Column(Integer, default=1)
    congratulation_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    invitation = relationship("DigitalInvitation", back_populates="rsvps")
