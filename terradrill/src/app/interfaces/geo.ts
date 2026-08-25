/** Trimmed Natural Earth feature — see scripts/prepare-geo.mjs. */
export interface CountryFeature {
  type: 'Feature';
  properties: {
    /** ISO 3166-1 alpha-2, lowercase — joins to Country.code. */
    code: string;
    name: string;
    /** Cartographer-placed label point; where the camera aims. */
    lat: number;
    lng: number;
  };
  geometry: unknown;
}

export interface CountryFeatureCollection {
  type: 'FeatureCollection';
  features: CountryFeature[];
}

export type GeoStatus = 'idle' | 'loading' | 'ready' | 'error';
