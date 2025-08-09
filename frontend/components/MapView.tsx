"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { useFeatures } from "@/hooks/useFeatures";
import { Address, FeatureResponse } from "@/types";
import { getIconByFeature } from "@/lib/getIconByFeature";
import { LatLngTuple } from "leaflet";
import { computeBounds } from "@/lib/computeBounds";
import { Polygon as LPolygon } from "react-leaflet";
import type { Geometry, Position } from "geojson";
import { isPoint, isPolygon, isMultiPolygon } from "@/lib/geojsonGuards";
import { getFeatureLabel } from "@/lib/getFeatureLabel";
import { getPathOptionsByKlasse } from "@/lib/getPathOptionsByKlasse";

function FitMapToData({ data }: { data: FeatureResponse | undefined }) {
  const map = useMap();

  useEffect(() => {
    if (!data) return;

    const b = computeBounds(data);
    if (b.isValid()) {
      map.flyToBounds(b, { padding: [50, 50], maxZoom: 16 });
    } else {
      map.setView([data.lat, data.long], 13);
    }
  }, [data, map]);

  return null;
}

export default function MapView({
  featureType,
  address,
  fallbackCenter,
}: {
  featureType: FeatureResponse["feature"] | "green_spaces" | "stations";
  address: Address;
  fallbackCenter: { lat: number; long: number };
}) {
  const { data, isLoading, isError } = useFeatures(
    featureType as string,
    address,
    1000
  );

  const centerLat = data?.lat ?? fallbackCenter.lat;
  const centerLong = data?.long ?? fallbackCenter.long;

  const mapKey = `${featureType}-${address.street}-${address.house_number}-${address.zip_code}`;
  const toLatLng = ([lng, lat]: Position): LatLngTuple => [lat, lng];

  console.log(data);

  return (
    <div className="h-[100vh] w-full z-0">
      <MapContainer
        key={mapKey}
        center={[centerLat, centerLong]}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <FitMapToData data={data} />

        {data && (
          <Marker
            position={[data.lat, data.long]}
            icon={getIconByFeature("home")}
          >
            <Popup>
              <div>
                <div>
                  <strong>Address</strong>
                </div>
                <div>
                  {data.street} {data.house_number}, {data.zip_code} {data.city}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {!isLoading &&
          !isError &&
          data?.results?.flatMap((r, i) => {
            const g = r.geometry as Geometry | undefined;
            if (!g) return [];

            if (isPoint(g)) {
              const [lng, lat] = g.coordinates;
              return (
                <Marker
                  key={`marker-${i}`}
                  position={[lat, lng]}
                  icon={getIconByFeature(featureType, {
                    // @ts-ignore: Unreachable code error
                    lines: r.lineshortcat,
                  })}
                >
                  <Popup>
                    <strong>{getFeatureLabel(r)}</strong>
                  </Popup>
                </Marker>
              );
            }

            if (isPolygon(g)) {
              const rings = g.coordinates.map((ring) => ring.map(toLatLng)); // LatLngTuple[][]
              return (
                <LPolygon
                  key={`polygon-${i}`}
                  pathOptions={getPathOptionsByKlasse(r)}
                  positions={rings}
                >
                  <Popup>
                    <strong>{getFeatureLabel(r)}</strong>
                  </Popup>
                </LPolygon>
              );
            }

            if (isMultiPolygon(g)) {
              return g.coordinates.map((poly, pi) => {
                const rings = poly.map((ring) => ring.map(toLatLng)); // LatLngTuple[][]
                return (
                  <LPolygon
                    key={`multipolygon-${i}-${pi}`}
                    pathOptions={{ color: "green" }}
                    positions={rings}
                  >
                    <Popup>
                      <strong>{getFeatureLabel(r)}</strong>
                    </Popup>
                  </LPolygon>
                );
              });
            }

            return [];
          })}
      </MapContainer>
    </div>
  );
}
