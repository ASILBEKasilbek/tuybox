from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from django.core.cache import cache

from .models import (
    EventType, ServiceCategory, ServiceSubCategory,
    Event, Service, Profile, Review
)
from .serializers import (
    EventTypeSerializer, ServiceCategorySerializer, ServiceSubCategorySerializer,
    EventSerializer, ServiceListSerializer, ServiceDetailSerializer,
    ProfileSerializer, ReviewSerializer
)


class EventTypeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for Event Types
    """
    queryset = EventType.objects.all()
    serializer_class = EventTypeSerializer
    
    def list(self, request, *args, **kwargs):
        # Cache for 1 hour
        cache_key = 'api_event_types'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, 3600)
        return response


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for Service Categories
    """
    queryset = ServiceCategory.objects.select_related('event_type')
    serializer_class = ServiceCategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['event_type']
    
    def list(self, request, *args, **kwargs):
        # Cache for 1 hour
        event_type = request.query_params.get('event_type', '')
        cache_key = f'api_categories_{event_type}'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        response = super().list(request, *args, **kwargs)
        cache.set(cache_key, response.data, 3600)
        return response


class ServiceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Services with advanced filtering
    """
    queryset = Service.objects.filter(is_public=True).select_related(
        'event_type', 'service_category', 'provider', 'provider__profile'
    ).prefetch_related('subcategories')
    
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = {
        'event_type': ['exact'],
        'service_category': ['exact'],
        'price': ['gte', 'lte'],
        'rating_avg': ['gte'],
        'is_verified': ['exact'],
    }
    
    search_fields = ['title', 'description', 'provider__username']
    ordering_fields = ['created_at', 'price', 'rating_avg', 'view_count', 'booking_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ServiceListSerializer
        return ServiceDetailSerializer
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Service.objects.filter(pk=instance.pk).update(view_count=models.F('view_count') + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular services"""
        cache_key = 'api_services_popular'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        services = self.get_queryset().order_by('-view_count', '-booking_count')[:20]
        serializer = ServiceListSerializer(services, many=True)
        cache.set(cache_key, serializer.data, 600)  # 10 minutes
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def top_rated(self, request):
        """Get top rated services"""
        cache_key = 'api_services_top_rated'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)
        
        services = self.get_queryset().filter(
            rating_count__gte=5
        ).order_by('-rating_avg', '-rating_count')[:20]
        serializer = ServiceListSerializer(services, many=True)
        cache.set(cache_key, serializer.data, 600)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        """Get services near user location"""
        try:
            lat = float(request.query_params.get('lat'))
            lng = float(request.query_params.get('lng'))
            radius = float(request.query_params.get('radius', 10))  # km
        except (TypeError, ValueError):
            return Response(
                {"error": "lat, lng parameters required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Simple bounding box filter (for performance)
        # 1 degree ≈ 111 km
        lat_range = radius / 111.0
        lng_range = radius / (111.0 * abs(math.cos(math.radians(lat))))
        
        services = self.get_queryset().filter(
            latitude__gte=lat - lat_range,
            latitude__lte=lat + lat_range,
            longitude__gte=lng - lng_range,
            longitude__lte=lng + lng_range,
        )[:50]
        
        serializer = ServiceListSerializer(services, many=True)
        return Response(serializer.data)


class EventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Events
    """
    queryset = Event.objects.select_related(
        'event_type', 'user', 'user__profile'
    ).prefetch_related('services')
    
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['event_type', 'user']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'date', 'price']
    ordering = ['-created_at']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProfileViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for user profiles
    """
    queryset = Profile.objects.select_related('user').filter(is_public=True)
    serializer_class = ProfileSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__username', 'bio', 'location']
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user's profile"""
        serializer = self.get_serializer(request.user.profile)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def services(self, request, pk=None):
        """Get services provided by this profile"""
        profile = self.get_object()
        services = Service.objects.filter(
            provider=profile.user,
            is_public=True
        ).select_related('event_type', 'service_category')
        
        serializer = ServiceListSerializer(services, many=True)
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Reviews
    """
    queryset = Review.objects.select_related('user', 'event')
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['event']
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
