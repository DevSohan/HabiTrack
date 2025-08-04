import certifi
import ssl

import geopy.geocoders
from geopy.geocoders import Nominatim

ctx = ssl.create_default_context(cafile=certifi.where())
geopy.geocoders.options.default_ssl_context = ctx

def geocode_address(street: str, house: str, zip_code: str, city: str):
    geolocator = Nominatim(user_agent="geoapi", scheme='http')
    address = f"{street} {house}, {zip_code} {city}"
    location = geolocator.geocode(address)
    if location:
        return location.latitude, location.longitude
    return None
