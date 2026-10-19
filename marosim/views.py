from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView, DetailView, CreateView, UpdateView
from django.db.models import Q, Avg, Prefetch
from django.views import View
from django.views.generic import TemplateView
from django.http import JsonResponse
from django.shortcuts import render
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
# Event List (Class-Based View)
# ============================================

class EventListView(ListView):
    model = Service
    template_name = 'events/event_list.html'
    context_object_name = 'services'
    paginate_by = 10

    def get_queryset(self):
        queryset = (
            Service.objects
            .select_related('event_type', 'service_category', 'provider')
            .prefetch_related('subcategories')   # subkategoriya bilan ishlash uchun
        )

        # GET parametrlari
        query = self.request.GET.get('q')
        event_type_id = self.request.GET.get('event_type')
        service_category_id = self.request.GET.get('service_category')
        subcategory_id = self.request.GET.get('subcategory')  # 🆕
        min_price = self.request.GET.get('min_price')
        max_price = self.request.GET.get('max_price')
        sort = self.request.GET.get('sort')

        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(description__icontains=query)
            )

        if event_type_id:
            queryset = queryset.filter(event_type_id=event_type_id)

        if service_category_id:
            queryset = queryset.filter(service_category_id=service_category_id)

        if subcategory_id:   # 🆕 subkategoriya bo‘yicha filter
            queryset = queryset.filter(subcategories__id=subcategory_id)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if sort == 'cheap':
            queryset = queryset.order_by('price')
        elif sort == 'expensive':
            queryset = queryset.order_by('-price')
        elif sort == 'new':
            queryset = queryset.order_by('-created_at')

        return queryset.distinct()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['event_types'] = EventType.objects.prefetch_related(
            Prefetch('service_categories', queryset=ServiceCategory.objects.prefetch_related('subcategories'))
        )
        context['categories'] = ServiceCategory.objects.all()

        # 🎶 Musiqa janrlari
        context['genres'] = [
            "Christian", "Club", "Country", "Electronic", "Hip Hop", "Indie",
            "International", "Jazz", "Oldies", "Pop", "R&B/Soul", "Rock",
            "Top 40", "South Asian"
        ]

        # GET orqali tanlangan qiymatlar
        context["selected_genres"] = self.request.GET.getlist("genres") 
        context["selected_diversity"] = self.request.GET.getlist("diversity")  # <-- bu qo‘shildi
        return context



# ============================================
# Event Detail View
# ============================================
class EventDetailView(DetailView):
    model = Event
    template_name = 'events/event_detail.html'
    context_object_name = 'event'
    pk_url_kwarg = 'event_id'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        event = self.get_object()
        context.update({
            'reviews': event.reviews.all(),
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

class ProfileDetailView(LoginRequiredMixin, DetailView):
    model = Profile
    template_name = "accounts/profile_detail.html"
    context_object_name = "profile"

    def get_object(self):
        return get_object_or_404(Profile, pk=self.kwargs["pk"])

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Ushbu profil foydalanuvchisi yaratgan servicelarni chiqaramiz
        context["services"] = Service.objects.filter(provider=self.object.user)
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
# Notifications
# ============================================
class NotificationsListView(LoginRequiredMixin, ListView):
    model = Notification
    template_name = 'events/notifications.html'
    context_object_name = 'notifications'

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')


class ServiceDetailView(DetailView):
    model = Service
    template_name = 'events/service_detail.html'
    context_object_name = 'service'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        service = self.object

        # O‘xshash xizmatlar
        related = (
            Service.objects
            .filter(service_category=service.service_category)
            .exclude(id=service.id)
            .select_related('provider')
            .prefetch_related('subcategories')[:4]
        )

        context['related_services'] = related

        # Telefon raqam qo‘shish
        context['phone_number'] = service.provider.profile.phone if hasattr(service.provider, 'profile') else None

        return context

# 🔹 Haversine formula
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Yer radiusi (km)
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return R * c

class XaritadaView(TemplateView):
    template_name = "events/xaritada.html"

class NearestServiceAPI(View):
    def get(self, request, *args, **kwargs):
        try:
            user_lat = float(request.GET.get("lat"))
            user_lng = float(request.GET.get("lng"))
        except (TypeError, ValueError):
            return JsonResponse({"error": "latitude va longitude yuborilishi kerak!"}, status=400)

        services = Service.objects.exclude(latitude=None).exclude(longitude=None)        
        if not services.exists():
            return JsonResponse({"error": "Bazadan xizmat topilmadi"}, status=404)

        # Masofaga qarab tartiblash
        services_sorted = sorted(
            services,
            key=lambda s: haversine(user_lat, user_lng, s.latitude, s.longitude)
        )
        data = []
        for s in services_sorted:
            data.append({
                "id": s.id,
                "slug": s.slug,
                "title": s.title,
                "description": s.description,
                "price": str(s.price) if s.price else "Noma’lum",
                "lat": s.latitude,
                "lng": s.longitude,
                "image": s.image1.url if s.image1 else None,  # 🔥 faqat birinchi rasmi
            })

        return JsonResponse({"services": data})


class CategoriyaListView(ListView):
    model = ServiceCategory
    template_name = "categoriya/categoriyalar.html"
    context_object_name = "services"
    paginate_by = 10
    pk_url_kwarg = "category_id"
    def get_queryset(self):
        category_id = self.kwargs.get(self.pk_url_kwarg)
        return Service.objects.filter(service_category_id=category_id).select_related('provider', 'service_category').prefetch_related('subcategories')
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        category_id = self.kwargs.get(self.pk_url_kwarg)
        context["category"] = get_object_or_404(ServiceCategory, pk=category_id)
        return context
    