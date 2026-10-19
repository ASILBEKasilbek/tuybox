from sqlalchemy import Column, Integer, BigInteger, String, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class ServiceCalendarDay(Base):
    __tablename__ = "service_calendar_days"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False, index=True)
    calendar_date = Column(Date, nullable=False, index=True)
    status = Column(String(20), default="work", nullable=False) # work (bo'sh), booked (band), off (dam olish), completed
    time_slot = Column(String(20), default="all_day", nullable=False) # all_day, day_osh, evening_party
    notes = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Bir xizmatning ayni sana va vaqt sloti uchun faqat bitta status bo'lishi shart
    __table_args__ = (
        UniqueConstraint('service_id', 'calendar_date', 'time_slot', name='uq_service_calendar_slot'),
    )

    service = relationship("Service", back_populates="calendar_days")
