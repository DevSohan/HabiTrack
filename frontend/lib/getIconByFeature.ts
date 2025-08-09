// lib/icons.ts
import L from 'leaflet';
export const base = { iconSize: [42, 42] as [number, number] };

export const greenSpaceIcon   = new L.Icon({ iconUrl: '/features/green-space.png',  ...base });
export const hospitalIcon     = new L.Icon({ iconUrl: '/features/hospital.png',     ...base });
export const kindergartenIcon = new L.Icon({ iconUrl: '/features/kindergarten.png', ...base });
export const noiseIcon        = new L.Icon({ iconUrl: '/features/noise.png',        ...base });
export const stationIcon      = new L.Icon({ iconUrl: '/features/station.png',      ...base });
export const homeIcon         = new L.Icon({ iconUrl: '/features/home.png',         ...base });
export const defaultIcon      = new L.Icon({ iconUrl: '/features/default.png',      ...base });

import { getStationIcon } from '@/lib/getStationIconByLines';

// New: allow passing station lines
export function getIconByFeature(
  featureType: string,
  opts?: { lines?: string | string[] }
) {
  if (featureType === 'stations' && opts?.lines) {
    return getStationIcon(opts.lines);
  }
  switch (featureType) {
    case 'green_spaces':  return greenSpaceIcon;
    case 'hospitals':     return hospitalIcon;
    case 'kindergartens': return kindergartenIcon;
    case 'noise_level':   return noiseIcon;
    case 'stations':      return stationIcon; // fallback if no lines provided
    case 'home':          return homeIcon;
    default:              return defaultIcon;
  }
}
