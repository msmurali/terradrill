import { TestBed } from '@angular/core/testing';
import { CountryService } from './country-service';

describe('CountryService', () => {
  let service: CountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountryService);
  });

  it('holds 195 countries', () => {
    expect(service.count()).toBe(195);
  });

  it('has no duplicate codes or names', () => {
    const all = service.all();
    expect(new Set(all.map((c) => c.code)).size).toBe(all.length);
    expect(new Set(all.map((c) => c.name)).size).toBe(all.length);
  });

  it('uses lowercase two-letter codes throughout', () => {
    expect(service.all().every((c) => /^[a-z]{2}$/.test(c.code))).toBe(true);
  });

  it('looks up by code, case-insensitively', () => {
    expect(service.byCode('nz')?.name).toBe('New Zealand');
    expect(service.byCode('NZ')?.name).toBe('New Zealand');
    expect(service.byCode('zz')).toBeUndefined();
  });

  it('builds a flag url from a country or a code', () => {
    const nz = service.byCode('nz')!;
    expect(service.flagUrl(nz)).toBe('https://flagcdn.com/w640/nz.png');
    expect(service.flagUrl('DO')).toBe('https://flagcdn.com/w640/do.png');
  });
});
