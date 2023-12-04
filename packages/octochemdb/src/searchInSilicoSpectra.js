import { MSComparator } from 'ms-spectrum';

import { fetchJSON } from './utils/fetchJSON.js';

/**
 *
 * @param {object} [options={}]
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {number|string|number[]} [options.masses] - Observed fragment masses
 * @param {string} [options.mf] - Molecular formula of the non ionized molecule (not available for inSilicoFragments)
 * @param {number} [options.precision=100] - Precision (accuracy) of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {number} [options.massPower=1000] - Maximal number of entries to return
 * @param {number} [options.massPower=3] - High power will give more weight to the mass. If you would prefer to observe fragments you should use a number less than 1
 * @param {number} [options.intensityPower=0.6] - How important is the intensity. By default we don't give to much importance to it
 * @param {string} [options.route='inSilicoFragments/v1/search'] - Route to use
 */

export async function searchInSilicoSpectra(spectrum, mf, options = {}) {
  const {
    route = 'inSilicoFragments/v1/search',
    baseURL = 'https://octochemdb.cheminfo.org/',
    precision = 100,
    limit = 1000,
    massPower = 3,
    intensityPower = 0.6,
  } = options;

  if (!route) {
    throw new Error('route is mandatory');
  }
  if (!mf) {
    throw new Error('mf is mandatory');
  }

  const realURL = new URL(route, baseURL).toString();

  const searchParams = {
    limit,
    mf,
  };

  const results = (await fetchJSON(realURL, searchParams)).data;

  const msComparator = new MSComparator({
    delta: (mass) => mass * 1e-6 * precision,
    massPower,
    intensityPower,
  });

  const finals = [];
  for (const result of results) {
    const similarity = msComparator.getSimilarityToMasses(
      spectrum,
      result.data.spectrum.data.x,
    );
    if (similarity > 0) {
      finals.push({
        similarity,
        data: result.data,
      });
    }
  }
  return finals;
}
