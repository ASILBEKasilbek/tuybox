import hashlib
from app.core.config import settings

def verify_click_signature(click_trans_id: str, service_id: str, secret_key: str, merchant_trans_id: str, amount: str, action: str, sign_time: str, sign_string: str) -> bool:
    """
    Click tizimidan kelgan so'rovning haqiqiyligini MD5 signatura orqali tekshirish.
    """
    raw_str = f"{click_trans_id}{service_id}{secret_key}{merchant_trans_id}{amount}{action}{sign_time}"
    calculated_sign = hashlib.md5(raw_str.encode('utf-8')).hexdigest()
    return calculated_sign.lower() == sign_string.lower()

def generate_click_payment_url(booking_id: int, amount: float) -> str:
    """
    Click ilovasi yoki veb-saytiga yo'naltiruvchi to'lov havolasini generatsiya qilish.
    """
    service_id = settings.CLICK_SERVICE_ID
    merchant_id = settings.CLICK_MERCHANT_ID
    return f"https://my.click.uz/services/pay?service_id={service_id}&merchant_id={merchant_id}&amount={amount}&transaction_param={booking_id}"
