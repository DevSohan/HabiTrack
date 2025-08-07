'use client';

import { Address } from '@/types';
import { useState } from 'react';

export default function AddressForm({ value, onChange }: { value: Address; onChange: (a: Address) => void }) {
  const [localAddress, setLocalAddress] = useState<Address>(value);

  const handleInputChange = (field: keyof Address) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAddress(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSearch = () => {
    onChange(localAddress);
  };

  return (
    <div className="flex flex-col gap-2 p-4 bg-white w-64 rounded-md absolute top-3 right-3 z-[999]">
      <input
        className="w-full rounded-md border-2 border-gray-300 p-2"
        placeholder="Street"
        value={localAddress.street}
        onChange={handleInputChange('street')}
      />
      <input
        className="w-full rounded-md border-2 border-gray-300 p-2"
        placeholder="House No"
        value={localAddress.house_number}
        onChange={handleInputChange('house_number')}
      />
      <input
        className="w-full rounded-md border-2 border-gray-300 p-2"
        placeholder="ZIP"
        value={localAddress.zip_code}
        onChange={handleInputChange('zip_code')}
      />
      <input
        className="w-full rounded-md border-2 border-gray-300 p-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder="City"
        value="Hamburg"
        disabled
      />
      <button
        className="w-full rounded-md border-gray-300 p-2 bg-blue-500 text-white"
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
  );
}