import { TestBed } from '@angular/core/testing';
import { GameService } from './game.service';
import { CountryService } from './country-service';
import { Country } from '../interfaces/country.interface';

describe('GameService', () => {
  let service: GameService;
  let countryService: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameService);
    countryService = TestBed.inject(CountryService);
  });

  describe('shuffleOptions', () => {
    const options = (): Country[] => countryService.all().slice(0, 4);

    it('returns the same items, just reordered', () => {
      const input = options();
      const codes = (list: Country[]) => list.map((c) => c.code).sort();
      expect(codes(service.shuffleOptions(input))).toEqual(codes(input));
    });

    it('keeps the length', () => {
      expect(service.shuffleOptions(options()).length).toBe(4);
    });

    it('does not mutate the array it is given', () => {
      const input = options();
      const before = input.map((c) => c.code);
      service.shuffleOptions(input);
      expect(input.map((c) => c.code)).toEqual(before);
    });

    it('handles empty and single-item arrays', () => {
      expect(service.shuffleOptions([])).toEqual([]);
      const one = options().slice(0, 1);
      expect(service.shuffleOptions(one)).toEqual(one);
    });

    it('lands the first item in every position across many shuffles', () => {
      const input = options();
      const target = input[0].code;
      const hits = [0, 0, 0, 0];

      for (let n = 0; n < 2000; n++) {
        hits[service.shuffleOptions(input).findIndex((c) => c.code === target)]++;
      }

      // ~500 each; a wide floor keeps this from flaking while still
      // catching an unshuffled or cyclic-only implementation.
      hits.forEach((count) => expect(count).toBeGreaterThan(200));
    });
  });

  describe('pickOptions', () => {
    it('returns 4 unique countries including the answer', () => {
      const answer = countryService.byCode('nz')!;
      const result = service.pickOptions(answer);

      expect(result.length).toBe(4);
      expect(new Set(result.map((c) => c.code)).size).toBe(4);
      expect(result.some((c) => c.code === 'nz')).toBe(true);
    });

    it('never repeats the answer as a distractor', () => {
      const answer = countryService.byCode('fr')!;

      for (let n = 0; n < 200; n++) {
        const result = service.pickOptions(answer);
        expect(result.filter((c) => c.code === 'fr').length).toBe(1);
      }
    });

    it('leaves the country list intact', () => {
      const before = countryService.count();
      service.pickOptions(countryService.byCode('jp')!);
      expect(countryService.count()).toBe(before);
    });
  });

  describe('pickRandomCountry', () => {
    it('never repeats until the pool is exhausted', () => {
      const total = countryService.count();
      const seen = new Set<string>();

      for (let n = 0; n < total; n++) {
        seen.add(service.pickRandomCountry().code);
      }

      expect(seen.size).toBe(total);
    });

    it('refills the pool once every country has been asked', () => {
      const total = countryService.count();

      for (let n = 0; n < total; n++) {
        service.pickRandomCountry();
      }

      expect(service.pickRandomCountry()).toBeTruthy();
    });
  });

  describe('validate', () => {
    it('accepts the matching country', () => {
      const target = countryService.byCode('br')!;
      expect(service.validate(target, target)).toBe(true);
    });

    it('rejects a different country', () => {
      expect(
        service.validate(countryService.byCode('br')!, countryService.byCode('ar')!),
      ).toBe(false);
    });
  });
});
