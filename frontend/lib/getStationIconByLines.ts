// lib/getStationIconByLines.ts
export type StationMode = 'u' | 's' | 'rail' | 'bus' | 'ferry';
import L from 'leaflet';

const BUS = new Set(['bus', 'xpressbus', 'nachtbus', 'ast', 'fernbus']);
const RAIL = new Set(['re', 'rb', 'dpn', 'dpf', 'ice', 'a']); //TODO: create seperate A bahn icon

function tokenize(lines: string | string[]): string[] {
  if (Array.isArray(lines)) return lines;
  return lines.split(',').map(s => s.trim());
}

export function pickStationMode(lines: string | string[]): StationMode {
  const tokens = tokenize(lines).map(s => s.toLowerCase());

  if (tokens.includes('u')) return 'u';
  if (tokens.includes('s')) return 's';
  if (tokens.some(t => RAIL.has(t))) return 'rail';
  if (tokens.some(t => BUS.has(t))) return 'bus';
  if (tokens.includes('schiff')) return 'ferry';
  return 'rail';
}

export const uIcon = new L.Icon({ iconUrl: '/features/ubahn.png', iconSize: [42, 42] as [number, number] });
export const sIcon = new L.Icon({ iconUrl: '/features/sbahn.png', iconSize: [42, 42] as [number, number] });
export const stationIcon = new L.Icon({ iconUrl: '/features/station.png', iconSize: [42, 42] as [number, number] });
export const busIcon = new L.Icon({ iconUrl: '/features/busstop.png', iconSize: [42, 42] as [number, number] });

export function getStationIcon(lines: string | string[]) {
  switch (pickStationMode(lines)) {
    case 'u': return uIcon;
    case 's': return sIcon;
    case 'rail': return stationIcon;
    //case 'ferry': return ferryIcon;
    default: return busIcon;
  }
}

