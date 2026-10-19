import redis.asyncio as aioredis
from contextlib import asynccontextmanager
from app.core.config import settings

# Global redis client
try:
    redis_client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
except Exception:
    redis_client = None

# Fallback in-memory locks for local development
_local_memory_locks = set()

@asynccontextmanager
async def acquire_calendar_lock(service_id: int, event_date: str, time_slot: str = "all_day", timeout: int = 10):
    """
    Double-booking oldini olish uchun Distributed Lock (Redis Redlock algoritmi asosida).
    Bir vaqtning o'zida bir nechta so'rov bitta sanani bron qilmoqchi bo'lsa,
    faqat birinchi so'rov o'tadi, qolganlari 'Sana ayni damda bron qilinmoqda' xatosini oladi.
    """
    lock_key = f"lock:service:{service_id}:date:{event_date}:{time_slot}"
    acquired = False

    try:
        if redis_client:
            # Redis orqali lock olish (NX: faqat mavjud bo'lmasa, EX: timeout soniya)
            acquired = await redis_client.set(lock_key, "locked", nx=True, ex=timeout)
        else:
            if lock_key not in _local_memory_locks:
                _local_memory_locks.add(lock_key)
                acquired = True

        if not acquired:
            raise ValueError(f"Ushbu sana ({event_date}) ayni paytda boshqa mijoz tomonidan bron qilinmoqda. Iltimos, birozdan so'ng qayta urinib ko'ring.")

        yield acquired

    finally:
        if acquired:
            if redis_client:
                try:
                    await redis_client.delete(lock_key)
                except Exception:
                    pass
            else:
                _local_memory_locks.discard(lock_key)
