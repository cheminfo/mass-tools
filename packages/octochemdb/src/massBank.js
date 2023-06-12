import { preprocessIonizations } from 'mf-utilities';

import { fetchJSON } from './utils/fetchJSON.js';
import { parseMasses } from './utils/parseMasses.js';

/**
 * @param {object} [options={}]
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {number|string|number[]} [options.masses] - Observed fragment masses
 * @param {string} [options.mf] - Molecular formula of the non ionized molecule
 * @param {number} [options.precision=100] - Precision (accuracy) of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.modifications=''] - Comma
 * @param {string} [options.url='massBank/v1/fromMasses']
 */

export async function massBank(options = {}) {
  const {
    url = 'massBank/v1/search',
    baseURL = 'https://octochemdb.cheminfo.org/',
    precision = 100,
    limit = 1000,
    mf = '',
  } = options;

  const masses = parseMasses(options.masses);

  const realURL = new URL(url, baseURL).toString();

  const modifications = preprocessIonizations(options.modifications);
  const allResults = [];
  for (let modification of modifications) {
    const massShift = modification.em;
    const searchParams = {
      masses: masses.map((mass) => mass + massShift).join(','),
      precision,
      limit,
      mf,
    };

    const results = (await fetchJSON(realURL, searchParams)).data;
    results.forEach((result) => {
      allResults.push({
        ...result,
        modification,
        url: `https://massbank.eu/MassBank/RecordDisplay?id=${result._id}`,
      });
    });
  }

  return allResults;
}
