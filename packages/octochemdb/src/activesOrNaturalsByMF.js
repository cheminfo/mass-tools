import { activesOrNaturals } from './activesOrNaturals.js';

/**
 * Search for natural or active compounds and group them by molecular formula
 * @param {object} [options={}]
 * @param {number|string|number[]} [options.masses] - Observed monoisotopic mass
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string} [options.ranges=''] - Allows to filter by a range of molecular formula
 * @param {number} [options.precision=1000] - Precision (accuracy) of the monoisotopic mass in ppm
 * @param {string} [options.fields='data.noStereoOcl,data.em,data.mf'] - List of fields to retrieve
 * @param {string} [options.kwTaxonomies=''] - Comma separated list of taxonomies family, genus or species of the product source
 * @param {string} [options.kwActiveAgainst=''] - Comma separated list of taxonomies family, genus or species of the bioactivity target
 * @param {string} [options.kwBioassays=''] - Comma separated list of keyword from the description of the bioassay
 * @param {string} [options.kwMeshTerms=''] - Comma separated list of keyword from the medline MeshTerms
 * @param {string} [options.kwTitles=''] - Comma separated list of keyword from compound title
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.url='activesOrNaturals/v1/search'] - URL of the webservice
 * @param {string} [options.baseURL='https://octochemdb.cheminfo.org/'] - URL of the webservice
 */

export async function activesOrNaturalsByMF(options = {}) {
  const fields =
    'data.noStereoOcl,data.mf,data.em,data.nbPatents,data.nbPubmeds,data.nbActivities,data.bioactive,data.nbMassSpectra,data.naturalProduct'.split(
      ',',
    );
  if (options.fields) fields.push(...options.fields.split(/[ ,]+/));

  const entries = await activesOrNaturals({
    ...options,
    fields: fields.join(','),
  });
  // we will now group the data per mf
  const grouped = {};
  for (const entry of entries) {
    if (!grouped[entry.data.mf]) {
      grouped[entry.data.mf] = {
        mfInfo: entry.mfInfo,
        ms: entry.ms,
        ionization: entry.ionization,
        nbNaturals: 0,
        nbBioactives: 0,
        nbPatents: 0,
        nbPubmeds: 0,
        nbMassSpectra: 0,
      };
    }
    const currentGroup = grouped[entry.data.mf];

    if (entry.data.naturalProduct) currentGroup.nbNaturals++;
    if (entry.data.bioactive) currentGroup.nbBioactives++;
    if (entry.data.nbMassSpectra) {
      currentGroup.nbMassSpectra += entry.data.nbMassSpectra;
    }
    if (entry.data.nbPubmeds) currentGroup.nbPubmeds += entry.data.nbPubmeds;
    if (entry.data.nbPatents) currentGroup.nbPatents += entry.data.nbPatents;
  }

  const groupedArray = Object.keys(grouped).map((key) => grouped[key]);
  // because we can combine many ionizations we should resort the data
  groupedArray.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));

  return groupedArray;
}
