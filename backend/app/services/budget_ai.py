from typing import List, Dict

# O'zbekiston to'ylari uchun standart optimal xarajatlar taqsimoti
DEFAULT_PERCENTAGES = {
    "toyxona-restoran": {
        "name": "To'yxona va Dasturxon",
        "percent": 0.48, # 48%
    },
    "sanatkor-boshlovchi": {
        "name": "San'atkor, Boshlovchi va Sozandalar",
        "percent": 0.20, # 20%
    },
    "foto-video": {
        "name": "Foto va Video montaj studiyasi",
        "percent": 0.12, # 12%
    },
    "liboslar-sarpo": {
        "name": "Kelin libosi, Sarpo va Pardoz",
        "percent": 0.10, # 10%
    },
    "kortej-transport": {
        "name": "Avtomobillar korteji va Transport",
        "percent": 0.05, # 5%
    },
    "bezak-taklifnoma": {
        "name": "Dekoratsiya, Gulchambarlar va Taklifnomalar",
        "percent": 0.05, # 5%
    }
}

def calculate_wedding_budget(total_budget: float, guest_count: int = 300) -> Dict:
    """
    To'y byudjetini oqilona taqsimlovchi va har bir toifaga optimal mablag' ajratuvchi algoritm.
    """
    allocations = []
    
    for slug, config in DEFAULT_PERCENTAGES.items():
        amount = round(total_budget * config["percent"], -4) # 10,000 so'mgacha yaxlitlash
        allocations.append({
            "category_slug": slug,
            "category_name": config["name"],
            "percentage": config["percent"] * 100,
            "allocated_amount": amount,
            "recommended_vendor_count": 3
        })

    tips = [
        f"Keltirilgan byudjet {guest_count} nafar mehmon uchun bir kishiga o'rtacha {round(total_budget / guest_count):,} so'm to'g'ri kelishini ko'rsatadi.",
        "To'yxona band qilishni to'ydan kamida 3-4 oy oldin boshlash narxni 10-15% tejashga yordam beradi.",
        "Kuz va bahor oylarida juma va yakshanba kunlari talab eng yuqori bo'ladi; payshanba yoki shanba kunduzi arzonroq variantlarni topish mumkin."
    ]

    return {
        "total_budget": total_budget,
        "guest_count": guest_count,
        "allocations": allocations,
        "tips": tips
    }
