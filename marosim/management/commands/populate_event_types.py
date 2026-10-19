from django.core.management.base import BaseCommand
from django.utils.text import slugify
from marosim.models import EventType, ServiceCategory, Service, ServiceSubCategory
from django.contrib.auth.models import User


class Command(BaseCommand):
    help = "Bazaga EventType, ServiceCategory, Service va ServiceSubCategory larni qo‘shadi"

    def handle(self, *args, **options):
        # Sample data
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

            # "VIP xizmat",
            # "Ekonom variant",
            # "O‘rta sinf",

        subcategories = [
            "Ekonom variant",
            "Premium xizmat",
        ]

        # Default provider
        try:
            default_provider = User.objects.get(username="default_provider")
        except User.DoesNotExist:
            default_provider = User.objects.create_user(
                username="default_provider",
                email="default@provider.com",
                password="defaultpassword"
            )

        # EventTypes qo‘shish
        for et_name in event_types:
            et_slug = slugify(et_name)
            event_type, _ = EventType.objects.update_or_create(
                slug=et_slug,
                defaults={"name": et_name}
            )
            self.stdout.write(self.style.SUCCESS(f"✅ Created EventType: {et_name}"))

            # ServiceCategory qo‘shish
            for cat_name in categories:
                try:
                    cat_slug = f"{et_slug}-{slugify(cat_name)}"
                    service_category, _ = ServiceCategory.objects.update_or_create(
                        slug=cat_slug,
                        event_type=event_type,
                        defaults={"name": cat_name}
                    )
                    self.stdout.write(self.style.SUCCESS(f"  ✅ Created ServiceCategory: {cat_name}"))

                    # Service qo‘shish
                    for srv_name in services_by_category.get(cat_name, []):
                        try:
                            service, _ = Service.objects.update_or_create(
                                title=srv_name,
                                event_type=event_type,
                                service_category=service_category,
                                defaults={
                                    "title": srv_name,
                                    "description": f"{srv_name} xizmati",
                                    "provider": default_provider,
                                    "slug": f"{cat_slug}-{slugify(srv_name)}",
                                }
                            )
                            self.stdout.write(self.style.SUCCESS(f"    ✅ Created Service: {srv_name}"))
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"    ❌ Error creating Service {srv_name}: {e}"))
                    
                            # ServiceSubCategory qo‘shish
                    for sub_name in subcategories:
                        try:
                            ServiceSubCategory.objects.update_or_create(
                                service=service,
                                service_category=service_category,
                                name=sub_name,
                                defaults={
                                    "name": sub_name,
                                    "slug": f"{service.slug}-{slugify(sub_name)}",
                                    "description": f"{sub_name} for {srv_name}",
                                }
                            )
                            self.stdout.write(self.style.SUCCESS(f"      ✅ Created ServiceSubCategory: {sub_name}"))
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(f"      ❌ Error creating ServiceSubCategory {sub_name}: {e}"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"  ❌ Error creating ServiceCategory {cat_name}: {e}"))

        self.stdout.write(self.style.SUCCESS("✅ All data successfully added to the database!"))
