/**
 * This method will retrieve similar mass spectra
 * @param {object} [options={}]
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {number|string|number[]} [options.masses] - Observed monoisotopic mass
 * @param {number} [options.precision=1000] - Precision (accuracy) of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.modifications=''] - Comma
 * @param {('massBank'|'gnps'|'inSilicoFragments')[]} [options.databases=['massBank','gnps']] - List of databases to search for mass spectra
 * @param {object} [options.routes] - Object that contains the routes to use for each database
 * @param {boolean} [options.uniqueMolecules=true] - If true, only one molecule per entry is returned
 * @param {object} [options.similarity={}]
 * @param {number} [options.similarity.nbPeaks=5] - Number of peaks to use for the similarity
 * @param {number} [options.similarity.massPower=1] - Power to use for the mass
 * @param {number} [options.similarity.minSimilarity=0.2] - Minimal similarity to return
 * @param {number} [options.similarity.intensityPower=0.6] - Power to use for the intensity
 * @param {number} [options.similarity.minNbCommonPeaks=0] - Minimal number of common peaks
 * @param {{x:number[],y:number[]}} [options.similarity.experimental=[]] - Experimental mass spectra to compare to
 *
 */

import { MSComparator } from 'ms-spectrum';

import { searchMasses } from './searchMasses.js';

const defaultRoutes = [
  {
    name: 'massBank',
    url: 'https://octochemdb.cheminfo.org/massBank/v1/search',
    link: 'https://massbank.eu/MassBank/RecordDisplay?id=',
  },
  {
    name: 'gnps',
    url: 'https://octochemdb.cheminfo.org/gnps/v1/search',
    link: 'https://gnps.ucsd.edu/ProteoSAFe/gnpslibraryspectrum.jsp?SpectrumID=',
  },
  {
    name: 'inSilicoFragments',
    url: 'https://octochemdb.cheminfo.org/inSilicoFragments/v1/search',
  },
];

export async function massSpectra(options = {}) {
  const {
    uniqueMolecules = true,
    databases = ['massBank', 'gnps'],
    routes = defaultRoutes,
  } = options;
  const promises = [];
  for (const route of routes) {
    if (databases && databases.includes(route.name)) {
      promises.push(
        searchMasses({
          ...options,
          route: route.url,
          link: route.link,
        }).then((entries) =>
          entries.map((entry) => ({ ...entry, database: route.name })),
        ),
      );
    }
  }
  const allResults = await Promise.all(promises);
  let results = allResults.flat();
  results = appendAndFilterSimilarity(results, options);
  if (uniqueMolecules) {
    results = uniqueMol(results);
  }
  return results;
}

export function uniqueMol(results) {
  const unique = {};
  for (const result of results) {
    const ocl = result.data?.ocl;
    // massBank / GNPS entries carry a real structure `idCode`; in-silico
    // fragment entries only carry the no-stereo-tautomer id, so fall back to it
    // (otherwise every in-silico result is dropped here).
    const key = ocl?.idCode || ocl?.noStereoTautomerID;
    if (!key) continue;
    if (!unique[key]) {
      unique[key] = result;
    }
  }
  return Object.values(unique);
}

export function appendAndFilterSimilarity(results, options = {}) {
  const { similarity } = options;
  if (!similarity || !similarity.experimental) return results;

  const {
    experimental,
    nbPeaks = 5,
    massPower = 1,
    minSimilarity = 0.2,
    intensityPower = 0.6,
    minNbCommonPeaks = 0,
  } = similarity;

  const precision = Number(options.precision) / 1e6;
  const comparator = new MSComparator({
    nbPeaks,
    massPower,
    intensityPower,
    delta: (mass) => mass * precision,
    minNbCommonPeaks,
  });
  const scored = [];
  for (const result of results) {
    const data = result.data?.spectrum?.data;
    if (!data?.x?.length) continue;
    // In-silico fragment spectra list predicted m/z with no intensity (`y`):
    // score them by mass overlap with `getSimilarityToMasses`, which borrows the
    // experimental peak's intensity for each matched mass. `getSimilarity` would
    // call `y.slice()` on the missing intensity and throw. Real reference
    // spectra (massBank / GNPS) carry intensities, so use the full weighted
    // cosine. A fresh `{ x, y }` gives the comparator a distinct cache key.
    result.similarity = data.y
      ? comparator.getSimilarity(experimental, { x: data.x, y: data.y })
      : comparator.getSimilarityToMasses(experimental, data.x);
    if (result.similarity.cosine >= minSimilarity) scored.push(result);
  }
  scored.sort((a, b) => b.similarity.cosine - a.similarity.cosine);
  return scored;
}
