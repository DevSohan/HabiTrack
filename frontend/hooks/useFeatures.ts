'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchFeatures } from '@/lib/fetchFeatures';
import { Address, FeatureResponse } from '@/types';

export const useFeatures = (featureType: string, address: Address, radius: number) => {
  return useQuery<FeatureResponse>({
    queryKey: ['features', featureType, address, radius],
    queryFn: () => fetchFeatures(featureType, address, radius),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
};