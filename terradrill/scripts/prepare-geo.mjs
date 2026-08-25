/**
 * Downloads Natural Earth 110m country polygons and trims them down to what
 * the globe actually needs — code, name, label point, geometry.
 *
 * Natural Earth ships ~100 properties per feature (names in 25 languages,
 * GDP, population, per-country map colours...). Dropping them takes the file
 * from ~819 KB to ~252 KB.
 *
 *   npm run geo
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const SOURCE =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';

const OUT = 'src/assets/geo/countries-110m.geojson';

const response = await fetch(SOURCE);
if (!response.ok) {
  throw new Error(`Download failed: ${response.status} ${response.statusText}`);
}

const source = await response.json();
const skipped = [];

const features = source.features
  .map((feature) => {
    const props = feature.properties;

    // ISO_A2 is the sentinel -99 for France, Norway and Kosovo, and CN-TW for
    // Taiwan. ISO_A2_EH carries a usable alpha-2 code for all of them.
    const code = String(props.ISO_A2_EH ?? '').toLowerCase();

    if (!code || code === '-99') {
      skipped.push(props.NAME);
      return null;
    }

    return {
      type: 'Feature',
      properties: {
        code,
        name: props.NAME,
        lat: props.LABEL_Y,
        lng: props.LABEL_X,
      },
      geometry: feature.geometry,
    };
  })
  .filter(Boolean);

await mkdir(dirname(OUT), { recursive: true });
await writeFile(OUT, JSON.stringify({ type: 'FeatureCollection', features }));

const kb = Math.round(Buffer.byteLength(JSON.stringify({ features })) / 1024);
console.log(`${features.length} features written to ${OUT} (~${kb} KB)`);
if (skipped.length) {
  console.log(`skipped (no ISO alpha-2): ${skipped.join(', ')}`);
}
