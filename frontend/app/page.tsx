'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';
import Tabs from '@/components/Tabs';
import AddressForm from '@/components/AddressForm';
import { Address } from '@/types';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

const DEFAULT_ADDRESS: Address = {
  street: 'Am Beckerkamp',
  house_number: '14',
  zip_code: '21031',
  city: 'Hamburg',
};

export default function HomePage() {
  const [featureType, setFeatureType] = useState<'green_spaces' | 'hospitals' | 'kindergartens' | 'noise_level' | 'stations'>('hospitals');
  const [address, setAddress] = useState<Address>(DEFAULT_ADDRESS);

  const handleAddressChange = (newAddress: Address) => setAddress(newAddress);

  const center = useMemo(() => ({ lat: 53.5488, long: 9.9873 }), []); // Hamburg fallback

  return (
    <main className="min-h-screen flex flex-col">
      <h1 className="text-2xl font-semibold bg-blue-500 text-white p-4">HabiTrack</h1>
      <Tabs selected={featureType} onSelect={setFeatureType} />
      <div className="relative">
        <AddressForm value={address} onChange={handleAddressChange} />
        <MapView featureType={featureType} address={address} fallbackCenter={center} />
      </div>
    </main>
  );
}