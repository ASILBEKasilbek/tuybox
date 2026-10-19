from pydantic import BaseModel
from typing import List, Optional

class BudgetCategoryAllocation(BaseModel):
    category_slug: str
    category_name: str
    percentage: float
    allocated_amount: float
    recommended_vendor_count: int

class BudgetCalculationRequest(BaseModel):
    total_budget: float # Masalan: 100_000_000 UZS
    city: Optional[str] = "Toshkent"
    guest_count: Optional[int] = 300
    event_type: Optional[str] = "nikoh-toyi"

class BudgetCalculationResponse(BaseModel):
    total_budget: float
    city: str
    guest_count: int
    allocations: List[BudgetCategoryAllocation]
    tips: List[str]
