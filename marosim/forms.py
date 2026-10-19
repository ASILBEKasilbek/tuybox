from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from .models import (
    Event, Review, Service, ServiceCategory, 
    ServiceSubCategory, Profile, EventType
)

# ======================================
# Event Form
# ======================================
class EventForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = [
            "title", "description", "price", "budget", "location",
            "image", "video", "event_type"
        ]
        widgets = {
            "title": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "Tadbir nomi"
            }),
            "description": forms.Textarea(attrs={
                "class": "form-textarea", "rows": 5,
                "placeholder": "Tadbir haqida batafsil yozing..."
            }),
            "price": forms.NumberInput(attrs={
                "class": "form-input", "placeholder": "Narxi"
            }),
            "budget": forms.NumberInput(attrs={
                "class": "form-input", "placeholder": "Byudjeti"
            }),
            "location": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "Joylashuv"
            }),
            "event_type": forms.Select(attrs={"class": "form-select"}),
            "image": forms.ClearableFileInput(attrs={"class": "form-file"}),
            "video": forms.ClearableFileInput(attrs={"class": "form-file"}),
        }


# ======================================
# Review Form
# ======================================
class ReviewForm(forms.ModelForm):
    class Meta:
        model = Review
        fields = ["rating", "comment"]
        widgets = {
            "rating": forms.Select(attrs={"class": "form-select"}),
            "comment": forms.Textarea(attrs={
                "class": "form-textarea", "rows": 3,
                "placeholder": "Sharhingizni yozing..."
            }),
        }


# ======================================
# User Registration Form
# ======================================
class UserRegisterForm(UserCreationForm):
    username = forms.CharField(
        required=True, label="",
        widget=forms.TextInput(attrs={
            "class": "form-input", "placeholder": "Foydalanuvchi nomi"
        })
    )
    email = forms.EmailField(
        required=True, label="",
        widget=forms.EmailInput(attrs={
            "class": "form-input", "placeholder": "Email manzilingiz"
        })
    )
    password1 = forms.CharField(
        required=True, label="",
        widget=forms.PasswordInput(attrs={
            "class": "form-input", "placeholder": "Parol"
        })
    )
    password2 = forms.CharField(
        required=True, label="",
        widget=forms.PasswordInput(attrs={
            "class": "form-input", "placeholder": "Parolni takrorlang"
        })
    )

    class Meta:
        model = User
        fields = ["username", "email", "password1", "password2"]


# ======================================
# Profile Form
# ======================================
class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = [
            "avatar", "bio", "phone", "location", "is_provider",
            "service_type", "experience_years", "price_range",
            "is_public", "instagram", "telegram", "facebook"
        ]
        widgets = {
            "avatar": forms.FileInput(attrs={
                "class": "form-control"
            }),
            "bio": forms.Textarea(attrs={
                "class": "form-textarea", "rows": 4,
                "placeholder": "O‘zingiz haqida yozing..."
            }),
            "phone": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "+998901234567"
            }),
            "location": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "Shahar"
            }),
            "service_type": forms.Select(attrs={"class": "form-select"}),
            "price_range": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "Masalan: 100-500 USD"
            }),
        }



# ======================================
# Service Form
# ======================================
class ServiceForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = [
            "title", "description", "price", "event_type", "service_category",
            "image1", "image2", "image3", "image4", "image5",
            "latitude", "longitude", "is_public"
        ]
        widgets = {
            "title": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "Xizmat nomi"
            }),
            "description": forms.Textarea(attrs={
                "class": "form-textarea", "rows": 4,
                "placeholder": "Xizmat haqida yozing..."
            }),
            "price": forms.NumberInput(attrs={
                "class": "form-input", "placeholder": "Narxi"
            }),
            "event_type": forms.Select(attrs={"class": "form-select"}),
            "service_category": forms.Select(attrs={"class": "form-select"}),
        }


# ======================================
# Service Category Form
# ======================================
class ServiceCategoryForm(forms.ModelForm):
    class Meta:
        model = ServiceCategory
        fields = ["name", "event_type"]
        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "Xizmat turi nomi"
            }),
            "event_type": forms.Select(attrs={"class": "form-select"}),
        }


# ======================================
# Service SubCategory Form
# ======================================
class ServiceSubCategoryForm(forms.ModelForm):
    class Meta:
        model = ServiceSubCategory
        fields = ["name", "description", "amount", "service_category"]
        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-input", "placeholder": "Subkategoriya nomi"
            }),
            "description": forms.Textarea(attrs={
                "class": "form-textarea", "rows": 3,
                "placeholder": "Subkategoriya haqida yozing..."
            }),
            "amount": forms.NumberInput(attrs={
                "class": "form-input", "placeholder": "Summasi"
            }),
            "service_category": forms.Select(attrs={"class": "form-select"}),
        }
