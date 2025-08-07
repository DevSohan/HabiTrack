export interface Address {
    street: string;
    house_number: string;
    zip_code: string;
    city: string;
  }
  
  export interface FeaturePointGeometry {
    type: 'Point';
    coordinates: [number, number]; // [lon, lat]
  }
  
  export interface FeatureResult {
    name: string;
    geometry: FeaturePointGeometry;
  }
  
  export interface FeatureResponse {
    street: string;
    house_number: string;
    zip_code: string;
    city: string;
    lat: number;
    long: number;
    feature: 'green_spaces' | 'hospitals' | 'kindergartens' | 'noise_level' | 'stations' | string;
    results: FeatureResult[];
  }