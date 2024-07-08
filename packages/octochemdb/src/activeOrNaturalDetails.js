import { appendURLs } from './utils/appendURLs.js';
import { fetchJSON } from './utils/fetchJSON.js';
import { includeDBRefs } from './utils/includeDBRefs.js';
import { normalizeActivities } from './utils/normalizeActivities.js';
/**
 * Search for a specific natural or active compound using its ID
 * @param {object} [options={}]
 * @param {string} [options.fields='_id,data'] - List of fields to retrieve
 * @param {string} [options.route='activesOrNaturals/v1/id'] - URL of the webservice
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 */

export async function activeOrNaturalDetails(id, options = {}) {
  const {
    route = 'activesOrNaturals/v1/id',
    baseURL = 'https://octochemdb.cheminfo.org/',
    fields = '_id,data',
  } = options;

  const activeOrNatural = await fetchActiveOrNatural(id, {
    url: new URL(route, baseURL).toString(),
    fields,
  });

  await includeDBRefs(activeOrNatural, { baseURL });
  ensureArray(activeOrNatural);
  appendURLs(activeOrNatural);
  normalizeActivities(activeOrNatural);

  return activeOrNatural;
}

function ensureArray(activeOrNatural) {
  if (!activeOrNatural.data.activities) {
    activeOrNatural.data.activities = [];
  }
  if (!activeOrNatural.data.pubmeds) {
    activeOrNatural.data.pubmeds = [];
  }
  if (!activeOrNatural.data.patents) {
    activeOrNatural.data.patents = [];
  }
  if (!activeOrNatural.data.taxonomies) {
    activeOrNatural.data.taxonomies = [];
  }
}

async function fetchActiveOrNatural(id, options) {
  const { fields, url } = options;
  const searchParams = {};
  searchParams.id = id;
  if (fields) {
    searchParams.fields = fields;
  }
  const results = await fetchJSON(url, searchParams);
  return results.data;
}
