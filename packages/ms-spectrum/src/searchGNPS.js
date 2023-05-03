import { fetchJSON } from 'emdb';
import { preprocessIonizations } from 'mf-utilities';

/**
 * Generates a database 'pubchem' based on all molecular formula available
 * in the database and a monoisotopic mass.
 * @param {number|string|number[]} masses - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.modifications=''] - Comma
 * @param {string} [options.url='https://octochemdb.cheminfo.org/mfs/v1/fromEM'] - URL of the webservice
 */

export async function searchGNPS(masses, options = {}) {
  const {
    url = 'https://octochemdb.cheminfo.org/gnps/v1/fromMasses',
    precision = 100,
    limit = 1000,
  } = options;

  const modifications = preprocessIonizations(options.modifications);
  const allResults = [];
  for (let modification of modifications) {
    const massShift = modification.em;
    const searchParams = new URLSearchParams({
      masses: masses.map((mass) => mass + massShift).join(','),
      precision,
      limit,
    }).toString();

    const results = (await fetchJSON(`${url}?${searchParams}`)).data;
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
