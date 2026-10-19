from sqlalchemy import Column, BigInteger, Integer, String, Text, Numeric, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class EventType(Base):
    __tablename__ = "event_types"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False) # Nikoh to'yi, Beshik to'y, Sunnat to'y
    slug = Column(String(120), unique=True, index=True, nullable=False)
    icon_url = Column(String(500), nullable=True)
    sort_order = Column(Integer, default=0)

    categories = relationship("ServiceCategory", back_populates="event_type")


class ServiceCategory(Base):
    __tablename__ = "service_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False) # To'yxona, San'atkor, Foto-video, Bezak
    slug = Column(String(120), unique=True, index=True, nullable=False)
    icon_url = Column(String(500), nullable=True)
    event_type_id = Column(Integer, ForeignKey("event_types.id", ondelete="SET NULL"), nullable=True)
    sort_order = Column(Integer, default=0)

    event_type = relationship("EventType", back_populates="categories")
    services = relationship("Service", back_populates="category")


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    vendor_id = Column(Integer, ForeignKey("vendor_profiles.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("service_categories.id", ondelete="RESTRICT"), nullable=False)
    title = Column(String(255), index=True, nullable=False)
    slug = Column(String(270), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=False)
    base_price = Column(Numeric(14, 2), index=True, nullable=False)
    price_type = Column(String(20), default="fixed") # fixed, per_guest, hourly

    # Geolokatsiya
    city = Column(String(100), index=True, nullable=False) # Toshkent, Samarqand
    district = Column(String(100), nullable=True)
    address_line = Column(String(300), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    is_active = Column(Boolean, default=True, index=True)
    view_count = Column(Integer, default=0)
    booking_count = Column(Integer, default=0)
    rating_avg = Column(Numeric(3, 2), default=0.00)
    reviews_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    vendor = relationship("VendorProfile", back_populates="services")
    category = relationship("ServiceCategory", back_populates="services")
    packages = relationship("ServicePackage", back_populates="service", cascade="all, delete-orphan")
    media = relationship("ServiceMedia", back_populates="service", cascade="all, delete-orphan")
    calendar_days = relationship("ServiceCalendarDay", back_populates="service", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="service")


class ServicePackage(Base):
    __tablename__ = "service_packages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(100), nullable=False) # Standart, Premium, VIP
    description = Column(Text, nullable=True)
    price = Column(Numeric(14, 2), nullable=False)
    features_json = Column(Text, nullable=True) # JSON formatdagi xizmatlar ro'yxati

    service = relationship("Service", back_populates="packages")


class ServiceMedia(Base):
    __tablename__ = "service_media"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    service_id = Column(Integer, ForeignKey("services.id", ondelete="CASCADE"), nullable=False)
    media_url = Column(String(500), nullable=False)
    media_type = Column(String(20), default="image") # image, video
    is_cover = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)

    service = relationship("Service", back_populates="media")
