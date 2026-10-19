from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import date
import calendar

from app.db.database import get_db
from app.models.calendar import ServiceCalendarDay
from app.models.service import Service
from app.models.user import User
from app.schemas.calendar import CalendarMonthResponse, CalendarDayItem, CalendarToggleRequest
from app.core.security import get_current_user

router = APIRouter(prefix="/services/{service_id}/calendar", tags=["Jonli Kalendar"])

@router.get("", response_model=CalendarMonthResponse)
async def get_service_calendar(
    service_id: int,
    month: str = Query(..., example="2026-10", description="YYYY-MM formati"),
    db: AsyncSession = Depends(get_db)
):
    """
    Xizmatning oylik bandlik va bo'sh kunlari grafigini olish.
    """
    try:
        year, month_num = map(int, month.split("-"))
    except ValueError:
        raise HTTPException(status_code=400, detail="Noto'g'ri oy formati. Masalan: 2026-10")

    num_days = calendar.monthrange(year, month_num)[1]
    start_date = date(year, month_num, 1)
    end_date = date(year, month_num, num_days)

    stmt = select(ServiceCalendarDay).where(
        ServiceCalendarDay.service_id == service_id,
        ServiceCalendarDay.calendar_date >= start_date,
        ServiceCalendarDay.calendar_date <= end_date
    )
    result = await db.execute(stmt)
    existing_days = {d.calendar_date: d for d in result.scalars().all()}

    days_list = []
    for day in range(1, num_days + 1):
        current_date = date(year, month_num, day)
        if current_date in existing_days:
            rec = existing_days[current_date]
            days_list.append(CalendarDayItem(
                date=current_date,
                status=rec.status,
                time_slot=rec.time_slot,
                notes=rec.notes
            ))
        else:
            # Standart bo'yicha har bir kun ochiq/ish kuni
            days_list.append(CalendarDayItem(
                date=current_date,
                status="work",
                time_slot="all_day",
                notes=None
            ))

    return CalendarMonthResponse(
        service_id=service_id,
        month=month,
        days=days_list
    )

@router.post("/toggle")
async def toggle_calendar_day(
    service_id: int,
    request: CalendarToggleRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Xizmat ko'rsatuvchi tomonidan kunning holatini o'zgartirish (work, booked, off).
    """
    stmt = select(ServiceCalendarDay).where(
        ServiceCalendarDay.service_id == service_id,
        ServiceCalendarDay.calendar_date == request.date,
        ServiceCalendarDay.time_slot == request.time_slot
    )
    result = await db.execute(stmt)
    day_rec = result.scalars().first()

    if day_rec:
        day_rec.status = request.status
        day_rec.notes = request.notes
    else:
        day_rec = ServiceCalendarDay(
            service_id=service_id,
            calendar_date=request.date,
            status=request.status,
            time_slot=request.time_slot,
            notes=request.notes
        )
        db.add(day_rec)

    await db.commit()
    return {"success": True, "message": f"{request.date} kuni holati '{request.status}' deb belgilandi"}
