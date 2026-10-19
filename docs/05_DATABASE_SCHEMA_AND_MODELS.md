# 05. MAʼLUMOTLAR BAZASI SXEMASI VA MODELLAR (DATABASE DESIGN)

> **Baza Turi:** PostgreSQL 16+ (PostGIS fazoviy kengaytmasi bilan)
> **Qoidalar:** 3NF normalizatsiyasi, UUID yoki BigInt IDlar, aniq xorijiy kalitlar (Foreign Keys), tranzaksiya yaxlitligi va B-Tree / GIST indekslar.

---

## 1. Asosiy Jadvallar va Ularning Maydonlari

### 1. `users` (Foydalanuvchilar)
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    phone VARCHAR(20) UNIQUE NOT NULL, -- +998901234567
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer', -- 'customer', 'vendor', 'admin'
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `vendor_profiles` (Xizmat Ko‘rsatuvchi Biznes Profillari)
```sql
CREATE TABLE vendor_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(200) NOT NULL,
    slug VARCHAR(220) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    instagram_url VARCHAR(255),
    telegram_url VARCHAR(255),
    youtube_url VARCHAR(255),
    experience_years INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_document_url VARCHAR(500),
    rating_avg NUMERIC(3, 2) DEFAULT 0.00,
    reviews_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `event_types` va `service_categories`
```sql
CREATE TABLE event_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- Nikoh to'yi, Beshik to'y, Sunnat to'y
    slug VARCHAR(120) UNIQUE NOT NULL,
    icon_url VARCHAR(500),
    sort_order INT DEFAULT 0
);

CREATE TABLE service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL, -- To'yxona, San'atkor, Foto-video, Bezak
    slug VARCHAR(120) UNIQUE NOT NULL,
    icon_url VARCHAR(500),
    event_type_id INT REFERENCES event_types(id) ON DELETE SET NULL,
    sort_order INT DEFAULT 0
);
```

### 4. `services` (Aniq Xizmatlar)
```sql
CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    vendor_id BIGINT NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES service_categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(270) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    base_price NUMERIC(14, 2) NOT NULL, -- So'mda
    price_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'per_guest', 'hourly'
    
    -- Manzil va Geolokatsiya (PostGIS)
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100),
    address_line VARCHAR(300),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    location_point GEOMETRY(Point, 4326), -- PostGIS fazoviy koordinatasi
    
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. `service_calendar_days` (Jonli Kalendar va Bandlik Kunlari)
```sql
CREATE TABLE service_calendar_days (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    calendar_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'work', -- 'work' (bo'sh), 'booked' (band), 'off' (dam olish), 'completed'
    time_slot VARCHAR(20) DEFAULT 'all_day',    -- 'all_day', 'day_osh', 'evening_party'
    notes VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT uq_service_date UNIQUE(service_id, calendar_date, time_slot)
);
```

### 6. `bookings` (Bronlash va Buyurtmalar)
```sql
CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    booking_code VARCHAR(30) UNIQUE NOT NULL, -- TX-2026-98124
    customer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    event_date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    guest_count INT,
    
    total_price NUMERIC(14, 2) NOT NULL,
    deposit_amount NUMERIC(14, 2) NOT NULL, -- To'lanishi kerak bo'lgan avans
    
    status VARCHAR(20) DEFAULT 'pending', 
    -- 'pending' (kutilyapti), 'confirmed' (tasdiqlandi), 'rejected' (rad etildi), 'cancelled' (bekor qilindi), 'completed' (bajarildi)
    
    escrow_status VARCHAR(20) DEFAULT 'unpaid',
    -- 'unpaid', 'held_in_escrow' (xavfsiz depozitda), 'released_to_vendor' (provayderga o'tdi), 'refunded' (qaytarildi)
    
    customer_notes TEXT,
    vendor_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. `payments` (To‘lovlar Tarixi)
```sql
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    provider VARCHAR(20) NOT NULL, -- 'click', 'payme', 'uzum'
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    amount NUMERIC(14, 2) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'pending', 'success', 'failed', 'refunded'
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8. `digital_invitations` va `rsvps` (Raqamli Taklifnomalar va Mehmonlar)
```sql
CREATE TABLE digital_invitations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL, -- tuyxona.uz/invite/asilbek-madina
    title VARCHAR(200) NOT NULL,
    template_id VARCHAR(50) DEFAULT 'luxury_gold_1',
    groom_name VARCHAR(100) NOT NULL,
    bride_name VARCHAR(100) NOT NULL,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    venue_name VARCHAR(200) NOT NULL,
    venue_address VARCHAR(300),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    love_story_text TEXT,
    music_url VARCHAR(500),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rsvps (
    id BIGSERIAL PRIMARY KEY,
    invitation_id BIGINT NOT NULL REFERENCES digital_invitations(id) ON DELETE CASCADE,
    guest_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30),
    attendance_status VARCHAR(20) NOT NULL, -- 'attending', 'declined', 'tentative'
    guests_count INT DEFAULT 1,
    congratulation_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 2. Indekslar va Performance Optimizatsiyasi

Yuqori tezlik (sub-second javob) uchun bazada quyidagi maxsus indekslar o‘rnatiladi:

```sql
-- 1. Eng yaqin xizmatlarni qidirish (PostGIS Spatial Index):
CREATE INDEX idx_services_location_gist ON services USING GIST(location_point);

-- 2. Filtrlash va saralash:
CREATE INDEX idx_services_category_active ON services (category_id, is_active);
CREATE INDEX idx_services_price ON services (base_price);

-- 3. Kalendarda tezkor bandlikni tekshirish:
CREATE INDEX idx_calendar_lookup ON service_calendar_days (service_id, calendar_date, status);

-- 4. Foydalanuvchi buyurtmalarini sanalar bo'yicha ko'rish:
CREATE INDEX idx_bookings_user_status ON bookings (customer_id, status, event_date);
```
