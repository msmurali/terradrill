import { Injectable, computed, signal } from '@angular/core';
import { CountryFeature, CountryFeatureCollection, GeoStatus } from '../interfaces/geo';

const GEO_URL = 'assets/geo/countries-110m.geojson';

@Injectable({ providedIn: 'root' })
export class GeoService {
  private readonly _features = signal<CountryFeature[]>([]);
  private readonly _status = signal<GeoStatus>('idle');

  readonly features = this._features.asReadonly();
  readonly status = this._status.asReadonly();

  readonly byCode = computed(
    () => new Map(this._features().map((f) => [f.properties.code, f])),
  );

  /** Codes with drawable geometry at this resolution — the globe-mode pool. */
  readonly renderableCodes = computed(
    () => new Set(this._features().map((f) => f.properties.code)),
  );

  /** Safe to call repeatedly; only the first call fetches. */
  async load(): Promise<void> {
    if (this._status() === 'loading' || this._status() === 'ready') return;

    this._status.set('loading');

    try {
      const response = await fetch(GEO_URL);
      if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
      }

      const data = (await response.json()) as CountryFeatureCollection;
      this._features.set(data.features);
      this._status.set('ready');
    } catch {
      this._features.set([]);
      this._status.set('error');
    }
  }

  retry(): Promise<void> {
    this._status.set('idle');
    return this.load();
  }
}
