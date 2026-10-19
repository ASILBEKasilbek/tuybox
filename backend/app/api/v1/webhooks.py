from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
import json

from app.db.database import get_db
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.calendar import ServiceCalendarDay
from app.core.config import settings

router = APIRouter(prefix="/webhooks", tags=["To'lov Webhooklari"])

@router.post("/click")
async def click_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Click to'lov tizimining Prepare va Complete webhooksini qabul qilish.
    """
    form_data = await request.form()
    click_trans_id = form_data.get("click_trans_id")
    merchant_trans_id = form_data.get("merchant_trans_id") # Bu bizdagi booking_id
    amount = form_data.get("amount")
    action = form_data.get("action")
    error = form_data.get("error", "0")

    if not merchant_trans_id:
        return {"error": -8, "error_note": "Error in request from click"}

    try:
        booking_id = int(merchant_trans_id)
    except ValueError:
        return {"error": -8, "error_note": "Invalid booking ID"}

    result = await db.execute(select(Booking).where(Booking.id == booking_id))
    booking = result.scalars().first()
    if not booking:
        return {"error": -5, "error_note": "User/Booking does not exist"}

    # Complete action (action == "1")
    if str(action) == "1":
        # 1. Buyurtmani to'langan (escrow) holatiga o'tkazish
        booking.escrow_status = "held_in_escrow"
        booking.status = "confirmed"

        # 2. Kalendardagi sanani rasman band (booked) qilish
        cal_res = await db.execute(
            select(ServiceCalendarDay).where(
                ServiceCalendarDay.service_id == booking.service_id,
                ServiceCalendarDay.calendar_date == booking.event_date,
                ServiceCalendarDay.time_slot == booking.time_slot
            )
        )
        cal_day = cal_res.scalars().first()
        if cal_day:
            cal_day.status = "booked"
        else:
            db.add(ServiceCalendarDay(
                service_id=booking.service_id,
                calendar_date=booking.event_date,
                time_slot=booking.time_slot,
                status="booked"
            ))

        # 3. To'lov tarixini yozish
        payment = Payment(
            booking_id=booking.id,
            provider="click",
            transaction_id=str(click_trans_id),
            amount=float(amount),
            status="success",
            raw_payload=json.dumps(dict(form_data))
        )
        db.add(payment)
        await db.commit()

        return {
            "click_trans_id": click_trans_id,
            "merchant_trans_id": merchant_trans_id,
            "merchant_confirm_id": booking.id,
            "error": 0,
            "error_note": "Success"
        }

    # Prepare action (action == "0")
    return {
        "click_trans_id": click_trans_id,
        "merchant_trans_id": merchant_trans_id,
        "merchant_prepare_id": booking.id,
        "error": 0,
        "error_note": "Success"
    }

@router.post("/payme")
async def payme_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Payme JSON-RPC 2.0 to'lov webhooksini qabul qilish.
    """
    body = await request.json()
    method = body.get("method")
    params = body.get("params", {})
    req_id = body.get("id")

    if method == "CheckPerformTransaction":
        return {
            "result": {"allow": True},
            "id": req_id
        }

    elif method == "PerformTransaction":
        account = params.get("account", {})
        booking_id = account.get("booking_id")
        amount = params.get("amount", 0) / 100 # Tiyindan so'mga

        if booking_id:
            result = await db.execute(select(Booking).where(Booking.id == int(booking_id)))
            booking = result.scalars().first()
            if booking:
                booking.escrow_status = "held_in_escrow"
                booking.status = "confirmed"

                # Kalendarda band qilish
                db.add(ServiceCalendarDay(
                    service_id=booking.service_id,
                    calendar_date=booking.event_date,
                    time_slot=booking.time_slot,
                    status="booked"
                ))

                payment = Payment(
                    booking_id=booking.id,
                    provider="payme",
                    transaction_id=params.get("id", "payme_tx"),
                    amount=amount,
                    status="success",
                    raw_payload=json.dumps(body)
                )
                db.add(payment)
                await db.commit()

        return {
            "result": {
                "transaction": params.get("id"),
                "perform_time": int(datetime.utcnow().timestamp() * 1000),
                "state": 2
            },
            "id": req_id
        }

    return {"error": {"code": -32601, "message": "Method not found"}, "id": req_id}
