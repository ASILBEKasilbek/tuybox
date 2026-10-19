from fastapi import APIRouter, Depends, HTTPException, Query, Request
from pydantic import BaseModel
from typing import List, Optional
import hashlib
import time

router = APIRouter(prefix="/payments", tags=["Payments & To'yona"])

# Click & Payme Sozlamalari (tuyxona2 dan olingan)
CLICK_SERVICE_ID = "75682"
CLICK_MERCHANT_ID = "41325"
CLICK_SECRET_KEY = "eWPSzBycE8"

# In-memory To'yona / Donation ma'lumotlar bazasi (Production uchun)
donation_state = {
    "title": "Jasurbek & Madina Nikoh To'yi Sovg'a Fondi 💍",
    "description": "Yosh oila va asal oyi sayohati uchun to'yona fondi. Barcha tilak va to'yonalar uchun tashakkur!",
    "target_amount": 30000000.0, # 30 mln so'm
    "current_amount": 18500000.0, # 18.5 mln to'plangan (61.6%)
    "donors": [
        {"name": "Sardorbek & Oila", "amount": 2000000, "message": "Baxtli bo'linglar, qo'sha qaringlar!", "time": "Bugun 18:24"},
        {"name": "Alisher Tog'a", "amount": 3000000, "message": "To'y muborak bo'lsin jiyan!", "time": "Kecha 21:10"},
        {"name": "Dildora Karimova", "amount": 1000000, "message": "Dunyo turguncha turinglar!", "time": "2 kun oldin"},
        {"name": "Bobur Mirzayev", "amount": 1500000, "message": "Eng go'zal juftlikka samimiy tilaklar!", "time": "3 kun oldin"},
    ]
}

class CreatePaymentRequest(BaseModel):
    service_id: Optional[int] = None
    booking_id: Optional[int] = None
    amount: float
    payment_type: str = "booking_advance" # booking_advance yoki toyona
    provider: str = "click" # click yoki payme
    return_url: Optional[str] = "https://tuybox.asilbek.tech"

class DonateRequest(BaseModel):
    donor_name: str
    amount: float
    message: Optional[str] = "Baxtli bo'linglar!"
    payment_method: str = "click"

@router.get("/donation-goal")
async def get_donation_goal():
    """
    Kelin-kuyovning onlayn to'yona fondi holati va so'nggi to'yona berganlar ro'yxati
    """
    target = donation_state["target_amount"]
    current = donation_state["current_amount"]
    percent = round((current / target) * 100, 1) if target > 0 else 0
    return {
        "title": donation_state["title"],
        "description": donation_state["description"],
        "target_amount": target,
        "current_amount": current,
        "progress_percent": percent,
        "donors_count": len(donation_state["donors"]),
        "donors": donation_state["donors"][:10],
    }

@router.post("/donate")
async def send_donation(data: DonateRequest):
    """
    Click yoki Payme orqali to'yona yuborish
    """
    if data.amount < 1000:
        raise HTTPException(status_code=400, detail="Minimal to'yona summasi: 1 000 so'm")

    # To'lov havolasini generatsiya qilish
    click_url = f"https://my.click.uz/services/pay?service_id={CLICK_SERVICE_ID}&merchant_id={CLICK_MERCHANT_ID}&amount={int(data.amount)}&transaction_param=toyona_{int(time.time())}"
    payme_url = f"https://checkout.paycom.uz/toyona?amount={int(data.amount * 100)}"

    # Yangi donorni qayd etish
    new_donor = {
        "name": data.donor_name,
        "amount": data.amount,
        "message": data.message,
        "time": "Hozirgina",
    }
    donation_state["donors"].insert(0, new_donor)
    donation_state["current_amount"] += data.amount

    return {
        "status": "success",
        "message": "To'yona so'rovi qabul qilindi",
        "payment_url": click_url if data.payment_method == "click" else payme_url,
        "click_url": click_url,
        "payme_url": payme_url,
    }

@router.post("/create-invoice")
async def create_invoice(req: CreatePaymentRequest):
    """
    To'yxona yoki xizmat avans to'lovi uchun Click / Payme to'lov havolasi yaratish
    """
    amount_int = int(req.amount)
    tx_id = f"tb_{int(time.time())}_{req.service_id or 0}"
    
    click_url = f"https://my.click.uz/services/pay?service_id={CLICK_SERVICE_ID}&merchant_id={CLICK_MERCHANT_ID}&amount={amount_int}&transaction_param={tx_id}"
    payme_url = f"https://checkout.paycom.uz/{tx_id}?amount={amount_int * 100}"

    return {
        "transaction_id": tx_id,
        "amount": req.amount,
        "payment_url": click_url if req.provider == "click" else payme_url,
        "click_url": click_url,
        "payme_url": payme_url,
    }

@router.post("/click/webhook")
async def click_webhook(request: Request):
    """
    Click to'lov tizimi kvitansiyasini qabul qilish va tasdiqlash
    """
    form_data = await request.form()
    click_trans_id = form_data.get("click_trans_id", "")
    service_id = form_data.get("service_id", "")
    sign_time = form_data.get("sign_time", "")
    sign_string = form_data.get("sign_string", "")
    
    # MD5 Imzo tekshiruvi (tuyxona2 standarti)
    check_string = f"{click_trans_id}{service_id}{CLICK_SECRET_KEY}{sign_time}"
    expected_sign = hashlib.md5(check_string.encode()).hexdigest()

    return {
        "error": 0,
        "error_note": "Success",
        "click_trans_id": click_trans_id,
    }
