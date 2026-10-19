from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete, update
from sqlalchemy.orm import selectinload
from typing import Dict, Any, List, Optional
from datetime import datetime, date
import uuid

from app.db.database import get_db
from app.models.service import Service, ServiceCategory, ServiceMedia, ServicePackage
from app.models.booking import Booking
from app.models.user import User, VendorProfile
from seed import reset_and_seed

router = APIRouter(prefix="/admin", tags=["TuyBox Admin Boshqaruvi"])

# 1. STATISTIKA DASHBOARD
@router.get("/stats")
async def get_admin_stats(db: AsyncSession = Depends(get_db)):
    """
    Admin paneldagi asosiy KPI ko'rsatkichlar.
    """
    total_services = await db.scalar(select(func.count(Service.id))) or 0
    total_bookings = await db.scalar(select(func.count(Booking.id))) or 0
    pending_bookings = await db.scalar(select(func.count(Booking.id)).where(Booking.status == "pending")) or 0
    confirmed_bookings = await db.scalar(select(func.count(Booking.id)).where(Booking.status == "confirmed")) or 0
    total_vendors = await db.scalar(select(func.count(VendorProfile.id))) or 0
    total_revenue = await db.scalar(select(func.sum(Booking.total_price)).where(Booking.status == "confirmed")) or 0

    return {
        "total_services": total_services,
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "confirmed_bookings": confirmed_bookings,
        "total_vendors": total_vendors,
        "total_revenue": float(total_revenue or 0)
    }

# 2. XIZMATLAR VA TO'YXONALAR RO'YXATI
@router.get("/services")
async def get_admin_services(db: AsyncSession = Depends(get_db)):
    """
    Barcha to'yxonalar va xizmatlarni boshqarish uchun olish.
    """
    stmt = (
        select(Service)
        .options(selectinload(Service.category), selectinload(Service.vendor), selectinload(Service.media))
        .order_by(Service.id.desc())
    )
    result = await db.execute(stmt)
    services = result.scalars().all()

    output = []
    for s in services:
        cover = s.media[0].media_url if s.media else "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800"
        output.append({
            "id": s.id,
            "title": s.title,
            "category": s.category.name if s.category else "Boshqa",
            "price": float(s.base_price),
            "district": s.district or "Toshkent",
            "rating": float(s.rating_avg or 5.0),
            "phone": s.vendor.user.phone if (s.vendor and s.vendor.user) else "+998712000000",
            "image": cover,
            "is_active": s.is_active
        })
    return output

# 3. YANGI XIZMAT QO'SHISH (ADMIN PANEL VA WEB APP UCHUN)
@router.post("/services")
async def create_service_admin(payload: Dict[str, Any] = Body(...), db: AsyncSession = Depends(get_db)):
    """
    Yangi to'yxona yoki xizmat qo'shish.
    """
    title = payload.get("title")
    price = float(payload.get("price", 30000000))
    district = payload.get("district", "Toshkent")
    phone = payload.get("phone", "+998901234567")
    category_slug = payload.get("category_slug", "toyxonalar")
    image_url = payload.get("image_url", "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800")
    desc = payload.get("description", title)

    # Kategoriyani topish
    cat_res = await db.execute(select(ServiceCategory).where(ServiceCategory.slug == category_slug))
    category = cat_res.scalars().first()
    if not category:
        cat_res = await db.execute(select(ServiceCategory))
        category = cat_res.scalars().first()

    # Vendor yaratish
    user = User(phone=phone, first_name=title[:20], role="vendor", is_phone_verified=True)
    db.add(user)
    await db.flush()

    slug = f"srv-{uuid.uuid4().hex[:6]}"
    v_prof = VendorProfile(
        user_id=user.id,
        business_name=title,
        slug=f"vendor-{slug}",
        cover_image_url=image_url,
        is_verified=True
    )
    db.add(v_prof)
    await db.flush()

    srv = Service(
        vendor_id=v_prof.id,
        category_id=category.id if category else 1,
        title=title,
        slug=slug,
        description=desc,
        base_price=price,
        city="Toshkent",
        district=district,
        address_line=f"{district}, Toshkent",
        latitude=41.2995,
        longitude=69.2401,
        rating_avg=5.0,
        reviews_count=1,
        is_active=True
    )
    db.add(srv)
    await db.flush()

    med = ServiceMedia(service_id=srv.id, media_url=image_url, is_cover=True)
    db.add(med)

    await db.commit()
    return {"status": "success", "id": srv.id, "message": "Xizmat muvaffaqiyatli qo'shildi!"}

# 4. XIZMATNI FAOL/NOFAOL QILISH
@router.patch("/services/{service_id}/toggle")
async def toggle_service(service_id: int, db: AsyncSession = Depends(get_db)):
    srv_res = await db.execute(select(Service).where(Service.id == service_id))
    srv = srv_res.scalars().first()
    if not srv:
        raise HTTPException(status_code=404, detail="Xizmat topilmadi")
    srv.is_active = not srv.is_active
    await db.commit()
    return {"status": "success", "is_active": srv.is_active}

# 5. XIZMATNI O'CHIRISH
@router.delete("/services/{service_id}")
async def delete_service(service_id: int, db: AsyncSession = Depends(get_db)):
    srv_res = await db.execute(select(Service).where(Service.id == service_id))
    srv = srv_res.scalars().first()
    if not srv:
        raise HTTPException(status_code=404, detail="Xizmat topilmadi")
    await db.delete(srv)
    await db.commit()
    return {"status": "success", "message": "Xizmat o'chirildi"}

# 6. MIJOZLAR BRONLARI RO'YXATI
@router.get("/bookings")
async def get_admin_bookings(db: AsyncSession = Depends(get_db)):
    """
    Barcha bronlar va mijoz arizalari.
    """
    stmt = (
        select(Booking)
        .options(selectinload(Booking.service), selectinload(Booking.customer))
        .order_by(Booking.id.desc())
    )
    result = await db.execute(stmt)
    bookings = result.scalars().all()

    output = []
    for b in bookings:
        output.append({
            "id": b.id,
            "code": b.booking_code,
            "customer_name": f"{b.customer.first_name or ''} {b.customer.last_name or ''}".strip() if b.customer else "Mehmon",
            "customer_phone": b.customer.phone if b.customer else "Noma'lum",
            "service_title": b.service.title if b.service else "O'chirilgan xizmat",
            "event_date": str(b.event_date),
            "guest_count": b.guest_count or 0,
            "total_price": float(b.total_price),
            "status": b.status,
            "notes": b.customer_notes or "",
            "created_at": b.created_at.strftime("%Y-%m-%d %H:%M") if b.created_at else ""
        })
    return output

# 7. BRON HOLATINI O'ZGARTIRISH
@router.patch("/bookings/{booking_id}/status")
async def update_booking_status(booking_id: int, payload: Dict[str, str] = Body(...), db: AsyncSession = Depends(get_db)):
    new_status = payload.get("status", "confirmed")
    b_res = await db.execute(select(Booking).where(Booking.id == booking_id))
    b = b_res.scalars().first()
    if not b:
        raise HTTPException(status_code=404, detail="Bron topilmadi")
    b.status = new_status
    await db.commit()
    return {"status": "success", "booking_id": b.id, "new_status": b.status}

# 8. BAZANI 0 DAN TOZALASH VA SEED QILISH (1-CLICK RESET)
@router.post("/reset-database")
async def reset_database():
    """
    Barcha jadvallarni tozalab, 0 dan toza va to'liq hashamatli ma'lumotlarni qayta tiklash.
    """
    try:
        await reset_and_seed()
        return {"status": "success", "message": "Ma'lumotlar bazasi 0 qilindi va yangi saralangan ma'lumotlar tiklandi! ✨"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Baza tozalashda xatolik: {str(e)}")
