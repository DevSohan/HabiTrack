import { FeatureResult } from "@/types";
import { hasGruenart, hasKlasse, hasName } from "./featureGuards";

export function getFeatureLabel(f: FeatureResult): string {
    if (hasName(f)) return f.name;
    if (hasKlasse(f)) return f.klasse;
    if (hasGruenart(f)) return f.gruenart;
    return 'Unknown';
  }