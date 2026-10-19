from django.shortcuts import render
from .models import DonationGoal, Donor, AdBanner
import hashlib
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
MERCHANT_ID = "your_merchant_id"
MERCHANT_USER_ID = "your_user_id"
SECRET_KEY = "your_secret_key"
# SERVICE_ID = "75682"
# MERCHANT_ID = "41325"
# SECRET_KEY = "eWPSzBycE8"
# MERCHANT_USER_ID = "57689"
def sidebar_donate(request):
    goal = DonationGoal.objects.first()  # faqat 1 ta maqsad
    donors = Donor.objects.order_by('-created_at')[:5]  # oxirgi 5 donor
    banners = AdBanner.objects.filter(is_active=True)

    return render(request, "sidebar.html", {
        "goal": goal,
        "donors": donors,
        "banners": banners,
    })


def donate_redirect(request):
    amount = 10000  # minimal summa so'mda (masalan 10 000 so‘m)
    return redirect(f"https://my.click.uz/services/pay?service_id={MERCHANT_ID}&amount={amount}&merchant_user_id={MERCHANT_USER_ID}")
    

@csrf_exempt
def click_callback(request):
    data = request.POST
    # Imzo tekshirish
    sign_string = f"{data['click_trans_id']}{data['service_id']}{SECRET_KEY}"
    sign = hashlib.md5(sign_string.encode()).hexdigest()

    if sign != data.get("sign_string"):
        return JsonResponse({"error": -1, "error_note": "Invalid sign"})

    # Bu joyda to‘lovni DB ga yozib qo‘yasiz
    return JsonResponse({"error": 0, "error_note": "Success"})

def send_money(request):
    # Foydalanuvchi Click yoki bank sahifasida o'z kartasi va summasini kiritadi
    click_app_link = "https://my.click.uz/"  # yoki rasmiy universal link: https://my.click.uz/p2p
    return redirect(click_app_link)

