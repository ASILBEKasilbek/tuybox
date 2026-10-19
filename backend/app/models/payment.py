from sqlalchemy import Column, Integer, BigInteger, String, Numeric, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    booking_id = Column(Integer, ForeignKey("bookings.id", ondelete="CASCADE"), nullable=False, index=True)
    provider = Column(String(20), nullable=False) # click, payme, uzum
    transaction_id = Column(String(100), unique=True, index=True, nullable=False)
    amount = Column(Numeric(14, 2), nullable=False)
    status = Column(String(20), default="pending", index=True) # pending, success, failed, refunded
    raw_payload = Column(Text, nullable=True) # JSON matn sifatida
    created_at = Column(DateTime, default=datetime.utcnow)

    booking = relationship("Booking", back_populates="payments")
