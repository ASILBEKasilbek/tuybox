from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/checklist", tags=["Wedding Checklist & Sarpo"])

# In-Memory Database for Wedding Tasks & Checklist
CHECKLIST_DATA = [
    # 1. 30 kun oldin (Asosiy)
    {"id": 1, "stage": "30_days", "title": "To'yxona zalini tanlash va bron qilish", "category": "To'yxona", "completed": True, "priority": "high", "cost_est": "48,000,000"},
    {"id": 2, "stage": "30_days", "title": "FHDYo (ZAGS) arizasi va tibbiy ko'rik", "category": "Hujjatlar", "completed": True, "priority": "high", "cost_est": "500,000"},
    {"id": 3, "stage": "30_days", "title": "Boshlovchi va san'atkorlar bilan shartnoma", "category": "San'atkor", "completed": True, "priority": "high", "cost_est": "15,000,000"},
    {"id": 4, "stage": "30_days", "title": "Fotograf va videograf (Love Story)", "category": "Media", "completed": True, "priority": "medium", "cost_est": "6,000,000"},
    {"id": 5, "stage": "30_days", "title": "Mehmonlar sonini va stollar rejasini tuzish", "category": "Reja", "completed": True, "priority": "medium", "cost_est": "0"},

    # 2. 15 kun oldin (Tafsilotlar)
    {"id": 6, "stage": "15_days", "title": "Raqamli taklifnomalarni mehmonlarga tarqatish", "category": "Taklifnoma", "completed": True, "priority": "high", "cost_est": "0"},
    {"id": 7, "stage": "15_days", "title": "Kelin ko'ylak va fasonni yakuniy kiyib ko'rish", "category": "Kiyim", "completed": False, "priority": "high", "cost_est": "8,000,000"},
    {"id": 8, "stage": "15_days", "title": "Kuyov kostyum-shimi va poyabzali", "category": "Kiyim", "completed": True, "priority": "medium", "cost_est": "3,500,000"},
    {"id": 9, "stage": "15_days", "title": "Nikoh uzuklarini xarid qilish va o'lchash", "category": "Zargarlik", "completed": True, "priority": "high", "cost_est": "12,000,000"},
    {"id": 10, "stage": "15_days", "title": "To'y korteji (Malibu / Maybach) bron qilish", "category": "Avto", "completed": False, "priority": "medium", "cost_est": "4,000,000"},

    # 3. 3 kun oldin (To'y arafasida)
    {"id": 11, "stage": "3_days", "title": "To'y torti va desertlar buyurtmasini tasdiqlash", "category": "Oshxona", "completed": False, "priority": "medium", "cost_est": "3,000,000"},
    {"id": 12, "stage": "3_days", "title": "Nahor oshi uchun masalliqlarni tayyorlash", "category": "Osh", "completed": False, "priority": "high", "cost_est": "18,000,000"},
    {"id": 13, "stage": "3_days", "title": "Kelin dugonalar va kuyov jo'ralar liboslari", "category": "Dress-kod", "completed": False, "priority": "low", "cost_est": "2,000,000"},
    {"id": 14, "stage": "3_days", "title": "Stollarga mehmonlarni joylashtirishni yakunlash", "category": "Seating", "completed": False, "priority": "high", "cost_est": "0"},

    # 4. Sarpo & An'analar
    {"id": 15, "stage": "sarpo", "title": "Kelin sarposi (Mebel, pardalar, idishlar)", "category": "Sarpo", "completed": True, "priority": "high", "cost_est": "45,000,000"},
    {"id": 16, "stage": "sarpo", "title": "Kuyov sarposi (To'n, qishki/yozgi liboslar)", "category": "Sarpo", "completed": True, "priority": "high", "cost_est": "15,000,000"},
    {"id": 17, "stage": "sarpo", "title": "Quda chaqiriq va Kelin salom hadyalari", "category": "Sovg'alar", "completed": False, "priority": "medium", "cost_est": "6,000,000"},
]

class AddTaskRequest(BaseModel):
    title: str
    stage: str = "30_days"
    category: str = "Umumiy"
    cost_est: Optional[str] = "0"
    priority: str = "medium"

@router.get("/tasks")
async def get_all_tasks():
    total = len(CHECKLIST_DATA)
    completed = sum(1 for t in CHECKLIST_DATA if t["completed"])
    progress_pct = round((completed / total) * 100, 1) if total > 0 else 0
    return {
        "status": "success",
        "total_tasks": total,
        "completed_tasks": completed,
        "remaining_tasks": total - completed,
        "progress_percent": progress_pct,
        "tasks": CHECKLIST_DATA,
    }

@router.post("/toggle/{task_id}")
async def toggle_task_completion(task_id: int):
    task = next((t for t in CHECKLIST_DATA if t["id"] == task_id), None)
    if not task:
        raise HTTPException(status_code=404, detail="Vazifa topilmadi")
    task["completed"] = not task["completed"]
    total = len(CHECKLIST_DATA)
    completed = sum(1 for t in CHECKLIST_DATA if t["completed"])
    return {
        "status": "success",
        "task_id": task_id,
        "completed": task["completed"],
        "completed_count": completed,
        "progress_percent": round((completed / total) * 100, 1),
    }

@router.post("/add")
async def add_new_task(data: AddTaskRequest):
    new_task = {
        "id": len(CHECKLIST_DATA) + 1,
        "stage": data.stage,
        "title": data.title,
        "category": data.category,
        "completed": False,
        "priority": data.priority,
        "cost_est": data.cost_est,
    }
    CHECKLIST_DATA.append(new_task)
    return {"status": "success", "task": new_task}
