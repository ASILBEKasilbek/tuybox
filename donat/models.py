from django.db import models

class DonationGoal(models.Model):
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)  # Maqsad (1000$)
    current_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Hozirgacha yig'ilgan

    def progress_percent(self):
        if self.target_amount > 0:
            return (self.current_amount / self.target_amount) * 100
        return 0


class Donor(models.Model):
    name = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)


class AdBanner(models.Model):
    image = models.ImageField(upload_to='ads/')
    alt_text = models.CharField(max_length=200, blank=True)
    is_active = models.BooleanField(default=True)
