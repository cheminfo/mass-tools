
import { fetchJSON } from './utils/fetchJSON.js';
import { includeDBRefs } from './utils/includeDBRefs.js';

/**
 * Retrieve the compounds from a pubmedID
 * @param {string} pubmedID
 * @param {object} [options={}]
 * @param {string} [options.url='pubmeds/v1/id'] - relative URL of the webservice
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 * @returns
 */
export async function pubmedCompounds(pubmedID, options = {}) {
  const {
    url = 'pubmeds/v1/id',
    baseURL = 'https://octochemdb.cheminfo.org/',
  } = options;

  const realURL = new URL(url, baseURL).toString();

  const searchParams = {
    id: pubmedID,
    fields: 'data.compounds'
  };

  const result = (await fetchJSON(realURL, searchParams)).data;
  await includeDBRefs(result, { baseURL });
  return result.data.compounds
}
