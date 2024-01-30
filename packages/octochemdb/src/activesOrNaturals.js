import { appendURLs } from './utils/appendURLs.js';
import { includeDBRefs } from './utils/includeDBRefs.js';
import { parseMasses } from './utils/parseMasses.js';
import { searchWithIonizations } from './utils/searchWithIonizations.js';

/**
 * Search for natural or active compounds using various criteria
 * @param {object} [options={}]
 * @param {number|string|number[]} [options.masses] - Observed monoisotopic mass
 * @param {string} [options.noStereoTautomerID=''] - ID of the compound to search from the results
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string} [options.ranges=''] - Allows to filter by a range of molecular formula
 * @param {string} [options.mf=''] - Search by molecular formula
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {string} [options.fields] - List of fields to retrieve
 * @param {string} [options.kwTaxonomies=''] - Comma separated list of taxonomies family, genus or species of the product source
 * @param {string} [options.kwActiveAgainst=''] - Comma separated list of taxonomies family, genus or species of the bioactivity target
 * @param {string} [options.kwBioassays=''] - Comma separated list of keyword from the description of the bioassay
 * @param {string} [options.kwMeshTerms=''] - Comma separated list of keyword from the medline MeshTerms
 * @param {string} [options.kwTitles=''] - Comma separated list of keyword from the compound title
 * @param {string} [options.minNbMassSpectra] - Minimal number of mass spectra
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.route='activesOrNaturals/v1/search'] - Route to this specific webservice
 * @param {string[]|undefined} [options.includes] - Array of DBref collections to include
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - Base URL of the webservice
 */

export async function activesOrNaturals(options = {}) {
  const {
    route = 'activesOrNaturals/v1/search',
    baseURL = 'https://octochemdb.cheminfo.org/',
    includes,
  } = options;

  const realURL = new URL(route, baseURL).toString();

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

  entries.sort((a, b) => {
    if (a.data.nbMassSpectra > b.data.nbMassSpectra) return -1;
    if (a.data.nbMassSpectra < b.data.nbMassSpectra) return 1;
    if (a.data.nbPubmeds > b.data.nbPubmeds) return -1;
    if (a.data.nbPubmeds < b.data.nbPubmeds) return 1;
    if (a.data.nbPatents > b.data.nbPatents) return -1;
    if (a.data.nbPatents < b.data.nbPatents) return 1;
    return 0;
  });

  return entries;
}

function prepareSearchParams(options) {
  const {
    noStereoTautomerID,
    kwTaxonomies,
    kwActiveAgainst,
    kwBioassays,
    kwMeshTerms,
    kwTitles,
    mf,
    minNbMassSpectra,
  } = options;
  const searchParams = {};
  if (noStereoTautomerID) {
    searchParams.noStereoTautomerID = noStereoTautomerID;
  }
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
  if (kwTitles) {
    searchParams.kwTitles = kwTitles;
  }
  if (mf) {
    searchParams.mf = mf;
  }
  if (minNbMassSpectra) {
    searchParams.minNbMassSpectra = minNbMassSpectra;
  }
  return searchParams;
}
