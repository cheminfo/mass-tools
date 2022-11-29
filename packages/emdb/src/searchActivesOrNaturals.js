import { ELECTRON_MASS } from 'chemical-elements/src/constants';
import { findMFs } from 'mf-finder';
import { MF } from 'mf-parser';
import { getMsInfo } from 'mf-utilities/src/getMsInfo';
import { preprocessIonizations } from 'mf-utilities/src/preprocessIonizations';

import { fetchJSON } from './util/fetchJSON.js';

/**
 * Generates a database 'pubchem' based on all molecular formula available
 * in the database and a monoisotopic mass.
 * @param {number|string|number[]} masses - Observed monoisotopic mass
 * @param {object} [options={}]
 * @param {string} [options.databaseName='pubchem']
 * @param {string} [options.ionizations=''] - string containing a comma separated list of modifications
 * @param {string} [options.ranges=''] -
 * @param {number} [options.precision=1000] - Precision of the monoisotopic mass in ppm
 * @param {number} [options.limit=1000] - Maximal number of entries to return
 * @param {string} [options.url='https://pubchem.cheminfo.org/activesOrNaturals/v1/fromEM'] - URL of the webservice
 */

export async function searchNaturalOrBioactive(masses, options = {}) {
  const {
    url = 'https://pubchem.cheminfo.org/activesOrNaturals/v1/fromEM',
    precision = 1000,
    limit = 1000,
    ranges = '',
  } = options;

  if (typeof masses === 'number') {
    masses = [masses];
  }
  if (typeof masses === 'string') {
    masses = masses.split(/[\r\n\t,; ]+/).map(Number);
  }
  let promises = [];
  let ionizations = preprocessIonizations(options.ionizations);

  let allowedEMs; // we prefer to use the exact mass rather than MF
  if (ranges) {
    const allowedEMsArray = [];
    for (let mass of masses) {
      (
        await findMFs(mass, {
          ionizations: options.ionizations,
          precision,
          ranges,
          limit: 100000,
        })
      ).mfs.forEach((mf) => allowedEMsArray.push(mf.em));
    }
    allowedEMs = Float64Array.from(allowedEMsArray).sort();
  }

  for (let mass of masses) {
    for (let ionization of ionizations) {
      let realMass =
        mass * Math.abs(ionization.charge || 1) -
        ionization.em +
        ELECTRON_MASS * ionization.charge;

      const pubchemURL = `${url}?em=${realMass}&precision=${precision}&limit=${limit}`;
      promises.push(fetchJSON(pubchemURL));
    }
  }

  let results = await Promise.all(promises);
  let mfs = [];
  for (let i = 0; i < results.length; i++) {
    for (let mf of results[i].data) {
      try {
        // would it be more efficient to filter later ???
        if (
          allowedEMs &&
          !allowedEMs.find((em) => Math.abs(em - mf.data.em) < 0.0000001)
        ) {
          continue;
        }

        let mfInfo = new MF(mf.data.mf).getInfo();
        mfInfo.ionization = ionizations[i];
        mfInfo.em = mfInfo.monoisotopicMass;
        mfInfo.ms = getMsInfo(mfInfo, {
          targetMass: masses,
        }).ms;

        const info = mf.data;
        info.idCode = mf.id;

        delete info.em;
        delete info.charge;
        delete info.unsaturation;
        delete info.mf;

        mfInfo.info = mf.data;
        mfs.push(mfInfo);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`${e}`);
      }
    }
  }

  // we will now group the data per mf
  const grouped = {};
  for (const mf of mfs) {
    if (!grouped[mf.mf]) {
      grouped[mf.mf] = {
        mf: mf.mf,
        em: mf.em,
        ms: mf.ms,
        molecules: [],
        nbNatural: 0,
        nbBioactive: 0,
        nbPubmed: 0,
        nbWithMassSpectra: 0,
      };
    }
    grouped[mf.mf].molecules.push(mf);

    if (mf.info.naturalProduct) grouped[mf.mf].nbNatural++;
    if (mf.info.bioActive) grouped[mf.mf].nbBioactive++;
    if (mf.info.nbMassSpectra) grouped[mf.mf].nbWithMassSpectra++;
    if (mf.info.pubmeds && mf.info.pubmeds.length > 0) {
      grouped[mf.mf].nbPubmed++;
    }
  }

  const groupedArray = Object.keys(grouped).map((key) => grouped[key]);
  // because we can combine many ionizations we should resort the data
  groupedArray.sort((a, b) => Math.abs(a.ms.ppm) - Math.abs(b.ms.ppm));

  return groupedArray;
}
