from django.urls import path
from . import views

urlpatterns = [
    path('profile/<str:username>/', views.profile_detail, name='profile_detail'),
    path('service/<int:service_id>/calendar/', views.service_calendar_events, name='service_calendar_events'),
]
