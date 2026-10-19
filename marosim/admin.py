from django.contrib import admin
from .models import (
    EventType, ServiceCategory, ServiceSubCategory, Profile, Service,
    Event, Review, Favorite, RSVP, Notification
)

# ========================
# EventType admin
# ========================
@admin.register(EventType)
class EventTypeAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']
    ordering = ['name']

# ========================
# ServiceSubCategory Inline
# ========================
class ServiceSubCategoryInline(admin.TabularInline):
    model = ServiceSubCategory
    extra = 1

# ========================
# ServiceCategory admin
# ========================
@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'event_type', 'slug']
    list_filter = ['event_type']
    search_fields = ['name', 'event_type__name']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ServiceSubCategoryInline]

# ========================
# Service admin
# ========================
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['title', 'provider', 'event_type', 'service_category', 'price', 'is_public', 'is_verified', 'created_at']
    list_filter = ['event_type', 'service_category', 'is_public', 'is_verified', 'created_at']
    search_fields = ['title', 'description', 'provider__username']
    readonly_fields = ['created_at', 'updated_at']

# ========================
# Profile admin
# ========================
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'is_provider', 'service_type', 'experience_years', 'is_verified', 'is_public']
    list_filter = ['is_provider', 'service_type', 'is_verified', 'is_public']
    search_fields = ['user__username', 'user__email', 'phone', 'location']
    readonly_fields = ['created_at']

# ========================
# Event admin
# ========================
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'event_type', 'location', 'price', 'budget', 'created_at']
    list_filter = ['event_type', 'created_at', 'location']
    search_fields = ['title', 'description', 'location', 'user__username']
    readonly_fields = ['created_at', 'updated_at']

# ========================
# Review admin
# ========================
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['event', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['event__title', 'user__username', 'comment']
    readonly_fields = ['created_at']

# ========================
# Favorite admin
# ========================
@admin.register(Favorite)
class FavoriteAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'event__title']
    readonly_fields = ['created_at']

# ========================
# RSVP admin
# ========================
@admin.register(RSVP)
class RSVPAdmin(admin.ModelAdmin):
    list_display = ['user', 'event', 'guests', 'created_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'event__title']
    readonly_fields = ['created_at']

# ========================
# Notification admin
# ========================
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'message', 'read', 'created_at']
    list_filter = ['read', 'created_at']
    search_fields = ['user__username', 'message']
    readonly_fields = ['created_at']