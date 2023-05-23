import { appendURLs } from './utils/appendURLs.js';
import { includeDBRefs } from './utils/includeDBRefs.js';
import { parseMasses } from './utils/parseMasses.js';
import { searchWithIonizations } from './utils/searchWithIonizations.js';

/**
 * Search for natural or active compounds using various criteria
 * @param {object} [options={}]
 * @param {number|string|number[]} [options.masses] - Observed monoisotopic mass
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string} [options.ranges=''] - Allows to filter by a range of molecular formula
 * @param {string} [options.mf=''] - Search by molecular formula
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {string} [options.fields] - List of fields to retrieve
 * @param {string} [options.kwTaxonomies=''] - Comma separated list of taxonomies family, genus or species of the product source
 * @param {string} [options.kwActiveAgainst=''] - Comma separated list of taxonomies family, genus or species of the bioactivity target
 * @param {string} [options.kwBioassays=''] - Comma separated list of keyword from the description of the bioassay
 * @param {string} [options.kwMeshTerms=''] - Comma separated list of keyword from the medline MeshTerms
 * @param {string} [options.minNbMassSpectra] - Minimal number of mass spectra
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.url='activesOrNaturals/v1/search'] - URL of the webservice
 * @param {string[]|undefined} [options.includes] - Array of DBref collections to include
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 */

export async function activesOrNaturals(options = {}) {
  const {
    url = 'activesOrNaturals/v1/search',
    baseURL = 'https://octochemdb.cheminfo.org/',
    includes,
  } = options;

  const realURL = new URL(url, baseURL).toString();

  const searchParams = prepareSearchParams(options);

  const masses = parseMasses(options.masses || [0]);

  const entries = await searchWithIonizations({
    ...options,
    masses,
    realURL,
    searchParams,
  });

  if (options.includes) {
    await includeDBRefs(entries, { baseURL, collections: includes });
  }
  appendURLs(entries);

  return entries;
}

function prepareSearchParams(options) {
  const {
    kwTaxonomies,
    kwActiveAgainst,
    kwBioassays,
    kwMeshTerms,
    mf,
    minNbMassSpectra,
  } = options;
  const searchParams = {};
  if (kwTaxonomies) {
    searchParams.kwTaxonomies = kwTaxonomies;
  }
  if (kwActiveAgainst) {
    searchParams.kwActiveAgainst = kwActiveAgainst;
  }
  if (kwBioassays) {
    searchParams.kwBioassays = kwBioassays;
  }
  if (kwMeshTerms) {
    searchParams.kwMeshTerms = kwMeshTerms;
  }
  if (mf) {
    searchParams.mf = mf;
  }
  if (minNbMassSpectra) {
    searchParams.minNbMassSpectra = minNbMassSpectra;
  }
  return searchParams;
}
