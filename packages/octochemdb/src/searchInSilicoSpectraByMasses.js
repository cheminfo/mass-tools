import { MSComparator } from 'ms-spectrum';

import { searchWithIonizations } from './utils/searchWithIonizations.js';

/**
 * @param {object} spectrum - The experimental spectrum to compare to
 * @param {number|string|number[]} [masses] - List of experimental monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {string} [options.mf] - Molecular formula of the non ionized molecule (not available for inSilicoFragments)
 * @param {number} [options.precision=100] - Precision (accuracy) of the monoisotopic mass in ppm
 * @param {string} [options.ionizations="H+"] - Comma separated list of allowed ionizations
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {number} [options.massPower=1000] - Maximal number of entries to return
 * @param {number} [options.massPower=3] - High power will give more weight to the mass. If you would prefer to observe fragments you should use a number less than 1
 * @param {number} [options.intensityPower=0.6] - How important is the intensity. By default we don't give to much importance to it
 * @param {string} [options.route='inSilicoFragments/v1/search'] - Route to use
 */

export async function searchInSilicoSpectraByMasses(
  spectrum,
  masses,
  options = {},
) {
  const {
    route = 'inSilicoFragments/v1/search',
    baseURL = 'https://octochemdb.cheminfo.org/',
    precision = 100,
    limit = 10000,
    massPower = 3,
    intensityPower = 0.6,
    ionizations = 'H+',
  } = options;

  if (!route) {
    throw new Error('route is mandatory');
  }
  if (!masses) {
    throw new Error('masses is mandatory');
  }

  const realURL = new URL(route, baseURL).toString();

  let results = await searchWithIonizations({
    precision,
    realURL,
    masses,
    limit,
    ionizations,
  });

  const msComparator = new MSComparator({
    delta: (mass) => mass * 1e-6 * precision,
    massPower,
    intensityPower,
  });

  const finals = [];

  // filter MDMA
  // results = results.filter(result => result.data.ocl.idCode === 'dg~D@MBdie]v\\kahHBjh@@')

  for (const result of results) {
    const similarity = msComparator.getSimilarityToMasses(
      spectrum,
      result.data.spectrum.data.x,
    );
    if (similarity >= 0) {
      finals.push({
        ...result,
        similarity,
      });
    }
  }
  finals.sort((a, b) => b.similarity - a.similarity);
  return finals;
}
