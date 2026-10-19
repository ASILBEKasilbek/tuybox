import base64
from app.core.config import settings

def generate_payme_payment_url(booking_id: int, amount: float) -> str:
    """
    Payme to'lov tizimi uchun to'g'ridan-to'g'ri to'lov havolasi (amount tiyinda: sum * 100).
    """
    merchant_id = settings.PAYME_MERCHANT_ID
    amount_in_tiyin = int(amount * 100)
    raw_params = f"m={merchant_id};ac.booking_id={booking_id};a={amount_in_tiyin}"
    encoded_params = base64.b64encode(raw_params.encode('utf-8')).decode('utf-8')
    return f"https://checkout.paycom.uz/{encoded_params}"
