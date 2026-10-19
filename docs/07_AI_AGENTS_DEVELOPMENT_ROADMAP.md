# 07. AI AGENTLAR VA JAMOA UCHUN BOSQICHMA-BOSQICH YO‘L XARITASI (ROADMAP)

> Ushbu yo‘l xaritasi bir nechta mustaqil **AI agentlar** yoki dasturchilarning bir-biriga xalaqit bermasdan, parallel ravishda ishlashi uchun maxsus ishlab chiqilgan.

---

## 1. AI Agentlar Rol Taqsimoti (Agent Specialization)

Har bir AI agent o‘zining aniq masʼuliyat sohasiga ega va belgilangan hujjat asosida ish olib boradi:

```
┌────────────────────────────────────────────────────────┐
│               👑 Orchestrator / Lead AI                │
│       (Barcha agentlar natijalarini birlashtiradi)     │
└────────────┬──────────────┬──────────────┬─────────────┘
             │              │              │
     ┌───────▼──────┐ ┌─────▼───────┐ ┌────▼────────┐
     │  Backend AI  │ │  Mobile AI  │ │ Integrations│
     │  (Database & │ │ (React Nat. │ │ (Payments & │
     │   Core API)  │ │   UI/UX)    │ │   Telegram) │
     └──────────────┘ └─────────────┘ └─────────────┘
```

| Agent Nomi | Masʼuliyat Sohasi | Qaysi Hujjatga Qaraydi? |
| :--- | :--- | :--- |
| **🤖 Agent 1: Database & Backend AI** | PostgreSQL, PostGIS, Migratsiyalar, Core REST API, Auth, Xizmatlar boshqaruvi | [04](file:///Users/apple/Desktop/Tuyxona/docs/04_ENTERPRISE_SYSTEM_ARCHITECTURE.md), [05](file:///Users/apple/Desktop/Tuyxona/docs/05_DATABASE_SCHEMA_AND_MODELS.md) |
| **🎨 Agent 2: Mobile UI & Design AI** | React Native (Expo) komponentlari, Luxury dizayn tizimi, Animatsiyalar, Ekranlar | [02](file:///Users/apple/Desktop/Tuyxona/docs/02_MOBILE_APP_DESIGN_SYSTEM.md) |
| **📅 Agent 3: Calendar & Booking AI** | Jonli interaktiv kalendar, Double-booking himoyasi (Redis lock), Bron qilish oqimi | [03](file:///Users/apple/Desktop/Tuyxona/docs/03_FEATURES_AND_FUNCTIONAL_SPEC.md), [06](file:///Users/apple/Desktop/Tuyxona/docs/06_API_AND_INTEGRATION_SPEC.md) |
| **💳 Agent 4: Payments & Integrations AI**| Click, Payme, Uzum to‘lov shlyuzlari, Eskiz SMS OTP, WebSocket real-time gateway | [06](file:///Users/apple/Desktop/Tuyxona/docs/06_API_AND_INTEGRATION_SPEC.md) |
| **💌 Agent 5: RSVP & AI Planner AI** | To‘y Byudjeti Kalkulyatori, Raqamli Taklifnoma Studiyasi, AI to‘y tavsiyalari | [02](file:///Users/apple/Desktop/Tuyxona/docs/02_MOBILE_APP_DESIGN_SYSTEM.md), [03](file:///Users/apple/Desktop/Tuyxona/docs/03_FEATURES_AND_FUNCTIONAL_SPEC.md) |

---

## 2. Bosqichlar (Sprintlar) va Vazifalar Ketma-ketligi

### 🏁 1-Faza: Poydevor va Arxitektura (Foundation)
* [ ] **Backend AI:** Yangi `backend/` papkasida loyihani sozlash, PostgreSQL + PostGIS ulash, [05_DATABASE_SCHEMA_AND_MODELS.md](file:///Users/apple/Desktop/Tuyxona/docs/05_DATABASE_SCHEMA_AND_MODELS.md) bo‘yicha modellarni yaratish.
* [ ] **Mobile AI:** `mobile/` papkasida React Native (Expo) loyihasini yaratish, [02_MOBILE_APP_DESIGN_SYSTEM.md](file:///Users/apple/Desktop/Tuyxona/docs/02_MOBILE_APP_DESIGN_SYSTEM.md) dagi ranglar, shriftlar va asosiy komponentlarni (Button, Input, Card, Modal) sozlash.
* [ ] **Integrations AI:** SMS OTP yuborish va tekshirish mexanizmini qurish.

### 🚀 2-Faza: Xizmatlar Katalogi va Qidiruv (Discovery)
* [ ] **Backend AI:** `/services` qidiruv API sini yaratish (kategoriyalar, narx, masofa, reyting filtrlari).
* [ ] **Mobile AI:** Bosh sahifa (Home Feed), Toifalar karuseli, Xizmat kartochkalari va Qidiruv ekranlarini kodlash.
* [ ] **Mobile AI:** Xizmatning batafsil sahifasi (`ServiceDetail`) va 4K galereya ko‘rinishini bitirish.

### 📅 3-Faza: Jonli Kalendar va Bronlash Tizimi (Core Booking Engine)
* [ ] **Calendar AI:** Xizmat ko‘rsatuvchi uchun kalendar boshqaruv API si va Redis orqali lock mexanizmini yaratish.
* [ ] **Mobile AI:** Hashamatli interaktiv oy kalendarini (yashil, qizil, kulrang holatlar) ishlab chiqish.
* [ ] **Calendar AI:** Bron qilish so‘rovi (Booking modal sheet) va buyurtma holatlarini boshqarish.

### 💳 4-Faza: Xavfsiz To‘lovlar va SMS/Push Bildirishnomalar
* [ ] **Payments AI:** Click va Payme to‘lov havolalarini generatsiya qilish va Webhook larni yozish.
* [ ] **Backend AI:** WebSocket Gateway orqali real-vaqtda buyurtma statusini yangilash.
* [ ] **Mobile AI:** Foydalanuvchi va Provayder profillari, «Mening Buyurtmalarim» ekrani.

### 💎 5-Faza: AI Byudjet Kalkulyatori va Raqamli Taklifnomalar
* [ ] **RSVP AI:** Interaktiv Byudjet Kalkulyatori vidjeti (Donut chart va xizmatlar tavsiyasi).
* [ ] **RSVP AI:** Raqamli Taklifnoma yaratish interfeysi va mehmonga yuboriladigan chiroyli veb-sahifa.
* [ ] **RSVP AI:** Mehmonlarning «Boraman» / «Bormayman» javoblarini to‘y egasi ekranida jonli hisoblash.

### 🛡️ 6-Faza: Testlash, Xavfsizlik va App Store / Play Marketga Chiqarish
* [ ] Har bir API endpoint uchun Unit & Integration testlar.
* [ ] EAS Build orqali iOS (.ipa) va Android (.aab) fayllarini yig‘ish.
* [ ] Apple App Store va Google Play Marketga ilovani joylashtirish.
