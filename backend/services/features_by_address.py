import psycopg2
import psycopg2.extras
import asyncio
from typing import Optional, List

from db.connection import get_connection
from utils.geocode_address import geocode_address

from services.query_helpers import query_nearby_async, make_nearby_query, query_nearby
from models.get_feature_dto import StationDTO, GreenSpaceDTO, HospitalDTO, KindergartenDTO, NoiseDTO, RestaurantDTO, FeatureResultResponse

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
        "green_spaces": ["gruenart"],
        "hospitals": ["name"],
        "kindergartens": ["name"],
        "noise_levels": ["klasse"],
        "stations": ["name", "lines", "lineshortcat"],
        "restaurants": ["name", "amenity", "cuisine"]
    }

    if feature not in column_map:
        return None  # or raise HTTPException

    sql = make_nearby_query(feature, column_map[feature], search_radius)
    print(sql)
    print(point_wkt)
    rows = query_nearby(sql, point_wkt)
    # map to DTOs
    if feature == "green_spaces":
        items = [
            GreenSpaceDTO(gruenart=row[0], geometry=row[1])
            for row in rows
            if row[0] is not None
        ]
    elif feature == "hospitals":
        items = [HospitalDTO(name=row[0], geometry=row[1]) for row in rows]
    elif feature == "kindergartens":
        items = [KindergartenDTO(name=row[0], geometry=row[1]) for row in rows]
    elif feature == "noise_levels":
        items = [NoiseDTO(klasse=row[0], geometry=row[1]) for row in rows]
    elif feature == "stations":
        print(rows)
        items = [StationDTO(name=row[0], lines=row[1], lineshortcat=row[2], geometry=row[3]) for row in rows]
    elif feature == "restaurants":
        print(rows)
        items = [RestaurantDTO(name=row[0], amenity=row[1], cuisine=row[2], geometry=row[3]) for row in rows]
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