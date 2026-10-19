from sqlalchemy import Column, BigInteger, String, Date, DateTime, Numeric, Text, Integer, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_code = Column(String(30), unique=True, index=True, nullable=False) # TX-2026-98124
    customer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="RESTRICT"), nullable=False, index=True)
    event_date = Column(Date, nullable=False, index=True)
    time_slot = Column(String(20), default="all_day", nullable=False) # all_day, day_osh, evening_party
    guest_count = Column(Integer, nullable=True)

    total_price = Column(Numeric(14, 2), nullable=False)
    deposit_amount = Column(Numeric(14, 2), nullable=False) # Avans summasi

    status = Column(String(20), default="pending", index=True)
    # pending (kutilyapti), confirmed (tasdiqlandi), rejected (rad etildi), cancelled (bekor qilindi), completed (o'tdi)

    escrow_status = Column(String(20), default="unpaid", index=True)
    # unpaid, held_in_escrow, released_to_vendor, refunded

    customer_notes = Column(Text, nullable=True)
    vendor_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    customer = relationship("User", back_populates="bookings")
    service = relationship("Service", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
