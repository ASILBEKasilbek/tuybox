from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    EventType, ServiceCategory, ServiceSubCategory,
    Event, Service, Profile, Review, Favorite, RSVP
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'id', 'user', 'avatar', 'bio', 'phone', 'location',
            'is_provider', 'service_type', 'experience_years', 
            'price_range', 'rating', 'is_verified', 'instagram',
            'telegram', 'facebook'
        ]


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ['id', 'name', 'slug']


class ServiceCategorySerializer(serializers.ModelSerializer):
    event_type = EventTypeSerializer(read_only=True)
    
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'event_type']


class ServiceSubCategorySerializer(serializers.ModelSerializer):
    service_category = ServiceCategorySerializer(read_only=True)
    
    class Meta:
        model = ServiceSubCategory
        fields = ['id', 'name', 'slug', 'description', 'amount', 'service_category']


class ServiceListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    provider_avatar = serializers.ImageField(source='provider.profile.avatar', read_only=True)
    event_type_name = serializers.CharField(source='event_type.name', read_only=True)
    category_name = serializers.CharField(source='service_category.name', read_only=True)
    
    class Meta:
        model = Service
        fields = [
            'id', 'slug', 'title', 'price', 'image1', 'rating_avg',
            'view_count', 'is_verified', 'created_at', 'provider_name',
            'provider_avatar', 'event_type_name', 'category_name'
        ]


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Full serializer for detail views"""
    provider = ProfileSerializer(source='provider.profile', read_only=True)
    event_type = EventTypeSerializer(read_only=True)
    service_category = ServiceCategorySerializer(read_only=True)
    subcategories = ServiceSubCategorySerializer(many=True, read_only=True)
    
    class Meta:
        model = Service
        fields = [
            'id', 'slug', 'title', 'description', 'price', 
            'image1', 'image2', 'image3', 'image4', 'image5',
            'latitude', 'longitude', 'is_verified', 'is_public',
            'rating_avg', 'rating_count', 'view_count', 'booking_count',
            'created_at', 'updated_at', 'provider', 'event_type',
            'service_category', 'subcategories'
        ]


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['user', 'created_at']


class EventSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    event_type = EventTypeSerializer(read_only=True)
    services = ServiceSubCategorySerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Event
        fields = [
            'id', 'slug', 'title', 'description', 'price', 'budget',
            'location', 'image', 'video', 'date', 'event_type', 
            'user', 'services', 'average_rating', 'created_at'
        ]


class FavoriteSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = Favorite
        fields = ['id', 'event', 'created_at']


class RSVPSerializer(serializers.ModelSerializer):
    event = EventSerializer(read_only=True)
    
    class Meta:
        model = RSVP
        fields = ['id', 'event', 'guests', 'created_at']
