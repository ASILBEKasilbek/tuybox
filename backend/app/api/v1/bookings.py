from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid
from datetime import datetime, date, timedelta

from app.db.database import get_db
from app.models.booking import Booking
from app.models.service import Service, ServicePackage
from app.models.calendar import ServiceCalendarDay
from app.models.user import User
from app.schemas.booking import BookingCreateRequest, BookingResponse, BookingActionRequest
from app.core.security import get_current_user
from app.services.redis_lock import acquire_calendar_lock
from app.services.payments.click import generate_click_payment_url
from app.services.payments.payme import generate_payme_payment_url

router = APIRouter(prefix="/bookings", tags=["Bronlash va Buyurtmalar"])

@router.post("", response_model=BookingResponse)
async def create_booking(
    request: BookingCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Yangi bronlash so'rovi (Redis lock bilan double-bookingdan himoyalangan).
    """
    # 1. Redis orqali ayni sana va vaqt uchun bloklash (lock)
    try:
        async with acquire_calendar_lock(request.service_id, str(request.event_date), request.time_slot):
            # Xizmatni bazadan tekshirish
            service_result = await db.execute(select(Service).where(Service.id == request.service_id))
            service = service_result.scalars().first()
            if not service:
                raise HTTPException(status_code=404, detail="Xizmat topilmadi")

            # Kun allaqachon band qilinganligini tekshirish
            cal_result = await db.execute(
                select(ServiceCalendarDay).where(
                    ServiceCalendarDay.service_id == request.service_id,
                    ServiceCalendarDay.calendar_date == request.event_date,
                    ServiceCalendarDay.time_slot == request.time_slot,
                    ServiceCalendarDay.status == "booked"
                )
            )
            if cal_result.scalars().first():
                raise HTTPException(status_code=400, detail="Tanlangan sana allaqachon band qilingan")

            # Narxni hisoblash
            total_price = float(service.base_price)
            if request.package_id:
                pkg_result = await db.execute(select(ServicePackage).where(ServicePackage.id == request.package_id))
                pkg = pkg_result.scalars().first()
                if pkg:
                    total_price = float(pkg.price)

            deposit_amount = round(total_price * 0.10, 2) # 10% avans
            code = f"TX-{uuid.uuid4().hex[:6].upper()}"

            new_booking = Booking(
                booking_code=code,
                customer_id=current_user.id,
                service_id=service.id,
                event_date=request.event_date,
                time_slot=request.time_slot,
                guest_count=request.guest_count,
                total_price=total_price,
                deposit_amount=deposit_amount,
                status="pending",
                escrow_status="unpaid",
                customer_notes=request.customer_notes
            )
            db.add(new_booking)
            await db.flush()
            await db.refresh(new_booking)

            return BookingResponse(
                id=new_booking.id,
                booking_code=new_booking.booking_code,
                service_id=service.id,
                service_title=service.title,
                event_date=new_booking.event_date,
                time_slot=new_booking.time_slot,
                total_price=float(new_booking.total_price),
                deposit_amount=float(new_booking.deposit_amount),
                status=new_booking.status,
                escrow_status=new_booking.escrow_status,
                created_at=new_booking.created_at
            )

    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))

@router.get("/my", response_model=List[BookingResponse])
async def list_my_bookings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Foydalanuvchining barcha bron qilgan buyurtmalari.
    """
    stmt = (
        select(Booking)
        .options(selectinload(Booking.service))
        .where(Booking.customer_id == current_user.id)
        .order_by(Booking.created_at.desc())
    )
    result = await db.execute(stmt)
    bookings = result.scalars().all()

    return [
        BookingResponse(
            id=b.id,
            booking_code=b.booking_code,
            service_id=b.service_id,
            service_title=b.service.title if b.service else "Xizmat",
            event_date=b.event_date,
            time_slot=b.time_slot,
            total_price=float(b.total_price),
            deposit_amount=float(b.deposit_amount),
            status=b.status,
            escrow_status=b.escrow_status,
            created_at=b.created_at
        )
        for b in bookings
    ]

@router.post("/{id}/pay")
async def pay_booking_deposit(
    id: int,
    payment_method: str = "click", # click yoki payme
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Bron avansini to'lash uchun Click yoki Payme to'lov havolasini olish.
    """
    result = await db.execute(select(Booking).where(Booking.id == id, Booking.customer_id == current_user.id))
    b = result.scalars().first()
    if not b:
        raise HTTPException(status_code=404, detail="Buyurtma topilmadi")

    if payment_method.lower() == "click":
        pay_url = generate_click_payment_url(b.id, float(b.deposit_amount))
    elif payment_method.lower() == "payme":
        pay_url = generate_payme_payment_url(b.id, float(b.deposit_amount))
    else:
        raise HTTPException(status_code=400, detail="Noma'lum to'lov usuli (faqat click yoki payme)")

    return {
        "booking_id": b.id,
        "amount": float(b.deposit_amount),
        "payment_method": payment_method,
        "payment_url": pay_url
    }

@router.post("/quick")
async def quick_booking_public(
    payload: dict,
    db: AsyncSession = Depends(get_db)
):
    """
    Telegram Mini App yoki Web Appdan to'g'ridan-to'g'ri tezkor bron so'rovi yuborish.
    """
    name = payload.get("name", "Mehmon").strip()
    phone = payload.get("phone", "").strip()
    service_id = int(payload.get("service_id", 1))
    event_date_str = payload.get("event_date")
    guest_count = int(payload.get("guest_count", 300))
    notes = payload.get("notes", "")

    if not phone:
        raise HTTPException(status_code=400, detail="Telefon raqami kiritilishi shart")

    # Sana aniqlash
    if event_date_str:
        try:
            event_d = datetime.strptime(event_date_str, "%Y-%m-%d").date()
        except Exception:
            event_d = date.today() + timedelta(days=30)
    else:
        event_d = date.today() + timedelta(days=30)

    # Foydalanuvchini topish yoki yaratish
    user_res = await db.execute(select(User).where(User.phone == phone))
    user = user_res.scalars().first()
    if not user:
        user = User(phone=phone, first_name=name, role="customer", is_phone_verified=True)
        db.add(user)
        await db.flush()

    # Xizmatni tekshirish
    srv_res = await db.execute(select(Service).where(Service.id == service_id))
    srv = srv_res.scalars().first()
    if not srv:
        # Birinchi xizmatni olish
        srv_res = await db.execute(select(Service))
        srv = srv_res.scalars().first()

    price = float(srv.base_price) if srv else 45000000.0
    code = f"TX-{uuid.uuid4().hex[:6].upper()}"

    new_booking = Booking(
        booking_code=code,
        customer_id=user.id,
        service_id=srv.id if srv else 1,
        event_date=event_d,
        time_slot="evening_party",
        guest_count=guest_count,
        total_price=price,
        deposit_amount=round(price * 0.10, 2),
        status="pending",
        customer_notes=f"Ism: {name}. {notes}"
    )
    db.add(new_booking)
    await db.commit()

    return {
        "status": "success",
        "booking_code": code,
        "message": "Buyurtmangiz muvaffaqiyatli qabul qilindi! Tez orada aloqaga chiqamiz. ✨"
    }

