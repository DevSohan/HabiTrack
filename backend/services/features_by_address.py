import psycopg2
import psycopg2.extras
import asyncio
from typing import Optional, List

from db.connection import get_connection
from utils.geocode_address import geocode_address

from services.query_helpers import query_nearby_async, make_nearby_query, query_nearby
from models.get_feature_dto import StationDTO, GreenSpaceDTO, HospitalDTO, KindergartenDTO, NoiseDTO, FeatureResultResponse

async def query_features_by_address_async(
    street: str,
    house_number: str,
    zip_code: str,
    city: str,
    feature: str,
    search_radius: int
) -> Optional[FeatureResultResponse]:
    print(feature)
    coords = geocode_address(street, house_number, zip_code, city)
    if not coords:
        return None

    lat, lon = coords
    point_wkt = f"SRID=4326;POINT({lon} {lat})"

    column_map = {
        "green_spaces": ["DISTINCT gruenart"],
        "hospital": ["name"],
        "kita": ["name"],
        "noise_level": ["DISTINCT klasse"],
        "station": ["name", "lines"]
    }

    if feature not in column_map:
        return None  # or raise HTTPException

    sql = make_nearby_query(feature, column_map[feature], search_radius)
    rows = query_nearby(sql, point_wkt)
    print(rows)
    # map to DTOs
    if feature == "green_spaces":
        items = [
            GreenSpaceDTO(gruenart=row[0])
            for row in rows
            if row[0] is not None
        ]
    elif feature == "hospital":
        items = [HospitalDTO(name=row[0], geometry=row[1]) for row in rows]
    elif feature == "kita":
        items = [KindergartenDTO(name=row[0], geometry=row[1]) for row in rows]
    elif feature == "noise_level":
        items = [NoiseDTO(klasse=row[0]) for row in rows]
    elif feature == "station":
        items = [StationDTO(name=row[0], lines=row[1]) for row in rows]
    else:
        items = []
    print(items)
    return FeatureResultResponse(
        street=street,
        house_number=house_number,
        zip_code=zip_code,
        city=city,
        lat=lat,
        long=lon,
        feature=feature,
        results=items
    )