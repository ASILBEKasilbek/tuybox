from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.db.models import Q, Avg, Prefetch, F
from django.views import View
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.core.cache import cache
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie
from math import radians, cos, sin, asin, sqrt
from .models import Service

from .models import (
    EventType, ServiceCategory, ServiceSubCategory,
    Event, Service, Profile, Review, Favorite, RSVP, Notification
)
from .forms import (
    EventForm, ReviewForm, UserRegisterForm,
    ProfileForm, ServiceForm, ServiceCategoryForm, ServiceSubCategoryForm
)

# ============================================
# Event List (Optimized Class-Based View)
# ============================================

class EventListView(ListView):
    model = Service
    template_name = 'events/event_list.html'
    context_object_name = 'services'
    paginate_by = 20

    def get_queryset(self):
        # Cache key based on query parameters
        cache_key = f"services_list_{self.request.GET.urlencode()}"
        cached_queryset = cache.get(cache_key)
        
        if cached_queryset is not None:
            return cached_queryset
        
        # Optimized query with all related data
        queryset = (
            Service.objects
            .filter(is_public=True)
            .select_related('event_type', 'service_category', 'provider', 'provider__profile')
            .prefetch_related('subcategories')
            .only(
                'id', 'title', 'slug', 'description', 'price', 'image1', 
                'is_verified', 'created_at', 'rating_avg', 'view_count',
                'event_type__name', 'service_category__name', 
                'provider__username', 'provider__profile__avatar'
            )
        )

        # GET parametrlari
        query = self.request.GET.get('q')
        event_type_id = self.request.GET.get('event_type')
        service_category_id = self.request.GET.get('service_category')
        subcategory_id = self.request.GET.get('subcategory')
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        min_rating = self.request.GET.get('min_rating')
        sort = self.request.GET.get('sort', 'new')
        is_verified = self.request.GET.get('verified')

        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query) |
                Q(provider__username__icontains=query)
            )

        if event_type_id:
            queryset = queryset.filter(event_type_id=event_type_id)

        if service_category_id:
            queryset = queryset.filter(service_category_id=service_category_id)

        if subcategory_id:
            queryset = queryset.filter(subcategories__id=subcategory_id)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
            
        if min_rating:
            queryset = queryset.filter(rating_avg__gte=min_rating)
            
        if is_verified:
            queryset = queryset.filter(is_verified=True)

        # Sorting with optimized indexes
        if sort == 'cheap':
            queryset = queryset.order_by('price', '-created_at')
        elif sort == 'expensive':
            queryset = queryset.order_by('-price', '-created_at')
        elif sort == 'popular':
            queryset = queryset.order_by('-view_count', '-booking_count', '-created_at')
        elif sort == 'top-rated':
            queryset = queryset.order_by('-rating_avg', '-rating_count', '-created_at')
        else:  # new
            queryset = queryset.order_by('-created_at')

        result = queryset.distinct()
        
        # Cache for 5 minutes
        cache.set(cache_key, result, 300)
        
        return result

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        # Cache event types and categories
        cache_key_types = 'event_types_all'
        event_types = cache.get(cache_key_types)
        
        if event_types is None:
            event_types = EventType.objects.prefetch_related(
                Prefetch('service_categories', queryset=ServiceCategory.objects.prefetch_related('subcategories'))
            )
            cache.set(cache_key_types, event_types, 3600)  # 1 hour
        
        context['event_types'] = event_types
        context['categories'] = ServiceCategory.objects.all()

        # Musiqa janrlari
        context['genres'] = [
            "Christian", "Club", "Country", "Electronic", "Hip Hop", "Indie",
            "International", "Jazz", "Oldies", "Pop", "R&B/Soul", "Rock",
            "Top 40", "South Asian"
        ]

        # GET orqali tanlangan qiymatlar
        context["selected_genres"] = self.request.GET.getlist("genres") 
        context["selected_diversity"] = self.request.GET.getlist("diversity")
        return context


# ============================================
# Service Detail View (Optimized)
# ============================================
class ServiceDetailView(DetailView):
    model = Service
    template_name = 'events/service_detail.html'
    context_object_name = 'service'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'

    def get_queryset(self):
        return Service.objects.select_related(
            'event_type', 'service_category', 'provider', 'provider__profile'
        ).prefetch_related('subcategories')

    def get_object(self):
        obj = super().get_object()
        # Increment view count atomically
        Service.objects.filter(pk=obj.pk).update(view_count=F('view_count') + 1)
        return obj

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        service = self.object

        # O'xshash xizmatlar (cached)
        cache_key = f'related_services_{service.id}'
        related = cache.get(cache_key)
        
        if related is None:
            related = (
                Service.objects
                .filter(service_category=service.service_category, is_public=True)
                .exclude(id=service.id)
                .select_related('provider', 'provider__profile')
                .prefetch_related('subcategories')
                .only('id', 'title', 'slug', 'price', 'image1', 'rating_avg')[:6]
            )
            cache.set(cache_key, list(related), 600)  # 10 minutes

        context['related_services'] = related
        context['phone_number'] = service.provider.profile.phone if hasattr(service.provider, 'profile') else None

        return context


# ============================================
# Event Detail View (Optimized)
# ============================================
class EventDetailView(DetailView):
    model = Event
    template_name = 'events/event_detail.html'
    context_object_name = 'event'
    pk_url_kwarg = 'event_id'

    def get_queryset(self):
        return Event.objects.select_related(
            'event_type', 'user', 'user__profile'
        ).prefetch_related('services', 'reviews__user')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event = self.get_object()
        context.update({
            'reviews': event.reviews.select_related('user')[:20],
            'review_form': ReviewForm(),
            'is_favorited': self.request.user.is_authenticated
                            and Favorite.objects.filter(user=self.request.user, event=event).exists(),
            'has_rsvped': self.request.user.is_authenticated
                          and RSVP.objects.filter(user=self.request.user, event=event).exists(),
        })
        return context

    def post(self, request, *args, **kwargs):
        event = self.get_object()
        if not request.user.is_authenticated:
            return redirect('login')

        # Add Review
        if 'review' in request.POST:
            review_form = ReviewForm(request.POST)
            if review_form.is_valid():
                review = review_form.save(commit=False)
                review.event = event
                review.user = request.user
                review.save()
            return redirect('event_detail', event_id=event.id)

        # Toggle Favorite
        elif 'favorite' in request.POST:
            fav, created = Favorite.objects.get_or_create(user=request.user, event=event)
            if not created:
                fav.delete()
            return redirect('event_detail', event_id=event.id)

        # RSVP
        elif 'rsvp' in request.POST:
            guests = request.POST.get('guests', 1)
            rsvp, _ = RSVP.objects.get_or_create(user=request.user, event=event)
            rsvp.guests = guests
            rsvp.save()
            return redirect('event_detail', event_id=event.id)

        return redirect('event_detail', event_id=event.id)


# ============================================
# Event Create View
# ============================================
class EventCreateView(LoginRequiredMixin, CreateView):
    model = Event
    form_class = EventForm
    template_name = 'events/event_create.html'

    def form_valid(self, form):
        form.instance.user = self.request.user
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('event_detail', kwargs={'event_id': self.object.id})


# ============================================
# Service Create View
# ============================================
class ServiceCreateView(LoginRequiredMixin, CreateView):
    model = Service
    form_class = ServiceForm
    template_name = 'events/service_create.html'

    def form_valid(self, form):
        form.instance.provider = self.request.user
        # Clear cache
        cache.delete_many([k for k in cache.keys('services_list_*')])
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('profile_detail', kwargs={'pk': self.request.user.id})


# ============================================
# Service Category Create View
# ============================================
class ServiceCategoryCreateView(LoginRequiredMixin, CreateView):
    model = ServiceCategory
    form_class = ServiceCategoryForm
    template_name = 'events/service_category_create.html'

    def form_valid(self, form):
        # Clear cache
        cache.delete('event_types_all')
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('event_list')


# ============================================
# Service SubCategory Create View
# ============================================
class ServiceSubCategoryCreateView(LoginRequiredMixin, CreateView):
    model = ServiceSubCategory
    form_class = ServiceSubCategoryForm
    template_name = 'events/service_subcategory_create.html'

    def form_valid(self, form):
        form.instance.service = Service.objects.filter(provider=self.request.user).first()
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('event_list')


# ============================================
# Profile Views (Optimized)
# ============================================
class ProfileDetailView(LoginRequiredMixin, DetailView):
    model = Profile
    template_name = "accounts/profile_detail.html"
    context_object_name = "profile"

    def get_queryset(self):
        return Profile.objects.select_related('user')

    def get_object(self):
        return get_object_or_404(Profile, pk=self.kwargs["pk"])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Optimized services query
        context["services"] = Service.objects.filter(
            provider=self.object.user
        ).select_related('service_category', 'event_type').only(
            'id', 'title', 'slug', 'price', 'image1', 'rating_avg', 'created_at'
        )
        return context


class ProfileEditView(LoginRequiredMixin, UpdateView):
    model = Profile
    form_class = ProfileForm
    template_name = "accounts/profile_edit.html"

    def get_object(self):
        return get_object_or_404(Profile, user=self.request.user)

    def get_success_url(self):
        return reverse_lazy("profile_detail", kwargs={"pk": self.request.user.profile.id})


# ============================================
# User Registration
# ============================================
def register_view(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('profile_edit')
    else:
        form = UserRegisterForm()
    return render(request, 'registration/register.html', {'form': form})


# ============================================
# Notifications (Optimized)
# ============================================
class NotificationsListView(LoginRequiredMixin, ListView):
    model = Notification
    template_name = 'events/notifications.html'
    context_object_name = 'notifications'
    paginate_by = 20

    def get_queryset(self):
        return Notification.objects.filter(
            user=self.request.user
        ).order_by('-created_at').only('id', 'message', 'read', 'created_at')


# ============================================
# Nearest Service API (Optimized)
# ============================================
def haversine(lat1, lon1, lat2, lon2):
    """Calculate distance between two points on Earth"""
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c


class NearestServiceAPI(View):
    def get(self, request, *args, **kwargs):
        try:
            user_lat = float(request.GET.get("lat"))
            user_lng = float(request.GET.get("lng"))
        except (TypeError, ValueError):
            return JsonResponse({"error": "latitude va longitude yuborilishi kerak!"}, status=400)

        # Optimized query
        services = Service.objects.filter(
            latitude__isnull=False,
            longitude__isnull=False,
            is_public=True
        ).only('id', 'slug', 'title', 'description', 'price', 'latitude', 'longitude', 'image1')
        
        if not services.exists():
            return JsonResponse({"error": "Xizmat topilmadi"}, status=404)

        # Calculate distances and sort
        services_with_distance = [
            {
                "id": s.id,
                "slug": s.slug,
                "title": s.title,
                "description": s.description[:100] + "..." if len(s.description) > 100 else s.description,
                "price": str(s.price) if s.price else "Noma'lum",
                "lat": s.latitude,
                "lng": s.longitude,
                "image": s.image1.url if s.image1 else None,
                "distance": round(haversine(user_lat, user_lng, s.latitude, s.longitude), 2)
            }
            for s in services
        ]
        
        services_with_distance.sort(key=lambda x: x['distance'])

        return JsonResponse({"services": services_with_distance[:20]})  # Top 20


# ============================================
# Map View
# ============================================
class XaritadaView(TemplateView):
    template_name = "events/xaritada.html"


# ============================================
# Category List View (Optimized)
# ============================================
class CategoriyaListView(ListView):
    model = ServiceCategory
    template_name = "categoriya/categoriyalar.html"
    context_object_name = "services"
    paginate_by = 20
    pk_url_kwarg = "category_id"
    
    def get_queryset(self):
        category_id = self.kwargs.get(self.pk_url_kwarg)
        return Service.objects.filter(
            service_category_id=category_id,
            is_public=True
        ).select_related(
            'provider', 'provider__profile', 'service_category', 'event_type'
        ).prefetch_related('subcategories').only(
            'id', 'title', 'slug', 'description', 'price', 'image1', 
            'rating_avg', 'view_count', 'created_at'
        )
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_id = self.kwargs.get(self.pk_url_kwarg)
        
        # Cache category
        cache_key = f'category_{category_id}'
        category = cache.get(cache_key)
        
        if category is None:
            category = get_object_or_404(ServiceCategory, pk=category_id)
            cache.set(cache_key, category, 3600)
        
        context["category"] = category
        return context
