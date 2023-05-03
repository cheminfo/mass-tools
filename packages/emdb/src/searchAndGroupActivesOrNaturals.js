import { searchActivesOrNaturals } from './searchActivesOrNaturals.js';

/**
 * Search for natural or active compounds and group them by molecular formula
 * @param {object} [options={}]
 * @param {number|string|number[]} [options.masses] - Observed monoisotopic mass
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string} [options.ranges=''] - Allows to filter by a range of molecular formula
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {string} [options.fields='data.ocl,data.em,data.mf'] - List of fields to retrieve
 * @param {string} [options.kwTaxonomies=''] - Comma separated list of taxonomies family, genus or species of the product source
 * @param {string} [options.kwActiveAgainst=''] - Comma separated list of taxonomies family, genus or species of the bioactivity target
 * @param {string} [options.kwBioassays=''] - Comma separated list of keyword from the description of the bioassay
 * @param {string} [options.kwMeshTerms=''] - Comma separated list of keyword from the medline MeshTerms
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.url='https://octochemdb.cheminfo.org/activesOrNaturals/v1/search'] - URL of the webservice
 */

export async function searchAndGroupActivesOrNaturals(options = {}) {
  // TODO remove data.bioActive when rename will be completed: https://github.com/cheminfo/octochemdb/issues/101
  const fields = `${options.fields},data.mf,data.em,data.nbPatents,data.nbPubmeds,data.nbActivities,data.bioActive,data.bioactive,data.nbMassSpectra,data.naturalProduct`;

  const entries = await searchActivesOrNaturals({ ...options, fields });

  // we will now group the data per mf
  const grouped = {};
  for (const entry of entries) {
    if (!grouped[entry.data.mf]) {
      grouped[entry.data.mf] = {
        mf: entry.data.mf,
        em: entry.mfInfo.em,
        ms: entry.mfInfo.ms,
        nbNaturals: 0,
        nbBioactives: 0,
        nbPatents: 0,
        nbPubmeds: 0,
        nbMassSpectra: 0,
      };
    }
    const currentGroup = grouped[entry.data.mf];

    if (entry.data.naturalProduct) currentGroup.nbNaturals++;
    // TODO remove data.bioActive when rename will be completed: https://github.com/cheminfo/octochemdb/issues/101
    if (entry.data.bioActive) currentGroup.nbBioactives++;
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
