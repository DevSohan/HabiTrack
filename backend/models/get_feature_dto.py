from typing import List, Union, Optional, Dict
from pydantic import BaseModel



class GreenSpaceDTO(BaseModel):
    gruenart: str
    geometry: Dict


class HospitalDTO(BaseModel):
    name: str
    geometry: Dict

class KindergartenDTO(BaseModel):
    name: str
    geometry: Dict

class NoiseDTO(BaseModel):
    klasse: str

class StationDTO(BaseModel):
    name: str
    lines: str



FeatureResultItem = Union[
    GreenSpaceDTO,
    HospitalDTO,
    KindergartenDTO,
    NoiseDTO,
    StationDTO
]


class FeatureResultResponse(BaseModel):
    street: str
    house_number: str
    zip_code: str
    city: str
    lat: float
    long: float
    feature: str
    results: List[FeatureResultItem]
