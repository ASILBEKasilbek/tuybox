from fastapi import APIRouter
from app.schemas.budget import BudgetCalculationRequest, BudgetCalculationResponse
from app.services.budget_ai import calculate_wedding_budget

router = APIRouter(prefix="/budget", tags=["AI To'y Byudjeti"])

@router.post("/calculate", response_model=BudgetCalculationResponse)
async def calculate_budget(request: BudgetCalculationRequest):
    """
    To'y byudjetini foizlar va toifalar bo'yicha aqlli taqsimlash.
    """
    data = calculate_wedding_budget(request.total_budget, request.guest_count or 300)
    return BudgetCalculationResponse(
        total_budget=data["total_budget"],
        city=request.city or "Toshkent",
        guest_count=data["guest_count"],
        allocations=data["allocations"],
        tips=data["tips"]
    )
