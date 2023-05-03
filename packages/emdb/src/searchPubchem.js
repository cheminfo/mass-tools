import { ELECTRON_MASS } from 'chemical-elements';
import { MF } from 'mf-parser';
import { getMsInfo, preprocessIonizations } from 'mf-utilities';

import { fetchJSON } from './util/fetchJSON.js';
import { getAllowedEMs } from './util/getAllowedEMs.js';
import { parseMassesAndMFs } from './util/parseMassesAndMFs.js';

/**
 * Generates a database 'pubchem' based on all molecular formula available
 * in the database and a monoisotopic mass.
 * @param {number|string|number[]} masses - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.databaseName='pubchem']
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {string} [options.ranges=''] -
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {number} [options.minPubchemEntries=5] - Minimal number of molecules having a specific MF
 * @param {string} [options.url='https://octochemdb.cheminfo.org/mfs/v1/fromEM'] - URL of the webservice
 */

export async function searchPubchem(originalMasses, options = {}) {
  const {
    url = 'https://octochemdb.cheminfo.org/mfs/v1/fromEM',
    precision = 1000,
    limit = 1000,
    minPubchemEntries = 5,
  } = options;

  const masses = parseMassesAndMFs({ masses: originalMasses });
  const allowedEMs = await getAllowedEMs({ ...options, masses }); // we prefer to use the exact mass rather than MF

  let promises = [];
  let ionizations = preprocessIonizations(options.ionizations);
  for (let mass of masses) {
    for (let ionization of ionizations) {
      let realMass =
        mass * Math.abs(ionization.charge || 1) -
        ionization.em +
        ELECTRON_MASS * ionization.charge;
      const pubchemURL = `${url}?em=${realMass}&precision=${precision}&limit=${limit}&minPubchemEntries=${minPubchemEntries}`;
      promises.push(fetchJSON(pubchemURL));
    }
  }

  let results = await Promise.all(promises);

  let mfs = [];
  for (let i = 0; i < results.length; i++) {
    for (const entry of results[i].data) {
      if (
        allowedEMs &&
        !allowedEMs.find((em) => Math.abs(em - entry.em) < 0.0000001)
      ) {
        continue;
      }
      try {
        let mfInfo = new MF(entry._id).getInfo();
        mfInfo.ionization = ionizations[i];
        mfInfo.em = mfInfo.monoisotopicMass;
        mfInfo.ms = getMsInfo(mfInfo, {
          targetMass: masses,
        }).ms;
        mfInfo.info = { nbPubchemEntries: entry.count };
        mfs.push(mfInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`${e}`);
      }
    }
  }
  // because we can combine many ionizations we should resort the data
  mfs.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));
  return mfs;
}
