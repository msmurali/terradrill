/** Flag artwork by ISO 3166-1 alpha-2 code, served by flagcdn.com. */
export const flagUrl = (code: string | undefined): string =>
  code ? `https://flagcdn.com/${code.toLowerCase()}.svg` : '';
