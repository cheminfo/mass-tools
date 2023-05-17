import { preprocessIonizations } from 'mf-utilities';

import { fetchJSON } from './utils/fetchJSON.js';

/**
 * Generates a database 'pubchem' based on all molecular formula available
 * in the database and a monoisotopic mass.
 * @param {number|string|number[]} masses - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.modifications=''] - Comma
 * @param {string} [options.url='gnps/v1/fromMasses']
 */

export async function gnps(masses, options = {}) {
  const {
    url = 'gnps/v1/fromMasses',
    baseURL = 'https://octochemdb.cheminfo.org/',
    precision = 100,
    limit = 1000,
  } = options;

  const realURL = new URL(url, baseURL).toString();

  const modifications = preprocessIonizations(options.modifications);
  const allResults = [];
  for (let modification of modifications) {
    const massShift = modification.em;
    const searchParams = ({
      masses: masses.map((mass) => mass + massShift).join(','),
      precision,
      limit,
    }).toString();

    const results = (await fetchJSON(realURL, searchParams)).data;
    results.forEach((result) => {
      allResults.push({
        ...result,
        modification,
        link: `https://gnps.ucsd.edu/ProteoSAFe/gnpslibraryspectrum.jsp?SpectrumID=${result.id}`,
      });
    });
  }

  return allResults;
}
