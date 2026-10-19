# 03. TO‘LIQ FUNKSIONAL SPETSIFIKATSIYA VA IMKONIYATLAR

> Ushbu hujjat platformaning har bir foydalanuvchi roli (Mijoz, Xizmat ko‘rsatuvchi, Moderator/Admin) uchun to‘liq funksional imkoniyatlarini batafsil ifodalaydi.

---

## 1. Buyurtmachi (Mijoz / Kelin-kuyov / Ota-ona) Funksiyalari

### 1.1. Ro‘yxatdan o‘tish va Xavfsizlik
* **Tezkor kirish:** O‘zbekiston telefon raqamlari orqali SMS OTP kod (Eskiz SMS provayderi).
* **Alternativ kirish:** Telegram Login Widget (1 bosishda kirish), Google Sign-In, Apple ID.
* **Biometriya:** Mobil ilovada FaceID / TouchID orqali tezkor kirish.

### 1.2. Qidiruv va Filtrlash (Smart Search)
* **Katta Qidiruv Dvigateli:** Matnli, ovozli va toifaviy qidiruv.
* **Filtr parametrlari:**
  - Tadbir turi: *Nikoh to‘yi, Fotiha, Sunnat to‘y, Beshik to‘y, Tug‘ilgan kun, Korporativ*.
  - Xizmat toifasi: *To‘yxona, Xonandalar, Boshlovchilar, Foto/Video, Kiyimlar, Kortej, Bezak, Oshpaz*.
  - Narx chegarasi: Minimal va maksimal narx (UZS / USD).
  - Joylashuv: Viloyat, tuman yoki GPS bo‘yicha masofa (Radius: 5km, 10km, 25km+).
  - Bo‘sh sana bo‘yicha: Aniq sana tanlanganda, faqat shu kuni BO‘SH bo‘lgan xizmatlarni chiqarish.
  - Reyting bo‘yicha: Faqat 4.5+ yulduzli, faqat verifikatsiyalangan (`Verified ✔`).

### 1.3. Interaktiv Xarita (PostGIS Geolocation)
* Foydalanuvchining turgan joyidan to‘yxona va studiyalarni xaritada klasterlar bilan ko‘rsatish.
* Kartochkani bosganda masofa (masalan: *«Sizdan 2.4 km uzoqlikda»*) va to‘g‘ridan-to‘g‘ri Yandex Navigator / Google Maps da yo‘nalish olish (marshrut).

### 1.4. Jonli Kalendar va Bronlash (Booking Engine)
* **Kalendarni ko‘rish:** Xizmat ko‘rsatuvchining istalgan oydagi kunlik bandlik grafigi.
* **Bron so‘rovi yuborish:**
  - Tadbir sanasi va vaqtini tanlash (Osh vaqti: 11:00-14:00, Bazm vaqti: 18:00-23:00).
  - Mehmonlar soni va alohida talablar.
* **Xavfsiz To‘lov (Escrow Deposit):**
  - Bronni tasdiqlash uchun Click, Payme yoki Uzum orqali avans (masalan: 10% yoki 500,000 so‘m) to‘lash.
  - Pul xizmat ko‘rsatuvchiga to‘y muvaffaqiyatli o‘tgandan keyin o‘tkazib beriladi (Ikkala tomon uchun ham xavfsiz kafolat).

### 1.5. To‘y Byudjeti Kalkulyatori (Budget Planner)
* Umumiy to‘y byudjetini kiritish.
* Xarajatlarni foizlarda va summada taqsimlash (To‘yxona, sanʼatkor, foto, liboslar).
* Har bir bandga mos provayderlarni bitta tugma bilan tanlash va umumiy «To‘y rejam» ro‘yxatiga qo‘shish.

### 1.6. Raqamli Taklifnoma va QR RSVP (Digital Invitation Studio)
* Kelin-kuyov o‘z to‘yi uchun maxsus shaxsiy sahifa (Landing page) yaratadi.
* **Taklifnomadagi maʼlumotlar:** Kelin-kuyov ismlari, to‘y kuni, ortga hisoblash taymeri (Countdown timer), to‘yxona manzili va xarita, sevgi hikoyasi (Love Story video/rasmlar).
* **RSVP Telegram Integratsiyasi:** Mehmon havola orqali kirib «Kelaman» yoki «Kelolmayman» deb belgilaydi. Mehmonlar ro‘yxati to‘y egasining ilovasida avtomat yangilanadi.

### 1.7. Real-Time Chat va Qo‘ng‘iroq
* Xizmat ko‘rsatuvchi bilan ilova ichida tezkor yozishmalar (WebSocket).
* Fotosurat, video va audio namunalar almashish.

### 1.8. Real Mijozlar Sharhi va Reyting
* Faqatgina ilova orqali bron qilib, tadbirni o‘tkazgan mijozlargina sharh yoza oladi (Soxta sharhlar 100% istisno qilinadi).
* 1 dan 5 gacha yulduzcha, to‘y kuni olingan haqiqiy fotosuratlar va batafsil fikrlar.

---

## 2. Xizmat Ko‘rsatuvchi (Provider / Biznes) Funksiyalari

### 2.1. Biznes Profil va Portfollio
* Profil yaratish: To‘yxona nomi, sanʼatkor taxallusi yoki studiya brendi.
* 4K foto galereya, YouTube/Vimeo video havolalari, audio treklar (xonandalar uchun).
* Xizmat paketlari (Masalan: *«Faqat boshlovchi»*, *«Boshlovchi + 3 ta xonanda + DJ paketi»*).

### 2.2. Jonli Kalendar Boshqaruvi (Smart Calendar CRM)
* Oylik kalendarda kunlarni bitta teginish bilan o‘zgartirish:
  - 🟢 **Ish kuni (Work)**
  - 🔴 **Band kun (Booked)** — boshqa tashqaridan olingan to‘ylar bo‘lsa ham kiritib qo‘yish mumkin.
  - ⚪ **Dam olish (Off)**
* Double-booking (bir kunga adashib 2 ta to‘y olib qo‘yish)dan 100% himoya.

### 2.3. Buyurtmalar Boshqaruvi (Order & Lead Management)
* Yangi bron so‘rovi kelganda Push-bildirishnoma va SMS xabarnoma.
* So‘rovni ko‘rib chiqish: Tadbir kuni, vaqti, mehmon soni.
* 1 tugma bilan «Qabul qilish» yoki «Rad etish» (sababini ko‘rsatgan holda).

### 2.4. Moliya va Daromad Boshqaruvi
* Kutilayotgan daromadlar balansi.
* Xavfsiz to‘lov tizimidan pullarni o‘zining plastik kartasiga yoki hisob raqamiga yechib olish.
* Oylik va yillik tushumlar bo‘yicha avtomatik hisobotlar.

---

## 3. Administrator va Moderator (Super-Admin Panel)

* **KYC va Verifikatsiya:** Yangi qo‘shilgan xizmat ko‘rsatuvchilarning hujjatlari va sifatini tekshirish (`Verified` nishoni berish).
* **Nizolarni Hal Qilish (Dispute Resolution):** Agar to‘y bekor qilinsa yoki xizmatda muammo bo‘lsa, to‘lovni kimga qaytarishni moderator tekshiradi.
* **Moliyaviy Hisob-Kitob:** Platformaning umumiy komissiyasi, tranzaksiyalar auditi.
* **Kontent Moderatsiyasi:** Nomaqbul fotosuratlar yoki haqoratomuz sharhlarni bloklash.
* **Reklama va Push-xabarnomalar:** Barcha foydalanuvchilarga yoki tanlangan shaharga marketing xabarlari jo‘natish.

---

## 4. AI & Smart Funksiyalar (Next-Gen 2026)

* 🤖 **AI Wedding Planner (Aqlli To‘y Yordamchisi):** Foydalanuvchi: *«Menda 60 mln so‘m bor, Samarqandda 200 kishilik zamonaviy to‘y qilmoqchiman»* desa, AI unga 5 soniyada to‘liq xizmatlar to‘plamini (To‘yxona + Sanʼatkor + Foto + Mashina) optimal narxda yig‘ib beradi.
* ✍️ **AI Taklifnoma Matn Yozuvchisi:** Taklifnomalar uchun o‘zbek tilida sheʼriy, rasmiy yoki samimiy taklif matnlarini generatsiya qilish.
