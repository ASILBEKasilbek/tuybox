# 06. API VA INTEGRATSIYALAR SPETSIFIKATSIYASI (API CONTRACT)

> **Standart:** RESTful JSON API v1 + Real-Time WebSocket Gateway  
> **Asosiy URL:** `https://api.tuyxona.uz/api/v1`  
> **WebSocket URL:** `wss://api.tuyxona.uz/ws`

---

## 1. Autentifikatsiya (SMS OTP Flow)

### `POST /auth/send-otp`
Foydalanuvchining telefon raqamiga 6 xonali tasdiqlash kodini jo‘natish.
```json
// Request
{
  "phone": "+998901234567"
}

// Response (200 OK)
{
  "success": true,
  "message": "Tasdiqlash kodi SMS orqali yuborildi",
  "retry_after_seconds": 60
}
```

### `POST /auth/verify-otp`
SMS kodni tekshirish va JWT tokenlarni qaytarish.
```json
// Request
{
  "phone": "+998901234567",
  "code": "849201"
}

// Response (200 OK)
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refresh_token": "d8f7a6b5c4...",
  "expires_in": 900,
  "user": {
    "id": 1042,
    "phone": "+998901234567",
    "role": "customer",
    "first_name": "Asilbek"
  }
}
```

---

## 2. Xizmatlar va Qidiruv (Discovery API)

### `GET /services`
Filtrlar va geolokatsiya asosida xizmatlarni olish.
* **Query parametrlari:**
  - `category_slug=toyxonalar`
  - `event_type_slug=nikoh-toyi`
  - `date=2026-10-15` (Faqat shu kuni bo‘sh bo‘lganlar)
  - `lat=41.311081&lng=69.240562&radius_km=15` (GPS bo‘yicha masofa)
  - `min_price=10000000&max_price=50000000`
  - `sort=rating_desc` (`price_asc`, `popular`, `distance`)
  - `page=1&limit=20`

### `GET /services/{slug}`
Xizmatning to‘liq maʼlumotlari (paketlar, rasmlar, reyting va kontaktlar).

### `GET /services/{id}/calendar?month=2026-10`
Xizmatning oylik kalendarini olish.
```json
// Response (200 OK)
{
  "service_id": 45,
  "month": "2026-10",
  "days": [
    { "date": "2026-10-01", "status": "work", "time_slot": "all_day" },
    { "date": "2026-10-02", "status": "booked", "time_slot": "evening_party" },
    { "date": "2026-10-03", "status": "work", "time_slot": "all_day" },
    { "date": "2026-10-04", "status": "off", "time_slot": "all_day" }
  ]
}
```

---

## 3. Bronlash va Xavfsiz To‘lov (Booking & Escrow)

### `POST /bookings`
Yangi bron qilish so‘rovini yaratish.
```json
// Request (Headers: Authorization: Bearer <token>)
{
  "service_id": 45,
  "event_date": "2026-10-15",
  "time_slot": "evening_party",
  "guest_count": 350,
  "customer_notes": "Tort stolini sahnaga yaqinroq qo'yish kerak"
}

// Response (201 Created)
{
  "booking_id": 892,
  "booking_code": "TX-2026-892",
  "status": "pending",
  "total_price": 45000000,
  "required_deposit": 5000000,
  "payment_deadline": "2026-09-26T21:00:00Z"
}
```

### `POST /bookings/{id}/pay`
Depozit to‘lash uchun to‘lov havolasini shakllantirish (Click / Payme / Uzum).
```json
// Request
{
  "payment_method": "click" // yoki 'payme', 'uzum'
}

// Response (200 OK)
{
  "payment_url": "https://my.click.uz/services/pay?service_id=...&amount=5000000",
  "transaction_id": "tx_click_892019"
}
```

---

## 4. Raqamli Taklifnoma va RSVP API

### `GET /invitations/{slug}`
Mehmon uchun to‘y taklifnomasi sahifasining maʼlumotlari.

### `POST /invitations/{slug}/rsvp`
Mehmonning taklifnomaga javob berishi (Kelishi/kelmasligi).
```json
// Request
{
  "guest_name": "Sardor va oilasi",
  "phone": "+998931112233",
  "attendance_status": "attending", // 'attending', 'declined'
  "guests_count": 3,
  "congratulation_message": "Baxtli bo'linglar! Albatta boramiz!"
}
```

---

## 5. Webhook Integratsiyalari (Click / Payme)

* `POST /webhooks/payments/click` — Click Prepare & Complete protokolini qayta ishlash.
* `POST /webhooks/payments/payme` — Payme JSON-RPC 2.0 protokoli (CheckPerformTransaction, CreateTransaction, PerformTransaction).
* Har bir to‘lov muvaffaqiyatli bo‘lganda, kalendardagi sana avtomatik `booked` holatiga o‘tkaziladi va ikkala tomonga SMS/Push yuboriladi.

---

## 6. Real-Time WebSockets Aloqasi

Ulanish: `wss://api.tuyxona.uz/ws?token=<JWT_TOKEN>`

### Hodisalar (Events):
* `calendar:update`: Kalendardagi bo‘sh/band holat o‘zgarganda xabar tarqatish.
* `chat:message`: Xizmat ko‘rsatuvchi va mijoz o‘rtasida real-vaqt xabari.
* `booking:status_change`: Buyurtma qabul qilinganda mijoz telefoniga bildirishnoma.
