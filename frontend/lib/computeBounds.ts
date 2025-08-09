// lib/computeBounds.ts
import L, { LatLngBounds } from 'leaflet';
import type { Point, Polygon, MultiPolygon, Position, Geometry } from 'geojson';
import { FeatureResponse } from '@/types';

export function computeBounds(data: FeatureResponse): LatLngBounds {
  const seed = L.latLng(data.lat, data.long);
  const bounds = L.latLngBounds(seed, seed);

  for (const r of data.results ?? []) {
    const g = r.geometry as Geometry | undefined;
    if (!g) continue;

    if (g.type === 'Point') {
      const [lng, lat] = (g as Point).coordinates as Position;
      bounds.extend(L.latLng(lat, lng));
    } else if (g.type === 'Polygon') {
      const coords = (g as Polygon).coordinates;          // number[][][]
      for (const ring of coords) {
        for (const [lng, lat] of ring) bounds.extend(L.latLng(lat, lng));
      }
    } else if (g.type === 'MultiPolygon') {
      const coords = (g as MultiPolygon).coordinates;     // number[][][][]
      for (const poly of coords) {
        for (const ring of poly) {
          for (const [lng, lat] of ring) bounds.extend(L.latLng(lat, lng));
        }
      }
    }
  }

  return bounds;
}
