from pydantic import BaseModel, Field
from typing import Optional

class SendOTPRequest(BaseModel):
    phone: str = Field(..., example="+998901234567")

class VerifyOTPRequest(BaseModel):
    phone: str = Field(..., example="+998901234567")
    code: str = Field(..., example="123456")

class UserResponse(BaseModel):
    id: int
    phone: str
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_phone_verified: bool

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserResponse
