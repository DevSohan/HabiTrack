import type { PathOptions } from 'leaflet';
import type { FeatureResult } from '@/types';
import { hasKlasse } from '@/lib/featureGuards';

export function getPathOptionsByKlasse(f: FeatureResult): PathOptions {
    if (hasKlasse(f)) {
        switch (f.klasse) {
          case '>= 75 dB(A)':
            return { color: '#800000', weight: 2 }; // dark red
          case '70 - 75 dB(A)':
            return { color: '#B22222', weight: 2 }; // firebrick red
          case '65 - 70 dB(A)':
            return { color: '#FF4500', weight: 2 }; // orange-red
          case '60 - 65 dB(A)':
            return { color: '#FFA500', weight: 2 }; // orange
          case '55 - 60 dB(A)':
            return { color: '#FFFF00', weight: 2 }; // yellow
          default:
            return { color: '#808080', weight: 2 }; // gray for unknown
        }
      }
      return { color: '#800080', weight: 2 }; // purple fallback for non-noise
    }
