import asyncio
from app.db.database import AsyncSessionLocal, engine, Base
from app.models.user import User, VendorProfile
from app.models.service import EventType, ServiceCategory, Service, ServicePackage, ServiceMedia
from app.models.calendar import ServiceCalendarDay
from app.models.booking import Booking
from datetime import date, timedelta
import uuid

async def reset_and_seed():
    """
    Ma'lumotlar bazasini 0 dan tozalash va to'liq hashamatli namuna ma'lumotlar bilan to'ldirish.
    """
    print("🔄 Bazani tozalash va barcha jadvallarni qaytadan yaratish...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Tadbir Turlari (Event Types - Wedge strategiyasi)
        e_wedding = EventType(name="Nikoh To'yi", slug="nikoh-toyi", icon_url="💍", sort_order=1)
        e_banquet = EventType(name="Restoran & Banket", slug="restoran-banket", icon_url="🍽️", sort_order=2)
        e_birthday = EventType(name="Tug'ilgan Kun", slug="tugilgan-kun", icon_url="🎂", sort_order=3)
        e_corporate = EventType(name="Korporativ Bazm", slug="korporativ", icon_url="🏢", sort_order=4)
        session.add_all([e_wedding, e_banquet, e_birthday, e_corporate])
        await session.flush()

        # 2. Toifalar (Categories)
        cat_venue = ServiceCategory(name="To'yxonalar va Saroylar", slug="toyxonalar", event_type_id=e_wedding.id)
        cat_restaurant = ServiceCategory(name="Restoranlar va Banket Zallari", slug="restoranlar", event_type_id=e_banquet.id)
        cat_music = ServiceCategory(name="San'atkorlar va Jonli Ijro", slug="sanatkorlar", event_type_id=e_wedding.id)
        cat_photo = ServiceCategory(name="Foto va Video Studiyalar", slug="foto-video", event_type_id=e_wedding.id)
        cat_decor = ServiceCategory(name="Dekoratsiya va Gullar", slug="dekoratsiya", event_type_id=e_wedding.id)
        cat_catering = ServiceCategory(name="Katering va To'y Oshi", slug="katering", event_type_id=e_wedding.id)
        session.add_all([cat_venue, cat_restaurant, cat_music, cat_photo, cat_decor, cat_catering])
        await session.flush()

        # 3. Admin Foydalanuvchi
        admin_user = User(
            phone="+998900000000",
            first_name="TuyBox",
            last_name="Administrator",
            role="admin",
            is_phone_verified=True
        )
        session.add(admin_user)
        await session.flush()

        # 4. Sara Vendorlar va Xizmatlar Ro'yxati
        vendors_data = [
            {
                "phone": "+998712000001",
                "business_name": "Versal Grand Ballroom",
                "slug": "versal-grand-ballroom",
                "bio": "Toshkent markazidagi eng hashamatli to'yxona saroyi. 700 kishigacha bo'lgan to'y va tantanalar.",
                "rating": 5.0,
                "reviews": 148,
                "category_id": cat_venue.id,
                "title": "Versal Grand Ballroom",
                "price": 48000000.0,
                "city": "Toshkent",
                "district": "Yakkasaroy",
                "address": "Shota Rustaveli ko'chasi 45",
                "lat": 41.2825,
                "lng": 69.2435,
                "img": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000",
                "tag": "PREMIUM VIP"
            },
            {
                "phone": "+998712000002",
                "business_name": "Yakkasaroy Palace",
                "slug": "yakkasaroy-palace",
                "bio": "Qirollik uslubidagi hashamat, kristal qandillar va beqiyos to'y dasturxoni.",
                "rating": 4.95,
                "reviews": 124,
                "category_id": cat_venue.id,
                "title": "Yakkasaroy Palace",
                "price": 55000000.0,
                "city": "Toshkent",
                "district": "Chilonzor",
                "address": "Bunyodkor shoh ko'chasi 12",
                "lat": 41.2750,
                "lng": 69.2310,
                "img": "https://images.unsplash.com/photo-1545232979-fbf6c8b91953?q=80&w=1000",
                "tag": "SAROY"
            },
            {
                "phone": "+998712000003",
                "business_name": "Osiyo Grand Hall",
                "slug": "osiyo-grand-hall",
                "bio": "Zamonaviy arxitektura va yuqori darajadagi xizmat ko'rsatish markazi.",
                "rating": 4.85,
                "reviews": 98,
                "category_id": cat_venue.id,
                "title": "Osiyo Grand Hall",
                "price": 35000000.0,
                "city": "Toshkent",
                "district": "Yunusobod",
                "address": "Amir Temur shoh ko'chasi 88",
                "lat": 41.3650,
                "lng": 69.2880,
                "img": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000",
                "tag": "ENG MASHHUR"
            },
            {
                "phone": "+998712000004",
                "business_name": "Ezidiyor Tantanalar Saroyi",
                "slug": "ezidiyor-tantanalar",
                "bio": "Milliy qadriyatlar va zamonaviy dabdaba uyg'unlashgan to'yxona majmuasi.",
                "rating": 4.90,
                "reviews": 110,
                "category_id": cat_venue.id,
                "title": "Ezidiyor Marosimlar Uyi",
                "price": 42000000.0,
                "city": "Toshkent",
                "district": "Shayxontohur",
                "address": "Navoiy ko'chasi 24",
                "lat": 41.3280,
                "lng": 69.2290,
                "img": "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1000",
                "tag": "MILLIY VA LYUKS"
            },
            {
                "phone": "+998712000005",
                "business_name": "Simurg Lounge & Restaurant",
                "slug": "simurg-lounge",
                "bio": "Banketlar, korporativ tadbirlar va unutilmas oqshomlar uchun nafis restoran.",
                "rating": 4.80,
                "reviews": 75,
                "category_id": cat_restaurant.id,
                "title": "Simurg Lounge & Restaurant",
                "price": 18000000.0,
                "city": "Toshkent",
                "district": "Mirobod",
                "address": "Nukus ko'chasi 56",
                "lat": 41.3000,
                "lng": 69.2700,
                "img": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000",
                "tag": "BANKET & LOUNGE"
            },
            {
                "phone": "+998901234567",
                "business_name": "Ziyo Stars Live Band",
                "slug": "ziyo-stars-band",
                "bio": "Professional san'atkorlar va jonli ijro guruhi. Barcha to'y va bazmlar shousi.",
                "rating": 5.0,
                "reviews": 84,
                "category_id": cat_music.id,
                "title": "Ziyo Stars Jonli Ijro Ansambli",
                "price": 15000000.0,
                "city": "Toshkent",
                "district": "Toshkent",
                "address": "Markaz",
                "lat": 41.3110,
                "lng": 69.2790,
                "img": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000",
                "tag": "JONLI IJRO"
            },
            {
                "phone": "+998935554433",
                "business_name": "Luxe Vision Wedding Film",
                "slug": "luxe-vision-studio",
                "bio": "Kinematografik to'y filmlari, Love Story va 4K drona tasvirlari.",
                "rating": 4.95,
                "reviews": 68,
                "category_id": cat_photo.id,
                "title": "Luxe Vision Foto & Video Studiya",
                "price": 12000000.0,
                "city": "Toshkent",
                "district": "Yakkasaroy",
                "address": "Bobur ko'chasi 15",
                "lat": 41.2910,
                "lng": 69.2550,
                "img": "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1000",
                "tag": "4K FOTO/VIDEO"
            },
            {
                "phone": "+998971112233",
                "business_name": "Flora Imperial Decor",
                "slug": "flora-imperial-decor",
                "bio": "To'y prezidiumi, yangi gullar va saroylar uchun hashamatli foto-zonalar.",
                "rating": 4.90,
                "reviews": 56,
                "category_id": cat_decor.id,
                "title": "Flora Imperial Gullar & Dekor",
                "price": 10000000.0,
                "city": "Toshkent",
                "district": "Mirobod",
                "address": "Afrosiyob ko'chasi 7",
                "lat": 41.3030,
                "lng": 69.2620,
                "img": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000",
                "tag": "PREZIDIUM & GULLAR"
            }
        ]

        created_services = []

        for item in vendors_data:
            u = User(
                phone=item["phone"],
                role="vendor",
                first_name=item["business_name"].split()[0],
                last_name="Vendor",
                is_phone_verified=True
            )
            session.add(u)
            await session.flush()

            v_prof = VendorProfile(
                user_id=u.id,
                business_name=item["business_name"],
                slug=item["slug"],
                bio=item["bio"],
                is_verified=True,
                rating_avg=item["rating"],
                reviews_count=item["reviews"],
                cover_image_url=item["img"]
            )
            session.add(v_prof)
            await session.flush()

            srv = Service(
                vendor_id=v_prof.id,
                category_id=item["category_id"],
                title=item["title"],
                slug=item["slug"],
                description=item["bio"],
                base_price=item["price"],
                city=item["city"],
                district=item["district"],
                address_line=item["address"],
                latitude=item["lat"],
                longitude=item["lng"],
                rating_avg=item["rating"],
                reviews_count=item["reviews"],
                is_active=True
            )
            session.add(srv)
            await session.flush()

            med = ServiceMedia(service_id=srv.id, media_url=item["img"], is_cover=True)
            session.add(med)

            pkg = ServicePackage(service_id=srv.id, name="Standart To'y Paketi", price=item["price"], description="To'liq xizmat ko'rsatish")
            session.add(pkg)

            created_services.append(srv)

        # 5. Namuna Mijoz va Bronlar (Admin panelda ko'rinishi uchun)
        customer1 = User(
            phone="+998909876543",
            first_name="Davronbek",
            last_name="Alimov",
            role="customer",
            is_phone_verified=True
        )
        session.add(customer1)
        await session.flush()

        # Versal Grand Ballroom uchun buyurtma
        b1 = Booking(
            booking_code=f"TX-{uuid.uuid4().hex[:6].upper()}",
            customer_id=customer1.id,
            service_id=created_services[0].id,
            event_date=date.today() + timedelta(days=15),
            time_slot="evening_party",
            guest_count=500,
            total_price=48000000.0,
            deposit_amount=4800000.0,
            status="confirmed",
            customer_notes="Kelin-kuyov uchun VIP prezidium va to'liq chiroqlar bilan"
        )

        # Yakkasaroy Palace uchun kutilayotgan buyurtma
        b2 = Booking(
            booking_code=f"TX-{uuid.uuid4().hex[:6].upper()}",
            customer_id=customer1.id,
            service_id=created_services[1].id,
            event_date=date.today() + timedelta(days=22),
            time_slot="evening_party",
            guest_count=600,
            total_price=55000000.0,
            deposit_amount=5500000.0,
            status="pending",
            customer_notes="Sana bo'yicha maslahatlashish kerak"
        )
        session.add_all([b1, b2])

        await session.commit()
        print("✨ Baza muvaffaqiyatli 0 dan to'liq hashamatli ma'lumotlar bilan to'ldirildi!")

if __name__ == "__main__":
    asyncio.run(reset_and_seed())
