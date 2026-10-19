from django import forms
from .models import Profile

class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            "avatar", "bio", "phone", "location",
            "is_provider", "service_type", "experience_years",
            "price_range", "instagram", "telegram", "facebook"
        ]
