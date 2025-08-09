// fetchFeatures.ts
import { Address, FeatureResponse } from '@/types';

export async function fetchFeatures(featureType: string, address: Address, radius: number): Promise<FeatureResponse> {
  const params = new URLSearchParams({
    street: address.street,
    house_number: address.house_number,
    zip_code: address.zip_code,
    city: address.city,
    search_feature: featureType,
    search_radius: String(radius),
  });

  // Same-origin call -> Next.js will proxy to backend
  const res = await fetch(`/api/features_by_address?${params.toString()}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}
