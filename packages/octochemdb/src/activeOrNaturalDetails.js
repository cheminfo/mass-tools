import { appendURLs } from './utils/appendURLs.js';
import { fetchJSON } from './utils/fetchJSON.js';
import { includeDBRefs } from './utils/includeDBRefs.js'
/**
 * Search for a specific natural or active compound using its ID
 * @param {object} [options={}]
 * @param {string} [options.fields='_id,data'] - List of fields to retrieve
 * @param {string} [options.url='activesOrNaturals/v1/id'] - URL of the webservice
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 */

export async function activeOrNaturalDetails(id, options = {}) {
  const {
    url = 'activesOrNaturals/v1/id',
    baseURL = 'https://octochemdb.cheminfo.org/',
    fields = '_id,data',
  } = options;

  const activeOrNatural = await fetchActiveOrNatural(id, {
    url: new URL(url, baseURL).toString(),
    fields,
  });

  await includeDBRefs(activeOrNatural, { baseURL })
  appendURLs(activeOrNatural)

  return activeOrNatural
}

async function fetchActiveOrNatural(id, options) {
  const { fields, url } = options;
  const searchParams = {}
  searchParams.id = id
  if (fields) {
    searchParams.fields = fields
  }
  return (await fetchJSON(url, searchParams)).data;
}
