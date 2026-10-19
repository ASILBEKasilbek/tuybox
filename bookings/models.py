from django.db import models
from django.contrib.auth.models import User
from marosim.models import Service

class Booking(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="bookings")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    date = models.DateField()
    time = models.TimeField(null=True, blank=True)  # Agar vaqt kerak bo‘lsa
    created_at = models.DateTimeField(auto_now_add=True)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.service.title} - {self.date} ({self.status})"
class ServiceDay(models.Model):
    STATUS_CHOICES = [
        ("work", "Ish kuni"),
        ("off", "Dam olish kuni"),
        ("booked", "Olingan (bron qilingan)"),
        ("done", "Bajarilgan"),
    ]

    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="days")
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="work")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("service", "date")
        ordering = ["date"]

    def __str__(self):
        return f"{self.service.title} - {self.date} ({self.get_status_display()})"
