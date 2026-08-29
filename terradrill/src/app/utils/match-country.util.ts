import { Country } from '../interfaces/country.interface';

/** Spoken forms the recogniser returns that don't match the official name. */
const ALIASES: Record<string, string> = {
  usa: 'united states',
  us: 'united states',
  america: 'united states',
  uk: 'united kingdom',
  britain: 'united kingdom',
  'great britain': 'united kingdom',
  england: 'united kingdom',
  holland: 'netherlands',
  burma: 'myanmar',
  swaziland: 'eswatini',
  'ivory coast': "cote d'ivoire",
  'cape verde': 'cabo verde',
  'east timor': 'timor leste',
  'czech republic': 'czechia',
  uae: 'united arab emirates',
  drc: 'dr congo',
  'south korea': 'south korea',
  'north korea': 'north korea',
  vatican: 'vatican city',
};

/**
 * Lowercase, strip accents and punctuation, drop filler words. "the Dominican
 * Republic" and "Dominican Republic" both collapse to "dominican republic".
 */
const normalize = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\b(the|of)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** The option the transcript names, if any. */
export const matchCountry = (
  transcript: string,
  options: Country[],
): Country | undefined => {
  const spoken = normalize(transcript);
  if (!spoken) return undefined;

  const resolved = normalize(ALIASES[spoken] ?? spoken);

  return options.find((option) => {
    const name = normalize(option.name);
    // Accept a phrase containing the name — recognisers pad with filler.
    return name === resolved || resolved.includes(name);
  });
};
