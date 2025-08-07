'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useFeatures } from '@/hooks/useFeatures';
import { Address, FeatureResponse } from '@/types';
import { getIconByFeature } from '@/lib/getIconByFeature';
import { LatLngBoundsLiteral } from 'leaflet';

function FitMapToData({ data }: { data: FeatureResponse | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const bounds = [
      [data.lat, data.long],
      ...data.results
        .filter(r => r.geometry?.type === 'Point' && Array.isArray(r.geometry.coordinates))
        .map(r => [r.geometry.coordinates[1], r.geometry.coordinates[0]]),
    ];

    if (bounds.length > 1) {
      map.fitBounds(bounds as LatLngBoundsLiteral, { padding: [50, 50] });
    } else {
      map.flyTo([data.lat, data.long], 13);
    }
  }, [data, map]);

  return null;
}

export default function MapView({ featureType, address, fallbackCenter }: { featureType: FeatureResponse['feature'] | 'green_spaces' | 'stations'; address: Address; fallbackCenter: { lat: number; long: number } }) {
  const { data, isLoading, isError } = useFeatures(featureType as string, address, 1000);

  const centerLat = data?.lat ?? fallbackCenter.lat;
  const centerLong = data?.long ?? fallbackCenter.long;

  const mapKey = `${featureType}-${address.street}-${address.house_number}-${address.zip_code}`;

  return (
    <div className="h-[100vh] w-full z-0">
      <MapContainer
        key={mapKey}
        center={[centerLat, centerLong]}
        zoom={13}
        className='w-full h-full'
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {/* Fit bounds on data change */}
        <FitMapToData data={data} />

        {/* Address marker */}
        {data && (
          <Marker position={[data.lat, data.long]}>
            <Popup>
              <div>
                <div><strong>Address</strong></div>
                <div>{data.street} {data.house_number}, {data.zip_code} {data.city}</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Result markers */}
        {!isLoading && !isError && data?.results?.map((r, i) => (
          r.geometry?.type === 'Point' && Array.isArray(r.geometry.coordinates) ? (
            <Marker
              key={`${r.name}-${i}`}
              position={[r.geometry.coordinates[1], r.geometry.coordinates[0]]}
              icon={getIconByFeature(featureType as string)}
            >
              <Popup>
                <strong>{r.name}</strong>
              </Popup>
            </Marker>
          ) : null
        ))}
      </MapContainer>
    </div>
  );
}