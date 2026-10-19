# 02. MOBIL ILOVA DIZAYN TIZIMI VA UI/UX SPETSIFIKATSIYASI

> **Dizayn Falsafasi:** «Modern Luxury & Wedding Glamour» — Nafis hashamat, toza minimalizm, Apple Human Interface va to‘y emotsiyalarining uyg‘unligi.

---

## 1. Vizual Stilistika va Estetika

Ilova oddiy eʼlonlar sayti kabi zerikarli bo‘lmasligi shart. U foydalanuvchiga ilk ochilishdanoq **ertaknamo bayram va hashamat tuyg‘usini** berishi kerak.

* **Glassmorphism (Shisha effekti):** Orqa fon xiralashgan, yengil shaffof kartochkalar (`backdrop-blur: 24px`, oq/oltin tusli 1px nafis hoshiya).
* **Chuqur Qatlamlar (Elevation & Neomorphism):** Yumshoq, keng tarqaluvchi soyalar (`box-shadow: 0 20px 40px rgba(0,0,0,0.06)`).
* **Mikro-animatsiyalar (Spring Physics):** Kartochkalar bosilganda yengil qisqarishi (Scale 0.97), sahifalar o‘tganda silliq erish (Shared Element Transition).
* **Taktil his (Haptic Feedback):** Har bir tugma bosilganda yoki sanani belgilaganda yoqimli titrash (iOS Taptic Engine / Android Haptic).

---

## 2. Ranglar Palitrasi (Design Tokens)

### Asosiy Ranglar (Brand Colors)
```css
/* Hashamatli Oltin (Gold Glamour) - Asosiy brend, nishonlar, VIP elementlar */
--color-gold-50:  #FDFBF7;
--color-gold-100: #F9F3E5;
--color-gold-300: #E6CE94;
--color-gold-500: #D4AF37; /* Asosiy oltin */
--color-gold-700: #8C6D1F;

/* Tungi Obsidian (Midnight Dark) - Dark mode, asosiy matnlar, premium fon */
--color-obsidian-900: #0B0E14; /* Chuqur tungi fon */
--color-obsidian-800: #121721; /* Qora kartochka foni */
--color-obsidian-700: #1D2432; /* Chegara va ajratgichlar */

/* Ipak Chini (Silk Porcelain) - Light mode foni, toza yorug'lik */
--color-porcelain-bg:  #F8F9FA;
--color-porcelain-card:#FFFFFF;

/* Emotsional Ranglar (Accents) */
--color-rose-love:    #E11D48; /* Sevimlilar, yurak, fotiha */
--color-emerald-free: #10B981; /* Kalendarda bo‘sh (erkin) kunlar */
--color-crimson-busy: #EF4444; /* Kalendarda band bo‘lgan kunlar */
--color-sapphire-done:#2563EB; /* Bajarilgan to‘ylar */
```

---

## 3. Tipografiya (Typography Hierarchy)

* **Sarlavhalar (Display & Headers):** `Plus Jakarta Sans` yoki `Outfit` (Zamonaviy, geometrik va viqorli).
* **Matnlar va Interfeys (Body & Controls):** `Inter` (Har qanday ekranda o‘ta aniq o‘qiluvchan).
* **Eksklyuziv taklifnoma elementlari:** `Playfair Display` yoki `Cinzel` (Klassik to‘y xati).

---

## 4. Ekranlar Strukturasi va UX Flow (Screen Breakdown)

### 📱 1. Onboarding & Shaxsiylashtirish (Welcome Flow)
* **Ekran 1:** Nafis video-orqa fon (To‘y va bayram kadrlaridan qisqa rolik).
* **Ekran 2: Siz kimsiz?**
  - 💍 *«To‘y / Marosim rejalashtiryapman» (Kelin, kuyov, ota-ona)*
  - 👑 *«Xizmat ko‘rsatuvchiman» (To‘yxona, sanʼatkor, studiya)*
* **Ekran 3: To‘y parametrlari:** 
  - Sanasi (yoki «Hali nomaʼlum»), shahar/viloyat va taxminiy byudjet.
  - *Natijada ilova birinchi daqiqadanoq shaxsiy tavsiyalarni shakllantiradi!*

---

### 📱 2. Bosh Sahifa (Explore & Discover Feed)
* **Yuqori qism (Custom Header):** 
  - Shaharni tanlash (Masalan: *Toshkent shahri* 📍).
  - Qidiruv paneli (Smart Search: ovozli qidiruv, AI qidiruv).
  - Sevimlilar va Bildirishnoma qo‘ng‘iroqchasi.
* **Toifalar Karuseli (Category Pills):**
  - Ikonkalar bilan: 🏰 *To‘yxonalar*, 🎤 *Sanʼatkorlar*, 📸 *Foto & Video*, 👗 *Kelin ko‘ylaklar*, 🚘 *Kortej*, 💐 *Dekor*, 🎂 *Tortlar*, 👨‍🍳 *Oshpazlar*.
* **VIP / TOP Tavsiyalar (Featured Luxury Carousel):**
  - Oltin ramkali, eng yuqori reytingli xizmatlar.
* **To‘y Byudjeti Vidjeti (Budget Banner):**
  - Foydalanuvchining hisob-kitobini 1 bosishda ko‘rsatuvchi interaktiv vidjet.
* **Haqiqiy To‘ylar Galereyasi (Real Wedding Stories):**
  - Instagram Stories kabi dumaloq avatarli to‘y lavhalari (Video/Reels formatida).

---

### 📱 3. Xizmat Sahifasi (Service Detail Screen)
* **Hero Media Slider:**
  - 4K fotosuratlar va 60fps video-tizerlar. Rasm ustida: Narx, Verifikatsiya ko‘k nishoni (`Verified ✔`), Reyting (`4.95 ★ (142 sharh)`).
* **Tezkor Harakatlar Bloki:**
  - 📞 Qo‘ng‘iroq qilish
  - 💬 Chatda yozish
  - 📍 Xaritada ko‘rish
  - 📅 **«Kalendarni tekshirish»** (Asosiy CTA tugma).
* **Paketlar va Tariflar Tab:**
  - *«Standart»*, *«Premium»*, *«VIP Luxury»* (Har birining ichiga nimalar kirishi aniq belgilangan).
* **Integratsiyalashgan Jonli Kalendar Bloki:**
  - Kichik ko‘rinishda oy kunlari, band/bo‘sh ekanligi.
* **Haqiqiy Sharhlar:**
  - Faqat to‘yi o‘tgan mijozlarning fotosuratli sharhlari.

---

### 📱 4. Jonli Interaktiv Kalendar (Live Booking Calendar Screen)
* **Interaktiv Kalendar Grid (Oy ko‘rinishi):**
  - 🟢 **Yashil doira:** Bo‘sh kun (Bir bosishda bron qilish mumkin).
  - 🔴 **Qizil xoch:** Band qilingan kun.
  - 🔵 **Moviy belgi:** O‘tgan to‘ylar.
  - ⚪ **Kulrang:** Dam olish / Ishlamaydigan kunlar.
* **Bron qilish jarayoni (Modal Sheet):**
  - Sanani bosganda pastdan chiquvchi nafis oyna:
  - Tadbir vaqti: *Kunduzgi (Osh)* yoki *Kechki (Bazm)*.
  - Mehmonlar soni, maxsus eslatmalar.
  - «Bron so‘rovini yuborish» tugmasi.

---

### 📱 5. AI To‘y Byudjeti Kalkulyatori (Budget Planner Screen)
* **Interaktiv Byudjet Slayderi:**
  - Foydalanuvchi umumiy summani kiritadi (Masalan: `100,000,000 so‘m`).
* **Avtomatik Taqsimot (Dinamik Donut Chart):**
  - 🏛 To‘yxona va dasturxon: 50% (`50 mln`)
  - 🎤 Sanʼatkor va boshlovchi: 20% (`20 mln`)
  - 📸 Foto va video: 12% (`12 mln`)
  - 👗 Liboslar va go‘zallik: 10% (`10 mln`)
  - 🚘 Transport va kortej: 5% (`5 mln`)
  - 💐 Bezak va taklifnoma: 3% (`3 mln`)
* **Mos Xizmatlar Taklifi:** Har bir bo‘lim ostida ushbu byudjetga to‘g‘ri keladigan aniq xizmat ko‘rsatuvchilar ro‘yxati chiqadi.

---

### 📱 6. Raqamli Taklifnoma va QR RSVP Studiyasi
* **Shablon tanlash:** O‘zbek milliy naqshlari, zamonaviy minimalizm yoki hashamatli oltin uslublar.
* **Kelin-kuyov fotosurati, to‘y sanasi, lokatsiyasi (Yandex Maps / Google Maps havolasi).**
* **Mehmonlar Boshqaruvi (RSVP Tracker):**
  - Taklifnoma havolasini Telegramdan yuborish.
  - Mehmon «Albatta boraman (+2 kishi)» yoki «Uzr, bora olmayman» deb belgilaydi.
  - To‘y egasi ekranda real-vaqtda: *«Keladiganlar: 280 kishi, Kelolmaydiganlar: 20 kishi»* deb ko‘rib turadi.

---

### 📱 7. Provider (Xizmat Ko‘rsatuvchi) Biznes Kabineti
* **Bitta tugma bilan rejimni almashtirish:** Buyurtmachi ↔ Xizmat ko‘rsatuvchi.
* **Mening Kalendarim (Fast Toggle):** Kalendardagi ixtiyoriy sanani bosib, uni 1 soniyada «Band» yoki «Bo‘sh»ga o‘tkazish.
* **Yangi Buyurtmalar (Lead Manager):** Kelib tushgan so‘rovlarni «Qabul qilish» yoki «Rad etish».
* **Daromad va Ko‘rishlar Analitikasi:** Haftalik, oylik statistika.
