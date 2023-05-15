import { ELECTRON_MASS } from 'chemical-elements';
import { MF } from 'mf-parser';
import { getMsInfo, preprocessIonizations } from 'mf-utilities';

import { fetchJSON } from './utils/fetchJSON.js';
import { getAllowedEMs } from './utils/getAllowedEMs.js';
import { parseMassesAndMFs } from './utils/parseMassesAndMFs.js';

/**
 * Retrieve a list of molecular formulas from one or many monoisotopic mass that are present in pubchem compound.
 * in the database and a monoisotopic mass.
 * @param {number|string|number[]} originalMasses - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {string} [options.ranges=''] - Range of allowed molecular formula
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {number} [options.minCount=5] - Minimal number of molecules having a specific MF
 * @param {string} [options.url='https://octochemdb.cheminfo.org/mfs/v1/fromEM'] - URL of the webservice
 */

export async function mfsFromEM(originalMasses, options = {}) {
  const {
    url = 'https://octochemdb.cheminfo.org/mfs/v1/fromEM',
    precision = 100,
    limit = 1000,
    minCount = 5,
    ranges,
  } = options;

  let ionizations = preprocessIonizations(options.ionizations);
  const masses = parseMassesAndMFs({ masses: originalMasses });

  // if we have ranges we need to filter the allowed EMs
  const allowedEMs = await getAllowedEMs({
    ranges,
    masses,
    precision,
    ionizations,
  });

  const promises = [];

  const searchParams = new URLSearchParams();
  searchParams.set('precision', String(precision));
  searchParams.set('limit', String(limit));
  searchParams.set('minCount', String(minCount));

  for (let ionization of ionizations) {
    for (let mass of masses) {
      const realMass =
        mass * Math.abs(ionization.charge || 1) -
        ionization.em +
        ELECTRON_MASS * ionization.charge;
      searchParams.set('em', String(realMass));
      promises.push(fetchJSON(`${url}?${searchParams.toString()}`));
    }
  }

  const mfs = [];
  const results = await Promise.all(promises);
  let counter = 0;
  for (const result of results) {
    const ionization = ionizations[Math.floor(counter / masses.length)];
    const targetMass = masses[counter % masses.length];
    counter++;
    for (const entry of result.data) {
      if (
        allowedEMs &&
        !allowedEMs.find((em) => Math.abs(em - entry.data.em) < 0.0000001)
      ) {
        continue;
      }
      try {
        entry.mfInfo = new MF(entry._id).getInfo({
          emFieldName: 'em',
          msemFieldName: 'msem'
        });
        entry.ionization = ionization;
        entry.ms = getMsInfo(entry.mfInfo, {
          targetMass,
          ionization,
        }).ms;
        mfs.push(entry);
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
