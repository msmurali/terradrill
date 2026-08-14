import { Injectable, computed, signal } from '@angular/core';
import { COUNTRIES } from '../core/countries';
import { Country } from '../interfaces/country.interface';

/** Widths flagcdn.com serves; 640 is enough for the flag card at 2x. */
const FLAG_WIDTH = 640;

@Injectable({ providedIn: 'root' })
export class CountryService {
  private readonly countries = signal<Country[]>(COUNTRIES);

  readonly all = this.countries.asReadonly();
  readonly count = computed(() => this.countries().length);

  private readonly byCodeMap = computed(
    () => new Map(this.countries().map((c) => [c.code, c])),
  );

  byCode(code: string): Country | undefined {
    return this.byCodeMap().get(code.toLowerCase());
  }

  flagUrl(country: Country | string): string {
    const code = typeof country === 'string' ? country : country.code;
    return `https://flagcdn.com/w${FLAG_WIDTH}/${code.toLowerCase()}.png`;
  }
}
