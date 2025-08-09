import type { FeatureResult } from '@/types';

export function hasName(f: FeatureResult): f is FeatureResult & { name: string } {
  return 'name' in f && typeof f.name === 'string';
}

export function hasKlasse(f: FeatureResult): f is FeatureResult & { klasse: string } {
  return 'klasse' in f && typeof f.klasse === 'string';
}

export function hasGruenart(f: FeatureResult): f is FeatureResult & { gruenart: string } {
  return 'gruenart' in f && typeof f.gruenart === 'string';
}
