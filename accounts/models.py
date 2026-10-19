# from django.db import models
# from django.contrib.auth.models import User
# from django.db.models.signals import post_save
# from django.dispatch import receiver
# from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator


# class Profile(models.Model):
#     SERVICE_CHOICES = [
#         ("sanatkor", "San’atkor"),
#         ("raqqosa", "Raqqosa"),
#         ("gulchi", "Gulchi"),
#         ("mashina", "Mashina ijarasi"),
#         ("other", "Boshqa"),
#     ]

#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

#     # Shaxsiy ma’lumotlar
#     avatar = models.ImageField(upload_to="avatars/", blank=True, null=True, default="avatars/default.png")
#     bio = models.TextField(blank=True)
#     phone = models.CharField(
#         max_length=20, 
#         blank=True,
#         validators=[RegexValidator(regex=r'^\+?\d{9,15}$', message="Telefon raqamni to‘g‘ri kiriting.")]
#     )
#     location = models.CharField(max_length=100, blank=True)

#     # Provider (xizmat ko‘rsatuvchi)
#     is_provider = models.BooleanField(default=False)
#     service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES, blank=True, null=True)
#     experience_years = models.PositiveIntegerField(blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(50)])
#     price_range = models.CharField(max_length=100, blank=True, null=True)

#     # Baholash
#     rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)  # masalan 4.5 ⭐

#     # Ijtimoiy tarmoqlar
#     instagram = models.URLField(blank=True, null=True)
#     telegram = models.URLField(blank=True, null=True)
#     facebook = models.URLField(blank=True, null=True)

#     # Admin tasdiqlaganmi
#     is_verified = models.BooleanField(default=False)

#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"{self.user.username} - {'Provider' if self.is_provider else 'User'}"


# # Signal: User yaratilganda avtomatik Profile ham yaratiladi
# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         Profile.objects.create(user=instance)


# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     instance.profile.save()
