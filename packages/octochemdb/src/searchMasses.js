import { preprocessIonizations } from 'mf-utilities';

import { fetchJSON } from './utils/fetchJSON.js';
import { parseMasses } from './utils/parseMasses.js';

/**
 *
 * @param {object} [options={}]
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {number|string|number[]} [options.masses] - Observed fragment masses
 * @param {string} [options.mf] - Molecular formula of the non ionized molecule (not available for inSilicoFragments)
 * @param {number} [options.precision=100] - Precision (accuracy) of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.modifications=''] - Comma separated list of allowed modifications
 * @param {string} [options.route='massBank/v1/search'] - Route to use
 * @param {string} [options.link='https://massbank.eu/MassBank/RecordDisplay?id='] - Link to the database source
 */

export async function searchMasses(options = {}) {
  const {
    route = 'massBank/v1/search',
    baseURL = 'https://octochemdb.cheminfo.org/',
    precision = 100,
    limit = 1000,
    mf = '',
    link = '',
  } = options;

  if (route === '') {
    throw new Error('route is mandatory');
  }
  const realURL = new URL(route, baseURL).toString();
  const masses = parseMasses(options.masses);

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

    const { data: results } = await fetchJSON(realURL, searchParams);
    for (const result of results) {
      const modifiedResult = {
        ...result,
        modification,
      };
      if (link !== '') {
        modifiedResult.url = link + result._id;
      }
      allResults.push(modifiedResult);
    }
  }

  return allResults;
}
