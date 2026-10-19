from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Optional

from app.db.database import get_db
from app.models.service import Service, ServiceCategory, ServiceMedia
from app.schemas.service import ServiceListSchema, ServiceDetailSchema
from app.services.geo import calculate_haversine_distance

router = APIRouter(prefix="/services", tags=["Xizmatlar va Qidiruv"])

@router.get("", response_model=List[ServiceListSchema])
async def list_services(
    category_slug: Optional[str] = None,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
    db: AsyncSession = Depends(get_db)
):
    """
    Xizmatlarni filtrlash va saralash orqali ro'yxatini olish.
    """
    stmt = (
        select(Service)
        .options(selectinload(Service.category), selectinload(Service.media))
        .where(Service.is_active == True)
    )

    if city:
        stmt = stmt.where(Service.city.ilike(f"%{city}%"))
    if min_price is not None:
        stmt = stmt.where(Service.base_price >= min_price)
    if max_price is not None:
        stmt = stmt.where(Service.base_price <= max_price)

    result = await db.execute(stmt)
    services = result.scalars().all()

    response = []
    for s in services:
        dist = None
        if lat is not None and lng is not None and s.latitude and s.longitude:
            dist = calculate_haversine_distance(lat, lng, s.latitude, s.longitude)

        cover_img = None
        for m in s.media:
            if m.is_cover or cover_img is None:
                cover_img = m.media_url

        response.append(ServiceListSchema(
            id=s.id,
            title=s.title,
            slug=s.slug,
            base_price=float(s.base_price),
            city=s.city,
            district=s.district,
            rating_avg=float(s.rating_avg),
            reviews_count=s.reviews_count,
            cover_image=cover_img,
            distance_km=dist,
            category_name=s.category.name if s.category else None
        ))

    # Agar GPS berilgan bo'lsa, masofasi bo'yicha saralash
    if lat is not None and lng is not None:
        response.sort(key=lambda x: x.distance_km if x.distance_km is not None else 99999)

    return response

@router.get("/{slug}", response_model=ServiceDetailSchema)
async def get_service_detail(slug: str, db: AsyncSession = Depends(get_db)):
    """
    Xizmatning to'liq tafsilotlari (paketlar, rasmlar, provayder profili).
    """
    stmt = (
        select(Service)
        .options(
            selectinload(Service.packages),
            selectinload(Service.media),
            selectinload(Service.vendor)
        )
        .where(Service.slug == slug)
    )
    result = await db.execute(stmt)
    s = result.scalars().first()

    if not s:
        raise HTTPException(status_code=404, detail="Xizmat topilmadi")

    return ServiceDetailSchema(
        id=s.id,
        title=s.title,
        slug=s.slug,
        description=s.description,
        base_price=float(s.base_price),
        price_type=s.price_type,
        city=s.city,
        district=s.district,
        address_line=s.address_line,
        latitude=s.latitude,
        longitude=s.longitude,
        rating_avg=float(s.rating_avg),
        reviews_count=s.reviews_count,
        vendor_business_name=s.vendor.business_name if s.vendor else "Xizmat ko'rsatuvchi",
        vendor_is_verified=s.vendor.is_verified if s.vendor else False,
        packages=s.packages,
        media=s.media
    )
