from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/seating", tags=["Seating & Table Planner"])

# In-Memory Database for Wedding Seating
TABLES_DATA = [
    {
        "id": 0,
        "name": "Prezidium (Kelin-Kuyov Sahnasi)",
        "category": "vip",
        "capacity": 2,
        "guests": ["Jasurbek (Kuyov)", "Madina (Kelin)"],
        "table_number": "VIP",
        "is_full": True,
    },
    {
        "id": 1,
        "name": "1-Stol: Bosh Qudalar & Ota-Onasi",
        "category": "elders",
        "capacity": 12,
        "guests": [
            "Rustam Ota (Kuyovning Otasi)",
            "Dilorom Ona (Kuyovning Onasi)",
            "Botirjon Aka (Kelinning Otasi)",
            "Gulchehra Opa (Kelinning Onasi)",
            "Salim Tog'a",
            "Mavluda Xola",
        ],
        "table_number": "1",
        "is_full": False,
    },
    {
        "id": 2,
        "name": "2-Stol: Tog'alar & Ammalar (Qarindoshlar)",
        "category": "relatives",
        "capacity": 12,
        "guests": [
            "Alisher Tog'a",
            "Nargiza Yangi",
            "Sanjar Amaki",
            "Feruza Kenoy",
            "Shohruh Tog'a",
            "Dilnoza Xola",
            "Muzaffar Aka",
            "Munira Yangi",
        ],
        "table_number": "2",
        "is_full": False,
    },
    {
        "id": 3,
        "name": "3-Stol: Kuyovning Eng Yaqin Do'stlari",
        "category": "friends",
        "capacity": 10,
        "guests": [
            "Sardorbek",
            "Bobur Mirzayev",
            "Javohir Saidov",
            "Sherzod",
            "Farrux",
            "Islom",
            "Otabek",
        ],
        "table_number": "3",
        "is_full": False,
    },
    {
        "id": 4,
        "name": "4-Stol: Kelinning Dugonalari",
        "category": "friends",
        "capacity": 10,
        "guests": [
            "Shahnoza (Bosh Dugona)",
            "Dildora Karimova",
            "Kamola",
            "Zilola",
            "Nafisa",
            "Sabina",
        ],
        "table_number": "4",
        "is_full": False,
    },
    {
        "id": 5,
        "name": "5-Stol: Hamkasblar & Biznes Hamkorlar",
        "category": "colleagues",
        "capacity": 10,
        "guests": [
            "Ulug'bek (Team Lead)",
            "Davron Aka",
            "Nodirbek",
            "Malika",
            "Azamat",
        ],
        "table_number": "5",
        "is_full": False,
    },
    {
        "id": 6,
        "name": "6-Stol: Toshkentlik Hurmatli Mehmonlar",
        "category": "vip",
        "capacity": 12,
        "guests": [
            "Rahmonberdi Hoji Ota",
            "Xadicha Hoji Ona",
            "Anvar Qori Aka",
            "Sobirjon Domla",
        ],
        "table_number": "6",
        "is_full": False,
    },
    {
        "id": 7,
        "name": "7-Stol: Yoshlar & Talabalik Do'stlar",
        "category": "friends",
        "capacity": 10,
        "guests": [
            "Behzod",
            "Humoyun",
            "Doston",
            "Akmal",
            "Jasur",
        ],
        "table_number": "7",
        "is_full": False,
    },
]

class AssignGuestRequest(BaseModel):
    table_id: int
    guest_name: str

class UnassignGuestRequest(BaseModel):
    table_id: int
    guest_name: str

@router.get("/tables")
async def get_all_tables():
    """
    To'yxonadagi barcha stollar, ularning sig'imi va mehmonlar ro'yxatini olish
    """
    total_capacity = sum(t["capacity"] for t in TABLES_DATA)
    total_seated = sum(len(t["guests"]) for t in TABLES_DATA)
    return {
        "status": "success",
        "total_tables": len(TABLES_DATA),
        "total_capacity": total_capacity,
        "total_seated": total_seated,
        "free_seats": total_capacity - total_seated,
        "tables": TABLES_DATA,
    }

@router.post("/assign")
async def assign_guest_to_table(data: AssignGuestRequest):
    """
    Mehmonni belgilangan stolga biriktirish
    """
    target_table = next((t for t in TABLES_DATA if t["id"] == data.table_id), None)
    if not target_table:
        raise HTTPException(status_code=404, detail="Stol topilmadi")
    
    if len(target_table["guests"]) >= target_table["capacity"]:
        raise HTTPException(status_code=400, detail="Bu stolda bo'sh joy qolmadi!")
    
    # Boshqa stollardan o'chirish (bir mehmon faqat bitta stolda o'tiradi)
    for t in TABLES_DATA:
        if data.guest_name in t["guests"]:
            t["guests"].remove(data.guest_name)
    
    target_table["guests"].append(data.guest_name)
    target_table["is_full"] = len(target_table["guests"]) >= target_table["capacity"]
    
    return {
        "status": "success",
        "message": f"'{data.guest_name}' muvaffaqiyatli '{target_table['name']}'ga biriktirildi!",
        "table": target_table,
    }

@router.post("/unassign")
async def unassign_guest(data: UnassignGuestRequest):
    """
    Mehmonni stoldan chiqarish
    """
    target_table = next((t for t in TABLES_DATA if t["id"] == data.table_id), None)
    if not target_table:
        raise HTTPException(status_code=404, detail="Stol topilmadi")
    
    if data.guest_name in target_table["guests"]:
        target_table["guests"].remove(data.guest_name)
        target_table["is_full"] = False
        return {
            "status": "success",
            "message": f"'{data.guest_name}' stoldan chiqarildi.",
            "table": target_table,
        }
    
    raise HTTPException(status_code=404, detail="Mehmon bu stolda topilmadi")

@router.get("/find-table")
async def find_table_by_guest(guest_name: str = Query(...)):
    """
    Mehmon ismiga ko'ra uning to'yxonadagi stolini aniqlash (Raqamli taklifnoma uchun)
    """
    for t in TABLES_DATA:
        for g in t["guests"]:
            if guest_name.lower() in g.lower():
                return {
                    "found": True,
                    "guest_name": g,
                    "table_number": t["table_number"],
                    "table_name": t["name"],
                    "category": t["category"],
                }
    return {
        "found": False,
        "message": "Mehmon hali hech qaysi stolga biriktirilmagan yoki umumiy stollar ro'yxatida."
    }
