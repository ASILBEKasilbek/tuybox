from django.core.management.base import BaseCommand
from django.utils.text import slugify
from datetime import datetime
from django.contrib.auth.models import User
from marosim.models import EventType, ServiceCategory, Service, ServiceSubCategory, Event

class Command(BaseCommand):
    help = "Bazaga EventType, ServiceCategory, Service, ServiceSubCategory va Event larni qo‘shadi"

    def handle(self, *args, **options):
        # ------------------ Default user/provider ------------------
        try:
            default_user = User.objects.get(username="default_provider")
        except User.DoesNotExist:
            default_user = User.objects.create_user(
                username="default_provider",
                email="default@provider.com",
                password="defaultpassword"
            )
            self.stdout.write(self.style.SUCCESS("✅ Default user yaratildi."))

        # ------------------ EventType ------------------
        event_types = [
            "Aqida To‘y",
            "Beshik To‘y",
            "Sunnat To‘y",
            "Tug‘ilgan Kun",
            "Nikoh To‘y",
            "Yubiley",
            "Aqiqah",
            "Hajga Kuzatish",
            "Ramazon Hayiti",
            "Qurbon Hayiti",
            "Oila To‘plamlari",
            "Festival va Konsertlar",
            "Maktab va Universitet Tadbirlar",
        ]

        # ------------------ ServiceCategory va Service ------------------
        categories = [
            "Tadbir joyi",
            "Oshpaz va taomlar",
            "Bezak va dizayn",
            "Fotograf va video",
            "Transport xizmati",
            "Musiqa va san’at",
            "Libos va kiyimlar",
            "Texnika ijarasi",
        ]

        services_by_category = {
            "Tadbir joyi": ["Restoran", "Kafe", "To‘yxonalar"],
            "Oshpaz va taomlar": ["Ovqat yetkazib berish", "Pazandachilik xizmatlari"],
            "Bezak va dizayn": ["Bezakchi", "Dekor studiyasi"],
            "Fotograf va video": ["Professional fotograf", "Videograf"],
            "Transport xizmati": ["Avtobus", "Yengil mashina"],
            "Musiqa va san’at": ["DJ", "Ansambl", "San’atkor"],
            "Libos va kiyimlar": ["Kelinlik libosi", "Kostyum"],
            "Texnika ijarasi": ["Mikrofon ijarasi", "Proyektor"],
        }

        subcategories = [
            "VIP xizmat",
            "Ekonom variant",
        ]

        # ------------------ EventType yaratish ------------------
        for et_name in event_types:
            et_slug = slugify(et_name)
            event_type, _ = EventType.objects.update_or_create(
                slug=et_slug,
                defaults={"name": et_name}
            )
            self.stdout.write(self.style.SUCCESS(f"✅ Created EventType: {et_name}"))

            # ------------------ ServiceCategory yaratish ------------------
            for cat_name in categories:
                cat_slug = f"{et_slug}-{slugify(cat_name)}"
                service_category, _ = ServiceCategory.objects.update_or_create(
                    slug=cat_slug,
                    event_type=event_type,
                    defaults={"name": cat_name}
                )
                self.stdout.write(self.style.SUCCESS(f"  ✅ Created ServiceCategory: {cat_name}"))

                # ------------------ Service yaratish ------------------
                for srv_name in services_by_category.get(cat_name, []):
                    srv_slug = f"{cat_slug}-{slugify(srv_name)}"
                    service, _ = Service.objects.update_or_create(
                        slug=srv_slug,
                        event_type=event_type,
                        service_category=service_category,
                        defaults={
                            "title": srv_name,
                            "description": f"{srv_name} xizmati",
                            "provider": default_user,
                        }
                    )
                    self.stdout.write(self.style.SUCCESS(f"    ✅ Created Service: {srv_name}"))

                    # ------------------ ServiceSubCategory yaratish ------------------
                for sub_name in subcategories:
                    sub_slug = f"{srv_slug}-{slugify(sub_name)}"
                    subcat, _ = ServiceSubCategory.objects.update_or_create(
                        slug=sub_slug,
                        service=service,
                        service_category=service_category,
                        defaults={
                            "name": sub_name,
                            "description": f"{sub_name} for {srv_name}",
                        }
                    )
                    self.stdout.write(self.style.SUCCESS(f"      ✅ Created ServiceSubCategory: {sub_name}"))

            # ------------------ Event yaratish ------------------
            event_slug = f"{et_slug}-event"
            event, _ = Event.objects.update_or_create(
                slug=event_slug,
                event_type=event_type,
                defaults={
                    "title": f"{et_name} tadbiri",
                    "user": default_user,
                    "description": f"{et_name} uchun xizmatlar",
                    "location": "Toshkent",
                    "date": datetime.now(),  # naive datetime; agar TIME_ZONE bor, django avtomatik o'zgartiradi
                }
            )
            self.stdout.write(self.style.SUCCESS(f"  ✅ Created Event: {event.title}"))

        self.stdout.write(self.style.SUCCESS("✅ All data successfully added to the database!"))
