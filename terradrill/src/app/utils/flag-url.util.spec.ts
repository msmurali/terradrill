import { flagUrl } from './flag-url.util';

describe('flagUrl', () => {
  it('builds a url from a code', () => {
    expect(flagUrl('nz')).toBe('https://flagcdn.com/nz.svg');
  });

  it('lowercases the code', () => {
    expect(flagUrl('DO')).toBe('https://flagcdn.com/do.svg');
  });

  it('returns an empty string for a missing code', () => {
    expect(flagUrl(undefined)).toBe('');
  });
});
