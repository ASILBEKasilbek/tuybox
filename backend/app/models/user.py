from sqlalchemy import Column, Integer, BigInteger, String, Boolean, DateTime, Text, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    phone = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(20), default="customer")  # customer, vendor, admin
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    is_phone_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    vendor_profile = relationship("VendorProfile", back_populates="user", uselist=False)
    bookings = relationship("Booking", back_populates="customer")
    invitations = relationship("DigitalInvitation", back_populates="user")


class VendorProfile(Base):
    __tablename__ = "vendor_profiles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    business_name = Column(String(200), nullable=False)
    slug = Column(String(220), unique=True, index=True, nullable=False)
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    cover_image_url = Column(String(500), nullable=True)
    instagram_url = Column(String(255), nullable=True)
    telegram_url = Column(String(255), nullable=True)
    youtube_url = Column(String(255), nullable=True)
    experience_years = Column(BigInteger, default=0)
    is_verified = Column(Boolean, default=False)
    rating_avg = Column(Numeric(3, 2), default=0.00)
    reviews_count = Column(BigInteger, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="vendor_profile")
    services = relationship("Service", back_populates="vendor")
