from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.utils.text import slugify
# ========================
# Tadbir turi modeli (Aqida To‘y, Beshik To‘y va h.k.)
# ========================
class EventType(models.Model):
    name = models.CharField(max_length=100, unique=True)  # Masalan: Aqida To‘y
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name_plural = "Event Types"
        ordering = ['name']

    def __str__(self):
        return self.name

# ========================
# Xizmat turi modeli (Tadbir joyi, Ovqatlanish va h.k.)
# ========================
class ServiceCategory(models.Model):
    name = models.CharField(max_length=100)  # unique olib tashlandi
    slug = models.SlugField(max_length=150, unique=True)  # slug unique bo‘lib qoladi
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='service_categories')

    class Meta:
        verbose_name_plural = "Service Categories"
        ordering = ['name']
        unique_together = ('event_type', 'name')  # 🔥 bir EventType ichida nom takrorlanmasin

    def __str__(self):
        return f"{self.name} ({self.event_type.name})"

    def save(self, *args, **kwargs):
        if not self.slug:
            # slug har doim event_type bilan bog‘lanib yaratiladi
            self.slug = slugify(f"{self.event_type.slug}-{self.name}")
        super().save(*args, **kwargs)

# ========================
# Profile modeli (Foydalanuvchi profili)
# ========================
class Profile(models.Model):
    SERVICE_CHOICES = [
        ("tadbir_joyi", "Tadbir joyi"),
        ("ovqatlanish", "Ovqatlanish"),
        ("kiyim_aksessuar", "Kiyim-kechak va aksessuarlar"),
        ("foto_video", "Foto va video"),
        ("musiqa", "Musiqa va ko‘ngilochar dastur"),
        ("dekoratsiya", "Dekoratsiya va gulchambar"),
        ("transport", "Transport va mehmonlar qulayligi"),
        ("boshqa", "Boshqa xizmatlar"),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", blank=True, null=True, default="avatars/default.png")
    bio = models.TextField(blank=True)
    phone = models.CharField(
        max_length=20,
        blank=True,
        validators=[RegexValidator(regex=r'^\+?\d{9,15}$', message="Telefon raqamni to‘g‘ri kiriting.")]
    )
    location = models.CharField(max_length=100, blank=True)
    is_provider = models.BooleanField(default=False)
    service_type = models.CharField(max_length=50, choices=SERVICE_CHOICES, blank=True, null=True)
    experience_years = models.PositiveIntegerField(
        blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(50)]
    )
    price_range = models.CharField(max_length=100, blank=True, null=True)
    is_public = models.BooleanField(default=False)  # Profil ommaga ko‘rinadimi
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0)
    instagram = models.URLField(blank=True, null=True)
    telegram = models.URLField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {'Provider' if self.is_provider else 'User'}"
    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Profillar"
        ordering = ["-created_at"]

# models.py
class Service(models.Model):
    provider = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, db_index=True)
    title = models.CharField(max_length=200, db_index=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True, db_index=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, db_index=True)
    event_type = models.ForeignKey("EventType", on_delete=models.CASCADE, related_name='services', db_index=True)
    service_category = models.ForeignKey("ServiceCategory", on_delete=models.CASCADE, related_name='services', db_index=True)
    
    # Rasmlar
    image1 = models.ImageField(upload_to="services/", null=True, blank=True)
    image2 = models.ImageField(upload_to="services/", null=True, blank=True)
    image3 = models.ImageField(upload_to="services/", null=True, blank=True)
    image4 = models.ImageField(upload_to="services/", null=True, blank=True)
    image5 = models.ImageField(upload_to="services/", null=True, blank=True)

    # Joylashuv
    latitude = models.FloatField(null=True, blank=True, db_index=True)
    longitude = models.FloatField(null=True, blank=True, db_index=True)

    is_public = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False, db_index=True)
    
    # Performance fields
    view_count = models.PositiveIntegerField(default=0, db_index=True)
    booking_count = models.PositiveIntegerField(default=0, db_index=True)
    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=0.0, db_index=True)
    rating_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['event_type', 'service_category', '-created_at']),
            models.Index(fields=['is_public', 'is_verified', '-rating_avg']),
            models.Index(fields=['price', '-created_at']),
            models.Index(fields=['latitude', 'longitude']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:  # faqat bo‘sh bo‘lsa
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            # unikalligini tekshirish
            while Service.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.provider.username if self.provider else 'No Provider'})"


class ServiceSubCategory(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='subcategories')
    service_category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='subcategories')
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)  # Added slug field
    description = models.TextField(blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.name} - {self.service_category.name}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.name}-{self.service_category.name}")
        super().save(*args, **kwargs)
# ========================
# Event modeli (Tadbirlar)
# ========================
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    budget = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location = models.CharField(max_length=200)
    image = models.ImageField(upload_to='events/', blank=True, null=True)
    video = models.FileField(upload_to='videos/', blank=True, null=True)
    event_type = models.ForeignKey(EventType, on_delete=models.CASCADE, related_name='events')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    services = models.ManyToManyField("ServiceSubCategory", related_name="events")
    slug = models.SlugField(unique=True, blank=True, null=True)
    date = models.DateTimeField(blank=True, null=True) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('event_detail', args=[self.id])

    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(review.rating for review in reviews) / reviews.count(), 2)
        return 0

# ========================
# Review modeli (Sharhlar)
# ========================
class Review(models.Model):
    RATING_CHOICES = [(i, i) for i in range(1, 6)]

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('event', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s review for {self.event.title}"

# ========================
# Favorite modeli (Sevimlilar)
# ========================
class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='favorites')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} favorited {self.event.title}"

# ========================
# RSVP modeli (Tadbirga ro‘yxatdan o‘tish)
# ========================
class RSVP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rsvps')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='rsvps')
    guests = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'event')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} RSVPed {self.guests} guests to {self.event.title}"

# ========================
# Notification modeli (Bildirishnomalar)
# ========================
class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Notification for {self.user.username}"

# ========================
# Signals (Avtomatik bildirishnomalar va profil yaratish)
# ========================
@receiver(post_save, sender=Review)
def notify_review(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.event.user,
            message=f"{instance.user.username} left a review on your event '{instance.event.title}'."
        )

@receiver(post_save, sender=RSVP)
def notify_rsvp(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(
            user=instance.event.user,
            message=f"{instance.user.username} RSVPed to your event '{instance.event.title}' with {instance.guests} guests."
        )

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()