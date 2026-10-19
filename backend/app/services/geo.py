from math import radians, cos, sin, asin, sqrt
from typing import Optional

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Yer yuzasida ikki nuqta orasidagi masofani (km) Haversine formulasi orqali hisoblash.
    """
    R = 6371.0 # Yer radiusi kilometrda

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    distance = R * c
    return round(distance, 2)
