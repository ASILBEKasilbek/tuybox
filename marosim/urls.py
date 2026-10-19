from django.urls import path
from .views import (
    EventListView, EventDetailView, EventCreateView, ServiceCreateView,
    ProfileEditView, register_view, NotificationsListView, XaritadaView, ServiceDetailView,
    NearestServiceAPI, ProfileDetailView, CategoriyaListView
)
from . import views
urlpatterns = [
    path('', EventListView.as_view(), name='event_list'),
    path('event/<int:event_id>/', EventDetailView.as_view(), name='event_detail'),
    path('event/create/', EventCreateView.as_view(), name='event_create'),
    path('service/create/', ServiceCreateView.as_view(), name='service_create'),
    path('profile/edit/', ProfileEditView.as_view(), name='profile_edit'),
    path('register/', register_view, name='register'),
    path('notifications/', NotificationsListView.as_view(), name='notifications'),
    path('service/<slug:slug>/', ServiceDetailView.as_view(), name='service_detail'),
    path("xaritada/", XaritadaView.as_view(), name="xaritada"),
    path("api/nearest_service/", NearestServiceAPI.as_view(), name="nearest_service_api"),
    path("profile/<int:pk>/", ProfileDetailView.as_view(), name="profile_detail"),
    path("profile/edit/", ProfileEditView.as_view(), name="profile_edit"),
    path("categoriya/<int:category_id>/", CategoriyaListView.as_view(), name="category_events"),
    # path("donate/click/", views.donate_redirect, name="donate_redirect"),
    # path("donate/click/callback/", views.click_callback, name="click_callback"),
]
