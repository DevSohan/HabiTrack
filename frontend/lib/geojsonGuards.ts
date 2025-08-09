import type { Geometry, Point, Polygon, MultiPolygon } from 'geojson';

export const isPoint = (g: Geometry): g is Point => g.type === 'Point';
export const isPolygon = (g: Geometry): g is Polygon => g.type === 'Polygon';
export const isMultiPolygon = (g: Geometry): g is MultiPolygon => g.type === 'MultiPolygon';
