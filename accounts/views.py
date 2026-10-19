# from django.shortcuts import render, get_object_or_404, redirect
# from django.contrib.auth.models import User
# from .models import Profile
# from django.views.decorators.csrf import csrf_exempt
# from django.http import JsonResponse
# from django.contrib.auth.models import User
# from .models import Profile
# import json

# def provider_list(request):
#     providers = Profile.objects.filter(is_provider=True)
#     return render(request, "marosim/provider_list.html", {"providers": providers})

# def profile_detail(request, username):
#     user = get_object_or_404(User, username=username)
#     return render(request, "marosim/profile_detail.html", {"profile": user.profile})

# def profile_edit(request):
#     profile = request.user.profile
#     if request.method == "POST":
#         # Formni saqlash logikasi
#         pass
#     return render(request, "marosim/profile_edit.html", {"profile": profile})


# @csrf_exempt
# def telegram_contact_webhook(request):
#     if request.method == "POST":
#         data = json.loads(request.body)
#         telegram_id = data.get("telegram_id")
#         phone = data.get("phone_number")

#         if telegram_id and phone:
#             user, created = User.objects.get_or_create(username=str(telegram_id))
            
#             if not hasattr(user, "profile"):
#                 Profile.objects.create(user=user)
            
#             user.profile.phone = phone
#             user.profile.save()
#             return JsonResponse({"status": "success"})
        
#     return JsonResponse({"status": "failed"})
