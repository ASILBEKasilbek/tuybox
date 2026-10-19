from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.database import get_db
from app.models.user import User
from app.schemas.auth import SendOTPRequest, VerifyOTPRequest, TokenResponse, UserResponse
from app.core.security import create_access_token

router = APIRouter(prefix="/auth", tags=["Autentifikatsiya"])

# In-memory OTP storage for mock/demo (Eskiz SMS bilan ulanadi)
_MOCK_OTP_CODES = {"+998901234567": "123456", "+998900000000": "777777"}

@router.post("/send-otp")
async def send_otp(request: SendOTPRequest):
    """
    Foydalanuvchi telefon raqamiga SMS OTP kod yuborish.
    """
    phone = request.phone.strip()
    # Mock kod generatsiyasi
    _MOCK_OTP_CODES[phone] = "123456" # Dev rejimida doim 123456
    return {
        "success": True,
        "message": f"Tasdiqlash kodi {phone} raqamiga yuborildi (Dev kodi: 123456)",
        "retry_after_seconds": 60
    }

@router.post("/verify-otp", response_model=TokenResponse)
async def verify_otp(request: VerifyOTPRequest, db: AsyncSession = Depends(get_db)):
    """
    SMS kodni tekshirish, foydalanuvchini ro'yxatdan o'tkazish yoki tizimga kiritish, JWT token berish.
    """
    phone = request.phone.strip()
    code = request.code.strip()

    valid_code = _MOCK_OTP_CODES.get(phone, "123456")
    if code != valid_code and code != "123456":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Kiritilgan kod noto'g'ri")

    # Foydalanuvchini topish yoki yangi yaratish
    result = await db.execute(select(User).where(User.phone == phone))
    user = result.scalars().first()

    if not user:
        user = User(phone=phone, is_phone_verified=True, role="customer")
        db.add(user)
        await db.flush()
        await db.refresh(user)
    else:
        user.is_phone_verified = True

    access_token = create_access_token(data={"sub": str(user.id), "phone": user.phone, "role": user.role})
    refresh_token = create_access_token(data={"sub": str(user.id), "type": "refresh"})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": user
    }
