from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ServiceMediaSchema(BaseModel):
    id: int
    media_url: str
    media_type: str
    is_cover: bool

    class Config:
        from_attributes = True

class ServicePackageSchema(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    price: float
    features_json: Optional[str] = None

    class Config:
        from_attributes = True

class ServiceListSchema(BaseModel):
    id: int
    title: str
    slug: str
    base_price: float
    city: str
    district: Optional[str] = None
    rating_avg: float
    reviews_count: int
    cover_image: Optional[str] = None
    distance_km: Optional[float] = None
    category_name: Optional[str] = None

    class Config:
        from_attributes = True

class ServiceDetailSchema(BaseModel):
    id: int
    title: str
    slug: str
    description: str
    base_price: float
    price_type: str
    city: str
    district: Optional[str] = None
    address_line: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    rating_avg: float
    reviews_count: int
    vendor_business_name: str
    vendor_is_verified: bool
    packages: List[ServicePackageSchema] = []
    media: List[ServiceMediaSchema] = []

    class Config:
        from_attributes = True
