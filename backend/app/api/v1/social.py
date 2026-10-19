from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
import time

router = APIRouter(tags=["Reviews, Favorites & Offers"])

# In-Memory Data Stores for High-Performance Real-Time Interaction
REVIEWS_STORE = [
    {
        "id": 1,
        "service_id": 1,
        "author": "Dilshod Akramov",
        "rating": 5,
        "comment": "Versal zalida ukamning to'yini o'tkazdik. Xizmat, akustika va yoritish shousi Oliy darajada bo'ldi! Hammaga tavsiya qilaman.",
        "created_at": "3 kun oldin",
        "verified": True,
    },
    {
        "id": 2,
        "service_id": 1,
        "author": "Nodira Rahimova",
        "rating": 5,
        "comment": "Prezidium dekoratsiyasi va gullar juda chiroyli bezatilgan edi. 3D zalda qanday ko'rgan bo'lsak, hayotda xuddi shunday chiqdi.",
        "created_at": "1 hafta oldin",
        "verified": True,
    },
    {
        "id": 3,
        "service_id": 2,
        "author": "Shahzodbek",
        "rating": 5,
        "comment": "Jonli ijro guruhiga gap yo'q! Hamma mehmonlar miriqib raqsga tushishdi.",
        "created_at": "2 hafta oldin",
        "verified": True,
    }
]

FAVORITES_STORE = set([1, 3]) # Foydalanuvchi yoqtirgan service_id lari

OFFERS_STORE = [
    {
        "id": 1,
        "service_id": 1,
        "service_title": "Versal Grand Ballroom",
        "user_name": "Jasurbek",
        "date": "2026-11-15",
        "offered_price": 42000000,
        "original_price": 48000000,
        "guest_count": 550,
        "note": "Agar to'liq menyu olinadigan bo'lsa, 42 mln so'mga kelisha olamizmi?",
        "status": "accepted", # pending, accepted, rejected, countered
        "created_at": "Bugun 10:15",
    }
]

# Schemas
class CreateReviewRequest(BaseModel):
    service_id: int
    author: str = "Mehmon"
    rating: int
    comment: str

class ToggleFavoriteRequest(BaseModel):
    service_id: int

class CreateOfferRequest(BaseModel):
    service_id: int
    service_title: str
    user_name: str = "Jasurbek"
    date: str
    offered_price: float
    guest_count: int
    note: Optional[str] = ""

# --- REVIEWS ENDPOINTS ---
@router.get("/reviews/{service_id}")
async def get_service_reviews(service_id: int):
    items = [r for r in REVIEWS_STORE if r["service_id"] == service_id]
    avg = round(sum(r["rating"] for r in items) / len(items), 2) if items else 5.0
    return {
        "service_id": service_id,
        "average_rating": avg,
        "count": len(items),
        "reviews": items,
    }

@router.post("/reviews")
async def add_review(data: CreateReviewRequest):
    if data.rating < 1 or data.rating > 5:
        raise HTTPException(status_code=400, detail="Baho 1 dan 5 gacha bo'lishi kerak")
    
    new_rev = {
        "id": len(REVIEWS_STORE) + 1,
        "service_id": data.service_id,
        "author": data.author,
        "rating": data.rating,
        "comment": data.comment,
        "created_at": "Hozirgina",
        "verified": True,
    }
    REVIEWS_STORE.insert(0, new_rev)
    return {"status": "success", "message": "Fikringiz muvaffaqiyatli saqlandi!", "review": new_rev}

# --- FAVORITES ENDPOINTS ---
@router.get("/favorites")
async def get_favorites():
    return {"favorite_ids": list(FAVORITES_STORE)}

@router.post("/favorites/toggle")
async def toggle_favorite(data: ToggleFavoriteRequest):
    if data.service_id in FAVORITES_STORE:
        FAVORITES_STORE.remove(data.service_id)
        is_fav = False
    else:
        FAVORITES_STORE.add(data.service_id)
        is_fav = True
    return {"service_id": data.service_id, "is_favorite": is_fav}

# --- OFFERS ENDPOINTS ---
@router.get("/offers/my")
async def get_my_offers():
    return {"offers": OFFERS_STORE}

@router.post("/offers/send")
async def send_price_offer(data: CreateOfferRequest):
    new_offer = {
        "id": len(OFFERS_STORE) + 1,
        "service_id": data.service_id,
        "service_title": data.service_title,
        "user_name": data.user_name,
        "date": data.date,
        "offered_price": data.offered_price,
        "guest_count": data.guest_count,
        "note": data.note,
        "status": "pending",
        "created_at": "Hozirgina",
    }
    OFFERS_STORE.insert(0, new_offer)
    return {
        "status": "success",
        "message": f"{data.service_title} to'yxonasiga narx taklifingiz muvaffaqiyatli yuborildi!",
        "offer": new_offer,
    }
