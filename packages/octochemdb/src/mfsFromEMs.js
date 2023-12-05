import { searchWithIonizations } from './utils/searchWithIonizations.js';

/**
 * Retrieve a list of molecular formulas from one or many monoisotopic mass that are present in pubchem compound.
 * in the database and a monoisotopic mass.
 * @param {number|string|number[]} masses - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {number} [options.precision=1000] - Precision (accuracy) of the monoisotopic mass in ppm
 * @param {string} [options.ranges=''] - Range of allowed molecular formula
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {number} [options.minCount=5] - Minimal number of molecules having a specific MF
 * @param {number} [options.fields] - Fields to retrieve from the database
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {string} [options.route='mfs/v1/fromEM'] - URL of the webservice
 * @param {string} [options.compoundsURL='mfs/v1/fromMF'] - URL to retrieve corresponding compounds
 */

export async function mfsFromEMs(masses, options = {}) {
  const {
    route = 'mfs/v1/fromEM',
    compoundsURL = 'compounds/v1/fromMF',
    baseURL = 'https://octochemdb.cheminfo.org/',
    minCount = 5,
  } = options;

  const realURL = new URL(route, baseURL).toString();

  const searchParams = {};
  searchParams.minCount = String(minCount);

  const entries = await searchWithIonizations({
    ...options,
    masses,
    realURL,
    searchParams,
  });

  const realCompoundsURL = new URL(compoundsURL, baseURL).toString();
  const searchParamsCompounds = new URLSearchParams();

  for (const entry of entries) {
    searchParamsCompounds.set('mf', String(entry._id));
    entry.compoundsURL = `${realCompoundsURL}?${searchParamsCompounds.toString()}`;
  }

  // because we can combine many ionizations we should resort the data
  entries.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));
  return entries;
}
