# 08. AI AGENTLAR UCHUN TAYYOR PROMPTLAR TO‘PLAMI (AI PROMPTS PLAYBOOK)

> **Ushbu fayl nima uchun?**  
> Siz bu yerdagi tayyor promptlarni shundayligicha nusxalab (copy qilib), istalgan AI ga (Gemini, Claude, GPT-4o, Cursor yoki Antigravity agentlariga) bersangiz, u loyihaning tegishli qismini hech qanday chalkashliksiz, xalqaro gigantlar (Airbnb, Uber) darajasida professional qilib kodlab beradi.

---

## 📋 Promptlar Mundarijasi:
1. [📱 Prompt 1: Mobil Ilova UI/UX & Dizayn Tizimi (React Native / Expo)](#-prompt-1-mobil-ilova-uiux-va-dizayn-tizimi)
2. [⚙️ Prompt 2: Backend va Maʼlumotlar Bazasi (PostgreSQL + API)](#-prompt-2-backend-va-malumotlar-bazasi-arxitektori)
3. [📅 Prompt 3: Jonli Kalendar va Double-Booking Himoyasi](#-prompt-3-jonli-kalendar-va-bronlash-tizimi)
4. [💍 Prompt 4: AI To‘y Byudjeti Kalkulyatori](#-prompt-4-ai-toy-byudjeti-kalkulyatori)
5. [💌 Prompt 5: Raqamli Taklifnoma va QR RSVP Studiyasi](#-prompt-5-raqamli-taklifnoma-va-qr-rsvp-studiyasi)
6. [💳 Prompt 6: To‘lov Tizimlari (Click, Payme) va Escrow](#-prompt-6-tolov-tizimlari-click-payme-va-xavfsiz-depozit)

---

## 📱 Prompt 1: Mobil Ilova UI/UX va Dizayn Tizimi
*(Buni React Native / Mobile dasturchi AI agentiga bering)*

```text
Sen — dunyoning eng yetakchi mobil ilova dizayneri va Senior React Native (Expo) dasturchisisan. Biz O‘zbekiston va Markaziy Osiyo uchun «Tuyxona (Marosimlar)» nomli to‘y va marosimlar super-ilovasini yaratyapmiz. 

Loyihaning to‘liq dizayn spetsifikatsiyasi bilan tanishib chiq:
👉 Fayl: docs/02_MOBILE_APP_DESIGN_SYSTEM.md

Vazifang:
1. `mobile/` papkasida React Native + Expo (TypeScript) arxitekturasini sozlash.
2. Dizayn tili: «Modern Luxury & Glassmorphism» (Oltin tus #D4AF37, Tungi Obsidian #0B0E14, Ipak oq #F8F9FA).
3. Quyidagi asosiy dizayn komponentlarini yarat:
   - `LuxuryCard` (Glassmorphism effektli, silliq hoshiyali kartochka)
   - `GoldButton` (Taktil tebranish — Haptic feedback bilan ishlovchi premium tugma)
   - `BadgeVerified` (Ko‘k tasdiqlanganlik nishoni)
   - `CategoryPillBar` (To‘yxona, Sanʼatkor, Foto-video toifalari karuseli)
   - `LuxuryRating` (Yulduzchalar va sharhlar soni ko‘rinishi)
4. Bosh sahifa (Home Feed) va Xizmat batafsil sahifasi (`ServiceDetail`) UI-ni 120fps silliq animatsiyalar (Reanimated 3) va Shopify FlashList bilan kodlab ber.

Kod faqat eng yuqori sifatli TypeScript, toza arxitektura va modulli komponentlar shaklida bo‘lsin.
```

---

## ⚙️ Prompt 2: Backend va Maʼlumotlar Bazasi Arxitektori
*(Buni Backend va DB ustida ishlovchi AI agentiga bering)*

```text
Sen — High-Load tizimlar va FinTech arxitekturasi bo‘yicha dunyo darajasidagi Senior Backend Muhandisisan (FastAPI / Django Ninja / PostgreSQL). Biz «Tuyxona» to‘y ekotizimining mustahkam backendini quryapmiz.

Loyihaning arxitekturasi va baza sxemasi bilan tanishib chiq:
👉 Fayllar: docs/04_ENTERPRISE_SYSTEM_ARCHITECTURE.md va docs/05_DATABASE_SCHEMA_AND_MODELS.md

Vazifang:
1. `backend/` papkasida loyiha poydevorini qurish.
2. PostgreSQL 16 + PostGIS kengaytmasi asosida quyidagi jadvallar va ORM modellarini yarat:
   - `users` (SMS OTP orqali autentifikatsiya, JWT tokenlar rotatsiyasi)
   - `vendor_profiles` (Xizmat ko‘rsatuvchi kompaniya/shaxs profili, reyting)
   - `event_types`, `service_categories`
   - `services` (PostGIS `Point` koordinatalari, narx, shahar, tuman)
3. Foydalanuvchining GPS koordinatasi (lat, lng) bo‘yicha eng yaqin to‘yxona va xizmatlarni millisekundlarda topib beruvchi Spatial API (`GET /api/v1/services/nearest`) endpointini yarat.
4. Barcha jadvallarga kerakli B-Tree va GIST indekslarni to‘liq o‘rnat.
```

---

## 📅 Prompt 3: Jonli Kalendar va Bronlash Tizimi
*(Buni Kalendar va Booking bo‘yicha ishlovchi AI agentiga bering)*

```text
Sen — Airbnb va Booking.com darajasidagi bronlash va kalendar tizimlari bo‘yicha mutaxassis dasturchisan. Bizga xizmat ko‘rsatuvchilar (to‘yxonalar, sanʼatkorlar) ning bo‘sh/band kunlarini real-vaqtda boshqaruvchi «Jonli Kalendar» kerak.

Loyihaning funksional talablari bilan tanish:
👉 Fayllar: docs/03_FEATURES_AND_FUNCTIONAL_SPEC.md va docs/06_API_AND_INTEGRATION_SPEC.md

Vazifang:
1. `service_calendar_days` jadvali uchun to‘liq mantiqni yoz:
   - Yashil: `work` (Bo‘sh kun)
   - Qizil: `booked` (Band kun)
   - Kulrang: `off` (Dam olish kuni)
2. Double-Booking (bir kunga 2 ta to‘y olib qo‘yish)dan 100% himoya: Redis orqali Distributed Lock (Redlock) algoritmini joriy et.
3. Mobil ilova uchun React Native interaktiv oy kalendari komponentini (`InteractiveBookingCalendar`) yarat: foydalanuvchi sanani bosganda pastdan nafis Modal Sheet ochilsin, vaqt sloti (Osh / Bazm) va mehmon sonini tanlab, bron so‘rovi yuborilsin.
4. WebSocket orqali sananing bandlik holati o‘zgarganda barcha ulangan foydalanuvchilar ekranida sahifani yangilamasdan avtomat qizilga aylansin.
```

---

## 💍 Prompt 4: AI To‘y Byudjeti Kalkulyatori
*(Buni Kalkulyator va Tavsiya algoritmlari bo‘yicha AI agentiga bering)*

```text
Sen — Smart FinTech algoritmlari va interaktiv maʼlumotlar vizualizatsiyasi bo‘yicha yetakchi dasturchisan. Bizga bo‘lajak kelin-kuyovlar va to‘y egalari uchun «To‘y Byudjeti Kalkulyatori» kerak.

Dizayn va funksional talablar:
👉 Fayllar: docs/02_MOBILE_APP_DESIGN_SYSTEM.md va docs/03_FEATURES_AND_FUNCTIONAL_SPEC.md

Vazifang:
1. Mobil ilova uchun interaktiv Byudjet Kalkulyatori ekranini (`BudgetPlannerScreen`) yarat.
2. Foydalanuvchi umumiy byudjetni (masalan: 80,000,000 so‘m) kiritganda yoki slayderni surtganda:
   - Silliq animatsiyali Donut Chart (To‘yxona: 50%, Sanʼatkor: 20%, Foto-video: 12%, Liboslar: 10%, Kortej: 5%, Bezak: 3%) dinamik hisoblansin.
3. Har bir xarajat bandining tagida mavjud byudjetga to‘g‘ri keladigan bazadagi real xizmatlar (To‘yxona, Xonanda va h.k.) avtomat tavsiya qilib chiqarilsin.
4. Foydalanuvchi tanlagan xizmatlarini bitta «Mening to‘y paketim» savatchasiga saqlay olsin.
```

---

## 💌 Prompt 5: Raqamli Taklifnoma va QR RSVP Studiyasi
*(Buni Taklifnomalar va Web/Telegram integratsiyasi bo‘yicha AI agentiga bering)*

```text
Sen — Zamonaviy veb va Telegram integratsiyalari bo‘yicha Senior dasturchisan. Bizga qog‘oz taklifnomalar o‘rnini bosuvchi zamonaviy «Raqamli To‘y Taklifnomasi va QR RSVP» tizimi kerak.

Loyihaning funksional talablari:
👉 Fayllar: docs/03_FEATURES_AND_FUNCTIONAL_SPEC.md va docs/05_DATABASE_SCHEMA_AND_MODELS.md

Vazifang:
1. To‘y egalari ilova orqali shaxsiy taklifnoma yarata oladigan studiya interfeysini qur.
2. Har bir to‘y uchun unikal chiroyli havola ochilsin: `tuyxona.uz/invite/{kelin-kuyov-slug}`:
   - Oltin tusli nafis animatsiya, to‘y kuni ortga hisoblash taymeri (Countdown).
   - To‘yxona manzili va xarita (Yandex / Google Maps).
   - Sevgi qissasi (Love Story) fotosuratlari va musiqiy orqa fon.
3. RSVP Mehmonlar shakli: Mehmon Telegram yoki brauzer orqali kirib «Albatta boraman» yoki «Bora olmayman» deb belgilaydi.
4. To‘y egasining mobil ilovasida mehmonlar statistikasi (Keluvchilar soni, tabrik so‘zlari) real-vaqtda ko‘rinib tursin.
```

---

## 💳 Prompt 6: To‘lov Tizimlari (Click, Payme) va Xavfsiz Depozit
*(Buni To‘lovlar va Xavfsizlik bo‘yicha AI agentiga bering)*

```text
Sen — O‘zbekiston to‘lov tizimlari (Click, Payme, Uzum Bank) va Escrow xavfsiz depozit mexanizmlari bo‘yicha tajribali backend mutaxassisisan.

API shartnomasi va talablar:
👉 Fayllar: docs/04_ENTERPRISE_SYSTEM_ARCHITECTURE.md va docs/06_API_AND_INTEGRATION_SPEC.md

Vazifang:
1. Click (Prepare & Complete) va Payme (JSON-RPC 2.0) protokollarini to‘liq amalga oshiruvchi xavfsiz Webhook routerlarini yarat.
2. Tranzaksiyalar xavfsizligi:
   - HMAC SHA-256 va MD5 signaturalarini tekshirish.
   - Idempotency himoyasi (bir xil tranzaksiya qayta yuborilganda pul ikki marta yechilmasligi).
3. Xavfsiz Depozit (Escrow) tizimini qur: mijoz to‘lagan avans summa platformada saqlanadi, to‘y o‘tgach va tomonlar tasdiqlagach provayder balansiga o‘tkaziladi.
4. Har bir to‘lovdan so‘ng avtomatik tarzda kalendardagi sanani `booked` holatiga o‘tkazish va ikkala tomonga SMS (Eskiz) yuborish logikasini bog‘la.
```
