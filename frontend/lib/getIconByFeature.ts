import L from 'leaflet';

const base = {
  iconSize: [28, 42] as [number, number],
  iconAnchor: [14, 42] as [number, number],
  popupAnchor: [0, -36] as [number, number],
  shadowUrl: '/leaflet/marker-shadow.png',
  shadowSize: [41, 41] as [number, number],
};

export const greenSpaceIcon = new L.Icon({ iconUrl: '/leaflet/green-space.png', ...base });
export const hospitalIcon   = new L.Icon({ iconUrl: '/leaflet/hospital.png',   ...base });
export const kindergartenIcon = new L.Icon({ iconUrl: '/leaflet/kindergarten.png', ...base });
export const noiseIcon      = new L.Icon({ iconUrl: '/leaflet/noise.png',      ...base });
export const stationIcon    = new L.Icon({ iconUrl: '/leaflet/station.png',    ...base });


export function getIconByFeature(featureType: string) {
    switch (featureType) {
      case 'green_spaces': return greenSpaceIcon;
      case 'hospitals': return hospitalIcon;
      case 'kindergartens': return kindergartenIcon;
      case 'noise_level': return noiseIcon;
      case 'stations': return stationIcon;
      default: return hospitalIcon;
    }
  }