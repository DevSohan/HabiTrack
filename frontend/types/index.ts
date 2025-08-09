import { LatLngExpression } from "leaflet";

export interface Address {
    street: string;
    house_number: string;
    zip_code: string;
    city: string;
  }
  
  export interface FeaturePointGeometry {
    type: 'Point' | "Polygon" | 'MultiPolygon';
    coordinates: LatLngExpression | LatLngExpression[]; // [lon, lat]
  }

  type GreenSpace = {
    gruenart: string;
  }

  type Hospital = {
    name: string
  }

  type Kindergarten = {
    name: string;
  }

  type Noise = {
    klasse: string;
  }

  type Station = {
    name: string;
    lines: string;
  }

  type FeatureTypes = GreenSpace | Hospital | Kindergarten | Noise | Station
  
  export type FeatureResult  = {
    geometry: FeaturePointGeometry;
  } & FeatureTypes
  
  export interface FeatureResponse {
    street: string;
    house_number: string;
    zip_code: string;
    city: string;
    lat: number;
    long: number;
    feature: 'green_spaces' | 'hospitals' | 'kindergartens' | 'noise_levels' | 'stations' | string;
    results: FeatureResult[];
  }