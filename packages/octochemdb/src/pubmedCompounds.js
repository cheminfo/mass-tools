import { fetchJSON } from './utils/fetchJSON.js';
import { includeDBRefs } from './utils/includeDBRefs.js';

/**
 * Retrieve the compounds from a pubmedID
 * @param {string} pubmedID
 * @param {object} [options={}]
 * @param {string} [options.route='pubmeds/v1/id'] - relative URL of the webservice
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @returns
 */
export async function pubmedCompounds(pubmedID, options = {}) {
  const {
    route = 'pubmeds/v1/id',
    baseURL = 'https://octochemdb.cheminfo.org/',
    limit = 1000,
  } = options;

  const realURL = new URL(route, baseURL).toString();

  const searchParams = {
    id: pubmedID,
    fields: 'data.compounds',
    limit,
  };

  const { data: results } = await fetchJSON(realURL, searchParams);
  await includeDBRefs(results, { baseURL });
  return results.data.compounds;
}
