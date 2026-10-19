from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Service, Booking
import datetime
from marosim.models import Profile

def profile_detail(request, username):
    profile = get_object_or_404(Profile, user__username=username)
    services = profile.user.services.all() if profile.is_provider else []
    return render(request, "profile_detail.html", {"profile": profile, "services": services})


def service_calendar_events(request, service_id):
    service = Service.objects.get(id=service_id)
    days = service.days.all()
    
    events = []
    for d in days:
        symbol = ""
        color = None

        if d.status == "work":
            symbol = "●"   # dumaloq
            color = "green"
        elif d.status == "booked":
            symbol = "✖"  # olingan
            color = "red"
        elif d.status == "done":
            symbol = "✔"  # bajarilgan
            color = "blue"
        elif d.status == "off":
            symbol = ""   # dam olish – hech narsa yo‘q
            color = None

        events.append({
            "title": symbol,
            "start": d.date.isoformat(),
            "color": color,  # faqat rang fon uchun
            "display": "auto"
        })

    return JsonResponse(events, safe=False)
