import { ELECTRON_MASS } from 'chemical-elements';
import { MF } from 'mf-parser';
import { getMsInfo, preprocessIonizations } from 'mf-utilities';

import { parseMassesAndMFs } from './util/parseMassesAndMFs.js';
import { fetchJSON } from './util/fetchJSON.js';
import { getAllowedEMs } from './util/getAllowedEMs.js';

/**
 * Search for natural or active compounds using various criteria
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

export async function searchActivesOrNaturals(options = {}) {
  const {
    url = 'https://octochemdb.cheminfo.org/activesOrNaturals/v1/search',
    limit = 1000,
  } = options;

  const masses = parseMassesAndMFs(options);
  const allowedEMs = await getAllowedEMs({ ...options, masses }); // we prefer to use the exact mass rather than MF
  let ionizations = preprocessIonizations(options.ionizations);
  const searchParams = prepareSearchParams(options);

  let promises = [];
  for (let mass of masses) {
    for (let ionization of ionizations) {
      let realMass =
        mass * Math.abs(ionization.charge || 1) -
        ionization.em +
        ELECTRON_MASS * ionization.charge;
      searchParams.set('em', String(realMass));
      const pubchemURL = `${url}?${searchParams.toString()}`;
      promises.push(fetchJSON(pubchemURL));
    }
  }

  let results = await Promise.all(promises);

  let entries = [];
  for (let i = 0; i < results.length; i++) {
    for (let entry of results[i].data) {
      // would it be more efficient to filter later ???
      if (
        allowedEMs &&
        !allowedEMs.find((em) => Math.abs(em - entry.data.em) < 0.0000001)
      ) {
        continue;
      }
      try {
        let mfInfo = new MF(entry.data.mf).getInfo();
        mfInfo.ionization = ionizations[i];
        mfInfo.em = mfInfo.monoisotopicMass; // required to calculate getMsInfo
        mfInfo.ms = getMsInfo(mfInfo, {
          targetMass: masses,
        }).ms;

        entry.mfInfo = {
          ionization: ionizations[i],
          em: mfInfo.monoisotopicMass,
          ms: mfInfo.ms,
          unsaturation: mfInfo.unsaturation,
          atoms: mfInfo.atoms,
          charge: mfInfo.charge,
        };
        entries.push(entry);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`${e}`);
      }
    }
  }

  if (entries.length > limit) {
    entries.length = limit;
  }

  return entries;
}

function prepareSearchParams(options) {
  const {
    kwTaxonomies,
    kwActiveAgainst,
    kwBioassays,
    kwMeshTerms,
    limit = 1000,
    fields = 'data.ocl,data.em,data.mf',
    precision = 100,
  } = options;
  const searchParams = new URLSearchParams();
  if (kwTaxonomies) {
    searchParams.set('kwTaxonomies', kwTaxonomies);
  }
  if (kwActiveAgainst) {
    searchParams.set('kwActiveAgainst', kwActiveAgainst);
  }
  if (kwBioassays) {
    searchParams.set('kwBioassays', kwBioassays);
  }
  if (kwMeshTerms) {
    searchParams.set('kwMeshTerms', kwMeshTerms);
  }
  if (limit) {
    searchParams.set('limit', limit);
  }
  if (precision) {
    searchParams.set('precision', precision);
  }
  searchParams.set('fields', fields);
  return searchParams;
}
