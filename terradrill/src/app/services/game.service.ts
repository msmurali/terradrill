import { Injectable, signal } from '@angular/core';
import { CountryService } from './country-service';
import { Country } from '../interfaces/country.interface';
import { randomNumberGenerator } from '../utils/random-number.util';

@Injectable({ providedIn: 'root' })
export class GameService {
  private countries = signal<Country[]>([]);
  private strike = signal(0);
  private score = signal(0);
  private total = signal(0);

  constructor(private countryService: CountryService) {
    this.loadCountries();
  }

  loadCountries() {
    this.countries.set(this.countryService.all());
  }

  pickRandomCountry(): Country {
    if (this.countries().length === 0) {
      this.loadCountries();
    }

    const index = randomNumberGenerator(0, this.countries().length - 1);
    const country = this.countries()[index];
    this.countries.update((curr) => curr.filter((_, i) => i !== index));

    return country;
  }

  pickOptions(pickedCountry: Country) {
    const options = [pickedCountry];
    const remainingCountries = this.countryService
      .all()
      .filter((c) => c.code !== pickedCountry.code);

    for (let i = 0; i < 3; i++) {
      const index = randomNumberGenerator(0, remainingCountries.length - 1);
      options.push(remainingCountries[index]);
      remainingCountries.splice(index, 1);
    }

    return this.shuffleOptions(options);
  }

  /** Fisher-Yates */
  shuffleOptions(options: Country[]): Country[] {
    const shuffled = [...options];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = randomNumberGenerator(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  validate(answer: Country, target: Country) {
    return answer.code === target.code;
  }
}
