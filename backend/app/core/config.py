from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "TuyBox Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Xavfsizlik
    SECRET_KEY: str = "SUPER_SECRET_KEY_FOR_TUYXONA_2026_CHANGE_IN_PRODUCTION"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 kun
    ALGORITHM: str = "HS256"
    
    # Ma'lumotlar bazasi
    # Developmentda SQLite yoki Postgres
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/tuyxona_db"
    
    # Redis (Kesh, Double booking lock, WebSockets)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["*"]
    
    # Eskiz SMS Provayder
    ESKIZ_EMAIL: str = "tuyxona@info.uz"
    ESKIZ_PASSWORD: str = "mock_secret"
    
    # To'lov Tizimlari
    CLICK_MERCHANT_ID: str = "mock_click_merchant"
    CLICK_SERVICE_ID: str = "mock_click_service"
    CLICK_SECRET_KEY: str = "mock_click_secret"
    
    PAYME_MERCHANT_ID: str = "mock_payme_merchant"
    PAYME_SECRET_KEY: str = "mock_payme_secret"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
