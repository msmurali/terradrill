import { Injectable, computed, signal } from '@angular/core';
import { COUNTRIES } from '../core/countries';
import { Country } from '../interfaces/country.interface';

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
}
