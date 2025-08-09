from fastapi import APIRouter, Query, HTTPException
from typing import List, Literal
from services.features_by_address import query_features_by_address_async
from models.get_feature_dto import FeatureResultResponse

router = APIRouter()

@router.get("/features_by_address/", response_model=FeatureResultResponse)
async def get_features_by_address(
    street: str,
    house_number: str,
    zip_code: str,
    city: str,
    search_feature: Literal["stations", "green_spaces", "noise_levels", "hospitals", "kindergartens"],
    search_radius: int = 1000
):
    print(street, house_number, zip_code, city, search_feature, search_radius)
    result = await query_features_by_address_async(
        street, house_number, zip_code, city, search_feature, search_radius
    )

    if not result:
        raise HTTPException(status_code=404, detail="No results found.")

    return result

