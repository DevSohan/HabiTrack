import { Address, FeatureResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export async function fetchFeatures(featureType: string, address: Address, radius: number): Promise<FeatureResponse> {
  const params = new URLSearchParams({
    street: address.street,
    house_number: address.house_number,
    zip_code: address.zip_code,
    city: address.city,
    search_feature: featureType,
    search_radius: radius.toString(),
  });

  const url = `${API_BASE}/features_by_address/?${params.toString()}`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}